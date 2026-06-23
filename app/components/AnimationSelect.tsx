"use client";

import { useEffect, useRef, useState } from "react";
import { Animation, ANIMATION_OPTIONS } from "./timer";

interface AnimationSelectProps {
  value: Animation;
  onChange: (value: Animation) => void;
}

export default function AnimationSelect({
  value,
  onChange,
}: AnimationSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    ANIMATION_OPTIONS.find((option) => option.value === value) ??
    ANIMATION_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-card-border bg-card px-5 py-4 text-left transition-colors hover:border-foreground/40"
      >
        <span className="flex flex-col">
          <span className="text-base font-semibold">{selected.label}</span>
          <span className="text-xs text-muted">{selected.description}</span>
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-card-border bg-card shadow-2xl"
        >
          {ANIMATION_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-foreground/10 ${
                    isSelected ? "bg-foreground/5" : ""
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted">
                      {option.description}
                    </span>
                  </span>
                  {isSelected && <Check />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
