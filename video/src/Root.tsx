import React from "react";
import { Composition } from "remotion";
import { AIEmployeeVideo } from "./AIEmployee/Composition";
import { AIEmployeeVideoV2 } from "./AIEmployee/CompositionV2";
import { AIEmployeeVideoShort } from "./AIEmployee/CompositionShort";
import { AIEmployeeGeneralComposition } from "./AIEmployeeGeneral/Composition";
import { VIDEO_CONFIG } from "./config/timing";
import { VIDEO_CONFIG_SHORT } from "./config/timing-short";
import { TIMING as TIMING_GENERAL } from "./config/timing-general";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* AI Employee General: 18-second hero video for landing page */}
      <Composition
        id="AIEmployeeGeneral"
        component={AIEmployeeGeneralComposition}
        durationInFrames={TIMING_GENERAL.totalDuration}
        fps={TIMING_GENERAL.fps}
        width={1920}
        height={1080}
      />

      {/* SHORT: 18-second streamlined version (RECOMMENDED) */}
      <Composition
        id="AIEmployeeVideoShort"
        component={AIEmployeeVideoShort}
        durationInFrames={VIDEO_CONFIG_SHORT.durationInFrames}
        fps={VIDEO_CONFIG_SHORT.fps}
        width={VIDEO_CONFIG_SHORT.width}
        height={VIDEO_CONFIG_SHORT.height}
      />

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

      {/* Vertical format for social (short version) */}
      <Composition
        id="AIEmployeeVideoShortVertical"
        component={AIEmployeeVideoShort}
        durationInFrames={VIDEO_CONFIG_SHORT.durationInFrames}
        fps={VIDEO_CONFIG_SHORT.fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
