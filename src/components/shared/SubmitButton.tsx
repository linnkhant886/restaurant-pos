"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SubmitButtonProp = {
  className?: string;
  text: string;
  loading?: boolean;
  variant?: string;
  size?: string;
};

export function SubmitButton({ className, text, loading, variant, size }: SubmitButtonProp) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
        "hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Please wait…
        </>
      ) : (
        text
      )}
    </button>
  );
}
