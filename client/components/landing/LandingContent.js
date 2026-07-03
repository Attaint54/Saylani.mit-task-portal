'use client';

import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/landing/AboutSection'), { ssr: false });
const StatisticsSection = dynamic(() => import('@/components/landing/StatisticsSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: false });

export default function LandingContent() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <StatisticsSection />
      <Footer />
    </main>
  );
}
