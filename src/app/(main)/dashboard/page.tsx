import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard | CampusOne',
  description: 'Your CampusOne dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id || '')
    .single();

  // Fetch counts
  const [notesCount, marketplaceCount, lostFoundCount] = await Promise.all([
    supabase.from('notes').select('id', { count: 'exact', head: true }),
    supabase.from('marketplace_items').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('lost_found_posts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ]);

  // Fetch latest notes
  const { data: latestNotes } = await supabase
    .from('notes')
    .select('*, uploader:profiles!uploaded_by(*)')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch marketplace highlights
  const { data: marketplaceItems } = await supabase
    .from('marketplace_items')
    .select('*, seller:profiles!seller_id(*), images:marketplace_images(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch lost & found
  const { data: lostFoundPosts } = await supabase
    .from('lost_found_posts')
    .select('*, poster:profiles!posted_by(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, creator:profiles!created_by(*)')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <DashboardClient
      profile={profile}
      stats={{
        totalNotes: notesCount.count || 0,
        totalListings: marketplaceCount.count || 0,
        totalLostFound: lostFoundCount.count || 0,
      }}
      latestNotes={latestNotes || []}
      marketplaceItems={marketplaceItems || []}
      lostFoundPosts={lostFoundPosts || []}
      announcements={announcements || []}
    />
  );
}
