import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Users,
  ArrowRight,
  Camera,
  Check
} from 'lucide-react';
import type {
  CreatorProfile,
  ParsedProjectBrief,
  Project
} from '../types';

interface ProjectBriefBuilderViewProps {
  currentUser: CreatorProfile;
  onParseBrief: (rawText: string, locationHint?: string, budgetHint?: number) => Promise<ParsedProjectBrief>;
  onCreateProject: (projectData: any) => Promise<Project>;
  onNavigateToMatches: (projectId?: string) => void;
}

const BRIEF_PRESETS = [
  {
    title: 'Sci-Fi Indie Short',
    text: 'Shooting a high-concept 12-minute sci-fi narrative short titled "Echoes in Amber" in Mumbai & studio stage across 3 days in mid-October. We require a Cinematographer with a Sony FX6 or RED cinema package with prime lenses, plus an experienced Location Sound Recordist for pristine dialogue capture.',
    budget: 350000,
    location: 'Mumbai, Maharashtra',
  },
  {
    title: 'Streetwear Commercial',
    text: 'Directing a 60-second high-energy fashion commercial for Apex Streetwear Fall/Winter 2026. Filming over 2 intense days in an industrial warehouse in Bengaluru. Need a visionary DP who can handle 120fps high-speed tracking and a Gaffer with an Astera Titan tube kit for dynamic wireless DMX strobe effects.',
    budget: 850000,
    location: 'Bengaluru, Karnataka',
  },
  {
    title: 'Music Video in Desert',
    text: 'Filming a stylized 4-minute music video in Rajasthan over a single weekend in late October. Looking for a solo DP/Gimbal operator and a sound designer for on-set ambience and acoustic recording. Naturalistic sunlight transitions and minimal footprint.',
    budget: 450000,
    location: 'Jaipur, Rajasthan',
  },
];

const BUDGET_TAGS = [
  { label: '₹1.5L Indie Cap', amount: 150000 },
  { label: '₹3.5L Narrative', amount: 350000 },
  { label: '₹8.5L Commercial', amount: 850000 },
  { label: '₹15L Studio Tier', amount: 1500000 },
  { label: '₹30L+ Campaign', amount: 3000000 },
];

