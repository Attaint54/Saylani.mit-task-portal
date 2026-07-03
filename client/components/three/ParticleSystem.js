'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ count = 600 }) {
  const mesh = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const green = new THREE.Color('#66b032');
    const blue = new THREE.Color('#0057a8');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const color = green.clone().lerp(blue, Math.random());
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;

      siz[i] = Math.random() * 3 + 1;
    }

    return [pos, cols, siz];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positionsArr = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionsArr[i3 + 1] += Math.sin(time + positionsArr[i3] * 0.5) * 0.002;
      positionsArr[i3] += Math.cos(time + positionsArr[i3 + 1] * 0.5) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;

    mesh.current.rotation.x += (mouse.current.y * 0.02 - mesh.current.rotation.x) * 0.01;
    mesh.current.rotation.y += (mouse.current.x * 0.02 - mesh.current.rotation.y) * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
