import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../../config/colors";
import { StatCounter, StatCounter247, GradientBackground, RadialGlow } from "../components";

export const ValueProps: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Animated gradient angle
  const gradientAngle = interpolate(
    frame,
    [0, durationInFrames],
    [135, 175],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${gradientAngle}deg, ${colors.dark}, ${colors.primary}30)`,
        }}
      />

      {/* Ambient glows */}
      <RadialGlow
        color={colors.accent}
        size={600}
        minOpacity={0.05}
        maxOpacity={0.12}
        cycleDuration={80}
        blur={70}
        x="25%"
        y="50%"
      />
      <RadialGlow
        color={colors.brand}
        size={500}
        minOpacity={0.04}
        maxOpacity={0.1}
        cycleDuration={100}
        blur={60}
        x="75%"
        y="50%"
      />

      {/* Stats row */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 120,
        }}
      >
        {/* $0/mo - No Subscriptions */}
        <StatCounter
          value={0}
          prefix="$"
          suffix="/mo"
          label="No Subscriptions"
          delay={0}
          countDuration={20}
          showFlash={false}
        />

        {/* 24/7 - Always On */}
        <StatCounter247 delay={15} />

        {/* 10+ Hours Saved */}
        <StatCounter
          value={10}
          suffix="+"
          label="Hours Saved Weekly"
          delay={30}
          countDuration={25}
          showFlash={true}
        />
      </AbsoluteFill>

      {/* Tagline at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: colors.textSecondary,
            fontSize: 22,
            fontWeight: 400,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "0.02em",
            opacity: interpolate(frame, [50, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          One-time investment. No hidden fees.
        </span>
      </div>
    </AbsoluteFill>
  );
};
