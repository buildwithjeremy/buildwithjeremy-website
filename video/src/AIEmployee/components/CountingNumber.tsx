import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";

interface CountingNumberProps {
  value: number;
  startFrame?: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  countFrom?: number; // Default: 0
  countDirection?: "up" | "down"; // up: 0->value, down: value->0
  decimals?: number;
  style?: React.CSSProperties;
  showFlash?: boolean; // Flash effect when complete
  flashColor?: string;
}

export const CountingNumber: React.FC<CountingNumberProps> = ({
  value,
  startFrame = 0,
  durationFrames = 45,
  prefix = "",
  suffix = "",
  countFrom = 0,
  countDirection = "up",
  decimals = 0,
  style = {},
  showFlash = true,
  flashColor = "rgba(255, 255, 255, 0.8)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate counting progress
  const countProgress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Calculate current number
  let currentNumber: number;
  if (countDirection === "up") {
    currentNumber = interpolate(countProgress, [0, 1], [countFrom, value]);
  } else {
    currentNumber = interpolate(countProgress, [0, 1], [value, countFrom]);
  }

  // Scale entrance animation
  const scaleProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(scaleProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(scaleProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Pop effect when counting completes
  const isComplete = frame >= startFrame + durationFrames;
  const popProgress = spring({
    frame: frame - (startFrame + durationFrames),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const popScale = isComplete
    ? interpolate(popProgress, [0, 1], [1.1, 1])
    : 1;

  // Flash effect on completion
  const flashOpacity = interpolate(
    frame,
    [startFrame + durationFrames, startFrame + durationFrames + 15],
    [0.8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Format the number
  const displayNumber = isComplete
    ? value.toFixed(decimals)
    : currentNumber.toFixed(decimals);

  // Don't show before start
  if (frame < startFrame) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `scale(${scale * popScale})`,
        opacity,
        ...style,
      }}
    >
      {/* Flash overlay */}
      {showFlash && flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -20,
            background: `radial-gradient(circle, ${flashColor} 0%, transparent 70%)`,
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Number display */}
      <span>
        {prefix}
        {displayNumber}
        {suffix}
      </span>
    </div>
  );
};

// Special variant for "24/7" style display
interface TimeFormatProps {
  startFrame?: number;
  style?: React.CSSProperties;
}

export const CountingTime247: React.FC<TimeFormatProps> = ({
  startFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count 0 -> 24
  const hourProgress = interpolate(
    frame,
    [startFrame, startFrame + 40],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const currentHour = Math.round(interpolate(hourProgress, [0, 1], [0, 24]));

  // Show "/7" after hours complete
  const showSuffix = frame >= startFrame + 40;
  const suffixProgress = spring({
    frame: frame - (startFrame + 40),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const suffixScale = interpolate(suffixProgress, [0, 1], [0, 1]);
  const suffixOpacity = interpolate(suffixProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Entrance scale
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(entranceProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  if (frame < startFrame) {
    return null;
  }

  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {currentHour}
      {showSuffix && (
        <span
          style={{
            display: "inline-block",
            transform: `scale(${suffixScale})`,
            opacity: suffixOpacity,
          }}
        >
          /7
        </span>
      )}
    </span>
  );
};

// Special variant for "20+" style display
interface PlusFormatProps {
  value: number;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const CountingNumberPlus: React.FC<PlusFormatProps> = ({
  value,
  startFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count 0 -> value
  const countProgress = interpolate(
    frame,
    [startFrame, startFrame + 40],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const currentNumber = Math.round(
    interpolate(countProgress, [0, 1], [0, value])
  );

  // Show "+" after count complete
  const showPlus = frame >= startFrame + 40;
  const plusProgress = spring({
    frame: frame - (startFrame + 40),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const plusScale = interpolate(plusProgress, [0, 1], [0, 1]);
  const plusOpacity = interpolate(plusProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Entrance scale
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(entranceProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  if (frame < startFrame) {
    return null;
  }

  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {currentNumber}
      {showPlus && (
        <span
          style={{
            display: "inline-block",
            transform: `scale(${plusScale})`,
            opacity: plusOpacity,
          }}
        >
          +
        </span>
      )}
    </span>
  );
};
