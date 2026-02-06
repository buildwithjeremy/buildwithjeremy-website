// Video timing configuration for 18-second AI Employee video (SHORT VERSION)
// 30fps, 540 total frames

export const VIDEO_CONFIG_SHORT = {
  fps: 30,
  durationInSeconds: 18,
  durationInFrames: 18 * 30, // 540 frames
  width: 1920,
  height: 1080,
} as const;

// Scene timing for short version - 3 focused scenes
export const SCENES_SHORT = {
  // Scene 1: Hook + Product (0-7s) - Combined opening and Mac Mini
  hookAndProduct: {
    start: 0,
    duration: 7,
    get startFrame() { return this.start * VIDEO_CONFIG_SHORT.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG_SHORT.fps; },
  },
  // Scene 2: Value Props (7-12s) - Quick stats
  valueProps: {
    start: 7,
    duration: 5,
    get startFrame() { return this.start * VIDEO_CONFIG_SHORT.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG_SHORT.fps; },
  },
  // Scene 3: Call to Action (12-18s) - Final push
  callToAction: {
    start: 12,
    duration: 6,
    get startFrame() { return this.start * VIDEO_CONFIG_SHORT.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG_SHORT.fps; },
  },
} as const;

// Transition durations (shorter for snappier feel)
export const TRANSITIONS_SHORT = {
  fade: 10,
  wipe: 15,
  slide: 12,
} as const;
