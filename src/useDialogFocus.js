import { useEffect } from "react";
// Focus sessions manage their own portalled dialog; this covers in-app dialogs.
export default function useDialogFocus() {
  useEffect(() => {
    const root = document.getElementById("root");
    let active = null,
      previous = null;
    const controls = (d) =>
      Array.from(
        d.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
        ),
      ).filter((el) => el.getClientRects().length);
    const sync = () => {
      const next =
        Array.from(root.querySelectorAll('[role="dialog"]')).at(-1) || null;
      if (next === active) return;
      const old = previous;
      active = next;
      if (next) {
        previous = document.activeElement;
        requestAnimationFrame(() => {
          if (active === next) controls(next)[0]?.focus();
        });
      } else if (old?.isConnected) {
        previous = null;
        old.focus();
      }
    };
    const key = (e) => {
      if (!active || e.key !== "Tab") return;
      const list = controls(active);
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0],
        last = list.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !active.contains(document.activeElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !active.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    document.addEventListener("keydown", key);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", key);
    };
  }, []);
}
