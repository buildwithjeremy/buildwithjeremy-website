import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../config/colors";

interface PulsingButtonProps {
  text: string;
  glowColor?: string;
  pulseSpeed?: number; // frames per pulse cycle
  startFrame?: number;
  showTypewriter?: boolean;
  typewriterText?: string;
}

export const PulsingButton: React.FC<PulsingButtonProps> = ({
  text,
  glowColor = colors.accent,
  pulseSpeed = 60, // 2 seconds per cycle at 30fps
  startFrame = 0,
  showTypewriter = false,
  typewriterText = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.6, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Pulsing glow (sine wave)
  const pulseProgress = ((frame - startFrame) % pulseSpeed) / pulseSpeed;
  const glowIntensity = Math.sin(pulseProgress * Math.PI * 2) * 0.5 + 0.5;
  const glowSize = interpolate(glowIntensity, [0, 1], [15, 30]);
  const glowOpacity = interpolate(glowIntensity, [0, 1], [0.4, 0.8]);

  // Typewriter for URL
  const typewriterStartFrame = startFrame + 20;
  const charsPerSecond = 30;
  const framesPerChar = fps / charsPerSecond;
  const localFrame = Math.max(0, frame - typewriterStartFrame);
  const charsToShow = Math.min(
    typewriterText.length,
    Math.floor(localFrame / framesPerChar)
  );
  const displayUrl = typewriterText.slice(0, charsToShow);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Main button */}
      <div
        style={{
          position: "relative",
          padding: "20px 48px",
          background: `linear-gradient(135deg, ${glowColor}, ${colors.brand})`,
          borderRadius: 16,
          boxShadow: `0 0 ${glowSize}px ${glowOpacity * 0.5}rem ${glowColor}80`,
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 20,
            border: `2px solid ${glowColor}`,
            opacity: glowOpacity * 0.5,
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            color: colors.dark,
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "'Google Sans Flex', 'Inter', system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {text}
        </span>
      </div>

      {/* Typewriter URL below button */}
      {showTypewriter && (
        <div
          style={{
            height: 24,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: colors.textSecondary,
              fontSize: 16,
              fontFamily: "monospace",
              letterSpacing: "0.02em",
            }}
          >
            {displayUrl}
            <span
              style={{
                opacity: charsToShow < typewriterText.length ? 1 : 0,
                marginLeft: 2,
              }}
            >
              |
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
