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
}

export default function CountdownScreen({
  state,
  onPause,
  onResume,
  onCancel,
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
