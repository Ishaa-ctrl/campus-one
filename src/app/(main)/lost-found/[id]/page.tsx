import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import LostFoundDetailClient from './LostFoundDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('lost_found_posts').select('item_name').eq('id', id).single();
  return { title: data ? `${data.item_name} | CampusOne Lost & Found` : 'Post Not Found' };
}

export default async function LostFoundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: post } = await supabase.from('lost_found_posts').select('*, poster:profiles!posted_by(*)').eq('id', id).single();
  if (!post) notFound();
  const { data: savedItem } = await supabase.from('saved_items').select('id').eq('user_id', user?.id || '').eq('item_type', 'lost_found_post').eq('item_id', id).single();
  return <LostFoundDetailClient post={post} isSaved={!!savedItem} isOwner={user?.id === post.posted_by} />;
}
