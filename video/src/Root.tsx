import React from "react";
import { Composition } from "remotion";
import { AIEmployeeVideo } from "./AIEmployee/Composition";
import { AIEmployeeVideoV2 } from "./AIEmployee/CompositionV2";
import { VIDEO_CONFIG } from "./config/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* V2: Enhanced 30-second Apple-style video */}
      <Composition
        id="AIEmployeeVideoV2"
        component={AIEmployeeVideoV2}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* V1: Original 60-second slideshow (kept for reference) */}
      <Composition
        id="AIEmployeeVideo"
        component={AIEmployeeVideo}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Vertical format for social */}
      <Composition
        id="AIEmployeeVideoVertical"
        component={AIEmployeeVideoV2}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
