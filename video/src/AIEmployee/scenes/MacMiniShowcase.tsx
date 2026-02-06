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
import { MacMini3D, RadialGlow, GlowPulse } from "../components";

// Feature label with motion blur entrance effect
const FeatureLabel: React.FC<{
  text: string;
  icon: string;
  side: "left" | "right";
  delay: number;
}> = ({ text, icon, side, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const x = interpolate(progress, [0, 1], [side === "left" ? -80 : 80, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Motion blur simulation - slight horizontal stretch during movement
  const scaleX = interpolate(progress, [0, 0.5, 1], [1.3, 1.1, 1]);

  if (frame < delay) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexDirection: side === "left" ? "row" : "row-reverse",
        transform: `translateX(${x}px) scaleX(${scaleX})`,
        opacity,
        transformOrigin: side === "left" ? "left center" : "right center",
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: colors.white,
          whiteSpace: "nowrap",
          textShadow: `0 2px 10px rgba(0,0,0,0.5)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const MacMiniShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Spotlight intensity animation
  const spotlightIntensity = interpolate(
    frame,
    [0, 30, 60, 120, 180, 240],
    [0.2, 0.6, 1, 0.7, 0.9, 0.8],
    { extrapolateRight: "clamp" }
  );

  // OpenClaw badge entrance
  const badgeProgress = spring({
    frame: frame - 160,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const badgeScale = interpolate(badgeProgress, [0, 1], [0.8, 1]);
  const badgeOpacity = interpolate(badgeProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Features that appear around the product
  const features = [
    { text: "Mac Mini M4", icon: "🖥️", side: "left" as const, yOffset: -120 },
    { text: "Runs 24/7", icon: "⚡", side: "right" as const, yOffset: -60 },
    { text: "100% Local", icon: "🔒", side: "left" as const, yOffset: 60 },
    {
      text: "Your Data Stays Yours",
      icon: "🛡️",
      side: "right" as const,
      yOffset: 120,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
      }}
    >
      {/* Spotlight glow behind product */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RadialGlow
          color={colors.accent}
          size={900}
          minOpacity={0.05 * spotlightIntensity}
          maxOpacity={0.2 * spotlightIntensity}
          cycleDuration={120}
          blur={80}
          startFrame={0}
        />
      </AbsoluteFill>

      {/* Secondary purple glow */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.brand}15 0%, transparent 70%)`,
            filter: "blur(60px)",
            transform: "translateY(50px)",
          }}
        />
      </AbsoluteFill>

      {/* 3D Mac Mini */}
      <MacMini3D
        rotationStart={-0.2}
        rotationEnd={Math.PI * 0.35}
        entranceStartFrame={0}
        entranceDuration={40}
      />

      {/* Floating feature labels */}
      {features.map((feature, i) => {
        const delay = 60 + i * 30;
        const xOffset = feature.side === "left" ? -500 : 500;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${xOffset}px)`,
              top: `calc(50% + ${feature.yOffset}px)`,
            }}
          >
            <FeatureLabel
              text={feature.text}
              icon={feature.icon}
              side={feature.side}
              delay={delay}
            />
          </div>
        );
      })}

      {/* "Powered by OpenClaw" badge */}
      {frame >= 160 && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: "50%",
            transform: `translateX(-50%) scale(${badgeScale})`,
            opacity: badgeOpacity,
          }}
        >
          <GlowPulse
            color={colors.accent}
            minRadius={10}
            maxRadius={25}
            cycleDuration={45}
            minScale={1}
            maxScale={1.02}
            startFrame={180}
            style={{
              padding: "16px 32px",
              background: `linear-gradient(135deg, ${colors.brand}30 0%, ${colors.dark}90 100%)`,
              borderRadius: 40,
              border: `1px solid ${colors.brand}50`,
            }}
          >
            <span style={{ color: colors.white, fontSize: 22, fontWeight: 500 }}>
              Powered by{" "}
              <span style={{ color: colors.accent, fontWeight: 700 }}>
                OpenClaw
              </span>
              <span
                style={{
                  color: colors.textMuted,
                  marginLeft: 12,
                  fontSize: 18,
                }}
              >
                126K+ ⭐
              </span>
            </span>
          </GlowPulse>
        </div>
      )}
    </AbsoluteFill>
  );
};
