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
import { CameraWrapper } from "../components";

// Thinking indicator dots
const ThinkingDots: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();

  if (!visible) return null;

  return (
    <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
      {[0, 1, 2].map((i) => {
        const dotFrame = (frame + i * 8) % 24;
        const opacity = interpolate(dotFrame, [0, 12, 24], [0.3, 1, 0.3]);
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: colors.textMuted,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// Integration badge with fly-in animation
const IntegrationBadge: React.FC<{
  name: string;
  startFrame: number;
  index: number;
  fromX: number;
}> = ({ name, startFrame, index, fromX }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame - index * 8,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const x = interpolate(progress, [0, 1], [fromX, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  if (frame < startFrame + index * 8) {
    return null;
  }

  return (
    <div
      style={{
        padding: "8px 16px",
        background: `${colors.accent}15`,
        border: `1px solid ${colors.accent}30`,
        borderRadius: 20,
        fontSize: 14,
        color: colors.accent,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      {name}
    </div>
  );
};

export const LiveDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Screen mockup entrance
  const screenProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const screenY = interpolate(screenProgress, [0, 1], [100, 0]);
  const screenOpacity = interpolate(screenProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // User prompt typing
  const userPrompt = useTypewriter(
    "Draft a follow-up email to the client about their project status",
    { startFrame: 30, charsPerSecond: 40 }
  );

  // Show thinking indicator between prompts
  const showThinking = frame >= 100 && frame < 115;

  // AI response typing (starts after thinking)
  const aiResponse = useTypewriter(
    "Done! Email drafted and ready to send. I've included the latest milestones and next steps.",
    { startFrame: 115, charsPerSecond: 50 }
  );

  // Checkmark animation
  const checkmarkProgress = spring({
    frame: frame - 190,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const checkmarkScale = interpolate(checkmarkProgress, [0, 1], [0, 1]);
  const checkmarkRotation = interpolate(checkmarkProgress, [0, 1], [-45, 0]);

  // Background floating icons with better parallax
  const toolIcons = [
    { emoji: "📧", x: 12, y: 15, speed: 0.8 },
    { emoji: "📅", x: 85, y: 20, speed: 1.2 },
    { emoji: "💬", x: 8, y: 70, speed: 0.6 },
    { emoji: "📊", x: 90, y: 75, speed: 1.0 },
    { emoji: "🔗", x: 50, y: 10, speed: 0.9 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
      }}
    >
      {/* Background floating icons with parallax */}
      {toolIcons.map((icon, i) => {
        const floatY = Math.sin((frame * icon.speed + i * 50) / 30) * 15;
        const floatX = Math.cos((frame * icon.speed * 0.5 + i * 30) / 40) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              fontSize: 48,
              opacity: 0.12,
              transform: `translate(${floatX}px, ${floatY}px)`,
            }}
          >
            {icon.emoji}
          </div>
        );
      })}

      {/* Camera wrapper with zoom toward chat */}
      <CameraWrapper
        zoomStart={1}
        zoomEnd={1.08}
        panY={[0, -20]}
        startFrame={0}
        endFrame={durationInFrames}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 60,
          }}
        >
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
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#ff5f56",
                  }}
                />
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#ffbd2e",
                  }}
                />
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#27c93f",
                  }}
                />
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: colors.accent }}>🔒</span>
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
                    boxShadow: `0 4px 20px ${colors.brand}40`,
                  }}
                >
                  {userPrompt.displayText}
                  <span style={{ color: colors.accent }}>
                    {userPrompt.cursor}
                  </span>
                </div>
              </div>

              {/* Thinking indicator */}
              {showThinking && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
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
                      padding: "12px 20px",
                      borderRadius: "20px 20px 20px 4px",
                    }}
                  >
                    <ThinkingDots visible={true} />
                  </div>
                </div>
              )}

              {/* AI response */}
              {frame >= 115 && (
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
                      boxShadow: `0 4px 15px ${colors.accent}30`,
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
                    <span style={{ color: colors.accent }}>
                      {aiResponse.cursor}
                    </span>

                    {/* Checkmark after completion */}
                    {frame >= 190 && (
                      <span
                        style={{
                          marginLeft: 12,
                          color: colors.accent,
                          display: "inline-block",
                          transform: `scale(${checkmarkScale}) rotate(${checkmarkRotation}deg)`,
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Integration badges - fly in from edges */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 40,
                  flexWrap: "wrap",
                }}
              >
                <IntegrationBadge
                  name="Gmail"
                  startFrame={180}
                  index={0}
                  fromX={-100}
                />
                <IntegrationBadge
                  name="Slack"
                  startFrame={180}
                  index={1}
                  fromX={-100}
                />
                <IntegrationBadge
                  name="Calendar"
                  startFrame={180}
                  index={2}
                  fromX={100}
                />
                <IntegrationBadge
                  name="HubSpot"
                  startFrame={180}
                  index={3}
                  fromX={100}
                />

                {/* +100 more badge */}
                {frame >= 220 && (
                  <div
                    style={{
                      padding: "8px 16px",
                      background: `${colors.textMuted}15`,
                      borderRadius: 20,
                      fontSize: 14,
                      color: colors.textMuted,
                      opacity: interpolate(frame, [220, 235], [0, 1], {
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    +100 more
                  </div>
                )}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </CameraWrapper>
    </AbsoluteFill>
  );
};
