"use client";

import { useState, useEffect, useCallback } from "react";
import { actionHistory, type ActionRecord, type ActionType, type EntityType } from "@/lib/action-history";

export function useActionHistory() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return actionHistory.subscribe(() => forceUpdate((n) => n + 1));
  }, []);

  const pushAction = useCallback((action: Omit<ActionRecord, "id" | "timestamp">) => {
    actionHistory.pushAction(action);
  }, []);

  const canUndo = actionHistory.canUndo();
  const canRedo = actionHistory.canRedo();
  const peekUndo = actionHistory.peekUndo();
  const peekRedo = actionHistory.peekRedo();
  const history = actionHistory.getHistory();

  return { pushAction, canUndo, canRedo, peekUndo, peekRedo, history };
}

export function useUndoRedo(onUndo: (action: ActionRecord) => void, onRedo: (action: ActionRecord) => void) {
  useEffect(() => {
    const handleUndoEvent = () => {
      const action = actionHistory.peekUndo();
      if (action) onUndo(action);
    };
    const handleRedoEvent = () => {
      const action = actionHistory.peekRedo();
      if (action) onRedo(action);
    };
    window.addEventListener("editor-undo", handleUndoEvent);
    window.addEventListener("editor-redo", handleRedoEvent);
    return () => {
      window.removeEventListener("editor-undo", handleUndoEvent);
      window.removeEventListener("editor-redo", handleRedoEvent);
    };
  }, [onUndo, onRedo]);
}
