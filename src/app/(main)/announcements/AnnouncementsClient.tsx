'use client';

import { useState, useMemo } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import Link from 'next/link';
import AnnouncementCard from '@/components/cards/AnnouncementCard';
import EmptyState from '@/components/ui/EmptyState';
import type { Announcement } from '@/types/database';

interface Props { announcements: Announcement[]; isAdmin: boolean; }

const categories = ['all', 'exam', 'event', 'placement', 'holiday', 'general'];

export default function AnnouncementsClient({ announcements, isAdmin }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return announcements;
    return announcements.filter(a => a.category === selectedCategory);
  }, [announcements, selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-campus-text">Announcements</h1>
          <p className="text-campus-text-secondary text-sm mt-1">Stay updated with campus news</p>
        </div>
        {isAdmin && (
          <Link href="/announcements/create" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New</Link>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto custom-scrollbar">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-campus-purple text-white shadow-button' : 'bg-white text-campus-text-secondary hover:bg-campus-purple-light shadow-card'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">{filtered.map((a, i) => <AnnouncementCard key={a.id} announcement={a} index={i} />)}</div>
      ) : (
        <EmptyState icon={Megaphone} title="No announcements" description="Check back later for campus updates." />
      )}
    </div>
  );
}
