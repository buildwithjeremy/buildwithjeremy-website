import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors } from "../../config/colors";

interface StatCounterProps {
  value: number;
  prefix?: string; // e.g., "$"
  suffix?: string; // e.g., "/mo", "+", "/7"
  label: string;
  delay?: number;
  countDuration?: number; // frames to count
  showFlash?: boolean; // flash effect when count completes
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  prefix = "",
  suffix = "",
  label,
  delay = 0,
  countDuration = 30,
  showFlash = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const translateY = interpolate(entranceProgress, [0, 1], [60, 0]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  // Count animation (starts after entrance)
  const countStartFrame = delay + 15; // Start counting after entrance settles
  const countProgress = interpolate(
    frame,
    [countStartFrame, countStartFrame + countDuration],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const displayValue = Math.round(countProgress * value);
  const isCountComplete = countProgress >= 1;

  // Suffix reveal (after count completes)
  const suffixProgress = spring({
    frame: frame - countStartFrame - countDuration,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const suffixOpacity = interpolate(suffixProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const suffixScale = interpolate(suffixProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  // Flash effect on completion
  const flashProgress =
    showFlash && isCountComplete
      ? interpolate(
          frame - (countStartFrame + countDuration),
          [0, 15],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  // Label fade in
  const labelProgress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {/* Number with flash */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        {/* Flash glow */}
        {flashProgress > 0 && (
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `radial-gradient(circle, ${colors.accent}${Math.round(
                flashProgress * 50
              )
                .toString(16)
                .padStart(2, "0")} 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        )}

        <span
          style={{
            color: colors.accent,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {prefix}
          {displayValue}
        </span>

        {/* Suffix with reveal animation */}
        <span
          style={{
            color: colors.accent,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            opacity: suffixOpacity,
            transform: `scale(${suffixScale})`,
            transformOrigin: "left center",
          }}
        >
          {suffix}
        </span>
      </div>

      {/* Label */}
      <span
        style={{
          color: colors.textSecondary,
          fontSize: 20,
          fontWeight: 500,
          fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          opacity: labelOpacity,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// Special variant for 24/7 display
export const StatCounter247: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const entranceProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const translateY = interpolate(entranceProgress, [0, 1], [60, 0]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  // Count to 24
  const countStartFrame = delay + 15;
  const countProgress = interpolate(
    frame,
    [countStartFrame, countStartFrame + 25],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const displayValue = Math.round(countProgress * 24);

  // "/7" reveal
  const slashSevenProgress = spring({
    frame: frame - countStartFrame - 25,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const slashSevenOpacity = interpolate(slashSevenProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slashSevenScale = interpolate(slashSevenProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  // Label
  const labelProgress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            color: colors.accent,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            color: colors.accent,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            opacity: slashSevenOpacity,
            transform: `scale(${slashSevenScale})`,
            transformOrigin: "left center",
          }}
        >
          /7
        </span>
      </div>

      <span
        style={{
          color: colors.textSecondary,
          fontSize: 20,
          fontWeight: 500,
          fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          opacity: labelOpacity,
        }}
      >
        Always On
      </span>
    </div>
  );
};
