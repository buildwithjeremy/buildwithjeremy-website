# AI Employee Launch Video - Production Brief

## Project Goal

Create a **30-second Apple/Google-style product launch video** for the AI Employee offering. This is a done-for-you AI agent setup on a Mac Mini that gets shipped to the customer's door.

**Target vibe:** Apple product reveal meets startup energy. Clean, cinematic, premium.

---

## Product Being Promoted

**AI Employee by Build with Jeremy**
- Pre-configured Mac Mini M4 with OpenClaw (open-source AI assistant, 126K+ GitHub stars)
- Set up with customer's tools, workflows, and brand voice
- Runs locally (100% private, data never leaves their network)
- Works 24/7 autonomously
- Starting at $2,997 (one-time investment, no monthly salary)

**Target industries:** Marketing agencies, SEO agencies, social media teams, recruiting firms

**Key differentiator:** Physical hardware shipped to your door, not another SaaS subscription

---

## Video Specifications

- **Duration:** 30 seconds (900 frames)
- **Resolution:** 1920x1080 @ 30fps
- **Format:** MP4 (primary), vertical 1080x1920 (secondary for social)
- **Audio:** Upbeat/energetic tech music, text-only (no voiceover)
- **Primary platform:** Website embed, YouTube

---

## Current State

### What exists (V2):
- 5 scenes with basic transitions (fade, wipe, slide)
- Typewriter text effect hook
- Spring animations on elements
- Brand colors from website
- Scene timing configuration

### What's wrong:
1. **Feels like a slideshow** - static elements that fade in/out
2. **Fake Mac Mini** - CSS box instead of real product imagery
3. **Fake OpenClaw UI** - made-up chat interface, not their actual product
4. **No camera motion** - no zoom, pan, parallax, or depth
5. **Basic animations** - just springs and fades, no kinetic energy
6. **No audio** - placeholder only, not synced

---

## Design Direction

### Inspiration References

**Apple product videos:**
- Dramatic lighting on product
- Slow camera orbits around hardware
- Text that moves WITH the camera
- Sound design synced to visual beats

**Google/startup demos:**
- Screen recordings with cursor movement
- Typing in real interfaces
- Quick cuts between features
- UI elements that highlight on hover/click

### Motion Design Principles

1. **Parallax layers** - Background, midground, foreground moving at different speeds
2. **Camera movement** - Ken Burns (zoom + pan) on static images
3. **Kinetic typography** - Text that slides, scales, rotates with purpose
4. **Particle effects** - Floating dots, light rays, subtle glow
5. **Music sync** - Cuts and transitions land on beats

---

## Scene Breakdown (Revised)

### Scene 1: Hook (0-4s)
**Current:** Text fades in with glow
**Should be:**
- Dark screen, particles floating
- "Your AI Employee" slams in from below with impact
- Camera slowly pushes in
- Subtitle types out with cursor

### Scene 2: Product Hero (4-12s)
**Current:** CSS rectangle with floating labels
**Should be:**
- Real Mac Mini photo(s) from Apple
- Slow orbit/rotation effect (fake 3D with image sequence or parallax)
- Dramatic spotlight lighting
- Features animate in from sides with motion blur
- "Powered by OpenClaw" badge pulses

### Scene 3: Live Demo (12-20s)
**Current:** Fake chat mockup with typing
**Should be:**
- Actual OpenClaw UI screenshot or screen recording
- Cursor moves and clicks realistically
- Typing happens in real interface
- Zoom into specific features
- Integration icons fly in from edges

### Scene 4: Value Props (20-26s)
**Current:** Stats that scale in
**Should be:**
- Numbers count up rapidly (slot machine style)
- Each stat has its own "moment" with sound
- Background gradient shifts
- Subtle camera push

### Scene 5: CTA (26-30s)
**Current:** Text fades in, button pulses
**Should be:**
- URL types out character by character
- Button has glow/pulse synced to music
- Particles converge toward CTA
- Strong final beat

---

## Assets Needed

### Images (add to `/video/public/images/`)

| Asset | Source | Notes |
|-------|--------|-------|
| `mac-mini-front.png` | Apple.com or user-provided | Transparent background preferred |
| `mac-mini-hand.png` | User provided (from conversation) | Hand holding Mac Mini |
| `mac-mini-desk.png` | User provided (from conversation) | Desk setup with Mac Mini |
| `openclaw-ui.png` | Screenshot from openclaw.ai or docs | Main chat interface |
| `openclaw-logo.png` | OpenClaw GitHub `/assets` folder | Logo for attribution |

### Audio (add to `/video/public/audio/`)

| Asset | Source | Notes |
|-------|--------|-------|
| `soundtrack.mp3` | Pixabay, Uppbeat, or AI-generated (Suno) | 30s upbeat tech music |
| `whoosh.mp3` | Freesound.org | Transition swoosh |
| `impact.mp3` | Freesound.org | Text slam sound |
| `ding.mp3` | Freesound.org | Achievement/notification |
| `typing.mp3` | Freesound.org | Keyboard clicks |

