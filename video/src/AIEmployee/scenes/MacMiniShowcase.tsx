import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { colors } from "../../config/colors";

export const MacMiniShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Product entrance from below with spring
  const productY = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    from: 200,
    to: 0,
  });

  // Product scale for emphasis
  const productScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20 },
    from: 0.8,
    to: 1,
  });

  // Floating labels animation
  const labelOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const label1X = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12 },
    from: -50,
    to: 0,
  });

  const label2X = spring({
    frame: frame - 90,
    fps,
    config: { damping: 12 },
    from: 50,
    to: 0,
  });

  // Spotlight glow effect
  const spotlightIntensity = interpolate(
    frame,
    [0, 60, 120, 180, 240],
    [0.3, 0.8, 0.5, 0.9, 0.7]
  );

  // Features that appear around the product
  const features = [
    { text: "Mac Mini M4", icon: "🖥️", side: "left" },
    { text: "Runs 24/7", icon: "⚡", side: "right" },
    { text: "100% Local", icon: "🔒", side: "left" },
    { text: "Your Data Stays Yours", icon: "🛡️", side: "right" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Spotlight gradient behind product */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}${Math.floor(spotlightIntensity * 20).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Product image container */}
      <div
        style={{
          transform: `translateY(${productY}px) scale(${Math.max(0.8, productScale)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Mac Mini placeholder - using CSS shape */}
        <div
          style={{
            width: 400,
            height: 160,
            background: `linear-gradient(180deg, #e8e8e8 0%, #c4c4c4 50%, #1a1a1a 50%, #0a0a0a 100%)`,
            borderRadius: 24,
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 ${60 * spotlightIntensity}px ${colors.accent}40`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top surface details */}
          <div
            style={{
              position: "absolute",
              top: 25,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1)",
            }}
          />
          {/* Power indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 30,
              right: 40,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: colors.accent,
              boxShadow: `0 0 10px ${colors.accent}`,
            }}
          />
        </div>

        {/* "Powered by OpenClaw" badge */}
        <div
          style={{
            marginTop: 40,
            padding: "12px 24px",
            background: `${colors.brand}20`,
            borderRadius: 30,
            border: `1px solid ${colors.brand}40`,
            opacity: labelOpacity,
          }}
        >
          <span style={{ color: colors.white, fontSize: 20 }}>
            Powered by <span style={{ color: colors.accent, fontWeight: 600 }}>OpenClaw</span>
            <span style={{ color: colors.textMuted, marginLeft: 10 }}>126K+ ⭐</span>
          </span>
        </div>
      </div>

      {/* Floating feature labels */}
      {features.map((feature, i) => {
        const delay = 100 + i * 25;
        const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });
        const x = spring({
          frame: frame - delay,
          fps,
          config: { damping: 15 },
          from: feature.side === "left" ? -30 : 30,
          to: 0,
        });

        const yOffset = (i % 2 === 0 ? -1 : 1) * (80 + i * 40);
        const xOffset = feature.side === "left" ? -450 : 450;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${xOffset}px)`,
              top: `calc(50% + ${yOffset}px)`,
              transform: `translateX(${feature.side === "left" ? x : -x}px)`,
              opacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexDirection: feature.side === "left" ? "row" : "row-reverse",
            }}
          >
            <span style={{ fontSize: 36 }}>{feature.icon}</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: colors.white,
                whiteSpace: "nowrap",
              }}
            >
              {feature.text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
