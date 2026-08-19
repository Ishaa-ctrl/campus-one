'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, FileText, ShoppingBag, Search, MapPin, Building2, BookOpen, Hash } from 'lucide-react';
import Link from 'next/link';
import NoteCard from '@/components/cards/NoteCard';
import MarketplaceCard from '@/components/cards/MarketplaceCard';
import LostFoundCard from '@/components/cards/LostFoundCard';
import EmptyState from '@/components/ui/EmptyState';
import { getInitials } from '@/lib/utils';
import type { Profile, ProfileStats, Note, MarketplaceItem, LostFoundPost } from '@/types/database';

interface Props {
  profile: Profile;
  stats: ProfileStats;
  myNotes: Note[];
  myListings: MarketplaceItem[];
  myPosts: LostFoundPost[];
  isOwnProfile: boolean;
}

const tabs = [
  { key: 'notes', label: 'My Notes', icon: FileText },
  { key: 'listings', label: 'My Listings', icon: ShoppingBag },
  { key: 'lost-found', label: 'Lost & Found', icon: Search },
];

export default function ProfileClient({ profile, stats, myNotes, myListings, myPosts, isOwnProfile }: Props) {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-campus-purple flex items-center justify-center flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{getInitials(profile.full_name)}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-campus-text">{profile.full_name}</h1>
                <p className="text-campus-text-secondary text-sm mt-0.5">{profile.email}</p>
              </div>
              {isOwnProfile && (
                <Link href="/profile/edit" className="btn-secondary flex items-center gap-2 text-sm">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Link>
              )}
            </div>
            {profile.bio && <p className="text-campus-text-secondary text-sm mt-3">{profile.bio}</p>}
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-campus-text-secondary"><Hash className="w-4 h-4 text-campus-purple" />{profile.usn}</span>
              <span className="flex items-center gap-1.5 text-sm text-campus-text-secondary"><Building2 className="w-4 h-4 text-campus-purple" />{profile.department}</span>
              <span className="flex items-center gap-1.5 text-sm text-campus-text-secondary"><BookOpen className="w-4 h-4 text-campus-purple" />Semester {profile.semester}</span>
              <span className="flex items-center gap-1.5 text-sm text-campus-text-secondary"><MapPin className="w-4 h-4 text-campus-purple" />{profile.college}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-campus-border">
          <div className="text-center"><p className="text-2xl font-bold text-campus-purple">{stats.notesUploaded}</p><p className="text-xs text-campus-text-secondary mt-0.5">Notes Uploaded</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-campus-success">{stats.itemsSold}</p><p className="text-xs text-campus-text-secondary mt-0.5">Items Sold</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-amber-500">{stats.foundItems}</p><p className="text-xs text-campus-text-secondary mt-0.5">Found Items</p></div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-campus-purple text-white shadow-button' : 'bg-white text-campus-text-secondary hover:bg-campus-purple-light hover:text-campus-purple shadow-card'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'notes' && (
        myNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{myNotes.map((n, i) => <NoteCard key={n.id} note={n} index={i} />)}</div>
        ) : (
          <EmptyState icon={FileText} title="No notes uploaded" description="Share study materials with your campus!" actionLabel="Upload Notes" actionHref="/notes/upload" />
        )
      )}
      {activeTab === 'listings' && (
        myListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{myListings.map((item, i) => <MarketplaceCard key={item.id} item={item} index={i} />)}</div>
        ) : (
          <EmptyState icon={ShoppingBag} title="No listings" description="Start selling items on campus!" actionLabel="Create Listing" actionHref="/marketplace/create" />
        )
      )}
      {activeTab === 'lost-found' && (
        myPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{myPosts.map((p, i) => <LostFoundCard key={p.id} post={p} index={i} />)}</div>
        ) : (
          <EmptyState icon={Search} title="No posts" description="Report lost or found items" actionLabel="Create Post" actionHref="/lost-found/create" />
        )
      )}
    </div>
  );
}
