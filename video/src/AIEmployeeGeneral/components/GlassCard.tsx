import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface GlassCardProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  borderRadius?: number;
  borderColor?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
  // Animation props
  entranceDelay?: number;
  entranceDirection?: "up" | "down" | "left" | "right" | "none";
  entranceDistance?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blur = 20,
  opacity = 0.1,
  borderRadius = 24,
  borderColor = "rgba(255, 255, 255, 0.2)",
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  style,
  entranceDelay = 0,
  entranceDirection = "up",
  entranceDistance = 50,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance animation
  const entranceProgress = spring({
    frame: frame - entranceDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Calculate transform based on direction
  let translateX = 0;
  let translateY = 0;

  if (entranceDirection !== "none") {
    const offset = interpolate(entranceProgress, [0, 1], [entranceDistance, 0]);
    switch (entranceDirection) {
      case "up":
        translateY = offset;
        break;
      case "down":
        translateY = -offset;
        break;
      case "left":
        translateX = offset;
        break;
      case "right":
        translateX = -offset;
        break;
    }
  }

  const animatedOpacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        background: backgroundColor,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        borderRadius,
        border: `1px solid ${borderColor}`,
        opacity: animatedOpacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
