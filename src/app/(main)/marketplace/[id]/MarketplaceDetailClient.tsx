'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Trash2, Edit,
  MapPin, Tag, User, MessageCircle, Flag, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { MarketplaceItem } from '@/types/database';
import { formatPrice, getConditionLabel, getCategoryLabel, formatDate } from '@/lib/utils';

interface Props {
  item: MarketplaceItem;
  isSaved: boolean;
  isOwner: boolean;
}

export default function MarketplaceDetailClient({ item, isSaved: initialSaved, isOwner }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [currentImage, setCurrentImage] = useState(0);
  const images = item.images || [];

  const handleSave = async () => {
    const supabase = createClient();
    if (saved) {
      await supabase.from('saved_items').delete().eq('item_type', 'marketplace_item').eq('item_id', item.id);
      setSaved(false);
      toast.success('Removed from saved');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('saved_items').insert({ user_id: user.id, item_type: 'marketplace_item', item_id: item.id });
      setSaved(true);
      toast.success('Saved!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    const supabase = createClient();
    await supabase.from('marketplace_items').update({ status: 'deleted' }).eq('id', item.id);
    toast.success('Listing deleted');
    router.push('/marketplace');
  };

  const handleReport = async () => {
    const reason = prompt('Why are you reporting this listing?');
    if (!reason) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('reports').insert({ reported_by: user.id, content_type: 'marketplace_item', content_id: item.id, reason });
    toast.success('Report submitted. Thank you!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-campus-bg h-72 lg:h-full min-h-[300px]">
            {images.length > 0 ? (
              <>
                <img src={images[currentImage]?.image_url} alt={item.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(i => i > 0 ? i - 1 : images.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentImage(i => i < images.length - 1 ? i + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? 'bg-white' : 'bg-white/50'}`} />)}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Tag className="w-16 h-16 text-campus-text-secondary/20" /></div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-purple">{getCategoryLabel(item.category)}</span>
              <span className={`badge text-[10px] font-semibold ${
                item.condition === 'new' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>{getConditionLabel(item.condition)}</span>
            </div>

            <h1 className="text-2xl font-bold text-campus-text mb-2">{item.title}</h1>
            <p className="text-3xl font-bold text-campus-purple mb-4">{formatPrice(item.price)}</p>
            <p className="text-campus-text-secondary text-sm mb-6 leading-relaxed">{item.description}</p>

            {item.location && (
              <div className="flex items-center gap-2 text-sm text-campus-text-secondary mb-4">
                <MapPin className="w-4 h-4 text-campus-purple" /> {item.location}
              </div>
            )}

            {/* Seller */}
            {item.seller && (
              <Link href={`/profile/${item.seller.user_id}`} className="flex items-center gap-3 p-3 bg-campus-bg rounded-xl mb-6 hover:bg-campus-purple-light transition-colors">
                <div className="w-10 h-10 rounded-full bg-campus-purple flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">{item.seller.full_name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-campus-text">{item.seller.full_name}</p>
                  <p className="text-xs text-campus-text-secondary">{item.seller.department}</p>
                </div>
              </Link>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {!isOwner && (
                <button className="btn-primary flex items-center gap-2 flex-1">
                  <MessageCircle className="w-4 h-4" /> Contact Seller
                </button>
              )}
              <button onClick={handleSave} className="btn-secondary flex items-center gap-2">
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="btn-outline flex items-center gap-2">
                <Share2 className="w-4 h-4" />
              </button>
              {isOwner ? (
                <>
                  <Link href={`/marketplace/${item.id}/edit`} className="btn-secondary flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Link>
                  <button onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </>
              ) : (
                <button onClick={handleReport} className="btn-outline flex items-center gap-2 text-campus-danger border-campus-danger hover:bg-red-50">
                  <Flag className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-campus-text-secondary mt-4">Listed {formatDate(item.created_at)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
