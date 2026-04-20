/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, LayoutDashboard, ShoppingBag, Info, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User as FirebaseUser } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: FirebaseUser;
}

export default function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  const tabs = [
    { id: 'scan', label: 'Scanner', icon: Camera },
    { id: 'dashboard', label: 'Stats', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col p-8 gap-6 max-w-[1200px] mx-auto overflow-x-hidden">
      <header className="header-nav">
        <div 
          className="text-2xl font-black tracking-tighter uppercase cursor-pointer" 
          onClick={() => setActiveTab('scan')}
        >
          ReMake <span className="opacity-30">/</span> Scanner.v1
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[13px] font-bold uppercase transition-colors ${
                  isActive ? 'text-accent' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <div className="flex items-center gap-3 border-l border-line pl-10 ml-4">
             <div className="text-right hidden sm:block">
               <div className="text-[10px] font-bold text-ink/40 uppercase tracking-widest leading-none mb-1">Account [0x]</div>
               <div className="text-xs font-bold text-accent uppercase">{user.displayName}</div>
             </div>
             {user.photoURL ? (
               <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 grayscale contrast-125" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-8 h-8 bg-line flex items-center justify-center text-ink/40">
                 <UserIcon size={16} />
               </div>
             )}
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <footer className="md:hidden fixed bottom-6 left-6 right-6 pane border-bold z-40 p-1">
        <nav className="flex justify-around items-center h-12 bg-bg/50 backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-accent' : 'text-ink/40'}`}
              >
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 w-6 h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}


