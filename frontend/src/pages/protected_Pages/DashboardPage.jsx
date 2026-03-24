import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

function DashboardPage() {
  const {
    projects,
    selectedProject,
    selectedProjectId,
    components,
    previewData,
    isLoading,
    createNewProject,
    refreshProjects,
    refreshComponents,
    seedDefaultComponents,
    loadPreviewMockData,
    selectProject,
  } = useAppContext();

  const [newProjectForm, setNewProjectForm] = useState({
    projectName: "",
    schoolType: "primary",
  });

  async function handleCreateProject(event) {
    event.preventDefault();
    await createNewProject(newProjectForm);
    setNewProjectForm({ projectName: "", schoolType: "primary" });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <form
          onSubmit={handleCreateProject}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
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
            className="min-w-56 rounded-md border px-3 py-2 text-sm"
          />
          <select
            value={newProjectForm.schoolType}
            onChange={(event) =>
              setNewProjectForm((previous) => ({
                ...previous,
                schoolType: event.target.value,
              }))
            }
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="rms">RMS</option>
          </select>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            Create Project
          </button>
          <button
            type="button"
            onClick={refreshProjects}
            disabled={isLoading}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">
              Selected Project
            </span>
            <select
              value={selectedProjectId}
              onChange={(event) => selectProject(event.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="">-- choose project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName} ({project.schoolType ?? "general"})
                </option>
              ))}
            </select>
          </label>

          <p className="text-sm text-muted-foreground">
            Current:{" "}
            <strong>
              {selectedProject ? selectedProject.projectName : "none"}
            </strong>
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Component Catalog</h2>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={seedDefaultComponents}
            disabled={isLoading}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Seed Defaults
          </button>
          <button
            type="button"
            onClick={refreshComponents}
            disabled={isLoading}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Reload Components
          </button>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          {components.map((component) => (
            <li key={component.id} className="rounded-md border px-3 py-2">
              <strong>{component.componentName}</strong> —{" "}
              {component.componentType}
            </li>
          ))}
          {components.length === 0 ? (
            <li className="text-muted-foreground">No components loaded yet.</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Preview Mock Data</h2>
        <button
          type="button"
          onClick={loadPreviewMockData}
          disabled={isLoading}
          className="mt-3 rounded-md border px-3 py-2 text-sm"
        >
          Load Preview Mock Data
        </button>

        <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">
          {previewData
            ? JSON.stringify(previewData, null, 2)
            : "No data loaded yet"}
        </pre>
      </section>
    </div>
  );
}

export default DashboardPage;
