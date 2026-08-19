import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export const metadata = { title: 'My Profile | CampusOne' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
  if (!profile) redirect('/login');

  const [notesRes, listingsRes, foundRes, myNotes, myListings, myPosts] = await Promise.all([
    supabase.from('notes').select('id', { count: 'exact', head: true }).eq('uploaded_by', user.id),
    supabase.from('marketplace_items').select('id', { count: 'exact', head: true }).eq('seller_id', user.id).eq('status', 'sold'),
    supabase.from('lost_found_posts').select('id', { count: 'exact', head: true }).eq('posted_by', user.id).eq('type', 'found'),
    supabase.from('notes').select('*, uploader:profiles!uploaded_by(*)').eq('uploaded_by', user.id).order('created_at', { ascending: false }).limit(6),
    supabase.from('marketplace_items').select('*, seller:profiles!seller_id(*), images:marketplace_images(*)').eq('seller_id', user.id).neq('status', 'deleted').order('created_at', { ascending: false }).limit(6),
    supabase.from('lost_found_posts').select('*, poster:profiles!posted_by(*)').eq('posted_by', user.id).order('created_at', { ascending: false }).limit(6),
  ]);

  return (
    <ProfileClient
      profile={profile}
      stats={{ notesUploaded: notesRes.count || 0, itemsSold: listingsRes.count || 0, foundItems: foundRes.count || 0 }}
      myNotes={myNotes.data || []}
      myListings={myListings.data || []}
      myPosts={myPosts.data || []}
      isOwnProfile={true}
    />
  );
}
