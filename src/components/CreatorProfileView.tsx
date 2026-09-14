import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  MapPin,
  Sparkles,
  Layers,
  MessageSquare,
  DollarSign,
  FileVideo,
  Check
} from 'lucide-react';
import type {
  CreatorProfile,
  GearItem,
  PortfolioItem,
  CommunicationStyle,
  OwnershipStatus,
  MediaType
} from '../types';

interface CreatorProfileViewProps {
  profile: CreatorProfile;
  onSaveProfile: (updated: Partial<CreatorProfile>) => Promise<void>;
  onNavigateToMatches: () => void;
}

const COMMON_ROLES = [
  'Cinematographer',
  'Director of Photography',
  'Director',
  'Location Sound Recordist',
  'Gaffer',
  'Camera Operator',
  'Colorist',
  'First Assistant Camera (1st AC)',
  'Key Grip',
  'Sound Designer',
  'Drone Operator',
  'Production Designer',
  'Producer',
];

const BUDGET_TIERS = [
  { id: 'micro_budget', label: 'Micro-budget (<$5k)' },
  { id: 'indie', label: 'Indie ($5k - $25k)' },
  { id: 'commercial', label: 'Commercial ($25k - $100k)' },
  { id: 'studio', label: 'Studio ($100k+)' },
];

