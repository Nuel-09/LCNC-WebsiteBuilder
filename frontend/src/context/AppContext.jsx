/**
 * AppContext - Central State Management for the application shell.
 *
 * Responsibilities:
 * - Authentication session state
 * - Project list and selected project
 * - Project management actions (create, update, delete)
 * - Shared loading and status message state
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import {
//   createProject,
//   deleteProject,
//   projectApi.getProjects,
//   updateProject,
// } from "../services/projectsService";
import authApi from "@/services/authService";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import projectApi from "@/services/projectsService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // JWT token is persisted so users remain logged in after refresh.
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const error = searchParams.get("error");

  // User profile payload returned by backend auth endpoints.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  // Projects and selected project state.
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem("selectedProjectId") ?? "",
  );

  // Shared UX state surfaced in the top bar.
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  function persistSession(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);

    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
  }

  function clearSession() {
    setToken("");
    setUser(null);
    setProjects([]);
    setSelectedProjectId("");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProjectId");
  }

  async function loadProjects(currentToken = token) {
    if (!currentToken) return;

    const result = await projectApi.getProjects();
    setProjects(result);

    // Keep prior selection if still valid, otherwise fall back to first project.
    if (result.length === 0) {
      setSelectedProjectId("");
      localStorage.removeItem("selectedProjectId");
      return;
    }

    const stillExists = result.some(
      (project) => project.id === selectedProjectId,
    );
    const nextSelectedProjectId = stillExists
      ? selectedProjectId
      : result[0].id;
    setSelectedProjectId(nextSelectedProjectId);
    localStorage.setItem("selectedProjectId", nextSelectedProjectId);
  }

  async function authenticate(mode, payload) {
    setIsLoading(true);

    try {
      const result =
        mode === "signup"
          ? await authApi.signup(payload)
          : await authApi.login(payload);

      persistSession(result.token, result.user);
      await loadProjects(result.token);
      toast.success(`Welcome ${result.user.email}`);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewProject(payload) {
    if (!token) return;

    setIsLoading(true);
    const toastId = toast.loading("Creating project...");

    try {
      const created = await projectApi.createProject(payload);
      if (!created) return;
      const nextProjects = [created, ...projects];
      setProjects(nextProjects);
      setSelectedProjectId(created.id);
      localStorage.setItem("selectedProjectId", created.id);
      toast.success(`Project created: ${created.projectName}`);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  async function updateExistingProject(projectId, payload) {
    if (!token || !projectId) return;

    setIsLoading(true);
    const toastId = toast.loading("Updating project...");

    try {
      const updated = await projectApi.updateProject(projectId, payload);
      if (!updated) return;
      setProjects((previous) =>
        previous.map((project) =>
          project.id === projectId ? updated : project,
        ),
      );
      toast.success(`Project updated: ${updated.projectName}`);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  async function deleteExistingProject(projectId) {
    if (!token || !projectId) return;

    setIsLoading(true);
    const toastId = toast.loading("Deleting project...");

    try {
      await projectApi.deleteProject(projectId);

      const nextProjects = projects.filter(
        (project) => project.id !== projectId,
      );
      setProjects(nextProjects);

      if (selectedProjectId === projectId) {
        const fallbackProjectId = nextProjects[0]?.id ?? "";
        setSelectedProjectId(fallbackProjectId);

        if (fallbackProjectId) {
          localStorage.setItem("selectedProjectId", fallbackProjectId);
        } else {
          localStorage.removeItem("selectedProjectId");
        }
      }

      toast.success("Project deleted");
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  async function refreshProjects() {
    if (!token) return;

    setIsLoading(true);
    const toastId = toast.loading("Refreshing projects...");

    try {
      await loadProjects(token);
      toast.success("Projects refreshed");
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  function selectProject(projectId) {
    setSelectedProjectId(projectId);

    if (projectId) {
      localStorage.setItem("selectedProjectId", projectId);
      return;
    }

    localStorage.removeItem("selectedProjectId");
  }

  function logout() {
    clearSession();
  }

  useEffect(() => {
    async function hydrateSession() {
      if (!token) return;

      try {
        setIsLoading(true);
        await loadProjects(token);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession();
  }, [token]);

  useEffect(() => {
    if (error) {
      toast.error("Session expired. Please log in again.");
      // Remove error param from URL using nav
      const params = new URLSearchParams(window.location.search);
      params.delete("error");
      nav(
        window.location.pathname +
          (params.toString() ? "?" + params.toString() : ""),
        { scroll: false },
      );
    }
  }, [error]);

  const value = {
    token,
    user,
    projects,
    selectedProjectId,
    selectedProject,
    isLoading,
    authenticate,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    refreshProjects,
    selectProject,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
