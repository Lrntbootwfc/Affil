import React from 'react';
import { ShieldAlert, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface GatedActionNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
  actionTitle?: string;
  isLoggedIn: boolean;
}

export const GatedActionNoticeModal: React.FC<GatedActionNoticeModalProps> = ({
  isOpen,
  onClose,
  onCompleteProfile,
  actionTitle = 'Collaborate & Connect',
  isLoggedIn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-warm-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--card-border)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30 text-[var(--accent-amber)] flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
          {isLoggedIn ? 'Complete Your Profile First' : 'Sign In to Connect'}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
          {isLoggedIn
            ? `To unlock "${actionTitle}" and submit proposals on projects or opportunities, your profile needs your primary role, day rates, and base location verified.`
            : `To unlock "${actionTitle}", save bookmarks, and submit proposals on projects or opportunities, please sign in or register your creator account.`}
        </p>

        <div className="my-4 p-3 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] space-y-2 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0" />
            <span>Unrestricted browsing in Explore is always free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-amber)] shrink-0" />
            <span>Verified credentials protect producers &amp; crew</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex-1 py-2.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
          >
            Continue Exploring
          </button>

          <button
            onClick={() => {
              onClose();
              onCompleteProfile();
            }}
            className="amber-pill-btn w-full sm:w-auto flex-1 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isLoggedIn ? 'Complete Profile' : 'Sign In / Register'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
