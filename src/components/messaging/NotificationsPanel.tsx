import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2, X, MessageSquare, UserPlus, CheckCircle2 } from 'lucide-react';
import type { CreatorProfile } from '../../types';
import {
  subscribeToNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from '../../lib/firebase';

interface NotificationsPanelProps {
  currentUser: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenMessenger?: (connectionId?: string) => void;
  unreadCount: number;
  onUnreadChange?: (count: number) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  currentUser,
  isOpen,
  onClose,
  onOpenMessenger,
  unreadCount,
  onUnreadChange,
}) => {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    const unsub = subscribeToNotifications(
      currentUser.id,
      (list) => {
        setItems(list);
        setLoading(false);
        const unread = list.filter((n) => !n.read).length;
        onUnreadChange?.(unread);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [currentUser.id]);

  const iconFor = (type: AppNotification['type']) => {
    if (type === 'message') return <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-amber)]" />;
    if (type === 'connection_accepted') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <UserPlus className="w-3.5 h-3.5 text-[var(--accent-amber)]" />;
  };

  const handleClick = async (n: AppNotification) => {
    if (!n.read) {
      await markNotificationRead(n.id, currentUser.id);
    }
    if (n.type === 'message' && n.relatedId && onOpenMessenger) {
      onOpenMessenger(n.relatedId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,22rem)] z-50">
      <div className="card-warm-white rounded-2xl border border-[var(--card-border)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--accent-amber)]" />
            <span className="text-sm font-bold text-[var(--text-primary)]">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent-amber)] text-[#181614]">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead(currentUser.id)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Mark all read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-amber)]" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <p className="text-xs text-[var(--text-muted)]">No notifications yet.</p>
            </div>
          ) : (
            <ul>
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 flex gap-2.5 border-b border-[var(--card-border)] last:border-0 cursor-pointer hover:bg-[var(--card-inner-bg)] transition-colors ${
                      !n.read ? 'bg-[var(--accent-amber)]/5' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{iconFor(n.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{n.title}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                        {n.body}
                      </p>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1 font-mono">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)] shrink-0 mt-1.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

/** Lightweight unread badge subscription hook helper component for header */
export function useNotificationUnread(
  userId: string | undefined,
  onCount: (n: number) => void
) {
  useEffect(() => {
    if (!userId) {
      onCount(0);
      return;
    }
    const unsub = subscribeToNotifications(userId, (list) => {
      onCount(list.filter((x) => !x.read).length);
    });
    return () => unsub();
  }, [userId]);
}
