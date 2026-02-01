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

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main content entrance
  const mainScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
    from: 0.8,
    to: 1,
  });

  const mainOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Price reveal
  const priceY = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
    from: 30,
    to: 0,
  });

  const priceOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Button pulse
  const buttonPulse = interpolate(
    frame % 45,
    [0, 22, 45],
    [1, 1.05, 1]
  );

  const buttonOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tagline fade
  const taglineOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary}90 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial glow behind CTA */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          textAlign: "center",
          transform: `scale(${mainScale})`,
          opacity: mainOpacity,
        }}
      >
        {/* Main headline */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: colors.white,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Get Your AI Employee
        </h1>

        {/* Price */}
        <div
          style={{
            marginTop: 30,
            opacity: priceOpacity,
            transform: `translateY(${priceY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            Starting at $2,997
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 50,
            opacity: buttonOpacity,
            transform: `scale(${buttonPulse})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: colors.accent,
              color: colors.dark,
              padding: "24px 60px",
              borderRadius: 16,
              fontSize: 32,
              fontWeight: 700,
              boxShadow: `0 0 40px ${colors.accent}60`,
            }}
          >
            buildwithjeremy.com/ai-employee
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: 40,
            fontSize: 24,
            color: colors.textSecondary,
            opacity: taglineOpacity,
          }}
        >
          Configured. Tested. Shipped to your door.
        </p>
      </div>

      {/* Bottom corner branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: taglineOpacity,
        }}
      >
        <span style={{ fontSize: 18, color: colors.textMuted }}>
          Built by
        </span>
        <span style={{ fontSize: 20, fontWeight: 600, color: colors.white }}>
          Jeremy Pittman
        </span>
      </div>
    </AbsoluteFill>
  );
};
