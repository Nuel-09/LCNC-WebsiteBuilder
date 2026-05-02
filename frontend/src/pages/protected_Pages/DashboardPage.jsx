import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

/**
 * DashboardPage
 *
 * Project management hub for builder users.
 * Includes:
 * - project creation
 * - project selection
 * - inline project metadata updates
 * - project deletion
 * - quick navigation to builder and published preview
 */
function DashboardPage() {
  const navigate = useNavigate();
  const {
    projects,
    selectedProjectId,
    selectedProject,
    isLoading,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    refreshProjects,
    selectProject,
  } = useAppContext();

  const [newProjectForm, setNewProjectForm] = useState({
    projectName: "",
    schoolType: "primary",
  });

  const [editProjectId, setEditProjectId] = useState("");
  const [editProjectForm, setEditProjectForm] = useState({
    projectName: "",
    schoolType: "primary",
  });

  const selectedProjectSummary = useMemo(() => {
    if (!selectedProject) return "No active project selected";
    return `${selectedProject.projectName} (${selectedProject.schoolType ?? "general"})`;
  }, [selectedProject]);

  async function handleCreateProject(event) {
    event.preventDefault();
    await createNewProject(newProjectForm);
    setNewProjectForm({ projectName: "", schoolType: "primary" });
  }

  function startEditing(project) {
    setEditProjectId(project.id);
    setEditProjectForm({
      projectName: project.projectName,
      schoolType: project.schoolType ?? "primary",
    });
  }

  function cancelEditing() {
    setEditProjectId("");
    setEditProjectForm({ projectName: "", schoolType: "primary" });
  }

  async function handleSaveProjectEdit(projectId) {
    await updateExistingProject(projectId, editProjectForm);
    cancelEditing();
  }

  async function handleDeleteProject(projectId, projectName) {
    const shouldDelete = window.confirm(
      `Delete \"${projectName}\"? This action cannot be undone.`,
    );

    if (!shouldDelete) return;
    await deleteExistingProject(projectId);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Create Project</h2>
        <form
          onSubmit={handleCreateProject}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <input
            required
            placeholder="Project name"
            value={newProjectForm.projectName}
            min={3}
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
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Project Workspace</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">
              Active Project
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
            {selectedProjectSummary}
          </p>

          {selectedProjectId ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/builder")}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Open Builder
              </button>
              <button
                type="button"
                onClick={() => navigate("/builder/preview")}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Open Draft Preview
              </button>
              <button
                type="button"
                onClick={() => navigate("/builder/published")}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Open Published Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedProjectId) return;
                  window.open(
                    `${window.location.origin}/site/${selectedProjectId}`,
                    "_blank",
                  );
                }}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Open Live Site
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">Manage Projects</h2>

        {projects.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No projects yet. Create one above to begin.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {projects.map((project) => {
              const isEditing = editProjectId === project.id;

              return (
                <article key={project.id} className="rounded-lg border p-3">
                  {isEditing ? (
                    <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
                      <input
                        value={editProjectForm.projectName}
                        onChange={(event) =>
                          setEditProjectForm((previous) => ({
                            ...previous,
                            projectName: event.target.value,
                          }))
                        }
                        className="rounded-md border px-3 py-2 text-sm"
                      />
                      <select
                        value={editProjectForm.schoolType}
                        onChange={(event) =>
                          setEditProjectForm((previous) => ({
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveProjectEdit(project.id)}
                          disabled={isLoading}
                          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{project.projectName}</h3>
                        <p className="text-xs text-muted-foreground">
                          Type: {project.schoolType ?? "general"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            selectProject(project.id);
                            navigate("/builder");
                          }}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            selectProject(project.id);
                            navigate("/builder/preview");
                          }}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            selectProject(project.id);
                            navigate("/builder/published");
                          }}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Published
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `${window.location.origin}/site/${project.id}`,
                              "_blank",
                            )
                          }
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Live Site
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditing(project)}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProject(project.id, project.projectName)
                          }
                          className="rounded-md border px-3 py-2 text-sm text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Need to create content now? Go to{" "}
          <Link to="/builder" className="underline">
            Builder
          </Link>{" "}
          after selecting a project.
        </p>
      </section>
    </div>
  );
}

export default DashboardPage;
