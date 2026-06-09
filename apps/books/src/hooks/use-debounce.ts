"use client";

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 500
): T {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => callback(...args), delay);
    setTimer(newTimer);
  }) as T;
}
