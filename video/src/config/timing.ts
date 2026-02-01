// Video timing configuration for 30-second AI Employee video
// 30fps, 900 total frames

export const VIDEO_CONFIG = {
  fps: 30,
  durationInSeconds: 30,
  durationInFrames: 30 * 30, // 900 frames
  width: 1920,
  height: 1080,
} as const;

// Scene timing (in seconds, converted to frames)
export const SCENES = {
  openingHook: {
    start: 0,
    duration: 4,
    get startFrame() { return this.start * VIDEO_CONFIG.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG.fps; },
  },
  macMiniShowcase: {
    start: 4,
    duration: 8,
    get startFrame() { return this.start * VIDEO_CONFIG.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG.fps; },
  },
  liveDemo: {
    start: 12,
    duration: 8,
    get startFrame() { return this.start * VIDEO_CONFIG.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG.fps; },
  },
  valueProps: {
    start: 20,
    duration: 6,
    get startFrame() { return this.start * VIDEO_CONFIG.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG.fps; },
  },
  callToAction: {
    start: 26,
    duration: 4,
    get startFrame() { return this.start * VIDEO_CONFIG.fps; },
    get durationFrames() { return this.duration * VIDEO_CONFIG.fps; },
  },
} as const;

// Audio cue points (in frames)
export const AUDIO_CUES = {
  musicStart: 0,
  titleRevealWhoosh: 15,
  productEntranceReveal: SCENES.macMiniShowcase.startFrame,
  labelDing: SCENES.macMiniShowcase.startFrame + 90,
  typingStart: SCENES.liveDemo.startFrame + 30,
  sendClick: SCENES.liveDemo.startFrame + 180,
  statWhoosh1: SCENES.valueProps.startFrame + 15,
  statWhoosh2: SCENES.valueProps.startFrame + 60,
  statWhoosh3: SCENES.valueProps.startFrame + 105,
  ctaDing: SCENES.callToAction.startFrame + 30,
  musicFadeStart: VIDEO_CONFIG.durationInFrames - 60,
} as const;

// Transition durations (in frames)
export const TRANSITIONS = {
  fade: 15,
  wipe: 20,
  slide: 15,
} as const;
