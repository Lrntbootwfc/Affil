import React, { useState, useEffect } from 'react';
import {
  Camera,
  DollarSign,
  MapPin,
  Sparkles,
  Layers,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Send,
  Sliders,
  Calendar,
  Share2,
  Copy,
  Check,
  Radio,
  FileCheck,
  UserCheck,
  Info
} from 'lucide-react';
import type { CreatorProfile, Project, Match, GearItem, OwnershipStatus, CommunicationStyle } from '../types';

interface CreatorDashboardViewProps {
  currentUser: CreatorProfile;
  allUsers: CreatorProfile[];
  projects: Project[];
  matches: Match[];
  onNavigateToBrief: (prefilledRole?: string) => void;
  onNavigateToMatches: (filterRole?: string) => void;
  onNavigateToWorkspace: (projectId: string) => void;
  onNavigateToProfile: () => void;
  onSelectProject: (projectId: string) => void;
  onSaveProfile?: (updated: Partial<CreatorProfile>) => Promise<void>;
}

const COMMON_CAMERA_BODIES = [
  'Sony FX6 Cinema Line (4K Full-Frame)',
  'Sony FX3 / FX30 Cinema Rig',
  'ARRI Alexa Mini LF / 35',
  'RED V-Raptor 8K VV / Komodo 6K',
  'Blackmagic URSA Mini Pro 12K',
  'Blackmagic Pocket Cinema 6K G2',
  'Canon Cinema EOS C70 / C300 Mk III',
  'Panasonic LUMIX S1H / BS1H',
];

const LENS_MOUNTS = [
  'Sony E-Mount (Full-Frame & Super35)',
  'PL Cinema Mount (Standard Industry)',
  'Canon RF / EF Mount',
  'L-Mount Cinema Alliance',
  'Anamorphic 1.5x / 2x Special Mount',
];

const AESTHETIC_TAGS = [
  'Moody Low-Key Anamorphic',
  'High-Contrast Kinetic Commercial',
  'Naturalistic Indie Cinema',
  'Stylized High-Fashion Film',
  'Run-and-Gun Documentary Realism',
  'VFX & Virtual Volume Production',
  'Clean Studio Commercial Lighting',
  'Vintage 16mm / 35mm Film Grain',
];

const DISCIPLINE_CATEGORIES = [
  {
    category: 'All Disciplines',
    roles: [],
  },
  {
    category: 'Camera & Cinematography',
    roles: [
      'Director of Photography (DP)',
      'Cinematographer',
      'Camera Operator',
      '1st AC / Focus Puller',
      'Drone Pilot / Aerial DP',
      'Gaffer & Lighting Lead',
      'Key Grip',
    ],
  },
  {
    category: 'Sound & Audio',
    roles: [
      'Location Sound Recordist',
      'Boom Operator',
      'Sound Designer',
      'Film Composer',
      'Foley & Mix Engineer',
    ],
  },
  {
    category: 'Directing & Producing',
    roles: [
      'Director',
      'Commercial Director',
      'Creative Producer',
      'Line Producer',
      '1st Assistant Director (AD)',
    ],
  },
  {
    category: 'Writing & Story',
    roles: [
      'Screenwriter',
      'Script Doctor',
      'Story Editor',
      'Treatment Specialist',
    ],
  },
  {
    category: 'Post-Production & VFX',
    roles: [
      'Lead Video Editor',
      'Colorist (DaVinci Resolve)',
      'VFX Artist',
      'Motion Designer',
    ],
  },
];

