import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number; // 0-1, affects speed and opacity
  offsetPhase: number; // For horizontal drift variation
}

interface ParticleFieldProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number; // Base pixels per frame
  direction?: "up" | "down";
  convergePoint?: { x: number; y: number }; // Point to converge toward
  convergeStartFrame?: number; // Frame when convergence begins
  convergeDuration?: number; // Frames to complete convergence
}

// Seeded random for deterministic particle positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 30,
  color = "rgba(255, 255, 255, 0.6)",
  minSize = 2,
  maxSize = 6,
  speed = 0.3,
  direction = "up",
  convergePoint,
  convergeStartFrame,
  convergeDuration = 60,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate particles once with deterministic positions
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * width,
      y: seededRandom(i * 2.2) * height,
      size: minSize + seededRandom(i * 3.3) * (maxSize - minSize),
      depth: 0.3 + seededRandom(i * 4.4) * 0.7, // 0.3 to 1.0
      offsetPhase: seededRandom(i * 5.5) * Math.PI * 2,
    }));
  }, [count, width, height, minSize, maxSize]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((particle) => {
        // Calculate movement based on depth (deeper = slower)
        const effectiveSpeed = speed * particle.depth;
        const directionMultiplier = direction === "up" ? -1 : 1;

        // Base Y position with wrapping
        let baseY =
          particle.y + frame * effectiveSpeed * directionMultiplier;

        // Wrap particles when they exit viewport
        const totalHeight = height + particle.size * 2;
        baseY = ((baseY % totalHeight) + totalHeight) % totalHeight - particle.size;

        // Horizontal drift using sine wave
        const horizontalDrift =
          Math.sin(frame * 0.02 + particle.offsetPhase) * 20 * particle.depth;
        let baseX = particle.x + horizontalDrift;

        // Convergence effect
        let finalX = baseX;
        let finalY = baseY;
        let convergenceOpacity = 1;

        if (convergePoint && convergeStartFrame !== undefined) {
          const convergeProgress = interpolate(
            frame,
            [convergeStartFrame, convergeStartFrame + convergeDuration],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (convergeProgress > 0) {
            // Ease the convergence with cubic acceleration
            const easedProgress = convergeProgress * convergeProgress * convergeProgress;

            // Calculate convergence target (center of screen offset by convergePoint)
            const targetX = width / 2 + convergePoint.x;
            const targetY = height / 2 + convergePoint.y;

            // Interpolate toward target
            finalX = interpolate(easedProgress, [0, 1], [baseX, targetX]);
            finalY = interpolate(easedProgress, [0, 1], [baseY, targetY]);

            // Fade out as particles get close to center
            convergenceOpacity = interpolate(
              easedProgress,
              [0.7, 1],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
          }
        }

        // Opacity based on depth (further = more transparent)
        const baseOpacity = 0.2 + particle.depth * 0.6;
        const finalOpacity = baseOpacity * convergenceOpacity;

        // Scale based on depth for parallax effect
        const scale = 0.5 + particle.depth * 0.5;

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: finalX,
              top: finalY,
              width: particle.size * scale,
              height: particle.size * scale,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: finalOpacity,
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
