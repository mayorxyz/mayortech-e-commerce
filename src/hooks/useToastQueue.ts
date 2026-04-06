import { useState, useCallback, useRef } from "react";

export type ToastType = "bookmark" | "unbookmark" | "order" | "cart" | "remove";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  icon: string;
  phase: "in" | "out";
}

let toastId = 0;

export function useToastQueue() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<Array<{ message: string; type: ToastType; icon: string }>>([]);
  const runningRef = useRef(false);

  const processQueue = useCallback(() => {
    if (!queueRef.current.length) {
      runningRef.current = false;
      return;
    }
    runningRef.current = true;
    const { message, type, icon } = queueRef.current.shift()!;
    const id = ++toastId;

    setToasts((prev) => [...prev, { id, message, type, icon, phase: "in" }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, phase: "out" } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        setTimeout(() => processQueue(), 80);
      }, 250);
    }, 2600);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "bookmark", icon: string = "✓") => {
      queueRef.current.push({ message, type, icon });
      if (!runningRef.current) processQueue();
    },
    [processQueue]
  );

  return { toasts, showToast };
}
