'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import MarketplaceCard from '@/components/cards/MarketplaceCard';
import EmptyState from '@/components/ui/EmptyState';
import type { MarketplaceItem } from '@/types/database';
import { MARKETPLACE_CATEGORIES, CONDITIONS } from '@/lib/utils';

interface MarketplaceClientProps {
  initialItems: MarketplaceItem[];
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export default function MarketplaceClient({ initialItems }: MarketplaceClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredItems = useMemo(() => {
    let filtered = [...initialItems];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [initialItems, searchQuery, selectedCategory, selectedCondition, sortBy]);

  const categories = [{ value: 'all', label: 'All', icon: '🏷️' }, ...MARKETPLACE_CATEGORIES];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-campus-text">Marketplace</h1>
          <p className="text-campus-text-secondary text-sm mt-1">Buy and sell items within your campus community</p>
        </div>
        <Link href="/marketplace/create" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Create Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-campus-text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)} className="input-field w-full md:w-40 appearance-none cursor-pointer">
            <option value="">Any Condition</option>
            {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-full md:w-44 appearance-none cursor-pointer">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-campus-purple text-white shadow-button'
                  : 'bg-campus-bg text-campus-text-secondary hover:bg-campus-purple-light hover:text-campus-purple'
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, i) => (
            <MarketplaceCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No listings found"
          description={searchQuery || selectedCategory !== 'all' ? 'Try adjusting your filters.' : 'Be the first to list something!'}
          actionLabel="Create Listing"
          actionHref="/marketplace/create"
        />
      )}
    </div>
  );
}
