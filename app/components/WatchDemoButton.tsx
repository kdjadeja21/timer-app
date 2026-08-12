"use client";

import { useRef, useState } from "react";

export type DemoChapter = { id: string; label: string; startSec: number };

export const PRODUCT_DEMO_CHAPTERS: DemoChapter[] = [
  { id: "welcome", label: "Welcome", startSec: 0 },
  { id: "setup", label: "Setup", startSec: 6.24 },
  { id: "description", label: "Description", startSec: 14.28 },
  { id: "duration", label: "Duration", startSec: 18.12 },
  { id: "final-message", label: "Final Message", startSec: 23.52 },
  { id: "create-timer", label: "Create Timer", startSec: 28.944 },
  { id: "countdown", label: "Countdown", startSec: 37.584 },
  { id: "pause-resume", label: "Pause Resume", startSec: 43.512 },
  { id: "fullscreen", label: "Fullscreen", startSec: 48.792 },
  { id: "persistence", label: "Persistence", startSec: 55.608 },
  { id: "times-up", label: "Times Up", startSec: 61.008 },
  { id: "summary", label: "Summary", startSec: 68.736 },
];

function formatChapterTimestamp(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(secs)}`;
  return `${minutes}:${pad(secs)}`;
}

export function ProductDemoPlayer({
  chapters = PRODUCT_DEMO_CHAPTERS,
}: {
  chapters?: DemoChapter[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [flashLabel, setFlashLabel] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    chapters[0]?.id ?? null,
  );
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  function pulse(label: string) {
    setFlashLabel(label);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashLabel(null), 350);
  }

  function seekTo(startSec: number, id: string) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = startSec;
    void video.play();
    setActiveId(id);
  }

  function onTimeUpdate() {
    const video = videoRef.current;
    if (!video || chapters.length === 0) return;
    let current = chapters[0]!;
    for (const chapter of chapters) {
      if (chapter.startSec <= video.currentTime + 0.05) current = chapter;
    }
    setActiveId(current.id);
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border border-card-border bg-card">
        <video
          ref={videoRef}
          controls
          playsInline
          className="block w-full bg-background"
          onPlay={() => pulse("Play")}
          onPause={() => pulse("Pause")}
          onTimeUpdate={onTimeUpdate}
        >
          <source src="/demo/product-demo.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/demo/product-demo.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
        {flashLabel ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center text-lg font-semibold text-foreground"
          >
            {flashLabel}
          </div>
        ) : null}
      </div>
      {chapters.length > 0 ? (
        <nav aria-label="Demo chapters" className="mt-3 max-h-56 overflow-y-auto">
          <ol className="m-0 grid list-none gap-1.5 p-0">
            {chapters.map((chapter) => {
              const stamp = formatChapterTimestamp(chapter.startSec);
              const active = chapter.id === activeId;
              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => seekTo(chapter.startSec, chapter.id)}
                    className={`flex w-full items-baseline gap-3 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active
                        ? "border-foreground/40 bg-foreground/10 text-foreground"
                        : "border-card-border bg-card text-muted hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <span className="min-w-[2.5rem] tabular-nums text-muted">
                      {stamp}
                    </span>
                    <span>{chapter.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}

export function WatchDemoButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
      >
        Watch Demo
      </button>
      <dialog
        ref={dialogRef}
        className="w-full max-w-[min(960px,96vw)] rounded-2xl border border-card-border bg-background p-4 text-foreground shadow-2xl backdrop:bg-black/70"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Product demo</h2>
          <form method="dialog">
            <button
              type="submit"
              className="rounded-lg border border-card-border bg-card px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Close
            </button>
          </form>
        </div>
        <ProductDemoPlayer />
      </dialog>
    </>
  );
}
