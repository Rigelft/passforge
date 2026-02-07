import { useCallback } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { PasswordHistoryAddInput, PasswordHistoryItem } from "@/types";

const STORAGE_KEY = "passforge.history.v1";
const MAX_ITEMS = 200;

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function usePasswordHistory() {
  const [items, setItems] = useLocalStorageState<PasswordHistoryItem[]>(STORAGE_KEY, []);

  const add = useCallback(
    (input: PasswordHistoryAddInput) => {
      const item: PasswordHistoryItem = {
        id: makeId(),
        createdAt: Date.now(),
        password: input.password,
        accountName: input.accountName?.trim() ? input.accountName.trim() : undefined,
      };

      setItems((prev) => [item, ...prev].slice(0, MAX_ITEMS));
    },
    [setItems],
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    },
    [setItems],
  );

  const clear = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return { items, add, remove, clear };
}
