"use client";

import { Animation, pad2, splitSeconds } from "./timer";

const VARIANT_CLASS: Partial<Record<Animation, string>> = {
  default: "digit-pop",
  slide: "digit-slide",
  fade: "digit-fade",
};

export default function CardClock({
  seconds,
  variant = "default",
}: {
  seconds: number;
  variant?: Animation;
}) {
  const { hours, minutes, seconds: secs } = splitSeconds(seconds);
  const digitClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default!;

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      <Unit value={hours} label="Hours" digitClass={digitClass} />
      <Separator />
      <Unit value={minutes} label="Minutes" digitClass={digitClass} />
      <Separator />
      <Unit value={secs} label="Seconds" digitClass={digitClass} />
    </div>
  );
}

function Unit({
  value,
  label,
  digitClass,
}: {
  value: number;
  label: string;
  digitClass: string;
}) {
  const text = pad2(value);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center rounded-2xl bg-card border border-card-border w-[clamp(6rem,22vw,15rem)] h-[clamp(7rem,26vw,17rem)] overflow-hidden">
        {/* Keyed on the value so only a changed field replays its animation. */}
        <span
          key={text}
          className={`${digitClass} font-semibold leading-none text-[clamp(3.5rem,15vw,9rem)]`}
        >
          {text}
        </span>
      </div>
      <span className="text-xs tracking-[0.28em] uppercase text-muted">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="self-start mt-[clamp(2rem,9vw,5.5rem)] text-[clamp(2.5rem,9vw,6rem)] font-light leading-none text-muted">
      :
    </span>
  );
}
