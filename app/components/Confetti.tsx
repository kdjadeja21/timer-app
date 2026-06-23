"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ["#ffffff", "#bdbdbd", "#ffd166", "#06d6a0", "#ef476f", "#118ab2"];

    // Initial big burst from the center.
    confetti({
      particleCount: 180,
      spread: 100,
      startVelocity: 55,
      origin: { y: 0.6 },
      colors,
    });

    // Continuous side cannons for a few seconds.
    const frame = () => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;

      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div className="celebration-glow" aria-hidden />;
}
