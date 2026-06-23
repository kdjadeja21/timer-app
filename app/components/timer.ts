export type Animation = "default" | "flip" | "slide" | "fade";

export interface AnimationOptionConfig {
  value: Animation;
  label: string;
  description: string;
}

// Single source of truth for available animations. Add new entries here and
// they automatically appear in the setup dropdown.
export const ANIMATION_OPTIONS: AnimationOptionConfig[] = [
  { value: "default", label: "Default", description: "Clean digit cards" },
  { value: "flip", label: "Flip", description: "Flip-clock motion" },
  { value: "slide", label: "Slide", description: "Odometer roll" },
  { value: "fade", label: "Fade", description: "Blur crossfade" },
];
export type Status = "setup" | "running" | "paused" | "done";

export interface TimerState {
  description: string;
  totalSeconds: number;
  endsAt: number | null;
  remainingSeconds: number;
  startedAt: number | null;
  endedAt: number | null;
  animation: Animation;
  finalMessage: string;
  status: Status;
}

export const DEFAULT_FINAL_MESSAGE = "Time's Up!";
export const MAX_FINAL_MESSAGE = 80;

export const STORAGE_KEY = "timer-app";

export function createInitialState(): TimerState {
  return {
    description: "",
    totalSeconds: 0,
    endsAt: null,
    remainingSeconds: 0,
    startedAt: null,
    endedAt: null,
    animation: "default",
    finalMessage: DEFAULT_FINAL_MESSAGE,
    status: "setup",
  };
}

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export function splitSeconds(totalSeconds: number): TimeParts {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}

export function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatClock(totalSeconds: number): string {
  const { hours, minutes, seconds } = splitSeconds(totalSeconds);
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

export function formatTimeOfDay(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(epochMs: number): string {
  return new Date(epochMs).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
