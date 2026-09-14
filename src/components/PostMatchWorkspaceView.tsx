import React, { useState, useEffect } from 'react';
import {
  Film,
  Camera,
  DollarSign,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  Printer,
  Share2,
  ChevronRight,
  Check,
  Shield,
  Loader2,
} from 'lucide-react';
import type {
  ProjectWorkspace,
  ShotItem,
  BudgetItem,
  CreatorProfile,
  Project
} from '../types';
import { api } from '../lib/api';

interface PostMatchWorkspaceViewProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  currentUser: CreatorProfile;
  onNavigateToMatches: () => void;
}

export const PostMatchWorkspaceView: React.FC<PostMatchWorkspaceViewProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  currentUser,
  onNavigateToMatches,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'shotlist' | 'budget' | 'callsheet'>('shotlist');
  const [workspace, setWorkspace] = useState<ProjectWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [aiOptimizationResult, setAiOptimizationResult] = useState<{
    notes: string;
    savedMins: number;
    suggestedShots: Partial<ShotItem>[];
  } | null>(null);

  // New Shot Modal state
  const [isAddShotOpen, setIsAddShotOpen] = useState<boolean>(false);
  const [newShot, setNewShot] = useState<Partial<ShotItem>>({
    sceneNumber: 'Scene 1',
    shotNumber: '1C',
    shotType: 'Medium',
    focalLength: '35mm Anamorphic',
    cameraMovement: 'Handheld',
    description: '',
    lightingSetup: 'Key softbox + practical fill',
    audioNotes: 'Sync lav dialogue + Foley',
    setupTimeMinutes: 20,
  });

  // New Budget Item state
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState<boolean>(false);
  const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({
    category: 'Camera & Grip Crew',
    item: '',
    ratePerUnit: 600,
    unit: 'day',
    quantity: 3,
  });

  // Share feedback
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Filter shots
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');

  const currentProjectId =
    selectedProjectId && selectedProjectId !== 'all'
      ? selectedProjectId
      : projects[0]?.id || 'proj_echoes_scifi';

  const loadWorkspace = async (projId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getWorkspace(projId);
      setWorkspace(data);
    } catch (err) {
      console.error('Failed to load workspace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentProjectId) {
      loadWorkspace(currentProjectId);
    }
  }, [currentProjectId]);

  // Shot actions
  const handleToggleShotComplete = async (shot: ShotItem) => {
    if (!workspace) return;
    try {
      const updated = await api.updateShot(workspace.projectId, shot.id, {
        isCompleted: !shot.isCompleted,
      });
      setWorkspace(updated);
    } catch (err) {
      console.error('Failed to toggle shot:', err);
    }
  };

  const handleAddShotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !newShot.description) return;
    try {
      const updated = await api.addShot(workspace.projectId, newShot);
      setWorkspace(updated);
      setIsAddShotOpen(false);
      setNewShot({
        sceneNumber: 'Scene 1',
        shotNumber: `${updated.shotList.length + 1}A`,
        shotType: 'Medium',
        focalLength: '35mm Anamorphic',
        cameraMovement: 'Handheld',
        description: '',
        lightingSetup: 'Key softbox + practical fill',
        audioNotes: 'Sync lav dialogue + Foley',
        setupTimeMinutes: 20,
      });
    } catch (err) {
      console.error('Failed to add shot:', err);
    }
  };

  const handleDeleteShot = async (shotId: string) => {
    if (!workspace) return;
    try {
      const updated = await api.deleteShot(workspace.projectId, shotId);
      setWorkspace(updated);
    } catch (err) {
      console.error('Failed to delete shot:', err);
    }
  };

  // Budget actions
  const handleAddBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !newBudgetItem.item) return;
    try {
      const updated = await api.addBudgetItem(workspace.projectId, newBudgetItem);
      setWorkspace(updated);
      setIsAddBudgetOpen(false);
      setNewBudgetItem({
        category: 'Camera & Grip Crew',
        item: '',
        ratePerUnit: 600,
        unit: 'day',
        quantity: 3,
      });
    } catch (err) {
      console.error('Failed to add budget item:', err);
    }
  };

  const handleDeleteBudgetItem = async (budgetId: string) => {
    if (!workspace) return;
    try {
      const updated = await api.deleteBudgetItem(workspace.projectId, budgetId);
      setWorkspace(updated);
    } catch (err) {
      console.error('Failed to delete budget item:', err);
    }
  };

  // Call Sheet toggle crew confirmed
  const handleToggleCrewConfirmed = async (crewId: string) => {
    if (!workspace || !workspace.callSheet) return;
    const updatedCrew = workspace.callSheet.crewList.map((c) =>
      c.id === crewId ? { ...c, isConfirmed: !c.isConfirmed } : c
    );
    try {
      const updated = await api.updateCallSheet(workspace.projectId, {
        crewList: updatedCrew,
      });
      setWorkspace(updated);
    } catch (err) {
      console.error('Failed to update crew list:', err);
    }
  };

  // AI Optimizer
  const handleRunAiOptimizer = async () => {
    if (!workspace) return;
    setIsOptimizing(true);
    try {
      const res = await api.optimizeShootPlanAI(workspace.projectId);
      setAiOptimizationResult({
        notes: res.optimizationNotes,
        savedMins: res.estimatedTimeSavedMinutes,
        suggestedShots: res.suggestedShots,
      });
    } catch (err) {
      console.error('Failed to optimize shoot plan:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplySuggestedShot = async (suggested: Partial<ShotItem>) => {
    if (!workspace) return;
    try {
      const updated = await api.addShot(workspace.projectId, suggested);
      setWorkspace(updated);
      setAiOptimizationResult((prev) =>
        prev
          ? {
              ...prev,
              suggestedShots: prev.suggestedShots.filter(
                (s) => s.shotNumber !== suggested.shotNumber
              ),
            }
          : null
      );
    } catch (err) {
      console.error('Failed to apply suggested shot:', err);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading || !workspace) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-[#64748B] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        <p className="text-sm font-mono text-[#94A3B8]">
          Loading Post-Match Shoot Plan & Production Workspace...
        </p>
      </div>
    );
  }

  // Calculate budget stats
  const totalAllocatedBudget = workspace.budgetItems.reduce(
    (sum, item) => sum + item.totalUsd,
    0
  );
  const currentProjectModel = projects.find((p) => p.id === workspace.projectId);
  const projectCap = currentProjectModel?.budgetUsd || 22000;
  const budgetVariance = projectCap - totalAllocatedBudget;

  // Shot stats
  const totalShots = workspace.shotList.length;
  const completedShots = workspace.shotList.filter((s) => s.isCompleted).length;
  const progressPercent = totalShots > 0 ? Math.round((completedShots / totalShots) * 100) : 0;
  const totalSetupMins = workspace.shotList.reduce((sum, s) => sum + s.setupTimeMinutes, 0);

  // Filtered shot list
  const scenes: string[] = Array.from(new Set(workspace.shotList.map((s) => s.sceneNumber)));
  const filteredShots =
    selectedSceneFilter === 'all'
      ? workspace.shotList
      : workspace.shotList.filter((s) => s.sceneNumber === selectedSceneFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-[#F8FAFC]">
      {/* Top Workspace Banner */}
      <div className="bg-[#12141C] border border-[#222738] rounded-2xl p-6 mb-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                Post-Match Active Workspace
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#06B6D4]/20 text-[#38BDF8] border border-[#06B6D4]/30">
                Pre-Production Blueprint
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
              <Film className="w-6 h-6 text-[#8B5CF6] shrink-0" />
              <span>{workspace.projectTitle}</span>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Real-time synchronized shoot blueprint with verified gear packages and cast/crew allocations.
            </p>
          </div>

          {/* Project Switcher & Toolbar Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Project Select Dropdown */}
            <div className="relative">
              <select
                id="workspace-project-selector"
                value={workspace.projectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-[#0C0E14] border border-[#222738] text-[#F8FAFC] text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-[#8B5CF6]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Optimize Shoot Plan Button */}
            <button
              id="btn-ai-optimize-shoot-plan"
              onClick={handleRunAiOptimizer}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all border border-[#A78BFA]/40"
            >
              {isOptimizing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-white" />
              )}
              <span>{isOptimizing ? 'Optimizing Plan...' : 'AI Shoot Optimizer'}</span>
            </button>

            {/* Print / PDF Call Sheet */}
            <button
              id="btn-print-call-sheet"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0C0E14] hover:bg-[#1A1E2C] text-[#E2E8F0] text-xs font-medium border border-[#222738] transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Export Call Sheet</span>
            </button>

            {/* Share Crew Link */}
            <button
              id="btn-share-crew-link"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0C0E14] hover:bg-[#1A1E2C] text-[#E2E8F0] text-xs font-medium border border-[#222738] transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[#34D399]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Matched Collaborator Snapshot Card */}
        {workspace.matchedCollaborator && (
          <div className="mt-4 pt-4 border-t border-[#222738] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={
                  workspace.matchedCollaborator.avatarUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
                }
                alt={workspace.matchedCollaborator.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-[#8B5CF6] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">
                    {workspace.matchedCollaborator.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                    {workspace.matchedCollaborator.primaryRole}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#8B5CF6]/30 text-[#C4B5FD] border border-[#8B5CF6]/40">
                    {workspace.matchScore}% Match Fit
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-1">
                  Verified Gear Package: {workspace.matchedCollaborator.gearItems.map((g) => g.equipmentName).join(', ') || 'RED Cinema 8K Kit'}
                </p>
              </div>
            </div>

            <button
              id="btn-switch-to-match-feed"
              onClick={onNavigateToMatches}
              className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <span>View Match Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* AI Shoot Plan Optimizer Alert / Results Banner */}
      {aiOptimizationResult && (
        <div className="mb-6 bg-[#12141C] border border-[#8B5CF6]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">
                    AI Shoot Optimization Insights
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06B6D4]/20 text-[#38BDF8] border border-[#06B6D4]/30">
                    ~{aiOptimizationResult.savedMins} mins estimated turnaround saved
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1 max-w-3xl leading-relaxed">
                  {aiOptimizationResult.notes}
                </p>

                {/* Suggested Shots */}
                {aiOptimizationResult.suggestedShots.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#222738]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C4B5FD] mb-2">
                      Suggested High-Impact Cinematic Coverage:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {aiOptimizationResult.suggestedShots.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#0C0E14] border border-[#222738] flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#38BDF8]">
                                {s.sceneNumber} / Shot {s.shotNumber}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#12141C] text-[#E2E8F0] rounded">
                                {s.shotType} • {s.focalLength}
                              </span>
                            </div>
                            <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">
                              {s.description}
                            </p>
                          </div>
                          <button
                            id={`btn-apply-suggested-shot-${idx}`}
                            onClick={() => handleApplySuggestedShot(s)}
                            className="px-2.5 py-1 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium shrink-0 flex items-center gap-1 shadow"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Shot</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setAiOptimizationResult(null)}
              className="text-[#64748B] hover:text-[#F8FAFC] text-xs font-mono p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#222738] mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-shotlist"
            onClick={() => setActiveSubTab('shotlist')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'shotlist'
                ? 'border-[#8B5CF6] text-white bg-[#12141C] rounded-t-xl'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Camera className="w-4 h-4 text-[#8B5CF6]" />
            <span>Shot List & Camera Blueprint</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 bg-[#0C0E14] text-[#E2E8F0] rounded-full font-mono border border-[#222738]">
              {workspace.shotList.length}
            </span>
          </button>

          <button
            id="tab-budget"
            onClick={() => setActiveSubTab('budget')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'budget'
                ? 'border-[#8B5CF6] text-white bg-[#12141C] rounded-t-xl'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#34D399]" />
            <span>Line-Item Budget Breakdown</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 bg-[#0C0E14] text-[#E2E8F0] rounded-full font-mono border border-[#222738]">
              ${(totalAllocatedBudget / 1000).toFixed(1)}k
            </span>
          </button>

          <button
            id="tab-callsheet"
            onClick={() => setActiveSubTab('callsheet')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'callsheet'
                ? 'border-[#8B5CF6] text-white bg-[#12141C] rounded-t-xl'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#38BDF8]" />
            <span>Production Call Sheet Preview</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 bg-[#0C0E14] text-[#E2E8F0] rounded-full font-mono border border-[#222738]">
              Day {workspace.callSheet.shootDayNumber}/{workspace.callSheet.totalShootDays}
            </span>
          </button>
        </div>
      </div>

      {/* 1. SHOT LIST & CAMERA BLUEPRINT VIEW */}
      {activeSubTab === 'shotlist' && (
        <div className="space-y-6">
          {/* Shot List Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Total Planned Shots</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-[#F8FAFC] font-mono">{totalShots}</span>
                <span className="text-xs text-[#64748B] font-mono">Across {scenes.length} Scenes</span>
              </div>
            </div>

            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Shots Completed on Set</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-[#34D399] font-mono">
                  {completedShots} / {totalShots}
                </span>
                <span className="text-xs text-[#34D399] font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#0C0E14] h-1.5 rounded-full mt-2 overflow-hidden border border-[#222738]">
                <div
                  className="bg-[#8B5CF6] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Est. Setup Time</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-[#38BDF8] font-mono">{totalSetupMins} m</span>
                <span className="text-xs text-[#94A3B8] font-mono">
                  ~{(totalSetupMins / 60).toFixed(1)} hrs
                </span>
              </div>
            </div>

            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-[#94A3B8] font-medium">Add Coverage</p>
                <p className="text-xs text-[#F8FAFC] font-semibold mt-0.5">New Camera Setup</p>
              </div>
              <button
                id="btn-open-add-shot-modal"
                onClick={() => setIsAddShotOpen(true)}
                className="p-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-[#8B5CF6]/30 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scene Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12141C]/80 p-3 rounded-2xl border border-[#222738]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Filter Scene:
              </span>
              <button
                id="filter-scene-all"
                onClick={() => setSelectedSceneFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSceneFilter === 'all'
                    ? 'bg-[#8B5CF6] text-white font-bold'
                    : 'bg-[#0C0E14] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#222738]'
                }`}
              >
                All Scenes ({workspace.shotList.length})
              </button>
              {scenes.map((sc) => (
                <button
                  key={sc}
                  id={`filter-scene-${sc.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedSceneFilter(sc)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedSceneFilter === sc
                      ? 'bg-[#8B5CF6] text-white font-bold'
                      : 'bg-[#0C0E14] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#222738]'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#94A3B8]">
              Showing <span className="text-[#F8FAFC] font-semibold">{filteredShots.length}</span> shots
            </p>
          </div>

          {/* Shot Cards */}
          <div className="space-y-3">
            {filteredShots.map((shot) => (
              <div
                key={shot.id}
                id={`shot-card-${shot.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  shot.isCompleted
                    ? 'bg-[#0C0E14]/60 border-[#222738] opacity-75'
                    : 'bg-[#12141C] border-[#222738] hover:border-[#8B5CF6]/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      id={`btn-toggle-shot-status-${shot.id}`}
                      onClick={() => handleToggleShotComplete(shot)}
                      title={shot.isCompleted ? 'Mark as Incomplete' : 'Mark as Shot Completed'}
                      className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        shot.isCompleted
                          ? 'bg-[#8B5CF6] border-[#A78BFA] text-white'
                          : 'border-[#222738] bg-[#0C0E14] hover:border-[#8B5CF6] text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 font-bold" />
                    </button>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#0C0E14] text-[#38BDF8] border border-[#06B6D4]/30">
                          {shot.sceneNumber} • Shot {shot.shotNumber}
                        </span>

                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                          {shot.shotType}
                        </span>

                        <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#0C0E14] text-[#E2E8F0] border border-[#222738]">
                          {shot.focalLength}
                        </span>

                        <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-[#06B6D4]/20 text-[#38BDF8] border border-[#06B6D4]/30">
                          {shot.cameraMovement}
                        </span>

                        <span className="text-xs font-mono text-[#64748B] flex items-center gap-1 ml-auto">
                          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                          {shot.setupTimeMinutes} min setup
                        </span>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${
                          shot.isCompleted ? 'text-[#64748B] line-through' : 'text-[#F8FAFC] font-medium'
                        }`}
                      >
                        {shot.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="text-xs bg-[#0C0E14] p-2.5 rounded-xl border border-[#222738]">
                          <span className="text-[#38BDF8] font-semibold">Lighting Setup: </span>
                          <span className="text-[#CBD5E1]">{shot.lightingSetup}</span>
                        </div>
                        <div className="text-xs bg-[#0C0E14] p-2.5 rounded-xl border border-[#222738]">
                          <span className="text-[#34D399] font-semibold">Sound Cue: </span>
                          <span className="text-[#CBD5E1]">{shot.audioNotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center gap-2 self-end md:self-start">
                    <button
                      id={`btn-delete-shot-${shot.id}`}
                      onClick={() => handleDeleteShot(shot.id)}
                      title="Delete Shot"
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F87171] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC LINE-ITEM BUDGET BREAKDOWN */}
      {activeSubTab === 'budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Target Budget Cap</p>
              <p className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1">
                ${projectCap.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Defined in Project Brief</p>
            </div>

            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Total Allocated Spend</p>
              <p className="text-2xl font-bold text-[#34D399] font-mono mt-1">
                ${totalAllocatedBudget.toLocaleString()}
              </p>
              <div className="w-full bg-[#0C0E14] h-1.5 rounded-full mt-2 overflow-hidden border border-[#222738]">
                <div
                  className={`h-full ${
                    totalAllocatedBudget <= projectCap ? 'bg-[#8B5CF6]' : 'bg-[#EF4444]'
                  }`}
                  style={{ width: `${Math.min(100, (totalAllocatedBudget / projectCap) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-[#12141C] border border-[#222738] p-4 rounded-2xl">
              <p className="text-xs text-[#94A3B8] font-medium">Variance vs Cap</p>
              <div className="flex items-baseline justify-between mt-1">
                <p
                  className={`text-2xl font-bold font-mono ${
                    budgetVariance >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
                  }`}
                >
                  {budgetVariance >= 0 ? `+$${budgetVariance.toLocaleString()}` : `-$${Math.abs(budgetVariance).toLocaleString()}`}
                </p>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#C4B5FD] font-medium">
                  {budgetVariance >= 0 ? 'On Budget' : 'Over Cap'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">Safety margin buffer</p>
            </div>

            <div className="bg-[#12141C] border border-[#8B5CF6]/40 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-xs text-[#C4B5FD] font-medium">Gear Package Savings</p>
                <p className="text-2xl font-bold text-white font-mono mt-1">
                  $2,400 <span className="text-xs text-[#94A3B8] font-normal">saved</span>
                </p>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-1">
                Zero camera/sound rental markup via verified collaborator gear
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F8FAFC] tracking-wide">
              Production Department Line Items
            </h3>
            <button
              id="btn-open-add-budget-modal"
              onClick={() => setIsAddBudgetOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-colors shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="bg-[#12141C] border border-[#222738] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0C0E14] text-[#94A3B8] uppercase tracking-wider font-mono border-b border-[#222738]">
                  <tr>
                    <th className="py-3 px-4">Department / Line Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4 text-right">Total (USD)</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222738]">
                  {workspace.budgetItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A1E2C]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#F8FAFC]">{item.item}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0C0E14] text-[#E2E8F0] border border-[#222738]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#CBD5E1]">
                        ${item.ratePerUnit.toLocaleString()} / {item.unit}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#CBD5E1]">
                        {item.quantity} {item.unit}s
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#34D399]">
                        ${item.totalUsd.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`btn-delete-budget-${item.id}`}
                          onClick={() => handleDeleteBudgetItem(item.id)}
                          title="Delete Line Item"
                          className="p-1 rounded text-[#64748B] hover:text-[#F87171] hover:bg-[#EF4444]/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#0C0E14] font-bold border-t border-[#222738] text-[#F8FAFC]">
                  <tr>
                    <td className="py-3.5 px-4 text-sm" colSpan={4}>
                      Total Production Expenditure
                    </td>
                    <td className="py-3.5 px-4 text-right text-base font-mono text-[#34D399]">
                      ${totalAllocatedBudget.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTION CALL SHEET PREVIEW */}
      {activeSubTab === 'callsheet' && (
        <div className="space-y-6">
          <div className="bg-[#12141C] border border-[#222738] rounded-2xl p-6 shadow-2xl">
            <div className="border-b-2 border-[#222738] pb-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#06B6D4]/20 text-[#38BDF8] border border-[#06B6D4]/30">
                    DAY {workspace.callSheet.shootDayNumber} OF {workspace.callSheet.totalShootDays}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-mono">
                    OFFICIAL PRODUCTION CALL SHEET
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  {workspace.projectTitle}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Shoot Date: <strong className="text-[#F8FAFC]">{workspace.callSheet.shootDate}</strong>
                </p>
              </div>

              <div className="bg-[#0C0E14] p-4 rounded-2xl border border-[#8B5CF6]/40 text-center shrink-0">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#C4B5FD]">
                  General Crew Call
                </p>
                <p className="text-2xl sm:text-3xl font-mono font-extrabold text-[#F8FAFC]">
                  {workspace.callSheet.generalCallTime}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-[#94A3B8] font-mono">
                  <span>Sunrise: {workspace.callSheet.sunriseTime}</span>
                  <span>•</span>
                  <span>Sunset: {workspace.callSheet.sunsetTime}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0C0E14] p-4 rounded-2xl border border-[#222738]">
                <div className="flex items-center gap-2 text-[#8B5CF6] mb-2">
                  <MapPin className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Set & Stage Location</h4>
                </div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  {workspace.callSheet.locationName}
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {workspace.callSheet.locationAddress}
                </p>
                <div className="mt-2 text-xs bg-[#12141C] p-2 rounded-xl text-[#CBD5E1] border border-[#222738]">
                  <strong className="text-[#C4B5FD]">Parking Notes: </strong>
                  {workspace.callSheet.parkingNotes}
                </div>
              </div>

              <div className="bg-[#0C0E14] p-4 rounded-2xl border border-[#EF4444]/30">
                <div className="flex items-center gap-2 text-[#F87171] mb-2">
                  <Shield className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Emergency Hospital</h4>
                </div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  {workspace.callSheet.nearestHospital}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="w-3.5 h-3.5 text-[#F87171]" />
                  <span className="text-xs font-mono font-bold text-[#F87171]">
                    Hotline: {workspace.callSheet.hospitalPhone}
                  </span>
                </div>
                <div className="mt-2 text-xs bg-[#12141C] p-2 rounded-xl text-[#CBD5E1] border border-[#222738]">
                  <strong className="text-[#38BDF8]">Weather: </strong>
                  {workspace.callSheet.weatherForecast}
                </div>
              </div>
            </div>

            <div className="bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-2xl p-3.5 mb-6 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                  Important Set Rules & Protocol
                </p>
                <p className="text-xs text-[#CBD5E1] mt-0.5">
                  {workspace.callSheet.specialInstructions}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B5CF6]" />
                <span>Production Schedule Timeline</span>
              </h3>
              <div className="space-y-2">
                {workspace.callSheet.scheduleEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#0C0E14] border border-[#222738] flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-[#12141C] text-[#C4B5FD] border border-[#8B5CF6]/30 shrink-0">
                        {evt.time}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#F8FAFC]">{evt.event}</p>
                        {evt.description && (
                          <p className="text-xs text-[#94A3B8] mt-0.5">{evt.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-[#8B5CF6]" />
                <span>Cast & Crew Call Directory</span>
              </h3>
              <div className="bg-[#0C0E14] rounded-2xl border border-[#222738] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12141C] text-[#94A3B8] uppercase font-mono text-[11px] border-b border-[#222738]">
                      <tr>
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4">Role</th>
                        <th className="py-2.5 px-4">Department</th>
                        <th className="py-2.5 px-4">Call Time</th>
                        <th className="py-2.5 px-4">Contact</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222738] font-sans">
                      {workspace.callSheet.crewList.map((crew) => (
                        <tr key={crew.id} className="hover:bg-[#1A1E2C]/40">
                          <td className="py-2.5 px-4 font-semibold text-[#F8FAFC]">{crew.name}</td>
                          <td className="py-2.5 px-4 text-[#34D399]">{crew.role}</td>
                          <td className="py-2.5 px-4 text-[#94A3B8]">{crew.department}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-[#38BDF8]">
                            {crew.callTime}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[#CBD5E1]">{crew.phone}</td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              id={`btn-toggle-crew-confirm-${crew.id}`}
                              onClick={() => handleToggleCrewConfirmed(crew.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                crew.isConfirmed
                                  ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40'
                                  : 'bg-[#12141C] text-[#94A3B8] border border-[#222738]'
                              }`}
                            >
                              {crew.isConfirmed ? '✓ Confirmed' : 'Pending Call'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SHOT */}
      {isAddShotOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0B0E]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#222738] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222738]">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#8B5CF6]" />
                <span>Add Shot to Blueprint</span>
              </h3>
              <button
                onClick={() => setIsAddShotOpen(false)}
                className="text-[#64748B] hover:text-[#F8FAFC] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddShotSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Scene Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newShot.sceneNumber}
                    onChange={(e) => setNewShot({ ...newShot, sceneNumber: e.target.value })}
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                    placeholder="e.g. Scene 1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Shot Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newShot.shotNumber}
                    onChange={(e) => setNewShot({ ...newShot, shotNumber: e.target.value })}
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                    placeholder="e.g. 1C"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Shot Type</label>
                  <select
                    value={newShot.shotType}
                    onChange={(e) =>
                      setNewShot({ ...newShot, shotType: e.target.value as ShotItem['shotType'] })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-2.5 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Wide">Wide</option>
                    <option value="Medium">Medium</option>
                    <option value="Close-Up">Close-Up</option>
                    <option value="Extreme Close-Up">Extreme Close-Up</option>
                    <option value="Over-the-Shoulder">Over-the-Shoulder</option>
                    <option value="POV">POV</option>
                    <option value="Aerial">Aerial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Focal Length</label>
                  <input
                    type="text"
                    value={newShot.focalLength}
                    onChange={(e) => setNewShot({ ...newShot, focalLength: e.target.value })}
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                    placeholder="e.g. 35mm Prime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Camera Move</label>
                  <select
                    value={newShot.cameraMovement}
                    onChange={(e) =>
                      setNewShot({
                        ...newShot,
                        cameraMovement: e.target.value as ShotItem['cameraMovement'],
                      })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-2.5 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Static">Static</option>
                    <option value="Handheld">Handheld</option>
                    <option value="Steadicam / Gimbal">Steadicam / Gimbal</option>
                    <option value="Dolly Track">Dolly Track</option>
                    <option value="Technocrane">Technocrane</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Shot Action / Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={newShot.description}
                  onChange={(e) => setNewShot({ ...newShot, description: e.target.value })}
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  placeholder="Describe framing, actor movement, emotional beat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Lighting Setup Notes
                  </label>
                  <input
                    type="text"
                    value={newShot.lightingSetup}
                    onChange={(e) => setNewShot({ ...newShot, lightingSetup: e.target.value })}
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                    placeholder="e.g. Aputure 600d softbox rim"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Estimated Setup (Mins)
                  </label>
                  <input
                    type="number"
                    value={newShot.setupTimeMinutes}
                    onChange={(e) =>
                      setNewShot({ ...newShot, setupTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222738]">
                <button
                  type="button"
                  onClick={() => setIsAddShotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0C0E14] text-[#94A3B8] text-xs font-medium hover:text-[#F8FAFC] border border-[#222738]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold"
                >
                  Save Shot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BUDGET ITEM */}
      {isAddBudgetOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0B0E]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#222738] rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222738]">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#34D399]" />
                <span>Add Budget Line Item</span>
              </h3>
              <button
                onClick={() => setIsAddBudgetOpen(false)}
                className="text-[#64748B] hover:text-[#F8FAFC] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  required
                  value={newBudgetItem.item}
                  onChange={(e) => setNewBudgetItem({ ...newBudgetItem, item: e.target.value })}
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  placeholder="e.g. 2nd AC / Loader, Grip Package Rental"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Category</label>
                <select
                  value={newBudgetItem.category}
                  onChange={(e) =>
                    setNewBudgetItem({
                      ...newBudgetItem,
                      category: e.target.value as BudgetItem['category'],
                    })
                  }
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Above-the-Line">Above-the-Line</option>
                  <option value="Camera & Grip Crew">Camera & Grip Crew</option>
                  <option value="Sound Dept">Sound Dept</option>
                  <option value="Equipment Package">Equipment Package</option>
                  <option value="Locations & Permits">Locations & Permits</option>
                  <option value="Post-Production">Post-Production</option>
                  <option value="Contingency">Contingency</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Rate ($)</label>
                  <input
                    type="number"
                    required
                    value={newBudgetItem.ratePerUnit}
                    onChange={(e) =>
                      setNewBudgetItem({ ...newBudgetItem, ratePerUnit: Number(e.target.value) })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Unit</label>
                  <select
                    value={newBudgetItem.unit}
                    onChange={(e) =>
                      setNewBudgetItem({
                        ...newBudgetItem,
                        unit: e.target.value as BudgetItem['unit'],
                      })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-2.5 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="day">day</option>
                    <option value="flat">flat</option>
                    <option value="item">item</option>
                    <option value="hr">hr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newBudgetItem.quantity}
                    onChange={(e) =>
                      setNewBudgetItem({ ...newBudgetItem, quantity: Number(e.target.value) })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222738]">
                <button
                  type="button"
                  onClick={() => setIsAddBudgetOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0C0E14] text-[#94A3B8] text-xs font-medium hover:text-[#F8FAFC] border border-[#222738]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT-READY CALL SHEET */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0B0E]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0C0E14] border border-[#222738] rounded-2xl max-w-3xl w-full p-8 shadow-2xl my-8 text-[#F8FAFC]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#222738]">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Export Call Sheet • Day {workspace.callSheet.shootDayNumber} of {workspace.callSheet.totalShootDays}
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-[#64748B] hover:text-[#F8FAFC] text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="border border-[#222738] rounded-2xl p-6 bg-[#12141C] space-y-4">
              <div className="text-center border-b border-[#222738] pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-[#F8FAFC]">{workspace.projectTitle}</h1>
                <p className="text-xs text-[#94A3B8] mt-1">
                  CALL SHEET • {workspace.callSheet.shootDate} • GENERAL CREW CALL: {workspace.callSheet.generalCallTime}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-[#94A3B8] uppercase">LOCATION</p>
                  <p className="font-semibold text-[#F8FAFC]">{workspace.callSheet.locationName}</p>
                  <p className="text-[#94A3B8]">{workspace.callSheet.locationAddress}</p>
                </div>
                <div>
                  <p className="font-bold text-[#94A3B8] uppercase">EMERGENCY HOSPITAL</p>
                  <p className="font-semibold text-[#F8FAFC]">{workspace.callSheet.nearestHospital}</p>
                  <p className="text-[#F87171] font-mono font-bold">Tel: {workspace.callSheet.hospitalPhone}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#94A3B8] uppercase text-xs mb-2">CREW DIRECTORY</p>
                <div className="border border-[#222738] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0C0E14] text-[#94A3B8] font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Role</th>
                        <th className="p-2.5">Call Time</th>
                        <th className="p-2.5">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222738]">
                      {workspace.callSheet.crewList.map((c) => (
                        <tr key={c.id}>
                          <td className="p-2.5 font-medium text-[#F8FAFC]">{c.name}</td>
                          <td className="p-2.5 text-[#34D399]">{c.role}</td>
                          <td className="p-2.5 font-mono font-bold text-[#38BDF8]">{c.callTime}</td>
                          <td className="p-2.5 font-mono text-[#CBD5E1]">{c.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#12141C] text-[#94A3B8] text-xs font-medium hover:text-[#F8FAFC] border border-[#222738]"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
