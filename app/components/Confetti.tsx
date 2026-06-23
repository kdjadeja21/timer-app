"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Bind confetti to a canvas inside this component so it renders within
    // the fullscreen element (the global instance attaches to document.body,
    // which is hidden while another element is fullscreen).
    const fire = confetti.create(canvas, { resize: true, useWorker: true });

    const duration = 4000;
    const end = Date.now() + duration;
    const colors = [
      "#ffffff",
      "#bdbdbd",
      "#ffd166",
      "#06d6a0",
      "#ef476f",
      "#118ab2",
    ];

    // Initial big burst from the center.
    fire({
      particleCount: 180,
      spread: 100,
      startVelocity: 55,
      origin: { y: 0.6 },
      colors,
    });

    let raf = 0;
    // Continuous side cannons for a few seconds.
    const frame = () => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;

      fire({
        particleCount: 4,
        angle: 60,
        spread: 55,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      fire({
        particleCount: 4,
        angle: 120,
        spread: 55,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      fire.reset();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
        aria-hidden
      />
      <div className="celebration-glow" aria-hidden />
    </>
  );
}
