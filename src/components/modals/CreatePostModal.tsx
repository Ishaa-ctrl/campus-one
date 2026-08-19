'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ShoppingBag, Search } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  {
    label: 'Notes',
    description: 'Share study materials',
    icon: FileText,
    href: '/notes/upload',
    color: 'bg-blue-50 text-blue-600',
    emoji: '📚',
  },
  {
    label: 'Marketplace',
    description: 'Sell or give away items',
    icon: ShoppingBag,
    href: '/marketplace/create',
    color: 'bg-purple-50 text-purple-600',
    emoji: '🛍',
  },
  {
    label: 'Lost & Found',
    description: 'Report lost or found items',
    icon: Search,
    href: '/lost-found/create',
    color: 'bg-amber-50 text-amber-600',
    emoji: '🔍',
  },
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const router = useRouter();

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-card-lg shadow-dropdown w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-campus-text">What do you want to post?</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-campus-bg transition-colors"
                >
                  <X className="w-5 h-5 text-campus-text-secondary" />
                </button>
              </div>

              <div className="space-y-3">
                {options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleSelect(option.href)}
                    className="w-full flex items-center gap-4 p-4 rounded-card-sm border border-campus-border hover:border-campus-purple/30 hover:bg-campus-purple-50 transition-all duration-200 group"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="text-left">
                      <p className="font-semibold text-campus-text group-hover:text-campus-purple transition-colors">
                        {option.label}
                      </p>
                      <p className="text-sm text-campus-text-secondary">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
