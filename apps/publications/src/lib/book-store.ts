const STORAGE_KEY = "statement_book_status_overrides";

export function loadOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveOverride(bookId: string, newStatus: string) {
  const overrides = loadOverrides();
  overrides[bookId] = newStatus;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("book-status-changed", { detail: { bookId, newStatus } }));
  }
}

export function getOverrideCount(): number {
  return Object.keys(loadOverrides()).length;
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function onBookStoreChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

if (typeof window !== "undefined") {
  window.addEventListener("book-status-changed", () => {
    listeners.forEach((l) => l());
  });
}
