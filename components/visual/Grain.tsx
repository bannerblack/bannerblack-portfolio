"use client";

import React, { useEffect, useRef } from "react";

export default function Grain({ className }: { className?: string }) {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (!turbulenceRef.current) return;

    let seed = Math.random() * 100;
    const animate = () => {
      if (!turbulenceRef.current) return;
      seed += 0.5; // Increased from 0.05 to 0.5 to make animation significantly faster
      turbulenceRef.current.setAttribute("seed", seed.toString());
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none opacity-10 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.50"
            numOctaves="5"
            stitchTiles="stitch"
            seed="0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
