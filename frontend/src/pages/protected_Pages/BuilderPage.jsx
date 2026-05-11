import { useNavigate } from "react-router-dom";
import BuilderEditor from "../../components/BuilderEditor";
import { useAppContext } from "../../context/AppContext";
import { motion } from "motion/react";
import {
  ArrowLeft,
  FolderOpen,
  Hammer,
  Layers,
  MousePointerClick,
  Plus,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

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

const FEATURE_HINTS = [
  { icon: MousePointerClick, label: "Drag & Drop", desc: "Visual editing" },
  { icon: Smartphone, label: "Responsive", desc: "Mobile-first design" },
  { icon: Zap, label: "AI Powered", desc: "Smart suggestions" },
  { icon: Layers, label: "Multi-page", desc: "Full site builder" },
];

function BuilderPage() {
  const navigate = useNavigate();
  const { token, selectedProjectId, selectedProject } = useAppContext();

  const badge = selectedProject
    ? SCHOOL_TYPE_BADGE[selectedProject.schoolType]
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* ── Gradient context bar ── */}
      <div className="bg-linear-to-r from-purple-600 via-purple-500 to-blue-600 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/projects")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title="Back to projects"
          >
            <ArrowLeft className="size-4 text-white" />
          </motion.button>

          <div className="flex items-center gap-2.5">
            <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Hammer className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm md:text-base leading-tight">
                Visual Builder
              </h1>
              <p className="text-purple-200 text-xs hidden sm:block">
                Drag-and-drop website editor
              </p>
            </div>
          </div>
        </div>

        {selectedProject ? (
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-semibold leading-tight max-w-48 truncate">
                {selectedProject.projectName}
              </p>
              <p className="text-purple-200 text-xs">Active project</p>
            </div>
            {badge && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
          </div>
        ) : (
          <span className="text-purple-200 text-xs italic hidden sm:block">
            No project selected
          </span>
        )}
      </div>

      {/* ── Editor or empty state ── */}
      {selectedProjectId ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <BuilderEditor
            token={token}
            projectId={selectedProjectId}
            projectName={selectedProject?.projectName}
            onPreviewPage={() => navigate("/view")}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 bg-linear-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center p-6 md:p-10 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center w-full max-w-lg"
          >
            {/* Hero icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative mx-auto mb-8 w-fit"
            >
              <div className="size-28 bg-linear-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-300/50 mx-auto">
                <Hammer className="size-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 size-8 bg-linear-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="size-4 text-white" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Ready to Build?
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                Select an existing project or create a new one to launch the
                visual editor and start building your school's digital presence.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/projects")}
                className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg shadow-purple-200 cursor-pointer flex items-center justify-center gap-2 font-semibold"
              >
                <FolderOpen className="size-4" />
                Open a Project
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/overview")}
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 rounded-xl shadow border border-gray-200 cursor-pointer flex items-center justify-center gap-2 font-semibold hover:border-purple-300 hover:shadow-md transition-all"
              >
                <Plus className="size-4" />
                Create New Project
              </motion.button>
            </motion.div>

            {/* Feature hints grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {FEATURE_HINTS.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.07 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="size-10 bg-linear-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="size-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default BuilderPage;
