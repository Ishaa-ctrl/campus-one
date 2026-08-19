'use client';

import { motion } from 'framer-motion';
import { FileText, ShoppingBag, Search, ArrowRight, Megaphone } from 'lucide-react';
import Link from 'next/link';
import QuickAccessCard from '@/components/cards/QuickAccessCard';
import NoteCard from '@/components/cards/NoteCard';
import MarketplaceCard from '@/components/cards/MarketplaceCard';
import LostFoundCard from '@/components/cards/LostFoundCard';
import AnnouncementCard from '@/components/cards/AnnouncementCard';
import EmptyState from '@/components/ui/EmptyState';
import { getGreeting } from '@/lib/utils';
import type { Profile, Note, MarketplaceItem, LostFoundPost, Announcement, DashboardStats } from '@/types/database';

interface DashboardClientProps {
  profile: Profile | null;
  stats: DashboardStats;
  latestNotes: Note[];
  marketplaceItems: MarketplaceItem[];
  lostFoundPosts: LostFoundPost[];
  announcements: Announcement[];
}

export default function DashboardClient({
  profile,
  stats,
  latestNotes,
  marketplaceItems,
  lostFoundPosts,
  announcements,
}: DashboardClientProps) {
  const greeting = getGreeting();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-campus-text">
            {greeting}, {profile?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-campus-text-secondary mt-1">Let's make today productive!</p>
        </div>
      </motion.div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <QuickAccessCard
          title="Notes"
          description="Access study materials"
          icon={FileText}
          href="/notes"
          count={`${stats.totalNotes}+ Notes`}
          gradient="bg-gradient-to-br from-campus-purple to-indigo-600"
          delay={0.1}
        />
        <QuickAccessCard
          title="Marketplace"
          description="Buy & sell items"
          icon={ShoppingBag}
          href="/marketplace"
          count={`${stats.totalListings}+ Listings`}
          gradient="bg-gradient-to-br from-campus-success to-emerald-600"
          delay={0.2}
        />
        <QuickAccessCard
          title="Lost & Found"
          description="Find lost items"
          icon={Search}
          href="/lost-found"
          count={`${stats.totalLostFound}+ Posts`}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          delay={0.3}
        />
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-campus-purple" />
              Announcements
            </h2>
            <Link href="/announcements" className="text-sm text-campus-purple hover:text-campus-purple-accent font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <AnnouncementCard key={a.id} announcement={a} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Notes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Latest Notes</h2>
          <Link href="/notes" className="text-sm text-campus-purple hover:text-campus-purple-accent font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {latestNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestNotes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Be the first to share study materials with your campus!"
            actionLabel="Upload Notes"
            actionHref="/notes/upload"
          />
        )}
      </section>

      {/* Marketplace Highlights */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Marketplace Highlights</h2>
          <Link href="/marketplace" className="text-sm text-campus-purple hover:text-campus-purple-accent font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {marketplaceItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {marketplaceItems.map((item, i) => (
              <MarketplaceCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="No listings yet"
            description="Start selling or buying items from your campus community!"
            actionLabel="Create Listing"
            actionHref="/marketplace/create"
          />
        )}
      </section>

      {/* Lost & Found */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Lost & Found</h2>
          <Link href="/lost-found" className="text-sm text-campus-purple hover:text-campus-purple-accent font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {lostFoundPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lostFoundPosts.map((post, i) => (
              <LostFoundCard key={post.id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No posts yet"
            description="Report lost or found items to help your campus community!"
            actionLabel="Create Post"
            actionHref="/lost-found/create"
          />
        )}
      </section>
    </div>
  );
}
