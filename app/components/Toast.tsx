"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

type ToastContextType = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border text-sm animate-slide-up max-w-sm ${
              t.kind === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                : t.kind === "error"
                ? "bg-red-500/15 border-red-500/40 text-red-200"
                : "bg-void-accent-soft border-void-accent/40 text-void-text"
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
