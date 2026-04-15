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
import { login, signup } from "../services/authService";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectsService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // JWT token is persisted so users remain logged in after refresh.
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");

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
  const [message, setMessage] = useState("Ready");

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

    const result = await getProjects(currentToken);
    setProjects(result);

    // Keep prior selection if still valid, otherwise fall back to first project.
    if (result.length === 0) {
      setSelectedProjectId("");
      localStorage.removeItem("selectedProjectId");
      return;
    }

    const stillExists = result.some((project) => project.id === selectedProjectId);
    const nextSelectedProjectId = stillExists ? selectedProjectId : result[0].id;
    setSelectedProjectId(nextSelectedProjectId);
    localStorage.setItem("selectedProjectId", nextSelectedProjectId);
  }

  async function authenticate(mode, payload) {
    setIsLoading(true);
    setMessage("Authenticating...");

    try {
      const result =
        mode === "signup" ? await signup(payload) : await login(payload);

      persistSession(result.token, result.user);
      await loadProjects(result.token);
      setMessage(`Welcome ${result.user.email}`);
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewProject(payload) {
    if (!token) return;

    setIsLoading(true);
    setMessage("Creating project...");

    try {
      const created = await createProject(token, payload);
      const nextProjects = [created, ...projects];
      setProjects(nextProjects);
      setSelectedProjectId(created.id);
      localStorage.setItem("selectedProjectId", created.id);
      setMessage(`Project created: ${created.projectName}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateExistingProject(projectId, payload) {
    if (!token || !projectId) return;

    setIsLoading(true);
    setMessage("Updating project...");

    try {
      const updated = await updateProject(token, projectId, payload);
      setProjects((previous) =>
        previous.map((project) => (project.id === projectId ? updated : project)),
      );
      setMessage(`Project updated: ${updated.projectName}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteExistingProject(projectId) {
    if (!token || !projectId) return;

    setIsLoading(true);
    setMessage("Deleting project...");

    try {
      await deleteProject(token, projectId);

      const nextProjects = projects.filter((project) => project.id !== projectId);
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

      setMessage("Project deleted");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshProjects() {
    if (!token) return;

    setIsLoading(true);
    setMessage("Refreshing projects...");

    try {
      await loadProjects(token);
      setMessage("Projects refreshed");
    } catch (error) {
      setMessage(error.message);
    } finally {
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
    setMessage("Logged out");
  }

  useEffect(() => {
    async function hydrateSession() {
      if (!token) return;

      try {
        setIsLoading(true);
        await loadProjects(token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession();
  }, [token]);

  const value = {
    token,
    user,
    projects,
    selectedProjectId,
    selectedProject,
    isLoading,
    message,

    setMessage,

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
