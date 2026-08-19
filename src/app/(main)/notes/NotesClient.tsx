'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Filter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import NoteCard from '@/components/cards/NoteCard';
import EmptyState from '@/components/ui/EmptyState';
import type { Note, Subject } from '@/types/database';
import { FileText } from 'lucide-react';

interface NotesClientProps {
  initialNotes: Note[];
  subjects: Subject[];
}

const semesters = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'downloads', label: 'Most Downloaded' },
];

export default function NotesClient({ initialNotes, subjects }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredNotes = useMemo(() => {
    let filtered = [...initialNotes];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          n.subject_name?.toLowerCase().includes(q) ||
          n.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Semester filter
    if (selectedSemester > 0) {
      filtered = filtered.filter((n) => n.semester === selectedSemester);
    }

    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter((n) => n.subject_id === selectedSubject);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'downloads':
        filtered.sort((a, b) => b.download_count - a.download_count);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [initialNotes, searchQuery, selectedSemester, selectedSubject, sortBy]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-campus-text">Notes & Resources</h1>
          <p className="text-campus-text-secondary text-sm mt-1">Browse study materials shared by your campus community</p>
        </div>
        <Link href="/notes/upload" className="btn-primary flex items-center gap-2 w-fit">
          <Upload className="w-4 h-4" />
          Upload Notes
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
            <input
              type="text"
              placeholder="Search notes by title, subject, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field w-full md:w-48 appearance-none cursor-pointer"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full md:w-44 appearance-none cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Semester Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 -mb-1 custom-scrollbar">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedSemester === sem
                  ? 'bg-campus-purple text-white shadow-button'
                  : 'bg-campus-bg text-campus-text-secondary hover:bg-campus-purple-light hover:text-campus-purple'
              }`}
            >
              {sem === 0 ? 'All' : `Sem ${sem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNotes.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No notes found"
          description={searchQuery || selectedSemester > 0 ? 'Try adjusting your filters or search query.' : 'Be the first to share study materials!'}
          actionLabel="Upload Notes"
          actionHref="/notes/upload"
        />
      )}
    </div>
  );
}
