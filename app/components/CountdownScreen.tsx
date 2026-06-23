"use client";

import { TimerState, formatTimeOfDay } from "./timer";
import CursorLogo from "./CursorLogo";
import CardClock from "./CardClock";
import FlipClock from "./FlipClock";

interface CountdownScreenProps {
  state: TimerState;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function CountdownScreen({
  state,
  onPause,
  onResume,
  onCancel,
  isFullscreen,
  onToggleFullscreen,
}: CountdownScreenProps) {
  const paused = state.status === "paused";
  const remaining = state.remainingSeconds;
  const elapsed = Math.max(0, state.totalSeconds - remaining);
  const percent =
    state.totalSeconds > 0
      ? Math.min(100, Math.round((elapsed / state.totalSeconds) * 100))
      : 0;

  const endsAtLabel = state.endsAt ? formatTimeOfDay(state.endsAt) : "--:--";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-6 py-10">
      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-6 top-6 rounded-lg border border-card-border bg-card p-2.5 text-muted transition-colors hover:text-foreground"
      >
        <FullscreenIcon expanded={isFullscreen} />
      </button>

      <CursorLogo />

      {state.description && (
        <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-center">
          {state.description}
        </h1>
      )}

      <div className="mt-10 w-full max-w-5xl">
        {state.animation === "flip" ? (
          <FlipClock seconds={remaining} />
        ) : (
          <CardClock seconds={remaining} variant={state.animation} />
        )}
      </div>

      {/* Progress */}
      <div className="mt-12 w-full max-w-2xl">
        <div className="flex justify-between text-sm text-muted">
          <span>
            Started:{" "}
            {state.startedAt ? formatTimeOfDay(state.startedAt) : "--:--"}
          </span>
          <span>Ends: {endsAtLabel}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-card-border">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-3 text-center text-sm text-muted">
          {paused ? "Paused" : `${percent}% Complete`}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex gap-4">
        <button
          type="button"
          onClick={paused ? onResume : onPause}
          className="min-w-[140px] rounded-xl border border-card-border bg-card px-6 py-3 font-medium transition-colors hover:border-foreground/40"
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-w-[140px] rounded-xl border border-card-border bg-card px-6 py-3 font-medium text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FullscreenIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {expanded ? (
        <>
          <path d="M8 3v5H3" />
          <path d="M21 8h-5V3" />
          <path d="M3 16h5v5" />
          <path d="M16 21v-5h5" />
        </>
      ) : (
        <>
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </>
      )}
    </svg>
  );
}
