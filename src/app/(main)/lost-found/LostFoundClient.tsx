'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import LostFoundCard from '@/components/cards/LostFoundCard';
import EmptyState from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';
import type { LostFoundPost } from '@/types/database';

interface LostFoundClientProps {
  initialPosts: LostFoundPost[];
}

export default function LostFoundClient({ initialPosts }: LostFoundClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];
    if (activeTab !== 'all') filtered = filtered.filter(p => p.type === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.item_name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    return filtered;
  }, [initialPosts, activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-campus-text">Lost & Found</h1>
          <p className="text-campus-text-secondary text-sm mt-1">Report and find lost items on campus</p>
        </div>
        <Link href="/lost-found/create" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Create Post
        </Link>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
            <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {(['all', 'lost', 'found'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-campus-purple text-white shadow-button' : 'bg-campus-bg text-campus-text-secondary hover:bg-campus-purple-light hover:text-campus-purple'}`}>
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPosts.map((post, i) => <LostFoundCard key={post.id} post={post} index={i} />)}
        </div>
      ) : (
        <EmptyState icon={Search} title="No posts found" description={searchQuery ? 'Try a different search.' : 'No items reported yet.'} actionLabel="Create Post" actionHref="/lost-found/create" />
      )}
    </div>
  );
}
