import React from 'react';
import { ArrowRight, Compass, Sparkles, UserCheck } from 'lucide-react';
import type { CreatorProfile } from '../../types';

interface CalmExhaleEndingProps {
  currentUser?: CreatorProfile | null;
  onGetStarted: () => void;
  onExploreDemo: () => void;
  onUpdateProfile?: () => void;
}

export const CalmExhaleEnding: React.FC<CalmExhaleEndingProps> = ({
  currentUser,
  onGetStarted,
  onExploreDemo,
  onUpdateProfile,
}) => {
  return (
    <section className="pt-14 sm:pt-24 pb-24 sm:pb-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The Sukoon Visual Exhale Canvas (Pulma-inspired calm ending) */}
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-[var(--card-border)] bg-neutral-950 shadow-2xl min-h-[460px] sm:min-h-[540px] flex flex-col justify-end p-8 sm:p-14 lg:p-16">
          
          {/* Panoramic Serene Landscape: Quiet Mountain & Twilight Mist (High-Quality, Calm, Poetic) */}
          <div className="absolute inset-0 select-none">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1800&auto=format&fit=crop&q=80"
              alt="Serene panoramic twilight mountain landscape evoking calm creative possibility"
              className="w-full h-full object-cover object-center opacity-75"
              loading="lazy"
            />
            {/* Soft, deep gradient wash for impeccable typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          </div>

          {/* Calm Content Overlay */}
          <div className="relative z-10 max-w-2xl space-y-6 text-left">
            
            {/* Quiet Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-widest text-neutral-200 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-amber)]" />
              <span>Afflatus // There is more to discover</span>
            </div>

            {/* Poetic & Dignified Closing Headline */}
            <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.2]">
              The next production begins with a single conversation.
            </h2>

            {/* Peaceful, inspiring narrative (sukoon) */}
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
              Across sound stages, cutting rooms, and remote locations worldwide, the most memorable stories are brought to life through people who found each other at the right moment.
            </p>

            {/* Restrained, Dignified Action Area */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {currentUser ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    id="btn-ending-passport"
                    onClick={onUpdateProfile || onGetStarted}
                    className="px-7 py-3 rounded-full bg-[var(--accent-amber)] hover:bg-[var(--accent-amber-hover)] text-black text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Open Your Production Passport</span>
                  </button>

                  <button
                    onClick={onExploreDemo}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[var(--accent-amber)]" />
                    <span>Explore Creator Feed</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                  <button
                    id="btn-ending-join"
                    onClick={onGetStarted}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--accent-amber)] hover:bg-[var(--accent-amber-hover)] text-black text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>[ Join the Creative Ecosystem ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="btn-ending-explore"
                    onClick={onExploreDemo}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[var(--accent-amber)]" />
                    <span>Quietly Browse Works</span>
                  </button>
                </div>
              )}
            </div>

            {/* Subtle signed-in or safety byline */}
            <div className="pt-2 text-[11px] font-mono text-neutral-400">
              {currentUser ? (
                <span>Signed in as @{currentUser.username || currentUser.name} • All profiles verified</span>
              ) : (
                <span>Free to join • Independent creators welcome • Direct exchanges</span>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
