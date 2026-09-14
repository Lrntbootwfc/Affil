import React from 'react';
import { Users, Sparkles, MapPin, Layers, ArrowUpRight, Compass } from 'lucide-react';
import type { CreativeClub, CreatorProfile } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface ClubCardProps {
  club: CreativeClub;
  onOpenDetail: (club: CreativeClub) => void;
  onViewCreator?: (creator: CreatorProfile) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onOpenDetail, onViewCreator }) => {
  return (
    <article
      id={`club-card-${club.id}`}
      onClick={() => onOpenDetail(club)}
      className="card-warm-white rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Cover / Society Banner */}
        <div className="h-28 w-full relative overflow-hidden bg-[var(--card-border)]">
          {club.coverImageUrl ? (
            <img
              src={club.coverImageUrl}
              alt={club.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-[var(--card-inner-bg)] flex items-center justify-center">
              <Compass className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top Category Badge */}
          <div className="absolute top-2.5 right-3 z-10 px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
            {club.category}
          </div>
        </div>

        {/* Club Content */}
        <div className="p-5 pt-3 space-y-3">
          {/* Avatar + Title Header */}
          <div className="flex items-start gap-3 -mt-9 relative z-10">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-4 ring-[var(--card-bg)] shadow-md bg-[var(--card-inner-bg)] shrink-0 border border-[var(--card-inner-border)]">
              {club.avatarUrl ? (
                <img src={club.avatarUrl} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-editorial font-bold text-lg text-[var(--accent-amber)]">
                  {club.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-1.5">
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors line-clamp-1">
                {club.name}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 font-mono">
                {club.tagline}
              </p>
            </div>
          </div>

          {/* Purpose / Description */}
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Guild Tags */}
          {club.tags && club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {club.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Lead Curator Summary */}
          {club.leadCreator && (
            <div
              className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]/60"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewCreator && club.leadCreator) onViewCreator(club.leadCreator);
                else onOpenDetail(club);
              }}
            >
              <UserAvatar
                name={club.leadCreator.name}
                avatarUrl={club.leadCreator.avatarUrl}
                size="xs"
                className="shrink-0"
              />
              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                Curated by <span className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-colors">{club.leadCreator.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Member Count & Cadence */}
      <div className="px-5 py-3 border-t border-[var(--card-border)]/60 flex items-center justify-between bg-[var(--card-inner-bg)]/40">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
          <Users className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
          <span>{club.memberCount} creators</span>
        </div>

        <button
          id={`view-club-btn-${club.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(club);
          }}
          className="text-xs font-semibold text-[var(--accent-amber)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
        >
          <span>Enter Guild</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
