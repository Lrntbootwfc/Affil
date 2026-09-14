import React from 'react';
import type { CreatorProfile } from '../types';
import { HeroSection } from './landing/HeroSection';
import { VisualDiscoveryShowcase } from './landing/VisualDiscoveryShowcase';
import { MultiStateCollaboratory } from './landing/MultiStateCollaboratory';
import { CreatorStorytellingSection } from './landing/CreatorStorytellingSection';
import { ProductionTrustSection } from './landing/ProductionTrustSection';
import { CalmExhaleEnding } from './landing/CalmExhaleEnding';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  currentUser?: CreatorProfile | null;
  onUpdateProfile?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
  currentUser,
  onUpdateProfile,
}) => {
  return (
    <div className="text-[var(--text-primary)] selection:bg-[var(--accent-amber)] selection:text-white">
      {/* 1. Hero Section with Cinematic Motion Moment */}
      <HeroSection
        onGetStarted={onGetStarted}
        onExploreDemo={onExploreDemo}
        currentUser={currentUser}
      />

      {/* 2. Visual Discovery Exhibition (DreamMotion + Matchioo Flow) */}
      <VisualDiscoveryShowcase
        onExploreDemo={onExploreDemo}
      />

      {/* 3. Multi-State Production Collaboratory (Pulma Multi-State Principle) */}
      <MultiStateCollaboratory
        onExploreDemo={onExploreDemo}
        onGetStarted={onGetStarted}
      />

      {/* 4. Creator & Work Storytelling Section */}
      <CreatorStorytellingSection
        onExploreDemo={onExploreDemo}
        onGetStarted={onGetStarted}
      />

      {/* 5. Production Integrity & Direct Exchange Rules */}
      <ProductionTrustSection
        onGetStarted={onGetStarted}
        onExploreDemo={onExploreDemo}
      />

      {/* 6. The Calm Visual Exhale Ending (Pulma Sukoon Principle) */}
      <CalmExhaleEnding
        currentUser={currentUser}
        onGetStarted={onGetStarted}
        onExploreDemo={onExploreDemo}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
};

