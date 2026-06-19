"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Undo2, Redo2, X, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actionHistory, formatActionLabel, formatEntityType, type ActionRecord } from "@/lib/action-history";

interface UndoRedoModalProps {
  open: boolean;
  type: "undo" | "redo";
  action: ActionRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UndoRedoModal({ open, type, action, onConfirm, onCancel }: UndoRedoModalProps) {
  if (!action) return null;

  const isUndo = type === "undo";
  const Icon = isUndo ? Undo2 : Redo2;
  const color = isUndo ? "text-amber-600" : "text-blue-600";
  const bgColor = isUndo ? "bg-amber-50" : "bg-blue-50";
  const borderColor = isUndo ? "border-amber-200" : "border-blue-200";
  const btnColor = isUndo ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700";

  const timeAgo = actionHistory.formatTimeAgo(action.timestamp);
  const actionLabel = formatActionLabel(action.action);
  const entityLabel = formatEntityType(action.entity);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40" onClick={onCancel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 border border-[#E8DDD0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`h-10 w-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">
                  {isUndo ? "Undo Last Action?" : "Redo Last Action?"}
                </h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4 space-y-2`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C4A3D]">Action:</span>
                <span className="text-sm font-medium text-[#111111]">{actionLabel} {entityLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C4A3D]">{entityLabel}:</span>
                <span className="text-sm font-medium text-[#111111]">{action.entityName}</span>
              </div>
              {action.description && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5C4A3D]">Details:</span>
                  <span className="text-sm text-[#5C4A3D]">{action.description}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-[#5C4A3D]" />
                <span className="text-xs text-[#5C4A3D]">{timeAgo}</span>
              </div>
            </div>

            <p className="text-sm text-[#5C4A3D] mb-5">
              {isUndo
                ? "This action will be reversed."
                : "This action will be reapplied."}
            </p>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={onCancel} className="border-[#E8DDD0] text-[#5C4A3D]">
                Cancel
              </Button>
              <Button size="sm" onClick={onConfirm} className={`${btnColor} text-white`}>
                <Icon className="h-3.5 w-3.5 mr-1" />
                {isUndo ? "Undo Action" : "Redo Action"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
