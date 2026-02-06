# Remotion Video Production Guide

## Overview

Remotion is a React-based video creation framework that renders videos programmatically using web technologies. This project uses Remotion 4.x to create promotional videos.

---

## Installed Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `remotion` | 4.0.414 | Core video engine |
| `@remotion/cli` | 4.0.414 | Studio and rendering commands |
| `@remotion/bundler` | 4.0.414 | Webpack bundling |
| `@remotion/transitions` | 4.0.414 | Fade, wipe, slide transitions |
| `@remotion/three` | 4.0.414 | Three.js integration |
| `@remotion/media-utils` | 4.0.414 | Audio/video utilities |
| `@remotion/paths` | 4.0.414 | SVG path animations |
| `@react-three/fiber` | 9.5.0 | React wrapper for Three.js |
| `@react-three/drei` | 10.7.7 | Three.js helpers |
| `three` | 0.182.0 | 3D graphics engine |

---

## Core Animation Functions

### spring() - Physics-based animations
```typescript
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const value = spring({
  frame,
  fps,
  config: {
    damping: 15,      // 0-300 (higher = less bounce)
    stiffness: 80,    // 0-500 (higher = faster)
    mass: 1.5         // 0.1-10 (affects overshoot)
  }
});
```

**Spring presets:**
- Bouncy entrance: `{ damping: 8, stiffness: 100, mass: 1 }`
- Gentle entrance: `{ damping: 20, stiffness: 80, mass: 2 }`
- Snappy: `{ damping: 15, stiffness: 200, mass: 0.5 }`

### interpolate() - Linear and eased animations
```typescript
import { interpolate, Easing } from "remotion";

// Simple linear
const opacity = interpolate(frame, [0, 30], [0, 1]);

// With easing
const scale = interpolate(
  frame,
  [0, 30],
  [0.5, 1],
  {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  }
);
```

### Easing Functions
```typescript
// Standard curves
Easing.linear
Easing.quad       // x^2
Easing.cubic      // x^3
Easing.sin        // Sine wave
Easing.exp        // Exponential

// Modifiers
Easing.in(fn)     // Ease at start
Easing.out(fn)    // Ease at end
Easing.inOut(fn)  // Smooth both

// Common combinations
Easing.out(Easing.cubic)    // Smooth deceleration (Apple-style)
Easing.inOut(Easing.quad)   // Smooth both ways
Easing.elastic(1)           // Bouncy overshoot
```

---

## Transitions (@remotion/transitions)

### Using TransitionSeries
```typescript
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene1 />
  </TransitionSeries.Sequence>

  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />

  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### Available Transitions
- `fade()` - Opacity crossfade
- `wipe({ direction })` - Directional wipe (from-left, from-right, from-top, from-bottom)
- `slide({ direction })` - Slide in/out
- `flip()` - Card flip
- `blur()` - Gaussian blur
- `zoom()` - Scale in/out
- `clockWise()` - Clock wipe

---

## 3D Rendering with @remotion/three

### Basic Setup
```typescript
import { ThreeCanvas } from "@remotion/three";
import { RoundedBox } from "@react-three/drei";

<ThreeCanvas
  width={1920}
  height={1080}
  camera={{ position: [0, 2, 8], fov: 35 }}
>
  <ambientLight intensity={0.3} />
  <spotLight position={[0, 10, 5]} intensity={2} />

  <RoundedBox args={[4, 0.35, 4]} radius={0.15}>
    <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
  </RoundedBox>
</ThreeCanvas>
```

### Apple-Style 3D Lighting
```typescript
// Key light: Main illumination from above-front
<spotLight position={[0, 10, 5]} intensity={2} angle={0.4} penumbra={0.5} />

// Accent light: Brand color from side
<pointLight position={[-5, 2, 3]} intensity={0.5} color="#4dfe43" />

// Rim light: Separation from background
<pointLight position={[3, 3, -5]} intensity={0.8} color="#ffffff" />

