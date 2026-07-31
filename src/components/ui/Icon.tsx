/**
 * Every icon is drawn at the same stroke weight as the borders, so nothing ever
 * looks pasted in from another system. No emoji, anywhere.
 */

interface Props {
  size?: number;
  className?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CheckIcon({ size = 18, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M5 12.5l4.6 4.6L19 7.2" {...stroke} />
    </svg>
  );
}

export function CrossIcon({ size = 18, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" {...stroke} />
    </svg>
  );
}

export function TriangleIcon({ dir, size = 7 }: { dir: "up" | "down"; size?: number }) {
  return (
    <svg
      viewBox="0 0 10 8"
      width={size}
      height={size * (8 / 10)}
      aria-hidden="true"
      style={{ display: "block", fill: "currentColor" }}
    >
      <path d={dir === "up" ? "M5 0l5 8H0z" : "M5 8l5-8H0z"} />
    </svg>
  );
}

export function ChartIcon({ size = 20 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 4h11l3.5 3.5V20H5z" {...stroke} strokeWidth={2.6} />
      <path d="M8.5 15.5v-3M12 15.5v-6M15.5 15.5v-4" {...stroke} strokeWidth={2.6} />
    </svg>
  );
}

export function SoundIcon({ on, size = 20 }: Props & { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 9.5h3.5L13 5.5v13L8.5 14.5H5z" {...stroke} strokeWidth={2.6} />
      {on ? (
        <path d="M16.5 9c1.4 1.6 1.4 4.4 0 6" {...stroke} strokeWidth={2.6} />
      ) : (
        <path d="M16.5 9.5l4 5M20.5 9.5l-4 5" {...stroke} strokeWidth={2.6} />
      )}
    </svg>
  );
}

export function CaretIcon({ open, size = 16 }: Props & { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={open ? "M6 15l6-6 6 6" : "M9 6l6 6-6 6"} {...stroke} strokeWidth={3.4} />
    </svg>
  );
}
