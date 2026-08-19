import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const semester = searchParams.get('semester');
  const subject = searchParams.get('subject');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('notes')
    .select('*, uploader:profiles!uploaded_by(*), subject:subjects(*)');

  if (semester && parseInt(semester) > 0) {
    query = query.eq('semester', parseInt(semester));
  }

  if (subject) {
    query = query.eq('subject_id', subject);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,subject_name.ilike.%${search}%`);
  }

  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'downloads':
      query = query.order('download_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
