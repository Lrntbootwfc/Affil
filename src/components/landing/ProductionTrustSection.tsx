import React from 'react';
import {
  Users,
  ShieldCheck,
  Video,
  Camera,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

interface ProductionTrustSectionProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const ProductionTrustSection: React.FC<ProductionTrustSectionProps> = ({
  onGetStarted,
  onExploreDemo,
}) => {
  return (
    <section className="py-16 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3.5">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-[var(--kicker-color)] uppercase">
            <span>Trust &amp; integrity</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
            Built for professional sets, not social media vanity.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Forget follower counts, algorithmic feeds, and 20% agency cuts. Afflatus organizes creative collaboration strictly around verified skills, physical gear packages, and transparent rate agreements.
          </p>
        </div>

        {/* Asymmetric Composition (Editorial Hero Feature + Detailed Row Stack) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Feature: Direct Exchange & Zero Middleman Fees (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-amber)] font-bold">
                  Guaranteed Independence
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  100% Creator Direct. Zero Commission Fees.
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Traditional talent agencies take 15% to 25% out of an artist's day rate. On Afflatus, you connect, negotiate, and execute day rate agreements with your collaborator directly.
                </p>
              </div>

              {/* Metric Callout Card */}
              <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Agency Take Rate:</span>
                  <span className="font-mono line-through text-red-500 font-bold">20% Cut</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--card-inner-border)]">
                  <span className="font-semibold text-[var(--text-primary)]">Afflatus Platform Cut:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    $0.00 (100% to Creator)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] text-xs font-bold text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Build Your Production Passport</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            </button>
          </div>

          {/* Right Stack: 3 Distinct Architectural Rows (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
            
            {/* Row 1: Dual Role Profiles */}
            <div className="rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-amber)] shrink-0 flex items-center justify-center mt-1">
                <Users className="w-5 h-5" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Dual Role Architecture
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--accent-amber)] uppercase font-bold">
                    Bidirectional
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Every account has two sides: define what you produce (e.g. Director of Photography) and simultaneously declare who you are seeking to crew up with (e.g. Sound Mixer, Colorist, 1st AC).
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Matches based on complementary mutual intent</span>
                </div>
              </div>
            </div>

            {/* Row 2: Verified Hardware Kits */}
            <div className="rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-amber)] shrink-0 flex items-center justify-center mt-1">
                <Camera className="w-5 h-5" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Verified Gear Packages
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--accent-amber)] uppercase font-bold">
                    Zero Guesswork
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Document owned vs. rented cameras, lenses, lighting, and audio units. Producers know exactly what physical kit arrives on the truck before signing day rate agreements.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ARRI, RED, Sony Cinema Line &amp; Sound Devices verification</span>
                </div>
              </div>
            </div>

            {/* Row 3: Direct Call-Sheet Workspaces */}
            <div className="rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-amber)] shrink-0 flex items-center justify-center mt-1">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Structured Briefs &amp; Call-Sheets
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--accent-amber)] uppercase font-bold">
                    Ready to Shoot
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Avoid fragmented messaging apps. Turn accepted proposals into production workspaces featuring shot lists, crew emergency contacts, and daily call schedules.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>One-click export to PDF call-sheets and shooting schedules</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
