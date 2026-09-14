import React, { useState } from 'react';
import {
  X,
  Settings,
  Bell,
  CheckCircle2,
  Globe,
  Palette,
  Shield,
  Smartphone,
  Sparkles,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { CreatorProfile } from '../types';
import { deleteAccountAndData } from '../lib/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CreatorProfile;
  onOpenThemes?: () => void;
  onAccountDeleted?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenThemes,
  onAccountDeleted,
}) => {
  const { palette, mode, availablePalettes } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppProposals, setInAppProposals] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [autoMatchAlerts, setAutoMatchAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPaletteObj = availablePalettes.find((p) => p.id === palette);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Type DELETE to confirm account deletion.');
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      // Only the signed-in owner can delete (enforced in deleteAccountAndData + Firestore rules)
      await deleteAccountAndData();
      onAccountDeleted?.();
      onClose();
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete account. You may need to re-authenticate and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-warm-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--card-border)] relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Account &amp; Platform Settings
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Manage notifications, discovery privacy, and platform preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--card-inner-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-6">
          
          {/* Quick Theme Shortcut Card */}
          <div className="p-4 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  Active Theme: {currentPaletteObj?.name || 'Warm Editorial'} ({mode} mode)
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {currentPaletteObj?.tagline}
                </p>
              </div>
            </div>

            {onOpenThemes && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenThemes();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--accent-amber)] text-[#181614] shadow-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Change Theme
              </button>
            )}
          </div>

          {/* Notifications Toggles */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Notification Preferences
            </p>
            
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[var(--accent-amber)]" />
                <span className="text-xs text-[var(--text-primary)] font-medium">
                  Email match alerts &amp; inquiries
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-amber)] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[var(--accent-amber)]" />
                <span className="text-xs text-[var(--text-primary)] font-medium">
                  Direct collaboration proposals
                </span>
              </div>
              <input
                type="checkbox"
                checked={inAppProposals}
                onChange={(e) => setInAppProposals(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-amber)] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[var(--accent-amber)]" />
                <span className="text-xs text-[var(--text-primary)] font-medium">
                  Daily curated role match digest
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoMatchAlerts}
                onChange={(e) => setAutoMatchAlerts(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-amber)] cursor-pointer"
              />
            </label>
          </div>

          {/* Privacy & Discovery */}
          <div className="space-y-3 pt-2 border-t border-[var(--card-border)]">
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Discovery &amp; Security
            </p>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[var(--accent-amber)]" />
                <div>
                  <span className="text-xs text-[var(--text-primary)] font-medium block">
                    Public Creator Directory
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Allow directors and producers to find your verified profile
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-amber)] cursor-pointer"
              />
            </label>

            <div className="p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[var(--accent-amber)] shrink-0" />
              <div className="text-xs">
                <span className="font-medium text-[var(--text-primary)] block">Verified Production Security</span>
                <span className="text-[10px] text-[var(--text-muted)]">Encrypted end-to-end proposals &amp; rate protection</span>
              </div>
            </div>
          </div>

          {/* Danger Zone — Delete Account */}
          <div className="space-y-3 pt-2 border-t border-[var(--card-border)]">
            <p className="text-[11px] font-bold text-red-500/90 uppercase tracking-wider">
              Danger Zone
            </p>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setDeleteError(null);
                  setDeleteConfirmText('');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <div>
                    <span className="text-xs text-red-500 font-medium block">
                      Delete Account
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      Permanently remove your profile and authentication account
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/25 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-[var(--text-primary)] space-y-1">
                    <p className="font-bold text-red-500">Confirm account deletion</p>
                    <p className="text-[var(--text-muted)]">
                      This will permanently delete your Firestore profile data and Firebase Auth account for{' '}
                      <strong className="text-[var(--text-primary)]">{currentUser.email || currentUser.name}</strong>.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                    Type <span className="font-mono font-bold text-red-500">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-red-500/50"
                    autoComplete="off"
                  />
                </div>
                {deleteError && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {deleteError}
                  </p>
                )}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                      setDeleteError(null);
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting…</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete My Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--card-border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="amber-pill-btn px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
