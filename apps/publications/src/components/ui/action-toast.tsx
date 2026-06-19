"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
  undoAction?: () => void;
}

interface ToastContextType {
  showToast: (type: "success" | "error", message: string, undoAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: "success" | "error", message: string, undoAction?: () => void) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message, undoAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border backdrop-blur-sm ${
                toast.type === "success"
                  ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                  : "bg-rose-50/95 border-rose-200 text-rose-800"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
              {toast.undoAction && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs font-semibold hover:bg-black/5 flex-shrink-0"
                  onClick={() => {
                    toast.undoAction?.();
                    dismissToast(toast.id);
                  }}
                >
                  <Undo2 className="h-3 w-3 mr-1" />Undo
                </Button>
              )}
              <button onClick={() => dismissToast(toast.id)} className="ml-1 flex-shrink-0 hover:opacity-70">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
