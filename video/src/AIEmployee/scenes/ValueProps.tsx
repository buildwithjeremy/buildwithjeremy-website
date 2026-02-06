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
  CameraWrapper,
  CountingNumber,
  CountingTime247,
  CountingNumberPlus,
} from "../components";

interface StatContainerProps {
  children: React.ReactNode;
  label: string;
  delay: number;
}

const StatContainer: React.FC<StatContainerProps> = ({
  children,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale entrance
  const entranceProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(entranceProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Label fades in slightly after the number
  const labelOpacity = interpolate(frame, [delay + 30, delay + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < delay) {
    return null;
  }

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${scale})`,
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
        {children}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: colors.white,
          marginTop: 12,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ValueProps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background gradient animation - more dramatic rotation
  const gradientShift = interpolate(frame, [0, 180], [0, 40], {
    easing: Easing.inOut(Easing.quad),
  });

  // Corner quote fade in
  const quoteOpacity = interpolate(frame, [0, 30], [0, 0.5], {
    extrapolateRight: "clamp",
  });

  // Footer text fade in with slide
  const footerOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const footerY = interpolate(frame, [120, 145], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradientShift}deg, ${colors.primary} 0%, ${colors.dark} 50%, ${colors.brand} 100%)`,
      }}
    >
      {/* Subtle camera push */}
      <CameraWrapper
        zoomStart={1}
        zoomEnd={1.03}
        startFrame={0}
        endFrame={durationInFrames}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Stats grid */}
          <div
            style={{
              display: "flex",
              gap: 140,
              alignItems: "flex-end",
            }}
          >
            {/* Stat 1: $0/mo - counts down from 99 for drama */}
            <StatContainer label="Salary" delay={0}>
              <CountingNumber
                value={0}
                countFrom={99}
                countDirection="down"
                prefix="$"
                suffix="/mo"
                startFrame={5}
                durationFrames={45}
                showFlash={true}
                flashColor={colors.accent}
              />
            </StatContainer>

            {/* Stat 2: 24/7 - counts up to 24 then reveals /7 */}
            <StatContainer label="Always On" delay={30}>
              <CountingTime247 startFrame={35} />
            </StatContainer>

            {/* Stat 3: 20+ - counts up to 20 then reveals + */}
            <StatContainer label="Hours Saved / Week" delay={60}>
              <CountingNumberPlus value={20} startFrame={65} />
            </StatContainer>
          </div>
        </AbsoluteFill>
      </CameraWrapper>

      {/* Footer text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          opacity: footerOpacity,
          transform: `translateY(${footerY}px)`,
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

      {/* Decorative corner quote */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontSize: 24,
          color: colors.textMuted,
          opacity: quoteOpacity,
        }}
      >
        Why pay a salary when you can own it?
      </div>
    </AbsoluteFill>
  );
};
