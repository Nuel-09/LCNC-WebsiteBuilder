/**
 * AppContext - Central State Management for the Entire Application
 *
 * This file exports a React Context that holds:
 * - Authentication data (JWT token, user info)
 * - Project data (all user's school websites)
 * - Component catalog (building blocks available in editor)
 * - UI state (loading, messages)
 *
 * Pages and components access this data via useAppContext() hook
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, signup } from "../services/authService"; // Login/signup API
import { createProject, getProjects } from "../services/projectsService"; // Project CRUD
import { getComponents, seedComponents } from "../services/componentsService"; // Component catalog
import { getPreviewMockData } from "../services/configurationService"; // Mock data

const AppContext = createContext(null);

/**
 * AppProvider Component - Main App State Container
 * Wraps entire app in main.jsx and provides all state to children
 */
export function AppProvider({ children }) {
  // ═══════════════════════════════════════════════════════════════
  // AUTHENTICATION STATE
  // ═══════════════════════════════════════════════════════════════

  // JWT token from backend login
  // Restored from localStorage on page load (user stays logged in)
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");

  // Current user info (email, fullName, schoolName)
  // Parsed from localStorage JSON
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null; // If corrupted, clear it
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PROJECT STATE
  // ═══════════════════════════════════════════════════════════════

  // Array of all school websites for current user
  const [projects, setProjects] = useState([]);

  // ID of project currently being edited (restored from localStorage)
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem("selectedProjectId") ?? "",
  );

  // ═══════════════════════════════════════════════════════════════
  // EDITOR STATE
  // ═══════════════════════════════════════════════════════════════

  // All available building blocks (Header, Hero, About, etc.)
  const [components, setComponents] = useState([]);

  // Mock data for live preview (fake students, grades, announcements)
  const [previewData, setPreviewData] = useState(null);

  // ═══════════════════════════════════════════════════════════════
  // UI STATE
  // ═══════════════════════════════════════════════════════════════

  // Loading flag shown during API calls
  const [isLoading, setIsLoading] = useState(false);

  // Status message displayed in nav bar
  const [message, setMessage] = useState("Ready");

  // ═══════════════════════════════════════════════════════════════
  // DERIVED STATE (computed from above)
  // ═══════════════════════════════════════════════════════════════

  // Get the currently selected project object from projects array
  // Returns null if project doesn't exist or nothing selected
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId], // Re-calculate when these change
  );

  // ═══════════════════════════════════════════════════════════════
  // HELPER: persistSession - Save login session to browser
  // ═══════════════════════════════════════════════════════════════

  /**
   * Persist JWT token and user info after successful login/signup
   * Saves to BOTH React state (UI updates) and localStorage (survives refresh)
   *
   * @param {string} nextToken - JWT from backend (e.g., "eyJhbGc...")
   * @param {object} nextUser - User info {email, fullName, schoolName}
   */
  function persistSession(nextToken, nextUser) {
    // Update React state (makes UI reactive)
    setToken(nextToken);
    setUser(nextUser);

    // Persist to localStorage (survives page refresh)
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser)); // Convert to JSON string
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPER: clearSession - Logout and wipe all state
  // ═══════════════════════════════════════════════════════════════

  /**
   * Complete logout - clears all React state and localStorage
   * Called when user clicks Logout button or JWT expires
   */
  function clearSession() {
    // Clear React state (pages show empty UI)
    setToken(""); // No more JWT
    setUser(null); // No more user info
    setProjects([]); // No more projects
    setSelectedProjectId(""); // No project selected
    setComponents([]); // Clear component catalog
    setPreviewData(null); // Clear preview data

    // Clear localStorage (user is logged out after browser refresh)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProjectId");
  }

  // ═══════════════════════════════════════════════════════════════
  // FETCH: loadProjects - Get all user's school websites
  // ═══════════════════════════════════════════════════════════════

  /**
   * Fetch all projects (school websites) for logged-in user
   * Called during login flow and when user clicks Refresh
   *
   * @param {string} currentToken - JWT token (defaults to state token)
   */
  async function loadProjects(currentToken = token) {
    // Skip if no token (user not logged in)
    if (!currentToken) return;

    // Call backend: GET /projects
    const result = await getProjects(currentToken);
    setProjects(result); // Update state with fetched projects

    // Smart re-selection logic:
    // If user had project selected AND it still exists → keep it
    // Otherwise → select first project
    if (result.length > 0) {
      const stillExists = result.some(
        (project) => project.id === selectedProjectId,
      );
      const fallbackId = result[0].id; // Default: first project
      const nextSelected = stillExists ? selectedProjectId : fallbackId;

      setSelectedProjectId(nextSelected);
      localStorage.setItem("selectedProjectId", nextSelected); // Persist
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FETCH: loadComponents - Get available building blocks
  // ═══════════════════════════════════════════════════════════════

  /**
   * Fetch available components (Header, Hero, About, etc.)
   * Called during login or when user refreshes component catalog
   * Note: No token needed (components are public/same for all users)
   */
  async function loadComponents() {
    // Call backend: GET /components
    const result = await getComponents();
    setComponents(result); // Update state with fetched components
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: authenticate - Handle login/signup flow
  // ═══════════════════════════════════════════════════════════════

  /**
   * Main authentication handler - login or signup
   * Called from AuthPage when user submits form
   *
   * @param {string} mode - "login" or "signup"
   * @param {object} payload - {email, password} or {email, password, fullName, schoolName}
   * @returns {boolean} - true if success (caller redirects to /dashboard)
   */
  async function authenticate(mode, payload) {
    setIsLoading(true); // Show loading spinner
    setMessage("Authenticating..."); // Update nav bar status

    try {
      // Call backend: POST /auth/signup or POST /auth/login
      const result =
        mode === "signup" ? await signup(payload) : await login(payload);

      // Save JWT and user info (both state + localStorage)
      persistSession(result.token, result.user);
      setMessage(`Welcome ${result.user.email}`); // Personalized greeting

      // Load user's projects and component catalog in parallel
      await Promise.all([loadProjects(result.token), loadComponents()]);

      return true; // AuthPage will redirect to /dashboard
    } catch (error) {
      // Show error message (e.g., "Invalid email or password")
      setMessage(error.message);
      return false;
    } finally {
      // Always hide spinner (success or error)
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: createNewProject - Create new school website
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new project (school website)
   * Called from DashboardPage form submission
   *
   * @param {object} payload - {projectName, schoolType}
   */
  async function createNewProject(payload) {
    if (!token) return; // Require login

    setIsLoading(true);
    setMessage("Creating project...");

    try {
      // Call backend: POST /projects
      const created = await createProject(token, payload);

      // Add new project to top of list (most recent first)
      const nextProjects = [created, ...projects];
      setProjects(nextProjects);

      // Auto-select the newly created project
      setSelectedProjectId(created.id);
      localStorage.setItem("selectedProjectId", created.id);

      setMessage(`Project created: ${created.projectName}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: refreshProjects - Re-fetch projects from backend
  // ═══════════════════════════════════════════════════════════════

  /**
   * Re-fetch projects from backend
   * Called when user clicks "Refresh" button in dashboard
   * Useful if another browser tab created a new project
   */
  async function refreshProjects() {
    if (!token) return;

    setIsLoading(true);
    setMessage("Refreshing projects...");

    try {
      await loadProjects(token); // Re-fetch from backend
      setMessage("Projects refreshed");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: refreshComponents - Re-fetch component catalog
  // ═══════════════════════════════════════════════════════════════

  /**
   * Re-fetch component catalog from backend
   * Called when user clicks button in dashboard
   */
  async function refreshComponents() {
    setIsLoading(true);
    setMessage("Loading component catalog...");

    try {
      await loadComponents(); // Re-fetch from backend
      setMessage("Component catalog loaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: seedDefaultComponents - Populate component database
  // ═══════════════════════════════════════════════════════════════

  /**
   * Initialize database with 8 pre-built building blocks
   * Called from DashboardPage "Seed Components" button
   * (Development utility - runs seeding script on backend)
   *
   * Seeded components: Header, Hero, About, Programs, Announcements, etc.
   */
  async function seedDefaultComponents() {
    setIsLoading(true);
    setMessage("Seeding components...");

    try {
      // Call backend: POST /components/seed (inserts default blocks)
      const seeded = await seedComponents();
      setComponents(seeded); // Update state with new components
      setMessage(`Seeded ${seeded.length} components`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: loadPreviewMockData - Get fake data for preview
  // ═══════════════════════════════════════════════════════════════

  /**
   * Load fake data (students, grades, announcements) for live preview
   * Called from BuilderPreviewPage
   * Simulates what website looks like with real data
   */
  async function loadPreviewMockData() {
    // Require both login and selected project
    if (!token || !selectedProjectId) {
      setMessage("Select a project first");
      return;
    }

    setIsLoading(true);
    setMessage("Loading preview mock data...");

    try {
      // Call backend: GET /projects/{id}/preview
      const result = await getPreviewMockData(token, selectedProjectId);
      setPreviewData(result); // Store for preview page to use
      setMessage("Preview mock data loaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: selectProject - Switch to different project
  // ═══════════════════════════════════════════════════════════════

  /**
   * Switch to a different project
   * Called when user clicks project in dashboard list
   *
   * @param {string} projectId - ID of project to switch to
   */
  function selectProject(projectId) {
    setSelectedProjectId(projectId); // Update state
    localStorage.setItem("selectedProjectId", projectId); // Persist
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTION: logout - Log user out
  // ═══════════════════════════════════════════════════════════════

  /**
   * Log user out
   * Called when user clicks "Logout" button in nav bar
   */
  function logout() {
    clearSession(); // Clear all state and localStorage
    setMessage("Logged out");
  }

  // ═══════════════════════════════════════════════════════════════
  // SIDE EFFECT: hydrateSession - Restore app state on page refresh
  // ═══════════════════════════════════════════════════════════════

  /**
   * HYDRATE = "refill/restore app state"
   *
   * When user refreshes page:
   * 1. React state resets (all [], "", null)
   * 2. But localStorage still has token from before!
   * 3. AppProvider reads token from localStorage
   * 4. THIS EFFECT runs and fetches fresh data from backend
   * 5. Now state is populated again - user stays logged in!
   *
   * Without this effect: user would see empty dashboard after refresh
   *
   * Runs when token changes (login, logout, page refresh)
   */
  useEffect(() => {
    async function hydrateSession() {
      if (!token) return; // Skip if not logged in

      try {
        setIsLoading(true);
        // Fetch projects and components in parallel (faster)
        await Promise.all([loadProjects(token), loadComponents()]);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession(); // Run when mounted or token changes
  }, [token]); // Re-run ONLY when token changes

  // ═══════════════════════════════════════════════════════════════
  // ASSEMBLE CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Bundle all state and functions into one object
   * This is what pages/components receive when they call useAppContext()
   *
   * Usage examples:
   *   const { user, projects } = useAppContext()  // Read state
   *   const { createNewProject } = useAppContext()  // Call functions
   */
  const value = {
    // ─ STATE (read-only in most components) ─
    token, // JWT string from backend
    user, // {id, email, fullName, schoolName}
    projects, // [{id, projectName, ...}, ...]
    selectedProjectId, // Current project ID
    selectedProject, // Current project object (or null)
    components, // [{id, componentName, ...}, ...]
    previewData, // Mock data for preview
    isLoading, // true during API calls
    message, // Status message for nav bar

    // ─ SETTERS (update state directly) ─
    setPreviewData, // Set preview mock data
    setMessage, // Set status message

    // ─ FUNCTIONS (call to trigger actions) ─
    authenticate, // Login/signup
    createNewProject, // Create new project
    refreshProjects, // Re-fetch projects
    refreshComponents, // Re-fetch components
    seedDefaultComponents, // Populate component database
    loadPreviewMockData, // Load preview data
    selectProject, // Switch projects
    logout, // Log user out
  };

  // Provide context to all child components
  // Any component inside <AppProvider> can now call useAppContext()
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM HOOK: useAppContext
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to access AppContext in any component
 *
 * MUST be used INSIDE <AppProvider> (in main.jsx)
 *
 * Usage in any component:
 *   import { useAppContext } from "../context/AppContext"
 *
 *   function MyComponent() {
 *     const { user, projects, createNewProject } = useAppContext()
 *     return (
 *       <button onClick={() => createNewProject({projectName: "Test"})}>
 *         Create Project
 *       </button>
 *     )
 *   }
 *
 * If used outside AppProvider:
 *   → Throws error: "useAppContext must be used inside AppProvider"
 */
export function useAppContext() {
  const context = useContext(AppContext);

  // Safety check: ensure hook is used inside provider
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context; // Return the value object from context
}
