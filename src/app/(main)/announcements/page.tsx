import { createClient } from '@/lib/supabase/server';
import AnnouncementsClient from './AnnouncementsClient';

export const metadata = { title: 'Announcements | CampusOne' };

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user?.id || '').single();
  const { data: announcements } = await supabase.from('announcements').select('*, creator:profiles!created_by(*)').order('created_at', { ascending: false });
  return <AnnouncementsClient announcements={announcements || []} isAdmin={profile?.role === 'admin'} />;
}
