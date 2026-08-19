'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Loader2, MapPin, Calendar, ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { lostFoundSchema } from '@/lib/validations/lost-found';

export default function CreateLostFoundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({ item_name: '', description: '', type: 'lost' as 'lost' | 'found', location: '', date: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = lostFoundSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in'); return; }

      let imageUrl = null;
      if (image) {
        const ext = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('lost-found').upload(fileName, image);
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('lost-found').getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const { error } = await supabase.from('lost_found_posts').insert({
        item_name: formData.item_name, description: formData.description, type: formData.type,
        location: formData.location, date: formData.date, image_url: imageUrl, posted_by: user.id,
      });

      if (error) { toast.error('Failed to create post'); return; }
      toast.success('Post created!'); router.push('/lost-found');
    } catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/lost-found" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Lost & Found
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-1">Report Item</h1>
        <p className="text-campus-text-secondary text-sm mb-6">Help your campus community find lost items</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="label">Type *</label>
            <div className="flex gap-3">
              {(['lost', 'found'] as const).map(type => (
                <button key={type} type="button" onClick={() => updateField('type', type)} className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${formData.type === type ? (type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white') : 'bg-campus-bg text-campus-text-secondary hover:bg-campus-purple-light'}`}>
                  {type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Item Name *</label>
            <input type="text" placeholder="e.g., ID Card, Wallet, Keys" value={formData.item_name} onChange={e => updateField('item_name', e.target.value)} className="input-field" />
            {errors.item_name && <p className="text-campus-danger text-xs mt-1">{errors.item_name}</p>}
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea placeholder="Describe the item and any identifying details..." value={formData.description} onChange={e => updateField('description', e.target.value)} className="input-field min-h-[100px] resize-y" />
            {errors.description && <p className="text-campus-danger text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
                <input type="text" placeholder="e.g., Library, Main Block" value={formData.location} onChange={e => updateField('location', e.target.value)} className="input-field pl-10" />
              </div>
              {errors.location && <p className="text-campus-danger text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="label">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
                <input type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} className="input-field pl-10" />
              </div>
              {errors.date && <p className="text-campus-danger text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="label">Image (optional)</label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-campus-bg">
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImage(null); setImagePreview(''); }} className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-campus-border rounded-xl cursor-pointer hover:border-campus-purple/50 hover:bg-campus-purple-50 transition-all">
                <ImageIcon className="w-10 h-10 text-campus-text-secondary/50 mb-2" />
                <p className="text-sm text-campus-text-secondary">Click to upload an image</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Upload className="w-4 h-4" /> Create Post</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
