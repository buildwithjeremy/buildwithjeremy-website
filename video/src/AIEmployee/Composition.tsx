import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";

// Brand colors from the website
const colors = {
  brand: "#5565f1",
  primary: "#122fed",
  accent: "#4dfe43",
  dark: "#0f172a",
  white: "#ffffff",
};

// Scene 1: The Hype Hook (0-5 seconds)
const HypeHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const glowIntensity = interpolate(
    frame,
    [0, 30, 60, 90, 120, 150],
    [0, 1, 0.5, 1, 0.5, 1]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: colors.accent,
            marginBottom: 20,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Everyone's talking about it
        </div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: colors.white,
            lineHeight: 1.1,
            textShadow: `0 0 ${40 * glowIntensity}px ${colors.accent}`,
          }}
        >
          AI Agents.
        </div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: colors.accent,
            lineHeight: 1.1,
          }}
        >
          Mac Minis.
        </div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: colors.brand,
            lineHeight: 1.1,
          }}
        >
          Claude Code.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Problem (5-12 seconds)
const TheProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problems = [
    "Installing dependencies...",
    "Configuring APIs...",
    "Setting up workflows...",
    "Debugging integrations...",
    "Reading documentation...",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: colors.white,
            marginBottom: 60,
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          But setting one up?
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          {problems.map((problem, i) => {
            const delay = 30 + i * 25;
            const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });
            const x = interpolate(frame, [delay, delay + 15], [-50, 0], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  fontSize: 36,
                  color: "#ef4444",
                  fontFamily: "monospace",
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                ❌ {problem}
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ef4444",
            marginTop: 60,
            opacity: interpolate(frame, [180, 200], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          It's a nightmare.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: The Solution Reveal (12-20 seconds)
const TheSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glowPulse = interpolate(
    frame,
    [60, 90, 120, 150, 180, 210],
    [0.5, 1, 0.5, 1, 0.5, 1]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 42,
            color: colors.accent,
            marginBottom: 30,
            fontWeight: 600,
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          What if someone did it all for you?
        </div>

        <div
          style={{
            transform: `scale(${Math.max(0, scale)})`,
            opacity: interpolate(frame, [30, 60], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: colors.white,
              lineHeight: 1.2,
              textShadow: `0 0 ${60 * glowPulse}px ${colors.accent}`,
            }}
          >
            Your AI Employee.
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: colors.accent,
              lineHeight: 1.2,
            }}
          >
            Shipped to Your Door.
          </div>
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 32,
            color: colors.white,
            opacity: interpolate(frame, [120, 150], [0, 0.8], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          Powered by OpenClaw • 126K+ GitHub Stars
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Features Showcase (20-35 seconds)
const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const features = [
    { icon: "🖥️", title: "Mac Mini M4", subtitle: "Included. You own it." },
    {
      icon: "🔒",
      title: "100% Local",
      subtitle: "Your data never leaves your network",
    },
    { icon: "⚡", title: "24/7 Always On", subtitle: "Works while you sleep" },
    { icon: "🎯", title: "Your Brand Voice", subtitle: "Trained on your SOPs" },
    {
      icon: "🔧",
      title: "Done-For-You",
      subtitle: "Configured with your tools",
    },
    { icon: "📦", title: "Shipped Ready", subtitle: "Plug in and go" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        padding: 60,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: colors.white,
          textAlign: "center",
          marginBottom: 50,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        What You Get
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 40,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {features.map((feature, i) => {
          const delay = 30 + i * 40;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                backgroundColor: `${colors.brand}15`,
                borderRadius: 24,
                padding: 40,
                textAlign: "center",
                border: `2px solid ${colors.brand}40`,
                transform: `scale(${Math.max(0, progress)})`,
                opacity: Math.max(0, progress),
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 20 }}>{feature.icon}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.white,
                  marginBottom: 10,
                }}
              >
                {feature.title}
              </div>
              <div style={{ fontSize: 22, color: colors.accent }}>
                {feature.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Stats & Social Proof (35-45 seconds)
const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "$0", label: "Monthly Salary", suffix: "" },
    { value: "20+", label: "Hours Saved", suffix: "/week" },
    { value: "24/7", label: "Always Working", suffix: "" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 100,
          alignItems: "center",
        }}
      >
        {stats.map((stat, i) => {
          const delay = i * 30;
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12 },
          });

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                transform: `scale(${Math.max(0, scale)})`,
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 900,
                  color: colors.accent,
                }}
              >
                {stat.value}
                <span style={{ fontSize: 48 }}>{stat.suffix}</span>
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: colors.white,
                  marginTop: 10,
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 28,
          color: colors.white,
          opacity: interpolate(frame, [120, 150], [0, 0.9], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        One-time investment. Works forever.
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Industries (45-52 seconds)
const Industries: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const industries = [
    "Marketing Agencies",
    "SEO Agencies",
    "Social Media Teams",
    "Recruiting Firms",
    "Any Service Business",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: colors.white,
          marginBottom: 50,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        Pre-configured for
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center", maxWidth: 1200 }}>
        {industries.map((industry, i) => {
          const delay = 30 + i * 25;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                backgroundColor: colors.brand,
                color: colors.white,
                padding: "20px 40px",
                borderRadius: 50,
                fontSize: 32,
                fontWeight: 600,
                transform: `scale(${Math.max(0, progress)})`,
                opacity: Math.max(0, progress),
              }}
            >
              {industry}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: CTA (52-60 seconds)
const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulseScale = interpolate(
    frame % 60,
    [0, 30, 60],
    [1, 1.05, 1]
  );

  const mainScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${mainScale})`,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: colors.white,
            marginBottom: 30,
          }}
        >
          Get Your AI Employee
        </div>

        <div
          style={{
            fontSize: 42,
            color: colors.accent,
            marginBottom: 50,
          }}
        >
          Starting at $2,997
        </div>

        <div
          style={{
            display: "inline-block",
            backgroundColor: colors.accent,
            color: colors.dark,
            padding: "25px 60px",
            borderRadius: 16,
            fontSize: 36,
            fontWeight: 700,
            transform: `scale(${pulseScale})`,
          }}
        >
          buildwithjeremy.com/ai-employee
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: colors.white,
            opacity: 0.8,
          }}
        >
          Configured. Tested. Shipped to your door.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const AIEmployeeVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark }}>
      {/* Scene 1: Hype Hook (0-5 seconds = 0-150 frames) */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <HypeHook />
      </Sequence>

      {/* Scene 2: The Problem (5-12 seconds = 150-360 frames) */}
      <Sequence from={5 * fps} durationInFrames={7 * fps}>
        <TheProblem />
      </Sequence>

      {/* Scene 3: The Solution (12-20 seconds = 360-600 frames) */}
      <Sequence from={12 * fps} durationInFrames={8 * fps}>
        <TheSolution />
      </Sequence>

      {/* Scene 4: Features (20-35 seconds = 600-1050 frames) */}
      <Sequence from={20 * fps} durationInFrames={15 * fps}>
        <Features />
      </Sequence>

      {/* Scene 5: Stats (35-45 seconds = 1050-1350 frames) */}
      <Sequence from={35 * fps} durationInFrames={10 * fps}>
        <Stats />
      </Sequence>

      {/* Scene 6: Industries (45-52 seconds = 1350-1560 frames) */}
      <Sequence from={45 * fps} durationInFrames={7 * fps}>
        <Industries />
      </Sequence>

      {/* Scene 7: CTA (52-60 seconds = 1560-1800 frames) */}
      <Sequence from={52 * fps} durationInFrames={8 * fps}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
