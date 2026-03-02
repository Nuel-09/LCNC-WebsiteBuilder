import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, signup } from "../services/authService";
import { createProject, getProjects } from "../services/projectsService";
import { getComponents, seedComponents } from "../services/componentsService";
import { getPreviewMockData } from "../services/configurationService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem("selectedProjectId") ?? "",
  );
  const [components, setComponents] = useState([]);
  const [previewData, setPreviewData] = useState(null);
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
    setComponents([]);
    setPreviewData(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProjectId");
  }

  async function loadProjects(currentToken = token) {
    if (!currentToken) return;

    const result = await getProjects(currentToken);
    setProjects(result);

    if (result.length > 0) {
      const stillExists = result.some((project) => project.id === selectedProjectId);
      const fallbackId = result[0].id;
      const nextSelected = stillExists ? selectedProjectId : fallbackId;
      setSelectedProjectId(nextSelected);
      localStorage.setItem("selectedProjectId", nextSelected);
    }
  }

  async function loadComponents() {
    const result = await getComponents();
    setComponents(result);
  }

  async function authenticate(mode, payload) {
    setIsLoading(true);
    setMessage("Authenticating...");

    try {
      const result = mode === "signup" ? await signup(payload) : await login(payload);
      persistSession(result.token, result.user);
      setMessage(`Welcome ${result.user.email}`);

      await Promise.all([loadProjects(result.token), loadComponents()]);
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

  async function refreshComponents() {
    setIsLoading(true);
    setMessage("Loading component catalog...");

    try {
      await loadComponents();
      setMessage("Component catalog loaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function seedDefaultComponents() {
    setIsLoading(true);
    setMessage("Seeding components...");

    try {
      const seeded = await seedComponents();
      setComponents(seeded);
      setMessage(`Seeded ${seeded.length} components`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadPreviewMockData() {
    if (!token || !selectedProjectId) {
      setMessage("Select a project first");
      return;
    }

    setIsLoading(true);
    setMessage("Loading preview mock data...");

    try {
      const result = await getPreviewMockData(token, selectedProjectId);
      setPreviewData(result);
      setMessage("Preview mock data loaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function selectProject(projectId) {
    setSelectedProjectId(projectId);
    localStorage.setItem("selectedProjectId", projectId);
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
        await Promise.all([loadProjects(token), loadComponents()]);
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
    components,
    previewData,
    isLoading,
    message,
    setPreviewData,
    setMessage,
    authenticate,
    createNewProject,
    refreshProjects,
    refreshComponents,
    seedDefaultComponents,
    loadPreviewMockData,
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
