import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Camera,
  Film,
  Sliders,
  ChevronDown,
  Play,
  Volume2,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CreatorProfile } from '../../types';
import luxuryHeroBg from '../../assets/images/luxury_studio_hero_1789051338575.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  currentUser?: CreatorProfile | null;
}

const CINEMATIC_MOMENTS = [
  {
    id: 'moment-1',
    title: 'The North Atlantic Drift',
    creator: 'Marcus Vance',
    role: 'Director of Photography',
    kit: 'ARRI Alexa Mini LF // Cooke Anamorphic /i',
    badge: 'Anamorphic 2.39:1',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&auto=format&fit=crop&q=80',
    fps: '24.000 fps',
    focal: '50mm T1.4',
    shutter: '180.0°',
  },
  {
    id: 'moment-2',
    title: 'Echoes in the Pine Forest',
    creator: 'Elena Rostova',
    role: 'Production Sound Recordist',
    kit: 'Sound Devices 833 // Schoeps CMC641 Colette',
    badge: 'Spatial Foley 96kHz/24bit',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    fps: 'Live Record',
    focal: 'Stereo Pair',
    shutter: 'Analog Saturation',
  },
  {
    id: 'moment-3',
    title: 'Nocturne in Kyoto',
    creator: 'Kenji Sato',
    role: 'Lead Colorist & Gaffer',
    kit: 'DaVinci Advanced Panel // Kodak Vision3 5207 LUT',
    badge: '35mm Film Grain Print',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    fps: 'Master Grade',
    focal: 'ACEScc Rec.709',
    shutter: 'Dual ISO 3200',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onExploreDemo,
  currentUser,
}) => {
  // 'atelier' gives the pure luxury architectural aesthetic matching the user's reference;
  // 'viewfinder' provides the interactive ARRI camera HUD.
  const [heroMode, setHeroMode] = useState<'atelier' | 'viewfinder'>('atelier');
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  // Subtle automatic cycle for camera viewfinder reels if in viewfinder mode
  useEffect(() => {
    if (heroMode !== 'viewfinder') return;
    const timer = setInterval(() => {
      setActiveMomentIndex((prev) => (prev + 1) % CINEMATIC_MOMENTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroMode]);

  const currentMoment = CINEMATIC_MOMENTS[activeMomentIndex];

  const handleScrollToExhibition = () => {
    const el = document.getElementById('discovery-exhibition');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#0A0706] text-white">
      {/* 1. Immersive Architectural Background with Luxury Lighting Vignette */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          {heroMode === 'atelier' ? (
            <motion.div
              key="atelier-bg"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={luxuryHeroBg}
                alt="Luxury Film Atelier & Production Suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-105"
              />
              {/* High-end photographic vignette & warm cove lighting gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090605] via-[#090605]/45 to-[#090605]/60" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#090605]/30 to-[#090605]/85" />
            </motion.div>
          ) : (
            <motion.div
              key={currentMoment.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentMoment.imageUrl}
                alt={currentMoment.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090605] via-black/55 to-black/70" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top subtle golden ceiling luminescence (mimics cove lighting in reference photo) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-gradient-to-b from-[#E5C38C]/18 via-[#C99E5C]/08 to-transparent blur-[90px] pointer-events-none" />
      </div>

      {/* Top Atmosphere Bar: Quick Mode Toggle */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C38C] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#E5C38C] uppercase font-medium">
            Afflatus
          </span>
        </div>

        {/* Aesthetic Mode Switch: Luxury Atelier vs Director Viewfinder */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setHeroMode('atelier')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              heroMode === 'atelier'
                ? 'bg-[#E5C38C] text-[#120B05] font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            01
          </button>
          <button
            type="button"
            onClick={() => setHeroMode('viewfinder')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              heroMode === 'viewfinder'
                ? 'bg-[#E5C38C] text-[#120B05] font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span> 04 </span>
          </button>
        </div>
      </div>

      {/* 2. Main Hero Centerpiece (Inspired directly by the reference image) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center items-center text-center">

        {/* Majestic Display Headline (Homage to "Luxury Meets Beauty") */}
        <div className="max-w-4xl mx-auto space-y-2 mb-5 sm:mb-6">
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[1.05]">
            Dont Mind 
            <span className="block mt-1 font-serif italic font-normal bg-gradient-to-r from-[#FFF5E6] via-[#E8C793] to-[#C99E5C] bg-clip-text text-transparent drop-shadow-sm">
              Words
            </span>
          </h1>
        </div>

        {/* Elegant Dot-Separated Subtitle (Homage to "Premium Hair • Skin • Spa • Makeup") */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm md:text-base font-normal tracking-wide text-[#E8DDD1]/90 leading-relaxed font-sans">
            Directors <span className="text-[#E5C38C] mx-1.5">•</span>
            Cinematographers <span className="text-[#E5C38C] mx-1.5">•</span>
            Sound Designers <span className="text-[#E5C38C] mx-1.5">•</span>
            Production Designers <span className="text-[#E5C38C] mx-1.5">•</span>
            Colorists
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-400 font-normal mt-2 max-w-lg mx-auto leading-normal">
            A private creative salon where verified technical packages, day rate transparency, and cinematic synergy converge.
          </p>
        </div>

        {/* Dual Luxury Pill Action Buttons (Homage to "Book Appointment →" & "View Services") */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md sm:max-w-none">
          {/* Primary Champagne Gold Button */}
          <button
            id="hero-book-talent-btn"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F7E7CE] via-[#E8C793] to-[#D5A866] hover:from-[#FFF0D9] hover:to-[#E0B472] text-[#160E06] font-semibold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-950/40 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
          >
            <span>{currentUser ? 'Open Production Passport' : 'Book Talent & Crew'}</span>
            <ArrowRight className="w-4 h-4 text-[#160E06] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Frosted Glass Button */}
          <button
            id="hero-explore-directory-btn"
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black/45 hover:bg-black/70 border border-white/25 hover:border-[#E8C793]/60 text-white font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
          >
            <Compass className="w-4 h-4 text-[#E5C38C]" />
            <span>Explore Directory</span>
          </button>
        </div>
      </div>

      {/* 3. Hero Bottom Anchor: Downward Animated Chevron & Production Status Bar */}
      <div className="relative z-10 w-full pb-6 sm:pb-8 flex flex-col items-center justify-center gap-4">
        
        {/* Animated Chevron (Exact match to reference site bottom indicator) */}
        <button
          type="button"
          onClick={handleScrollToExhibition}
          aria-label="Scroll down to visual discovery"
          className="group p-2 text-white/70 hover:text-[#E5C38C] transition-all cursor-pointer flex flex-col items-center gap-1 animate-bounce"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Explore
          </span>
          <ChevronDown className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Minimalist Micro-Ticker */}
        <div className="px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] font-mono text-neutral-300 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#E5C38C]">
            <Award className="w-3 h-3" />
            <span>Verified Crew Roster</span>
          </span>
        </div>
      </div>

      {/* 4. Bottom Right Corner: When Camera HUD is active, show sleek 1 2 3 indicators showing image changing */}
      {heroMode === 'viewfinder' && (
        <div
          id="hero-camera-hud-switcher"
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 border border-[#E5C38C]/40 backdrop-blur-md shadow-2xl animate-in fade-in duration-300"
        >
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-[#E5C38C] uppercase font-bold tracking-wider">
              Reel
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {CINEMATIC_MOMENTS.map((m, idx) => (
              <button
                key={m.id}
                id={`camera-hud-moment-${idx + 1}`}
                onClick={() => setActiveMomentIndex(idx)}
                title={`Switch to Reel 0${idx + 1}: ${m.title}`}
                aria-label={`Switch to Reel 0${idx + 1}`}
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeMomentIndex === idx
                    ? 'bg-[#E5C38C] text-[#140E08] font-black shadow-md scale-105'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/25 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
