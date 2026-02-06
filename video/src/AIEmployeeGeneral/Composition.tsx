import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { TIMING } from "../config/timing-general";
import {
  OpeningHook,
  ProductReveal,
  AIDemo,
  ValueProps,
  CallToAction,
} from "./scenes";

export const AIEmployeeGeneralComposition: React.FC = () => {
  const { scenes, transitions } = TIMING;

  // Calculate scene durations accounting for transition overlaps
  // Each transition overlaps with adjacent scenes, so we add overlap time to scene durations
  const fadeTiming = linearTiming({ durationInFrames: transitions.fade });
  const slideTiming = linearTiming({ durationInFrames: transitions.slide });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TransitionSeries>
        {/* Scene 1: Opening Hook (0-4s) */}
        <TransitionSeries.Sequence durationInFrames={scenes.openingHook.duration}>
          <OpeningHook />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* Scene 2: Product Reveal (4-9s) */}
        <TransitionSeries.Sequence durationInFrames={scenes.productReveal.duration}>
          <ProductReveal />
        </TransitionSeries.Sequence>

        {/* Transition: Slide from bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={slideTiming}
        />

        {/* Scene 3: AI Demo (9-13s) */}
        <TransitionSeries.Sequence durationInFrames={scenes.aiDemo.duration}>
          <AIDemo />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* Scene 4: Value Props (13-16s) */}
        <TransitionSeries.Sequence durationInFrames={scenes.valueProps.duration}>
          <ValueProps />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={fadeTiming}
        />

        {/* Scene 5: Call to Action (16-18s) */}
        <TransitionSeries.Sequence durationInFrames={scenes.callToAction.duration}>
          <CallToAction />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
