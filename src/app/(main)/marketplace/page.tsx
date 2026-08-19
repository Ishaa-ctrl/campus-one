import { createClient } from '@/lib/supabase/server';
import MarketplaceClient from './MarketplaceClient';

export const metadata = {
  title: 'Marketplace | CampusOne',
  description: 'Buy and sell items within your campus community',
};

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('marketplace_items')
    .select('*, seller:profiles!seller_id(*), images:marketplace_images(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return <MarketplaceClient initialItems={items || []} />;
}
