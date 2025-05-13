// src/components/shared/AppLogo.tsx
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="32"
      height="32"
      {...props}
    >
      {/* Background elements - assuming the black area in PNG is transparency */}
      
      {/* Left brown semi-circle part */}
      <path d="M50 10 A40 40 0 0 0 50 90 A20 40 0 0 1 25 50 A40 40 0 0 0 50 10 Z" fill="#5E4537" />

      {/* Mosque-like silhouette (darkest green) */}
      <path d="M20 80 L20 50 L22 50 L22 45 L25 40 L28 45 L28 50 L30 50 L30 80 Z" fill="#1A472A" />
      <path d="M22 45 Q25 35 28 45" fill="#1A472A" />
      <path d="M18 80 L18 55 L20 55 L20 50 L15 50 L15 80 Z" fill="#3A6B35" />
       <path d="M30 50 L32 50 L32 55 L34 55 L34 80 L32 80 L32 55 L30 55 Z" fill="#3A6B35" />


      {/* Central/Right Buildings */}
      {/* Tallest central building (medium dark green) */}
      <rect x="48" y="25" width="10" height="55" fill="#3A6B35" />
      <rect x="50" y="20" width="6" height="5" fill="#3A6B35" />

      {/* Shorter building right of tallest (lighter green) */}
      <rect x="60" y="35" width="8" height="45" fill="#6A994E" />
      <rect x="61" y="30" width="6" height="5" fill="#6A994E" />
      
      {/* Rightmost smaller building (medium dark green) */}
      <rect x="70" y="45" width="7" height="35" fill="#3A6B35" />


      {/* Green Arch on the right (medium dark green) */}
      <path d="M60 90 A45 45 0 0 1 95 30 L90 32 A40 40 0 0 0 60 85 Z" fill="#3A6B35" />

      {/* Wave-like elements (lighter green and lightest green) */}
      <path d="M55 75 Q65 70 75 78 Q65 88 55 80 Z" fill="#6A994E" />
      <path d="M60 82 Q70 77 80 85 Q70 93 60 87 Z" fill="#A1C181" />
      
      {/* Bottom brown swoosh */}
      <path d="M15 85 Q50 105 85 80 Q50 95 15 85 Z" fill="#5E4537" />

    </svg>
  );
}
