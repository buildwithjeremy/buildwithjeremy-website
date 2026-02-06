import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../config/colors";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  startFrame?: number;
  charsPerSecond?: number;
  showCheckmark?: boolean;
  checkmarkDelay?: number; // frames after message complete
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  startFrame = 0,
  charsPerSecond = 40,
  showCheckmark = false,
  checkmarkDelay = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const translateY = interpolate(entranceProgress, [0, 1], [30, 0]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Typewriter effect
  const framesPerChar = fps / charsPerSecond;
  const localFrame = Math.max(0, frame - startFrame - 10); // 10 frame delay after entrance
  const charsToShow = Math.min(
    message.length,
    Math.floor(localFrame / framesPerChar)
  );
  const displayText = message.slice(0, charsToShow);
  const isTyping = charsToShow < message.length;
  const isComplete = charsToShow >= message.length;

  // Blinking cursor
  const cursorOpacity = isTyping
    ? interpolate(
        frame % 16,
        [0, 8, 16],
        [1, 0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Checkmark animation
  const messageCompleteFrame = startFrame + 10 + Math.ceil(message.length * framesPerChar);
  const checkmarkProgress = spring({
    frame: frame - messageCompleteFrame - checkmarkDelay,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const checkmarkScale = interpolate(checkmarkProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        opacity,
        transform: `translateY(${translateY}px)`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "14px 20px",
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          background: isUser
            ? `linear-gradient(135deg, ${colors.brand}, ${colors.primary})`
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: isUser ? "none" : "blur(12px)",
          border: isUser ? "none" : "1px solid rgba(255, 255, 255, 0.15)",
          position: "relative",
        }}
      >
        <span
          style={{
            color: colors.white,
            fontSize: 18,
            lineHeight: 1.5,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
          }}
        >
          {displayText}
          <span
            style={{
              opacity: cursorOpacity,
              marginLeft: 2,
            }}
          >
            |
          </span>
        </span>

        {/* Checkmark for AI responses */}
        {showCheckmark && isComplete && !isUser && (
          <div
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${checkmarkScale})`,
              boxShadow: `0 4px 12px ${colors.accent}50`,
            }}
          >
            <span style={{ fontSize: 16 }}>✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Thinking indicator component
export const ThinkingIndicator: React.FC<{ startFrame?: number }> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Dot animation cycle (24 frames = 0.8s)
  const cycleFrame = (frame - startFrame) % 24;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        opacity,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderRadius: "20px 20px 20px 4px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => {
          const dotOpacity = interpolate(
            (cycleFrame + i * 8) % 24,
            [0, 12, 24],
            [0.3, 1, 0.3]
          );
          return (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.accent,
                opacity: dotOpacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
