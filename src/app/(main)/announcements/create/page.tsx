'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const categories = [
  { value: 'exam', label: 'Exam' },
  { value: 'event', label: 'Event' },
  { value: 'placement', label: 'Placement' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'general', label: 'General' },
];

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'general' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('announcements').insert({ ...formData, created_by: user.id });
      if (error) { toast.error(error.message); return; }
      toast.success('Announcement created!');
      router.push('/announcements');
    } catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/announcements" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-6">Create Announcement</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Title *</label>
            <input type="text" placeholder="Announcement title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="input-field appearance-none cursor-pointer">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea placeholder="Announcement details..." value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="input-field min-h-[150px] resize-y" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Megaphone className="w-4 h-4" /> Publish</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
