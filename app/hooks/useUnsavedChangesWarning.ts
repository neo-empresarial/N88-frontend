"use client";

import { useEffect } from "react";

/**
 * Warns the user before they leave the page if `isDirty` is true.
 * Handles:
 *   - Browser tab close / refresh (beforeunload)
 *   - Next.js client-side navigation via clicking links (popstate + capture)
 */
export function useUnsavedChangesWarning(isDirty: boolean) {
  // Native browser unload (refresh, tab close, new URL typed in address bar)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      // Modern browsers show a generic message; the custom message is ignored.
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Next.js App Router doesn't expose a beforeRouteChange hook, so we
  // intercept anchor clicks at the capture phase to prompt before navigation.
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Ignore same-page anchors and non-navigating links
      if (!href || href.startsWith("#") || href.startsWith("javascript")) return;

      const confirmed = window.confirm(
        "Você tem alterações não salvas. Deseja sair mesmo assim?"
      );
      if (!confirmed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);
}
