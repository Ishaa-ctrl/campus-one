'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Palette, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-campus-text mb-6">Settings</h1>

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>
            <div>
              <h3 className="font-semibold text-campus-text">Notifications</h3>
              <p className="text-xs text-campus-text-secondary">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-3 ml-[52px]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-campus-text">Email notifications</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-campus-purple" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-campus-text">New notes in my semester</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-campus-purple" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-campus-text">Marketplace activity</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-campus-purple" />
            </label>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <h3 className="font-semibold text-campus-text">Privacy & Security</h3>
              <p className="text-xs text-campus-text-secondary">Manage your account security</p>
            </div>
          </div>
          <div className="space-y-3 ml-[52px]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-campus-text">Show profile publicly</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-campus-purple" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-campus-text">Show email on profile</span>
              <input type="checkbox" className="w-4 h-4 accent-campus-purple" />
            </label>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Palette className="w-5 h-5 text-purple-600" /></div>
            <div>
              <h3 className="font-semibold text-campus-text">Appearance</h3>
              <p className="text-xs text-campus-text-secondary">Coming soon — dark mode and themes</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button onClick={handleSignOut} disabled={signingOut} className="btn-danger w-full flex items-center justify-center gap-2">
            {signingOut ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing out...</> : <><LogOut className="w-4 h-4" /> Sign Out</>}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
