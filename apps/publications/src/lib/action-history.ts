export type ActionType = "create" | "edit" | "delete" | "status_change" | "feature" | "unfeature" | "bulk_delete" | "import" | "other";
export type EntityType = "category" | "service_category" | "department" | "book" | "author" | "order" | "blog" | "media" | "support" | "other";

export interface ActionRecord {
  id: string;
  action: ActionType;
  entity: EntityType;
  entityName: string;
  description: string;
  previousState: unknown;
  newState: unknown;
  timestamp: number;
  undoLabel?: string;
  redoLabel?: string;
  undoDescription?: string;
  redoDescription?: string;
}

export interface UndoRedoState {
  undoStack: ActionRecord[];
  redoStack: ActionRecord[];
  lastAction: ActionRecord | null;
}

type Listener = () => void;

const MAX_STACK_SIZE = 50;

class ActionHistoryManager {
  private undoStack: ActionRecord[] = [];
  private redoStack: ActionRecord[] = [];
  private listeners: Set<Listener> = new Set();
  private lastAction: ActionRecord | null = null;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  pushAction(action: Omit<ActionRecord, "id" | "timestamp">) {
    const record: ActionRecord = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    this.undoStack.push(record);
    this.redoStack = [];
    if (this.undoStack.length > MAX_STACK_SIZE) this.undoStack.shift();
    this.lastAction = record;
    this.notify();
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  peekUndo(): ActionRecord | null {
    return this.undoStack[this.undoStack.length - 1] || null;
  }

  peekRedo(): ActionRecord | null {
    return this.redoStack[this.redoStack.length - 1] || null;
  }

  performUndo(): ActionRecord | null {
    if (this.undoStack.length === 0) return null;
    const action = this.undoStack.pop()!;
    this.redoStack.push(action);
    this.lastAction = action;
    this.notify();
    return action;
  }

  performRedo(): ActionRecord | null {
    if (this.redoStack.length === 0) return null;
    const action = this.redoStack.pop()!;
    this.undoStack.push(action);
    this.lastAction = action;
    this.notify();
    return action;
  }

  getHistory(): UndoRedoState {
    return {
      undoStack: [...this.undoStack],
      redoStack: [...this.redoStack],
      lastAction: this.lastAction,
    };
  }

  formatTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
}

export const actionHistory = new ActionHistoryManager();

export function formatActionLabel(action: ActionType): string {
  switch (action) {
    case "create": return "Created";
    case "edit": return "Edited";
    case "delete": return "Deleted";
    case "status_change": return "Status Changed";
    case "feature": return "Featured";
    case "unfeature": return "Unfeatured";
    case "bulk_delete": return "Bulk Deleted";
    case "import": return "Imported";
    default: return "Modified";
  }
}

export function formatEntityType(entity: EntityType): string {
  switch (entity) {
    case "category": return "Category";
    case "service_category": return "Service Category";
    case "department": return "Department";
    case "book": return "Book";
    case "author": return "Author";
    case "order": return "Order";
    case "blog": return "Blog Post";
    case "media": return "Media";
    case "support": return "Support Ticket";
    default: return "Item";
  }
}
