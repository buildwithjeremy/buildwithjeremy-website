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
import { useTypewriter } from "../../hooks/useTypewriter";

export const LiveDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screen mockup entrance
  const screenY = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
    from: 100,
    to: 0,
  });

  const screenOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // User prompt typing
  const userPrompt = useTypewriter(
    "Draft a follow-up email to the client about their project status",
    { startFrame: 30, charsPerSecond: 40 }
  );

  // AI response typing (starts after user prompt)
  const aiResponse = useTypewriter(
    "Done! Email drafted and ready to send. I've included the latest milestones and next steps.",
    { startFrame: 130, charsPerSecond: 50 }
  );

  // Checkmark animation
  const checkmarkProgress = interpolate(frame, [200, 230], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tool icons floating animation
  const toolIcons = ["📧", "📅", "💬", "📊", "🔗"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Background tool icons floating */}
      {toolIcons.map((icon, i) => {
        const floatY = Math.sin((frame + i * 50) / 30) * 10;
        const opacity = 0.15;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              fontSize: 48,
              opacity,
              transform: `translateY(${floatY}px)`,
            }}
          >
            {icon}
          </div>
        );
      })}

      {/* Browser mockup */}
      <div
        style={{
          width: 1200,
          transform: `translateY(${screenY}px)`,
          opacity: screenOpacity,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "16px 16px 0 0",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#27c93f" }} />
          </div>
          {/* URL bar */}
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              padding: "8px 16px",
              background: "#0d0d0d",
              borderRadius: 8,
              fontSize: 14,
              color: colors.textMuted,
            }}
          >
            AI Employee • Local • Secure
          </div>
        </div>

        {/* Chat interface */}
        <div
          style={{
            background: `linear-gradient(180deg, #0f0f1a 0%, #0a0a15 100%)`,
            borderRadius: "0 0 16px 16px",
            padding: 40,
            minHeight: 400,
          }}
        >
          {/* User message */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
            <div
              style={{
                background: colors.brand,
                color: colors.white,
                padding: "16px 24px",
                borderRadius: "20px 20px 4px 20px",
                maxWidth: "70%",
                fontSize: 22,
              }}
            >
              {userPrompt.displayText}
              <span style={{ color: colors.accent }}>{userPrompt.cursor}</span>
            </div>
          </div>

          {/* AI response */}
          {frame > 125 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              {/* AI avatar */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.brand} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                🦞
              </div>
              <div
                style={{
                  background: "#1a1a2a",
                  border: `1px solid ${colors.brand}40`,
                  color: colors.white,
                  padding: "16px 24px",
                  borderRadius: "20px 20px 20px 4px",
                  maxWidth: "70%",
                  fontSize: 22,
                }}
              >
                {aiResponse.displayText}
                <span style={{ color: colors.accent }}>{aiResponse.cursor}</span>

                {/* Checkmark after completion */}
                {checkmarkProgress > 0 && (
                  <span
                    style={{
                      marginLeft: 12,
                      color: colors.accent,
                      opacity: checkmarkProgress,
                      display: "inline-block",
                      transform: `scale(${checkmarkProgress})`,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Integration badges */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 40,
              opacity: interpolate(frame, [180, 210], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }),
            }}
          >
            {["Gmail", "Slack", "Calendar", "HubSpot"].map((tool, i) => (
              <div
                key={tool}
                style={{
                  padding: "8px 16px",
                  background: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}30`,
                  borderRadius: 20,
                  fontSize: 14,
                  color: colors.accent,
                }}
              >
                {tool}
              </div>
            ))}
            <div
              style={{
                padding: "8px 16px",
                background: `${colors.textMuted}15`,
                borderRadius: 20,
                fontSize: 14,
                color: colors.textMuted,
              }}
            >
              +100 more
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
