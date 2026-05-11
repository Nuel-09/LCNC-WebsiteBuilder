import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Copy,
  Check,
  Loader2,
  X,
  Link2,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
} from "lucide-react";

function PublishModal({
  isOpen,
  onClose,
  projectName,
  projectId,
  hasEverPublished,
  lastPublishedAt,
  hasChangesSincePublish,
  onPublish,
  isPublishing,
}) {
  const [copied, setCopied] = useState(false);

  const publicUrl = projectId
    ? `${window.location.origin}/site/${projectId}`
    : "";

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const ctaActive = !isPublishing && hasChangesSincePublish;

  const statusLabel = !hasEverPublished
    ? "Draft"
    : hasChangesSincePublish
      ? "Changes Pending"
      : "Live";

  const statusStyle = !hasEverPublished
    ? { dot: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50 border-amber-100" }
    : hasChangesSincePublish
      ? { dot: "bg-orange-400", text: "text-orange-600", bg: "bg-orange-50 border-orange-100" }
      : { dot: "bg-emerald-400 animate-pulse", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };

  const ctaBg = ctaActive
    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-purple-300/60 cursor-pointer"
    : hasEverPublished
      ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
      : "bg-gray-100 text-gray-400 cursor-not-allowed";

  const CtaIcon = isPublishing
    ? Loader2
    : !ctaActive && hasEverPublished
      ? CheckCircle2
      : hasEverPublished
        ? RefreshCw
        : Sparkles;

  const ctaLabel = isPublishing
    ? "Publishing…"
    : !ctaActive && hasEverPublished
      ? "Up to date"
      : hasEverPublished
        ? "Update Site"
        : "Publish Site";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click-outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Dropdown panel */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-2.5 w-[22rem] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 z-50 overflow-hidden"
          >
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Globe className="size-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">
                    Publish to Web
                  </h3>
                  <p className="text-purple-200 text-xs mt-0.5">
                    Go live in one click
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <X className="size-4 text-white" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Site name */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Site Name
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {projectName || "Untitled Project"}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* URL */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  URL
                </p>
                {hasEverPublished ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <Link2 className="size-3.5 text-purple-400 shrink-0" />
                    <span className="text-xs text-gray-600 flex-1 truncate font-medium">
                      {publicUrl}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className="p-1 hover:bg-gray-200 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Copy URL"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5 text-gray-400" />
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-dashed border-gray-200">
                    <Link2 className="size-3.5 text-gray-300 shrink-0" />
                    <span className="text-xs text-gray-400 italic">
                      Available after first publish
                    </span>
                  </div>
                )}
              </div>

              {/* Status + Last published */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Status
                  </p>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${statusStyle.bg}`}
                  >
                    <span
                      className={`size-1.5 rounded-full shrink-0 ${statusStyle.dot}`}
                    />
                    <span className={`text-xs font-semibold ${statusStyle.text}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Last Published
                  </p>
                  {lastPublishedAt ? (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 font-medium leading-tight">
                        {lastPublishedAt}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Never</span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={ctaActive ? { scale: 1.02 } : {}}
                whileTap={ctaActive ? { scale: 0.98 } : {}}
                onClick={ctaActive ? onPublish : undefined}
                disabled={!ctaActive}
                className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${ctaBg}`}
              >
                <CtaIcon
                  className={`size-4 ${isPublishing ? "animate-spin" : ""}`}
                />
                {ctaLabel}
              </motion.button>

              {/* Subtext */}
              {!isPublishing && !ctaActive && hasEverPublished && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-gray-400"
                >
                  Your site is live and up to date.
                </motion.p>
              )}
              {!hasEverPublished && (
                <p className="text-center text-xs text-gray-400">
                  Your site will be publicly accessible after publishing.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PublishModal;
