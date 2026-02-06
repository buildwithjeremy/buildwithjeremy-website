import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface GlowPulseProps {
  children: React.ReactNode;
  color: string;
  minRadius?: number;
  maxRadius?: number;
  cycleDuration?: number; // Frames per pulse cycle
  minScale?: number;
  maxScale?: number;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  children,
  color,
  minRadius = 20,
  maxRadius = 50,
  cycleDuration = 45,
  minScale = 1,
  maxScale = 1.05,
  startFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Only start pulsing after startFrame
  const activeFrame = Math.max(0, frame - startFrame);

  // Calculate position in pulse cycle (0 to 1)
  const cyclePosition = (activeFrame % cycleDuration) / cycleDuration;

  // Use sine wave for smooth pulsing (0 -> 1 -> 0)
  const pulseWave = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5;

  // Interpolate glow radius
  const glowRadius = interpolate(pulseWave, [0, 1], [minRadius, maxRadius]);

  // Interpolate scale
  const scale = interpolate(pulseWave, [0, 1], [minScale, maxScale]);

  // Fade in the glow effect
  const glowOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        boxShadow:
          frame >= startFrame
            ? `0 0 ${glowRadius}px ${color}, 0 0 ${glowRadius * 2}px ${color}40`
            : "none",
        opacity: frame >= startFrame ? 1 : 1,
        transition: "none", // Ensure no CSS transitions
        ...style,
      }}
    >
      {/* Inner glow overlay for extra effect */}
      {frame >= startFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `radial-gradient(circle, ${color}${Math.round(glowOpacity * 20).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
};

// Radial glow background effect
interface RadialGlowProps {
  color: string;
  size?: number;
  minOpacity?: number;
  maxOpacity?: number;
  cycleDuration?: number;
  blur?: number;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const RadialGlow: React.FC<RadialGlowProps> = ({
  color,
  size = 600,
  minOpacity = 0.1,
  maxOpacity = 0.3,
  cycleDuration = 60,
  blur = 40,
  startFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const activeFrame = Math.max(0, frame - startFrame);
  const cyclePosition = (activeFrame % cycleDuration) / cycleDuration;
  const pulseWave = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5;

  const opacity = interpolate(pulseWave, [0, 1], [minOpacity, maxOpacity]);

  // Fade in
  const fadeIn = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: opacity * fadeIn,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
