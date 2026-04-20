/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Globe, Recycle, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const steps = [
    { title: 'Scan', icon: Recycle, desc: 'Use AI to identify common household materials and their condition.' },
    { title: 'Transform', icon: Leaf, desc: 'Browse creative DIY projects tailored to your specific item.' },
    { title: 'Divert', icon: Award, desc: 'Track how many kilograms of waste you have saved from the landfill.' },
    { title: 'Share', icon: Globe, desc: 'Gift or sell your creations to provide them with a full new life.' },
  ];

  return (
    <div className="flex flex-col gap-16 py-8">
      <div className="border-b-2 border-ink pb-8 flex flex-col gap-4">
        <span className="label-caps mb-0">Mission_Statement</span>
        <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4">Reshaping<br/>Waste.v1</h2>
        <p className="text-xl font-medium text-ink/60 leading-relaxed max-w-3xl border-l-4 border-accent pl-8 uppercase">
          Every year, millions of tons of reusable materials are sent to landfills. 
          <span className="text-accent font-black"> ReMake</span> leverages 
          cutting-edge AI to unlock the hidden creative potential in the objects around you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="pane p-8 flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 border-bold flex items-center justify-center bg-bg">
                <step.icon size={20} className="text-accent" />
              </div>
              <span className="font-mono text-xs font-bold text-ink/20">PROC_0{i+1}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{step.title}</h3>
              <p className="text-xs font-medium text-ink/60 uppercase leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-ink text-white p-16 flex flex-col gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Globe size={300} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="label-caps mb-4 text-accent">Global_Impact</div>
          <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Circular_Economy_Protocol</h3>
          <p className="text-sm font-medium text-white/60 uppercase leading-relaxed mb-10">
            By turning trash into treasure, we don't just clear clutter—we reduce the extraction of raw materials, 
            lower carbon emissions from manufacturing, and build a more circular, sustainable economy.
          </p>
          <div className="flex flex-wrap gap-8">
            {['Circularity', 'Sustainability', 'Creativity'].map(tag => (
              <div key={tag} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

