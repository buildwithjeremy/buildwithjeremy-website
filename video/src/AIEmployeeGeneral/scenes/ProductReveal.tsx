import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../../config/colors";
import { MacMini3D } from "../../AIEmployee/components/MacMini3D";
import { FeatureBadge, RadialGlow, GradientBackground } from "../components";

export const ProductReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // OpenClaw badge animation
  const badgeProgress = spring({
    frame: frame - 90,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  // Badge glow pulse
  const glowPulse = Math.sin((frame / 30) * Math.PI) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Dark gradient background */}
      <GradientBackground
        colorStart={colors.dark}
        colorEnd="#0a1628"
        angle={180}
      />

      {/* Spotlight glow behind Mac Mini */}
      <RadialGlow
        color={colors.white}
        size={1000}
        minOpacity={0.03}
        maxOpacity={0.08}
        cycleDuration={120}
        blur={100}
        y="60%"
      />

      {/* Accent glow */}
      <RadialGlow
        color={colors.accent}
        size={500}
        minOpacity={0.05}
        maxOpacity={0.12}
        cycleDuration={80}
        blur={60}
        x="70%"
        y="70%"
      />

      {/* 3D Mac Mini */}
      <MacMini3D
        rotationStart={-0.2}
        rotationEnd={Math.PI * 0.25}
        entranceStartFrame={0}
        entranceDuration={40}
      />

      {/* Feature badges positioned around the Mac Mini */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Top-left badge */}
        <div style={{ position: "absolute", top: "18%", left: "12%" }}>
          <FeatureBadge
            icon="⚙️"
            text="Pre-Configured"
            direction="left"
            delay={30}
          />
        </div>

        {/* Top-right badge */}
        <div style={{ position: "absolute", top: "18%", right: "12%" }}>
          <FeatureBadge
            icon="🌙"
            text="24/7 Ready"
            direction="right"
            delay={45}
          />
        </div>

        {/* Bottom-left badge */}
        <div style={{ position: "absolute", bottom: "22%", left: "12%" }}>
          <FeatureBadge
            icon="🔧"
            text="Your Tools"
            direction="left"
            delay={60}
          />
        </div>

        {/* Bottom-right badge */}
        <div style={{ position: "absolute", bottom: "22%", right: "12%" }}>
          <FeatureBadge
            icon="🎯"
            text="Your Voice"
            direction="right"
            delay={75}
          />
        </div>
      </AbsoluteFill>

      {/* OpenClaw Inside badge at bottom center */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: `translateX(-50%) scale(${badgeScale})`,
          opacity: badgeOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
            background: `linear-gradient(135deg, ${colors.accent}20, ${colors.brand}20)`,
            backdropFilter: "blur(16px)",
            borderRadius: 20,
            border: `2px solid ${colors.accent}`,
            boxShadow: `0 0 ${20 + glowPulse * 15}px ${colors.accent}50`,
          }}
        >
          <span style={{ fontSize: 24 }}>🤖</span>
          <span
            style={{
              color: colors.white,
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            OpenClaw Inside
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
