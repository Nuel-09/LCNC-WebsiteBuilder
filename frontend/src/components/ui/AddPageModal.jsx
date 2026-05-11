import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, FileText, Plus, X } from "lucide-react";

/**
 * AddPageModal
 *
 * Props:
 *   isOpen        – controls visibility
 *   onClose       – called on cancel / backdrop / X
 *   onSubmit      – called when form passes validation (commitAddPage)
 *   value         – controlled input value (newPageTitle)
 *   onChange      – (newValue: string) => void
 *   error         – validation error string (empty = no error)
 *   existingPages – array of { id, title } to show the "already taken" hint
 */
function AddPageModal({
  isOpen,
  onClose,
  onSubmit,
  value,
  onChange,
  error,
  existingPages = [],
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-purple-600 to-blue-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Add New Page</h2>
                    <p className="text-purple-100 text-xs">
                      Create a new page for your website
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Page Name
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g., About Us, Contact, Gallery"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSubmit();
                      if (e.key === "Escape") onClose();
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      error
                        ? "border-red-300 bg-red-50"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5"
                    >
                      <AlertTriangle className="size-3 shrink-0" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Existing pages hint */}
              {existingPages.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-2">
                    Existing pages
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {existingPages.map((page) => (
                      <span
                        key={page.id}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 font-medium"
                      >
                        {page.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onSubmit}
                className="flex-1 py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Create Page
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddPageModal;
