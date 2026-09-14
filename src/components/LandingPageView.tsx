import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Film,
  Sliders,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type { CreatorProfile } from '../types';

interface LandingPageViewProps {
  onGetStarted: () => void;
  onExploreMatches: () => void;
  onOpenSignIn: () => void;
  currentUser?: CreatorProfile | null;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGetStarted,
  onExploreMatches,
}) => {
  return (
    <div className="text-[var(--text-primary)] selection:bg-[var(--accent-amber)] selection:text-white pb-20">
      {/* Top Hero Section (Meridian Editorial Luxury) */}
      <div className="relative overflow-hidden pt-10 sm:pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="editorial-kicker">
            <span>AI-POWERED CREATIVE PRODUCTION</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.12]">
            Crew matching &amp; production exchanges built for serious filmmakers
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
            Match based on verified gear packages, rate structures, and creative synergy—not follower counts. Turn accepted matches directly into shoot plans and call sheets.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-btn-get-started"
              onClick={onGetStarted}
              className="amber-pill-btn w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>+ Post Project Brief</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-explore-matches"
              onClick={onExploreMatches}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-primary)] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[var(--card-inner-border)]"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
              <span>Explore Live Match Feed</span>
            </button>
          </div>

          {/* Minimal Stats Row */}
          <div className="mt-12 pt-8 border-t border-[var(--card-border)] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm">
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">50+</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Active Pilot Creators</p>
            </div>
            <div className="p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm">
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--accent-amber)]">98%</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Synergy Fit Rate</p>
            </div>
            <div className="p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm">
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">$0</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Zero Agency Markup</p>
            </div>
            <div className="p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm">
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-[#2D6A4F] dark:text-[#4ade80]">100%</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Verified Gear Packages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Showcase Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="card-obsidian rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-[var(--card-border)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-[var(--card-inner-border)] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] uppercase tracking-wider">
                  Live Match Simulation
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Project: Neon Horizon (Sci-Fi Short)
                </span>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                Aman Sharma • Cinematographer
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-amber)] font-mono font-bold text-sm">
                96% Synergy Fit
              </div>
              <button
                id="btn-preview-connect"
                onClick={onExploreMatches}
                className="amber-pill-btn px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                View in Match Feed
              </button>
            </div>
          </div>

          {/* Bidirectional Fit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Why They Fit You */}
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                  Why Aman Fits Your Project
                </h4>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    <strong>Camera Package Match:</strong> Owns Sony FX6 4K Cinema package with GM prime zoom lenses, eliminating equipment rental costs.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    <strong>Budget Rate Alignment:</strong> ₹35,000/day fits cleanly within your production budget tier.
                  </p>
                </div>
              </div>
            </div>

            {/* Why You Fit Them */}
            <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                  Why Your Project Fits Aman
                </h4>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    <strong>Creative Aesthetic Fit:</strong> Mood matches his portfolio focus on high-contrast narrative cinema.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    <strong>Local Travel Radius:</strong> Location in Los Angeles, CA is well within his 120-mile working area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="editorial-kicker mb-1">
            <span>THE PRODUCTION STANDARD</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
            Built for Serious Creative Production
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Social followings don't make great films. We match based on verified technical gear, rates, and artistic synergy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-warm-white rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-center text-[var(--accent-amber)] mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Bidirectional Synergy
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Matches are evaluated in both directions. We analyze aesthetic tone, verified gear packages, and mutual rate expectations so both director and crew win.
              </p>
            </div>
          </div>

          <div className="card-warm-white rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-center text-[var(--accent-amber)] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Producer-Verified Telemetry
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Every pilot profile contains verified camera packages, insurance/COI readiness, and clear day rate structures. No surprise costs or mismatched gear on set.
              </p>
            </div>
          </div>

          <div className="card-warm-white rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-center text-[var(--accent-amber)] mb-4">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Shoot Blueprints &amp; Call Sheets
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                Instantly turn accepted matches into scene-by-scene shot lists, line-item budgets, and Hollywood-standard call sheets ready for set.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
