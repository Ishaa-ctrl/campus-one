'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { DEPARTMENTS, SEMESTERS, getInitials } from '@/lib/utils';
import type { Profile } from '@/types/database';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({ full_name: '', department: '', semester: 1, bio: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfile(data);
        setFormData({ full_name: data.full_name, department: data.department, semester: data.semester, bio: data.bio || '' });
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
      }
      setFetching(false);
    };
    fetch();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const supabase = createClient();
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const fileName = `${profile.user_id}/avatar.${ext}`;
        await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }

      const { error } = await supabase.from('profiles').update({
        full_name: formData.full_name, department: formData.department,
        semester: formData.semester, bio: formData.bio || null, avatar_url: avatarUrl,
      }).eq('user_id', profile.user_id);

      if (error) { toast.error('Failed to update'); return; }
      toast.success('Profile updated!');
      router.push('/profile');
      router.refresh();
    } catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-campus-purple" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-campus-purple flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{profile ? getInitials(profile.full_name) : '?'}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-campus-purple rounded-full flex items-center justify-center cursor-pointer shadow-button hover:bg-campus-purple-accent transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="label">Full Name</label>
            <input type="text" value={formData.full_name} onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))} className="input-field" />
          </div>

          <div>
            <label className="label">USN</label>
            <input type="text" value={profile?.usn || ''} disabled className="input-field bg-campus-bg cursor-not-allowed opacity-70" />
            <p className="text-xs text-campus-text-secondary mt-1">USN cannot be changed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} className="input-field appearance-none cursor-pointer">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Semester</label>
              <select value={formData.semester} onChange={e => setFormData(p => ({ ...p, semester: parseInt(e.target.value) }))} className="input-field appearance-none cursor-pointer">
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea placeholder="Tell us about yourself..." value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} className="input-field min-h-[100px] resize-y" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
