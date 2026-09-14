import React, { useState } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Camera,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle2,
} from 'lucide-react';
import type { CreatorProfile, ExploreCreatorItem } from '../../types';
import { UserAvatar } from '../UserAvatar';

interface CreatorDetailModalProps {
  creator: (CreatorProfile | ExploreCreatorItem) | null;
  onClose: () => void;
  currentUser: CreatorProfile | null;
  onConnect: (creator: CreatorProfile | ExploreCreatorItem) => void;
}

export const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({
  creator,
  onClose,
  currentUser,
  onConnect,
}) => {
  if (!creator) return null;

  const discoveryReason = (creator as ExploreCreatorItem).discoveryReason;

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

        {/* Cover Banner */}
        {creator.coverImageUrl ? (
          <div className="h-44 w-full relative overflow-hidden bg-[var(--card-border)]">
            <img src={creator.coverImageUrl} alt={creator.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>
        ) : (
          <div className="h-20 w-full bg-[var(--card-inner-border)]" />
        )}

        <div className="p-6 sm:p-8 space-y-6 pt-2">
          {/* Avatar & Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex items-end gap-3.5">
              <UserAvatar
                name={creator.name}
                avatarUrl={creator.avatarUrl}
                size="lg"
                className="ring-4 ring-[var(--card-bg)] shadow-xl"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                    {creator.name}
                  </h2>
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-amber)]" />
                </div>
                <p className="text-xs font-mono text-[var(--accent-amber)]">@{creator.username}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--card-inner-bg)] text-[var(--text-primary)] border border-[var(--card-inner-border)]">
                  {creator.primaryRole}
                </span>
              </div>
            </div>

            {/* Rates & Location Pill */}
            <div className="p-2.5 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] space-y-0.5 text-xs shrink-0">
              <div className="flex items-center gap-1 text-[var(--text-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span>{creator.location || 'Mumbai, India'}</span>
              </div>
              <p className="font-mono font-bold text-[var(--text-primary)]">
                ₹{(creator.dayRateUsd || 25000).toLocaleString('en-IN')}/day
              </p>
            </div>
          </div>

          {/* Discovery Reason / Context banner if present */}
          {discoveryReason && (
            <div className="p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--accent-amber)]/30 flex items-start gap-2 text-xs text-[var(--text-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-amber)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--accent-amber)] mr-1">Discovery Signal:</span>
                <span>{discoveryReason}</span>
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Professional Bio &amp; Craft Statement
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {creator.bio || 'Experienced production artisan available for commercial and narrative productions.'}
            </p>
          </div>

          {/* Seeking Collaborators */}
          {creator.seekingRoles && creator.seekingRoles.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Actively Seeking Collaboration With:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {creator.seekingRoles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--text-primary)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Equipment / Gear Kit */}
          {creator.gearItems && creator.gearItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span>Verified Production Equipment</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {creator.gearItems.map((gear) => (
                  <div
                    key={gear.id}
                    className="p-2.5 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[var(--text-primary)] truncate">{gear.model}</span>
                    <span className="text-[10px] font-mono text-[var(--accent-amber)] uppercase font-semibold">
                      {gear.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work / Portfolio items */}
          {creator.portfolioItems && creator.portfolioItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Portfolio Links &amp; Showreels
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creator.portfolioItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] flex items-center justify-between gap-2 group transition-colors cursor-pointer"
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-amber)]">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] capitalize">{item.platform}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-amber)] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {creator.socialLinks && (
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
              {creator.socialLinks.linkedin && (
                <a
                  href={creator.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-amber)]"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {creator.socialLinks.instagram && (
                <a
                  href={creator.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-amber)]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {creator.socialLinks.twitter && (
                <a
                  href={creator.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-amber)]"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {creator.socialLinks.custom && (
                <a
                  href={creator.socialLinks.custom}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[var(--card-inner-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-amber)]"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => onConnect(creator)}
              className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect / Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
