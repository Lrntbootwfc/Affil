import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { CreatorProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'profile' | 'brief' | 'matches' | 'workspace';
  onSelectTab: (tab: 'landing' | 'dashboard' | 'profile' | 'brief' | 'matches' | 'workspace') => void;
  currentUser: CreatorProfile;
  allUsers: CreatorProfile[];
  onSwitchUser: (user: CreatorProfile) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuthModal,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] text-[var(--nav-text)] rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 sm:gap-6 backdrop-blur-xl transition-all duration-300">
          {/* Brand Logo & Editorial Title */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-amber)] flex items-center justify-center text-[var(--nav-item-active-text,#181614)] font-black text-xs tracking-tighter shadow-md">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-base sm:text-lg font-bold tracking-tight text-[var(--nav-text)]">
                Meridian
              </span>
              <span className="text-[var(--nav-subtext)] text-xs">/</span>
              <span className="text-xs font-semibold text-[var(--nav-subtext)] tracking-wide hidden sm:inline">
                Afflatus
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Clean Editorial Text-Only) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              Dashboard & Requirements
            </button>

            <button
              id="nav-tab-brief"
              onClick={() => onSelectTab('brief')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                currentTab === 'brief'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              Post Brief
            </button>

            <button
              id="nav-tab-matches"
              onClick={() => onSelectTab('matches')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                currentTab === 'matches'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              Matches
            </button>

            <button
              id="nav-tab-workspace"
              onClick={() => onSelectTab('workspace')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                currentTab === 'workspace'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              Shoot Blueprint
            </button>

            <button
              id="nav-tab-landing"
              onClick={() => onSelectTab('landing')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                currentTab === 'landing'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              About Platform
            </button>
          </nav>

          {/* Right Actions: Light/Dark Mode Switcher, Persona Switcher & Post Brief CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Light / Dark Mode Toggle Button */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label={`Toggle theme (currently ${theme})`}
            >
              {theme === 'dark' || theme === 'midnight' || theme === 'emerald' || theme === 'monochrome' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--accent-amber)] animate-pulse" />
                  <span className="text-[11px] font-medium text-[var(--nav-text)] hidden lg:inline capitalize">{theme}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  <span className="text-[11px] font-medium text-[var(--nav-text)] hidden lg:inline capitalize">{theme}</span>
                </>
              )}
            </button>

            {/* Persona Switcher */}
            <button
              id="btn-nav-auth"
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all cursor-pointer"
              title="Switch persona or sign in"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-[var(--accent-amber)]/80"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] flex items-center justify-center text-[10px] font-bold">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-xs font-medium text-[var(--nav-text)] hidden sm:inline">
                {currentUser?.name?.split(' ')[0] || 'User'}
              </span>
              <span className="text-[10px] text-[var(--nav-subtext)] font-mono">▼</span>
            </button>

            <button
              id="btn-nav-get-started"
              onClick={() => onSelectTab('brief')}
              className="amber-pill-btn px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>+ Post Brief</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
