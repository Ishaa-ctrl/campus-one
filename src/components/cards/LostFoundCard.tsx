'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { LostFoundPost } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface LostFoundCardProps {
  post: LostFoundPost;
  index?: number;
}

export default function LostFoundCard({ post, index = 0 }: LostFoundCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/lost-found/${post.id}`} className="block">
        <div className="card card-hover overflow-hidden h-full">
          {/* Image */}
          <div className="relative h-40 bg-campus-bg overflow-hidden">
            {post.image_url ? (
              <img src={post.image_url} alt={post.item_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-campus-text-secondary/30" />
              </div>
            )}
            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${
              post.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {post.type}
            </span>
            {post.status === 'resolved' && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-campus-success text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Resolved
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-campus-text text-sm mb-2 line-clamp-1">{post.item_name}</h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-campus-text-secondary">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{post.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-campus-text-secondary">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>

            {/* Poster */}
            {post.poster && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-campus-border">
                <div className="w-5 h-5 rounded-full bg-campus-purple flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-semibold text-white">
                    {post.poster.full_name?.charAt(0)}
                  </span>
                </div>
                <span className="text-[11px] text-campus-text-secondary truncate">
                  {post.poster.full_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
