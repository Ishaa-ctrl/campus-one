'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { marketplaceSchema } from '@/lib/validations/marketplace';
import { MARKETPLACE_CATEGORIES, CONDITIONS } from '@/lib/utils';
import type { MarketplaceItem } from '@/types/database';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', price: 0, category: '', condition: '', location: '', contact_preference: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchItem = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('marketplace_items').select('*').eq('id', params.id).single();
      if (data) {
        setFormData({
          title: data.title, description: data.description, price: data.price,
          category: data.category, condition: data.condition,
          location: data.location || '', contact_preference: data.contact_preference || '',
        });
      }
      setFetching(false);
    };
    fetchItem();
  }, [params.id]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const { error } = await supabase.from('marketplace_items').update({
        title: formData.title, description: formData.description, price: formData.price,
        category: formData.category, condition: formData.condition,
        location: formData.location || null, contact_preference: formData.contact_preference || null,
      }).eq('id', params.id);

      if (error) { toast.error('Failed to update'); return; }
      toast.success('Listing updated!');
      router.push(`/marketplace/${params.id}`);
    } catch { toast.error('Something went wrong'); } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-campus-purple" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/marketplace/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Listing
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-6">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Product Name *</label>
            <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} className="input-field" />
            {errors.title && <p className="text-campus-danger text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={formData.category} onChange={e => updateField('category', e.target.value)} className="input-field appearance-none cursor-pointer">
                <option value="">Select</option>
                {MARKETPLACE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Condition *</label>
              <select value={formData.condition} onChange={e => updateField('condition', e.target.value)} className="input-field appearance-none cursor-pointer">
                <option value="">Select</option>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" min="0" value={formData.price || ''} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} className="input-field" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} className="input-field min-h-[120px] resize-y" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input type="text" value={formData.location} onChange={e => updateField('location', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Contact Preference</label>
              <input type="text" value={formData.contact_preference} onChange={e => updateField('contact_preference', e.target.value)} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
