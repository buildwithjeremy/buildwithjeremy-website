import React from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { colors } from "../../config/colors";

interface MacMini3DProps {
  rotationStart?: number; // Starting rotation in radians
  rotationEnd?: number; // Ending rotation in radians
  entranceStartFrame?: number;
  entranceDuration?: number;
}

// The actual 3D Mac Mini mesh
const MacMiniMesh: React.FC<{
  rotationY: number;
  entranceProgress: number;
}> = ({ rotationY, entranceProgress }) => {
  // Mac Mini dimensions (proportional)
  const width = 4;
  const height = 0.35;
  const depth = 4;
  const cornerRadius = 0.15;

  return (
    <group rotation={[0.1, rotationY, 0]} scale={entranceProgress}>
      {/* Main body - aluminum top */}
      <RoundedBox
        args={[width, height / 2, depth]}
        radius={cornerRadius}
        smoothness={4}
        position={[0, height / 4, 0]}
      >
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.15}
        />
      </RoundedBox>

      {/* Bottom half - dark */}
      <RoundedBox
        args={[width, height / 2, depth]}
        radius={cornerRadius}
        smoothness={4}
        position={[0, -height / 4, 0]}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Apple logo divot on top */}
      <mesh position={[0, height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial
          color="#a0a0a0"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Power LED */}
      <mesh position={[width / 2 - 0.3, -height / 4, depth / 2 - 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Ports on back (subtle details) */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
        <mesh key={i} position={[x, -height / 4, -depth / 2 + 0.05]}>
          <boxGeometry args={[0.25, 0.1, 0.02]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.9} />
        </mesh>
      ))}

      {/* Subtle reflection plane under the Mac Mini */}
      <mesh position={[0, -height / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 1.5, depth * 1.5]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

export const MacMini3D: React.FC<MacMini3DProps> = ({
  rotationStart = 0,
  rotationEnd = Math.PI * 0.4, // ~72 degrees
  entranceStartFrame = 0,
  entranceDuration = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // Rotation animation - slow orbit throughout scene
  const rotationY = interpolate(
    frame,
    [0, durationInFrames],
    [rotationStart, rotationEnd],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Entrance animation - scale up with spring
  const entranceProgress = spring({
    frame: frame - entranceStartFrame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 1.5 },
  });

  // Y position entrance (from below)
  const entranceY = interpolate(entranceProgress, [0, 1], [-2, 0]);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ position: "absolute" }}
      camera={{ position: [0, 2, 8], fov: 35 }}
    >
      {/* Ambient fill light */}
      <ambientLight intensity={0.3} />

      {/* Main key light from above-front (Apple-style) */}
      <spotLight
        position={[0, 10, 5]}
        intensity={2}
        angle={0.4}
        penumbra={0.5}
        castShadow
      />

      {/* Accent light in brand green from side */}
      <pointLight
        position={[-5, 2, 3]}
        intensity={0.5}
        color={colors.accent}
      />

      {/* Rim light from behind */}
      <pointLight
        position={[3, 3, -5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Mac Mini with entrance offset */}
      <group position={[0, entranceY, 0]}>
        <MacMiniMesh
          rotationY={rotationY}
          entranceProgress={Math.max(0, entranceProgress)}
        />
      </group>
    </ThreeCanvas>
  );
};
