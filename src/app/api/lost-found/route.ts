import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const type = searchParams.get('type');
  const search = searchParams.get('search');

  let query = supabase
    .from('lost_found_posts')
    .select('*, poster:profiles!posted_by(*)')
    .eq('status', 'active');

  if (type && type !== 'all') query = query.eq('type', type);
  if (search) query = query.or(`item_name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);

  const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
