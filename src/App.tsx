/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import ProjectList from './components/ProjectList';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import About from './components/About';
import { ScannedItem, UserStats } from './types';
import { auth, getUserProfile, createUserProfile, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Loader2, Recycle, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan');
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [stats, setStats] = useState<UserStats>({
    itemsScanned: 0,
    projectsCompleted: 0,
    wasteDivertedKg: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          let profile = await getUserProfile(currentUser.uid);
          if (!profile) {
            profile = await createUserProfile(currentUser);
          }
          setStats(profile);
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleScanComplete = (item: ScannedItem) => {
    setScannedItem(item);
    // Locally update for immediate feedback, real update would happen on completion or database sync
    setStats(prev => ({
      ...prev,
      itemsScanned: prev.itemsScanned + 1
    }));
  };

  const resetScan = () => {
    setScannedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <div className="bg-ink text-white px-6 py-2 text-xs font-mono font-black tracking-[0.3em] uppercase">Booting_System.exe</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-2 border-b-2 border-ink/5 -z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 border-r-2 border-t-2 border-ink/5 -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pane max-w-xl w-full p-12 bg-surface shadow-[24px_24px_0_rgba(26,28,25,0.05)]"
        >
          <div className="flex flex-col items-center text-center gap-8">
             <div className="w-20 h-20 border-bold flex items-center justify-center bg-accent text-white">
                <LayoutDashboard size={40} />
             </div>
             <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">ReMake</h1>
                <p className="text-sm font-medium text-ink/60 uppercase max-w-xs leading-relaxed">
                  Autonomous AI item analysis and upcycling resource management system.
                </p>
             </div>
             
             <button 
               onClick={signInWithGoogle}
               className="w-full bg-ink text-white py-5 font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all flex items-center justify-center gap-4 group"
             >
               <div className="w-6 h-px bg-white group-hover:w-10 transition-all" />
               Authenticate_Google_0x
               <div className="w-6 h-px bg-white group-hover:w-10 transition-all" />
             </button>

             <div className="pt-8 border-t border-line w-full">
               <div className="flex justify-center gap-12">
                 <div className="flex flex-col items-center opacity-30">
                    <div className="text-[10px] font-bold uppercase mb-1 tracking-widest">Efficiency</div>
                    <div className="text-xl font-black">94%</div>
                 </div>
                 <div className="flex flex-col items-center opacity-30">
                    <div className="text-[10px] font-bold uppercase mb-1 tracking-widest">Uptime</div>
                    <div className="text-xl font-black">99.9</div>
                 </div>
               </div>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'scan':
        return scannedItem ? (
          <ProjectList 
            item={scannedItem} 
            onReset={resetScan} 
            stats={stats}
            onStatsUpdate={setStats}
          />
        ) : (
          <Scanner onScanComplete={handleScanComplete} />
        );
      case 'dashboard':
        return <Dashboard stats={stats} logout={logout} />;
      case 'marketplace':
        return <Marketplace />;
      case 'about':
        return <About />;
      default:
        return <Scanner onScanComplete={handleScanComplete} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (scannedItem ? '-result' : '-base')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}


