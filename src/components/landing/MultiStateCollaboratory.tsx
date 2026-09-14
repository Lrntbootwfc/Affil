import React, { useState } from 'react';
import {
  Film,
  Camera,
  Volume2,
  Sliders,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollaboratoryState {
  id: string;
  step: string;
  title: string;
  discipline: string;
  headline: string;
  narrative: string;
  creatorName: string;
  creatorRole: string;
  location: string;
  dayRate: string;
  verifiedKit: string[];
  imageUrl: string;
  aspectBadge: string;
  keyDeliverable: string;
}

const COLLABORATION_STAGES: CollaboratoryState[] = [
  {
    id: 'stage-directing',
    step: '01',
    discipline: 'Directing & Creative Brief',
    title: 'Visual Intent & Moodboard Briefing',
    headline: 'Translate abstract vision into concrete production specs',
    narrative:
      'Producers and directors define tone, target genre, and exact crew vacancies—not generic job posts. C1 parses intent into shooting dates, budget tiers, and required camera packages.',
    creatorName: 'Sofia Lindqvist',
    creatorRole: 'Narrative Director // Stockholm & London',
    location: 'Available Worldwide • Union & Fi-Core',
    dayRate: '$1,400 / day',
    verifiedKit: ['Directing Viewfinder', 'Directors Monitor Kit', 'Script Supervisor iPad Package'],
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80',
    aspectBadge: 'Pre-Production Docket',
    keyDeliverable: 'Structured 12-scene shoot brief with crew call dependencies',
  },
  {
    id: 'stage-cinematography',
    step: '02',
    discipline: 'Cinematography & Camera Kit',
    title: 'Sensor Calibration & Verified Lenses',
    headline: 'Match DoPs by verified sensor packages, not followers',
    narrative:
      'Filter cinematographers by the exact gear arriving on call day. Review verified ownership status of ARRI Alexa Mini LF, Sony FX9, Cooke anamorphics, and wireless video transmitters.',
    creatorName: 'Marcus Vance',
    creatorRole: 'Director of Photography // Local 600',
    location: 'Los Angeles, CA • Will Travel',
    dayRate: '$1,250 / day',
    verifiedKit: ['ARRI Alexa Mini LF (Owned)', 'Cooke Anamorphic /i Primes', 'Teradek Bolt 4K Monitor'],
    imageUrl: 'https://images.unsplash.com/photo-1585675100414-add2e465a136?w=1200&auto=format&fit=crop&q=80',
    aspectBadge: 'Verified Gear Kit',
    keyDeliverable: 'Full insured camera package with backup body on call',
  },
  {
    id: 'stage-sound',
    step: '03',
    discipline: 'Sound & Foley Recording',
    title: 'Multi-Track Spatial Production Audio',
    headline: 'Clean dialogue recorded right at the source',
    narrative:
      'Connect with sound mixers equipped with dedicated timecode sync boxes, boom packages, and redundant dual-CF recording to ensure zero ADR nightmares in post.',
    creatorName: 'Elena Rostova',
    creatorRole: 'Production Sound Mixer // CAS Affiliate',
    location: 'Berlin & Prague • Remote & On-Set',
    dayRate: '$950 / day',
    verifiedKit: ['Sound Devices 833 (8-Track)', 'Schoeps CMC641 Boom', '4x Lectrosonics Digital Lavs'],
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
    aspectBadge: 'Acoustic Master',
    keyDeliverable: 'Timecode-jammed polyphonic WAVs with sound reports',
  },
  {
    id: 'stage-color',
    step: '04',
    discipline: 'Color Grading & Film Print',
    title: 'Look Creation & ACES Color Pipeline',
    headline: 'Analog grain science and consistent studio lookbooks',
    narrative:
      'Engage dedicated colorists who work directly within ACES color managed workflows. Test look LUTs before principal photography begins to preview final lighting on set.',
    creatorName: 'Kenji Sato',
    creatorRole: 'Senior Colorist // CSI Member',
    location: 'Tokyo & Remote (Color Grading Suite)',
    dayRate: '$1,100 / day',
    verifiedKit: ['DaVinci Advanced Control Surface', 'Flanders Scientific XMP310 HDR', 'Calibrated DCI-P3'],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    aspectBadge: 'ACES Grade',
    keyDeliverable: 'Custom print film emulation show-LUT for monitors',
  },
  {
    id: 'stage-callsheet',
    step: '05',
    discipline: 'Call-Sheet & Crew Assembly',
    title: 'Direct Contract & On-Set Production Dispatch',
    headline: 'From accepted match directly to shooting day 1',
    narrative:
      'No agency commission fees. Once both creators confirm alignment, Afflatus auto-generates unified call-sheets, emergency hospital contacts, parking notes, and shot sequences.',
    creatorName: 'Studio Production Unit',
    creatorRole: 'Crew Coordination Engine',
    location: 'Automated Real-Time Workspace',
    dayRate: '0% Middleman Fee',
    verifiedKit: ['Live Call-Sheet PDF Export', 'Digital Crew Check-In', 'Automated Weather Sync'],
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    aspectBadge: 'Call Sheet Ready',
    keyDeliverable: 'Single dashboard uniting shot lists, budgets, and call times',
  },
];

interface MultiStateCollaboratoryProps {
  onExploreDemo: () => void;
  onGetStarted: () => void;
}

export const MultiStateCollaboratory: React.FC<MultiStateCollaboratoryProps> = ({
  onExploreDemo,
  onGetStarted,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(COLLABORATION_STAGES[0].id);

  const activeStage =
    COLLABORATION_STAGES.find((s) => s.id === activeStageId) || COLLABORATION_STAGES[0];

  return (
    <section className="py-16 sm:py-28 relative overflow-hidden bg-[var(--card-inner-bg)]/50 border-y border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline (Pulma-inspired: One Large Section with Multiple Interconnected States) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[11px] font-mono tracking-wider text-[var(--kicker-color)] uppercase">
            <span>Production collaboratory</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
            One fluid ecosystem from concept brief to wrapped shoot.
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal max-w-2xl mx-auto leading-relaxed">
            Witness how real film departments assemble inside Afflatus. Select any stage to inspect the live creator profile, verified equipment package, and production deliverable.
          </p>
        </div>

        {/* The Cohesive Master Canvas (Single Stable Visual Experience, NOT 5 separate cards!) */}
        <div className="rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl overflow-hidden">
          
          {/* Top Horizontal Stage Switcher Bar */}
          <div className="flex border-b border-[var(--card-border)] overflow-x-auto no-scrollbar bg-[var(--card-inner-bg)]">
            {COLLABORATION_STAGES.map((stage) => {
              const isActive = stage.id === activeStage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`px-4 sm:px-6 py-3.5 sm:py-4 text-xs font-mono whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'border-[var(--accent-amber)] text-[var(--text-primary)] font-bold bg-[var(--card-bg)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)]'
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-[var(--accent-amber)] font-bold' : 'opacity-60'}`}>
                    {stage.step}
                  </span>
                  <span>{stage.discipline}</span>
                </button>
              );
            })}
          </div>

          {/* Main Visual & Content Split Area (Smooth Transitions with AnimatePresence) */}
          <div className="p-6 sm:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                
                {/* Left Column: Visual Asset & Verification Badge (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-md bg-neutral-900 group">
                    <img
                      src={activeStage.imageUrl}
                      alt={activeStage.title}
                      className="w-full h-full object-cover select-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Stage Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                        {activeStage.aspectBadge}
                      </span>
                    </div>

                    {/* Bottom In-Frame Overlay: Creator Identity */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-mono text-[var(--accent-amber)] font-bold">
                          {activeStage.creatorRole}
                        </p>
                        <h4 className="font-editorial text-base sm:text-lg font-bold">
                          {activeStage.creatorName}
                        </h4>
                        <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[var(--accent-amber)]" />
                          <span>{activeStage.location}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono text-neutral-400 block uppercase">Standard Day Rate</span>
                        <span className="text-sm font-bold text-white font-mono">{activeStage.dayRate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Equipment Kit Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                      <span>Verified Kit:</span>
                    </span>
                    {activeStage.verifiedKit.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[11px] font-mono text-[var(--text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Narrative Story & Production Value (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-amber)] font-bold uppercase tracking-wider">
                      <span>Stage {activeStage.step} of 05</span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
                      {activeStage.title}
                    </h3>

                    <p className="text-sm font-medium text-[var(--text-primary)] pt-1">
                      "{activeStage.headline}"
                    </p>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                      {activeStage.narrative}
                    </p>
                  </div>

                  {/* Production Key Deliverable Box */}
                  <div className="p-4 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)]" />
                      <span>Key Production Output</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
                      {activeStage.keyDeliverable}
                    </p>
                  </div>

                  {/* Stage Action */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={onExploreDemo}
                      className="px-5 py-2.5 rounded-full bg-[var(--accent-amber)] hover:bg-[var(--accent-amber-hover)] text-[var(--nav-item-active-text,#181614)] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore this Craft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onGetStarted}
                      className="px-5 py-2.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] text-xs font-semibold text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      <span>Join as Specialist</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
