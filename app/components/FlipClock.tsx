"use client";

import { useState } from "react";
import { pad2, splitSeconds } from "./timer";

export default function FlipClock({ seconds }: { seconds: number }) {
  const { hours, minutes, seconds: secs } = splitSeconds(seconds);

  return (
    <div className="flip-clock">
      <FlipUnit value={hours} label="Hours" />
      <span className="flip-separator">:</span>
      <FlipUnit value={minutes} label="Minutes" />
      <span className="flip-separator">:</span>
      <FlipUnit value={secs} label="Seconds" />
    </div>
  );
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const text = pad2(value);
  return (
    <div className="flip-unit">
      <div className="flip-groups">
        <FlipDigit digit={text[0]} />
        <FlipDigit digit={text[1]} />
      </div>
      <span className="flip-label">{label}</span>
    </div>
  );
}

function FlipDigit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState<string | null>(null);
  // Increments on each change to retrigger the CSS animation via `key`.
  const [flipId, setFlipId] = useState(0);

  // Adjust state during render when the incoming digit changes
  // (React-supported "storing info from previous renders" pattern).
  if (digit !== current) {
    setPrevious(current);
    setCurrent(digit);
    setFlipId((id) => id + 1);
  }

  const animating = previous !== null && previous !== current;

  return (
    <div className="flip-card">
      {/* Static halves */}
      <div className="card-half top">
        <span>{current}</span>
      </div>
      <div className="card-half bottom">
        <span>{animating ? previous : current}</span>
      </div>

      {/* Animated halves (re-mounted on each change to replay the animation) */}
      {animating && (
        <div key={flipId} className="contents">
          <div className="card-half top flip-top">
            <span>{previous}</span>
          </div>
          <div className="card-half bottom flip-bottom">
            <span>{current}</span>
          </div>
        </div>
      )}
    </div>
  );
}
