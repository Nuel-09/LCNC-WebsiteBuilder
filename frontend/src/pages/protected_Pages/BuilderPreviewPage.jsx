import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { getConfiguration } from "../../services/configurationService";
import { useAppContext } from "../../context/AppContext";
import { getDefaultLayout, puckConfig } from "../../components/puckConfig";

function normalizeConfigJson(rawConfig) {
  if (!rawConfig) return getDefaultLayout();

  if (typeof rawConfig === "string") {
    return JSON.parse(rawConfig);
  }

  return rawConfig;
}

function BuilderPreviewPage() {
  const { token, selectedProjectId, selectedProject } = useAppContext();
  const [data, setData] = useState(getDefaultLayout());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPageConfiguration() {
      if (!token || !selectedProjectId) {
        setError("Select a project first from Dashboard.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const result = await getConfiguration(token, selectedProjectId);
        setData(normalizeConfigJson(result?.configJson));
      } catch (err) {
        setError(err.message || "Failed to load page preview.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageConfiguration();
  }, [token, selectedProjectId]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-4">
        <div>
          <h2 className="text-xl font-semibold">Published View</h2>
          <p className="text-sm text-muted-foreground">
            {selectedProject ? `${selectedProject.projectName} preview` : "No project selected"}
          </p>
        </div>
        <Link to="/builder" className="rounded-md border px-3 py-2 text-sm">
          Back to Builder
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading page...</div>
      ) : error ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-destructive">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Render config={puckConfig} data={data} />
        </div>
      )}
    </section>
  );
}

export default BuilderPreviewPage;
