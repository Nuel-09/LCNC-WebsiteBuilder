import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Render } from "@puckeditor/core";
import configurationApi from "../../services/configurationService";
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

function PublishedSitePage() {
  const { projectId } = useParams();
  const [data, setData] = useState({ content: [] });
  const [projectName, setProjectName] = useState("Published Site");
  const [publishedAt, setPublishedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublishedSite() {
      if (!projectId) {
        setError("Missing project id in the URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result =
          await configurationApi.getPublicPublishedConfiguration(projectId);

        const normalized = ensureBuilderShape(
          normalizeConfigJson(result?.configJson),
          getDefaultLayout().content,
        );

        setProjectName(result?.projectName ?? "Published Site");
        setPublishedAt(result?.publishedAt ?? "");
        setData(getActivePageData(normalized));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load published site.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPublishedSite();
  }, [projectId]);

  return (
    <section className="space-y-4 bg-slate-50">
      {/* <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Live website
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {projectName}
        </h1>
        {publishedAt ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Published at {new Date(publishedAt).toLocaleString()}
          </p>
        ) : null}
      </div> */}

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading live website...
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

export default PublishedSitePage;
