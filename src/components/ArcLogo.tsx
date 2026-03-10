interface ArcLogoProps {
  className?: string;
  color?: string;
}

export function ArcLogo({ className = "h-8 w-auto", color = "currentColor" }: ArcLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-label="ARC"
      role="img"
    >
      <path fill={color} d="M16 2L3 30h5.5L16 14l7.5 16H29Z" />
    </svg>
  );
}
