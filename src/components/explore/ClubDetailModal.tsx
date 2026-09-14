import React, { useEffect, useState } from 'react';
import { X, Users, Calendar, Layers, Sparkles, MapPin, MessageSquare, Check } from 'lucide-react';
import type { CreativeClub, CreatorProfile, Project, ProjectTask } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface ClubDetailModalProps {
  club: CreativeClub | null;
  onClose: () => void;
  currentUser: CreatorProfile | null;
  onViewCreator: (creator: CreatorProfile) => void;
  onSelectProject?: (project: Project) => void;
  onSelectTask?: (task: ProjectTask) => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  onClose,
  currentUser,
  onViewCreator,
  onSelectProject,
  onSelectTask,
}) => {
  const [members, setMembers] = useState<CreatorProfile[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!club) return;
    fetch(`/api/explore/club/${club.id}/related`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMembers(data.relatedCreators || []);
          setRelatedProjects(data.relatedProjects || []);
        }
      })
      .catch((err) => console.error('Failed to load related club items:', err));
  }, [club?.id]);

  if (!club) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-warm-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[var(--card-border)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 cursor-pointer backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover */}
        <div className="h-44 w-full relative overflow-hidden bg-[var(--card-border)]">
          {club.coverImageUrl ? (
            <img src={club.coverImageUrl} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--card-inner-bg)] flex items-center justify-center">
              <Layers className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {club.category} Guild
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 pt-4">
          {/* Avatar + Title Header */}
          <div className="flex items-start justify-between gap-4 -mt-12 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-[var(--card-bg)] shadow-xl bg-[var(--card-inner-bg)] shrink-0">
                {club.avatarUrl ? (
                  <img src={club.avatarUrl} alt={club.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[var(--accent-amber)]">
                    {club.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  {club.name}
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {club.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={() => setJoined(!joined)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 ${
                joined
                  ? 'bg-[var(--card-inner-bg)] text-[var(--accent-amber)] border border-[var(--accent-amber)]'
                  : 'amber-pill-btn'
              }`}
            >
              {joined ? <Check className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
              <span>{joined ? 'Guild Member' : 'Join Community'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Guild Mission &amp; Purpose
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {club.description}
            </p>
          </div>

          {/* Cadence & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-xs">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Community Size</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">{club.memberCount} Creators</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Location Base</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">{club.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Sessions Cadence</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">{club.meetingCadence}</p>
            </div>
          </div>

          {/* Lead Curator Info */}
          {club.leadCreator && (
            <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (club.leadCreator) onViewCreator(club.leadCreator);
                }}
              >
                <UserAvatar
                  name={club.leadCreator.name}
                  avatarUrl={club.leadCreator.avatarUrl}
                  size="md"
                  className="shrink-0 ring-2 ring-[var(--card-border)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                    {club.leadCreator.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Guild Steward • {club.leadCreator.primaryRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (club.leadCreator) onViewCreator(club.leadCreator);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-border)] cursor-pointer"
              >
                View Profile
              </button>
            </div>
          )}

          {/* Active Members / Guild Craftsmen */}
          {members.length > 0 && (
            <div className="pt-2 border-t border-[var(--card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--accent-amber)]" />
                  <span>Featured Guild Artisans</span>
                </h4>
                <span className="text-[11px] text-[var(--text-muted)]">Work-to-People Discovery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.slice(0, 4).map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => onViewCreator(creator)}
                    className="p-3 rounded-2xl bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <UserAvatar name={creator.name} avatarUrl={creator.avatarUrl} size="sm" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{creator.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{creator.primaryRole}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--accent-amber)] font-semibold shrink-0">
                      Profile
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Close Action */}
          <div className="pt-4 border-t border-[var(--card-border)] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
