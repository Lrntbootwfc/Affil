import React from 'react';
import { MapPin, Sparkles, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { ExploreCreatorItem } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface CreatorCardProps {
  creator: ExploreCreatorItem;
  onOpenDetail: (creator: ExploreCreatorItem) => void;
  onConnect?: (creator: ExploreCreatorItem) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onOpenDetail, onConnect }) => {
  return (
    <article
      id={`creator-card-${creator.id}`}
      onClick={() => onOpenDetail(creator)}
      className="card-warm-white rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Cover or Subtle Studio Header */}
        {creator.coverImageUrl ? (
          <div className="h-24 w-full relative overflow-hidden bg-[var(--card-border)]">
            <img
              src={creator.coverImageUrl}
              alt={creator.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/50 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available</span>
            </div>
          </div>
        ) : (
          <div className="h-4 w-full bg-[var(--card-inner-border)]/40 relative">
            <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--card-inner-bg)] text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Available</span>
            </div>
          </div>
        )}

        <div className="p-5 pt-3 space-y-3.5">
          {/* Avatar and Name Identity */}
          <div className={`flex items-start gap-3.5 ${creator.coverImageUrl ? '-mt-9 relative z-10' : 'pt-2'}`}>
            <UserAvatar
              name={creator.name}
              avatarUrl={creator.avatarUrl}
              size="lg"
              className="shrink-0 ring-4 ring-[var(--card-bg)] shadow-md rounded-xl"
            />
            <div className="min-w-0 flex-1 pt-1">
              <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors truncate">
                {creator.name}
              </h3>
              <p className="text-[11px] font-mono text-[var(--accent-amber)] truncate">
                @{creator.username}
              </p>
              <div className="mt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium uppercase tracking-wider bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]">
                  {creator.primaryRole}
                </span>
              </div>
            </div>
          </div>

          {/* Discovery Reason / AI Match Prompt Notice */}
          {creator.discoveryReason && (
            <div className="p-2.5 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-start gap-2 text-[11px] text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-amber)] shrink-0 mt-0.5" />
              <span className="leading-snug">{creator.discoveryReason}</span>
            </div>
          )}

          {/* Bio snippet */}
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {creator.bio || 'Experienced production professional ready for collaborative projects.'}
          </p>

          {/* Collaborating With Roles */}
          {creator.seekingRoles && creator.seekingRoles.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Collaborates with:
              </p>
              <div className="flex flex-wrap gap-1">
                {creator.seekingRoles.slice(0, 3).map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location & Rates Meta Row */}
          <div className="flex items-center justify-between p-2.5 bg-[var(--card-inner-bg)]/80 rounded-xl border border-[var(--card-inner-border)] text-xs">
            <div className="flex items-center gap-1 text-[var(--text-muted)] truncate">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)] shrink-0" />
              <span className="truncate">{creator.location || 'Mumbai, IN'}</span>
            </div>
            <div className="font-mono font-bold text-[var(--text-primary)] text-xs">
              ₹{(creator.dayRateUsd || 25000).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-[var(--text-muted)]">/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-[var(--card-border)]/60 flex items-center gap-2">
          <button
            id={`view-profile-btn-${creator.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(creator);
            }}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-primary)] border border-[var(--card-inner-border)] transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
          >
            <span>Dossier</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {onConnect && (
            <button
              id={`connect-creator-btn-${creator.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onConnect(creator);
              }}
              className="amber-pill-btn flex-1 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Collaborate</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
