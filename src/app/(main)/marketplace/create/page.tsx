'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { marketplaceSchema } from '@/lib/validations/marketplace';
import { MARKETPLACE_CATEGORIES, CONDITIONS } from '@/lib/utils';

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', price: 0, category: '', condition: '', location: '', contact_preference: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) { toast.error('Maximum 5 images'); return; }
    const validFiles = files.filter(f => {
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not an image`); return false; }
      if (f.size > 5 * 1024 * 1024) { toast.error(`${f.name} exceeds 5MB`); return false; }
      return true;
    });
    setImages(prev => [...prev, ...validFiles]);
    validFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = marketplaceSchema.safeParse(formData);
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

      // Create listing
      const { data: item, error: itemError } = await supabase
        .from('marketplace_items')
        .insert({
          title: formData.title, description: formData.description, price: formData.price,
          category: formData.category, condition: formData.condition,
          location: formData.location || null, contact_preference: formData.contact_preference || null,
          seller_id: user.id,
        })
        .select()
        .single();

      if (itemError || !item) { toast.error('Failed to create listing'); setLoading(false); return; }

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const ext = file.name.split('.').pop();
        const fileName = `${user.id}/${item.id}/${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('marketplace').upload(fileName, file);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('marketplace').getPublicUrl(fileName);
          await supabase.from('marketplace_images').insert({ item_id: item.id, image_url: publicUrl, display_order: i });
        }
      }

      toast.success('Listing created!');
      router.push(`/marketplace/${item.id}`);
    } catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-1">Create Listing</h1>
        <p className="text-campus-text-secondary text-sm mb-6">Sell or give away items to your campus community</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Product Name *</label>
            <input type="text" placeholder="e.g., Engineering Physics Book" value={formData.title} onChange={e => updateField('title', e.target.value)} className="input-field" />
            {errors.title && <p className="text-campus-danger text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={formData.category} onChange={e => updateField('category', e.target.value)} className="input-field appearance-none cursor-pointer">
                <option value="">Select Category</option>
                {MARKETPLACE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
              {errors.category && <p className="text-campus-danger text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="label">Condition *</label>
              <select value={formData.condition} onChange={e => updateField('condition', e.target.value)} className="input-field appearance-none cursor-pointer">
                <option value="">Select Condition</option>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.condition && <p className="text-campus-danger text-xs mt-1">{errors.condition}</p>}
            </div>
          </div>

          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" placeholder="250" min="0" value={formData.price || ''} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} className="input-field" />
            {errors.price && <p className="text-campus-danger text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea placeholder="Describe the item, its condition, and any other relevant details..." value={formData.description} onChange={e => updateField('description', e.target.value)} className="input-field min-h-[120px] resize-y" />
            {errors.description && <p className="text-campus-danger text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input type="text" placeholder="e.g., Main Campus" value={formData.location} onChange={e => updateField('location', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Contact Preference</label>
              <input type="text" placeholder="e.g., WhatsApp, Email" value={formData.contact_preference} onChange={e => updateField('contact_preference', e.target.value)} className="input-field" />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label">Images (Max 5, up to 5MB each)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-campus-bg">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-campus-border flex flex-col items-center justify-center cursor-pointer hover:border-campus-purple/50 hover:bg-campus-purple-50 transition-all">
                  <ImageIcon className="w-6 h-6 text-campus-text-secondary/50 mb-1" />
                  <span className="text-[10px] text-campus-text-secondary">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Listing</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
