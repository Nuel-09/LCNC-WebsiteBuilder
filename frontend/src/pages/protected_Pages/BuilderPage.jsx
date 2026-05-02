import { Link, useNavigate } from "react-router-dom";
import BuilderEditor from "../../components/BuilderEditor";
import { useAppContext } from "../../context/AppContext";

function BuilderPage() {
  const navigate = useNavigate();
  const { token, selectedProjectId, selectedProject } = useAppContext();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Visual Builder</h2>
          <p className="text-sm text-muted-foreground">
            Structure follows Puck-style editor patterns and can be restyled
            later for your custom product identity.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Project:{" "}
          <strong>
            {selectedProject ? selectedProject.projectName : "none selected"}
          </strong>
        </p>
      </div>

      {selectedProjectId ? (
        <div className="rounded-xl border bg-card p-0">
          <BuilderEditor
            token={token}
            projectId={selectedProjectId}
            onPreviewPage={() => navigate("/builder/preview")}
          />
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Select a project in{" "}
          <Link to="/dashboard" className="underline">
            Dashboard
          </Link>{" "}
          to start editing.
        </div>
      )}
    </section>
  );
}

export default BuilderPage;
