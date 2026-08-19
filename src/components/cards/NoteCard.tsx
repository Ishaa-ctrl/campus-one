'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, User } from 'lucide-react';
import type { Note } from '@/types/database';
import { formatDate, getSemesterLabel } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  index?: number;
}

export default function NoteCard({ note, index = 0 }: NoteCardProps) {
  const fileTypeColors: Record<string, string> = {
    pdf: 'bg-red-50 text-red-600',
    doc: 'bg-blue-50 text-blue-600',
    docx: 'bg-blue-50 text-blue-600',
    ppt: 'bg-orange-50 text-orange-600',
    pptx: 'bg-orange-50 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/notes/${note.id}`} className="block">
        <div className="card card-hover p-4 h-full">
          {/* Thumbnail / File Type Icon */}
          <div className="relative h-36 bg-gradient-to-br from-campus-purple-light to-campus-purple-50 rounded-card-sm flex items-center justify-center mb-4 overflow-hidden">
            {note.thumbnail_url ? (
              <img src={note.thumbnail_url} alt={note.title} className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-12 h-12 text-campus-purple/40" />
            )}
            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${fileTypeColors[note.file_type] || 'bg-gray-100 text-gray-600'}`}>
              {note.file_type}
            </span>
          </div>

          {/* Content */}
          <h3 className="font-semibold text-campus-text text-sm mb-1 line-clamp-2">{note.title}</h3>
          <p className="text-xs text-campus-text-secondary mb-3">{note.subject_name || 'General'}</p>

          <div className="flex items-center justify-between">
            <span className="badge-purple text-[10px]">{getSemesterLabel(note.semester)}</span>
            <div className="flex items-center gap-1 text-campus-text-secondary">
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px]">{note.download_count}</span>
            </div>
          </div>

          {/* Uploader */}
          {note.uploader && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-campus-border">
              <div className="w-5 h-5 rounded-full bg-campus-purple flex items-center justify-center">
                <span className="text-[8px] font-semibold text-white">
                  {note.uploader.full_name?.charAt(0)}
                </span>
              </div>
              <span className="text-[11px] text-campus-text-secondary truncate">
                {note.uploader.full_name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
