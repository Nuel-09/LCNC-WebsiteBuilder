import {
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
import { motion, AnimatePresence } from "motion/react";
import ConfirmDialog from "./ui/ConfirmDialog";
import AddPageModal from "./ui/AddPageModal";
import PublishModal from "./ui/PublishModal";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Globe,
  Hammer,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

// ── Save-status config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  saving: {
    dot: "bg-blue-400 animate-pulse",
    text: "text-blue-600",
    label: "Saving…",
    icon: Loader2,
    spin: true,
  },
  unsaved: {
    dot: "bg-amber-400",
    text: "text-amber-600",
    label: "Unsaved changes",
    icon: Clock,
    spin: false,
  },
  saved: {
    dot: "bg-emerald-400",
    text: "text-emerald-600",
    label: null, // filled dynamically with lastSaved time
    icon: Check,
    spin: false,
  },
  error: {
    dot: "bg-red-400",
    text: "text-red-600",
    label: "Save failed — please retry",
    icon: AlertTriangle,
    spin: false,
  },
};

const BuilderEditor = ({
  token,
  projectId,
  projectName,
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
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [addPageError, setAddPageError] = useState("");
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [hasEverPublished, setHasEverPublished] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState(null);
  const [hasChangesSincePublish, setHasChangesSincePublish] = useState(true);
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

  // Load initial configuration from backend
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiResult = await configurationApi.getConfiguration(projectId);
        // ensureBuilderShape handles both string JSON and object payloads internally
        const normalizedConfig = ensureBuilderShape(
          apiResult?.configJson,
          getDefaultLayout().content,
        );
        setBuilderConfig(normalizedConfig);
        // Detect publish state from the draft config response — avoids a second API call
        if (apiResult?.publishedAt) {
          setHasEverPublished(true);
          setHasChangesSincePublish(false);
          setLastPublishedAt(new Date(apiResult.publishedAt).toLocaleString());
        }
        const activeData = getActivePageData(normalizedConfig);
        setInitialData(activeData);
        latestDataRef.current = activeData;
      } catch (err) {
        console.error("Failed to load configuration:", err);
        setError("Could not load configuration. Starting with default layout.");
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
    if (projectId) loadConfiguration();
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
    if (!current.pages.some((page) => page.id === pageId)) return;
    const next = { ...current, activePageId: pageId };
    const activeData = getActivePageData(next);
    setBuilderConfig(next);
    setInitialData(activeData);
    latestDataRef.current = activeData;
    setIsDirty(true);
    setSaveStatus("unsaved");
  };

  const handleAddPage = () => {
    setNewPageTitle("");
    setAddPageError("");
    setShowAddPageModal(true);
  };

  const commitAddPage = () => {
    const title = newPageTitle.trim();

    if (!title) {
      setAddPageError("Page name is required.");
      return;
    }
    if (title.length < 2) {
      setAddPageError("Page name must be at least 2 characters.");
      return;
    }

    const merged = mergeCurrentPageEdits();
    const current = getNormalizedConfig(merged);

    const isDuplicate = current.pages.some(
      (page) => page.title.toLowerCase() === title.toLowerCase(),
    );
    if (isDuplicate) {
      setAddPageError(`A page named "${title}" already exists.`);
      return;
    }

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

    const nextPage = { id: candidate, title, slug: candidate, content: [] };
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

    setShowAddPageModal(false);
    setNewPageTitle("");
    setAddPageError("");
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

    setConfirmConfig({
      title: "Delete Page",
      message: "This page and all its content will be permanently removed.",
      variant: "danger",
      confirmLabel: "Delete Page",
      itemName: activePage.title,
      onConfirm: () => {
        const remainingPages = pages.filter(
          (page) => page.id !== activePage.id,
        );
        const fallbackPage = remainingPages[0];
        const next = {
          ...current,
          pages: remainingPages,
          activePageId: fallbackPage.id,
          content: Array.isArray(fallbackPage.content)
            ? fallbackPage.content
            : [],
        };
        const activeData = getActivePageData(next);
        setBuilderConfig(next);
        setInitialData(activeData);
        latestDataRef.current = activeData;
        setIsDirty(true);
        setSaveStatus("unsaved");
      },
    });
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
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
      setLastPublishedAt(now.toLocaleString());
      setHasEverPublished(true);
      setHasChangesSincePublish(false);
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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-purple-50 via-blue-50 to-white gap-5">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="size-20 bg-linear-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200"
        >
          <Hammer className="size-10 text-white" />
        </motion.div>
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-base">
            Loading your editor…
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Fetching your project configuration
          </p>
        </div>
        {/* Skeleton shimmer bars */}
        <div className="w-64 space-y-2 mt-2">
          {[80, 60, 72].map((w) => (
            <div
              key={w}
              className="h-2.5 bg-gray-200 rounded-full animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Fatal error state ──────────────────────────────────────────────────────
  if (error && !initialData) {
    return (
      <div className="flex items-center justify-center h-full bg-linear-to-br from-purple-50 via-blue-50 to-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-sm w-full text-center"
        >
          <div className="size-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="size-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Failed to Load Editor
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{error}</p>
        </motion.div>
      </div>
    );
  }

  // ── Status bar helpers ─────────────────────────────────────────────────────
  const statusCfg = STATUS_CONFIG[saveStatus] ?? STATUS_CONFIG.saved;
  const StatusIcon = statusCfg.icon;
  const statusLabel =
    saveStatus === "saved" && lastSaved
      ? `Saved at ${lastSaved}`
      : (statusCfg.label ?? "");

  const canSave = !isSaving && !!initialData;
  const pageCount = builderConfig?.pages?.length ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-3">
        {/* Left — save status */}
        <div className="flex items-center gap-2 min-w-0">
          <span className={`size-2 rounded-full shrink-0 ${statusCfg.dot}`} />
          <StatusIcon
            className={`size-3.5 shrink-0 ${statusCfg.text} ${statusCfg.spin ? "animate-spin" : ""}`}
          />
          <span className={`text-xs font-medium truncate ${statusCfg.text}`}>
            {statusLabel}
          </span>
        </div>

        {/* Right — action buttons */}
        <div className="relative flex items-center gap-2 shrink-0">
          {/* Save Draft */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() =>
              canSave &&
              handleSave(latestDataRef.current ?? initialData, "manual")
            }
            disabled={!canSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-purple-300 hover:text-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {isSaving && saveStatus === "saving" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            <span className="hidden sm:inline">Save Draft</span>
          </motion.button>

          {/* Preview Draft */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handlePreview}
            disabled={!initialData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-purple-300 hover:text-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </motion.button>

          {/* Publish — toggles the publish panel */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setShowPublishPanel((prev) => !prev)}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm ${showPublishPanel ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Globe className="size-3.5" />
            )}
            <span className="hidden sm:inline">
              {hasEverPublished ? "Update" : "Publish"}
            </span>
          </motion.button>

          {/* Publish panel */}
          <PublishModal
            isOpen={showPublishPanel}
            onClose={() => setShowPublishPanel(false)}
            projectName={projectName}
            projectId={projectId}
            hasEverPublished={hasEverPublished}
            lastPublishedAt={lastPublishedAt}
            hasChangesSincePublish={hasChangesSincePublish}
            onPublish={handlePublish}
            isPublishing={isSaving}
          />
        </div>
      </div>

      {/* ── Multi-page controls ──────────────────────────────────────────── */}
      {pageCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0 flex-wrap">
          <span className="text-xs text-gray-400 font-medium hidden sm:block">
            Page
          </span>

          {/* Page selector */}
          <div className="relative">
            <select
              value={
                builderConfig.activePageId ?? builderConfig.pages[0]?.id ?? ""
              }
              onChange={(e) => handleSwitchPage(e.target.value)}
              className="pl-3 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none cursor-pointer shadow-sm hover:border-purple-300 transition-colors"
            >
              {builderConfig.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add Page */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAddPage}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:border-purple-300 hover:text-purple-600 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="size-3" />
              <span className="hidden sm:inline">Add Page</span>
            </motion.button>

            {/* Delete Page */}
            <motion.button
              whileHover={pageCount > 1 ? { scale: 1.03 } : {}}
              whileTap={pageCount > 1 ? { scale: 0.97 } : {}}
              type="button"
              onClick={handleDeleteActivePage}
              disabled={pageCount <= 1}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-500 text-xs font-semibold rounded-lg hover:border-red-300 hover:text-red-500 transition-all cursor-pointer shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <Trash2 className="size-3" />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
          </div>

          {/* Page count pill */}
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
            {pageCount} page{pageCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Puck Editor ──────────────────────────────────────────────────── */}
      {initialData && (
        <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          <Puck
            key={builderConfig?.activePageId ?? "home"}
            config={config}
            data={initialData}
            plugins={plugins}
            overrides={{ headerActions: () => null }}
            onPublish={(data) => {
              setInitialData(data);
              latestDataRef.current = data;
              handlePublish(data);
            }}
            onChange={(data) => {
              setInitialData(data);
              latestDataRef.current = data;
              setIsDirty(true);
              setSaveStatus("unsaved");
              setHasChangesSincePublish(true);
            }}
          />
        </div>
      )}

      {/* ── Inline error banner ──────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border-t border-amber-200 shrink-0"
          >
            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
            <p className="text-xs font-medium text-amber-700 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="size-3.5 text-amber-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Dialog ──────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!confirmConfig}
        onClose={() => setConfirmConfig(null)}
        onConfirm={() => {
          confirmConfig?.onConfirm?.();
          setConfirmConfig(null);
        }}
        title={confirmConfig?.title}
        message={confirmConfig?.message}
        variant={confirmConfig?.variant}
        confirmLabel={confirmConfig?.confirmLabel}
        itemName={confirmConfig?.itemName}
      />

      {/* ── Add Page Modal ───────────────────────────────────────────────── */}
      <AddPageModal
        isOpen={showAddPageModal}
        onClose={() => setShowAddPageModal(false)}
        onSubmit={commitAddPage}
        value={newPageTitle}
        onChange={(val) => {
          setNewPageTitle(val);
          if (addPageError) setAddPageError("");
        }}
        error={addPageError}
        existingPages={builderConfig?.pages ?? []}
      />
    </div>
  );
};

export default BuilderEditor;
