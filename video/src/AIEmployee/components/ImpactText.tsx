import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

interface ImpactTextProps {
  text: string;
  direction?: "up" | "down" | "left" | "right";
  startFrame?: number;
  style?: React.CSSProperties;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  distance?: number; // How far off-screen it starts
  scaleOvershoot?: number; // Initial scale (e.g., 1.3 = 30% larger)
}

export const ImpactText: React.FC<ImpactTextProps> = ({
  text,
  direction = "up",
  startFrame = 0,
  style = {},
  springConfig = { damping: 8, stiffness: 100 },
  distance = 200,
  scaleOvershoot = 1.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for entrance (0 -> 1)
  const springProgress = spring({
    frame: frame - startFrame,
    fps,
    config: springConfig,
  });

  // Calculate position based on direction
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case "up":
      translateY = interpolate(springProgress, [0, 1], [distance, 0]);
      break;
    case "down":
      translateY = interpolate(springProgress, [0, 1], [-distance, 0]);
      break;
    case "left":
      translateX = interpolate(springProgress, [0, 1], [distance, 0]);
      break;
    case "right":
      translateX = interpolate(springProgress, [0, 1], [-distance, 0]);
      break;
  }

  // Scale with overshoot
  const scale = interpolate(springProgress, [0, 1], [scaleOvershoot, 1]);

  // Opacity
  const opacity = interpolate(springProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Only show after start frame
  if (frame < startFrame) {
    return null;
  }

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
