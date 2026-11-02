// A perfume bottle drawn with SVG (used when a product has no photo).
// <Bottle color="#5B3A1E" size={160} />
import { useId } from 'react';

export default function Bottle({ color = '#8B5A2B', size = 160 }) {
  const id = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 120 220" width={size * 0.55} height={size} className="bottle-svg">
      <defs>
        <linearGradient id={`glass${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.75" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`gold${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#E9CF8E" />
          <stop offset="0.5" stopColor="#B8893B" />
          <stop offset="1" stopColor="#7A5A22" />
        </linearGradient>
      </defs>

      {/* cap */}
      <circle cx="60" cy="14" r="9" fill={`url(#gold${id})`} />
      <path d="M44 26 h32 l-4 34 h-24 z" fill={`url(#gold${id})`} />
      <rect x="40" y="58" width="40" height="7" rx="2" fill={`url(#gold${id})`} />

      {/* neck */}
      <rect x="50" y="65" width="20" height="16" fill={color} opacity="0.85" />

      {/* body with an Arabic arch top */}
      <path
        d="M20 200 L20 122 Q20 86 60 80 Q100 86 100 122 L100 200 Q100 212 88 212 L32 212 Q20 212 20 200 Z"
        fill={`url(#glass${id})`}
      />
      {/* shine */}
      <path d="M30 128 Q30 100 50 92 L50 196 Q30 196 30 186 Z" fill="#fff" opacity="0.18" />

      {/* golden 8-point star label */}
      <g transform="translate(60 150)">
        <rect x="-16" y="-16" width="32" height="32" fill="none" stroke={`url(#gold${id})`} strokeWidth="2" />
        <rect x="-16" y="-16" width="32" height="32" fill="none" stroke={`url(#gold${id})`} strokeWidth="2" transform="rotate(45)" />
        <circle r="5" fill={`url(#gold${id})`} />
      </g>
    </svg>
  );
}