export const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({
  currentUser,
  allUsers,
  projects,
  matches,
  onNavigateToBrief,
  onNavigateToMatches,
  onNavigateToWorkspace,
  onNavigateToProfile,
  onSelectProject,
  onSaveProfile,
}) => {
  // Form State for Exchange Requirements
  const [formData, setFormData] = useState<CreatorProfile>({
    ...currentUser,
    cameraBodyVerified: currentUser.cameraBodyVerified || 'Sony FX6 Cinema Line (4K Full-Frame)',
    lensMount: currentUser.lensMount || 'Sony E-Mount (Full-Frame & Super35)',
    lightingWattage: currentUser.lightingWattage || 'Aputure 600d Pro + 300x Bi-Color + 2x Nova P300c Panels',
    audioKitSpecs: currentUser.audioKitSpecs || 'Sound Devices 833 + Sennheiser MKH416 + Wisycom Wireless',
    unionStatus: currentUser.unionStatus || 'Non-Union',
    yearsExperience: currentUser.yearsExperience || 6,
    overtimeHourlyRate: currentUser.overtimeHourlyRate || Math.round((currentUser.dayRateUsd || 800) / 8 * 1.5),
    kitFeeIncluded: currentUser.kitFeeIncluded ?? true,
    depositTerms: currentUser.depositTerms || '50% deposit upon date lock, 50% on wrap day',
    preferredChannel: currentUser.preferredChannel || 'WhatsApp',
    emergencyContact: currentUser.emergencyContact || '+1 (310) 555-0194 (Producer line)',
    insuranceCoiReady: currentUser.insuranceCoiReady ?? true,
    passportValid: currentUser.passportValid ?? true,
    willFly: currentUser.willFly ?? true,
    nextAvailabilityDate: currentUser.nextAvailabilityDate || '2026-09-15',
    specialtyTags: currentUser.specialtyTags || ['Moody Low-Key Anamorphic', 'Naturalistic Indie Cinema'],
  });

  // Sync external currentUser prop updates
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...currentUser,
      cameraBodyVerified: currentUser.cameraBodyVerified || prev.cameraBodyVerified,
      lensMount: currentUser.lensMount || prev.lensMount,
      lightingWattage: currentUser.lightingWattage || prev.lightingWattage,
      audioKitSpecs: currentUser.audioKitSpecs || prev.audioKitSpecs,
      unionStatus: currentUser.unionStatus || prev.unionStatus,
      yearsExperience: currentUser.yearsExperience || prev.yearsExperience,
      overtimeHourlyRate: currentUser.overtimeHourlyRate || prev.overtimeHourlyRate,
      kitFeeIncluded: currentUser.kitFeeIncluded ?? prev.kitFeeIncluded,
      depositTerms: currentUser.depositTerms || prev.depositTerms,
      preferredChannel: currentUser.preferredChannel || prev.preferredChannel,
      emergencyContact: currentUser.emergencyContact || prev.emergencyContact,
      insuranceCoiReady: currentUser.insuranceCoiReady ?? prev.insuranceCoiReady,
      passportValid: currentUser.passportValid ?? prev.passportValid,
      willFly: currentUser.willFly ?? prev.willFly,
      nextAvailabilityDate: currentUser.nextAvailabilityDate || prev.nextAvailabilityDate,
      specialtyTags: currentUser.specialtyTags || prev.specialtyTags,
    }));
  }, [currentUser.id]);

  const [activeFormTab, setActiveFormTab] = useState<'gear' | 'rates' | 'travel' | 'aesthetic' | 'protocol'>('gear');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedDossier, setCopiedDossier] = useState(false);

  // Quick Add Gear State
  const [newGearName, setNewGearName] = useState('');
  const [newGearCategory, setNewGearCategory] = useState('Camera');
  const [newGearOwnership, setNewGearOwnership] = useState<OwnershipStatus>('owned');

  // Broadcast Requirement State
  const [broadcastRole, setBroadcastRole] = useState('Director of Photography (DP)');
  const [broadcastDates, setBroadcastDates] = useState('Oct 14 - Oct 16, 2026');
  const [broadcastBudget, setBroadcastBudget] = useState('$850/day (3 shoot days)');
  const [broadcastLocation, setBroadcastLocation] = useState('Los Angeles, CA (Studio & Location)');
  const [broadcastNotes, setBroadcastNotes] = useState('Requires anamorphic lens package and wireless monitor rig.');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Collaborator Explorer Search & Filters
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All Disciplines');
  const [collaboratorSearchQuery, setCollaboratorSearchQuery] = useState<string>('');
  const [selectedCollaboratorModal, setSelectedCollaboratorModal] = useState<CreatorProfile | null>(null);

  // Calculate Profile Readiness Score (%)
  const calculateReadiness = () => {
    let score = 0;
    const checks: { label: string; done: boolean }[] = [
      { label: 'Primary Role & Location set', done: Boolean(formData.primaryRole && formData.location) },
      { label: 'Verified Camera Body / Tech Kit', done: Boolean(formData.cameraBodyVerified && formData.gearItems?.length > 0) },
      { label: 'Day Rate & Overtime terms', done: Boolean(formData.dayRateUsd > 0 && formData.overtimeHourlyRate) },
      { label: 'Travel Scope & Radius', done: Boolean(formData.travelRadiusMiles > 0 && formData.location) },
      { label: 'Insurance & COI Verified', done: Boolean(formData.insuranceCoiReady) },
      { label: 'Portfolio & Reel Link', done: Boolean(formData.portfolios?.length > 0) },
      { label: 'Working Style Protocol', done: Boolean(formData.communicationStyle && formData.preferredChannel) },
      { label: 'Availability Date Locked', done: Boolean(formData.nextAvailabilityDate) },
    ];

    const completed = checks.filter((c) => c.done).length;
    score = Math.round((completed / checks.length) * 100);
    return { score, checks };
  };

  const readiness = calculateReadiness();

  const handleSaveRequirements = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      if (onSaveProfile) {
        await onSaveProfile(formData);
      }
      setSaveStatus('Requirements verified & synced to Collaborator Network!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Error updating profile. Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGearItem = () => {
    if (!newGearName.trim()) return;
    const item: GearItem = {
      id: `gear_${Date.now()}`,
      equipmentName: newGearName.trim(),
      category: newGearCategory,
      ownershipStatus: newGearOwnership,
    };
    setFormData((prev) => ({
      ...prev,
      gearItems: [item, ...prev.gearItems],
    }));
    setNewGearName('');
  };

  const handleRemoveGearItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      gearItems: prev.gearItems.filter((g) => g.id !== id),
    }));
  };

  const handleToggleAestheticTag = (tag: string) => {
    setFormData((prev) => {
      const current = prev.specialtyTags || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, specialtyTags: updated };
    });
  };

  const handleBroadcastRequirement = async () => {
    const updatedReq = {
      roleNeeded: broadcastRole,
      dates: broadcastDates,
      budget: broadcastBudget,
      location: broadcastLocation,
      notes: broadcastNotes,
    };
    const updatedProfile = {
      ...formData,
      activeBroadcastRequirement: updatedReq,
    };
    setFormData(updatedProfile);
    if (onSaveProfile) {
      await onSaveProfile(updatedProfile);
    }
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  const handleCopyDossier = () => {
    navigator.clipboard.writeText(
      `CREATOR COLLABORATION ONE-SHEET:\n` +
      `Name: ${formData.name}\n` +
      `Role: ${formData.primaryRole} (${formData.unionStatus || 'Non-Union'})\n` +
      `Base: ${formData.location} (Travel Radius: ${formData.travelRadiusMiles}mi)\n` +
      `Day Rate: $${formData.dayRateUsd}/day (Kit Fee Included: ${formData.kitFeeIncluded ? 'Yes' : 'No'})\n` +
      `Primary Kit: ${formData.cameraBodyVerified}\n` +
      `Insurance: ${formData.insuranceCoiReady ? 'COI Ready' : 'Pending'}\n` +
      `Next Availability: ${formData.nextAvailabilityDate}\n` +
      `Reel / Portfolios: ${formData.portfolios?.[0]?.linkUrl || 'Available on request'}\n` +
      `Contact Channel: ${formData.preferredChannel} • ${formData.email}`
    );
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  // Filter Collaborators
  const filteredCollaborators = allUsers.filter((u) => {
    if (u.id === currentUser.id) return false;
    const matchesSearch =
      collaboratorSearchQuery === '' ||
      u.name.toLowerCase().includes(collaboratorSearchQuery.toLowerCase()) ||
      u.primaryRole.toLowerCase().includes(collaboratorSearchQuery.toLowerCase()) ||
      u.location.toLowerCase().includes(collaboratorSearchQuery.toLowerCase()) ||
      u.gearItems?.some((g) => g.equipmentName.toLowerCase().includes(collaboratorSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedDiscipline === 'All Disciplines') return true;
    const catObj = DISCIPLINE_CATEGORIES.find((c) => c.category === selectedDiscipline);
    if (!catObj || catObj.roles.length === 0) return true;
    return catObj.roles.some((r) => u.primaryRole.toLowerCase().includes(r.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-[#1A1715]">
      {/* Top Editorial Hero Banner (matching Screenshot 1 & 2 layout) */}
      <section className="text-center max-w-4xl mx-auto pt-4 sm:pt-6">
        <div className="editorial-kicker mb-3">
          <span>OPERATIONS & COLLABORATOR EXCHANGE</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141210] leading-[1.15]">
          Engagements built around your production requirements
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5C5449] max-w-2xl mx-auto leading-relaxed">
          Complete your verified gear kit, commercial day rates, travel scope, and collaboration protocols so directors and crew instantly exchange accurate production dossiers.
        </p>

        {/* Quick Jump Stats Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#EAE2D5] text-xs font-semibold text-[#181614] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E58B13]" />
            <span>Profile Readiness:</span>
            <strong className="font-mono text-[#E58B13]">{readiness.score}% Complete</strong>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#EAE2D5] text-xs font-medium text-[#5C5449] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{formData.insuranceCoiReady ? 'COI & Insurance Ready' : 'Insurance Pending'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#EAE2D5] text-xs font-medium text-[#5C5449] shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#E58B13]" />
            <span>Next Available: <strong>{formData.nextAvailabilityDate}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left = Requirements Form & Stepper, Right = Live One-Sheet Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Requirements Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Container */}
          <div className="card-warm-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-5">
              <div>
                <div className="editorial-kicker text-[11px] mb-1">
                  <span>STEP-BY-STEP VERIFICATION</span>
                </div>
                <h2 className="font-editorial text-2xl font-bold text-[#141210]">
                  Collaborator Requirements Form
                </h2>
                <p className="text-xs text-[#706658] mt-1">
                  Provide verified details below so your profile exchanges seamlessly with directors & crew.
                </p>
              </div>

              <button
                id="btn-save-requirements-top"
                onClick={handleSaveRequirements}
                disabled={isSaving}
                className="amber-pill-btn px-5 py-2.5 rounded-full text-xs font-bold shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving to Firestore...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Sync Dossier</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification alert on save */}
            {saveStatus && (
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* Section Tab Buttons (Refined Pill Group) */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F7F1E7] rounded-2xl border border-[#E8DFD0]">
              <button
                id="tab-gear"
                onClick={() => setActiveFormTab('gear')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'gear'
                    ? 'bg-[#FFFFFF] text-[#141210] shadow-sm'
                    : 'text-[#706658] hover:text-[#141210]'
                }`}
              >
                🎥 Tech Kit & Gear
              </button>
              <button
                id="tab-rates"
                onClick={() => setActiveFormTab('rates')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'rates'
                    ? 'bg-[#FFFFFF] text-[#141210] shadow-sm'
                    : 'text-[#706658] hover:text-[#141210]'
                }`}
              >
                💵 Rates & Terms
              </button>
              <button
                id="tab-travel"
                onClick={() => setActiveFormTab('travel')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'travel'
                    ? 'bg-[#FFFFFF] text-[#141210] shadow-sm'
                    : 'text-[#706658] hover:text-[#141210]'
                }`}
              >
                📍 Travel & Scope
              </button>
              <button
                id="tab-aesthetic"
                onClick={() => setActiveFormTab('aesthetic')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'aesthetic'
                    ? 'bg-[#FFFFFF] text-[#141210] shadow-sm'
                    : 'text-[#706658] hover:text-[#141210]'
                }`}
              >
                🎬 Proof & Reel
              </button>
              <button
                id="tab-protocol"
                onClick={() => setActiveFormTab('protocol')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFormTab === 'protocol'
                    ? 'bg-[#FFFFFF] text-[#141210] shadow-sm'
                    : 'text-[#706658] hover:text-[#141210]'
                }`}
              >
                🤝 Collaboration
              </button>
            </div>

            {/* TAB 1: Tech Kit & Gear */}
            {activeFormTab === 'gear' && (
              <div className="space-y-5 pt-2">
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EAE2D5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7862] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>Primary Camera Package & Lens Mounts</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Verified Primary Camera Body
                      </label>
                      <select
                        id="select-camera-body"
                        value={formData.cameraBodyVerified}
                        onChange={(e) => setFormData({ ...formData, cameraBodyVerified: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      >
                        {COMMON_CAMERA_BODIES.map((cam) => (
                          <option key={cam} value={cam}>
                            {cam}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Primary Lens Mount Standard
                      </label>
                      <select
                        id="select-lens-mount"
                        value={formData.lensMount}
                        onChange={(e) => setFormData({ ...formData, lensMount: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      >
                        {LENS_MOUNTS.map((mount) => (
                          <option key={mount} value={mount}>
                            {mount}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Lighting Package & Watts
                      </label>
                      <input
                        type="text"
                        value={formData.lightingWattage}
                        onChange={(e) => setFormData({ ...formData, lightingWattage: e.target.value })}
                        placeholder="e.g. Aputure 600d + 300x + Lantern + 2x Pavotubes"
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Audio Recording Kit
                      </label>
                      <input
                        type="text"
                        value={formData.audioKitSpecs}
                        onChange={(e) => setFormData({ ...formData, audioKitSpecs: e.target.value })}
                        placeholder="e.g. Sound Devices 833, Sennheiser MKH416, Tentacles"
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      />
                    </div>
                  </div>

                  {/* Checkbox Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EAE2D5]">
                    <label className="flex items-center gap-2.5 text-xs text-[#181614] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.backupKitAvailable}
                        onChange={(e) => setFormData({ ...formData, backupKitAvailable: e.target.checked })}
                        className="rounded text-[#E58B13] focus:ring-[#E58B13] w-4 h-4"
                      />
                      <span>Backup B-Cam Body & Media on Set</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-[#181614] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.insuranceCoiReady}
                        onChange={(e) => setFormData({ ...formData, insuranceCoiReady: e.target.checked })}
                        className="rounded text-[#E58B13] focus:ring-[#E58B13] w-4 h-4"
                      />
                      <span>Equipment Insurance & COI Ready</span>
                    </label>
                  </div>
                </div>

                {/* Additional Gear Inventory */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#181614]">
                      Additional Inventory Items ({formData.gearItems?.length || 0})
                    </h4>
                    <span className="text-[11px] text-[#8C7862]">Exchanged with rental budget specs</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGearName}
                      onChange={(e) => setNewGearName(e.target.value)}
                      placeholder="Add item (e.g. Teradek Bolt 4K Wireless Transmitter, Nucleus-M)"
                      className="flex-1 bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                    />
                    <select
                      value={newGearCategory}
                      onChange={(e) => setNewGearCategory(e.target.value)}
                      className="bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-2.5 py-2 text-xs text-[#181614]"
                    >
                      <option value="Camera">Camera</option>
                      <option value="Lenses">Lenses</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Audio">Audio</option>
                      <option value="Grip">Grip</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddGearItem}
                      className="px-3.5 py-2 rounded-xl bg-[#181614] text-[#FBF7F0] text-xs font-semibold hover:bg-[#2C2723] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Gear List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {formData.gearItems?.map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EAE2D5] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-[#181614]">{g.equipmentName}</span>
                          <span className="text-[10px] text-[#8C7862] ml-1.5">({g.category})</span>
                        </div>
                        <button
                          onClick={() => handleRemoveGearItem(g.id)}
                          className="text-[#A39887] hover:text-[#DC2626] p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Rates & Commercial Terms */}
            {activeFormTab === 'rates' && (
              <div className="space-y-5 pt-2">
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EAE2D5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7862] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>Commercial Day Rates & Overtime Structure</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Standard 10-Hour Base Day Rate ($ USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2 text-sm text-[#8C7862] font-mono">$</span>
                        <input
                          id="input-day-rate"
                          type="number"
                          value={formData.dayRateUsd}
                          onChange={(e) => setFormData({ ...formData, dayRateUsd: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl pl-8 pr-3 py-2 text-xs font-bold font-mono text-[#181614] focus:outline-none focus:border-[#E58B13]"
                        />
                      </div>
                      <p className="text-[10px] text-[#8C7862] mt-1">Exchanged with producers for budget calculation.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        12-Hour Overtime Hourly Rate ($ USD/hr)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2 text-sm text-[#8C7862] font-mono">$</span>
                        <input
                          id="input-ot-rate"
                          type="number"
                          value={formData.overtimeHourlyRate}
                          onChange={(e) => setFormData({ ...formData, overtimeHourlyRate: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl pl-8 pr-3 py-2 text-xs font-bold font-mono text-[#181614] focus:outline-none focus:border-[#E58B13]"
                        />
                      </div>
                      <p className="text-[10px] text-[#8C7862] mt-1">Rate applied past the 10th hour on set.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Union / Guild Affiliation
                      </label>
                      <select
                        value={formData.unionStatus}
                        onChange={(e) => setFormData({ ...formData, unionStatus: e.target.value as any })}
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      >
                        <option value="Non-Union">Non-Union (Independent Productions)</option>
                        <option value="Union (IATSE / DGA / Local 600)">Union (IATSE / DGA / Local 600)</option>
                        <option value="Both / Fi-Core">Both / Financial Core</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Kit Fee Policy
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, kitFeeIncluded: true })}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            formData.kitFeeIncluded
                              ? 'bg-[#181614] text-[#FBF7F0] border-[#181614]'
                              : 'bg-[#FFFFFF] text-[#706658] border-[#D9CEC1]'
                          }`}
                        >
                          Kit Fee Included in Day Rate
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, kitFeeIncluded: false })}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            !formData.kitFeeIncluded
                              ? 'bg-[#181614] text-[#FBF7F0] border-[#181614]'
                              : 'bg-[#FFFFFF] text-[#706658] border-[#D9CEC1]'
                          }`}
                        >
                          Separate Kit Invoice ($250+)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                      Standard Payment Terms & Deposit Policy
                    </label>
                    <input
                      type="text"
                      value={formData.depositTerms}
                      onChange={(e) => setFormData({ ...formData, depositTerms: e.target.value })}
                      placeholder="e.g. 50% upfront upon booking, 50% on wrap day (Net 15 approved for studios)"
                      className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Travel & Scope */}
            {activeFormTab === 'travel' && (
              <div className="space-y-5 pt-2">
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EAE2D5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7862] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>Home Base & Production Travel Scope</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Home Base Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Los Angeles, CA"
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Next Available Shoot Date
                      </label>
                      <input
                        type="date"
                        value={formData.nextAvailabilityDate}
                        onChange={(e) => setFormData({ ...formData, nextAvailabilityDate: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-[#181614]">
                        Driving Travel Radius Tolerance
                      </label>
                      <span className="font-mono text-xs font-bold text-[#E58B13] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#D9CEC1]">
                        {formData.travelRadiusMiles} miles
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={formData.travelRadiusMiles}
                      onChange={(e) => setFormData({ ...formData, travelRadiusMiles: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#D9CEC1] rounded-lg appearance-none cursor-pointer accent-[#E58B13]"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C7862] font-mono mt-1">
                      <span>Local Only (10mi)</span>
                      <span>Regional (120mi)</span>
                      <span>Nationwide (500mi)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EAE2D5]">
                    <label className="flex items-center gap-2.5 text-xs text-[#181614] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.willFly}
                        onChange={(e) => setFormData({ ...formData, willFly: e.target.checked })}
                        className="rounded text-[#E58B13] focus:ring-[#E58B13] w-4 h-4"
                      />
                      <span>Willing to Fly (Per diem & lodging provided)</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-[#181614] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.passportValid}
                        onChange={(e) => setFormData({ ...formData, passportValid: e.target.checked })}
                        className="rounded text-[#E58B13] focus:ring-[#E58B13] w-4 h-4"
                      />
                      <span>Valid Passport for International Shoots</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Proof & Reel */}
            {activeFormTab === 'aesthetic' && (
              <div className="space-y-5 pt-2">
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EAE2D5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7862] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>Reels, Visual Signatures & Work Proof</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                      Direct Showreel Link (Vimeo / YouTube 4K)
                    </label>
                    <input
                      type="url"
                      value={formData.portfolios?.[0]?.linkUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const ports = [...(formData.portfolios || [])];
                        if (ports.length > 0) {
                          ports[0] = { ...ports[0], linkUrl: val };
                        } else {
                          ports.push({
                            id: 'port_1',
                            title: 'Primary Showreel',
                            linkUrl: val,
                            mediaType: 'video',
                            tags: ['Cinematic'],
                          });
                        }
                        setFormData({ ...formData, portfolios: ports });
                      }}
                      placeholder="https://vimeo.com/76979871 or https://youtube.com/watch?v=..."
                      className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs font-mono text-[#181614] focus:outline-none focus:border-[#E58B13]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                      Select Your Signature Visual Aesthetics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AESTHETIC_TAGS.map((tag) => {
                        const isSelected = formData.specialtyTags?.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleAestheticTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#181614] text-[#FBF7F0] font-semibold border border-[#181614]'
                                : 'bg-[#FFFFFF] text-[#706658] border border-[#D9CEC1] hover:border-[#E58B13]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                      Professional Bio & Philosophy
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="e.g. 7 years shooting indie narrative features and commercial spots. Obsessed with high-contrast anamorphic lighting and nimble set workflows..."
                      className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl p-3 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Collaboration Protocol */}
            {activeFormTab === 'protocol' && (
              <div className="space-y-5 pt-2">
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EAE2D5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7862] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#E58B13]" />
                    <span>On-Set Communication & Collaboration Protocol</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#181614] mb-2">
                      Working Style Archetype
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'fast_decider', label: 'Fast Decider', desc: 'High velocity, trusts intuition, quick approvals.' },
                        { id: 'detail_reviewer', label: 'Detail Reviewer', desc: 'Deep technical specs, thorough shot list rigor.' },
                        { id: 'autonomous_executor', label: 'Autonomous Executor', desc: 'Clear brief goals, executes without micromanagement.' },
                        { id: 'collaborative_brainstormer', label: 'Brainstormer', desc: 'Loves iterative jamming and look development.' },
                      ].map((style) => (
                        <div
                          key={style.id}
                          onClick={() => setFormData({ ...formData, communicationStyle: style.id as CommunicationStyle })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            formData.communicationStyle === style.id
                              ? 'bg-[#181614] text-[#FBF7F0] border-[#181614]'
                              : 'bg-[#FFFFFF] text-[#181614] border-[#D9CEC1] hover:border-[#E58B13]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>{style.label}</span>
                            {formData.communicationStyle === style.id && <span className="text-[#E58B13]">●</span>}
                          </div>
                          <p className={`text-[11px] mt-1 ${formData.communicationStyle === style.id ? 'text-[#A89C8D]' : 'text-[#706658]'}`}>
                            {style.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Preferred Direct Channel
                      </label>
                      <select
                        value={formData.preferredChannel}
                        onChange={(e) => setFormData({ ...formData, preferredChannel: e.target.value as any })}
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      >
                        <option value="WhatsApp">WhatsApp (Direct On-Set Text / Group)</option>
                        <option value="Slack">Slack Production Channel</option>
                        <option value="Email">Email (Formal Briefs & Call Sheets)</option>
                        <option value="Phone">Phone Call (Urgent Crew Call)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181614] mb-1.5">
                        Emergency On-Set Line
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        placeholder="+1 (310) 555-0194"
                        className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EAE2D5]">
              <div className="flex items-center gap-2 text-xs text-[#8C7862]">
                <FileCheck className="w-4 h-4 text-[#E58B13]" />
                <span>Live synchronizes with Firestore database</span>
              </div>

              <button
                id="btn-save-requirements-bottom"
                onClick={handleSaveRequirements}
                disabled={isSaving}
                className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? 'Updating...' : 'Save & Sync Exchange Dossier'}
              </button>
            </div>
          </div>

          {/* Quick Broadcast Requirement Form (Allows creator to broadcast crew needs) */}
          <div className="card-warm-white rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker text-[10px] mb-1">
                  <span>PRODUCER BROADCAST</span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#141210]">
                  Broadcast a Crew Requirement
                </h3>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#E58B13]/15 text-[#E58B13] font-bold">
                Instant Feed Match
              </span>
            </div>

            <p className="text-xs text-[#706658]">
              Need a collaborator right now? Broadcast your specific role, budget cap, dates, and gear requirements to matching creators in the network.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#181614] block mb-1">Role Needed</label>
                <input
                  type="text"
                  value={broadcastRole}
                  onChange={(e) => setBroadcastRole(e.target.value)}
                  placeholder="e.g. 1st Assistant Camera (Focus Puller)"
                  className="w-full bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#181614] block mb-1">Shoot Dates</label>
                <input
                  type="text"
                  value={broadcastDates}
                  onChange={(e) => setBroadcastDates(e.target.value)}
                  placeholder="e.g. Oct 14 - Oct 16 (3 Days)"
                  className="w-full bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#181614] block mb-1">Allocated Budget Rate</label>
                <input
                  type="text"
                  value={broadcastBudget}
                  onChange={(e) => setBroadcastBudget(e.target.value)}
                  placeholder="e.g. $750/day (Kit included)"
                  className="w-full bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#181614] block mb-1">Shoot Location</label>
                <input
                  type="text"
                  value={broadcastLocation}
                  onChange={(e) => setBroadcastLocation(e.target.value)}
                  placeholder="e.g. Los Angeles, CA"
                  className="w-full bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#181614] block mb-1">Specific Gear & Rig Requirements</label>
              <input
                type="text"
                value={broadcastNotes}
                onChange={(e) => setBroadcastNotes(e.target.value)}
                placeholder="e.g. Must bring wireless follow focus (Tilta Nucleus/DJI Focus) and director monitor."
                className="w-full bg-[#FAF6EE] border border-[#D9CEC1] rounded-xl px-3 py-2 text-xs text-[#181614] focus:outline-none focus:border-[#E58B13]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {broadcastSuccess ? (
                <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Requirement broadcasted to matching creators!
                </span>
              ) : (
                <span className="text-[11px] text-[#8C7862]">Broadcasted to verified creators within travel radius</span>
              )}

              <button
                type="button"
                onClick={handleBroadcastRequirement}
                className="px-5 py-2 rounded-full bg-[#181614] text-[#FBF7F0] text-xs font-bold hover:bg-[#2C2723] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#E58B13]" />
                <span>Broadcast Requirement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live One-Sheet Dossier & Readiness Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Featured Obsidian Card (Exact match for Screenshot 1 Growth card style) */}
          <div className="card-obsidian rounded-3xl p-6 sm:p-7 space-y-6 relative overflow-hidden">
            {/* Amber Corner Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E58B13]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 border-b border-[#2C2824] pb-5 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-[#E58B13] uppercase tracking-widest block mb-1">
                  LIVE COLLABORATOR DOSSIER
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F8F5F0]">
                  {formData.name}
                </h3>
                <p className="text-xs text-[#A89C8D] mt-0.5">
                  {formData.primaryRole} • {formData.unionStatus || 'Non-Union'}
                </p>
              </div>

              <div className="text-right">
                <span className="font-editorial text-2xl font-bold text-[#F8F5F0]">
                  ${formData.dayRateUsd}
                </span>
                <span className="block text-[10px] text-[#8C7862] uppercase tracking-wider font-mono">
                  / 10-HR DAY
                </span>
              </div>
            </div>

            {/* Key Verified Telemetry Points */}
            <div className="space-y-3.5 relative z-10 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#231F1C] border border-[#3A332C] space-y-2">
                <div className="flex items-center justify-between text-[#E58B13] font-bold text-[11px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Verified Camera Package</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E58B13]/20 text-[#E58B13]">
                    OWNED KIT
                  </span>
                </div>
                <p className="text-[#F8F5F0] font-medium leading-snug">
                  {formData.cameraBodyVerified}
                </p>
                <p className="text-[11px] text-[#A89C8D]">
                  Mount: {formData.lensMount}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C]">
                  <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Location & Travel</span>
                  <p className="text-[#F8F5F0] font-semibold mt-1 truncate">{formData.location}</p>
                  <p className="text-[10px] text-[#A89C8D]">{formData.travelRadiusMiles}mi travel radius</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C]">
                  <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Next Availability</span>
                  <p className="text-[#E58B13] font-semibold mt-1 font-mono">{formData.nextAvailabilityDate}</p>
                  <p className="text-[10px] text-[#A89C8D]">{formData.willFly ? 'Willing to fly' : 'Local only'}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C] space-y-1.5">
                <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Commercial Terms</span>
                <p className="text-[#F8F5F0] text-[11px]">
                  <strong>OT Rate:</strong> ${formData.overtimeHourlyRate}/hr • <strong>Kit Fee:</strong> {formData.kitFeeIncluded ? 'Included' : 'Billed separately'}
                </p>
                <p className="text-[10px] text-[#A89C8D]">
                  Deposit: {formData.depositTerms}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C] space-y-1.5">
                <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Aesthetic Signatures</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.specialtyTags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#181614] text-[#E58B13] border border-[#3A332C]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* One-Sheet Action Buttons */}
            <div className="pt-2 flex items-center gap-3 relative z-10">
              <button
                id="btn-copy-dossier"
                onClick={handleCopyDossier}
                className="flex-1 py-2.5 rounded-full bg-[#F5A623] hover:bg-[#E58B13] text-[#181614] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {copiedDossier ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Exchange One-Sheet</span>
                  </>
                )}
              </button>

              <button
                onClick={onNavigateToProfile}
                className="px-4 py-2.5 rounded-full bg-[#231F1C] hover:bg-[#2C2723] text-[#F8F5F0] text-xs font-semibold border border-[#3A332C] transition-colors cursor-pointer"
              >
                Edit Bio
              </button>
            </div>
          </div>

          {/* Profile Completion Checklist Card */}
          <div className="card-warm-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8C7862] uppercase tracking-wider block">
                  VERIFICATION READINESS
                </span>
                <h4 className="font-editorial text-lg font-bold text-[#141210]">
                  Exchange Checklist
                </h4>
              </div>
              <span className="font-mono text-sm font-bold text-[#E58B13]">
                {readiness.score}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#FAF6EE] rounded-full overflow-hidden border border-[#EAE2D5]">
              <div
                className="h-full bg-[#E58B13] rounded-full transition-all duration-500"
                style={{ width: `${readiness.score}%` }}
              />
            </div>

            {/* Itemized Requirements */}
            <div className="space-y-2 pt-1">
              {readiness.checks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#F2ECE3] last:border-0"
                >
                  <span className={item.done ? 'text-[#181614] font-medium' : 'text-[#8C7862]'}>
                    {item.label}
                  </span>
                  {item.done ? (
                    <span className="text-[#2D6A4F] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-[#E58B13] font-semibold text-[11px]">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collaborator Exchange Network Directory */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE2D5] pb-5">
          <div>
            <div className="editorial-kicker mb-1">
              <span>COLLABORATOR NETWORK</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141210]">
              Exchange Profiles & Vetted Crew
            </h2>
            <p className="text-xs text-[#706658] mt-1">
              Browse verified creators ready to exchange equipment kits, day rates, and shoot plans.
            </p>
          </div>

          {/* Discipline Filters */}
          <div className="flex flex-wrap gap-1.5">
            {DISCIPLINE_CATEGORIES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedDiscipline(cat.category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedDiscipline === cat.category
                    ? 'bg-[#181614] text-[#FBF7F0]'
                    : 'bg-[#FFFFFF] text-[#706658] border border-[#EAE2D5] hover:border-[#E58B13]'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={collaboratorSearchQuery}
            onChange={(e) => setCollaboratorSearchQuery(e.target.value)}
            placeholder="Search by name, role, camera body (e.g. Sony FX6, RED)..."
            className="w-full bg-[#FFFFFF] border border-[#D9CEC1] rounded-2xl px-4 py-2.5 text-xs text-[#181614] placeholder-[#A39887] focus:outline-none focus:border-[#E58B13] shadow-sm"
          />
        </div>

        {/* Collaborators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollaborators.map((user) => {
            const hasCoi = user.insuranceCoiReady ?? true;
            return (
              <div
                key={user.id}
                className="card-warm-white rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:shadow-xl transition-all border border-[#EAE2D5]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
                        alt={user.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#E58B13]/60 shadow-sm"
                      />
                      <div>
                        <h4 className="font-editorial text-base font-bold text-[#141210]">
                          {user.name}
                        </h4>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6EE] text-[#E58B13] border border-[#EAE2D5]">
                          {user.primaryRole}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-editorial text-lg font-bold text-[#141210]">
                        ${user.dayRateUsd}
                      </span>
                      <span className="block text-[9px] text-[#8C7862] font-mono">/DAY</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C5449] mt-3 line-clamp-2 leading-relaxed">
                    {user.bio || 'Experienced narrative and commercial filmmaker with verified camera package.'}
                  </p>

                  {/* Gear & Telemetry Badges */}
                  <div className="mt-4 space-y-2">
                    <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EAE2D5] text-[11px] text-[#181614] flex items-center justify-between">
                      <span className="truncate font-medium">
                        🎥 {user.cameraBodyVerified || user.gearItems?.[0]?.equipmentName || 'Sony FX6 Cinema Kit'}
                      </span>
                      <span className="text-[10px] text-[#2D6A4F] font-bold shrink-0">
                        {hasCoi ? 'COI ✓' : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#706658]">
                      <span>📍 {user.location} ({user.travelRadiusMiles}mi radius)</span>
                      <span>💬 {user.communicationStyle?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-[#EAE2D5] flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCollaboratorModal(user)}
                    className="flex-1 py-2 rounded-full bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#181614] text-xs font-bold border border-[#D9CEC1] transition-colors cursor-pointer"
                  >
                    View One-Sheet
                  </button>

                  <button
                    onClick={() => onNavigateToBrief(user.primaryRole)}
                    className="flex-1 py-2 rounded-full bg-[#181614] hover:bg-[#2C2723] text-[#FBF7F0] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Invite to Shoot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Collaborator Modal Dossier View */}
      {selectedCollaboratorModal && (
        <div className="fixed inset-0 z-50 bg-[#181614]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-obsidian rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-[#3A332C] shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-[#2C2824] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCollaboratorModal.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'}
                  alt={selectedCollaboratorModal.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#E58B13]"
                />
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#F8F5F0]">
                    {selectedCollaboratorModal.name}
                  </h3>
                  <p className="text-xs text-[#A89C8D]">
                    {selectedCollaboratorModal.primaryRole} • {selectedCollaboratorModal.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCollaboratorModal(null)}
                className="p-2 rounded-full bg-[#231F1C] text-[#A89C8D] hover:text-[#F8F5F0] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C]">
                <span className="text-[10px] font-bold text-[#E58B13] uppercase block">Rate & Terms</span>
                <p className="text-[#F8F5F0] font-bold mt-0.5 text-sm">${selectedCollaboratorModal.dayRateUsd}/day (10hr base)</p>
                <p className="text-[#A89C8D] text-[11px] mt-0.5">Kit fee included in standard rate. Travel per diem required for shoots past {selectedCollaboratorModal.travelRadiusMiles} miles.</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C]">
                <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Verified Equipment</span>
                <p className="text-[#F8F5F0] font-semibold mt-0.5">{selectedCollaboratorModal.cameraBodyVerified || 'Sony FX6 Cinema Package + GM Primes'}</p>
                <div className="mt-2 space-y-1">
                  {selectedCollaboratorModal.gearItems?.map((g) => (
                    <span key={g.id} className="inline-block mr-2 text-[10px] text-[#A89C8D]">
                      • {g.equipmentName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#231F1C] border border-[#3A332C]">
                <span className="text-[10px] font-bold text-[#8C7862] uppercase block">Communication & Working Style</span>
                <p className="text-[#F8F5F0] capitalize mt-0.5 font-medium">{selectedCollaboratorModal.communicationStyle?.replace('_', ' ')}</p>
                <p className="text-[#A89C8D] text-[11px]">Email: {selectedCollaboratorModal.email}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setSelectedCollaboratorModal(null);
                  onNavigateToBrief(selectedCollaboratorModal.primaryRole);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#F5A623] hover:bg-[#E58B13] text-[#181614] text-xs font-bold cursor-pointer"
              >
                Create Project Brief for {selectedCollaboratorModal.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
