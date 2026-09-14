import React, { useEffect, useState } from 'react';
import { X, Briefcase, MapPin, Calendar, Sparkles, Users, MessageSquare, ShieldCheck } from 'lucide-react';
import type { Project, CreatorProfile, ProjectTask, CreativeClub } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  currentUser: CreatorProfile | null;
  onViewCreator: (creator: CreatorProfile) => void;
  onConnectWithLead: (seeker: CreatorProfile, defaultMessage?: string) => void;
  onSelectTask?: (task: ProjectTask) => void;
  onSelectClub?: (club: CreativeClub) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  currentUser,
  onViewCreator,
  onConnectWithLead,
  onSelectTask,
  onSelectClub,
}) => {
  const [matchingCreators, setMatchingCreators] = useState<CreatorProfile[]>([]);
  const [relatedTasks, setRelatedTasks] = useState<ProjectTask[]>([]);
  const [relatedClubs, setRelatedClubs] = useState<CreativeClub[]>([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    fetch(`/api/explore/project/${project.id}/related`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMatchingCreators(data.relatedCreators || []);
          setRelatedTasks(data.relatedTasks || []);
          setRelatedClubs(data.relatedClubs || []);
        }
      })
      .catch((err) => console.error('Failed to load related project items:', err));
  }, [project?.id]);

  if (!project) return null;

  const rolesNeeded = project.parsedRequirements?.rolesNeeded || [];

  const filteredCreators = selectedRoleFilter
    ? matchingCreators.filter((c) =>
        c.primaryRole.toLowerCase().includes(selectedRoleFilter.toLowerCase())
      )
    : matchingCreators;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-warm-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[var(--card-border)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Genre Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {project.genreTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--accent-amber)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {project.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                {project.location}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                {project.timeline}
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)]">
                ₹{project.budgetUsd.toLocaleString('en-IN')} Est. Budget
              </span>
            </div>
          </div>

          {/* Project Lead Card */}
          {project.seeker && (
            <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (project.seeker) onViewCreator(project.seeker);
                }}
              >
                <UserAvatar
                  name={project.seeker.name}
                  avatarUrl={project.seeker.avatarUrl}
                  size="md"
                  className="shrink-0 ring-2 ring-[var(--card-border)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-amber)] transition-colors">
                    {project.seeker.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Project Lead • {project.seeker.primaryRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (project.seeker) onViewCreator(project.seeker);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-border)] cursor-pointer"
              >
                View Profile
              </button>
            </div>
          )}

          {/* Dynamic Brief & Creative Intent */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Creative Intent &amp; Project Scope
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.parsedRequirements?.dynamicIntentSummary || project.rawTextBrief}
            </p>
          </div>

          {/* Confirmed Collaborators / Crew */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span>Confirmed Project Collaborators ({project.collaborators.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.collaborators.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onViewCreator(c)}
                    className="p-2.5 rounded-xl bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <UserAvatar name={c.name} avatarUrl={c.avatarUrl} size="sm" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{c.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{c.primaryRole}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--accent-amber)] font-semibold shrink-0">Profile</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roles Needed Section */}
          {rolesNeeded.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
                <span>Open Crew Positions ({rolesNeeded.length})</span>
              </h4>

              <div className="space-y-2.5">
                {rolesNeeded.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[var(--text-primary)]">
                          {role.roleTitle}
                        </span>
                        {role.estimatedDayRateUsd && (
                          <span className="text-[11px] font-mono font-semibold text-[var(--accent-amber)]">
                            ₹{role.estimatedDayRateUsd.toLocaleString('en-IN')}/day
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.mustHaveSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-secondary)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedRoleFilter(
                          selectedRoleFilter === role.roleTitle ? null : role.roleTitle
                        )
                      }
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--card-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-primary)] border border-[var(--card-border)] shrink-0 cursor-pointer text-center"
                    >
                      {selectedRoleFilter === role.roleTitle ? 'Show All' : 'Find Matches'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work -> People Discovery: Suggested Matching Creators */}
          {filteredCreators.length > 0 && (
            <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--accent-amber)]" />
                  <span>
                    {selectedRoleFilter
                      ? `Matching Creators for "${selectedRoleFilter}"`
                      : 'Recommended Creators for This Project'}
                  </span>
                </h4>
                <span className="text-[11px] text-[var(--text-muted)]">Work-to-People Discovery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCreators.slice(0, 4).map((creator) => (
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

          {/* Modal Actions */}
          <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
            >
              Back to Explore
            </button>

            {project.seeker && (
              <button
                id="connect-project-lead-btn"
                onClick={() => {
                  onConnectWithLead(
                    project.seeker!,
                    `Hi ${project.seeker?.name}, I saw your project brief "${project.title}" on Explore and would like to collaborate.`
                  );
                }}
                className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Connect with Project Lead</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
