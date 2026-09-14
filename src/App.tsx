/**
 * Afflatus - Human Creator Collaboration Platform
 * Clean, modern SaaS application with full Light/Dark mode and multi-page wireframe flows
 */

import React, { useState, useEffect } from 'react';
import type { CreatorProfile } from './types';
import { HeaderNav } from './components/HeaderNav';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { ProfileSetupScreen } from './components/ProfileSetupScreen';
import { MainDashboardScreen } from './components/MainDashboardScreen';
import { ExploreScreen } from './components/explore/ExploreScreen';
import { C1AssistantDrawer } from './components/assistant/C1AssistantDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { MessengerDrawer } from './components/messaging/MessengerDrawer';
import { Loader2 } from 'lucide-react';
import {
  auth,
  onAuthStateChanged,
  getProfileFromFirestore,
  syncUserProfileToFirestore,
  signOut as firebaseSignOut,
  updateProfileInFirestore,
} from './lib/firebase';

export default function App() {
  // Screen Router: 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'explore'
  const [currentScreen, setCurrentScreen] = useState<
    'landing' | 'auth' | 'onboarding' | 'dashboard' | 'explore'
  >('landing');

  const [currentUser, setCurrentUser] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isThemesOpen, setIsThemesOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState<boolean>(false);
  const [messengerConnectionId, setMessengerConnectionId] = useState<string | null>(null);

  // Cross-screen navigation params (e.g. from C1 Copilot to Explore)
  const [exploreNavParams, setExploreNavParams] = useState<{
    tab?: 'all' | 'projects' | 'tasks' | 'works' | 'clubs' | 'creators';
    category?: string;
    search?: string;
    entity?: { type: 'project' | 'task' | 'creator' | 'club' | 'work'; id: string } | null;
  }>({});

  // Restore session from Firebase Auth + Firestore (source of truth for profiles)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          setCurrentUser(null);
          setCurrentScreen('landing');
          setIsLoading(false);
          return;
        }

        // Prefer Firestore profile; create/sync baseline if missing
        let profile = await getProfileFromFirestore(fbUser.uid);
        if (!profile) {
          profile = await syncUserProfileToFirestore(fbUser);
        }

        setCurrentUser(profile);
        if (profile.profileCompleted) {
          setCurrentScreen('dashboard');
        } else {
          setCurrentScreen('onboarding');
        }
      } catch (err) {
        console.error('Session restore from Firestore failed:', err);
        setCurrentUser(null);
        setCurrentScreen('landing');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Login / Signup Success (profile already written to Firestore by auth helpers)
  const handleAuthSuccess = (profile: CreatorProfile, isNewSignup: boolean) => {
    setCurrentUser(profile);

    if (isNewSignup || !profile.profileCompleted) {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Handle Profile Saved — persist to Firestore then update local state
  const handleProfileSaved = async (updatedProfile: CreatorProfile) => {
    const saved = await updateProfileInFirestore({
      ...updatedProfile,
      profileCompleted: true,
    });
    setCurrentUser(saved);
    setCurrentScreen('dashboard');
  };

  // Handle Logout — clear Firebase Auth session
  const handleLogout = async () => {
    try {
      await firebaseSignOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setCurrentUser(null);
    setCurrentScreen('landing');
  };

  // After successful account deletion
  const handleAccountDeleted = () => {
    setCurrentUser(null);
    setIsSettingsOpen(false);
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col items-center justify-center text-[var(--text-primary)] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#E58B13]" />
        <p className="text-xs text-[var(--text-secondary)] font-medium tracking-wide">
          Loading Afflatus...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans flex flex-col antialiased selection:bg-[#E58B13]/30 selection:text-[var(--text-primary)]">
      
      {/* 1. Header Bar (Present across screens with Theme Switcher, Brand, & Profile Dropdown) */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemes={() => setIsThemesOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenMessenger={(connectionId) => {
          setMessengerConnectionId(connectionId || null);
          setIsMessengerOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* Screen 1: LANDING PAGE */}
        {currentScreen === 'landing' && (
          <LandingPage
            currentUser={currentUser}
            onGetStarted={() => {
              if (currentUser) {
                setCurrentScreen('onboarding');
              } else {
                setCurrentScreen('auth');
              }
            }}
            onExploreDemo={() => {
              setCurrentScreen('explore');
            }}
            onUpdateProfile={() => {
              setCurrentScreen('onboarding');
            }}
          />
        )}

        {/* Screen 2: LOGIN / SIGNUP PAGE (Dual Authentication Flow) */}
        {currentScreen === 'auth' && (
          <AuthScreen
            onLoginSuccess={handleAuthSuccess}
            onBackToLanding={() => setCurrentScreen('landing')}
          />
        )}

        {/* Screen 3: ONBOARDING / PROFILE SETUP PAGE ("Making Profile") */}
        {currentScreen === 'onboarding' && currentUser && (
          <ProfileSetupScreen
            initialProfile={currentUser}
            onProfileSaved={handleProfileSaved}
            onCancel={() => {
              if (currentUser.profileCompleted) {
                setCurrentScreen('dashboard');
              } else {
                setCurrentScreen('landing');
              }
            }}
          />
        )}

        {/* Screen 4: MAIN DASHBOARD (User App View - Relevant People / Matches Feed) */}
        {currentScreen === 'dashboard' && currentUser && (
          <MainDashboardScreen
            currentUser={currentUser}
            onEditProfile={() => setCurrentScreen('onboarding')}
            onUpdateCurrentUser={handleProfileSaved}
            onNavigateToExplore={() => setCurrentScreen('explore')}
          />
        )}

        {/* Screen 5: EXPLORE CORE (Dedicated work, project, task, and guild discovery) */}
        {currentScreen === 'explore' && (
          <ExploreScreen
            currentUser={currentUser}
            onNavigateToOnboarding={() => {
              if (currentUser) {
                setCurrentScreen('onboarding');
              } else {
                setCurrentScreen('auth');
              }
            }}
            onNavigateToAuth={() => setCurrentScreen('auth')}
            onViewCreatorProfile={() => {
              // Viewed directly inside Explore via CreatorDetailModal
            }}
            onInitiateConnection={(_creator, _defaultMsg) => {
              // Stay in discovery context; UI provides in-place confirmation feedback
            }}
            initialTab={exploreNavParams.tab}
            initialCategory={exploreNavParams.category}
            initialSearch={exploreNavParams.search}
            initialEntity={exploreNavParams.entity}
          />
        )}

      </main>

      {/* Persistent C1 AI Assistant (Accessible Across All Screens) */}
      <C1AssistantDrawer
        currentUser={currentUser}
        isOpen={isAssistantOpen}
        onOpen={() => setIsAssistantOpen(true)}
        onClose={() => setIsAssistantOpen(false)}
        onNavigateToExplore={(tab, category, search) => {
          setExploreNavParams({ tab, category, search, entity: null });
          setCurrentScreen('explore');
        }}
        onSelectCreator={(creator) => {
          setExploreNavParams({ tab: 'creators', search: creator.name, entity: { type: 'creator', id: creator.id } });
          setCurrentScreen('explore');
        }}
        onSelectProject={(projectId) => {
          setExploreNavParams({ tab: 'projects', entity: { type: 'project', id: projectId } });
          setCurrentScreen('explore');
        }}
        onSelectTask={(taskId) => {
          setExploreNavParams({ tab: 'tasks', entity: { type: 'task', id: taskId } });
          setCurrentScreen('explore');
        }}
      />

      {/* Settings Modal */}
      {currentUser && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUser={currentUser}
          onOpenThemes={() => setIsThemesOpen(true)}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      {/* Dedicated Themes Studio Modal */}
      <ThemeSelectorModal
        isOpen={isThemesOpen}
        onClose={() => setIsThemesOpen(false)}
      />

      {/* Messenger (post-connection real-time chat) */}
      {currentUser && (
        <MessengerDrawer
          isOpen={isMessengerOpen}
          onClose={() => {
            setIsMessengerOpen(false);
            setMessengerConnectionId(null);
          }}
          currentUser={currentUser}
          initialConnectionId={messengerConnectionId}
        />
      )}

    </div>
  );
}
