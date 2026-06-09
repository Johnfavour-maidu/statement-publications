"use client";

import { useEffect, useRef } from "react";

type Event = MouseEvent | TouchEvent;

export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  options?: {
    enabled?: boolean;
    exclude?: React.RefObject<HTMLElement>[];
  }
): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const enabled = options?.enabled ?? true;
  const exclude = options?.exclude ?? [];

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const target = event.target as Node;

      if (!ref.current || ref.current.contains(target)) return;

      for (const ex of exclude) {
        if (ex.current?.contains(target)) return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, enabled, exclude]);

  return ref;
}