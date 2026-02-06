import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../config/colors";

interface FeatureBadgeProps {
  icon: string; // Emoji or text icon
  text: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  accentColor?: string;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  text,
  direction = "left",
  delay = 0,
  accentColor = colors.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance
  const entranceProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Calculate entrance offset
  const entranceDistance = 80;
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case "left":
      translateX = interpolate(entranceProgress, [0, 1], [-entranceDistance, 0]);
      break;
    case "right":
      translateX = interpolate(entranceProgress, [0, 1], [entranceDistance, 0]);
      break;
    case "up":
      translateY = interpolate(entranceProgress, [0, 1], [entranceDistance, 0]);
      break;
    case "down":
      translateY = interpolate(entranceProgress, [0, 1], [-entranceDistance, 0]);
      break;
  }

  const opacity = interpolate(entranceProgress, [0, 0.5, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.15)",
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          color: colors.white,
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </span>
    </div>
  );
};
