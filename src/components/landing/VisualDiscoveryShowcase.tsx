import React from 'react';
import { ArrowUpRight, Compass, Film, Volume2, Sparkles, Eye, Tag } from 'lucide-react';
import type { CreatorProfile } from '../../types';

interface VisualDiscoveryShowcaseProps {
  onExploreDemo: () => void;
}

export const VisualDiscoveryShowcase: React.FC<VisualDiscoveryShowcaseProps> = ({
  onExploreDemo,
}) => {
  return (
    <section id="discovery-exhibition" className="py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-[var(--card-border)] gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-[var(--kicker-color)] uppercase">
              <span>01 VISUAL DISCOVERY EXHIBITION</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Work that speaks before a single word is exchanged.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-normal leading-relaxed">
              Explore actual finished reels, documentary stills, and soundscapes from vetted creators.
              Every piece links directly to the gear used and the collaborator who crafted it.
            </p>
          </div>

          <button
            onClick={onExploreDemo}
            className="self-start md:self-auto px-5 py-2.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] text-xs font-semibold text-[var(--text-primary)] transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
          >
            <span>Browse All Works</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Asymmetric Editorial Composition (NOT repetitive 3 identical cards!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* 1. DOMINANT FEATURED WORK (Spans 7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              onClick={onExploreDemo}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg hover:shadow-xl transition-all cursor-pointer flex-1 flex flex-col justify-between"
            >
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80"
                  alt="Cinematic frame from Dune-inspired desert shoot"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Top Craft Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                    Cinematography 
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-mono bg-[var(--accent-amber)] text-black font-bold">
                    Featured
                  </span>
                </div>

                {/* Play preview icon pill */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Film className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  <span className="font-mono text-[11px]">View Case Reel</span>
                </div>
              </div>

              {/* Work Narrative & Metadata */}
              <div className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>RECORDED ON ARRI ALEXA MINI LF</span>
                  <span>MARCH 2026</span>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                  Sands of the Mojave 
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  A high-latitude natural light test shot in extreme contrast conditions. Captured using Cooke Anamorphic /i full-frame primes with custom hand-tuned optical filtration.
                </p>

                {/* Creator signature byline */}
                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent-amber)] text-black font-bold flex items-center justify-center text-xs">
                      MV
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Marcus Vance</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Director of Photography (Local 600)</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    Day Rate: $1,250/day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECONDARY COMPANION FRAMES (Spans 5 cols on desktop, 2 stacked items) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Companion Item A: Spatial Audio & Foley */}
            <div
              onClick={onExploreDemo}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80"
                    alt="Synthesizer audio rack and patch bay"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-white/90" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-amber)] font-bold">
                    Sound Design 
                  </span>
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors truncate">
                    Sub-Bass Resonance in Concrete Chambers
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    Custom Foley captured with Schoeps Colette stereo pairs in decommissioned subways.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono pt-1">
                    By Elena Rostova • Sound Devices 833
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Available for Remote Mixing</span>
                <span className="text-[var(--accent-amber)] font-medium flex items-center gap-1">
                  <span>Listen Reel</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Companion Item B: 35mm Analog Color Grading & Print */}
            <div
              onClick={onExploreDemo}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80"
                    alt="Colorist grading room with dual reference monitors"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white/90" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-amber)] font-bold">
                    Color Science 
                  </span>
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors truncate">
                    Kodak 5219 Emulsion Curve in ACES
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    Custom look transforms matching vintage 35mm stock with modern digital sensors.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono pt-1">
                    By Kenji Sato • DaVinci Resolve Studio
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Commercial &amp; Indie Tier</span>
                <span className="text-[var(--accent-amber)] font-medium flex items-center gap-1">
                  <span>View Lookbook</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
