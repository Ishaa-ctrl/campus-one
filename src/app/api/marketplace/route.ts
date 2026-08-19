import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const condition = searchParams.get('condition');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';

  let query = supabase
    .from('marketplace_items')
    .select('*, seller:profiles!seller_id(*), images:marketplace_images(*)')
    .eq('status', 'active');

  if (category && category !== 'all') query = query.eq('category', category);
  if (condition) query = query.eq('condition', condition);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  switch (sort) {
    case 'price_low': query = query.order('price', { ascending: true }); break;
    case 'price_high': query = query.order('price', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