// Fill light: Subtle ambient
<ambientLight intensity={0.3} />
```

**Note:** Procedural 3D often looks inferior to high-quality product photography. Consider using 2D images with Ken Burns effect instead of 3D for product showcases.

---

## Common Animation Patterns

### Ken Burns Effect (Zoom + Pan)
```typescript
const CameraWrapper: React.FC<Props> = ({ children, zoomStart, zoomEnd, panX, panY }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd]);
  const x = interpolate(frame, [0, durationInFrames], panX);
  const y = interpolate(frame, [0, durationInFrames], panY);

  return (
    <div style={{ transform: `scale(${zoom}) translate(${x}px, ${y}px)` }}>
      {children}
    </div>
  );
};
```

### Typewriter Effect
```typescript
const useTypewriter = (text: string, options: { startFrame: number; charsPerSecond: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerChar = fps / options.charsPerSecond;
  const elapsed = Math.max(0, frame - options.startFrame);
  const charCount = Math.min(text.length, Math.floor(elapsed / framesPerChar));

  return {
    displayText: text.slice(0, charCount),
    isTyping: charCount < text.length && elapsed > 0,
    isComplete: charCount >= text.length,
  };
};
```

### Impact Text Entrance
```typescript
const ImpactText: React.FC<Props> = ({ text, direction, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.5 }
  });

  const translateY = interpolate(progress, [0, 1], [150, 0]);
  const scale = interpolate(progress, [0, 1], [1.3, 1]);

  return (
    <div style={{ transform: `translateY(${translateY}px) scale(${scale})` }}>
      {text}
    </div>
  );
};
```

### Glow Pulse Effect
```typescript
const GlowPulse: React.FC<Props> = ({ children, color, cycleDuration = 45 }) => {
  const frame = useCurrentFrame();

  const cyclePosition = (frame % cycleDuration) / cycleDuration;
  const pulseWave = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5;
  const glowRadius = 20 + pulseWave * 40;

  return (
    <div style={{ boxShadow: `0 0 ${glowRadius}px ${color}` }}>
      {children}
    </div>
  );
};
```

### Counting Number Animation
```typescript
const CountingNumber: React.FC<Props> = ({ value, startFrame, durationFrames }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" }
  );

  const displayValue = Math.round(value * progress);

  return <span>{displayValue}</span>;
};
```

---

## Asset Handling

### Images
```typescript
import { Img, staticFile } from "remotion";

<Img
  src={staticFile("images/product.webp")}
  style={{ width: "100%", height: "100%" }}
/>
```

**Best practices:**
- Use `.webp` format (smaller, same quality)
- Place assets in `/public/` directory
- Use `staticFile()` for correct paths
- Include descriptive `alt` text

### Audio
```typescript
import { Audio, staticFile } from "remotion";

<Audio src={staticFile("audio/soundtrack.mp3")} />
```

### Fonts
```typescript
// In global CSS or component
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex&display=swap');

// Or with @remotion/fonts
import { useFont } from "@remotion/fonts";
const font = useFont("https://fonts.googleapis.com/css2?family=Google+Sans+Flex");
```

---

## Performance Tips

### Memoize Expensive Calculations
```typescript
const particles = useMemo(() => {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 2 + Math.random() * 4,
  }));
}, [count, width, height]);
```

### Use Deterministic Randomness
```typescript
// Seeded random for consistent renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const particles = useMemo(() =>
  Array.from({ length: 30 }, (_, i) => ({
    x: seededRandom(i * 1) * width,
    y: seededRandom(i * 2) * height,
  }))
, []);
```

### Avoid Re-renders
```typescript
export const MyComponent = React.memo(MyComponentInner);
```

---

## Commands

```bash
# Development
npm run dev                    # Start Remotion Studio

# Rendering
npm run render                 # Render to MP4
npm run render:preview         # Render first 90 frames only

# Advanced rendering
npx remotion render CompositionID out/video.mp4 --concurrency=4
npx remotion render CompositionID out/video.mp4 --codec=h265 --crf=18
```

**Codec options:**
- `vp8` - WebM (smaller, web-friendly)
- `h264` - MP4 (universal)
- `h265` - HEVC (modern, smaller)

---

## Video Configuration

```typescript
// In Root.tsx
registerRoot(() => <Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={600}  // 20 seconds at 30fps
  fps={30}
  width={1920}
  height={1080}
/>);
```

### Common Resolutions
- **1920x1080** - YouTube, website embed
- **1080x1920** - Instagram Stories, TikTok, Reels
- **1200x628** - Facebook ads
- **3840x2160** - 4K YouTube

---

## Apple-Style Animation Principles

1. **Physics-based movement** - Use springs, not linear easing
2. **Minimal visual clutter** - Clean backgrounds, focused content
3. **Generous whitespace** - Don't crowd elements
4. **Precise timing** - Coordinate animation starts
5. **Subtle effects** - Don't overdo glows and particles

### Checklist
- [ ] Spring animations (not linear)
- [ ] Subtle, not flashy effects
- [ ] Perfect timing synchronization
- [ ] Clean typography with generous spacing
- [ ] Minimal color palette (3-4 colors)
- [ ] Appropriate use of glow/shadow
- [ ] Music/audio sync
- [ ] Clear CTA at end

---

## Project Structure

```
video/
├── src/
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Composition registry
│   ├── config/
│   │   ├── colors.ts         # Brand colors
│   │   └── timing.ts         # Scene timing
│   ├── AIEmployee/
│   │   ├── CompositionV2.tsx # Main composition
│   │   ├── scenes/           # Scene components
│   │   └── components/       # Reusable UI elements
│   └── hooks/
│       └── useTypewriter.ts  # Custom hooks
├── public/
│   ├── images/               # Product photos
│   └── audio/                # Music and SFX
├── remotion.config.ts        # Build config
└── package.json
```

---

## Resources

- [Remotion Documentation](https://remotion.dev/docs)
- [Remotion GitHub](https://github.com/remotion-dev/remotion)
- [Three.js Drei Helpers](https://github.com/pmndrs/drei)
- [Easing Functions Visualized](https://easings.net)
