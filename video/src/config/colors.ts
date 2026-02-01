// Brand colors from Build with Jeremy website
export const colors = {
  // Primary brand colors
  brand: "#5565f1",      // Brand purple - links, navigation, AI Audit service
  primary: "#122fed",    // Primary blue - authority, headings, Strategic Ops Partner
  accent: "#4dfe43",     // Accent green - CTAs, highlights, success, stats

  // Neutrals
  dark: "#0f172a",       // Dark background
  darkAlt: "#1e293b",    // Slightly lighter dark
  white: "#ffffff",

  // Gradients
  gradientStart: "#0f172a",
  gradientEnd: "#122fed",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.5)",
} as const;

export type ColorKey = keyof typeof colors;
