import React from "react";

export default function BugLogo({ className = "h-6 w-6", stroke = "currentColor" }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M28 6v8M36 6v8" />
      <path d="M22 14 Q22 6 32 6 Q42 6 42 14" />
      <ellipse cx="32" cy="32" rx="14" ry="18" />
      <path d="M32 16 L32 50" />
      <path d="M18 22 L10 18 M18 32 L8 32 M18 42 L10 46" />
      <path d="M46 22 L54 18 M46 32 L56 32 M46 42 L54 46" />
    </svg>
  );
}
