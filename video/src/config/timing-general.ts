// Timing configuration for AI Employee General landing page video
// 18 seconds total at 30fps = 540 frames

export const TIMING = {
  fps: 30,
  totalDuration: 540, // 18 seconds

  scenes: {
    openingHook: { start: 0, duration: 120 },      // 0-4s
    productReveal: { start: 120, duration: 150 },  // 4-9s
    aiDemo: { start: 270, duration: 120 },         // 9-13s
    valueProps: { start: 390, duration: 90 },      // 13-16s
    callToAction: { start: 480, duration: 60 },    // 16-18s
  },

  transitions: {
    fade: 15,  // frames
    slide: 12, // frames
  },

  // Spring configurations
  springs: {
    smooth: { damping: 200 },                           // Subtle reveals
    snappy: { damping: 20, stiffness: 200 },            // UI elements
    bouncy: { damping: 8 },                             // Playful pop
    heavy: { damping: 15, stiffness: 80, mass: 1.5 },   // Mac Mini entrance
    headline: { damping: 15, stiffness: 100 },          // Headline entrances
  },

  // Typewriter speeds (chars per second)
  typewriter: {
    slow: 20,
    normal: 25,
    fast: 40,
    veryFast: 50,
  },
} as const;

export type TimingConfig = typeof TIMING;
