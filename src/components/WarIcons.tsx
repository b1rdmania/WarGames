/**
 * WAR.MARKET icon set
 * Style: warm gray strokes, amber/gold accents, rounded caps, geometric
 * Matches WarMark aesthetic
 */

type IconProps = {
  size?: number;
  className?: string;
};

const GRAY = '#4a4752';
const AMBER = '#f97316';
const GOLD = '#fbbf24';
const PROFIT = '#22c55e';
const LOSS = '#ef4444';

// Chart/trend icon - for markets
export function IconChart({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M8 48 L24 32 L36 40 L56 16"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="56" cy="16" r="6" fill={AMBER} />
    </svg>
  );
}

// Wallet icon - for connect flow
export function IconWallet({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect
        x="8"
        y="16"
        width="48"
        height="36"
        rx="4"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 28 L56 28"
        stroke={GRAY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="44" cy="40" r="5" fill={AMBER} />
    </svg>
  );
}

// Arrow up - profit/positive
export function IconArrowUp({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M32 52 L32 16"
        stroke={PROFIT}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M18 30 L32 16 L46 30"
        stroke={PROFIT}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Arrow down - loss/negative
export function IconArrowDown({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M32 12 L32 48"
        stroke={LOSS}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M18 34 L32 48 L46 34"
        stroke={LOSS}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Warning/risk icon - triangle with dot
export function IconWarning({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M32 8 L58 52 L6 52 Z"
        stroke={AMBER}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="42" r="4" fill={AMBER} />
      <path
        d="M32 24 L32 34"
        stroke={AMBER}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// External link icon
export function IconExternal({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M24 8 L8 8 L8 56 L56 56 L56 40"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 8 L56 8 L56 28"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 8 L28 36"
        stroke={AMBER}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Refresh icon
export function IconRefresh({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 32 A20 20 0 1 1 32 52"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 20 L12 32 L24 32"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="4" fill={AMBER} />
    </svg>
  );
}

// Close/X icon
export function IconClose({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M16 16 L48 48"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M48 16 L16 48"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Info icon - circle with i
export function IconInfo({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
      />
      <circle cx="32" cy="20" r="4" fill={AMBER} />
      <path
        d="M32 30 L32 46"
        stroke={AMBER}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Copy icon
export function IconCopy({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect
        x="20"
        y="20"
        width="36"
        height="36"
        rx="4"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 20 L44 12 A4 4 0 0 0 40 8 L12 8 A4 4 0 0 0 8 12 L8 40 A4 4 0 0 0 12 44 L20 44"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Execute/trade icon - lightning bolt
export function IconExecute({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M36 8 L16 36 L28 36 L28 56 L48 28 L36 28 Z"
        stroke={AMBER}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 36 L28 56 L48 28"
        fill={GOLD}
      />
    </svg>
  );
}

// Position/layers icon - stacked cards
export function IconPosition({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect
        x="12"
        y="28"
        width="40"
        height="28"
        rx="4"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 28 L18 20 A4 4 0 0 1 22 16 L42 16 A4 4 0 0 1 46 20 L46 28"
        stroke={GRAY}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 16 L24 12 A4 4 0 0 1 28 8 L36 8 A4 4 0 0 1 40 12 L40 16"
        stroke={GRAY}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="42" r="5" fill={AMBER} />
    </svg>
  );
}
