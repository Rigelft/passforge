import { useEffect, useState } from "react";

function readLocalStorageJson<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function useLocalStorageState<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    }
    const fromStorage = readLocalStorageJson<T>(key);
    if (fromStorage !== undefined) return fromStorage;
    return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [key, value]);

  return [value, setValue] as const;
}
