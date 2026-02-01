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

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

const AnimatedStat: React.FC<StatProps> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${Math.max(0, scale)})`,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: colors.accent,
          lineHeight: 1,
          textShadow: `0 0 40px ${colors.accent}60`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: colors.white,
          marginTop: 12,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ValueProps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "$0/mo", label: "Salary" },
    { value: "24/7", label: "Always On" },
    { value: "20+", label: "Hours Saved / Week" },
  ];

  // Background gradient animation
  const gradientShift = interpolate(frame, [0, 180], [0, 30]);

  // "One-time investment" fade in
  const footerOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradientShift}deg, ${colors.primary} 0%, ${colors.dark} 50%, ${colors.brand} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Stats grid */}
      <div
        style={{
          display: "flex",
          gap: 120,
          alignItems: "flex-end",
        }}
      >
        {stats.map((stat, i) => (
          <AnimatedStat
            key={stat.label}
            value={stat.value}
            label={stat.label}
            delay={i * 30}
          />
        ))}
      </div>

      {/* Footer text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: footerOpacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 32,
            color: colors.white,
            margin: 0,
          }}
        >
          One-time investment.{" "}
          <span style={{ color: colors.accent }}>Works forever.</span>
        </p>
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontSize: 24,
          color: colors.textMuted,
          opacity: 0.5,
        }}
      >
        Why pay a salary when you can own it?
      </div>
    </AbsoluteFill>
  );
};
