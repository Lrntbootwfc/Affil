import React, { useState } from 'react';
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import type { CreatorProfile } from '../types';
import { ROLE_CATEGORIES } from '../constants/roles';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from '../lib/firebase';

interface AuthScreenProps {
  onLoginSuccess: (profile: CreatorProfile, isNewSignup: boolean) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  // Mode: 'login' | 'signup' | 'otp_verify'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp_verify'>('login');

  // Login Tab: 'email' | 'username'
  const [loginMethod, setLoginMethod] = useState<'email' | 'username'>('email');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Signup Specific Fields
  const [fullName, setFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('Cinematographer');

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [activeOtpEmail, setActiveOtpEmail] = useState('');
  const [receivedOtpNotice, setReceivedOtpNotice] = useState<string | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Submit Login Form — Firebase Auth + Firestore profile (source of truth)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage(`Please enter your ${loginMethod === 'username' ? 'username' : 'email address'}.`);
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Username login is not supported by Firebase email/password; require email
      const email = identifier.includes('@')
        ? identifier.trim().toLowerCase()
        : `${identifier.trim().toLowerCase().replace(/^@/, '')}@afflatus.local`;

      if (loginMethod === 'username' && !identifier.includes('@')) {
        // Fallback: try server for legacy username accounts, then still prefer Firestore if present
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailOrUsername: identifier,
            password,
            loginType: loginMethod,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to authenticate');
        // If legacy user has a real email, attempt Firebase session so profile lives in Firestore
        if (data.fullProfile?.email && data.fullProfile.email.includes('@')) {
          try {
            const { profile } = await signInWithEmail(data.fullProfile.email, password);
            onLoginSuccess(profile, false);
            return;
          } catch {
            // continue with server profile for this session only
          }
        }
        onLoginSuccess(data.fullProfile, false);
        return;
      }

      const { profile } = await signInWithEmail(email, password);
      onLoginSuccess(profile, false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Request Real OTP during Signup
  const handleRequestOtpSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !signupEmail.trim() || !password) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          username: signupUsername || fullName.toLowerCase().replace(/\s+/g, '_'),
          email: signupEmail,
          password,
          primaryRole: signupRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP code');
      }

