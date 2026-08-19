import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ notes: [], marketplace: [], lostFound: [] });
  }

  const searchPattern = `%${query}%`;

  const [notesRes, marketplaceRes, lostFoundRes] = await Promise.all([
    supabase
      .from('notes')
      .select('*, uploader:profiles!uploaded_by(full_name, avatar_url)')
      .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},subject_name.ilike.${searchPattern}`)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('marketplace_items')
      .select('*, seller:profiles!seller_id(full_name, avatar_url), images:marketplace_images(image_url)')
      .eq('status', 'active')
      .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('lost_found_posts')
      .select('*, poster:profiles!posted_by(full_name, avatar_url)')
      .eq('status', 'active')
      .or(`item_name.ilike.${searchPattern},description.ilike.${searchPattern},location.ilike.${searchPattern}`)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    notes: notesRes.data || [],
    marketplace: marketplaceRes.data || [],
    lostFound: lostFoundRes.data || [],
  });
}
