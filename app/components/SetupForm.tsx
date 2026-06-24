"use client";

import { useEffect, useState } from "react";
import { Animation } from "./timer";
import CursorLogo from "./CursorLogo";
import CardClock from "./CardClock";
import FlipClock from "./FlipClock";
import AnimationSelect from "./AnimationSelect";

const MAX_DESCRIPTION = 80;

interface SetupFormProps {
  onStart: (
    description: string,
    totalSeconds: number,
    animation: Animation
  ) => void;
  initialAnimation: Animation;
}

function clampNumber(raw: string, max: number): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits === "") return 0;
  return Math.min(max, parseInt(digits, 10));
}

export default function SetupForm({ onStart, initialAnimation }: SetupFormProps) {
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [animation, setAnimation] = useState<Animation>(initialAnimation);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const hasDescription = description.trim().length > 0;
  const hasDuration = totalSeconds > 0;
  const canProceed = hasDescription && hasDuration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    onStart(description, totalSeconds, animation);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col items-center"
      >
        <CursorLogo />

        <h1 className="mt-10 text-4xl sm:text-5xl font-semibold tracking-tight text-center">
          Timer App
        </h1>
        <p className="mt-3 text-muted text-center">Set up your countdown timer</p>

        {/* Description */}
        <div className="mt-8 w-full">
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2"
          >
            Description <span className="text-muted">*</span>
          </label>
          <input
            id="description"
            type="text"
            value={description}
            maxLength={MAX_DESCRIPTION}
            required
            autoFocus
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Team Standup"
            className="w-full rounded-xl bg-card border border-card-border px-5 py-4 text-lg outline-none transition-colors placeholder:text-muted focus:border-foreground/40"
          />
          <div className="mt-1 text-right text-xs text-muted">
            {description.length}/{MAX_DESCRIPTION}
          </div>
        </div>

        {/* Duration */}
        <div className="mt-6 w-full">
          <span className="block text-sm font-semibold mb-2">Duration</span>
          <div className="grid grid-cols-3 gap-4">
            <DurationField
              label="Hours"
              value={hours}
              max={99}
              onChange={setHours}
            />
            <DurationField
              label="Minutes"
              value={minutes}
              max={59}
              onChange={setMinutes}
            />
            <DurationField
              label="Seconds"
              value={seconds}
              max={59}
              onChange={setSeconds}
            />
          </div>
        </div>

        {/* Animation */}
        <div className="mt-6 w-full">
          <span className="block text-sm font-semibold mb-2">Animation</span>
          <AnimationSelect value={animation} onChange={setAnimation} />
          <div className="mt-3">
            <AnimationPreview animation={animation} />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canProceed}
          className="mt-8 w-full rounded-xl bg-foreground px-5 py-4 text-lg font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start Countdown
        </button>
      </form>
    </main>
  );
}

function AnimationPreview({ animation }: { animation: Animation }) {
  const [seconds, setSeconds] = useState(125);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((value) => (value <= 1 ? 125 : value - 1));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-[170px] items-center justify-center overflow-hidden rounded-xl border border-card-border bg-card/40">
      <div className="origin-center scale-[0.42]">
        {animation === "flip" ? (
          <FlipClock seconds={seconds} />
        ) : (
          <CardClock seconds={seconds} variant={animation} />
        )}
      </div>
    </div>
  );
}

function DurationField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? "" : value.toString().padStart(2, "0")}
        placeholder="00"
        onChange={(e) => onChange(clampNumber(e.target.value, max))}
        className="w-full rounded-xl bg-card border border-card-border py-5 text-center text-3xl font-semibold outline-none transition-colors placeholder:text-muted focus:border-foreground/40"
      />
      <span className="text-xs text-muted">{label}</span>
    </label>
  );
}
