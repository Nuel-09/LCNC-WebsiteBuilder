import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { motion, AnimatePresence } from "motion/react";
import configurationApi from "../../services/configurationService";
import { useAppContext } from "../../context/AppContext";
import { getDefaultLayout, puckConfig } from "../../components/puckConfig";
import {
  ensureBuilderShape,
  getActivePageData,
} from "../../components/builderConfigUtils";
import {
  ArrowLeft,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Hammer,
  Copy,
  Check,
  AlertTriangle,
  FileCode,
  RefreshCw,
} from "lucide-react";

const DEVICE_OPTIONS = [
  { id: "desktop", Icon: Monitor, label: "Desktop" },
  { id: "tablet", Icon: Tablet, label: "Tablet" },
  { id: "mobile", Icon: Smartphone, label: "Mobile" },
];

const DEVICE_WIDTH = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[390px]",
};

const SCHOOL_TYPE_BADGE = {
  primary: {
    label: "Primary",
    className: "bg-emerald-400/30 text-emerald-100 ring-1 ring-emerald-300/40",
  },
  secondary: {
    label: "Secondary",
    className: "bg-blue-400/30 text-blue-100 ring-1 ring-blue-300/40",
  },
  rms: {
    label: "RMS",
    className: "bg-violet-400/30 text-violet-100 ring-1 ring-violet-300/40",
  },
};

function BuilderPreviewPage() {
  const navigate = useNavigate();
  const { selectedProjectId, selectedProject } = useAppContext();

  const [data, setData] = useState({ content: [] });
  const [builderConfig, setBuilderConfig] = useState(null);
  const [activePageId, setActivePageId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [device, setDevice] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ensureBuilderShape handles both string JSON and plain objects internally
  const loadDraftConfig = useCallback(async (isRefresh = false) => {
    if (!selectedProjectId) {
      setError("No project selected. Go back and select a project first.");
      setIsLoading(false);
      return;
    }
    try {
      if (!isRefresh) setIsLoading(true);
      setError("");
      const result = await configurationApi.getConfiguration(selectedProjectId);
      const normalized = ensureBuilderShape(
        result?.configJson,
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
          "Failed to load draft preview.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadDraftConfig(false);
  }, [loadDraftConfig]);

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadDraftConfig(true);
  }, [loadDraftConfig]);

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/site/${selectedProjectId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const badge = selectedProject
    ? SCHOOL_TYPE_BADGE[selectedProject.schoolType]
    : null;
  const pages = builderConfig?.pages ?? [];
  const activePage = pages.find((p) => p.id === activePageId);

  return (
    <div className="flex flex-col h-screen bg-[#0d0d14] overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 shadow-xl gap-3">
        {/* Left — back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Back"
          >
            <ArrowLeft className="size-4 text-white" />
          </motion.button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Eye className="size-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm md:text-base leading-tight">
                Draft Preview
              </h1>
              <p className="text-purple-200 text-xs hidden sm:block truncate max-w-40">
                {selectedProject?.projectName ?? "No project selected"}
              </p>
            </div>
          </div>
        </div>

        {/* Center — device selector */}
        <div className="hidden sm:flex items-center gap-0.5 bg-white/10 rounded-xl p-1 border border-white/10">
          {DEVICE_OPTIONS.map(({ id, Icon, label }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDevice(id)}
              title={label}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                device === id
                  ? "bg-white text-purple-600 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="size-3.5" />
            </motion.button>
          ))}
        </div>

        {/* Right — badges + actions */}
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold hidden md:block ${badge.className}`}
            >
              {badge.label}
            </span>
          )}

          <span className="hidden sm:block px-2.5 py-1 bg-amber-400/25 text-amber-200 ring-1 ring-amber-300/30 rounded-full text-xs font-semibold">
            Draft
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh preview"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 text-white ${isRefreshing ? "animate-spin" : ""}`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Hammer className="size-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </motion.button>
        </div>
      </div>

      {/* ── Page tabs ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isLoading && pages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1 px-4 py-2 bg-[#15151f] border-b border-white/5 shrink-0 overflow-x-auto"
          >
            {pages.map((page) => (
              <motion.button
                key={page.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePageId(page.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  page.id === activePageId
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {page.title}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview canvas ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto flex items-start justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {/* Loading skeleton */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60">
                <div className="bg-[#13131c] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500/40" />
                    <div className="size-3 rounded-full bg-amber-500/40" />
                    <div className="size-3 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="flex-1 h-5 bg-white/5 rounded-md animate-pulse" />
                </div>
                <div className="bg-white p-8 space-y-5 min-h-96">
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-2/3" />
                  <div className="space-y-2">
                    {[100, 85, 90, 70].map((w, i) => (
                      <div
                        key={i}
                        className="h-3.5 bg-gray-100 rounded-full animate-pulse"
                        style={{ width: `${w}%`, animationDelay: `${i * 0.07}s` }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 bg-gray-100 rounded-xl animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    {[80, 65].map((w, i) => (
                      <div
                        key={i}
                        className="h-3.5 bg-gray-100 rounded-full animate-pulse"
                        style={{ width: `${w}%`, animationDelay: `${(i + 4) * 0.07}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center p-8 max-w-sm mt-16"
            >
              <div className="size-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-5">
                <AlertTriangle className="size-8 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                Preview Unavailable
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {error}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Go Back
              </motion.button>
            </motion.div>
          )}

          {/* Live preview */}
          {!isLoading && !error && (
            <motion.div
              key={device}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`${DEVICE_WIDTH[device]} max-w-full`}
            >
              {/* Browser chrome */}
              <div className="rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/70">
                {/* Title bar */}
                <div className="bg-[#1a1a26] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="size-3 rounded-full bg-red-500/60" />
                    <div className="size-3 rounded-full bg-amber-500/60" />
                    <div className="size-3 rounded-full bg-emerald-500/60" />
                  </div>

                  <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 min-w-0">
                    <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-xs text-gray-500 truncate font-mono">
                      {selectedProject?.projectName ?? "Draft"}
                      {activePage?.slug ? ` · /${activePage.slug}` : " · /"}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                      Draft
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleCopyUrl}
                    title="Copy public URL"
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5 text-gray-500" />
                    )}
                  </motion.button>
                </div>

                {/* Rendered site content */}
                <div className="bg-white overflow-x-hidden">
                  <Render config={puckConfig} data={data} />
                </div>
              </div>

              {/* Bottom meta strip */}
              <div className="flex items-center justify-center gap-3 mt-4 pb-2">
                <span className="text-xs text-gray-600 flex items-center gap-1.5">
                  <FileCode className="size-3" />
                  {pages.length} page{pages.length !== 1 ? "s" : ""}
                </span>
                <span className="size-1 rounded-full bg-gray-700" />
                <span className="text-xs text-amber-500/70 font-semibold uppercase tracking-wider">
                  Draft
                </span>
                {selectedProject?.updatedAt && (
                  <>
                    <span className="size-1 rounded-full bg-gray-700" />
                    <span className="text-xs text-gray-600">
                      Updated{" "}
                      {new Date(selectedProject.updatedAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BuilderPreviewPage;
