import React, { useEffect, useState } from 'react';
import { X, Briefcase, MapPin, Clock, MessageSquare, Sparkles, Users, ArrowRight } from 'lucide-react';
import type { ProjectTask, CreatorProfile, Project } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface TaskDetailModalProps {
  task: ProjectTask | null;
  onClose: () => void;
  currentUser: CreatorProfile | null;
  onViewCreator: (creator: CreatorProfile) => void;
  onApplyOrConnect: (task: ProjectTask) => void;
  onSelectProject?: (project: Project) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  currentUser,
  onViewCreator,
  onApplyOrConnect,
  onSelectProject,
}) => {
  const [parentProject, setParentProject] = useState<Project | null>(null);
  const [matchingCreators, setMatchingCreators] = useState<CreatorProfile[]>([]);

  useEffect(() => {
    if (!task) return;
    fetch(`/api/explore/task/${task.id}/related`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.relatedProjects && data.relatedProjects.length > 0) {
            setParentProject(data.relatedProjects[0]);
          }
          setMatchingCreators(data.relatedCreators || []);
        }
      })
      .catch((err) => console.error('Failed to load related task items:', err));
  }, [task?.id]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-warm-white w-full max-w-xl rounded-3xl shadow-2xl border border-[var(--card-border)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Role Tag */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] border border-[var(--card-inner-border)]">
                  {task.requiredRole}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize">
                  {task.status === 'open' ? 'Open Callout' : task.status.replace('_', ' ')}
                </span>
              </div>

              <span className="text-sm font-mono font-bold text-[var(--accent-amber)] bg-[var(--card-inner-bg)] px-3 py-1 rounded-full border border-[var(--card-inner-border)]">
                ₹{task.dayRateInr.toLocaleString('en-IN')}/day
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {task.title}
            </h2>

            {parentProject ? (
              <div
                className="flex items-center gap-1.5 text-xs text-[var(--accent-amber)] font-medium cursor-pointer hover:underline"
                onClick={() => {
                  if (onSelectProject) onSelectProject(parentProject);
                }}
              >
                <span>Project: {parentProject.title}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            ) : (
              <p className="text-xs text-[var(--accent-amber)] font-medium">
                Project: {task.projectTitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                {task.location}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                {task.durationDays} Production Days
              </span>
              {task.deadline && (
                <span className="text-xs font-mono text-[var(--accent-amber)] font-semibold">
                  Deadline: {task.deadline}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Task Description */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Role Scope &amp; Responsibilities
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Required Skills & Equipment Competencies */}
          {task.requiredSkills && task.requiredSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Must-Have Competencies &amp; Gear
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {task.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creator Attribution */}
          {task.creator && (
            <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (task.creator) onViewCreator(task.creator);
                }}
              >
                <UserAvatar
                  name={task.creator.name}
                  avatarUrl={task.creator.avatarUrl}
                  size="md"
                  className="shrink-0 ring-2 ring-[var(--card-border)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                    {task.creator.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Posted by • {task.creator.primaryRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (task.creator) onViewCreator(task.creator);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-border)] cursor-pointer"
              >
                View Profile
              </button>
            </div>
          )}

          {/* Work -> People Discovery: Creators in this role */}
          {matchingCreators.length > 0 && (
            <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--accent-amber)]" />
                  <span>Other Verified {task.requiredRole}s</span>
                </h4>
                <span className="text-[11px] text-[var(--text-muted)]">Work-to-People Discovery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingCreators.slice(0, 2).map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => onViewCreator(creator)}
                    className="p-3 rounded-2xl bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <UserAvatar name={creator.name} avatarUrl={creator.avatarUrl} size="sm" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{creator.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{creator.location}</p>
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

          {/* Modal Actions */}
          <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
            >
              Back
            </button>

            <button
              id="apply-task-btn"
              onClick={() => onApplyOrConnect(task)}
              className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Apply for Role / Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
