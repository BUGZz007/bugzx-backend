import React, { useState } from "react";

export default function BugLogo({ className = "h-7 w-7", alt = "BUGZ X Logo", variant = "default" }) {
  const [imgSrc, setImgSrc] = useState(variant === "white" ? "/logo-white.png" : "/logo.png");
  const fallbackSrc = variant === "white" ? "/logo.png" : "/logo-white.png";

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      className={`object-contain inline-block shrink-0 ${className}`}
    />
  );
}