      setActiveOtpEmail(signupEmail);
      if (data.otp) {
        setReceivedOtpNotice(data.otp);
      }
      setSuccessNotice(`Verification code sent to ${signupEmail}!`);
      setAuthMode('otp_verify');
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed. Please try another email or username.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP Code and complete account creation via Firebase Auth + Firestore
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Validate OTP with server (email delivery / rate-limit only)
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activeOtpEmail,
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired OTP code');
      }

      // Create Firebase Auth user + Firestore profile (persistent source of truth)
      const { profile } = await signUpWithEmail(
        activeOtpEmail.trim().toLowerCase(),
        password,
        fullName.trim() || activeOtpEmail.split('@')[0],
        signupRole
      );

      // Merge any extra fields from server response if present
      if (data.fullProfile?.username) {
        const merged = {
          ...profile,
          username: data.fullProfile.username,
          primaryRole: data.fullProfile.primaryRole || profile.primaryRole,
          seekingRoles: data.fullProfile.seekingRoles || profile.seekingRoles,
        };
        const { updateProfileInFirestore } = await import('../lib/firebase');
        const saved = await updateProfileInFirestore(merged);
        onLoginSuccess(saved, true);
      } else {
        onLoginSuccess(profile, true);
      }
    } catch (err: any) {
      // If email already registered in Firebase, sign in instead
      if (err?.code === 'auth/email-already-in-use') {
        try {
          const { profile } = await signInWithEmail(activeOtpEmail.trim().toLowerCase(), password);
          onLoginSuccess(profile, false);
          return;
        } catch (signInErr: any) {
          setErrorMessage(signInErr.message || 'Account exists. Please log in.');
          return;
        }
      }
      setErrorMessage(err.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          username: signupUsername,
          email: activeOtpEmail,
          password,
          primaryRole: signupRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');
      if (data.otp) setReceivedOtpNotice(data.otp);
      setSuccessNotice('New verification code sent!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google / Gmail Authentication via Firebase Auth + Firestore profile
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const inputEmail = identifier?.includes('@') ? identifier.trim() : (signupEmail?.includes('@') ? signupEmail.trim() : undefined);
      const inputName = fullName?.trim() || undefined;
      // signInWithGoogle already upserts the profile into Firestore
      const { profile: fbProfile } = await signInWithGoogle(inputEmail, inputName);
      const isNew = !fbProfile.profileCompleted;
      onLoginSuccess(fbProfile, isNew);
    } catch (err: any) {
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('popup-closed-by-user')
      ) {
        console.info('[Auth] Google Sign-In dismissed by user.');
        setErrorMessage(null);
      } else {
        console.error('Google Sign In Error:', err);
        setErrorMessage(err.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 selection:bg-[#E58B13] selection:text-white">
      <div className="max-w-md w-full space-y-6">
        
        {/* Card Container */}
        <div className="card-warm-white rounded-3xl p-7 sm:p-8 shadow-2xl relative border border-[var(--card-border)]">
          
          {/* Top Mode Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="editorial-kicker justify-center">
              <span>
                {authMode === 'login'
                  ? 'WELCOME BACK'
                  : authMode === 'otp_verify'
                  ? 'VERIFY YOUR EMAIL'
                  : 'JOIN THE NETWORK'}
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {authMode === 'login'
                ? 'Sign in to Afflatus'
                : authMode === 'otp_verify'
                ? 'Enter 6-Digit OTP Code'
                : 'Create Your Profile'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {authMode === 'login'
                ? 'Access your matches, direct proposals, and project blueprints.'
                : authMode === 'otp_verify'
                ? `We sent an authentic verification code to ${activeOtpEmail}`
                : 'Build your verified creator card and find tailored collaborators.'}
            </p>
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 mb-4 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. DUAL LOGIN FLOW */}
          {authMode === 'login' && (
            <div className="space-y-5">
              
              {/* Dynamic Tab Switcher: [ Login with Email ] | [ Login with Username ] */}
              <div className="bg-[var(--card-inner-bg)] p-1 rounded-2xl border border-[var(--card-inner-border)] flex items-center">
                <button
                  type="button"
                  id="tab-login-email"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'email'
                      ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Login with Email</span>
                </button>

                <button
                  type="button"
                  id="tab-login-username"
                  onClick={() => {
                    setLoginMethod('username');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loginMethod === 'username'
                      ? 'bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login with Username</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    {loginMethod === 'username' ? 'Creator Username' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {loginMethod === 'username' ? (
                      <span className="absolute left-3.5 top-2.5 text-xs text-[var(--text-muted)] font-mono font-bold">@</span>
                    ) : (
                      <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                    )}
                    <input
                      id="input-login-identifier"
                      type={loginMethod === 'username' ? 'text' : 'email'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={loginMethod === 'username' ? 'e.g. aman_sharma_dp' : 'name@cinema.io'}
                      required
                      className={`w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl ${
                        loginMethod === 'username' ? 'pl-8' : 'pl-10'
                      } pr-3.5 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13] transition-colors`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      (demo: password123)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-login"
                  disabled={isLoading}
                  className="amber-pill-btn w-full py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>[ Login ]</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 2. SIGNUP FLOW (With OTP request) */}
          {authMode === 'signup' && (
            <form onSubmit={handleRequestOtpSignup} className="space-y-4">
              
              <div className="p-3 bg-[#E58B13]/10 border border-[#E58B13]/30 rounded-2xl text-[11px] text-[var(--text-primary)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#E58B13] shrink-0 mt-0.5" />
                <span>
                  <strong>Real OTP Verification:</strong> We'll send a 6-digit confirmation code to verify your creator email address.
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    id="input-signup-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!signupUsername) {
                        setSignupUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                      }
                    }}
                    placeholder="e.g. Maya Chen"
                    required
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13]"
                  />
                </div>
              </div>

              {/* Unique Username Input Field */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Create Unique Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-[#E58B13] font-mono font-bold">@</span>
                  <input
                    id="input-signup-username"
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="maya_chen_films"
                    required
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-8 pr-3.5 py-2.5 text-xs font-mono text-[var(--input-text)] focus:outline-none focus:border-[#E58B13]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    id="input-signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="maya@visions.net"
                    required
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13]"
                  />
                </div>
              </div>

              {/* Comprehensive Categorized Role Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Primary Role / What You Offer *
                </label>
                <select
                  id="select-signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl px-3.5 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13]"
                >
                  {ROLE_CATEGORIES.map((cat) => (
                    <optgroup key={cat.category} label={`── ${cat.category} ──`}>
                      {cat.roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Set Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    id="input-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[#E58B13]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Request OTP Button */}
              <button
                type="submit"
                id="btn-submit-signup"
                disabled={isLoading}
                className="amber-pill-btn w-full py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <span className="animate-pulse">Generating OTP Code...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>[ Send OTP &amp; Verify Email ]</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. OTP CODE VERIFICATION SCREEN */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              
              {/* Live OTP Notification Pill for instant preview verification */}
              {receivedOtpNotice && (
                <div className="p-3 bg-[#E58B13]/15 border border-[#E58B13]/40 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-[#E58B13] uppercase tracking-wider block">
                    Security Code Sent:
                  </span>
                  <div className="font-mono text-2xl font-black tracking-widest text-[var(--text-primary)]">
                    {receivedOtpNotice}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    (In preview mode, your live OTP is displayed above for instant confirmation)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    id="input-otp-code"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    autoFocus
                    required
                    className="w-full bg-[var(--input-bg)] border-2 border-[#E58B13] rounded-2xl py-3 text-center text-xl font-mono tracking-widest font-bold text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[#E58B13]"
                  />
                </div>
              </div>

              {/* Quick fill button */}
              {receivedOtpNotice && (
                <button
                  type="button"
                  onClick={() => setOtpCode(receivedOtpNotice)}
                  className="w-full py-1.5 text-[11px] font-mono text-[#E58B13] hover:underline cursor-pointer text-center"
                >
                  ⚡ Preview verification code: {receivedOtpNotice}
                </button>
              )}

              <button
                type="submit"
                id="btn-verify-otp-submit"
                disabled={isLoading}
                className="amber-pill-btn w-full py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <span className="animate-pulse">Verifying Code...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>[ Verify &amp; Create Profile ]</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  ← Edit details
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#E58B13] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              </div>

            </form>
          )}

          {/* Divider */}
          {authMode !== 'otp_verify' && (
            <>
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--card-border)]" />
                </div>
                <span className="relative px-3 bg-[var(--card-bg)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* Google / Gmail 1-Click Button */}
              <button
                type="button"
                id="btn-auth-google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--tag-bg)] text-[var(--text-primary)] border border-[var(--card-inner-border)] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
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
                <span>Continue with Google</span>
              </button>

              {/* Toggle between Login and Signup */}
              <div className="mt-6 text-center pt-2">
                <button
                  type="button"
                  id="btn-toggle-auth-mode"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setErrorMessage(null);
                    setSuccessNotice(null);
                  }}
                  className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[#E58B13] transition-colors cursor-pointer"
                >
                  {authMode === 'login'
                    ? "Don't have a profile yet? Create an Account"
                    : 'Already have an account? Sign in here'}
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
