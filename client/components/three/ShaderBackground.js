'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float dist = distance(uv, uMouse);

  vec3 color1 = vec3(0.4, 0.69, 0.20);
  vec3 color2 = vec3(0.0, 0.34, 0.66);
  vec3 color3 = vec3(0.2, 0.5, 0.3);

  float wave = sin(uv.x * 4.0 + uTime * 0.5) * 0.1 + cos(uv.y * 4.0 + uTime * 0.3) * 0.1;
  float mixFactor = uv.x + uv.y * 0.5 + wave;

  vec3 gradient = mix(color1, color2, mixFactor);
  gradient = mix(gradient, color3, sin(uTime * 0.1) * 0.5 + 0.5);

  float glow = exp(-dist * 3.0) * 0.3;
  gradient += glow * vec3(0.6, 0.9, 0.4);

  gl_FragColor = vec4(gradient, 0.8);
}
`;

export default function ShaderBackground() {
  const mesh = useRef();
  const mouse = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.current.x, mouse.current.y),
        0.05
      );
    }
  });

  return (
    <mesh ref={mesh} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
