import React from "react";
import { Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { AUDIO_CUES, VIDEO_CONFIG } from "../config/timing";

/**
 * Audio tracks for the AI Employee video.
 *
 * SETUP INSTRUCTIONS:
 * 1. Generate or source audio files and place them in /video/public/audio/
 * 2. Required files:
 *    - soundtrack.mp3 - Upbeat tech/startup music (30 seconds)
 *    - whoosh.mp3 - Transition whoosh sound effect
 *    - reveal.mp3 - Product reveal impact sound
 *    - click.mp3 - Keyboard/UI click sound
 *    - ding.mp3 - Achievement/notification ding
 *
 * GENERATING AUDIO WITH AI:
 * If you have remotion-media-mcp set up:
 * - /generate-music "Upbeat startup launch music, energetic tech, 30 seconds"
 * - /generate-sfx "Digital whoosh transition"
 * - /generate-sfx "Product reveal impact"
 *
 * Or use free sources:
 * - Pixabay.com (royalty-free music and SFX)
 * - Freesound.org (sound effects)
 * - Uppbeat.io (music for creators)
 */

interface AudioTracksProps {
  enabled?: boolean;
}

export const AudioTracks: React.FC<AudioTracksProps> = ({ enabled = false }) => {
  const frame = useCurrentFrame();

  // Fade out music at the end
  const musicVolume = interpolate(
    frame,
    [AUDIO_CUES.musicFadeStart, VIDEO_CONFIG.durationInFrames],
    [0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Only render audio when enabled and files exist
  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Background music */}
      <Audio
        src={staticFile("audio/soundtrack.mp3")}
        volume={musicVolume}
        startFrom={AUDIO_CUES.musicStart}
      />

      {/* Title reveal whoosh */}
      <Audio
        src={staticFile("audio/whoosh.mp3")}
        volume={0.4}
        startFrom={AUDIO_CUES.titleRevealWhoosh}
      />

      {/* Product entrance reveal */}
      <Audio
        src={staticFile("audio/reveal.mp3")}
        volume={0.5}
        startFrom={AUDIO_CUES.productEntranceReveal}
      />

      {/* Label appearance ding */}
      <Audio
        src={staticFile("audio/ding.mp3")}
        volume={0.3}
        startFrom={AUDIO_CUES.labelDing}
      />

      {/* Stat whooshes */}
      <Audio
        src={staticFile("audio/whoosh.mp3")}
        volume={0.35}
        startFrom={AUDIO_CUES.statWhoosh1}
      />
      <Audio
        src={staticFile("audio/whoosh.mp3")}
        volume={0.35}
        startFrom={AUDIO_CUES.statWhoosh2}
      />
      <Audio
        src={staticFile("audio/whoosh.mp3")}
        volume={0.35}
        startFrom={AUDIO_CUES.statWhoosh3}
      />

      {/* CTA ding */}
      <Audio
        src={staticFile("audio/ding.mp3")}
        volume={0.4}
        startFrom={AUDIO_CUES.ctaDing}
      />
    </>
  );
};

/**
 * Audio cue reference (in frames at 30fps):
 *
 * Frame 0: Music starts
 * Frame 15: Title reveal whoosh
 * Frame 120: Mac Mini entrance reveal
 * Frame 210: Feature label ding
 * Frame 615: First stat whoosh
 * Frame 660: Second stat whoosh
 * Frame 705: Third stat whoosh
 * Frame 810: CTA ding
 * Frame 840: Music fade starts
 * Frame 900: Video ends
 */
