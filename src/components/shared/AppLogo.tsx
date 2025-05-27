// src/components/shared/AppLogo.tsx
// This component is no longer used as the logo is directly embedded as an <img> in AppHeader.tsx
// You can choose to delete this file or keep it for future reference.
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      {/* Left brown semi-circle part */}
      <path d="M50 10 A40 40 0 0 0 50 90 A20 40 0 0 1 25 50 A40 40 0 0 0 50 10 Z" fill="#5E4537" />

      {/* Mosque-like silhouette complex */}
      {/* Far left slender building (medium green) */}
      <rect x="5" y="45" width="4" height="35" fill="#3A6B35" />
      <polygon points="5,45 9,45 7,40" fill="#3A6B35" />
      
      {/* Left section of mosque (medium green) */}
      <rect x="10" y="50" width="10" height="30" fill="#3A6B35" />
      <path d="M10 50 Q15 42 20 50 Z" fill="#3A6B35"/>

      {/* Central mosque structure (darkest green) */}
      <rect x="21" y="40" width="18" height="40" fill="#1A472A" /> {/* Main body */}
      <path d="M21 40 Q30 25 39 40 Z" fill="#1A472A"/> {/* Main dome */}
      
      {/* Minaret-like spires on central part (darkest green) */}
       <rect x="19" y="42" width="3" height="15" fill="#1A472A" />
       <polygon points="19,42 22,42 20.5,38" fill="#1A472A" />
       <rect x="38" y="42" width="3" height="15" fill="#1A472A" />
       <polygon points="38,42 41,42 39.5,38" fill="#1A472A" />

      {/* Right section of mosque (medium green) */}
      <rect x="40" y="50" width="10" height="30" fill="#3A6B35" />
      <path d="M40 50 Q45 42 50 50 Z" fill="#3A6B35"/>


      {/* Central/Right Skyscraper Buildings */}
      {/* Tallest central building (medium dark green #3A6B35) */}
      <rect x="52" y="25" width="10" height="55" fill="#3A6B35" />
      <rect x="54" y="20" width="6" height="5" fill="#3A6B35" /> {/* Top detail */}

      {/* Shorter building right of tallest (lighter green #6A994E) */}
      <rect x="64" y="35" width="8" height="45" fill="#6A994E" />
      <rect x="65" y="30" width="6" height="5" fill="#6A994E" /> {/* Top detail */}
      
      {/* Rightmost smaller building (medium dark green #3A6B35) */}
      <rect x="74" y="45" width="7" height="35" fill="#3A6B35" />


      {/* Green Arch on the far right (medium dark green #3A6B35) */}
      <path d="M70 90 A45 45 0 0 1 98 40 L94 42 A40 40 0 0 0 70 85 Z" fill="#3A6B35" />

      {/* Wave-like elements (lighter green #6A994E and lightest green #A1C181) */}
      <path d="M55 75 Q65 70 75 78 Q65 88 55 80 Z" fill="#6A994E" />
      <path d="M60 82 Q70 77 80 85 Q70 93 60 87 Z" fill="#A1C181" />
      
      {/* Bottom brown swoosh (dark Brown #5E4537) */}
      <path d="M10 87 Q50 105 90 85 Q50 98 10 87 Z" fill="#5E4537" />

    </svg>
  );
}
