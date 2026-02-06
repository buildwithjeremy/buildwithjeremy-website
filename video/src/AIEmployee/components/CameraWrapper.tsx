import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

interface CameraWrapperProps {
  children: React.ReactNode;
  zoomStart?: number;
  zoomEnd?: number;
  panX?: [number, number]; // [start, end] in pixels
  panY?: [number, number]; // [start, end] in pixels
  startFrame?: number;
  endFrame?: number; // If not provided, uses scene duration
  easing?: (t: number) => number;
}

export const CameraWrapper: React.FC<CameraWrapperProps> = ({
  children,
  zoomStart = 1,
  zoomEnd = 1.05,
  panX = [0, 0],
  panY = [0, 0],
  startFrame = 0,
  endFrame,
  easing = Easing.inOut(Easing.quad),
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const effectiveEndFrame = endFrame ?? durationInFrames;

  // Calculate zoom
  const zoom = interpolate(
    frame,
    [startFrame, effectiveEndFrame],
    [zoomStart, zoomEnd],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  // Calculate pan
  const translateX = interpolate(
    frame,
    [startFrame, effectiveEndFrame],
    panX,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  const translateY = interpolate(
    frame,
    [startFrame, effectiveEndFrame],
    panY,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
