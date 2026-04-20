/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingDown, Trash2, Zap, Award, Share2, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  logout: () => void;
}

export default function Dashboard({ stats, logout }: DashboardProps) {
  const cards = [
    { title: 'Items Scanned', value: stats.itemsScanned, label: 'UNITS', icon: Trash2 },
    { title: 'Waste Diverted', value: `${stats.wasteDivertedKg}kg`, label: 'WEIGHT', icon: TrendingDown },
    { title: 'Upcycles', value: stats.projectsCompleted, label: 'RESTORATIONS', icon: Zap },
    { title: 'Value Created', value: `$${stats.projectsCompleted * 15}`, label: 'VALUATION', icon: Award },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end border-b-2 border-ink pb-4">
        <div>
          <span className="label-caps mb-0">Identity_Report</span>
          <h2 className="text-[40px] font-black uppercase tracking-tighter leading-none">Personal_Divergence</h2>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 border-bold text-xs font-bold uppercase tracking-widest hover:bg-line transition-all">
            <Share2 size={14} />
            Data_Export
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-2 border-bold border-red-600 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
          >
            <LogOut size={14} />
            Terminal_Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-ink border-2 border-ink">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg p-8 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest leading-none">{card.label}</span>
              <card.icon size={16} className="text-accent" />
            </div>
            <div>
               <div className="text-4xl font-black text-accent mb-1">{card.value}</div>
               <div className="text-[10px] font-bold text-ink uppercase tracking-wider opacity-60">{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 pane p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px]">
          <div className="relative z-10">
            <div className="bg-accent text-white px-3 py-1 inline-block text-[10px] font-bold uppercase tracking-widest mb-6">Achievement_Unlocked</div>
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">Master<br/>Upcycler.v1</h3>
            <p className="text-sm font-medium text-ink/60 uppercase max-w-sm mb-8 leading-relaxed">System analysis confirms you have diverted more material waste than 85% of active local restoration units.</p>
            
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 border-bold flex items-center justify-center bg-bg">
                  <Award size={18} className="text-accent" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
            <Leaf size={400} />
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="pane p-8 flex flex-col gap-6">
             <div>
               <div className="label-caps mb-2">Next_Upgrade</div>
               <h4 className="text-xl font-bold uppercase tracking-tight">Landfill_Guardian_Level_II</h4>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
                 <span>Threshold: 10KG</span>
                 <span>{stats.wasteDivertedKg}/10KG</span>
               </div>
               <div className="h-4 border-bold p-0.5 bg-bg overflow-hidden">
                 <motion.div 
                   className="h-full bg-accent" 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min((stats.wasteDivertedKg / 10) * 100, 100)}%` }}
                 />
               </div>
             </div>
             
             <div className="pt-4 border-t border-line">
               <p className="text-[11px] font-bold text-ink italic opacity-40">"OPTIMAL RESOURCE RECOVERY IN PROGRESS."</p>
             </div>
          </div>

          <div className="bg-sage p-6 flex items-center justify-between border-bold">
             <div className="text-xs font-black uppercase tracking-tighter">System_Check</div>
             <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}


function Leaf({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 7a7 7 0 0 1-7 7c-1.1 0-2.2-.3-3.1-.9"/><path d="M7 21c0-1.5 1-4 4-4m-1-5c-2.4 0-5.4 2-6 3.5A7.5 7.5 0 0 0 3 21h4c1.5 0 3-1 3-3Z"/>
    </svg>
  );
}
