import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Render } from "@puckeditor/core";
import configurationApi from "../../services/configurationService";
import { useAppContext } from "../../context/AppContext";
import { getDefaultLayout, puckConfig } from "../../components/puckConfig";
import {
  ensureBuilderShape,
  getActivePageData,
} from "../../components/builderConfigUtils";

function normalizeConfigJson(rawConfig) {
  if (!rawConfig) return getDefaultLayout();

  if (typeof rawConfig === "string") {
    return JSON.parse(rawConfig);
  }

  return rawConfig;
}

function BuilderPreviewPage({ mode = "published" }) {
  const { selectedProjectId, selectedProject } = useAppContext();
  const [data, setData] = useState({ content: [] });
  const [builderConfig, setBuilderConfig] = useState(null);
  const [activePageId, setActivePageId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPageConfiguration() {
      if (!selectedProjectId) {
        setError("Select a project first from Dashboard.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const result =
          mode === "draft"
            ? await configurationApi.getConfiguration(selectedProjectId)
            : await configurationApi.getPublishedConfiguration(
                selectedProjectId,
              );
        const normalized = ensureBuilderShape(
          normalizeConfigJson(result?.configJson),
          getDefaultLayout().content,
        );
        setBuilderConfig(normalized);
        setActivePageId(
          normalized.activePageId ?? normalized.pages?.[0]?.id ?? "",
        );
        setData(getActivePageData(normalized));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load page preview.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPageConfiguration();
  }, [selectedProjectId, mode]);

  useEffect(() => {
    if (!builderConfig) return;
    const next = ensureBuilderShape(
      {
        ...builderConfig,
        activePageId:
          activePageId ||
          builderConfig.activePageId ||
          builderConfig.pages?.[0]?.id,
      },
      getDefaultLayout().content,
    );
    setData(getActivePageData(next));
  }, [activePageId, builderConfig]);

  const titlePrefix = mode === "draft" ? "Draft" : "Published";
  const publicUrl =
    mode === "published" && selectedProjectId
      ? `${window.location.origin}/site/${selectedProjectId}`
      : "";

  const handleCopyPublicUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Copied public URL to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Could not copy link. Try selecting and copying manually.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-4">
        <div>
          <h2 className="text-xl font-semibold">{titlePrefix} View</h2>
          <p className="text-sm text-muted-foreground">
            {selectedProject
              ? `${selectedProject.projectName} ${titlePrefix.toLowerCase()} preview`
              : "No project selected"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {builderConfig?.pages?.length ? (
            <select
              value={activePageId}
              onChange={(event) => setActivePageId(event.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {builderConfig.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          ) : null}
          <Link to="/builder" className="rounded-md border px-3 py-2 text-sm">
            Back to Builder
          </Link>
        </div>
      </div>

      {mode === "published" && publicUrl ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-emerald-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Public URL
            </p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-all text-sm font-medium text-emerald-900 underline"
            >
              {publicUrl}
            </a>
          </div>
          <button
            type="button"
            onClick={handleCopyPublicUrl}
            className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm"
          >
            Copy Link
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading page...
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Render config={puckConfig} data={data} />
        </div>
      )}
    </section>
  );
}

export default BuilderPreviewPage;
