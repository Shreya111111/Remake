/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, Hammer, ChevronRight, CheckCircle2, BookmarkPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScannedItem, UpcyclingProject, UserStats } from '../types';
import { updateStats, auth } from '../lib/firebase';

interface ProjectListProps {
  item: ScannedItem;
  onReset: () => void;
  stats: UserStats;
  onStatsUpdate: (stats: UserStats) => void;
}

export default function ProjectList({ item, onReset, stats, onStatsUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<UpcyclingProject | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (!auth.currentUser) return;
    
    setIsCompleting(true);
    try {
      const newStats = {
        ...stats,
        projectsCompleted: stats.projectsCompleted + 1,
        wasteDivertedKg: stats.wasteDivertedKg + 1.2
      };
      await updateStats(auth.currentUser.uid, newStats);
      onStatsUpdate(newStats);
      onReset();
    } catch (err) {
      console.error("Failed to complete project:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-[450px_1fr] gap-10"
          >
            <div className="flex flex-col gap-8">
              <div className="pane p-8 relative">
                <div className="absolute top-0 right-0 p-4 border-l border-b border-bold bg-accent text-white uppercase text-[10px] font-bold tracking-widest">Analysis_Result</div>
                <div className="label-caps mb-0">Target_Entity</div>
                <h2 className="text-[42px] font-black uppercase leading-none tracking-tighter mb-6">{item.name}</h2>
                
                <div className="grid grid-cols-2 gap-6 border-t-2 border-line pt-6">
                  <div>
                    <div className="label-caps">Material</div>
                    <div className="value-mono uppercase">{item.material}</div>
                  </div>
                  <div>
                    <div className="label-caps">Condition</div>
                    <div className="value-mono uppercase">{item.condition}</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onReset}
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" />
                Initialize_New_Scan
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter border-b-2 border-ink pb-2">Upcycling_Paths</h3>
              <div className="grid gap-4">
                {item.suggestions.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card-geometric cursor-pointer flex items-center justify-between group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div>
                      <div className="label-caps text-[10px]">Option_{String(idx + 1).padStart(2, '0')}</div>
                      <h4 className="text-xl font-bold uppercase group-hover:text-accent transition-colors">{project.title}</h4>
                      <DifficultyDots difficulty={project.difficulty} />
                    </div>
                    <ChevronRight className="text-line group-hover:text-ink transition-all" size={24} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-4xl mx-auto w-full"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 text-ink/40 hover:text-ink transition-colors font-bold uppercase text-xs tracking-widest mb-8"
            >
              <ChevronRight size={16} className="rotate-180" />
              Return_to_Paths
            </button>

            <div className="pane relative overflow-hidden">
              <div className="bg-bg p-10 border-b-2 border-ink flex justify-between items-start">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                     <DifficultyDots difficulty={selectedProject.difficulty} />
                     <div className="h-4 w-px bg-line" />
                     <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{selectedProject.estimatedTime}</div>
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{selectedProject.title}</h2>
                  <p className="text-sm font-medium text-ink/60 uppercase leading-relaxed italic">{selectedProject.description}</p>
                </div>
                <button className="p-4 border-bold hover:bg-line transition-colors">
                  <BookmarkPlus size={24} />
                </button>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-16 bg-surface">
                <div className="space-y-8">
                  <div>
                    <div className="label-caps mb-6 text-sm border-b border-line pb-2">Required_Resources</div>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-sm font-bold uppercase">
                        <div className="w-2 h-2 bg-accent" />
                        Original {item.name}
                      </li>
                      {selectedProject.materialsNeeded.map((mat, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase text-ink/60">
                          <div className="w-2 h-2 bg-line" />
                          {mat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="label-caps mb-6 text-sm border-b border-line pb-2">Execution_Manual</div>
                    <div className="space-y-8">
                      {selectedProject.steps.map((step, i) => (
                        <div key={i} className="flex gap-6">
                          <span className="font-mono text-xs font-bold text-ink/30 mt-1">
                            [{String(i + 1).padStart(2, '0')}]
                          </span>
                          <p className="text-sm font-medium leading-relaxed uppercase">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-bg border-t-2 border-ink flex justify-between items-center sm:flex-row flex-col gap-6">
                <div>
                  <div className="label-caps mb-1">Estimated_Impact</div>
                  <div className="value-mono text-accent">1.2KG DIVERTED FROM LANDFILL</div>
                </div>
                <button 
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="bg-ink text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {isCompleting && <Loader2 className="animate-spin" size={16} />}
                  Execute_Complete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DifficultyDots({ difficulty }: { difficulty: string }) {
  const levels = { Easy: 1, Medium: 2, Hard: 3 };
  const level = levels[difficulty as keyof typeof levels] || 1;
  const label = difficulty.toUpperCase();
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i <= level ? 'bg-accent' : 'bg-line'}`} 
          />
        ))}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-ink/40">{label}</span>
    </div>
  );
}

