"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0, rootMargin = "0px", root = null, triggerOnce = false } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) return;

      elementRef.current = node;

      observerRef.current = new IntersectionObserver(
        ([observerEntry]) => {
          setEntry(observerEntry);
          setIsIntersecting(observerEntry.isIntersecting);

          if (triggerOnce && observerEntry.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true;
            observerRef.current?.disconnect();
          }
        },
        { threshold, rootMargin, root }
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, root, triggerOnce]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { ref, isIntersecting, entry };
}
