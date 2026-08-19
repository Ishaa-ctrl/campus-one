'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, ShoppingBag, UserCircle, Plus } from 'lucide-react';
import CreatePostModal from '@/components/modals/CreatePostModal';

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/marketplace', label: 'Market', icon: ShoppingBag },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const leftItems = mobileNavItems.slice(0, 2);
  const rightItems = mobileNavItems.slice(2);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-campus-border">
        <div className="flex items-center justify-around h-16 px-2 pb-safe">
          {leftItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3"
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-campus-purple' : 'text-campus-text-secondary'
                }`} />
                <span className={`text-[10px] font-medium ${
                  isActive ? 'text-campus-purple' : 'text-campus-text-secondary'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Center FAB */}
          <button
            onClick={() => setShowModal(true)}
            className="-mt-8 w-14 h-14 bg-campus-purple rounded-full flex items-center justify-center shadow-button hover:bg-campus-purple-accent transition-all active:scale-95"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>

          {rightItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3"
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-campus-purple' : 'text-campus-text-secondary'
                }`} />
                <span className={`text-[10px] font-medium ${
                  isActive ? 'text-campus-purple' : 'text-campus-text-secondary'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="hidden lg:flex fixed bottom-8 right-8 z-40 w-14 h-14 bg-campus-purple rounded-full items-center justify-center shadow-button hover:bg-campus-purple-accent hover:scale-105 transition-all active:scale-95"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
