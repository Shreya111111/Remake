/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeItem } from '../services/gemini';
import { saveScanResult, auth } from '../lib/firebase';
import { ScannedItem } from '../types';

interface ScannerProps {
  onScanComplete: (item: ScannedItem) => void;
}

export default function Scanner({ onScanComplete }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanItem = async () => {
    if (!preview || !auth.currentUser) return;

    setIsScanning(true);
    setError(null);

    try {
      const base64Data = preview.split(',')[1];
      const result = await analyzeItem(base64Data, 'image/jpeg');

      await saveScanResult(auth.currentUser.uid, {
        name: result.name,
        material: result.material,
        condition: result.condition
      });

      onScanComplete(result);
    } catch (err) {
      console.error('Scan failed:', err);
      setError('AI analysis failed. Please try a different image or check your connection.');
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    setIsScanning(false);
  };

  return (
    <div className="main-grid grid md:grid-cols-[1fr_400px] gap-8 h-full min-h-[500px]">
      <div className="scanner-pane flex flex-col border-bold bg-surface relative overflow-hidden">
        <div className="scanner-view flex-grow bg-[#E2E1DD] relative flex items-center justify-center overflow-hidden min-h-[300px]">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale contrast-125" />
          ) : (
            <div className="text-center p-8 opacity-20 flex flex-col items-center gap-4">
              <Camera size={64} strokeWidth={1} />
              <div className="font-mono text-sm uppercase tracking-tighter">UPLOAD_IMAGE_TO_SCAN</div>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 bg-accent/20 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-white" size={48} />
                <div className="bg-ink text-white px-4 py-1 text-xs font-mono font-bold tracking-widest uppercase">Analyzing_Materials</div>
              </div>
            </div>
          )}
        </div>

        <div className="scanner-meta p-6 bg-bg border-t-2 border-ink">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="label-caps">Status</div>
              <div className="value-mono">{preview ? 'FRAME_CAPTURED' : 'AWAITING_UPLOAD'}</div>
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="label-caps hover:text-ink transition-colors flex items-center gap-2"
              >
                <Upload size={12} /> Local_Source
              </button>
              <div className="value-mono overflow-hidden text-ellipsis whitespace-nowrap">EXT_IMG_01.JPG</div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-pane flex flex-col gap-6 justify-center">
        <div>
          <h1 className="text-[40px] font-black leading-none tracking-tighter uppercase mb-4">Upcycling<br/>Advisor</h1>
          <p className="text-sm font-medium text-ink/60 max-w-[300px]">AI-driven material analysis for standard household discard items.</p>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                className="bg-ink text-white w-full py-4 font-bold uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Upload Item Image
              </motion.button>
            ) : !isScanning ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                <button
                  onClick={scanItem}
                  className="bg-accent text-white w-full py-4 font-bold uppercase tracking-widest hover:bg-ink transition-colors"
                >
                  Generate Path Options
                </button>
                <button
                  onClick={reset}
                  className="border-bold w-full py-4 font-bold uppercase tracking-widest hover:bg-line transition-colors"
                >
                  Reset Frame
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-tight flex items-start gap-4">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

