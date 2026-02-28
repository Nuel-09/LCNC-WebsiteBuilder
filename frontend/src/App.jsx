import { useMemo, useState } from "react";
import "./App.css";
import { login, signup } from "./services/authService";
import { createProject, getProjects } from "./services/projectsService";
import {
  getConfiguration,
  getPreviewMockData,
  saveConfiguration,
} from "./services/configurationService";
import { getComponents, seedComponents } from "./services/componentsService";
import BuilderEditor from "./components/BuilderEditor";

function App() {
  // -----------------------------
  // Auth state
  // -----------------------------
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    fullName: "",
    schoolName: "",
  });

  // -----------------------------
  // Project + builder state
  // -----------------------------
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectForm, setNewProjectForm] = useState({
    projectName: "",
    schoolType: "primary",
  });
  const [components, setComponents] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  // -----------------------------
  // UX feedback state
  // -----------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Ready");

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("Authenticating...");

    try {
      const payload =
        mode === "signup"
          ? {
              email: authForm.email,
              password: authForm.password,
              fullName: authForm.fullName,
              schoolName: authForm.schoolName,
            }
          : {
              email: authForm.email,
              password: authForm.password,
            };

      const result =
        mode === "signup" ? await signup(payload) : await login(payload);

      setToken(result.token);
      setUser(result.user);
      setMessage(`Welcome ${result.user.email}`);

      await Promise.all([loadProjects(result.token), loadComponents()]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadProjects(currentToken = token) {
    const result = await getProjects(currentToken);
    setProjects(result);

    if (result.length > 0 && !selectedProjectId) {
      setSelectedProjectId(result[0].id);
    }
  }

  async function loadComponents() {
    const result = await getComponents();
    setComponents(result);
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setMessage("Creating project...");

    try {
      const created = await createProject(token, newProjectForm);
      const nextProjects = [created, ...projects];
      setProjects(nextProjects);
      setSelectedProjectId(created.id);
      setNewProjectForm({ projectName: "", schoolType: "primary" });
      setMessage(`Project created: ${created.projectName}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSeedComponents() {
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

  async function handleLoadPreviewData() {
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

  function logout() {
    setToken("");
    setUser(null);
    setProjects([]);
    setSelectedProjectId("");
    setComponents([]);
    setPreviewData(null);
    setMessage("Logged out");
  }

  return (
    <main className="container">
      <h1>School Builder Frontend (Learning Mode)</h1>
      <p className="status">
        <strong>Status:</strong> {isLoading ? "Working..." : message}
      </p>

      {!token ? (
        <section className="panel">
          <div className="row">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
              type="button"
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="form">
            <label>
              Email
              <input
                required
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  setAuthForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Password
              <input
                required
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
              />
            </label>

            {mode === "signup" ? (
              <>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={authForm.fullName}
                    onChange={(event) =>
                      setAuthForm((previous) => ({
                        ...previous,
                        fullName: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  School Name
                  <input
                    type="text"
                    value={authForm.schoolName}
                    onChange={(event) =>
                      setAuthForm((previous) => ({
                        ...previous,
                        schoolName: event.target.value,
                      }))
                    }
                  />
                </label>
              </>
            ) : null}

            <button type="submit" disabled={isLoading}>
              {mode === "signup" ? "Create Account" : "Login"}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="panel">
            <h2>Session</h2>
            <p>
              Logged in as <strong>{user?.email}</strong>
            </p>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </section>

          <section className="panel">
            <h2>Projects</h2>
            <form onSubmit={handleCreateProject} className="row wrap">
              <input
                required
                placeholder="Project name"
                value={newProjectForm.projectName}
                onChange={(event) =>
                  setNewProjectForm((previous) => ({
                    ...previous,
                    projectName: event.target.value,
                  }))
                }
              />
              <select
                value={newProjectForm.schoolType}
                onChange={(event) =>
                  setNewProjectForm((previous) => ({
                    ...previous,
                    schoolType: event.target.value,
                  }))
                }
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="rms">RMS</option>
              </select>
              <button type="submit" disabled={isLoading}>
                Create Project
              </button>
              <button
                type="button"
                onClick={() => loadProjects()}
                disabled={isLoading}
              >
                Refresh Projects
              </button>
            </form>

            <div className="row wrap">
              <label>
                Selected Project
                <select
                  value={selectedProjectId}
                  onChange={(event) => setSelectedProjectId(event.target.value)}
                >
                  <option value="">-- choose project --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName} ({project.schoolType ?? "general"})
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <small>
                  Current:{" "}
                  {selectedProject ? selectedProject.projectName : "none"}
                </small>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Component Catalog</h2>
            <div className="row">
              <button
                type="button"
                onClick={handleSeedComponents}
                disabled={isLoading}
              >
                Seed Defaults
              </button>
              <button
                type="button"
                onClick={() => loadComponents()}
                disabled={isLoading}
              >
                Reload Components
              </button>
            </div>

            <ul className="list">
              {components.map((component) => (
                <li key={component.id}>
                  <strong>{component.componentName}</strong> -{" "}
                  {component.componentType}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>Visual Page Builder</h2>
            <p>
              Drag components onto the canvas and customize their properties.
              Your changes auto-save to the backend.
            </p>
            {selectedProjectId ? (
              <BuilderEditor
                token={token}
                projectId={selectedProjectId}
                onPreviewUpdate={setPreviewData}
              />
            ) : (
              <p style={{ color: "#999" }}>
                Select a project to start building
              </p>
            )}
          </section>

          <section className="panel">
            <h2>Preview Mock Data</h2>
            <div className="row">
              <button
                type="button"
                onClick={handleLoadPreviewData}
                disabled={isLoading}
              >
                Load Preview Mock Data
              </button>
            </div>
            <pre>
              {previewData
                ? JSON.stringify(previewData, null, 2)
                : "No data loaded yet"}
            </pre>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
