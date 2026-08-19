'use client';

import { motion } from 'framer-motion';
import { Calendar, Megaphone, BookOpen, Briefcase, Sun, Info } from 'lucide-react';
import type { Announcement } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  index?: number;
}

const categoryConfig: Record<string, { icon: typeof Megaphone; color: string; bg: string }> = {
  exam: { icon: BookOpen, color: 'text-red-600', bg: 'bg-red-50' },
  event: { icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  placement: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  holiday: { icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50' },
  general: { icon: Info, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export default function AnnouncementCard({ announcement, index = 0 }: AnnouncementCardProps) {
  const config = categoryConfig[announcement.category] || categoryConfig.general;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="card p-5 hover:shadow-card-hover transition-all duration-300">
        <div className="flex gap-4">
          <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-campus-text text-sm">{announcement.title}</h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${config.bg} ${config.color}`}>
                {announcement.category}
              </span>
            </div>
            <p className="text-campus-text-secondary text-sm mt-1.5 line-clamp-2">{announcement.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs text-campus-text-secondary">
                <Calendar className="w-3 h-3" />
                {formatDate(announcement.created_at)}
              </span>
              {announcement.creator && (
                <span className="text-xs text-campus-text-secondary">
                  by {announcement.creator.full_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
