import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../../config/colors";
import { ParticleField, RadialGlow, GradientBackground } from "../components";

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in for the whole scene
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Headline animation - "Your AI Employee"
  const headlineProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const headlineY = interpolate(headlineProgress, [0, 1], [80, 0]);
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle typewriter - "Shipped to Your Door"
  const subtitle = "Shipped to Your Door";
  const typewriterStartFrame = 30;
  const charsPerSecond = 25;
  const framesPerChar = fps / charsPerSecond;
  const localFrame = Math.max(0, frame - typewriterStartFrame);
  const charsToShow = Math.min(
    subtitle.length,
    Math.floor(localFrame / framesPerChar)
  );
  const displaySubtitle = subtitle.slice(0, charsToShow);
  const isTyping = charsToShow < subtitle.length;

  // Cursor blink
  const cursorOpacity = isTyping
    ? interpolate(frame % 16, [0, 8, 16], [1, 0, 1])
    : interpolate(frame % 30, [0, 15, 30], [1, 0, 1]);

  // Subtle zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Gradient background */}
      <GradientBackground
        colorStart={colors.dark}
        colorEnd={colors.primary}
        angle={135}
      />

      {/* Radial glow pulsing */}
      <RadialGlow
        color={colors.accent}
        size={800}
        minOpacity={0.08}
        maxOpacity={0.18}
        cycleDuration={90}
        blur={80}
        y="55%"
      />

      {/* Secondary glow */}
      <RadialGlow
        color={colors.brand}
        size={600}
        minOpacity={0.05}
        maxOpacity={0.12}
        cycleDuration={120}
        blur={60}
        x="30%"
        y="40%"
      />

      {/* Particle field */}
      <ParticleField
        count={35}
        color={`${colors.accent}80`}
        minSize={2}
        maxSize={5}
        speed={0.3}
        direction="up"
      />

      {/* Content with zoom effect */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Main headline */}
        <h1
          style={{
            color: colors.white,
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.04em",
            margin: 0,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textShadow: `0 4px 40px ${colors.primary}80`,
          }}
        >
          Your AI Employee
        </h1>

        {/* Subtitle with typewriter */}
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: colors.accent,
              fontSize: 36,
              fontWeight: 500,
              fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {displaySubtitle}
            <span
              style={{
                opacity: cursorOpacity,
                marginLeft: 2,
                color: colors.accent,
              }}
            >
              |
            </span>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
