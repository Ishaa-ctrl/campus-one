import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import MarketplaceDetailClient from './MarketplaceDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('marketplace_items').select('title, description').eq('id', id).single();
  return {
    title: data ? `${data.title} | CampusOne Marketplace` : 'Item Not Found',
    description: data?.description || 'View item details',
  };
}

export default async function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: item } = await supabase
    .from('marketplace_items')
    .select('*, seller:profiles!seller_id(*), images:marketplace_images(*)')
    .eq('id', id)
    .single();

  if (!item) notFound();

  const { data: savedItem } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user?.id || '')
    .eq('item_type', 'marketplace_item')
    .eq('item_id', id)
    .single();

  return <MarketplaceDetailClient item={item} isSaved={!!savedItem} isOwner={user?.id === item.seller_id} />;
}
