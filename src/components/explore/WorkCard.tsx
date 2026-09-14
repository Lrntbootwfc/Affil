import React from 'react';
import { Play, Layers, ArrowUpRight, Heart, Sparkles, Film } from 'lucide-react';
import type { WorkShowcase, CreatorProfile } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface WorkCardProps {
  work: WorkShowcase;
  onOpenDetail: (work: WorkShowcase) => void;
  onViewCreator?: (creator: CreatorProfile) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, onOpenDetail, onViewCreator }) => {
  return (
    <article
      id={`work-card-${work.id}`}
      onClick={() => onOpenDetail(work)}
      className="card-warm-white rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Cinematic Aspect Ratio Frame */}
        <div className="aspect-[16/10] w-full relative overflow-hidden bg-[var(--card-border)]">
          {work.thumbnailUrl ? (
            <img
              src={work.thumbnailUrl}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--card-inner-bg)]">
              <Film className="w-8 h-8 text-[var(--text-muted)] opacity-60" />
            </div>
          )}

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Pill Controls */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/15">
              {work.category}
            </span>

            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm flex items-center gap-1">
              {work.mediaType === 'video' ? <Play className="w-2.5 h-2.5 fill-current" /> : <Layers className="w-2.5 h-2.5" />}
              <span className="capitalize">{work.platform}</span>
            </span>
          </div>

          {/* Play/View Icon Overlay on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Bottom Title on Frame */}
          <div className="absolute bottom-3 left-3.5 right-3.5 z-10 text-white">
            <h3 className="font-editorial text-lg font-bold line-clamp-1 group-hover:text-[var(--accent-amber)] transition-colors leading-snug">
              {work.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Creator Attribution */}
          {work.creator && (
            <div
              className="flex items-center gap-2.5"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewCreator && work.creator) onViewCreator(work.creator);
                else onOpenDetail(work);
              }}
            >
              <UserAvatar
                name={work.creator.name}
                avatarUrl={work.creator.avatarUrl}
                size="sm"
                className="shrink-0 ring-1 ring-[var(--card-border)]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-colors truncate">
                  {work.creator.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                  {work.creator.primaryRole}
                </p>
              </div>
            </div>
          )}

          {/* Description snippet */}
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {work.description}
          </p>

          {/* Roles Involved Chips */}
          {work.rolesInvolved && work.rolesInvolved.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {work.rolesInvolved.slice(0, 3).map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-secondary)]"
                >
                  {role}
                </span>
              ))}
              {work.rolesInvolved.length > 3 && (
                <span className="text-[10px] font-mono text-[var(--text-muted)] self-center px-1">
                  +{work.rolesInvolved.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editorial Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-[var(--card-border)]/60 flex items-center justify-between bg-[var(--card-inner-bg)]/40">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Heart className="w-3.5 h-3.5 text-[var(--accent-amber)] fill-current" />
          <span className="font-mono text-[11px] font-medium">{work.appreciationCount} appreciations</span>
        </div>

        <button
          id={`view-work-btn-${work.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(work);
          }}
          className="text-xs font-semibold text-[var(--accent-amber)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
        >
          <span>View Case Study</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
