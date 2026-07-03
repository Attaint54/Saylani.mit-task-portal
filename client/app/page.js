import dynamic from 'next/dynamic';

const LandingContent = dynamic(() => import('@/components/landing/LandingContent'));

export default function LandingPage() {
  return <LandingContent />;
}
