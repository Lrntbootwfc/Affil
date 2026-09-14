import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  Bot,
  ExternalLink,
  User,
  Briefcase,
  Layers,
  Users,
  Compass,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle,
} from 'lucide-react';
import type {
  CreatorProfile,
  ChatMessage,
  AssistantMatchedItem,
  AssistantAction,
  AssistantChatResponse,
} from '../../types';

interface C1AssistantDrawerProps {
  currentUser: CreatorProfile | null;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onNavigateToExplore: (tab?: 'all' | 'projects' | 'tasks' | 'works' | 'clubs' | 'creators', category?: string, search?: string) => void;
  onSelectCreator?: (creator: CreatorProfile) => void;
  onSelectProject?: (projectId: string) => void;
  onSelectTask?: (taskId: string) => void;
  onApplyDirectly?: (recipientId: string, recipientName: string, message: string, projectId?: string, taskId?: string) => void;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg_welcome',
  sender: 'assistant',
  text: `Hello! I am C1, your Afflatus Production Copilot. I can help you search real verified crew members, find open paid tasks, explore commercial briefs, or navigate creative guilds.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedActions: [
    { label: 'Find DPs in Mumbai', actionType: 'navigate_explore', payload: { tab: 'creators', category: 'cinematography' } },
    { label: 'Browse Open Opportunities', actionType: 'navigate_explore', payload: { tab: 'tasks' } },
    { label: 'Commercial Projects', actionType: 'navigate_explore', payload: { tab: 'projects', category: 'production' } },
  ],
};

export const C1AssistantDrawer: React.FC<C1AssistantDrawerProps> = ({
  currentUser,
  isOpen: externalIsOpen,
  onOpen,
  onClose,
  onNavigateToExplore,
  onSelectCreator,
  onSelectProject,
  onSelectTask,
  onApplyDirectly,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (!val && onClose) onClose();
    if (val && onOpen) onOpen();
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('c1_assistant_messages');
      return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MESSAGE];
    } catch {
      return [DEFAULT_WELCOME_MESSAGE];
    }
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; label: string; query: string }>>([
    { id: 's1', label: 'DPs in Mumbai', query: 'Find me a Director of Photography in Mumbai with cinema camera gear' },
    { id: 's2', label: 'Paid sound tasks', query: 'Show me open paid tasks for sound design or location recording' },
    { id: 's3', label: 'Commercial fashion briefs', query: 'Are there commercial fashion or editorial projects?' },
    { id: 's4', label: 'DaVinci Resolve editors', query: 'Find video editors skilled in DaVinci Resolve' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist chat in session
  useEffect(() => {
    try {
      sessionStorage.setItem('c1_assistant_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Session storage quota exceeded:', e);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const promptToSend = (queryText || inputPrompt).trim();
    if (!promptToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          userId: currentUser?.id,
          currentUserProfile: currentUser,
        }),
      });

      const data: AssistantChatResponse = await res.json();

      if (res.ok && data.success) {
        const assistantMessage: ChatMessage = {
          id: `msg_ast_${Date.now()}`,
          sender: 'assistant',
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
          matchedItems: data.matchedItems,
          suggestedActions: data.suggestedActions,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: data.error || 'I had trouble fetching that info right now. Please try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('[C1Assistant] Request failed:', err);
      const networkErrorMessage: ChatMessage = {
        id: `msg_net_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Network connection issue. Please check your connectivity and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, networkErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    sessionStorage.removeItem('c1_assistant_messages');
  };

  const handleActionClick = (action: AssistantAction) => {
    if (action.actionType === 'navigate_explore') {
      onNavigateToExplore(action.payload?.tab, action.payload?.category, action.payload?.search);
    } else if (action.actionType === 'filter_category') {
      onNavigateToExplore('all', action.payload?.category);
    }
  };

  const handleItemCardClick = (item: AssistantMatchedItem) => {
    if (item.type === 'creator') {
      if (onSelectCreator && item.itemData) {
        onSelectCreator(item.itemData as CreatorProfile);
      } else {
        onNavigateToExplore('creators', undefined, item.title);
      }
    } else if (item.type === 'task') {
      if (onSelectTask) {
        onSelectTask(item.id);
      } else {
        onNavigateToExplore('tasks', undefined, item.title);
      }
    } else if (item.type === 'project') {
      if (onSelectProject) {
        onSelectProject(item.id);
      } else {
        onNavigateToExplore('projects', undefined, item.title);
      }
    } else if (item.type === 'club') {
      onNavigateToExplore('clubs', undefined, item.title);
    }
  };

  return (
    <>
      {/* 1. Persistent Floating Button (Accessible Across Screens) */}
      {!isOpen && (
        <button
          id="c1-assistant-floating-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#F7E7CE] via-[#E8C793] to-[#D5A866] text-[#140E08] font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group border border-[#E5C38C]/60 hover:shadow-[0_0_25px_rgba(229,195,140,0.45)]"
          title="Open C1 AI Copilot"
          aria-label="Open C1 AI Copilot"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="tracking-wide font-extrabold">Ask AI</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#140E08]">
            Copilot
          </span>
        </button>
      )}

      {/* 2. Interactive Chat Panel / Drawer */}
      {isOpen && (
        <div
          id="c1-assistant-panel"
          className={`fixed z-50 flex flex-col bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[620px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)] bg-[var(--card-inner-bg)]/60 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-amber)] text-[#181614] flex items-center justify-center font-black shadow-md">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                    C1 Copilot
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini Live
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Afflatus Production Intelligence
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                id="c1-clear-history-btn"
                onClick={handleClearHistory}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors cursor-pointer"
                title="Clear Chat"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                id="c1-expand-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse window' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                id="c1-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-inner-bg)] transition-colors cursor-pointer"
                title="Close"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[var(--accent-amber)]/20 border border-[var(--accent-amber)]/40 text-[var(--accent-amber)] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] space-y-2.5 ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[var(--accent-amber)] text-[#181614] font-medium rounded-tr-sm shadow-md'
                        : msg.isError
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-tl-sm'
                        : 'bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-[var(--text-primary)] rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1.5 opacity-60 ${
                        msg.sender === 'user' ? 'text-right text-[#181614]' : 'text-left text-[var(--text-muted)]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Matched Entities Carousel / Grid */}
                  {msg.matchedItems && msg.matchedItems.length > 0 && (
                    <div className="space-y-2 w-full pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Matched Catalog Results ({msg.matchedItems.length})
                      </p>
                      <div className="space-y-2">
                        {msg.matchedItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemCardClick(item)}
                            className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-amber)] transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-center shrink-0 text-[var(--accent-amber)]">
                                {item.type === 'creator' && <User className="w-4 h-4" />}
                                {item.type === 'task' && <Briefcase className="w-4 h-4" />}
                                {item.type === 'project' && <Layers className="w-4 h-4" />}
                                {item.type === 'club' && <Users className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-amber)] transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--card-inner-bg)] text-[var(--accent-amber)] border border-[var(--card-inner-border)]">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--card-inner-bg)] hover:bg-[var(--accent-amber)]/15 border border-[var(--card-inner-border)] hover:border-[var(--accent-amber)]/40 text-[11px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-all cursor-pointer"
                        >
                          <span>{action.label}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-xl bg-[var(--accent-amber)]/20 border border-[var(--accent-amber)]/40 text-[var(--accent-amber)] flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-amber)]" />
                  <span>C1 is analyzing production catalog...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="px-4 py-2 border-t border-[var(--card-border)] bg-[var(--card-inner-bg)]/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider shrink-0 mr-1">
              Try:
            </span>
            {suggestions.map((sug) => (
              <button
                key={sug.id}
                onClick={() => handleSendMessage(sug.query)}
                className="px-2.5 py-1 rounded-full bg-[var(--card-bg)] hover:bg-[var(--card-inner-bg)] border border-[var(--card-border)] hover:border-[var(--accent-amber)] text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap transition-all cursor-pointer shadow-xs shrink-0"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)] rounded-b-3xl shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                id="c1-chat-input"
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about cinematographers, sound tasks, budgets..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-all"
              />
              <button
                id="c1-submit-btn"
                type="submit"
                disabled={loading || !inputPrompt.trim()}
                className="p-2.5 rounded-xl bg-[var(--accent-amber)] text-[#181614] hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed shrink-0"
                title="Send Message"
                aria-label="Send message"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">
              C1 Assistant is grounded in verified Afflatus project data.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
