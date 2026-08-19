'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getInitials } from '@/lib/utils';
import GlobalSearch from '@/components/search/GlobalSearch';
import NotificationDropdown from '@/components/layout/NotificationDropdown';

export default function Header() {
  const { profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-campus-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <GlobalSearch />
        </div>

        {/* Mobile - Search icon toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 rounded-xl hover:bg-campus-bg transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-campus-text-secondary" />
        </button>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-campus-bg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-campus-purple flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-white">
                    {profile ? getInitials(profile.full_name) : '?'}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-campus-text max-w-[120px] truncate">
                {profile?.full_name || 'User'}
              </span>
              <ChevronDown className="w-4 h-4 text-campus-text-secondary hidden sm:block" />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card-sm shadow-dropdown border border-campus-border py-2 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-campus-border">
                  <p className="text-sm font-semibold text-campus-text truncate">{profile?.full_name}</p>
                  <p className="text-xs text-campus-text-secondary truncate">{profile?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-campus-text hover:bg-campus-bg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-campus-text hover:bg-campus-bg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-campus-border pt-1">
                  <button
                    onClick={() => { setShowUserMenu(false); signOut(); }}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-campus-danger hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 animate-slide-up">
          <GlobalSearch />
        </div>
      )}
    </header>
  );
}

