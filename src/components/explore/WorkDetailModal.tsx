import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Play, Heart, Users, Sparkles, Layers, Briefcase } from 'lucide-react';
import type { WorkShowcase, CreatorProfile, Project, ProjectTask, CreativeClub } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface WorkDetailModalProps {
  work: WorkShowcase | null;
  onClose: () => void;
  onViewCreator: (creator: CreatorProfile) => void;
  onSelectProject?: (project: Project) => void;
  onSelectTask?: (task: ProjectTask) => void;
  onSelectClub?: (club: CreativeClub) => void;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  work,
  onClose,
  onViewCreator,
  onSelectProject,
  onSelectTask,
  onSelectClub,
}) => {
  const [relatedCreators, setRelatedCreators] = useState<CreatorProfile[]>([]);
  const [relatedClubs, setRelatedClubs] = useState<CreativeClub[]>([]);
  const [relatedTasks, setRelatedTasks] = useState<ProjectTask[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (!work) return;
    setLoadingRelated(true);
    fetch(`/api/explore/work/${work.id}/related`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRelatedCreators(data.relatedCreators || []);
          setRelatedClubs(data.relatedClubs || []);
          setRelatedTasks(data.relatedTasks || []);
        }
      })
      .catch((err) => console.error('Failed to load related explore items:', err))
      .finally(() => setLoadingRelated(false));
  }, [work?.id]);

  if (!work) return null;

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

        {/* Media Banner */}
        <div className="h-56 w-full relative overflow-hidden bg-[var(--card-border)]">
          {work.thumbnailUrl ? (
            <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--card-inner-bg)] flex items-center justify-center">
              <Layers className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-white">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)]">
                {work.category}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold mt-1 text-white">
                {work.title}
              </h2>
            </div>

            {work.linkUrl && (
              <a
                href={work.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="amber-pill-btn px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open {work.platform}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Creator Profile Link & Attribution */}
          {work.creator && (
            <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (work.creator) onViewCreator(work.creator);
                }}
              >
                <UserAvatar
                  name={work.creator.name}
                  avatarUrl={work.creator.avatarUrl}
                  size="md"
                  className="shrink-0 ring-2 ring-[var(--card-border)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                    {work.creator.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {work.creator.primaryRole} • {work.creator.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (work.creator) onViewCreator(work.creator);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-border)] cursor-pointer"
              >
                View Profile
              </button>
            </div>
          )}

          {/* Detailed Synopsis / Notes */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Case Study &amp; Production Overview
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {work.description}
            </p>
          </div>

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Work -> People Discovery: Roles Involved & Matching Talent */}
          <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[var(--accent-amber)]" />
                <span>Collaborating Crafts &amp; Talent</span>
              </h4>
              <span className="text-[11px] text-[var(--text-muted)]">Work-to-People Discovery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedCreators.map((creator) => (
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
                    View
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Opportunities & Clubs */}
          {(relatedTasks.length > 0 || relatedClubs.length > 0) && (
            <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
                <span>Related Opportunities &amp; Guilds</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask && onSelectTask(task)}
                    className="p-3 rounded-2xl bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] border border-[var(--card-inner-border)] cursor-pointer space-y-1"
                  >
                    <span className="text-[10px] font-mono text-[var(--accent-amber)] uppercase font-semibold">
                      Open Slot • ₹{task.dayRateInr.toLocaleString('en-IN')}/day
                    </span>
                    <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{task.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{task.projectTitle}</p>
                  </div>
                ))}

                {relatedClubs.map((club) => (
                  <div
                    key={club.id}
                    onClick={() => onSelectClub && onSelectClub(club)}
                    className="p-3 rounded-2xl bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] border border-[var(--card-inner-border)] cursor-pointer space-y-1"
                  >
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                      Guild • {club.memberCount} Members
                    </span>
                    <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{club.name}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">{club.tagline}</p>
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
