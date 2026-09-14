import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Film,
  Sparkles,
  Calendar,
  Briefcase,
} from 'lucide-react';
import type { CreatorProfile } from '../../types';

interface CreatorStorytellingSectionProps {
  onExploreDemo: () => void;
  onGetStarted: () => void;
}

export const CreatorStorytellingSection: React.FC<CreatorStorytellingSectionProps> = ({
  onExploreDemo,
  onGetStarted,
}) => {
  return (
    <section className="py-16 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3.5">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-[var(--kicker-color)] uppercase">
            <span>Creator stories</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
            See the craft, the gear, and the next project opportunity in one breath.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Every creator on Afflatus maintains an active production identity with verified equipment, finished reels, and explicit roles they are looking to hire for upcoming shoots.
          </p>
        </div>

        {/* Narrative Flow: Creator Dossier -> Reel -> Active Call for Crew */}
        <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Creator Identity & Verified Technical Kit (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] flex flex-col justify-between space-y-6 bg-[var(--card-inner-bg)]/40">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[var(--card-border)] bg-neutral-900 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                      alt="Portrait of Elena Rostova"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--card-bg)]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                        Elena Rostova
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                        Verified Pro
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[var(--accent-amber)] font-medium">
                      Production Sound Recordist &amp; Sound Designer
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--accent-amber)]" />
                      <span>Berlin &amp; Prague • Union (CAS Affiliate)</span>
                    </p>
                  </div>
                </div>

                {/* Bio statement */}
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--accent-amber)] pl-3">
                  "Specializing in European indie cinema and remote location audio. I capture clean dialogue in high-wind and sub-zero environments."
                </p>

                {/* Rate Card & Verified Hardware Package */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    Technical Package &amp; Rate Structure
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Standard Day Rate:</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">$950 / day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Primary Audio Kit:</span>
                      <span className="font-mono text-[11px] text-[var(--text-primary)]">Sound Devices 833 (8-Track)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Microphones:</span>
                      <span className="font-mono text-[11px] text-[var(--text-primary)]">Schoeps Colette + Sanken CS-3e</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Wireless Links:</span>
                      <span className="font-mono text-[11px] text-[var(--text-primary)]">4x Lectrosonics Digital Hybrid</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeking Collaborator Callout */}
              <div className="p-4 rounded-xl bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/25 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-amber)] font-bold block">
                  Elena is Currently Seeking:
                </span>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Cinematographer (FX9 / Alexa) &amp; Colorist (DaVinci)
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  For upcoming 6-part nature documentary shooting in northern Norway.
                </p>
              </div>
            </div>

            {/* Right Column: Featured Work & Active Project Brief (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>FEATURED PRODUCTION REEL</span>
                  <span>PREVIEW QUALITY 4K</span>
                </div>

                {/* Cinematic Work Frame */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--card-border)] bg-neutral-950 group cursor-pointer shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80"
                    alt="Sound engineering workspace and film still"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[var(--accent-amber)] text-black font-bold">
                      Sound Design &amp; Location Audio
                    </span>
                    <h4 className="font-editorial text-lg sm:text-xl font-bold">
                      Arctic Tides // Documentary Soundscape
                    </h4>
                    <p className="text-xs text-neutral-300 line-clamp-1">
                      Live acoustic recordings blended with modular analog synthesis. Premiered at Berlinale 2025.
                    </p>
                  </div>
                </div>

                {/* Linked Project Brief Opportunity */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[var(--accent-amber)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        Open Project Call: "The Boreal Run"
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/25">
                      Accepting Crew Proposals
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Shooting 4 days in Tromsø, Norway. Seeking a lead cinematographer with cold-weather battery packages and a dedicated colorist for 35mm print look.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-[var(--text-muted)] border-t border-[var(--card-inner-border)]">
                    <span>BUDGET: $14,500 USD</span>
                    <span>SHOOT WINDOW: OCTOBER 2026</span>
                    <span>CREW SLOTS: 2 REMAINING</span>
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[var(--text-muted)]">
                  Direct connection request sent straight to Elena's production passport.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onExploreDemo}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--accent-amber)] hover:bg-[var(--accent-amber-hover)] text-[var(--nav-item-active-text,#181614)] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Inspect Full Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
