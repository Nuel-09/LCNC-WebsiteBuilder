import { Eye, FileEdit, Palette, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function ProjectActionsMenu({
  onClose,
  onEdit,
  onRename,
  onPreview,
  onDelete,
}) {
  const handleAction = (action) => {
    switch (action) {
      case "Edit":
        onEdit();
        break;
      case "Rename":
        onRename();
        break;
      case "Preview":
        onPreview();
        break;
      case "Delete":
        onDelete();
        break;
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-45 z-50"
      >
        <button
          onClick={() => handleAction("Edit")}
          className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer"
        >
          <Palette className="size-4" />
          <span className="text-sm font-medium">Design System</span>
        </button>
        <button
          onClick={() => handleAction("Preview")}
          className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer"
        >
          <Eye className="size-4" />
          <span className="text-sm font-medium">Preview</span>
        </button>
        <button
          onClick={() => handleAction("Rename")}
          className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer"
        >
          <FileEdit className="size-4" />
          <span className="text-sm font-medium">Rename</span>
        </button>
        <div className="my-1 border-t border-gray-200"></div>
        <button
          onClick={() => handleAction("Delete")}
          className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="size-4" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </motion.div>
    </>
  );
}

export default ProjectActionsMenu;
