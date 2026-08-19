'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, FileText, ShoppingBag, AlertCircle, X, ChevronRight } from 'lucide-react';
import type { SearchResult } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results && (
    results.notes.length > 0 ||
    results.marketplace.length > 0 ||
    results.lostFound.length > 0
  );

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
        <input
          type="text"
          placeholder="Search notes, books, items..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          className="w-full pl-10 pr-9 py-2.5 bg-campus-bg rounded-xl text-sm text-campus-text placeholder:text-campus-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-campus-purple/20 transition-all"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-purple animate-spin" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-campus-text-secondary hover:text-campus-text"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-card-sm shadow-dropdown border border-campus-border max-h-[480px] overflow-y-auto z-50 custom-scrollbar p-2 animate-fade-in">
          {loading ? (
            <div className="py-8 text-center text-sm text-campus-text-secondary flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-campus-purple" />
              Searching...
            </div>
          ) : hasResults ? (
            <div className="space-y-4">
              {/* Notes Results */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-campus-purple uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" /> Notes ({results.notes.length})
                  </div>
                  <div className="space-y-1">
                    {results.notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleSelect(`/notes/${note.id}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-campus-purple-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-medium text-campus-text truncate group-hover:text-campus-purple">
                            {note.title}
                          </p>
                          <p className="text-xs text-campus-text-secondary truncate">
                            Sem {note.semester} • {note.subject_name || 'General'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-campus-text-secondary group-hover:text-campus-purple flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketplace Results */}
              {results.marketplace.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5" /> Marketplace ({results.marketplace.length})
                  </div>
                  <div className="space-y-1">
                    {results.marketplace.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(`/marketplace/${item.id}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-medium text-campus-text truncate group-hover:text-emerald-700">
                            {item.title}
                          </p>
                          <p className="text-xs text-campus-text-secondary truncate">
                            {formatPrice(item.price)} • {item.category}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-campus-text-secondary group-hover:text-emerald-700 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lost & Found Results */}
              {results.lostFound.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" /> Lost & Found ({results.lostFound.length})
                  </div>
                  <div className="space-y-1">
                    {results.lostFound.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleSelect(`/lost-found/${post.id}`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-medium text-campus-text truncate group-hover:text-amber-700">
                            {post.item_name}
                          </p>
                          <p className="text-xs text-campus-text-secondary truncate">
                            {post.type.toUpperCase()} • {post.location}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-campus-text-secondary group-hover:text-amber-700 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-campus-text-secondary">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
