'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, FileText, ShoppingBag, Search, Megaphone, Info } from 'lucide-react';
import type { Notification } from '@/types/database';
import { formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'note': return <FileText className="w-4 h-4 text-blue-600" />;
    case 'marketplace': return <ShoppingBag className="w-4 h-4 text-purple-600" />;
    case 'lost_found': return <Search className="w-4 h-4 text-amber-600" />;
    case 'announcement': return <Megaphone className="w-4 h-4 text-red-600" />;
    default: return <Info className="w-4 h-4 text-gray-600" />;
  }
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success('Marked all as read');
      }
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2.5 rounded-xl hover:bg-campus-bg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-campus-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-campus-danger rounded-full ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-card-sm shadow-dropdown border border-campus-border py-2 z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-campus-border">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-campus-text text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="badge-purple text-[10px]">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-campus-purple hover:underline font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-campus-border">
            {loading ? (
              <div className="py-8 text-center text-xs text-campus-text-secondary">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => {
                    if (!n.read) markAsRead(n.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3.5 hover:bg-campus-bg transition-colors ${
                    !n.read ? 'bg-campus-purple-50/50' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-card flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${!n.read ? 'text-campus-purple' : 'text-campus-text'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-campus-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-campus-text-secondary/70 mt-1 block">
                      {formatRelativeTime(n.created_at)}
                    </span>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-campus-purple flex-shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-campus-text-secondary">
                No notifications right now
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
