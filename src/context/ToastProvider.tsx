import { useEffect, useState, type ReactNode } from "react";
import { ToastContext } from "./toastContext";

interface Toast {
  id: number; // უნიკალური: ერთი და იგივე ტექსტი ზედიზედ ორჯერაც ახალ toast-ად ითვლება
  message: string;
}

interface ToastProviderProps {
  children: ReactNode;
}

const TOAST_DURATION = 2500; // მილიწამი

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
  }

  // toast გამოჩნდა → TOAST_DURATION-ის შემდეგ ვმალავთ
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION);

    // cleanup: ახალი toast-ისას ძველი ტაიმერი უქმდება, რომ ახალი ნაადრევად არ გაქრეს
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext value={{ showToast }}>
      {children}
      {/* aria-live: ეკრანის წამკითხველი ახალ შეტყობინებას ხმამაღლა წაიკითხავს.
          კონტეინერი ყოველთვის DOM-შია, იცვლება მხოლოდ შიგთავსი */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center sm:inset-x-auto sm:right-6"
      >
        {toast && (
          <p
            key={toast.id}
            className="rounded-xl border-3 border-ink bg-white px-5 py-3 font-bold shadow-brutal"
          >
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext>
  );
}
