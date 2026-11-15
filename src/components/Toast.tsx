"use client";

import { useStore } from "@/context/store";
import { CheckIcon } from "./icons";

export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      {toast && (
        <div className="fade-in flex items-center gap-3 bg-emerald-deep px-5 py-3 text-sm text-ivory shadow-xl">
          <CheckIcon className="text-gold-light" />
          {toast}
        </div>
      )}
    </div>
  );
}
