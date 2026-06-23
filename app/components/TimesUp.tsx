"use client";

import {
  TimerState,
  formatClock,
  formatDate,
  formatTimeOfDay,
} from "./timer";
import CursorLogo from "./CursorLogo";
import Confetti from "./Confetti";

interface TimesUpProps {
  state: TimerState;
  onReset: () => void;
}

export default function TimesUp({ state, onReset }: TimesUpProps) {
  const endedAt = state.endedAt ?? state.startedAt ?? 0;
  const startedAt = state.startedAt ?? endedAt;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
      <Confetti />

      <div className="rise-in flex flex-col items-center">
        <CursorLogo />

        <div className="mt-8 text-5xl" aria-hidden>
          🎉
        </div>
        <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight">
          Time&apos;s Up!
        </h1>
        {state.description && (
          <p className="mt-3 text-lg text-muted">{state.description}</p>
        )}

        <div className="mt-6 flex gap-4 text-3xl" aria-hidden>
          <span>🏆</span>
          <span>⭐</span>
          <span>🎊</span>
        </div>
      </div>

      {/* Summary */}
      <div className="rise-in mt-10 w-full max-w-md rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-center text-lg font-semibold">Summary</h2>
        <dl className="mt-4 flex flex-col">
          <SummaryRow label="Date" value={formatDate(endedAt)} />
          <SummaryRow label="Started" value={formatTimeOfDay(startedAt)} />
          <SummaryRow label="Ended" value={formatTimeOfDay(endedAt)} />
          <SummaryRow
            label="Total Duration"
            value={formatClock(state.totalSeconds)}
            mono
            last
          />
        </dl>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="rise-in mt-10 rounded-xl bg-foreground px-8 py-3.5 font-semibold text-background transition-opacity hover:opacity-90"
      >
        Start New Countdown
      </button>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 ${
        last ? "" : "border-b border-card-border"
      }`}
    >
      <dt className="text-muted">{label}</dt>
      <dd className={`font-semibold ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
