import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import NoteDetailClient from './NoteDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note } = await supabase.from('notes').select('title, description').eq('id', id).single();
  return {
    title: note ? `${note.title} | CampusOne Notes` : 'Note Not Found',
    description: note?.description || 'View note details on CampusOne',
  };
}

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: note } = await supabase
    .from('notes')
    .select('*, uploader:profiles!uploaded_by(*), subject:subjects(*)')
    .eq('id', id)
    .single();

  if (!note) notFound();

  // Check if saved
  const { data: savedItem } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user?.id || '')
    .eq('item_type', 'note')
    .eq('item_id', id)
    .single();

  return <NoteDetailClient note={note} isSaved={!!savedItem} isOwner={user?.id === note.uploaded_by} />;
}
