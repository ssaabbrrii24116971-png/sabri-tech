"use client";

import { Minus, Plus } from "lucide-react";
import { t } from "@/i18n";
import { cn } from "@/lib/format";

export function QuantityInput({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className={cn("grid place-items-center rounded-s-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40", h)}
        aria-label={t.cart.decrease}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("min-w-8 text-center font-semibold tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={cn("grid place-items-center rounded-e-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40", h)}
        aria-label={t.cart.increase}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
