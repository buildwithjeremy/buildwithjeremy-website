import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../../config/colors";
import { PulsingButton, ParticleField, GradientBackground, RadialGlow } from "../components";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Headline entrance
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const headlineY = interpolate(headlineProgress, [0, 1], [60, 0]);
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Price reveal
  const priceProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });
  const priceOpacity = interpolate(priceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Branding fade in at end
  const brandingOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <GradientBackground
        colorStart={colors.dark}
        colorEnd={colors.primary}
        angle={145}
      />

      {/* Central glow */}
      <RadialGlow
        color={colors.accent}
        size={900}
        minOpacity={0.1}
        maxOpacity={0.2}
        cycleDuration={60}
        blur={100}
        y="50%"
      />

      {/* Particles converging */}
      <ParticleField
        count={40}
        color={`${colors.accent}60`}
        minSize={2}
        maxSize={4}
        speed={0.5}
        direction="up"
        convergeToCenter={true}
        convergenceStartFrame={0}
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Headline */}
        <h2
          style={{
            color: colors.white,
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.03em",
            margin: 0,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textShadow: `0 4px 30px ${colors.primary}60`,
          }}
        >
          Get Your AI Employee
        </h2>

        {/* Price */}
        <div
          style={{
            opacity: priceOpacity,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              color: colors.textSecondary,
              fontSize: 28,
              fontWeight: 400,
              fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            }}
          >
            Starting at{" "}
          </span>
          <span
            style={{
              color: colors.accent,
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            }}
          >
            $2,997
          </span>
        </div>

        {/* CTA Button */}
        <PulsingButton
          text="Book a Free Call"
          glowColor={colors.accent}
          pulseSpeed={45}
          startFrame={25}
          showTypewriter={true}
          typewriterText="buildwithjeremy.com/ai-employee"
        />
      </AbsoluteFill>

      {/* Branding at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: brandingOpacity,
        }}
      >
        <span
          style={{
            color: colors.brand,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Build with Jeremy
        </span>
        <span
          style={{
            color: colors.textMuted,
            fontSize: 14,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
          }}
        >
          Configured. Tested. Shipped to your door.
        </span>
      </div>
    </AbsoluteFill>
  );
};
