import { createClient } from '@/lib/supabase/server';
import NotesClient from './NotesClient';

export const metadata = {
  title: 'Notes | CampusOne',
  description: 'Browse and download study materials shared by your campus community',
};

export default async function NotesPage() {
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from('notes')
    .select('*, uploader:profiles!uploaded_by(*), subject:subjects(*)')
    .order('created_at', { ascending: false });

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  return <NotesClient initialNotes={notes || []} subjects={subjects || []} />;
}
