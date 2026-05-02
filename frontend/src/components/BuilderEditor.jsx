import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import configurationApi from "../services/configurationService";
import { getDefaultLayout, puckConfig } from "./puckConfig";
import {
  ensureBuilderShape,
  getActivePageData,
  mergeActivePageData,
} from "./builderConfigUtils";
import { createBuilderAiPlugin } from "../services/aiProvider";

/**
 * BuilderEditor Component
 *
 * Wraps Puck visual editor and integrates with backend configuration API.
 * Manages:
 * - Loading saved configurations from backend
 * - Saving editor state back to backend
 * - Preview mode for live updates
 * - Error handling and user feedback
 */

const BuilderEditor = ({
  token,
  projectId,
  onPreviewUpdate,
  onPreviewPage,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [builderConfig, setBuilderConfig] = useState(null);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); //"saved" | "unsaved" | "saving" | "error";
  const latestDataRef = useRef(null);

  const getNormalizedConfig = (input) =>
    ensureBuilderShape(input ?? getDefaultLayout(), getDefaultLayout().content);

  const mergeCurrentPageEdits = (baseConfig = builderConfig) => {
    const currentData = latestDataRef.current ?? initialData ?? { content: [] };
    return mergeActivePageData(getNormalizedConfig(baseConfig), currentData);
  };

  const getActiveContentLength = (configLike) => {
    if (!configLike || typeof configLike !== "object") return 0;

    const pages = Array.isArray(configLike.pages) ? configLike.pages : [];
    const activePage =
      pages.find((page) => page?.id === configLike.activePageId) ?? pages[0];

    if (activePage && Array.isArray(activePage.content)) {
      return activePage.content.length;
    }

    return Array.isArray(configLike.content) ? configLike.content.length : 0;
  };

  // Define available components for the editor
  // Users will drag these onto the canvas and customize their properties
  const config = useMemo(() => puckConfig, []);

  // Keep a ref to builderConfig so the plugin's getPageContext can read
  // the latest state without forcing plugin recreation on every editor update.
  const builderConfigRef = useRef(builderConfig);
  useEffect(() => {
    builderConfigRef.current = builderConfig;
  }, [builderConfig]);

  const getPageContext = useCallback(() => {
    const current = getNormalizedConfig(builderConfigRef.current);
    const pages = Array.isArray(current.pages) ? current.pages : [];
    const activePage =
      pages.find((page) => page.id === current.activePageId) ?? pages[0];

    return {
      totalPages: pages.length,
      activePageId: activePage?.id ?? "home",
      activePageTitle: activePage?.title ?? "Home",
      pages: pages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
      })),
    };
  }, []);

  const plugins = useMemo(() => {
    const aiPlugin = createBuilderAiPlugin({
      token,
      projectId,
      getPageContext,
    });
    return aiPlugin ? [aiPlugin] : [];
  }, [token, projectId, getPageContext]);

  // Accept either object JSON or stringified JSON payloads from API.
  const parseConfigJson = (rawConfig) => {
    if (!rawConfig) return getDefaultLayout();

    if (typeof rawConfig === "string") {
      try {
        return JSON.parse(rawConfig);
      } catch {
        return getDefaultLayout();
      }
    }

    return rawConfig;
  };

  // Load initial configuration from backend
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const config = await configurationApi.getConfiguration(projectId);

        const parsedConfig = parseConfigJson(config.configJson);
        // Normalize full config, then isolate active-page content for Puck editor.
        const normalizedConfig = ensureBuilderShape(
          parsedConfig,
          getDefaultLayout().content,
        );

        setBuilderConfig(normalizedConfig);
        const activeData = getActivePageData(normalizedConfig);
        setInitialData(activeData);
        latestDataRef.current = activeData;
      } catch (err) {
        console.error("Failed to load configuration:", err);
        setError("Could not load configuration. Starting with default layout.");
        // On any load failure, start from default schema so editor can still operate.
        const fallbackConfig = ensureBuilderShape(
          getDefaultLayout(),
          getDefaultLayout().content,
        );
        setBuilderConfig(fallbackConfig);
        const fallbackData = getActivePageData(fallbackConfig);
        setInitialData(fallbackData);
        latestDataRef.current = fallbackData;
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadConfiguration();
    }
  }, [projectId]);

  // Autosave with debounce
  useEffect(() => {
    if (!isDirty || !latestDataRef.current || isSaving) return;

    const timer = setTimeout(() => {
      handleSave(latestDataRef.current, "autosave");
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialData, isDirty, isSaving]);

  // unsaved changes warning
  useEffect(() => {
    const handler = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Save draft configuration to backend and set saved status.
  const handleSave = async (data, source = "manual") => {
    if (!projectId) {
      setError("Select a project before saving.");
      return false;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSaveStatus("saving");

      // Merge edited active-page content back into full config before saving.
      const mergedConfig = mergeActivePageData(builderConfig, data);

      // Guard against accidental empty writes from transient editor snapshots.
      const previousLength = getActiveContentLength(builderConfig);
      const nextLength = getActiveContentLength(mergedConfig);
      if (previousLength > 0 && nextLength === 0 && source !== "manual") {
        // Block accidental empty overwrite during autosave/preview/publish transitions.
        // Manual saves are still allowed to clear the page intentionally.
        setSaveStatus("unsaved");
        return false;
      }

      // Validation-safe fallback so backend DTO always receives an object.
      const safeConfigForSave =
        mergedConfig &&
        typeof mergedConfig === "object" &&
        !Array.isArray(mergedConfig)
          ? mergedConfig
          : ensureBuilderShape(getDefaultLayout(), getDefaultLayout().content);

      await configurationApi.saveConfiguration(projectId, safeConfigForSave);
      setBuilderConfig(safeConfigForSave);

      setLastSaved(new Date().toLocaleTimeString());
      setIsDirty(false);
      setSaveStatus("saved");

      // Notify parent component to update preview
      if (onPreviewUpdate) {
        onPreviewUpdate(safeConfigForSave);
      }

      return true;
    } catch (err) {
      console.error("Failed to save configuration:", err);
      setError("Failed to save. Please try again.");
      setSaveStatus("error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchPage = (pageId) => {
    const merged = mergeCurrentPageEdits();
    const current = getNormalizedConfig(merged);

    if (!current.pages.some((page) => page.id === pageId)) {
      return;
    }

    const next = {
      ...current,
      activePageId: pageId,
    };

    const activeData = getActivePageData(next);
    setBuilderConfig(next);
    setInitialData(activeData);
    latestDataRef.current = activeData;
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  const handleAddPage = () => {
    const rawTitle = window.prompt("New page title", "New Page");
    if (!rawTitle) return;

    const title = rawTitle.trim();
    if (!title) return;

    const merged = mergeCurrentPageEdits();
    const current = getNormalizedConfig(merged);

    const baseSlug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "page";

    const existingIds = new Set(current.pages.map((page) => page.id));
    const existingSlugs = new Set(current.pages.map((page) => page.slug));

    let suffix = 1;
    let candidate = baseSlug;
    while (existingIds.has(candidate) || existingSlugs.has(candidate)) {
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }

    const nextPage = {
      id: candidate,
      title,
      slug: candidate,
      content: [],
    };

    const next = {
      ...current,
      pages: [...current.pages, nextPage],
      activePageId: nextPage.id,
      content: [],
    };

    setBuilderConfig(next);
    setInitialData({ content: [] });
    latestDataRef.current = { content: [] };
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  const handleDeleteActivePage = () => {
    const current = getNormalizedConfig(mergeCurrentPageEdits());
    const pages = current.pages ?? [];
    if (pages.length <= 1) {
      setError("At least one page is required.");
      return;
    }

    const activePage =
      pages.find((page) => page.id === current.activePageId) ?? pages[0];

    const confirmed = window.confirm(
      `Delete page \"${activePage.title}\"? This cannot be undone.`,
    );
    if (!confirmed) return;

    const remainingPages = pages.filter((page) => page.id !== activePage.id);
    const fallbackPage = remainingPages[0];

    const next = {
      ...current,
      pages: remainingPages,
      activePageId: fallbackPage.id,
      content: Array.isArray(fallbackPage.content) ? fallbackPage.content : [],
    };

    const activeData = getActivePageData(next);
    setBuilderConfig(next);
    setInitialData(activeData);
    latestDataRef.current = activeData;
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  // Publish always persists latest edits first, then creates a published snapshot.
  const handlePublish = async (dataOverride = null) => {
    const dataToPublish = dataOverride ?? latestDataRef.current ?? initialData;
    if (!dataToPublish) return;

    const saved = await handleSave(dataToPublish, "publish");
    if (!saved) return;

    try {
      setIsSaving(true);
      setSaveStatus("saving");
      await configurationApi.publishConfiguration(projectId);
      setLastSaved(new Date().toLocaleTimeString());
      setSaveStatus("saved");
    } catch (err) {
      console.error("Failed to publish configuration:", err);
      setError("Publish failed. Please try again.");
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview opens published view and saves unsaved edits first.
  const handlePreview = async () => {
    const currentData = latestDataRef.current ?? initialData;
    if (!currentData) return;

    if (isDirty) {
      const saved = await handleSave(currentData, "preview");
      if (!saved) return;
    }

    onPreviewPage?.(currentData);
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#666",
        }}
      >
        Loading editor...
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#d32f2f",
          background: "#ffebee",
          borderRadius: "4px",
          margin: "20px 0",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header with save and status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Visual Editor</h3>
          <small
            style={{
              color: saveStatus === "error" ? "#d32f2f" : "#999",
            }}
          >
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "unsaved" && "Unsaved changes"}
            {saveStatus === "saved" && lastSaved && `Saved at ${lastSaved}`}
            {saveStatus === "error" && "Save failed - please retry"}
          </small>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() =>
              (latestDataRef.current ?? initialData) &&
              handleSave(latestDataRef.current ?? initialData, "manual")
            }
            disabled={isSaving || !initialData}
            style={{
              background: "white",
              color: "#111",
              padding: "8px 16px",
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              cursor: !initialData || isSaving ? "not-allowed" : "pointer",
              fontSize: "0.9em",
              fontWeight: "bold",
            }}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePreview}
            disabled={!initialData}
            style={{
              background: "white",
              color: "#111",
              padding: "8px 16px",
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              cursor: !initialData ? "not-allowed" : "pointer",
              fontSize: "0.9em",
              fontWeight: "bold",
            }}
          >
            Preview Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            style={{
              background: isSaving ? "#ccc" : "#3b5ccc",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "0.9em",
              fontWeight: "bold",
            }}
          >
            {isSaving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Multi-page controls */}
      {builderConfig?.pages?.length ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderBottom: "1px solid #ddd",
            background: "#fafafa",
            flexWrap: "wrap",
          }}
        >
          <label style={{ fontSize: "0.85em", color: "#666" }}>Page:</label>
          <select
            value={
              builderConfig.activePageId ?? builderConfig.pages[0]?.id ?? ""
            }
            onChange={(event) => handleSwitchPage(event.target.value)}
            style={{
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              padding: "6px 10px",
              fontSize: "0.9em",
            }}
          >
            {builderConfig.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddPage}
            style={{
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              padding: "6px 10px",
              background: "white",
              fontSize: "0.85em",
              fontWeight: "bold",
            }}
          >
            Add Page
          </button>

          <button
            type="button"
            onClick={handleDeleteActivePage}
            disabled={(builderConfig.pages?.length ?? 0) <= 1}
            style={{
              border: "1px solid #d5d5d5",
              borderRadius: "4px",
              padding: "6px 10px",
              background: "white",
              fontSize: "0.85em",
              fontWeight: "bold",
              cursor:
                (builderConfig.pages?.length ?? 0) <= 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Delete Page
          </button>
        </div>
      ) : null}

      {/* Puck Editor */}
      {initialData && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <Puck
            key={builderConfig?.activePageId ?? "home"}
            config={config}
            data={initialData}
            plugins={plugins}
            onPublish={(data) => {
              setInitialData(data);
              latestDataRef.current = data;
              handlePublish(data);
            }}
            // Puck v0.21 emits editor changes via onChange (not onData).
            onChange={(data) => {
              setInitialData(data);
              latestDataRef.current = data;
              setIsDirty(true);
              setSaveStatus("unsaved");
            }}
          />
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fff3cd",
            color: "#856404",
            borderTop: "1px solid #ffc107",
            fontSize: "0.9em",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default BuilderEditor;
