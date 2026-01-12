import React from "react";

type Props = {
  size?: number;
  className?: string;
  durationMs?: number; // animation duration in milliseconds (1-2000)
};

const LazyLoadingIcon: React.FC<Props> = ({ size = 56, className = "", durationMs = 1400 }) => {
  const dur = Math.max(600, Math.min(2000, durationMs));
  const style = { ["--loader-duration" as any]: `${dur}ms` } as React.CSSProperties;

  return (
    <div role="status" aria-busy="true" className={`flex items-center justify-center ${className}`} style={style}>
      <style>{`
        .ld-dot { animation: ld-scale var(--loader-duration) cubic-bezier(.2,.8,.2,1) infinite; }
        .ld-dot:nth-child(2) { animation-delay: calc(var(--loader-duration) * 0.12); }
        .ld-dot:nth-child(3) { animation-delay: calc(var(--loader-duration) * 0.24); }
        @keyframes ld-scale {
          0% { transform: scale(0.6); opacity: .6; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.6); opacity: .6; }
        }
      `}</style>

      <svg width={size} height={Math.round(size / 3)} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <g transform="translate(10,20)">
          <circle className="ld-dot" cx="0" cy="0" r="10" fill="url(#g1)" />
        </g>
        <g transform="translate(60,20)">
          <circle className="ld-dot" cx="0" cy="0" r="10" fill="url(#g1)" />
        </g>
        <g transform="translate(110,20)">
          <circle className="ld-dot" cx="0" cy="0" r="10" fill="url(#g1)" />
        </g>
      </svg>
    </div>
  );
};

export default LazyLoadingIcon;
