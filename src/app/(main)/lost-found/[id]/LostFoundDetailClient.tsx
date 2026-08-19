'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Bookmark, BookmarkCheck, Share2, Trash2, Flag, CheckCircle2, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { LostFoundPost } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface Props { post: LostFoundPost; isSaved: boolean; isOwner: boolean; }

export default function LostFoundDetailClient({ post, isSaved: initialSaved, isOwner }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  const handleSave = async () => {
    const supabase = createClient();
    if (saved) {
      await supabase.from('saved_items').delete().eq('item_type', 'lost_found_post').eq('item_id', post.id);
      setSaved(false); toast.success('Removed from saved');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('saved_items').insert({ user_id: user.id, item_type: 'lost_found_post', item_id: post.id });
      setSaved(true); toast.success('Saved!');
    }
  };

  const handleResolve = async () => {
    if (!confirm('Mark this item as resolved?')) return;
    const supabase = createClient();
    await supabase.from('lost_found_posts').update({ status: 'resolved' }).eq('id', post.id);
    toast.success('Marked as resolved!'); router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    const supabase = createClient();
    await supabase.from('lost_found_posts').delete().eq('id', post.id);
    toast.success('Post deleted'); router.push('/lost-found');
  };

  const handleReport = async () => {
    const reason = prompt('Why are you reporting this post?');
    if (!reason) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('reports').insert({ reported_by: user.id, content_type: 'lost_found_post', content_id: post.id, reason });
    toast.success('Report submitted');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/lost-found" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Lost & Found
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        {/* Image */}
        <div className="relative h-64 sm:h-80 bg-campus-bg">
          {post.image_url ? (
            <img src={post.image_url} alt={post.item_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><AlertCircle className="w-16 h-16 text-campus-text-secondary/20" /></div>
          )}
          <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-sm font-bold uppercase ${post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {post.type}
          </span>
          {post.status === 'resolved' && (
            <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-sm font-semibold bg-campus-success text-white flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Resolved
            </span>
          )}
        </div>

        <div className="p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-campus-text mb-4">{post.item_name}</h1>
          <p className="text-campus-text-secondary leading-relaxed mb-6">{post.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-campus-bg rounded-card-sm mb-6">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-campus-purple" />
              <span className="text-campus-text-secondary">Location:</span>
              <span className="text-campus-text font-medium">{post.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-campus-purple" />
              <span className="text-campus-text-secondary">Date:</span>
              <span className="text-campus-text font-medium">{formatDate(post.date)}</span>
            </div>
            {post.poster && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-campus-purple" />
                <span className="text-campus-text-secondary">Posted by:</span>
                <Link href={`/profile/${post.poster.user_id}`} className="text-campus-purple font-medium hover:underline">{post.poster.full_name}</Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleSave} className="btn-secondary flex items-center gap-2">
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="btn-outline flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
            {isOwner && (
              <>
                {post.status !== 'resolved' && (
                  <button onClick={handleResolve} className="btn-primary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                  </button>
                )}
                <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
            {!isOwner && (
              <button onClick={handleReport} className="btn-outline flex items-center gap-2 text-campus-danger border-campus-danger hover:bg-red-50">
                <Flag className="w-4 h-4" /> Report
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
