import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Settings,
  LogOut,
  Edit3,
  Sparkles,
  ChevronDown,
  Palette,
  Compass,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserAvatar } from './UserAvatar';
import type { CreatorProfile } from '../types';
import { NotificationsPanel } from './messaging/NotificationsPanel';
import { subscribeToNotifications } from '../lib/firebase';

interface HeaderNavProps {
  currentScreen: 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'explore';
  onNavigate: (screen: 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'explore') => void;
  currentUser: CreatorProfile | null;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenThemes: () => void;
  onOpenAssistant?: () => void;
  onOpenMessenger?: (connectionId?: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  currentUser,
  onLogout,
  onOpenSettings,
  onOpenThemes,
  onOpenAssistant,
  onOpenMessenger,
}) => {
  const { mode, toggleTheme, palette, availablePalettes } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const activePaletteObj = availablePalettes.find((p) => p.id === palette);

  // Close dropdown / notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live unread notification count
  useEffect(() => {
    if (!currentUser?.id) {
      setUnreadCount(0);
      return;
    }
    const unsub = subscribeToNotifications(currentUser.id, (list) => {
      setUnreadCount(list.filter((n) => !n.read).length);
    });
    return () => unsub();
  }, [currentUser?.id]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--nav-bg)] border-b border-[var(--nav-border)] shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
          <div
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-base sm:text-lg font-bold tracking-tight text-[var(--nav-text)]">
                Afflatus
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              id="nav-link-explore"
              onClick={() => onNavigate('explore')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'explore'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            {currentUser && (
              <button
                id="nav-link-dashboard"
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentScreen === 'dashboard'
                    ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                    : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
                }`}
              >
                Creator Matches
              </button>
            )}

            <button
              id="nav-link-landing"
              onClick={() => onNavigate('landing')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                currentScreen === 'landing'
                  ? 'bg-[var(--nav-item-active-bg)] text-[var(--nav-item-active-text)] font-semibold shadow-sm'
                  : 'text-[var(--nav-subtext)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-item-hover)]'
              }`}
            >
              About Platform
            </button>
          </div>

          {/* Right Controls: Themes, Light/Dark Mode & Auth/Profile */}
          <div className="flex items-center gap-2">
            
            {/* C1 AI Assistant Header Button */}
            {onOpenAssistant && (
              <button
                id="header-c1-btn"
                onClick={onOpenAssistant}
                className="px-3 py-1.5 rounded-full bg-[var(--accent-amber)]/15 hover:bg-[var(--accent-amber)]/25 text-[var(--accent-amber)] border border-[var(--accent-amber)]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 text-xs font-bold"
                title="Open C1 AI Copilot"
                aria-label="Open C1 AI Copilot"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Ask C1</span>
              </button>
            )}

            {/* Messages */}
            {currentUser && onOpenMessenger && (
              <button
                id="header-messages-btn"
                type="button"
                onClick={() => onOpenMessenger()}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Messages"
                aria-label="Open messages"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                <span className="hidden lg:inline text-[11px] font-medium">Messages</span>
              </button>
            )}

            {/* Notifications */}
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  id="header-notifications-btn"
                  type="button"
                  onClick={() => setIsNotifOpen((v) => !v)}
                  className="relative p-2 sm:px-3 sm:py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title="Notifications"
                  aria-label="Open notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  <span className="hidden lg:inline text-[11px] font-medium">Alerts</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsPanel
                  currentUser={currentUser}
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  unreadCount={unreadCount}
                  onUnreadChange={setUnreadCount}
                  onOpenMessenger={(connectionId) => {
                    setIsNotifOpen(false);
                    onOpenMessenger?.(connectionId);
                  }}
                />
              </div>
            )}

            {/* Themes Button (Studio) */}
            <button
              id="header-themes-btn"
              onClick={onOpenThemes}
              className="px-3 py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 text-xs font-semibold"
              title="Open Themes & Palettes"
              aria-label="Open themes"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
              <span className="hidden sm:inline">Themes</span>
            </button>

            {/* Light / Dark Mode Toggle (Preserves current palette) */}
            <button
              id="header-mode-toggle"
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode (Palette: ${activePaletteObj?.name})`}
              aria-label="Toggle light or dark mode"
            >
              {mode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  <span className="text-[11px] font-medium text-[var(--nav-text)] hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                  <span className="text-[11px] font-medium text-[var(--nav-text)] hidden lg:inline">Dark</span>
                </>
              )}
            </button>

            {/* Profile Dropdown or Login / Signup CTA */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="header-profile-dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[var(--nav-item-bg)] hover:bg-[var(--nav-item-hover)] text-[var(--nav-text)] border border-[var(--nav-border)] transition-all cursor-pointer shadow-sm"
                >
                  <UserAvatar
                    name={currentUser.name}
                    avatarUrl={currentUser.avatarUrl}
                    size="xs"
                    shape="circle"
                  />
                  <span className="text-xs font-medium text-[var(--nav-text)] max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--nav-subtext)]" />
                </button>

                {/* Dropdown Menu (NO toggle theme inside, replaced with clean navigation items) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-[var(--card-border)] mb-1">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono truncate">@{currentUser.username}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--card-inner-bg)] text-[var(--accent-amber)] border border-[var(--card-inner-border)]">
                        {currentUser.primaryRole}
                      </span>
                    </div>

                    <button
                      id="dropdown-explore"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate('explore');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors text-left cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                      <span>Explore Work &amp; Guilds</span>
                    </button>

                    <button
                      id="dropdown-edit-profile"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNavigate('onboarding');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors text-left cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                      <span>Edit Profile &amp; Photos</span>
                    </button>

                    <button
                      id="dropdown-themes"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenThemes();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors text-left cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
                      <span>Themes Studio</span>
                    </button>

                    <button
                      id="dropdown-settings"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Settings &amp; Account</span>
                    </button>

                    <div className="border-t border-[var(--card-border)] my-1" />

                    <button
                      id="dropdown-logout"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => onNavigate('auth')}
                className="px-4 py-1.5 rounded-full bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Login / Signup</span>
              </button>
            )}

          </div>

      </div>
    </header>
  );
};
