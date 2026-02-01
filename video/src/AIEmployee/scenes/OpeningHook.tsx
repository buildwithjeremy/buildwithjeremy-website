import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors } from "../../config/colors";

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from black
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Main headline animation - letter by letter reveal
  const headline = "Your AI Employee";
  const lettersShown = interpolate(frame, [15, 60], [0, headline.length], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Subtitle fade and slide up
  const subtitleOpacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const subtitleY = interpolate(frame, [65, 85], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Glow pulse effect
  const glowIntensity = interpolate(
    frame,
    [60, 80, 100, 120],
    [0.3, 1, 0.6, 1],
    { extrapolateRight: "clamp" }
  );

  // Scale down at end for transition
  const scaleOut = interpolate(frame, [100, 120], [1, 0.95], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${colors.brand}15 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${scaleOut})`,
        }}
      >
        {/* Main headline with letter reveal */}
        <h1
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: colors.white,
            margin: 0,
            letterSpacing: -2,
            textShadow: `0 0 ${60 * glowIntensity}px ${colors.accent}, 0 0 ${120 * glowIntensity}px ${colors.accent}40`,
          }}
        >
          {headline.slice(0, Math.floor(lettersShown))}
          <span
            style={{
              opacity: frame % 10 < 5 && lettersShown < headline.length ? 1 : 0,
              color: colors.accent,
            }}
          >
            |
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 42,
            fontWeight: 500,
            color: colors.textSecondary,
            marginTop: 30,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Shipped to your door.{" "}
          <span style={{ color: colors.accent }}>Ready to work.</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
