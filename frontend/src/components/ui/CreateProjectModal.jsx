import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { School } from "@/assets/svg/commonSvg";
import { ChevronRight, Globe, Loader2, Plus, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";

function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const { createNewProject, isLoading, projects } = useAppContext();
  const [form, setForm] = useState({ name: "", type: "primary" });
  const [nameError, setNameError] = useState("");

  const handleNameChange = (e) => {
    setForm({ ...form, name: e.target.value });
    if (nameError) setNameError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    const isDuplicate = projects.some(
      (p) => p.projectName.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setNameError(`A project named "${trimmed}" already exists.`);
      return;
    }
    await createNewProject({ projectName: trimmed, schoolType: form.type });
    setForm({ name: "", type: "primary" });
    setNameError("");
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-linear-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <p className="text-purple-100 text-sm">
                  Build your school's digital presence
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Name
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                id="project-name"
                type="text"
                required
                minLength={3}
                placeholder="e.g., Main School Website"
                value={form.name}
                onChange={handleNameChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${nameError ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-purple-500"}`}
              />
            </div>
            {nameError && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{nameError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="project-type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              School Type
            </label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
              <select
                id="project-type"
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="rms">RMS (Resource Management System)</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 text-sm mb-1">
                  AI Assistant Ready
                </h4>
                <p className="text-xs text-purple-700">
                  Your project will include AI-powered guidance, offline-first
                  capabilities, and education-specific templates optimized for
                  Nigerian schools.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg cursor-pointer hover:bg-linear-to-r hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Project
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateProjectModal;
