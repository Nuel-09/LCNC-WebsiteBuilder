import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Info,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

/**
 * ConfirmDialog — two-step reusable confirmation modal.
 *
 * Props:
 *   isOpen        – controls visibility
 *   onClose       – called on cancel / backdrop click / X
 *   onConfirm     – called only after all steps are confirmed
 *   title         – heading text
 *   message       – body description
 *   variant       – "default" (one step) | "danger" (two steps, red final)
 *   confirmLabel  – label for the final confirm button (default "Confirm")
 *   cancelLabel   – label for cancel (default "Cancel")
 *   itemName      – optional name shown prominently in danger step 2
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  itemName,
}) {
  const [step, setStep] = useState(1);

  // Reset step whenever the dialog re-opens
  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleStep1Confirm = () => {
    if (variant === "danger") {
      setStep(2);
    } else {
      onConfirm();
      handleClose();
    }
  };

  const handleFinalConfirm = () => {
    onConfirm();
    handleClose();
  };

  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <AnimatePresence mode="wait">
            {/* ── Step 1 ─────────────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              >
                {/* Icon block */}
                <div
                  className={`flex flex-col items-center text-center px-6 pt-7 pb-5 ${
                    isDanger ? "bg-amber-50" : "bg-blue-50/60"
                  }`}
                >
                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
                      isDanger
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {isDanger ? (
                      <AlertTriangle className="size-8 text-amber-500" />
                    ) : (
                      <Info className="size-8 text-blue-500" />
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">{title}</h2>

                  {message && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {message}
                    </p>
                  )}

                  {isDanger && itemName && (
                    <div className="mt-3 px-3 py-1.5 bg-amber-100 rounded-lg max-w-full">
                      <p className="text-xs font-semibold text-amber-700 truncate">
                        "{itemName}"
                      </p>
                    </div>
                  )}

                  {isDanger && (
                    <p className="text-xs text-amber-600 mt-3 font-medium">
                      A second confirmation will be required.
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 p-4 bg-white">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {cancelLabel}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStep1Confirm}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isDanger
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-linear-to-r from-purple-600 to-blue-600 text-white hover:shadow-md"
                    }`}
                  >
                    {isDanger ? "Continue" : confirmLabel}
                    <ChevronRight className="size-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2 — final danger confirmation ─────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              >
                {/* Red gradient header */}
                <div className="bg-linear-to-r from-red-500 to-red-600 p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <ShieldAlert className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Final Confirmation</p>
                        <p className="text-red-200 text-xs">Step 2 of 2</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="text-red-100 text-xs leading-relaxed">
                    This action is{" "}
                    <strong className="text-white">
                      permanent and irreversible.
                    </strong>{" "}
                    There is no way to undo this once confirmed.
                  </p>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  {itemName && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <Trash2 className="size-4 text-red-500 shrink-0" />
                      <p className="text-sm font-semibold text-red-700 truncate">
                        {itemName}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    You are about to permanently delete this. Confirm below only
                    if you are absolutely sure.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 px-5 pb-5">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFinalConfirm}
                    className="flex-1 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    {confirmLabel}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
