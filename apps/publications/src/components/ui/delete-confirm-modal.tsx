"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  entityName: string;
  entityType?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteConfirmModal({ open, title, description, entityName, entityType = "Item", confirmLabel, onConfirm, onCancel, onOpenChange }: DeleteConfirmModalProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange?.(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40" onClick={handleCancel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-[#E8DDD0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#111111]">{title}</h3>
            </div>

            {description && (
              <p className="text-sm text-[#5C4A3D] mb-3">{description}</p>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C4A3D]">{entityType}:</span>
                <span className="text-sm font-medium text-[#111111]">{entityName}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">This action cannot be undone unless restored through Undo.</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancel} className="border-[#E8DDD0] text-[#5C4A3D]">
                Cancel
              </Button>
              <Button size="sm" onClick={onConfirm} className="bg-rose-600 hover:bg-rose-700 text-white">
                <Trash2 className="h-3.5 w-3.5 mr-1" />{confirmLabel || `Delete ${entityType}`}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
