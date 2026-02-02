/**
 * WAR.MARKET logo mark - X chevrons with amber/gold flame diamond
 * Use for: header, loading states, empty states, error pages
 */
export function WarMark({
  size = 32,
  className = '',
  animate = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${className} ${animate ? 'animate-pulse' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M8 9 L26 32 L8 55"
        stroke="#4a4752"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 9 L38 32 L56 55"
        stroke="#4a4752"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 19 L43 32 L32 45 L21 32 Z" fill="#f97316" />
      <path d="M32 24 L38 32 L32 40 L26 32 Z" fill="#fbbf24" />
    </svg>
  );
}
