import React from "react";

// Props: color, width, height
function Logo({ color = "#ffffff", width = 40, height = 40 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Example path; replace with your SVG paths */}
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="4" fill="none" />
      <path d="M16 32 L48 32" stroke={color} strokeWidth="4" />
    </svg>
  );
}

export default Logo;
