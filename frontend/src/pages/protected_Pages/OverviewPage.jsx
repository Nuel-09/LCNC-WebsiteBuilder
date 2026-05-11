import { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Users,
  FileText,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  WifiOff,
  X,
  ChevronRight,
  Activity,
  Star,
  Download,
  MoreVertical,
  Check,
} from "lucide-react";
import CreateProjectModal from "@/components/ui/CreateProjectModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import ProjectActionsMenu from "@/components/ui/ProjectActionMenu";
import { useAppContext } from "@/context/AppContext";

const SCHOOL_TYPE_EMOJI = {
  primary: "🏫",
  secondary: "🎓",
  rms: "🏛️",
};

const SCHOOL_TYPE_BADGE = {
  primary: {
    label: "Primary",
    className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
  secondary: {
    label: "Secondary",
    className: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  },
  rms: {
    label: "RMS",
    className: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  },
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes || 1} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
}

const Overview = () => {
  const navigate = useNavigate();
  const {
    projects,
    isLoading,
    selectProject,
    deleteExistingProject,
    updateExistingProject,
  } = useAppContext();

  const [openMenuProjectId, setOpenMenuProjectId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [renamingProjectId, setRenamingProjectId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmConfig, setConfirmConfig] = useState(null);

  const recentProjects = projects.slice(0, 4);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      change: "All time",
      trend: "up",
      icon: Globe,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Active Visitors",
      value: "2,847",
      change: "+12% vs last week",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Pages Created",
      value: "48",
      change: "+8 this week",
      trend: "up",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Completion Rate",
      value: "94%",
      change: "+5% improvement",
      trend: "up",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  const handleRenameSubmit = async (project) => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== project.projectName) {
      await updateExistingProject(project.id, {
        projectName: trimmed,
        schoolType: project.schoolType,
      });
    }
    setRenamingProjectId(null);
  };

  const handleDeleteProject = (project) => {
    setConfirmConfig({
      title: "Delete Project",
      message: "All pages and content inside this project will be permanently removed.",
      variant: "danger",
      confirmLabel: "Delete Project",
      itemName: project.projectName,
      onConfirm: () => deleteExistingProject(project.id),
    });
  };

  const activities = [
    {
      action: "Published",
      target: "Main School Website",
      time: "2 hours ago",
      user: "You",
    },
    {
      action: "Edited",
      target: "Student Portal",
      time: "5 hours ago",
      user: "John Okonkwo",
    },
    {
      action: "Created",
      target: "Admissions 2026",
      time: "1 day ago",
      user: "You",
    },
    {
      action: "Approved",
      target: "Staff Directory",
      time: "2 days ago",
      user: "Admin",
    },
  ];

  const templates = [
    { name: "Results Portal", category: "Academic", icon: "📊" },
    { name: "Event Calendar", category: "Community", icon: "📅" },
    { name: "News & Updates", category: "Communication", icon: "📰" },
    { name: "Gallery", category: "Media", icon: "🖼️" },
  ];

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-xl cursor-pointer transition-all flex items-center justify-center md:justify-start gap-3 group"
          >
            <Plus className="size-5" />
            <span className="font-semibold">Create New Project</span>
            <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`size-12 bg-linear-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="size-6 text-white" />
                </div>
                {stat.trend === "up" && (
                  <TrendingUp className="size-5 text-green-500" />
                )}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>{stat.change}</span>
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Projects
              </h2>
              <button
                onClick={() => navigate("/projects")}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 hover:underline transition cursor-pointer"
              >
                View all
                <ChevronRight className="size-4" />
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Globe className="size-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No projects yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Create New Project" to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="size-10 md:size-12 bg-linear-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0">
                        {SCHOOL_TYPE_EMOJI[project.schoolType] ?? "🏫"}
                      </div>
                      <div className="min-w-0 flex-1">
                        {renamingProjectId === project.id ? (
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleRenameSubmit(project);
                                if (e.key === "Escape")
                                  setRenamingProjectId(null);
                              }}
                              className="flex-1 text-sm font-semibold border-b-2 border-purple-500 outline-none bg-transparent text-gray-900 min-w-0"
                            />
                            <button
                              onClick={() => handleRenameSubmit(project)}
                              disabled={isLoading}
                              className="text-green-600 hover:text-green-700 shrink-0 disabled:opacity-50"
                            >
                              <Check className="size-4" />
                            </button>
                            <button
                              onClick={() => setRenamingProjectId(null)}
                              className="text-gray-400 hover:text-gray-600 shrink-0"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                            {project.projectName}
                          </h3>
                        )}
                        <div className="flex items-center gap-2 md:gap-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatRelativeTime(
                              project.updatedAt ?? project.createdAt,
                            )}
                          </span>
                          {(() => {
                            const badge =
                              SCHOOL_TYPE_BADGE[project.schoolType];
                            return badge ? (
                              <span
                                className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs ${
                          project.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <span className="hidden sm:inline capitalize">
                          {project.status ?? "Draft"}
                        </span>
                        <span className="sm:hidden">
                          {(project.status ?? "D").charAt(0).toUpperCase()}
                        </span>
                      </span>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuProjectId(
                              openMenuProjectId === project.id
                                ? null
                                : project.id,
                            );
                          }}
                          className="p-2 hover:bg-white cursor-pointer rounded-lg transition-colors"
                        >
                          <MoreVertical className="size-4 md:size-5 text-gray-600" />
                        </button>
                        {openMenuProjectId === project.id && (
                          <ProjectActionsMenu
                            onClose={() => setOpenMenuProjectId(null)}
                            onRename={() => {
                              setRenamingProjectId(project.id);
                              setRenameValue(project.projectName);
                            }}
                            onEdit={() => {
                              selectProject(project.id);
                              navigate("/design");
                            }}
                            onPreview={() => {
                              selectProject(project.id);
                              navigate("/builder/preview");
                            }}
                            onDelete={() => handleDeleteProject(project)}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="size-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Activity className="size-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action.toLowerCase()}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Quick Start Templates
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Get started with education-specific templates
                </p>
              </div>
              <Star className="size-6 text-yellow-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
              {templates.map((template, index) => (
                <motion.button
                  key={template.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-3 md:p-4 bg-linear-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-transparent hover:border-purple-300 transition-all group"
                >
                  <div className="text-2xl md:text-3xl mb-2">
                    {template.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs md:text-sm group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {template.category}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl p-4 md:p-6 shadow-lg text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-2">
                  Offline-First Technology
                </h2>
                <p className="text-purple-100 text-xs md:text-sm">
                  Work seamlessly even with intermittent connectivity
                </p>
              </div>
              <WifiOff className="size-6 md:size-8 text-purple-200 shrink-0" />
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-300" />
                <span className="text-sm">All changes saved locally</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-300" />
                <span className="text-sm">Optimized for 3G networks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-300" />
                <span className="text-sm">Auto-sync when online</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-300" />
                <span className="text-sm">NDPA 2023 compliant</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-white text-purple-600 rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
              <Download className="size-4" />
              <span className="font-semibold">Download Offline Mode</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

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
    </>
  );
};

export default Overview;
