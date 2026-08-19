import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProfileClient from '../ProfileClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('full_name').eq('user_id', id).single();
  return { title: data ? `${data.full_name} | CampusOne` : 'User Not Found' };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', id).single();
  if (!profile) notFound();

  const [notesRes, listingsRes, foundRes, userNotes, userListings, userPosts] = await Promise.all([
    supabase.from('notes').select('id', { count: 'exact', head: true }).eq('uploaded_by', id),
    supabase.from('marketplace_items').select('id', { count: 'exact', head: true }).eq('seller_id', id).eq('status', 'sold'),
    supabase.from('lost_found_posts').select('id', { count: 'exact', head: true }).eq('posted_by', id).eq('type', 'found'),
    supabase.from('notes').select('*, uploader:profiles!uploaded_by(*)').eq('uploaded_by', id).order('created_at', { ascending: false }).limit(6),
    supabase.from('marketplace_items').select('*, seller:profiles!seller_id(*), images:marketplace_images(*)').eq('seller_id', id).eq('status', 'active').order('created_at', { ascending: false }).limit(6),
    supabase.from('lost_found_posts').select('*, poster:profiles!posted_by(*)').eq('posted_by', id).eq('status', 'active').order('created_at', { ascending: false }).limit(6),
  ]);

  return (
    <ProfileClient
      profile={profile}
      stats={{ notesUploaded: notesRes.count || 0, itemsSold: listingsRes.count || 0, foundItems: foundRes.count || 0 }}
      myNotes={userNotes.data || []}
      myListings={userListings.data || []}
      myPosts={userPosts.data || []}
      isOwnProfile={user?.id === id}
    />
  );
}
