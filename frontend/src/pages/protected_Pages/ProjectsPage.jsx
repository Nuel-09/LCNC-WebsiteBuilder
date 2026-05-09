import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Clock,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { School } from "@/assets/svg/commonSvg";
import ProjectActionsMenu from "@/components/ui/ProjectActionMenu";
import CreateProjectModal from "@/components/ui/CreateProjectModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useNavigate } from "react-router-dom";
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreatedDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Projects = () => {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.projectName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || p.schoolType === filterType;
      return matchesSearch && matchesType;
    });
  }, [projects, searchQuery, filterType]);

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

  const handleDelete = (project) => {
    setConfirmConfig({
      title: "Delete Project",
      message: "All pages and content inside this project will be permanently removed.",
      variant: "danger",
      confirmLabel: "Delete Project",
      itemName: project.projectName,
      onConfirm: () => deleteExistingProject(project.id),
    });
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              All Projects
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} total project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 group self-start sm:self-auto"
          >
            <Plus className="size-5" />
            <span className="font-semibold">New Project</span>
          </motion.button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">All Types</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="rms">RMS</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="size-20 bg-linear-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <FolderOpen className="size-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchQuery || filterType !== "all"
                ? "No projects match your filters"
                : "No projects yet"}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter."
                : "Create your first project to get started building your school's digital presence."}
            </p>
            {!searchQuery && filterType === "all" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="size-5" />
                <span className="font-semibold">Create First Project</span>
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project, index) => {
              const badge = SCHOOL_TYPE_BADGE[project.schoolType];
              const isPublished = project.status === "published";

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
                >
                  {/* Card thumbnail */}
                  <div className="bg-linear-to-br from-purple-100 to-blue-100 p-8 flex items-center justify-center rounded-t-2xl">
                    <span className="text-6xl select-none">
                      {SCHOOL_TYPE_EMOJI[project.schoolType] ?? "🏫"}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      {renamingProjectId === project.id ? (
                        <div
                          className="flex items-center gap-1 flex-1"
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
                            className="flex-1 text-base font-bold border-b-2 border-purple-500 outline-none bg-transparent text-gray-900 min-w-0"
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
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-base leading-snug flex-1">
                          {project.projectName}
                        </h3>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isPublished
                              ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                              : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
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
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreVertical className="size-4 text-gray-500" />
                          </button>
                          {openMenuProjectId === project.id && (
                            <ProjectActionsMenu
                              onClose={() => setOpenMenuProjectId(null)}
                              onEdit={() => {
                                selectProject(project.id);
                                navigate("/design");
                              }}
                              onPreview={() => {
                                selectProject(project.id);
                                navigate("/builder/preview");
                              }}
                              onRename={() => {
                                setRenamingProjectId(project.id);
                                setRenameValue(project.projectName);
                              }}
                              onDelete={() => handleDelete(project)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 text-sm text-gray-500 flex-1">
                      <div className="flex items-center gap-2">
                        <School className="size-4 shrink-0" />
                        {badge ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ) : (
                          <span className="capitalize">
                            {project.schoolType ?? "General"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 shrink-0" />
                        <span>
                          Edited{" "}
                          {formatRelativeTime(
                            project.updatedAt ?? project.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        Created {formatCreatedDate(project.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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

export default Projects;
