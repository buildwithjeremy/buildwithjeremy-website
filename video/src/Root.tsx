import React from "react";
import { Composition } from "remotion";
import { AIEmployeeVideo } from "./AIEmployee/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIEmployeeVideo"
        component={AIEmployeeVideo}
        durationInFrames={60 * 30} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AIEmployeeVideoShort"
        component={AIEmployeeVideo}
        durationInFrames={30 * 30} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
