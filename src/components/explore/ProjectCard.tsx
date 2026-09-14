import React from 'react';
import { Briefcase, MapPin, Sparkles, Calendar, ArrowUpRight, Film, Clock } from 'lucide-react';
import type { Project, CreatorProfile } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface ProjectCardProps {
  project: Project;
  onOpenDetail: (project: Project) => void;
  onViewCreator?: (creator: CreatorProfile) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetail,
  onViewCreator,
}) => {
  const rolesNeeded = project.parsedRequirements?.rolesNeeded || [];

  return (
    <article
      id={`project-card-${project.id}`}
      onClick={() => onOpenDetail(project)}
      className="card-warm-white rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Production Brief Header Strip */}
        <div className="px-5 py-3 bg-[var(--card-inner-bg)]/70 border-b border-[var(--card-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Brief #{project.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[var(--card-bg)] text-[var(--accent-amber)] border border-[var(--card-border)] uppercase tracking-wider">
            Active Crewing
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Genre Tags & Shooting Location */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {project.genreTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium uppercase tracking-wider bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <MapPin className="w-3 h-3 text-[var(--accent-amber)] shrink-0" />
              <span className="truncate max-w-[130px] font-mono">{project.location}</span>
            </div>
          </div>

          {/* Project Title & Dynamic Intent */}
          <div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-1.5">
              {project.parsedRequirements?.dynamicIntentSummary || project.rawTextBrief}
            </p>
          </div>

          {/* Crew Slots Open Notice */}
          {rolesNeeded.length > 0 && (
            <div className="p-3 rounded-xl bg-[var(--card-inner-bg)]/80 border border-[var(--card-inner-border)] space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--accent-amber)]" />
                  <span>Crew Slots Open:</span>
                </p>
                <span className="text-[10px] font-mono font-bold text-[var(--accent-amber)]">
                  {rolesNeeded.length} Roles
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {rolesNeeded.slice(0, 3).map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)]"
                  >
                    {r.roleTitle}
                  </span>
                ))}
                {rolesNeeded.length > 3 && (
                  <span className="text-[10px] font-mono text-[var(--text-muted)] self-center px-1">
                    +{rolesNeeded.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Project Producer / Lead Info */}
          {project.seeker && (
            <div
              className="flex items-center gap-2.5 pt-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewCreator && project.seeker) onViewCreator(project.seeker);
                else onOpenDetail(project);
              }}
            >
              <UserAvatar
                name={project.seeker.name}
                avatarUrl={project.seeker.avatarUrl}
                size="sm"
                className="shrink-0 ring-1 ring-[var(--card-border)]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-colors truncate">
                  {project.seeker.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                  Lead Producer • {project.seeker.primaryRole}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Timeline, Budget & CTA */}
      <div className="px-5 py-3 border-t border-[var(--card-border)]/60 flex items-center justify-between bg-[var(--card-inner-bg)]/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
            <Clock className="w-3 h-3 text-[var(--accent-amber)]" />
            <span className="truncate max-w-[140px]">{project.timeline}</span>
          </div>
          <p className="text-xs font-mono font-bold text-[var(--text-primary)]">
            ₹{project.budgetUsd.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-[var(--text-muted)]">Budget</span>
          </p>
        </div>

        <button
          id={`view-project-btn-${project.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(project);
          }}
          className="text-xs font-semibold text-[var(--accent-amber)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
        >
          <span>Inspect Brief</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
