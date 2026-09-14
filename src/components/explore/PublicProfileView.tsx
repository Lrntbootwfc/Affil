import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  ShieldCheck,
  Send,
  ExternalLink,
  Layers,
  Camera,
  Film,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  Link as LinkIcon,
} from 'lucide-react';
import type { CreatorProfile, Project, WorkShowcase } from '../../types';
import { UserAvatar } from '../UserAvatar';
import { WorkCard } from './WorkCard';
import { ProjectCard } from './ProjectCard';
import {
  getProfileFromFirestore,
  fetchExploreFeedFromFirestore,
  createConnectionRequest,
} from '../../lib/firebase';

interface PublicProfileViewProps {
  creatorId: string;
  initialCreator?: CreatorProfile | null;
  currentUser: CreatorProfile | null;
  onBack: () => void;
  onViewWorkDetail: (work: WorkShowcase) => void;
  onViewProjectDetail: (project: Project) => void;
  isProfileComplete: boolean;
  onOpenGatedNotice: (actionName: string) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  creatorId,
  initialCreator,
  currentUser,
  onBack,
  onViewWorkDetail,
  onViewProjectDetail,
  isProfileComplete,
  onOpenGatedNotice,
}) => {
  const [creator, setCreator] = useState<CreatorProfile | null>(initialCreator || null);
  const [leadProjects, setLeadProjects] = useState<Project[]>([]);
  const [participatedProjects, setParticipatedProjects] = useState<Project[]>([]);
  const [works, setWorks] = useState<WorkShowcase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'works' | 'projects' | 'about' | 'gear'>('works');

  // Connect / Proposal modal state
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [connectMessage, setConnectMessage] = useState<string>('');
  const [isSubmittingConnect, setIsSubmittingConnect] = useState<boolean>(false);
  const [connectFeedback, setConnectFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getProfileFromFirestore(creatorId);
        if (!profile) {
          if (initialCreator && isMounted) {
            setCreator(initialCreator);
          } else if (isMounted) {
            throw new Error('Profile not found.');
          }
        } else if (isMounted) {
          setCreator(profile);
        }

        const feed = await fetchExploreFeedFromFirestore();
        if (!isMounted) return;

        const creatorWorks = (feed.featuredWorks || []).filter(
          (w) => w.creatorId === creatorId || (w.collaboratorIds || []).includes(creatorId)
        );
        const lead = (feed.projects || []).filter((p: any) => p.seekerId === creatorId);
        const participated = (feed.projects || []).filter(
          (p: any) => (p.collaboratorIds || []).includes(creatorId) && p.seekerId !== creatorId
        );

        setWorks(creatorWorks);
        setLeadProjects(lead);
        setParticipatedProjects(participated);

        if (creatorWorks.length > 0) setActiveTab('works');
        else if (lead.length > 0) setActiveTab('projects');
        else setActiveTab('about');
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve public profile.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPublicData();
    return () => {
      isMounted = false;
    };
  }, [creatorId]);

  const isViewingSelf = currentUser?.id === creatorId;

  const handleInitiateConnect = () => {
    if (isViewingSelf) return;

    if (!currentUser) {
      onOpenGatedNotice('connect with this creator');
      return;
    }

    if (!isProfileComplete) {
      onOpenGatedNotice('send a collaboration proposal');
      return;
    }

    setConnectMessage(
      `Hi ${creator?.name || 'there'}, I discovered your public portfolio on the platform and would love to collaborate with you on an upcoming production.`
    );
    setShowConnectModal(true);
  };

  const handleSendProposal = async () => {
    if (!creator || !currentUser?.id) return;
    setIsSubmittingConnect(true);
    setConnectFeedback(null);

    try {
      const { alreadyExists } = await createConnectionRequest({
        senderId: currentUser.id,
        recipientId: creator.id,
        message: connectMessage.trim(),
      });
      if (alreadyExists) {
        setConnectFeedback({
          type: 'info',
          message: `You already have a pending proposal with ${creator.name}.`,
        });
      } else {
        setConnectFeedback({
          type: 'success',
          message: `Proposal successfully delivered to ${creator.name}!`,
        });
      }
      setTimeout(() => {
        setShowConnectModal(false);
      }, 2000);
    } catch (err: any) {
      setConnectFeedback({
        type: 'error',
        message: err?.message || 'Network error submitting proposal.',
      });
    } finally {
      setIsSubmittingConnect(false);
    }
  };

  const allProjects = [...leadProjects, ...participatedProjects];

  return (
    <div id={`public-profile-view-${creatorId}`} className="min-h-screen pb-20 bg-[var(--bg-primary)]">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--card-border)] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            id="back-to-explore-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Discovery</span>
          </button>

          {creator && !isViewingSelf && (
            <button
              id={`header-connect-btn-${creator.id}`}
              onClick={handleInitiateConnect}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[var(--accent-amber)] hover:opacity-90 text-[var(--nav-item-active-text,#181614)] shadow-md inline-flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect / Collaborate</span>
            </button>
          )}
        </div>
      </div>

      {loading && !creator ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-[var(--accent-amber)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading public profile & portfolio...</p>
        </div>
      ) : error && !creator ? (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">Profile Not Found</h2>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]"
          >
            Return to Explore
          </button>
        </div>
      ) : creator ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
          {/* Profile Header Hero Card */}
          <div className="card-warm-white rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-xl relative">
            {/* Top Cover Banner */}
            <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-black/80 overflow-hidden">
              {creator.coverImageUrl ? (
                <img
                  src={creator.coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-16 h-16 text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg,#1e1c19)] via-transparent to-transparent" />
            </div>

            {/* Profile Avatar & Details Header */}
            <div className="px-6 sm:px-10 pb-8 -mt-16 sm:-mt-20 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                  <div className="relative">
                    <UserAvatar
                      name={creator.name}
                      avatarUrl={creator.avatarUrl}
                      size="xl"
                      className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-[var(--card-bg,#1e1c19)] shadow-2xl rounded-3xl"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        {creator.name}
                      </h1>
                      <span className="text-xs text-[var(--text-muted)] font-mono">@{creator.username}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-3 py-1 rounded-full font-bold bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] border border-[var(--card-inner-border)]">
                        {creator.primaryRole}
                      </span>
                      {creator.secondaryRoles && creator.secondaryRoles.map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-secondary)]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                {!isViewingSelf && (
                  <div className="w-full sm:w-auto pt-2 sm:pt-0">
                    <button
                      id={`connect-profile-btn-${creator.id}`}
                      onClick={handleInitiateConnect}
                      className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold bg-[var(--accent-amber)] hover:opacity-90 text-[var(--nav-item-active-text,#181614)] shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Connect / Collaborate</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Info Bar */}
              <div className="mt-6 pt-6 border-t border-[var(--card-border)]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Location</p>
                  <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                    <span>{creator.location || 'Remote'}</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Verified Rate</p>
                  <p className="font-mono font-bold text-[var(--accent-amber)] mt-0.5">
                    ₹{(creator.dayRateUsd || 0).toLocaleString('en-IN')}/day
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Public Showcases</p>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                    {works.length} {works.length === 1 ? 'Showcase' : 'Showcases'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Collaborative Projects</p>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                    {allProjects.length} {allProjects.length === 1 ? 'Project' : 'Projects'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('works')}
              className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'works'
                  ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-inner-bg)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Public Works ({works.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'projects'
                  ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-inner-bg)]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Projects & Briefs ({allProjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'about'
                  ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-inner-bg)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Craft Statement & Bio</span>
            </button>

            {creator.gearItems && creator.gearItems.length > 0 && (
              <button
                onClick={() => setActiveTab('gear')}
                className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'gear'
                    ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-inner-bg)]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Verified Gear ({creator.gearItems.length})</span>
              </button>
            )}
          </div>

          {/* TAB CONTENT */}
          {/* 1. PUBLIC WORKS */}
          {activeTab === 'works' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">Public Work Showcases</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Verified reels, films, and media created or co-produced by {creator.name}.</p>
                </div>
              </div>

              {works.length === 0 ? (
                <div className="card-warm-white p-12 rounded-3xl border border-[var(--card-border)] text-center space-y-3">
                  <Layers className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">No public showcases published yet.</p>
                  <p className="text-xs text-[var(--text-secondary)]">Check back as {creator.name} updates their public media gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {works.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onOpenDetail={() => onViewWorkDetail(work)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. PUBLIC PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Lead Projects */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">Lead Projects & Briefs</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Productions originated or helmed by {creator.name}.</p>
                </div>

                {leadProjects.length === 0 ? (
                  <div className="card-warm-white p-8 rounded-3xl border border-[var(--card-border)] text-center text-xs text-[var(--text-muted)]">
                    No active briefs created by this creator at this time.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenDetail={() => onViewProjectDetail(project)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Participated Projects */}
              {participatedProjects.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[var(--card-border)]/60">
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">Collaborative Productions</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Projects where {creator.name} served as a key department collaborator.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {participatedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenDetail={() => onViewProjectDetail(project)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ABOUT & STATEMENT */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Statement Card */}
                <div className="card-warm-white p-6 sm:p-8 rounded-3xl border border-[var(--card-border)] space-y-4">
                  <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">Craft & Background Statement</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {creator.bio || `${creator.name} is an active creative professional specializing in ${creator.primaryRole} for commercial and narrative productions.`}
                  </p>
                </div>

                {/* Seeking Collaborator Roles */}
                {creator.seekingRoles && creator.seekingRoles.length > 0 && (
                  <div className="card-warm-white p-6 sm:p-8 rounded-3xl border border-[var(--card-border)] space-y-3">
                    <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">Actively Seeking Collaboration With:</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Roles and departments {creator.name} is looking to partner with on upcoming productions:</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {creator.seekingRoles.map((role) => (
                        <span
                          key={role}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Specializations & Skills */}
                <div className="card-warm-white p-6 rounded-3xl border border-[var(--card-border)] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Craft Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[creator.primaryRole, ...(creator.secondaryRoles || []), ...(creator.specialtyTags || [])].map(
                      (item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* External Portfolios / Links */}
                {creator.workLinks && creator.workLinks.length > 0 && (
                  <div className="card-warm-white p-6 rounded-3xl border border-[var(--card-border)] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Verified Portfolios</h4>
                    <div className="space-y-2">
                      {creator.workLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between group hover:border-[var(--accent-amber)] transition-colors text-xs font-medium text-[var(--text-primary)]"
                        >
                          <span className="truncate">{link.title || link.platform}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-amber)] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. VERIFIED GEAR */}
          {activeTab === 'gear' && creator.gearItems && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">Verified Production Kit & Gear</h2>
                <p className="text-xs text-[var(--text-secondary)]">Equipment owned or accessible by {creator.name} for shoot days.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creator.gearItems.map((item) => (
                  <div
                    key={item.id}
                    className="card-warm-white p-5 rounded-3xl border border-[var(--card-border)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--card-inner-bg)] text-[var(--text-muted)] border border-[var(--card-inner-border)]">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--accent-amber)] font-bold capitalize">
                        {item.ownershipStatus}
                      </span>
                    </div>

                    <h4 className="font-editorial text-sm font-bold text-[var(--text-primary)]">{item.equipmentName}</h4>
                    {item.specsNotes && (
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.specsNotes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Connect / Proposal Modal */}
      {showConnectModal && creator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card-warm-white w-full max-w-lg rounded-3xl border border-[var(--card-border)] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={creator.name} avatarUrl={creator.avatarUrl} size="sm" />
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                    Collaborate with {creator.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {creator.primaryRole} • ₹{(creator.dayRateUsd || 0).toLocaleString('en-IN')}/day
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {connectFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                  connectFeedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                    : connectFeedback.type === 'info'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'bg-red-500/10 text-red-500 border border-red-500/30'
                }`}
              >
                {connectFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{connectFeedback.message}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Proposal Message / Project Context:
              </label>
              <textarea
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)]"
                placeholder="Briefly describe your production timeline, dates, or what you'd love to collaborate on..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                disabled={isSubmittingConnect}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-send-proposal-btn"
                onClick={handleSendProposal}
                disabled={isSubmittingConnect || !connectMessage.trim()}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[var(--accent-amber)] hover:opacity-90 text-[var(--nav-item-active-text,#181614)] shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingConnect ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Proposal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
