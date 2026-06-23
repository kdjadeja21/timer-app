"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Animation,
  STORAGE_KEY,
  TimerState,
  createInitialState,
} from "./timer";
import SetupForm from "./SetupForm";
import CountdownScreen from "./CountdownScreen";
import TimesUp from "./TimesUp";

/* ----------------------------------------------------------------- */
/* External store backed by localStorage                             */
/* ----------------------------------------------------------------- */
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

function writeState(state: TimerState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence failures (e.g. storage disabled)
  }
  emitChange();
}

export default function TimerApp() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [now, setNow] = useState(() => Date.now());

  // Fullscreen lives on a persistent wrapper so it survives the
  // running -> done phase swap (the celebration stays fullscreen).
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await rootRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fullscreen may be blocked; ignore
    }
  }, []);

  const baseState = useMemo<TimerState>(() => {
    if (!raw) return createInitialState();
    try {
      return { ...createInitialState(), ...(JSON.parse(raw) as TimerState) };
    } catch {
      return createInitialState();
    }
  }, [raw]);

  // Derive the live display state from the persisted state plus the ticking clock.
  const state = useMemo<TimerState>(() => {
    if (baseState.status === "running" && baseState.endsAt) {
      const remaining = Math.ceil((baseState.endsAt - now) / 1000);
      if (remaining <= 0) {
        return {
          ...baseState,
          remainingSeconds: 0,
          status: "done",
          endedAt: baseState.endedAt ?? baseState.endsAt,
        };
      }
      return { ...baseState, remainingSeconds: remaining };
    }
    return baseState;
  }, [baseState, now]);

  // Tick while running.
  useEffect(() => {
    if (state.status !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.status]);

  // Persist the terminal "done" transition so refresh stays on the summary.
  useEffect(() => {
    if (state.status === "done" && baseState.status !== "done") {
      writeState(state);
    }
  }, [state, baseState.status]);

  const startCountdown = useCallback(
    (description: string, totalSeconds: number, animation: Animation, finalMessage: string) => {
      const startedAt = Date.now();
      setNow(startedAt);
      writeState({
        description: description.trim(),
        totalSeconds,
        endsAt: startedAt + totalSeconds * 1000,
        remainingSeconds: totalSeconds,
        startedAt,
        endedAt: null,
        animation,
        finalMessage,
        status: "running",
      });
    },
    []
  );

  const pause = useCallback(() => {
    writeState({
      ...state,
      status: "paused",
      remainingSeconds: state.remainingSeconds,
      endsAt: null,
    });
  }, [state]);

  const resume = useCallback(() => {
    const resumedAt = Date.now();
    setNow(resumedAt);
    writeState({
      ...state,
      status: "running",
      endsAt: resumedAt + state.remainingSeconds * 1000,
    });
  }, [state]);

  const reset = useCallback(() => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    writeState(createInitialState());
  }, []);

  let content;
  if (state.status === "setup") {
    content = (
      <SetupForm onStart={startCountdown} initialAnimation={state.animation} />
    );
  } else if (state.status === "done") {
    content = <TimesUp state={state} onReset={reset} />;
  } else {
    content = (
      <CountdownScreen
        state={state}
        onPause={pause}
        onResume={resume}
        onCancel={reset}
      />
    );
  }

  return (
    <div ref={rootRef} className="relative flex flex-1 flex-col bg-background">
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-6 top-6 z-30 rounded-lg border border-card-border bg-card p-2.5 text-muted transition-colors hover:text-foreground"
      >
        <FullscreenIcon expanded={isFullscreen} />
      </button>
      {content}
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
