import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";

import { colors } from "../config/colors";
import { SCENES, TRANSITIONS } from "../config/timing";
import { OpeningHook } from "./scenes/OpeningHook";
import { MacMiniShowcase } from "./scenes/MacMiniShowcase";
import { LiveDemo } from "./scenes/LiveDemo";
import { ValueProps } from "./scenes/ValueProps";
import { CallToAction } from "./scenes/CallToAction";

export const AIEmployeeVideoV2: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark }}>
      <TransitionSeries>
        {/* Scene 1: Opening Hook (0-4s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES.openingHook.durationFrames}>
          <OpeningHook />
        </TransitionSeries.Sequence>

        {/* Transition: Fade to Mac Mini */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITIONS.fade })}
        />

        {/* Scene 2: Mac Mini Showcase (4-12s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES.macMiniShowcase.durationFrames}>
          <MacMiniShowcase />
        </TransitionSeries.Sequence>

        {/* Transition: Wipe to Live Demo */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITIONS.wipe })}
        />

        {/* Scene 3: Live Demo (12-20s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES.liveDemo.durationFrames}>
          <LiveDemo />
        </TransitionSeries.Sequence>

        {/* Transition: Slide to Value Props */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITIONS.slide })}
        />

        {/* Scene 4: Value Props (20-26s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES.valueProps.durationFrames}>
          <ValueProps />
        </TransitionSeries.Sequence>

        {/* Transition: Fade to CTA */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITIONS.fade })}
        />

        {/* Scene 5: Call to Action (26-30s) */}
        <TransitionSeries.Sequence durationInFrames={SCENES.callToAction.durationFrames}>
          <CallToAction />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
