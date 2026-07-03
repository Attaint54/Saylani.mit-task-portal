'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function FloatingCube({ position, color, scale }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2 + position[0];
      ref.current.rotation.y = state.clock.elapsedTime * 0.3 + position[1];
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.3}
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color, scale }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.15;
      ref.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.25}
          distort={0.15}
          speed={1.5}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color, scale }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.003;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.2}
        distort={0.4}
        speed={3}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

export default function FloatingGeometry() {
  const geometries = useMemo(() => [
    { Component: FloatingCube, props: { position: [-4, 2, -2], color: '#66b032', scale: 0.8 } },
    { Component: FloatingTorus, props: { position: [4, -1, -3], color: '#0057a8', scale: 0.7 } },
    { Component: FloatingSphere, props: { position: [3, 3, -4], color: '#66b032', scale: 0.6 } },
    { Component: FloatingCube, props: { position: [-3, -2, -5], color: '#0057a8', scale: 0.5 } },
    { Component: FloatingTorus, props: { position: [0, -3, -6], color: '#66b032', scale: 0.6 } },
    { Component: FloatingSphere, props: { position: [-5, -1, -4], color: '#0057a8', scale: 0.4 } },
    { Component: FloatingCube, props: { position: [5, 2, -5], color: '#66b032', scale: 0.5 } },
  ], []);

  return geometries.map(({ Component, props }, i) => (
    <Component key={i} {...props} />
  ));
}
