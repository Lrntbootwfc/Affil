import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  MapPin,
  DollarSign,
  Camera,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  ArrowRight
} from 'lucide-react';
import type {
  Match,
  CreatorProfile,
  Project,
  MatchStatus
} from '../types';

interface BidirectionalMatchDashboardProps {
  matches: Match[];
  projects: Project[];
  currentUser: CreatorProfile;
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  onMatchAction: (matchId: string, action: 'accept' | 'counter_offer' | 'pass', notes?: string) => Promise<void>;
  onNavigateToBrief: () => void;
  onNavigateToWorkspace?: (projectId: string) => void;
}

export const BidirectionalMatchDashboard: React.FC<BidirectionalMatchDashboardProps> = ({
  matches,
  projects,
  selectedProjectId,
  onSelectProject,
  onMatchAction,
  onNavigateToBrief,
  onNavigateToWorkspace,
}) => {
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  // Counter-offer modal
  const [counterModalMatch, setCounterModalMatch] = useState<Match | null>(null);
  const [counterNotes, setCounterNotes] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Filter matches based on selected project & status
  let filteredMatches = [...matches];
  if (selectedProjectId && selectedProjectId !== 'all') {
    filteredMatches = filteredMatches.filter((m) => m.projectId === selectedProjectId);
  }
  if (activeFilterStatus !== 'all') {
    filteredMatches = filteredMatches.filter((m) => m.status === activeFilterStatus);
  }

  const handleAction = async (matchId: string, action: 'accept' | 'counter_offer' | 'pass', notes?: string) => {
    setIsSubmittingAction(true);
    try {
      await onMatchAction(matchId, action, notes);
      setCounterModalMatch(null);
      setCounterNotes('');
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E58B13]/15 text-[#E58B13] border border-[#E58B13]/30 flex items-center gap-1">
            <Check className="w-3 h-3" /> Producer Approved
          </span>
        );
      case 'accepted':
        return (
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#2D6A4F]/15 dark:bg-[#4ade80]/15 text-[#2D6A4F] dark:text-[#4ade80] border border-[#2D6A4F]/30 dark:border-[#4ade80]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Connected
          </span>
        );
      case 'counter_offered':
        return (
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30">
            Counter Proposed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--card-inner-bg)] text-[var(--text-muted)] border border-[var(--card-inner-border)]">
            Passed
          </span>
        );
      case 'pending_admin':
      default:
        return (
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--card-inner-bg)] text-[var(--text-secondary)] border border-[var(--card-inner-border)] flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#E58B13]" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[var(--text-primary)]">
      {/* Header & Project Filter Toolbar */}
      <div className="card-warm-white p-6 sm:p-7 rounded-3xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="editorial-kicker mb-1">
              <span>MATCH FEED & CREW SYNERGY</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Bidirectional Match Evaluation
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Evaluates if crew satisfy technical gear constraints AND if your project advances their artistic goals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-new-brief-from-matches"
              onClick={onNavigateToBrief}
              className="amber-pill-btn px-5 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
            >
              + Create New Brief
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--card-border)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#E58B13]" /> Active Project:
            </span>
            <select
              id="select-match-project"
              value={selectedProjectId || 'all'}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#E58B13]"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.budgetUsd?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[var(--card-inner-bg)] p-1 rounded-full border border-[var(--card-inner-border)]">
            {['all', 'pending_admin', 'approved', 'accepted', 'counter_offered'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilterStatus === status
                    ? 'bg-[#181614] dark:bg-[#F5A623] text-[#FBF7F0] dark:text-[#181614] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'pending_admin'
                  ? 'Under Review'
                  : status === 'approved'
                  ? 'Approved'
                  : status === 'accepted'
                  ? 'Connected'
                  : 'Countered'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches Cards Feed */}
      {filteredMatches.length === 0 ? (
        <div className="card-warm-white rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 rounded-2xl bg-[#181614] dark:bg-[#231F1C] border border-[#3A332C] flex items-center justify-center text-[#E58B13] mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
            No Matches Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
            Adjust your filter status or create a new project brief to trigger the matching engine.
          </p>
          <button
            onClick={onNavigateToBrief}
            className="amber-pill-btn mt-5 px-6 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
          >
            Create Project Brief
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => {
            const collab = match.collaborator;
            const project = match.project;
            const isExpanded = expandedMatchId === match.id;
            const isAccepted = match.status === 'accepted';

            return (
              <div
                key={match.id}
                id={`match-card-${match.id}`}
                className="card-warm-white rounded-3xl overflow-hidden transition-all hover:shadow-xl relative"
              >
                {/* Main Card Header */}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Creator Identity */}
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={
                          collab?.avatarUrl ||
                          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
                        }
                        alt={collab?.name || 'Creator'}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E58B13] shadow-md shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                            {collab?.name || 'Aman Sharma'}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--card-inner-bg)] text-[#E58B13] border border-[var(--card-inner-border)]">
                            {collab?.primaryRole || 'Cinematographer'}
                          </span>
                          {getStatusBadge(match.status)}
                        </div>

                        <p className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#8C7862]" />
                            {collab?.location || 'Mumbai, Maharashtra'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono font-bold text-[var(--text-primary)]">
                            <span className="text-xs text-[#E58B13] font-bold">₹</span>
                            ₹{(collab?.dayRateUsd || 25000).toLocaleString('en-IN')}/day
                          </span>
                          <span>•</span>
                          <span>
                            Project: <strong className="text-[var(--text-primary)]">{project?.title || 'Production'}</strong>
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Synergy Score & Action Controls */}
                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                      <div className="px-4 py-2 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-center">
                        <span className="text-[10px] font-mono font-bold uppercase block text-[var(--text-muted)]">
                          Overall Fit
                        </span>
                        <span className="text-xl font-bold font-mono text-[#E58B13]">
                          {match.bidirectionalScore || 95}%
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {isAccepted ? (
                          <button
                            id={`btn-workspace-launch-${match.id}`}
                            onClick={() => onNavigateToWorkspace && onNavigateToWorkspace(match.projectId)}
                            className="px-5 py-2.5 rounded-full bg-[#181614] dark:bg-[#F5A623] hover:bg-[#2C2723] dark:hover:bg-[#E58B13] text-[#F8F5F0] dark:text-[#181614] font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#E58B13] dark:text-[#181614]" />
                            <span>Open Shoot Plan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <>
                            <button
                              id={`btn-accept-match-${match.id}`}
                              onClick={() => handleAction(match.id, 'accept')}
                              disabled={isSubmittingAction}
                              className="amber-pill-btn px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </button>

                            <button
                              id={`btn-counter-match-${match.id}`}
                              onClick={() => setCounterModalMatch(match)}
                              className="px-3.5 py-2.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] font-semibold text-xs border border-[var(--card-inner-border)] transition-colors cursor-pointer"
                            >
                              Counter
                            </button>

                            <button
                              id={`btn-pass-match-${match.id}`}
                              onClick={() => handleAction(match.id, 'pass')}
                              className="p-2.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[#FEE2E2] dark:hover:bg-[#EF4444]/20 text-[var(--text-muted)] hover:text-[#DC2626] border border-[var(--card-inner-border)] transition-colors cursor-pointer"
                              title="Pass on match"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dual-Sided Evaluation Logic Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[var(--card-border)]">
                    {/* Left: Why they fit YOU */}
                    <div className="bg-[var(--card-inner-bg)] p-4 rounded-2xl border border-[var(--card-inner-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#E58B13]" />
                          Why {collab?.name?.split(' ')[0] || 'They'} Fits You ({match.seekerFitScore}% Fit)
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {match.whyTheyFitProject?.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E58B13] mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Why your project fits THEM */}
                    <div className="bg-[var(--card-inner-bg)] p-4 rounded-2xl border border-[var(--card-inner-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#E58B13]" />
                          Why You Fit {collab?.name?.split(' ')[0] || 'Them'} ({match.collaboratorFitScore}% Fit)
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {match.whyProjectFitsThem?.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E58B13] mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Verified Gear Pills */}
                  {collab?.gearItems && collab.gearItems.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-[#E58B13]" /> Verified Equipment:
                      </span>
                      {collab.gearItems.map((g) => (
                        <span
                          key={g.id}
                          className="px-2.5 py-1 rounded-xl text-xs bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]"
                        >
                          {g.equipmentName}{' '}
                          <strong className="text-[#E58B13] font-mono text-[10px]">
                            [{g.ownershipStatus}]
                          </strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Counter offer notes */}
                  {match.counterOfferNotes && (
                    <div className="mt-3 p-3 bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#FDE68A] dark:border-[#92400E] rounded-xl text-xs text-[#92400E] dark:text-[#FDE68A]">
                      <strong className="font-bold">Proposed Counter-Offer:</strong> {match.counterOfferNotes}
                    </div>
                  )}
                </div>

                {/* 5-Layer Fit Breakdown Accordion Toggle */}
                <div className="bg-[var(--card-inner-bg)] border-t border-[var(--card-border)] px-6 py-3 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                    className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>
                      {isExpanded
                        ? 'Hide Match Diagnostics'
                        : 'View Match Diagnostics (5-Factor Telemetry)'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="text-xs text-[var(--text-muted)]">
                    Location: {collab?.location}
                  </span>
                </div>

                {/* Expanded Telemetry */}
                {isExpanded && (
                  <div className="p-6 bg-[var(--card-inner-bg)] border-t border-[var(--card-border)] space-y-4">
                    <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Factor Weight Scoring
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--card-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block mb-1">
                          1. Domain Skills
                        </span>
                        <span className="text-base font-bold text-[#2D6A4F] dark:text-[#4ade80] font-mono">
                          {match.scoreBreakdown.explicitSkillsScore}%
                        </span>
                      </div>

                      <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--card-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block mb-1">
                          2. Portfolio Aesthetic
                        </span>
                        <span className="text-base font-bold text-[#E58B13] font-mono">
                          {match.scoreBreakdown.portfolioMetadataScore}%
                        </span>
                      </div>

                      <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--card-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block mb-1">
                          3. Style Harmony
                        </span>
                        <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                          {match.scoreBreakdown.dynamicIntentScore}%
                        </span>
                      </div>

                      <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--card-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block mb-1">
                          4. Rate & Gear Kit
                        </span>
                        <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                          {match.scoreBreakdown.budgetGearConstraintsScore}%
                        </span>
                      </div>

                      <div className="bg-[var(--card-bg)] p-3 rounded-2xl border border-[var(--card-border)] col-span-2 sm:col-span-1">
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block mb-1">
                          5. Reliability
                        </span>
                        <span className="text-base font-bold text-[#2D6A4F] dark:text-[#4ade80] font-mono">
                          {match.scoreBreakdown.outcomeFeedbackScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Counter-Offer Modal */}
      {counterModalMatch && (
        <div className="fixed inset-0 z-50 bg-[#141210]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-obsidian rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-[#3A332C]">
            <div>
              <div className="editorial-kicker text-[10px] mb-1">
                <span>COMMERCIAL ADJUSTMENT</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#F8F5F0]">
                Propose Counter-Offer
              </h3>
              <p className="text-xs text-[#A89C8D] mt-1">
                Propose adjusted day rate, modified shoot dates, or specific kit requirements to{' '}
                <strong className="text-[#F8F5F0]">
                  {counterModalMatch.collaborator?.name}
                </strong>
                .
              </p>
            </div>

            <textarea
              rows={4}
              value={counterNotes}
              onChange={(e) => setCounterNotes(e.target.value)}
              placeholder="e.g. Can we do ₹28,000/day for 2 shoot days with the Sony FX6 package and wireless focus included?"
              className="w-full bg-[#231F1C] border border-[#3A332C] rounded-2xl p-3 text-xs text-[#F8F5F0] placeholder-[#706658] focus:outline-none focus:border-[#E58B13]"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCounterModalMatch(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#A89C8D] hover:text-[#F8F5F0] hover:bg-[#231F1C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleAction(
                    counterModalMatch.id,
                    'counter_offer',
                    counterNotes || 'Proposed schedule / rate counter-offer.'
                  )
                }
                disabled={isSubmittingAction}
                className="amber-pill-btn px-5 py-2 rounded-full text-xs font-bold shadow-md cursor-pointer"
              >
                {isSubmittingAction ? 'Submitting...' : 'Send Counter-Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
