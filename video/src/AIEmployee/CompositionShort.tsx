import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { colors } from "../config/colors";
import { SCENES_SHORT, TRANSITIONS_SHORT } from "../config/timing-short";

// ========================================
// SCENE 1: Hook + Product Combined (0-7s)
// ========================================
const HookAndProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase 1: Title entrance (0-60 frames / 0-2s)
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.5 },
  });

  // Phase 2: Product features appear (60-210 frames / 2-7s)
  const featureDelay = 75;
  const feature1Progress = spring({
    frame: Math.max(0, frame - featureDelay),
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const feature2Progress = spring({
    frame: Math.max(0, frame - featureDelay - 20),
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const feature3Progress = spring({
    frame: Math.max(0, frame - featureDelay - 40),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Camera zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    easing: Easing.inOut(Easing.quad),
  });

  // Glow pulse
  const glowIntensity =
    0.6 + Math.sin((frame / 30) * Math.PI * 2) * 0.4;

  // Title animation
  const titleY = interpolate(titleProgress, [0, 1], [80, 0]);
  const titleScale = interpolate(titleProgress, [0, 1], [1.2, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 0.3], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        transform: `scale(${zoom})`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 70%)`,
          filter: `blur(60px)`,
          opacity: glowIntensity,
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: colors.accent,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Done-For-You AI Setup
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: colors.white,
              letterSpacing: "-3px",
              lineHeight: 1.1,
              textShadow: `0 0 ${60 * glowIntensity}px ${colors.accent}40`,
            }}
          >
            Your AI Employee
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 600,
              background: `linear-gradient(90deg, ${colors.brand}, ${colors.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: "10px",
            }}
          >
            Shipped to Your Door
          </div>
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {[
            { label: "Mac Mini M4", icon: "🖥️", progress: feature1Progress },
            { label: "100% Local", icon: "🔒", progress: feature2Progress },
            { label: "Runs 24/7", icon: "⚡", progress: feature3Progress },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                opacity: feature.progress,
                transform: `translateY(${interpolate(feature.progress, [0, 1], [30, 0])}px)`,
                padding: "20px 40px",
                background: `linear-gradient(135deg, ${colors.dark}ee, ${colors.primary}30)`,
                borderRadius: "16px",
                border: `2px solid ${colors.brand}40`,
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <span style={{ fontSize: "32px" }}>{feature.icon}</span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: colors.white,
                }}
              >
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        {/* Powered by OpenClaw */}
        <div
          style={{
            marginTop: "50px",
            opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }),
            color: colors.textMuted,
            fontSize: "20px",
          }}
        >
          Powered by{" "}
          <span style={{ color: "#ff4444", fontWeight: 600 }}>OpenClaw</span>{" "}
          <span style={{ color: colors.textMuted }}>• 135K+ GitHub stars</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========================================
// SCENE 2: Value Props (7-12s)
// ========================================
const ValuePropsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Staggered stat entrances
  const stats = [
    { value: "$0", label: "Monthly Salary", delay: 0 },
    { value: "24/7", label: "Always Working", delay: 15 },
    { value: "20+", label: "Hours Saved/Week", delay: 30 },
  ];

  // Background gradient rotation
  const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 175]);

  // Camera zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${colors.dark} 0%, #0a1628 50%, ${colors.dark} 100%)`,
        transform: `scale(${zoom})`,
      }}
    >
      {/* Stats grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "80px",
        }}
      >
        {stats.map((stat, i) => {
          const progress = spring({
            frame: Math.max(0, frame - stat.delay),
            fps,
            config: { damping: 12, stiffness: 100, mass: 1 },
          });

          const scale = interpolate(progress, [0, 1], [0.5, 1]);
          const y = interpolate(progress, [0, 1], [50, 0]);

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: progress,
                transform: `translateY(${y}px) scale(${scale})`,
              }}
            >
              <div
                style={{
                  fontSize: "120px",
                  fontWeight: 800,
                  color: colors.accent,
                  textShadow: `0 0 40px ${colors.accent}60`,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 500,
                  color: colors.textSecondary,
                  marginTop: "10px",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: 500,
            color: colors.textSecondary,
          }}
        >
          One-time investment. Works forever.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========================================
// SCENE 3: Call to Action (12-18s)
// ========================================
const CallToActionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Headline entrance
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.5 },
  });

  // Price entrance
  const priceProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Button entrance and pulse
  const buttonProgress = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const pulseWave = Math.sin(((frame - 30) / 30) * Math.PI * 2) * 0.5 + 0.5;
  const glowRadius = 20 + pulseWave * 40;

  // Camera zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    easing: Easing.inOut(Easing.quad),
  });

  // Final glow intensify
  const finalGlow = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [0.5, 1],
    { extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        transform: `scale(${zoom})`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1000px",
          height: "1000px",
          background: `radial-gradient(circle, ${colors.accent}${Math.round(finalGlow * 25).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineProgress,
            transform: `translateY(${interpolate(headlineProgress, [0, 1], [40, 0])}px) scale(${interpolate(headlineProgress, [0, 1], [1.1, 1])})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: colors.white,
              letterSpacing: "-2px",
            }}
          >
            Get Your AI Employee
          </div>
        </div>

        {/* Price */}
        <div
          style={{
            marginTop: "30px",
            opacity: priceProgress,
            transform: `translateY(${interpolate(priceProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            $2,997
          </span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 500,
              color: colors.textSecondary,
              marginLeft: "15px",
            }}
          >
            one-time
          </span>
        </div>

        {/* Button */}
        <div
          style={{
            marginTop: "50px",
            opacity: buttonProgress,
            transform: `scale(${interpolate(buttonProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              padding: "24px 60px",
              background: colors.accent,
              borderRadius: "16px",
              boxShadow: `0 0 ${glowRadius}px ${colors.accent}, 0 0 ${glowRadius * 2}px ${colors.accent}40`,
              fontSize: "28px",
              fontWeight: 700,
              color: colors.dark,
              letterSpacing: "1px",
            }}
          >
            buildwithjeremy.com/ai-employee
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "40px",
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
            color: colors.textMuted,
            fontSize: "24px",
          }}
        >
          Configured. Tested. Shipped to your door.
        </div>
      </div>

      {/* Brand */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          color: colors.textMuted,
          fontSize: "20px",
        }}
      >
        Build with Jeremy
      </div>
    </AbsoluteFill>
  );
};

// ========================================
// MAIN COMPOSITION (18 seconds)
// ========================================
export const AIEmployeeVideoShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark }}>
      <TransitionSeries>
        {/* Scene 1: Hook + Product (0-7s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES_SHORT.hookAndProduct.durationFrames}>
          <HookAndProductScene />
        </TransitionSeries.Sequence>

        {/* Transition: Slide to Value Props */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITIONS_SHORT.slide })}
        />

        {/* Scene 2: Value Props (7-12s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES_SHORT.valueProps.durationFrames}>
          <ValuePropsScene />
        </TransitionSeries.Sequence>

        {/* Transition: Fade to CTA */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITIONS_SHORT.fade })}
        />

        {/* Scene 3: Call to Action (12-18s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES_SHORT.callToAction.durationFrames}>
          <CallToActionScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
