import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors } from "../../config/colors";
import {
  ParticleField,
  CameraWrapper,
  ImpactText,
  RadialGlow,
} from "../components";
import { useTypewriter } from "../../hooks/useTypewriter";

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in from black
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle typewriter (starts after headline lands)
  const subtitle = useTypewriter("Shipped to your door.", {
    startFrame: 55,
    charsPerSecond: 25,
  });

  // Subtitle entrance animation
  const subtitleOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [50, 65], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Ready to work" appears after typing completes
  const readyOpacity = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensity pulsing after headline appears
  const glowIntensity = interpolate(
    frame,
    [40, 60, 80, 100, 120],
    [0.2, 1, 0.5, 0.8, 0.6],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Scale down at end for smooth transition
  const scaleOut = interpolate(frame, [100, 120], [1, 0.95], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        opacity: fadeIn,
      }}
    >
      {/* Layer 0: Particle field background */}
      <ParticleField
        count={35}
        color={`${colors.accent}80`}
        minSize={2}
        maxSize={5}
        speed={0.4}
        direction="up"
      />

      {/* Layer 1: Radial glow behind text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RadialGlow
          color={colors.brand}
          size={800}
          minOpacity={0.05}
          maxOpacity={0.15 * glowIntensity}
          cycleDuration={90}
          blur={60}
          startFrame={15}
        />
      </AbsoluteFill>

      {/* Layer 2: Camera wrapper with slow push-in */}
      <CameraWrapper
        zoomStart={1}
        zoomEnd={1.06}
        startFrame={0}
        endFrame={durationInFrames}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              transform: `scale(${scaleOut})`,
            }}
          >
            {/* Main headline - slams in from below */}
            <ImpactText
              text="Your AI Employee"
              direction="up"
              startFrame={15}
              springConfig={{ damping: 10, stiffness: 100 }}
              distance={150}
              scaleOvershoot={1.2}
              style={{
                fontSize: 120,
                fontWeight: 800,
                color: colors.white,
                letterSpacing: -3,
                textShadow: `
                  0 0 ${60 * glowIntensity}px ${colors.accent},
                  0 0 ${120 * glowIntensity}px ${colors.accent}40
                `,
              }}
            />

            {/* Subtitle with typewriter */}
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
              {subtitle.displayText}
              <span style={{ color: colors.accent }}>{subtitle.cursor}</span>
              <span
                style={{
                  color: colors.accent,
                  opacity: readyOpacity,
                }}
              >
                {" "}
                Ready to work.
              </span>
            </p>
          </div>
        </AbsoluteFill>
      </CameraWrapper>
    </AbsoluteFill>
  );
};
