'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  count: string;
  gradient: string;
  delay?: number;
}

export default function QuickAccessCard({
  title,
  description,
  icon: Icon,
  href,
  count,
  gradient,
  delay = 0,
}: QuickAccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="block">
        <div className={`relative overflow-hidden rounded-card p-6 text-white transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${gradient}`}>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-white/70 text-sm mb-3">{description}</p>
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {count}
            </span>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-6 w-32 h-32 bg-white/5 rounded-full" />
        </div>
      </Link>
    </motion.div>
  );
}
