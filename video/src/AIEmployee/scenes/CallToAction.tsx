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
import {
  ParticleField,
  CameraWrapper,
  GlowPulse,
  RadialGlow,
} from "../components";
import { useTypewriter } from "../../hooks/useTypewriter";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Main headline entrance with spring
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const headlineScale = interpolate(headlineProgress, [0, 1], [0.8, 1]);
  const headlineOpacity = interpolate(headlineProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Price reveal with slide up
  const priceProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const priceY = interpolate(priceProgress, [0, 1], [30, 0]);
  const priceOpacity = interpolate(priceProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // URL typewriter in button (starts at frame 40)
  const url = useTypewriter("buildwithjeremy.com/ai-employee", {
    startFrame: 40,
    charsPerSecond: 35,
  });

  // Button visibility
  const buttonOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button glow pulse (synced to imagined beat)
  const pulseFrame = Math.max(0, frame - 40);
  const pulseCycle = pulseFrame % 30;
  const pulseWave = Math.sin((pulseCycle / 30) * Math.PI * 2) * 0.5 + 0.5;
  const buttonScale = 1 + pulseWave * 0.03;
  const glowRadius = 30 + pulseWave * 25;

  // Tagline fade
  const taglineOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Branding fade
  const brandingOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final glow intensification
  const finalGlow = interpolate(frame, [100, 120], [1, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary}90 100%)`,
      }}
    >
      {/* Layer 0: Particle field converging toward button */}
      <ParticleField
        count={40}
        color={`${colors.accent}60`}
        minSize={2}
        maxSize={4}
        speed={0.3}
        direction="up"
        convergePoint={{ x: 0, y: 100 }} // Toward button area
        convergeStartFrame={60}
        convergeDuration={50}
      />

      {/* Layer 1: Radial glow behind CTA */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RadialGlow
          color={colors.accent}
          size={700 * finalGlow}
          minOpacity={0.1}
          maxOpacity={0.25}
          cycleDuration={45}
          blur={50}
          startFrame={0}
        />
      </AbsoluteFill>

      {/* Layer 2: Subtle camera push */}
      <CameraWrapper
        zoomStart={1}
        zoomEnd={1.04}
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
              transform: `scale(${headlineScale})`,
              opacity: headlineOpacity,
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
                textShadow: `0 0 30px ${colors.white}20`,
              }}
            >
              Get Your AI Employee
            </h1>

            {/* Price */}
            <div
              style={{
                marginTop: 30,
                opacity: frame >= 20 ? priceOpacity : 0,
                transform: `translateY(${priceY}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: colors.accent,
                  textShadow: `0 0 20px ${colors.accent}40`,
                }}
              >
                Starting at $2,997
              </span>
            </div>

            {/* CTA Button with typed URL */}
            <div
              style={{
                marginTop: 50,
                opacity: buttonOpacity,
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
                  transform: `scale(${buttonScale})`,
                  boxShadow: `0 0 ${glowRadius}px ${colors.accent}80, 0 0 ${glowRadius * 2}px ${colors.accent}40`,
                  minWidth: 500,
                }}
              >
                {url.displayText}
                <span
                  style={{
                    opacity: url.isTyping ? 1 : 0,
                    color: colors.dark,
                  }}
                >
                  {url.cursor}
                </span>
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
              Configured. Tested.{" "}
              <span style={{ color: colors.accent }}>Shipped to your door.</span>
            </p>
          </div>
        </AbsoluteFill>
      </CameraWrapper>

      {/* Bottom corner branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: brandingOpacity,
        }}
      >
        <span style={{ fontSize: 18, color: colors.textMuted }}>Built by</span>
        <span style={{ fontSize: 20, fontWeight: 600, color: colors.white }}>
          Jeremy Pittman
        </span>
      </div>
    </AbsoluteFill>
  );
};
