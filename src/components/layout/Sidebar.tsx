'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Search,
  Megaphone,
  UserCircle,
  Settings,
  GraduationCap,
  UserPlus,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/lost-found', label: 'Lost & Found', icon: Search },
  { href: '/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/profile', label: 'My Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-campus-navy z-40">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-campus-purple rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white font-display">CampusOne</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                isActive ? 'text-campus-purple-accent' : 'text-white/50 group-hover:text-white/80'
              }`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-5 pb-6">
        <div className="border-t border-white/10 pt-5 mb-4">
          <p className="text-white/40 text-xs italic leading-relaxed">
            Share. Connect.<br />
            Grow together.
          </p>
        </div>
        <button className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/10 text-white/80 text-sm hover:bg-white/15 transition-all duration-200">
          <UserPlus className="w-4 h-4" />
          Invite Friends
        </button>
      </div>
    </aside>
  );
}
