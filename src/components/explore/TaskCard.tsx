import React from 'react';
import { Briefcase, MapPin, Clock, ArrowUpRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import type { ProjectTask, CreatorProfile } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface TaskCardProps {
  task: ProjectTask;
  onOpenDetail: (task: ProjectTask) => void;
  onViewCreator?: (creator: CreatorProfile) => void;
  onApplyOrConnect?: (task: ProjectTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onOpenDetail,
  onViewCreator,
  onApplyOrConnect,
}) => {
  return (
    <article
      id={`task-card-${task.id}`}
      onClick={() => onOpenDetail(task)}
      className="card-warm-white rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Top Compensation Banner */}
        <div className="px-5 py-3 bg-[var(--card-inner-bg)]/80 border-b border-[var(--card-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)]">
              {task.requiredRole}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Escrow Verified</span>
            </span>
          </div>

          <div className="font-mono font-bold text-sm text-[var(--accent-amber)]">
            ₹{task.dayRateInr.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-[var(--text-muted)]">/day</span>
          </div>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Opportunity Title & Project Reference */}
          <div>
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors line-clamp-1">
              {task.title}
            </h3>
            <p className="text-[11px] font-mono text-[var(--accent-amber)] mt-0.5 truncate">
              Production: {task.projectTitle}
            </p>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-2">
              {task.description}
            </p>
          </div>

          {/* Required Skills Chips */}
          {task.requiredSkills && task.requiredSkills.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Required Competencies:
              </p>
              <div className="flex flex-wrap gap-1">
                {task.requiredSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)]"
                  >
                    {skill}
                  </span>
                ))}
                {task.requiredSkills.length > 3 && (
                  <span className="text-[10px] font-mono text-[var(--text-muted)] self-center px-1">
                    +{task.requiredSkills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Creator / Poster Summary */}
          {task.creator && (
            <div
              className="flex items-center gap-2.5 pt-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewCreator && task.creator) onViewCreator(task.creator);
                else onOpenDetail(task);
              }}
            >
              <UserAvatar
                name={task.creator.name}
                avatarUrl={task.creator.avatarUrl}
                size="sm"
                className="shrink-0 ring-1 ring-[var(--card-border)]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-colors truncate">
                  {task.creator.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                  Call Lead • {task.creator.primaryRole}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Location, Duration & Action */}
      <div className="px-5 py-3 border-t border-[var(--card-border)]/60 flex items-center justify-between bg-[var(--card-inner-bg)]/40">
        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--accent-amber)]" />
            <span className="truncate max-w-[90px]">{task.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[var(--text-muted)]" />
            <span>{task.durationDays}d</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyOrConnect ? (
            <button
              id={`apply-task-btn-${task.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onApplyOrConnect(task);
              }}
              className="amber-pill-btn px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md flex items-center gap-1 cursor-pointer"
            >
              <span>Apply</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              id={`view-task-btn-${task.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(task);
              }}
              className="text-xs font-semibold text-[var(--accent-amber)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
            >
              <span>Call Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
