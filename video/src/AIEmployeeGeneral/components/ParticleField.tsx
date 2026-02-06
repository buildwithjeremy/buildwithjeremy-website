import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../config/colors";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  direction?: "up" | "down";
  convergeToCenter?: boolean;
  convergenceStartFrame?: number;
}

// Seeded random for deterministic particles
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 30,
  color = colors.accent,
  minSize = 2,
  maxSize = 5,
  speed = 0.4,
  direction = "up",
  convergeToCenter = false,
  convergenceStartFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Generate particles deterministically
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 1234.5678;
      return {
        id: i,
        x: seededRandom(seed) * width,
        y: seededRandom(seed + 1) * height,
        size: minSize + seededRandom(seed + 2) * (maxSize - minSize),
        speed: 0.5 + seededRandom(seed + 3) * 1.5,
        opacity: 0.2 + seededRandom(seed + 4) * 0.6,
        depth: 0.3 + seededRandom(seed + 5) * 0.7, // for parallax
      };
    });
  }, [count, width, height, minSize, maxSize]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((particle) => {
        // Base movement
        const movement = frame * speed * particle.speed * particle.depth;
        let y =
          direction === "up"
            ? particle.y - movement
            : particle.y + movement;

        // Wrap around screen
        const wrappedY = ((y % height) + height) % height;

        let x = particle.x;

        // Convergence effect
        if (convergeToCenter && frame >= convergenceStartFrame) {
          const convergenceProgress = interpolate(
            frame,
            [convergenceStartFrame, convergenceStartFrame + 60],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const centerX = width / 2;
          const centerY = height / 2;

          x = interpolate(convergenceProgress, [0, 1], [particle.x, centerX]);
          // Don't wrap Y when converging
          const baseY =
            direction === "up"
              ? particle.y - movement
              : particle.y + movement;
          y = interpolate(convergenceProgress, [0, 1], [baseY, centerY]);
        } else {
          y = wrappedY;
        }

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
