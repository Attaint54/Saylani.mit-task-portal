'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import ParticleSystem from './ParticleSystem';
import FloatingGeometry from './FloatingGeometry';

export default function Scene3D({ children, controls = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          {children}
          {controls && <OrbitControls enableZoom={false} enablePan={false} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

export function LandingScene() {
  return (
    <Scene3D>
      <ParticleSystem count={800} />
      <FloatingGeometry />
    </Scene3D>
  );
}

export function AuthScene() {
  return (
    <Scene3D>
      <ParticleSystem count={400} />
    </Scene3D>
  );
}