---

## Technical Setup

### Project structure
```
video/
├── src/
│   ├── Root.tsx                 # Composition registry
│   ├── config/
│   │   ├── colors.ts            # Brand colors
│   │   └── timing.ts            # Scene timing + audio cues
│   ├── AIEmployee/
│   │   ├── CompositionV2.tsx    # Main 30s video
│   │   ├── scenes/              # Individual scenes
│   │   ├── components/          # Reusable elements
│   │   └── AudioTracks.tsx      # Audio layer
│   └── hooks/
│       └── useTypewriter.ts     # Typing effect
├── public/
│   ├── images/                  # Product photos, screenshots
│   └── audio/                   # Music and SFX
└── package.json
```

### Key packages installed
- `remotion` - Core video engine
- `@remotion/transitions` - Scene transitions (fade, wipe, slide)
- `@remotion/three` - 3D rendering (React Three Fiber)
- `@remotion/media-utils` - Audio utilities
- `@remotion/paths` - SVG animation
- `@react-three/fiber` + `@react-three/drei` - 3D helpers
- `three` - 3D engine

### Commands
```bash
npm run dev          # Open Remotion Studio at localhost:3000
npm run render       # Export to out/ai-employee-v2.mp4
npm run render:v1    # Export original 60s version
```

---

## OpenClaw Resources

- **Website:** https://openclaw.ai
- **GitHub:** https://github.com/openclaw/openclaw
- **Docs:** https://docs.openclaw.ai
- **UI folder:** https://github.com/openclaw/openclaw/tree/main/ui
- **Assets folder:** https://github.com/openclaw/openclaw/tree/main/assets
- **Integrations page:** https://openclaw.ai/integrations (100+ tools)
- **Shoutouts/social proof:** https://openclaw.ai/shoutouts

### OpenClaw facts for video:
- 126K+ GitHub stars
- Featured in TechCrunch, IBM Think, DigitalOcean
- Works with WhatsApp, Telegram, Slack, Discord, iMessage, etc.
- Supports Gmail, Calendar, Drive, HubSpot, Asana, Linear, etc.
- Mascot: 🦞 (lobster)

---

## Brand Colors

```typescript
const colors = {
  brand: "#5565f1",    // Purple - links, accents
  primary: "#122fed",  // Blue - authority, trust
  accent: "#4dfe43",   // Green - CTAs, highlights, success
  dark: "#0f172a",     // Background
  white: "#ffffff",
};
```

---

## Key Messages to Convey

1. **Physical product** - "Shipped to your door" (not another SaaS)
2. **Privacy** - "100% local, your data never leaves"
3. **Always on** - "Works 24/7 while you sleep"
4. **No salary** - "$0/month, one-time investment"
5. **Done for you** - "Pre-configured with your tools"
6. **Real technology** - "Powered by OpenClaw (126K+ stars)"

---

## Next Steps

1. **Gather real assets:**
   - Download Mac Mini images from Apple or use user-provided photos
   - Screenshot OpenClaw UI from their demo/docs
   - Find 30s upbeat tech track

2. **Rebuild Scene 2 (Mac Mini):**
   - Use real product image
   - Add Ken Burns zoom/pan effect
   - Create parallax with multiple layers
   - Add dramatic lighting overlay

3. **Rebuild Scene 3 (Demo):**
   - Use actual OpenClaw screenshot
   - Animate cursor movement
   - Zoom into interface
   - Show real integrations

4. **Add audio:**
   - Import soundtrack
   - Sync transitions to beats
   - Add impact sounds on key moments

5. **Polish:**
   - Add particle effects
   - Refine all timings
   - Test full playthrough
   - Export and review

---

## Remotion Tips

### Ken Burns effect on images
```typescript
const scale = interpolate(frame, [0, durationInFrames], [1, 1.2]);
const x = interpolate(frame, [0, durationInFrames], [0, -50]);
<Img src={staticFile("images/product.png")} style={{ transform: `scale(${scale}) translateX(${x}px)` }} />
```

### Parallax layers
```typescript
const bgY = interpolate(frame, [0, 100], [0, -20]);
const fgY = interpolate(frame, [0, 100], [0, -50]);
// Background moves slower than foreground
```

### Audio sync
```typescript
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
// Get audio waveform data to sync animations to beats
```

### Easing presets
```typescript
import { Easing } from "remotion";
// Easing.out(Easing.cubic) - smooth deceleration
// Easing.inOut(Easing.quad) - smooth both ways
// Easing.elastic(1) - bouncy overshoot
```

---

## Session Context

This video is part of the AI Employee product launch for buildwithjeremy.com. The offering piggybacks on the current hype around:
- Claude Code / AI coding assistants
- Mac Minis as AI agent hosts
- OpenClaw (formerly Clawdbot/Moltbot) going viral

The video should feel like it belongs in that conversation - cutting edge, technical, but accessible.

**Website:** https://buildwithjeremy.com/ai-employee
**Branch:** `claude/ai-employee-video-XV8mk`