export const ProjectBriefBuilderView: React.FC<ProjectBriefBuilderViewProps> = ({
  currentUser,
  onParseBrief,
  onCreateProject,
  onNavigateToMatches,
}) => {
  const [rawBrief, setRawBrief] = useState(BRIEF_PRESETS[0].text);
  const [locationHint, setLocationHint] = useState('Los Angeles, CA');
  const [budgetHint, setBudgetHint] = useState<number>(8000);
  
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedProjectBrief | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedProject, setPublishedProject] = useState<Project | null>(null);

  const handleGenerateMatch = async () => {
    if (!rawBrief.trim() || rawBrief.length < 10) return;
    setIsParsing(true);
    try {
      const result = await onParseBrief(rawBrief, locationHint, budgetHint);
      setParsedData(result);

      // Auto publish and prepare matches
      setIsPublishing(true);
      const project = await onCreateProject({
        seekerId: currentUser.id,
        title: result.projectTitle || 'Cinematic Production',
        rawTextBrief: rawBrief,
        parsedRequirements: result,
        budgetUsd: result.estimatedBudgetUsd || budgetHint,
        timeline: result.shootDatesWindow,
        location: result.locationRequirement || locationHint,
        genreTags: [result.genre, result.tone],
      });
      setPublishedProject(project);
    } catch (err) {
      console.error('Failed to generate matches for brief:', err);
    } finally {
      setIsParsing(false);
      setIsPublishing(false);
    }
  };

  const loadPreset = (preset: typeof BRIEF_PRESETS[0]) => {
    setRawBrief(preset.text);
    setBudgetHint(preset.budget);
    setLocationHint(preset.location);
    setParsedData(null);
    setPublishedProject(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[var(--text-primary)]">
      {/* Header */}
      <div className="card-warm-white p-6 sm:p-7 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="editorial-kicker mb-1">
            <span>AI BRIEF INGESTION & MATCH ENGINE</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Project Brief Builder
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Describe your creative vision, camera package requirements, and rate parameters. Our engine identifies matched collaborators.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-medium">Quick Prompts:</span>
          {BRIEF_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="px-3.5 py-1.5 rounded-full text-xs bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-inner-border)] transition-colors font-medium shadow-sm cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Natural Language Input & Constraints */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-warm-white rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
                <h2 className="font-editorial text-base font-bold">Project Vision & Creative Scope</h2>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {rawBrief.length} chars
              </span>
            </div>

            <div>
              <textarea
                id="textarea-raw-brief"
                rows={7}
                value={rawBrief}
                onChange={(e) => setRawBrief(e.target.value)}
                placeholder="Describe your project, visual aesthetic, crew roles required, shoot dates, and specific camera kits..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl p-4 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] leading-relaxed focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
              />
            </div>

            {/* Quick Budget Tag Pickers */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
                Target Budget Ceiling
              </label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setBudgetHint(tag.amount)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      budgetHint === tag.amount
                        ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm'
                        : 'bg-[var(--card-inner-bg)] text-[var(--text-secondary)] border border-[var(--card-inner-border)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Shoot Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    id="input-brief-location"
                    type="text"
                    value={locationHint}
                    onChange={(e) => setLocationHint(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-amber)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Custom Total Budget (₹ INR)
                </label>
                <div className="relative">
                  <span className="text-[var(--text-muted)] text-sm absolute left-3.5 top-2.5 font-mono">₹</span>
                  <input
                    id="input-brief-budget"
                    type="number"
                    value={budgetHint}
                    onChange={(e) => setBudgetHint(parseInt(e.target.value) || 0)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[var(--input-text)] font-mono font-bold focus:outline-none focus:border-[var(--accent-amber)]"
                  />
                </div>
              </div>
            </div>

            <button
              id="btn-generate-match"
              onClick={handleGenerateMatch}
              disabled={isParsing || isPublishing}
              className="amber-pill-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
            >
              {isParsing || isPublishing ? (
                <span className="animate-pulse flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Analyzing Brief & Calculating Matches...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Matches</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Extraction & Instant Matches CTA */}
        <div className="lg:col-span-6 space-y-6">
          {parsedData ? (
            <div className="card-warm-white rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent-amber)]">
                    ✦ AI Analyzed Scope
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)] mt-0.5">
                    {parsedData.projectTitle}
                  </h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)] text-xs font-mono font-bold">
                  ${parsedData.estimatedBudgetUsd?.toLocaleString()}
                </div>
              </div>

              {/* Genre & Tone Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--card-inner-bg)] text-[var(--text-primary)] text-xs font-medium border border-[var(--card-inner-border)]">
                  Genre: {parsedData.genre}
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--card-inner-bg)] text-[var(--accent-amber)] text-xs font-medium border border-[var(--card-inner-border)]">
                  Aesthetic: {parsedData.tone}
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--card-inner-bg)] text-[var(--text-muted)] text-xs font-medium border border-[var(--card-inner-border)]">
                  {parsedData.shootDatesWindow || '3-Day Production Window'}
                </span>
              </div>

              {/* Crew Roles Extracted */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--accent-amber)]" />
                  <span>Crew Roles Required</span>
                </h3>

                <div className="space-y-2">
                  {parsedData.rolesRequired?.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[var(--card-inner-bg)] rounded-2xl border border-[var(--card-inner-border)] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {role.roleTitle}
                        </span>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {role.experienceLevel || 'Lead Specialist'}
                        </p>
                      </div>
                      {role.estimatedDayRateUsd && (
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                          ${role.estimatedDayRateUsd}/day
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gear Dependencies Extracted */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[var(--accent-amber)]" />
                  <span>Equipment Dependencies</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedData.gearDependencies?.map((gear, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[var(--card-inner-bg)] rounded-xl border border-[var(--card-inner-border)]"
                    >
                      <span className="text-[10px] font-bold text-[var(--accent-amber)] uppercase block">
                        {gear.category}
                      </span>
                      <p className="text-xs text-[var(--text-primary)] mt-0.5">{gear.itemOrSpecs}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-2">
                <button
                  id="btn-view-matches-from-builder"
                  onClick={() => onNavigateToMatches(publishedProject?.id)}
                  className="amber-pill-btn w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>View Matched Filmmakers ({parsedData.rolesRequired?.length || 2} Roles)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="card-warm-white rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-center text-[var(--accent-amber)] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                Ready to Match
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1 leading-relaxed">
                Click <strong>"Generate Matches"</strong> to run our multi-factor scoring engine and review verified crew candidates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
