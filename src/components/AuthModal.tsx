import React, { useState } from 'react';
import {
  X,
  Check,
  Mail,
  Lock,
  LogOut,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { CreatorProfile } from '../types';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from '../lib/firebase';
import { UserAvatar } from './UserAvatar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CreatorProfile;
  allUsers: CreatorProfile[];
  onSwitchUser: (user: CreatorProfile) => void;
  onUserSignedIn?: (user: CreatorProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSwitchUser,
  onUserSignedIn,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Cinematographer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { profile } = await signInWithGoogle(email?.includes('@') ? email.trim() : undefined, name?.trim() || undefined);
      setSuccessMessage(`Welcome, ${profile.name}! Connected with Google.`);
      if (onUserSignedIn) onUserSignedIn(profile);
      onSwitchUser(profile);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        console.info('[Auth] Google sign-in dismissed by user.');
        setErrorMessage(null);
      } else {
        console.error('Google sign in error:', err);
        setErrorMessage(err?.message || 'Google sign-in encountered an error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (isRegister: boolean) => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let profile: CreatorProfile;
      if (isRegister) {
        const res = await signUpWithEmail(email, password, name, role);
        profile = res.profile;
        setSuccessMessage(`Account created! Welcome, ${profile.name}.`);
      } else {
        const res = await signInWithEmail(email, password);
        profile = res.profile;
        setSuccessMessage(`Signed in as ${profile.name}!`);
      }
      if (onUserSignedIn) onUserSignedIn(profile);
      onSwitchUser(profile);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Email auth error:', err);
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="card-obsidian rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden border border-[var(--card-border)]">
        {/* Accent Corner Glow */}
        <div className="absolute top-0 right-1/4 w-36 h-36 bg-[var(--accent-amber)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="editorial-kicker text-[10px] mb-1">
              <span>AUTHENTICATION &amp; PROFILE SYNC</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              Filmmaker Access
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Connect via Google or Email to sync your exchange dossier
            </p>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-2 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border border-[var(--card-inner-border)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[var(--card-inner-bg)] p-1 rounded-full border border-[var(--card-inner-border)] relative z-10">
          <button
            id="tab-btn-signin"
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-btn-signup"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#FCA5A5] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#F87171]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-2xl bg-[#34D399]/15 border border-[#34D399]/40 text-[#6EE7B7] text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-[#34D399]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Currently Active User Indicator */}
        <div className="p-3.5 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={currentUser.name}
              avatarUrl={currentUser.avatarUrl}
              size="sm"
              className="ring-1 ring-[var(--accent-amber)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--text-primary)]">{currentUser.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]">
                  {currentUser.primaryRole}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px]">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-inner-border)] border border-[var(--card-inner-border)] flex items-center gap-1 transition-colors cursor-pointer"
            title="Sign out current session"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab 1: Sign In (Google & Email) */}
        {activeTab === 'signin' && (
          <div className="space-y-4 relative z-10">
            {/* Real Google Sign-In Button */}
            <button
              id="btn-google-signin"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer border border-neutral-300"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[var(--card-inner-border)]" />
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                or sign in with email
              </span>
              <div className="flex-1 h-px bg-[var(--card-inner-border)]" />
            </div>

            <div className="space-y-2.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@studio.com"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)] transition-colors"
                />
              </div>

              <button
                id="btn-email-signin-submit"
                onClick={() => handleEmailAuth(false)}
                disabled={isLoading}
                className="amber-pill-btn w-full py-2.5 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Sign In to Workspace</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Create Account */}
        {activeTab === 'signup' && (
          <div className="space-y-3.5 relative z-10">
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@cinematography.com"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">Primary Discipline</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-amber)]"
                >
                  <option value="Cinematographer">Cinematographer / DP</option>
                  <option value="Director">Director / Creator</option>
                  <option value="Location Sound Recordist">Location Sound Recordist</option>
                  <option value="Gaffer">Gaffer / Lighting Lead</option>
                  <option value="Commercial Director">Commercial Director</option>
                </select>
              </div>

              <button
                id="btn-email-signup-submit"
                onClick={() => handleEmailAuth(true)}
                disabled={isLoading}
                className="amber-pill-btn w-full py-2.5 mt-2 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Register &amp; Create Firestore Profile</span>
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[var(--card-inner-border)] text-center">
          <p className="text-[10px] text-[var(--text-muted)]">
            Encrypted with Firebase Auth &amp; Firestore database synchronization.
          </p>
        </div>
      </div>
    </div>
  );
};
