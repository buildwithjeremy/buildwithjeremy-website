import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface RadialGlowProps {
  color: string;
  size?: number;
  minOpacity?: number;
  maxOpacity?: number;
  cycleDuration?: number; // frames per pulse cycle
  blur?: number;
  x?: string | number; // position, e.g., "50%" or 960
  y?: string | number;
}

export const RadialGlow: React.FC<RadialGlowProps> = ({
  color,
  size = 600,
  minOpacity = 0.05,
  maxOpacity = 0.2,
  cycleDuration = 90,
  blur = 60,
  x = "50%",
  y = "50%",
}) => {
  const frame = useCurrentFrame();

  // Sine wave pulsing
  const pulseProgress = (frame % cycleDuration) / cycleDuration;
  const opacity =
    minOpacity +
    (maxOpacity - minOpacity) * (Math.sin(pulseProgress * Math.PI * 2) * 0.5 + 0.5);

  return (
    <div
      style={{
        position: "absolute",
        left: typeof x === "number" ? x : x,
        top: typeof y === "number" ? y : y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${blur}px)`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
};

// Gradient background component
interface GradientBackgroundProps {
  colorStart?: string;
  colorEnd?: string;
  angle?: number;
  animateAngle?: boolean;
  angleStart?: number;
  angleEnd?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colorStart = "#0f172a",
  colorEnd = "#122fed",
  angle = 135,
  animateAngle = false,
  angleStart = 135,
  angleEnd = 175,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = require("remotion").useVideoConfig();

  const currentAngle = animateAngle
    ? interpolate(frame, [0, durationInFrames], [angleStart, angleEnd], {
        extrapolateRight: "clamp",
      })
    : angle;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${currentAngle}deg, ${colorStart}, ${colorEnd})`,
      }}
    />
  );
};
