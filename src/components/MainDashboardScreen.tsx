import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Send,
  X,
  Youtube,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Camera,
  Play,
  Share2,
  ShieldCheck,
  UserCheck,
  Compass,
} from 'lucide-react';
import type { CreatorProfile, WorkLink } from '../types';
import { UserAvatar } from './UserAvatar';
import { ImagePickerModal } from './ImagePickerModal';
import { CreatorCard } from './explore/CreatorCard';
import {
  updateProfileInFirestore,
  fetchExploreFeedFromFirestore,
  createConnectionRequest,
  getConnectionsForUser,
  respondToConnection,
  type ConnectionRequest,
} from '../lib/firebase';

interface MainDashboardScreenProps {
  currentUser: CreatorProfile;
  onEditProfile: () => void;
  onUpdateCurrentUser?: (updated: CreatorProfile) => void;
  onNavigateToExplore?: () => void;
}

export const MainDashboardScreen: React.FC<MainDashboardScreenProps> = ({
  currentUser,
  onEditProfile,
  onUpdateCurrentUser,
  onNavigateToExplore,
}) => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'matched' | 'all' | string>('matched');

  // Quick Photo & Banner Pickers
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);

  // Selected Creator for Detail Modal
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  // Connect / Proposal Modal
  const [connectCreator, setConnectCreator] = useState<CreatorProfile | null>(null);
  const [proposalMessage, setProposalMessage] = useState('');
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Quick Avatar/Cover Update — persist to Firestore
  const handleQuickUpdateAvatar = async (newUrl: string) => {
    const updated: CreatorProfile = { ...currentUser, avatarUrl: newUrl };
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updated);
    }
    try {
      await updateProfileInFirestore(updated);
    } catch (err) {
      console.error('Failed to sync avatar update to Firestore:', err);
    }
  };

  const handleQuickUpdateCover = async (newUrl: string) => {
    const updated: CreatorProfile = { ...currentUser, coverImageUrl: newUrl };
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(updated);
    }
    try {
      await updateProfileInFirestore(updated);
    } catch (err) {
      console.error('Failed to sync cover update to Firestore:', err);
    }
  };

  const [incomingConnections, setIncomingConnections] = useState<ConnectionRequest[]>([]);
  const [isRespondingId, setIsRespondingId] = useState<string | null>(null);

  // Fetch Creators + incoming connections from Firestore
  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const feed = await fetchExploreFeedFromFirestore({ userId: currentUser.id });
      setCreators(feed.suggestedCreators || []);
      const conns = await getConnectionsForUser(currentUser.id);
      setIncomingConnections(conns.filter((c) => c.recipientId === currentUser.id && c.status === 'pending'));
    } catch (err) {
      console.error('Failed to load creators from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [currentUser.id]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Send Connect Proposal → Firestore
  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectCreator) return;

    setIsSendingProposal(true);
    try {
      const { alreadyExists } = await createConnectionRequest({
        senderId: currentUser.id,
        recipientId: connectCreator.id,
        message: proposalMessage,
      });
      if (alreadyExists) {
        showToast(`You already sent a proposal to ${connectCreator.name}.`);
      } else {
        showToast(`Proposal sent successfully to ${connectCreator.name}!`);
      }
      setConnectCreator(null);
      setProposalMessage('');
    } catch (err: any) {
      showToast(err?.message || 'Error sending proposal. Please try again.');
    } finally {
      setIsSendingProposal(false);
    }
  };

  const handleRespondConnection = async (connId: string, status: 'accepted' | 'declined') => {
    setIsRespondingId(connId);
    try {
      await respondToConnection(connId, status, currentUser.id);
      setIncomingConnections((prev) => prev.filter((c) => c.id !== connId));
      showToast(status === 'accepted' ? 'Connection accepted.' : 'Connection declined.');
    } catch (err: any) {
      showToast(err?.message || 'Could not update connection.');
    } finally {
      setIsRespondingId(null);
    }
  };

  // Filter Logic:
  // 1. Matched For You: matches creators whose primaryRole or secondaryRoles are in currentUser.seekingRoles
  // 2. All: all creators
  // 3. Specific Role: e.g. "Cinematographer"
  const userSeekingSet = new Set((currentUser.seekingRoles || []).map((r) => r.toLowerCase()));

  const filteredCreators = creators.filter((creator) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        creator.name.toLowerCase().includes(q) ||
        creator.username.toLowerCase().includes(q) ||
        creator.primaryRole.toLowerCase().includes(q) ||
        creator.location.toLowerCase().includes(q) ||
        (creator.bio && creator.bio.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 2. Tab Filter
    if (activeFilterTab === 'matched') {
      if (userSeekingSet.size === 0) return true;
      const pRole = creator.primaryRole.toLowerCase();
      const sRoles = (creator.secondaryRoles || []).map((r) => r.toLowerCase());
      return userSeekingSet.has(pRole) || sRoles.some((r) => userSeekingSet.has(r));
    } else if (activeFilterTab === 'all') {
      return true;
    } else {
      // Specific role filter
      const tabLower = activeFilterTab.toLowerCase();
      return (
        creator.primaryRole.toLowerCase().includes(tabLower) ||
        (creator.secondaryRoles || []).some((r) => r.toLowerCase().includes(tabLower))
      );
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-[var(--accent-amber)] selection:text-white pb-28">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--card-inner-bg)] text-[var(--text-primary)] border border-[var(--accent-amber)] rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent-amber)] shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Editorial Profile Dossier Header */}
      <div className="card-warm-white rounded-3xl overflow-hidden mb-8 border border-[var(--card-border)] relative">
        <div className="px-6 py-2.5 border-b border-[var(--card-border)] bg-[var(--card-inner-bg)]/40 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--text-muted)] uppercase tracking-wider">CREATIVE IDENTITY // ACTIVE PRODUCTION PASSPORT</span>
          </div>
          <span className="text-[var(--accent-amber)] font-semibold uppercase tracking-wider hidden sm:inline">VERIFIED ARTIST PROFILE</span>
        </div>

        {currentUser.coverImageUrl && (
          <div className="h-32 sm:h-40 w-full relative overflow-hidden">
            <img
              src={currentUser.coverImageUrl}
              alt="Your Profile Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-black/30" />
          </div>
        )}
        
        <div className={`p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${currentUser.coverImageUrl ? '-mt-10 sm:-mt-12 relative z-10' : ''}`}>
          <div className="flex items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsAvatarPickerOpen(true)}
              title="Click to edit profile picture (Camera, Gallery, or Monogram)"
            >
              <UserAvatar
                name={currentUser.name}
                avatarUrl={currentUser.avatarUrl}
                size="xl"
                className="shadow-xl ring-4 ring-[var(--card-bg)]"
              />
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer">
                <Camera className="w-4 h-4 text-white" />
                <span>Change</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-mono text-[var(--accent-amber)]">
                  @{currentUser.username}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] border border-[var(--card-inner-border)]">
                  Offering: {currentUser.primaryRole}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  {currentUser.location || 'Mumbai, Maharashtra'}
                </span>
                {currentUser.dayRateUsd > 0 && (
                  <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
                    ₹{currentUser.dayRateUsd.toLocaleString('en-IN')}/day
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Seeking Summary & Edit Profile CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-[var(--card-inner-bg)] p-3 rounded-2xl border border-[var(--card-inner-border)] text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                You are currently seeking:
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(currentUser.seekingRoles || []).slice(0, 3).map((r) => (
                  <span
                    key={r}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-primary)]"
                  >
                    {r}
                  </span>
                ))}
                {(currentUser.seekingRoles || []).length > 3 && (
                  <span className="text-[10px] text-[var(--text-muted)] pt-0.5 font-mono">
                    +{(currentUser.seekingRoles || []).length - 3} more
                  </span>
                )}
              </div>
            </div>

            {onNavigateToExplore && (
              <button
                id="dashboard-explore-cta"
                onClick={onNavigateToExplore}
                className="px-4 py-3 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] text-[var(--text-primary)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span>Explore Work &amp; Guilds</span>
              </button>
            )}

            <button
              onClick={onEditProfile}
              className="amber-pill-btn px-5 py-3 rounded-full text-xs font-bold shadow-md cursor-pointer shrink-0"
            >
              Edit Profile &amp; Photos
            </button>
          </div>
        </div>
      </div>

      {/* Incoming connection requests (real Firestore) */}
      {incomingConnections.length > 0 && (
        <div className="mb-8 card-warm-white rounded-3xl border border-[var(--card-border)] p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--accent-amber)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Connection Requests ({incomingConnections.length})
            </h3>
          </div>
          <ul className="space-y-3">
            {incomingConnections.map((conn) => (
              <li
                key={conn.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--text-primary)] font-medium line-clamp-2">
                    {conn.message || 'Wants to connect with you'}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                    From: {conn.senderId.slice(0, 12)}…
                    {conn.projectId ? ` · Project ${conn.projectId.slice(0, 8)}` : ''}
                    {conn.taskId ? ` · Task ${conn.taskId.slice(0, 8)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isRespondingId === conn.id}
                    onClick={() => handleRespondConnection(conn.id, 'declined')}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-[var(--card-inner-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    disabled={isRespondingId === conn.id}
                    onClick={() => handleRespondConnection(conn.id, 'accepted')}
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[var(--accent-amber)] text-[#181614] cursor-pointer disabled:opacity-50"
                  >
                    {isRespondingId === conn.id ? '…' : 'Accept'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Section Header: Relevant People / Matches */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="editorial-kicker">
              <span>DISCOVERY &amp; MATCHES</span>
            </div>
            <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)] mt-1">
              Relevant People &amp; Creators
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Showing creators prioritized by your seeking preferences: {currentUser.seekingRoles?.join(', ') || 'All Roles'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, gear, or name..."
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-amber)]"
            />
          </div>
        </div>

        {/* Dynamic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          
          {/* Matched For You */}
          <button
            onClick={() => setActiveFilterTab('matched')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilterTab === 'matched'
                ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] shadow-md'
                : 'bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            <span>Matched For You ({currentUser.seekingRoles?.length || 0} Roles)</span>
          </button>

          {/* All Creators */}
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilterTab === 'all'
                ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] shadow-md'
                : 'bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)]'
            }`}
          >
            All Creators ({creators.length})
          </button>

          {/* Individual Seeking Role Quick Filter Chips */}
          {(currentUser.seekingRoles || []).map((role) => (
            <button
              key={role}
              onClick={() => setActiveFilterTab(role)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilterTab === role
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] shadow-md font-bold'
                  : 'bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Creator Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card-warm-white rounded-3xl p-6 space-y-4 animate-pulse border border-[var(--card-border)] h-80"
              />
            ))}
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="card-warm-white rounded-3xl p-12 text-center space-y-4 border border-[var(--card-border)]">
            <UserCheck className="w-12 h-12 text-[#E58B13] mx-auto opacity-70" />
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              No matching creators found
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              Try switching your filter tab to "All Creators" or adding more collaborator roles in your profile setup.
            </p>
            <button
              onClick={() => setActiveFilterTab('all')}
              className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
            >
              View All Creators
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => {
              const isDirectMatch = userSeekingSet.has(creator.primaryRole.toLowerCase());

              return (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  matchScore={isDirectMatch ? 96 : undefined}
                  onOpenDetail={setSelectedCreator}
                  onConnect={(c) => {
                    setConnectCreator(c);
                    setProposalMessage(
                      `Hi ${c.name}, I am a ${currentUser.primaryRole} looking to collaborate on an upcoming project.`
                    );
                  }}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* Creator Detail Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-warm-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[var(--card-border)] relative max-h-[90vh] overflow-y-auto overflow-x-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCreator(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 cursor-pointer backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cover Banner in Modal */}
            {selectedCreator.coverImageUrl ? (
              <div className="h-44 w-full relative overflow-hidden bg-[var(--card-border)]">
                <img
                  src={selectedCreator.coverImageUrl}
                  alt={`${selectedCreator.name} banner`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              </div>
            ) : (
              <div className="h-16 w-full bg-[var(--card-inner-border)]" />
            )}

            <div className={`p-6 sm:p-8 pt-0 ${selectedCreator.coverImageUrl ? '-mt-12 relative z-10' : 'pt-6'}`}>
              {/* Profile Header */}
              <div className="flex items-end gap-4 pb-6 border-b border-[var(--card-border)]">
                <UserAvatar
                  name={selectedCreator.name}
                  avatarUrl={selectedCreator.avatarUrl}
                  size="xl"
                  className="shrink-0 ring-4 ring-[var(--card-bg)] shadow-xl"
                />
                <div className="space-y-1">
                  <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                    {selectedCreator.name}
                  </h3>
                  <p className="text-xs font-mono text-[var(--accent-amber)]">
                    @{selectedCreator.username}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] border border-[var(--card-inner-border)]">
                      {selectedCreator.primaryRole}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {selectedCreator.location}
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      ₹{(selectedCreator.dayRateUsd || 25000).toLocaleString('en-IN')}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="py-4 border-b border-[var(--card-border)] space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  About &amp; Experience
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedCreator.bio}
                </p>
              </div>

              {/* Seeking Roles */}
              {selectedCreator.seekingRoles && selectedCreator.seekingRoles.length > 0 && (
                <div className="py-4 border-b border-[var(--card-border)] space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Collaborator Roles They Look For:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCreator.seekingRoles.map((r) => (
                      <span
                        key={r}
                        className="px-2.5 py-1 rounded-full text-xs bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gear Inventory */}
              {selectedCreator.gearItems && selectedCreator.gearItems.length > 0 && (
                <div className="py-4 border-b border-[var(--card-border)] space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                    <span>Verified Gear Packages</span>
                  </p>
                  <div className="space-y-1.5">
                    {selectedCreator.gearItems.map((gear) => (
                      <div
                        key={gear.id}
                        className="p-2.5 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{gear.equipmentName}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{gear.specsNotes}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border border-[var(--accent-amber)]/30">
                          {gear.ownershipStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const target = selectedCreator;
                    setSelectedCreator(null);
                    setConnectCreator(target);
                    setProposalMessage(
                      `Hi ${target.name}, I am a ${currentUser.primaryRole} looking to collaborate on an upcoming project.`
                    );
                  }}
                  className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Collaboration Proposal</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Connect / Send Proposal Modal */}
      {connectCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-warm-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--card-border)] relative">
            
            <button
              onClick={() => setConnectCreator(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--card-inner-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-[var(--card-border)]">
              <UserAvatar
                name={connectCreator.name}
                avatarUrl={connectCreator.avatarUrl}
                size="md"
                className="shrink-0"
              />
              <div>
                <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  Connect with {connectCreator.name}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {connectCreator.primaryRole} • ₹{(connectCreator.dayRateUsd || 25000).toLocaleString('en-IN')}/day
                </p>
              </div>
            </div>

            <form onSubmit={handleSendProposal} className="py-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Collaboration Proposal Message
                </label>
                <textarea
                  rows={4}
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="Share details about the shoot dates, project genre, or role you want to discuss..."
                  required
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl p-3 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-amber)] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConnectCreator(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSendingProposal}
                  className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSendingProposal ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Image Picker Modal for Current User's Profile Picture */}
      <ImagePickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        title="Edit Profile Picture"
        subtitle="Take a photo with camera, choose from device gallery, or switch to letter monogram"
        currentImageUrl={currentUser.avatarUrl}
        userName={currentUser.name}
        isBanner={false}
        initialTab="camera"
        onImageSelected={(url) => handleQuickUpdateAvatar(url)}
      />

      {/* Image Picker Modal for Current User's Cover Banner */}
      <ImagePickerModal
        isOpen={isCoverPickerOpen}
        onClose={() => setIsCoverPickerOpen(false)}
        title="Edit Cover Banner"
        subtitle="Capture or select a panoramic banner image for your dashboard"
        currentImageUrl={currentUser.coverImageUrl}
        userName={currentUser.name}
        isBanner={true}
        initialTab="gallery"
        onImageSelected={(url) => handleQuickUpdateCover(url)}
      />

    </div>
  );
};
