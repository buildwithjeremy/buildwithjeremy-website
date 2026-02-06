import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { colors } from "../../config/colors";
import {
  ChatMessage,
  ThinkingIndicator,
  GlassCard,
  GradientBackground,
  RadialGlow,
} from "../components";

// Integration icon component
const IntegrationIcon: React.FC<{
  icon: string;
  label: string;
  delay: number;
  x: number;
  y: number;
}> = ({ icon, label, delay, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const scale = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const AIDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Chat container entrance
  const containerProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const containerY = interpolate(containerProgress, [0, 1], [50, 0]);
  const containerOpacity = interpolate(containerProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Message timings
  const userMessageStart = 15;
  const userMessage = "Schedule follow-ups for all leads from today";
  const userTypingDuration = Math.ceil((userMessage.length / 40) * fps); // 40 chars/sec

  const thinkingStart = userMessageStart + userTypingDuration + 10;
  const thinkingDuration = 20; // ~0.7 seconds

  const aiMessageStart = thinkingStart + thinkingDuration;
  const aiMessage = "Done. 12 follow-ups scheduled across Gmail and HubSpot.";

  // Show thinking indicator only during thinking phase
  const showThinking = frame >= thinkingStart && frame < aiMessageStart;

  return (
    <AbsoluteFill>
      {/* Background */}
      <GradientBackground
        colorStart={colors.dark}
        colorEnd="#0d1a2d"
        angle={160}
      />

      {/* Subtle glow */}
      <RadialGlow
        color={colors.brand}
        size={700}
        minOpacity={0.05}
        maxOpacity={0.1}
        cycleDuration={100}
        blur={80}
        x="50%"
        y="40%"
      />

      {/* Integration icons floating in background */}
      <IntegrationIcon icon="📧" label="Gmail" delay={30} x={120} y={180} />
      <IntegrationIcon icon="💬" label="Slack" delay={45} x={width - 180} y={200} />
      <IntegrationIcon icon="📅" label="Calendar" delay={60} x={100} y={height - 220} />
      <IntegrationIcon icon="🔶" label="HubSpot" delay={75} x={width - 160} y={height - 200} />

      {/* Chat container */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
        }}
      >
        <GlassCard
          blur={24}
          opacity={0.08}
          borderRadius={28}
          entranceDirection="none"
          style={{
            width: 700,
            padding: 32,
          }}
        >
          {/* Chat header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: colors.accent,
                boxShadow: `0 0 8px ${colors.accent}`,
              }}
            />
            <span
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
              }}
            >
              AI Employee • Online
            </span>
          </div>

          {/* Messages */}
          <div style={{ minHeight: 180 }}>
            <ChatMessage
              message={userMessage}
              isUser={true}
              startFrame={userMessageStart}
              charsPerSecond={40}
            />

            {showThinking && <ThinkingIndicator startFrame={thinkingStart} />}

            {frame >= aiMessageStart && (
              <ChatMessage
                message={aiMessage}
                isUser={false}
                startFrame={aiMessageStart}
                charsPerSecond={50}
                showCheckmark={true}
                checkmarkDelay={10}
              />
            )}
          </div>
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