const COMM_STYLES: { id: CommunicationStyle; title: string; desc: string }[] = [
  {
    id: 'fast_decider',
    title: 'Fast Decider',
    desc: 'High velocity, concise syncs, immediate feedback, trusts intuition.',
  },
  {
    id: 'detail_reviewer',
    title: 'Detail Reviewer',
    desc: 'Thorough lookbook analysis, line-item precision, tech specs rigor.',
  },
  {
    id: 'autonomous_executor',
    title: 'Autonomous Executor',
    desc: 'Give clear creative goals and let them execute without micromanagement.',
  },
  {
    id: 'collaborative_brainstormer',
    title: 'Collaborative Brainstormer',
    desc: 'Loves iterative shot-listing, live creative jamming, and shared look development.',
  },
];

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  profile,
  onSaveProfile,
  onNavigateToMatches,
}) => {
  const [formData, setFormData] = useState<CreatorProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Smart Gear Form
  const [newGearName, setNewGearName] = useState('');
  const [newGearCategory, setNewGearCategory] = useState('Camera');
  const [newGearOwnership, setNewGearOwnership] = useState<OwnershipStatus>('owned');
  const [newGearNotes, setNewGearNotes] = useState('');

  // Portfolio Uploader State
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortTags, setNewPortTags] = useState('');
  const [newPortMediaType] = useState<MediaType>('video');

  // Sync state if external profile switches
  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile.id]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGear = () => {
    if (!newGearName.trim()) return;
    const item: GearItem = {
      id: `gear_${Date.now()}`,
      equipmentName: newGearName.trim(),
      category: newGearCategory,
      ownershipStatus: newGearOwnership,
      specsNotes: newGearNotes.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      gearItems: [item, ...prev.gearItems],
    }));
    setNewGearName('');
    setNewGearNotes('');
  };

  const handleRemoveGear = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      gearItems: prev.gearItems.filter((g) => g.id !== id),
    }));
  };

  const handleAddPortfolioLink = () => {
    if (!newPortTitle.trim() || !newPortUrl.trim()) return;
    const tags = newPortTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const item: PortfolioItem = {
      id: `port_${Date.now()}`,
      title: newPortTitle.trim(),
      linkUrl: newPortUrl.trim(),
      mediaType: newPortMediaType,
      tags: tags.length > 0 ? tags : ['Cinematic', 'Portfolio'],
    };
    setFormData((prev) => ({
      ...prev,
      portfolios: [item, ...prev.portfolios],
    }));
    setNewPortTitle('');
    setNewPortUrl('');
    setNewPortTags('');
  };

  const handleRemovePortfolio = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolios: prev.portfolios.filter((p) => p.id !== id),
    }));
  };

  const toggleBudgetTier = (tierId: string) => {
    setFormData((prev) => {
      const current = prev.pastBudgetTiers || [];
      const updated = current.includes(tierId)
        ? current.filter((t) => t !== tierId)
        : [...current, tierId];
      return { ...prev, pastBudgetTiers: updated };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#F8FAFC]">
      {/* View Header with Cover Banner */}
      <div className="bg-[#12141C] rounded-2xl border border-[#222738] shadow-2xl overflow-hidden">
        {formData.coverImageUrl ? (
          <div className="h-36 sm:h-44 w-full relative overflow-hidden">
            <img
              src={formData.coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-black/40" />
          </div>
        ) : (
          <div className="h-4 w-full bg-[#1A1E2C]" />
        )}

        <div className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${formData.coverImageUrl ? '-mt-10 sm:-mt-12 relative z-10' : ''}`}>
          <div className="flex items-center gap-4">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt={formData.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#8B5CF6] shadow-lg bg-[#0C0E14] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#8B5CF6] text-white flex flex-col items-center justify-center font-black border-2 border-[#8B5CF6] shadow-lg shrink-0">
                <span className="text-2xl font-black">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                </span>
                <span className="text-[7px] font-mono opacity-80">BLANK</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  {formData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40">
                  {formData.primaryRole}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Configure your verified gear kit, travel radius, day rate, and communication profile for precision bidirectional matching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-save-profile-top"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#8B5CF6]/20 border border-[#A78BFA]/40 cursor-pointer"
            >
              {isSaving ? (
                <span className="animate-pulse">Saving Profile...</span>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#34D399]" />
                  <span>Profile Synced!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Save Profile</span>
                </>
              )}
            </button>

            <button
              id="btn-find-matches-cta"
              onClick={onNavigateToMatches}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C0E14] hover:bg-[#1A1E2C] text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#222738] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <span>View Match Feed</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roles, Location, Rate, Comm Style */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Identity (Profile & Cover Image) */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-[#8B5CF6] font-semibold text-sm">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#8B5CF6]" />
                <h2>Visual Identity (Profile Photo &amp; Cover Banner)</h2>
              </div>
              <span className="text-[11px] text-[#64748B] italic">Optional (leave blank if empty)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Profile Picture URL
                  </label>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      Clear (Blank)
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://... (or leave empty for blank)"
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Cover Banner Image URL
                  </label>
                  {formData.coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      Clear (Blank)
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.coverImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="https://... (or leave empty for blank)"
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>
          </div>
          {/* Section 1: Core Roles & Travel Constraints */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#8B5CF6] font-semibold text-sm">
              <Camera className="w-4 h-4 text-[#8B5CF6]" />
              <h2>Core Domain & Operational Constraints</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Primary Role
                </label>
                <select
                  id="input-primary-role"
                  value={formData.primaryRole}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryRole: e.target.value })
                  }
                  className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                >
                  {COMMON_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Base Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    id="input-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Los Angeles, CA"
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            </div>

            {/* Travel Radius Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Travel Radius Tolerance
                </label>
                <span className="text-xs font-mono font-bold text-[#C4B5FD] bg-[#8B5CF6]/20 px-2.5 py-1 rounded-md border border-[#8B5CF6]/40">
                  {formData.travelRadiusMiles} miles
                </span>
              </div>
              <input
                id="slider-travel-radius"
                type="range"
                min="10"
                max="500"
                step="10"
                value={formData.travelRadiusMiles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    travelRadiusMiles: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-[#0C0E14] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>Local Only (10mi)</span>
                <span>Regional (100mi)</span>
                <span>Nationwide / Fly-Out (500mi)</span>
              </div>
            </div>

            {/* Bio & Creative Intent */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Professional Bio & Aesthetic Focus
              </label>
              <textarea
                id="input-bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Cinematographer obsessed with low-light anamorphic texture and fast lighting setups..."
                className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Section 2: Rate & Budget Alignment */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#34D399] font-semibold text-sm">
              <span className="text-sm font-bold text-[#34D399]">₹</span>
              <h2>Rate Alignment & Past Production Budgets (₹ INR)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Standard Day Rate (₹ INR)
                </label>
                <div className="relative">
                  <span className="text-[#64748B] text-sm absolute left-3.5 top-2.5 font-mono">₹</span>
                  <input
                    id="input-day-rate"
                    type="number"
                    value={formData.dayRateUsd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dayRateUsd: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#0C0E14] border border-[#222738] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#F8FAFC] font-mono font-bold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Baseline 10-hour day rate including standard kit allowance in INR.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Past Project Budget Tiers
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_TIERS.map((tier) => {
                    const isSelected = formData.pastBudgetTiers?.includes(tier.id);
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => toggleBudgetTier(tier.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-white font-bold border border-[#A78BFA]/50 shadow-sm'
                            : 'bg-[#0C0E14] text-[#94A3B8] border border-[#222738] hover:border-[#8B5CF6]/50'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Communication Style */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#38BDF8] font-semibold text-sm">
              <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
              <h2>Collaboration & Communication Style</h2>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Our synergy engine matches compatible working styles to prevent friction on set.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMM_STYLES.map((style) => {
                const isSelected = formData.communicationStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() =>
                      setFormData({ ...formData, communicationStyle: style.id })
                    }
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-sm'
                        : 'bg-[#0C0E14] border-[#222738] text-[#CBD5E1] hover:border-[#8B5CF6]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{style.title}</h4>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{style.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Gear Inventory & Portfolio Assets */}
        <div className="space-y-6">
          {/* Smart Gear Inventory */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#8B5CF6] font-semibold text-sm">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <h2>Verified Gear Package</h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">
                {formData.gearItems.length} items
              </span>
            </div>

            <div className="bg-[#0C0E14] p-4 rounded-2xl border border-[#222738] space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#94A3B8] block mb-1">
                    Category
                  </label>
                  <select
                    value={newGearCategory}
                    onChange={(e) => setNewGearCategory(e.target.value)}
                    className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
                  >
                    <option value="Camera">Camera</option>
                    <option value="Lenses">Lenses</option>
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Grip">Grip & Rigging</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#94A3B8] block mb-1">
                    Ownership
                  </label>
                  <select
                    value={newGearOwnership}
                    onChange={(e) =>
                      setNewGearOwnership(e.target.value as OwnershipStatus)
                    }
                    className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
                  >
                    <option value="owned">Owned Kit</option>
                    <option value="rented">Preferred Rental</option>
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={newGearName}
                onChange={(e) => setNewGearName(e.target.value)}
                placeholder="e.g. Sony FX6 Cinema Line Camera + GM Zoom Package"
                className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569]"
              />

              <input
                type="text"
                value={newGearNotes}
                onChange={(e) => setNewGearNotes(e.target.value)}
                placeholder="Specs / accessories (e.g. Tilta cage, V-Mount batteries)"
                className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#475569]"
              />

              <button
                type="button"
                onClick={handleAddGear}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-semibold transition-colors shadow border border-[#A78BFA]/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Equipment to Inventory</span>
              </button>
            </div>

            {/* Gear Items List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {formData.gearItems.map((gear) => (
                <div
                  key={gear.id}
                  className="p-3 bg-[#0C0E14] rounded-xl border border-[#222738] flex items-start justify-between gap-2 group hover:border-[#8B5CF6]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#F8FAFC]">
                        {gear.equipmentName}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                          gear.ownershipStatus === 'owned'
                            ? 'bg-[#8B5CF6]/25 text-[#C4B5FD] border border-[#8B5CF6]/40'
                            : 'bg-[#12141C] text-[#94A3B8]'
                        }`}
                      >
                        {gear.ownershipStatus}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                      {gear.category} {gear.specsNotes ? `• ${gear.specsNotes}` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveGear(gear.id)}
                    className="text-[#64748B] hover:text-[#F87171] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links & Reels */}
          <div className="bg-[#12141C] rounded-2xl p-6 border border-[#222738] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#38BDF8] font-semibold text-sm">
                <FileVideo className="w-4 h-4 text-[#38BDF8]" />
                <h2>Portfolio & Directing Reels</h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">
                {formData.portfolios.length} items
              </span>
            </div>

            <div className="bg-[#0C0E14] p-4 rounded-2xl border border-[#222738] space-y-3">
              <input
                type="text"
                value={newPortTitle}
                onChange={(e) => setNewPortTitle(e.target.value)}
                placeholder="Reel Title (e.g. Narrative Reel 2026: Portraits)"
                className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569]"
              />
              <input
                type="url"
                value={newPortUrl}
                onChange={(e) => setNewPortUrl(e.target.value)}
                placeholder="https://vimeo.com/... or https://youtube.com/..."
                className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] font-mono"
              />
              <input
                type="text"
                value={newPortTags}
                onChange={(e) => setNewPortTags(e.target.value)}
                placeholder="Tags comma separated (e.g. Narrative, Sony FX6, Drama)"
                className="w-full bg-[#12141C] border border-[#222738] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#475569]"
              />
              <button
                type="button"
                onClick={handleAddPortfolioLink}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-semibold transition-colors shadow border border-[#A78BFA]/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Portfolio Link</span>
              </button>
            </div>

            {/* Portfolio Items List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {formData.portfolios.map((port) => (
                <div
                  key={port.id}
                  className="p-3 bg-[#0C0E14] rounded-xl border border-[#222738] flex items-start justify-between gap-2 group hover:border-[#8B5CF6]"
                >
                  <div>
                    <span className="text-xs font-medium text-[#F8FAFC] block">
                      {port.title}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {port.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#12141C] text-[#94A3B8] border border-[#222738]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePortfolio(port.id)}
                    className="text-[#64748B] hover:text-[#F87171] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
