import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const DavetrackLogo: React.FC<LogoProps> = ({ className = '', size = 52 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="greenRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Shield Border */}
        <path
          d="M 50 6 L 86 19 C 86 60 50 92 50 92 C 50 92 14 60 14 19 Z"
          fill="url(#greenRim)"
          stroke="#0f5132"
          strokeWidth="2.5"
        />

        {/* Inner Shield Body */}
        <path
          d="M 50 12 L 80 23 C 80 57 50 85 50 85 C 50 85 20 57 20 23 Z"
          fill="url(#shieldGrad)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Stylized Emblem "D" / "T" / Tech symbol */}
        {/* Left curve (D) */}
        <path
          d="M 33 28 L 50 28 C 61 28 67 36 67 47 C 67 58 61 66 50 66 L 33 66 Z"
          fill="#15803d"
        />
        {/* Cutout in D */}
        <path
          d="M 41 36 L 49 36 C 55 36 58 41 58 47 C 58 53 55 58 49 58 L 41 58 Z"
          fill="#ffffff"
        />

        {/* Stylized Security Check / Camera / Tech Slash */}
        <path
          d="M 45 42 L 53 50 L 73 30"
          stroke="#16a34a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />
      </svg>
    </div>
  );
};
