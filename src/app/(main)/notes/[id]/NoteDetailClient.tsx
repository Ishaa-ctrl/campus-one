'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Bookmark, BookmarkCheck, Share2, Trash2,
  FileText, Calendar, User, Tag, Hash
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Note } from '@/types/database';
import { formatDate, formatFileSize, getSemesterLabel } from '@/lib/utils';

interface NoteDetailClientProps {
  note: Note;
  isSaved: boolean;
  isOwner: boolean;
}

export default function NoteDetailClient({ note, isSaved: initialSaved, isOwner }: NoteDetailClientProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const supabase = createClient();
      // Increment download count
      await supabase.from('notes').update({ download_count: note.download_count + 1 }).eq('id', note.id);
      // Open file URL
      window.open(note.file_url, '_blank');
      toast.success('Download started!');
    } catch {
      toast.error('Failed to download');
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    const supabase = createClient();
    if (saved) {
      await supabase.from('saved_items').delete().eq('item_type', 'note').eq('item_id', note.id);
      setSaved(false);
      toast.success('Removed from saved');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('saved_items').insert({ user_id: user.id, item_type: 'note', item_id: note.id });
      setSaved(true);
      toast.success('Saved!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('notes').delete().eq('id', note.id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Note deleted');
      router.push('/notes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Notes
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-purple">{getSemesterLabel(note.semester)}</span>
              <span className="badge-gray uppercase text-[10px] font-bold">{note.file_type}</span>
            </div>
            <h1 className="text-2xl font-bold text-campus-text mb-2">{note.title}</h1>
            {note.description && (
              <p className="text-campus-text-secondary">{note.description}</p>
            )}
          </div>
        </div>

        {/* File Preview Area */}
        <div className="bg-gradient-to-br from-campus-purple-light to-campus-purple-50 rounded-card-sm p-12 flex flex-col items-center justify-center mb-6">
          <FileText className="w-16 h-16 text-campus-purple/40 mb-3" />
          <p className="text-campus-text-secondary text-sm">{note.file_type.toUpperCase()} Document</p>
          {note.file_size > 0 && <p className="text-campus-text-secondary text-xs mt-1">{formatFileSize(note.file_size)}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={handleDownload} disabled={downloading} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            {downloading ? 'Downloading...' : 'Download'}
          </button>
          <button onClick={handleSave} className="btn-secondary flex items-center gap-2">
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="btn-outline flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          {isOwner && (
            <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-campus-bg rounded-card-sm">
          {note.subject_name && (
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-campus-purple" />
              <span className="text-campus-text-secondary">Subject:</span>
              <span className="text-campus-text font-medium">{note.subject_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-campus-purple" />
            <span className="text-campus-text-secondary">Uploaded:</span>
            <span className="text-campus-text font-medium">{formatDate(note.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4 text-campus-purple" />
            <span className="text-campus-text-secondary">Downloads:</span>
            <span className="text-campus-text font-medium">{note.download_count}</span>
          </div>
          {note.uploader && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-campus-purple" />
              <span className="text-campus-text-secondary">By:</span>
              <Link href={`/profile/${note.uploader.user_id}`} className="text-campus-purple font-medium hover:underline">
                {note.uploader.full_name}
              </Link>
            </div>
          )}
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-campus-bg rounded-full text-xs text-campus-text-secondary">
                <Hash className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
