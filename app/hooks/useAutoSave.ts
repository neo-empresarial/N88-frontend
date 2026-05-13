"use client";

import { useEffect, useRef } from "react";

interface UseAutoSaveProps {
  data: unknown;
  isEnabled: boolean;
  onSave: () => Promise<void>;
  debounceMs?: number;
}

export const useAutoSave = ({
  data,
  isEnabled,
  onSave,
  debounceMs = 1000,
}: UseAutoSaveProps): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isEnabled || data === lastSaveRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave();
        lastSaveRef.current = data;
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, isEnabled, onSave, debounceMs]);
};
