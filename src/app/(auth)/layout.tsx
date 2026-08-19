'use client';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-bg via-white to-campus-purple-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 bg-campus-purple rounded-xl flex items-center justify-center shadow-button">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-campus-navy font-display">CampusOne</span>
          </Link>
          <p className="text-campus-text-secondary mt-2 text-sm">Your College, One Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-card-lg shadow-card p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-campus-text-secondary mt-8">
          © 2024 CampusOne. Made for students, by students.
        </p>
      </div>
    </div>
  );
}
