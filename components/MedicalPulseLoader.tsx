'use client';

import React from 'react';
import { Activity, Sparkles, HeartPulse } from 'lucide-react';

interface MedicalPulseLoaderProps {
  title?: string;
  subtitle?: string;
}

export default function MedicalPulseLoader({
  title = "Analyzing NEET Cutoff Data...",
  subtitle = "Evaluating historical AIQ & State Quota data matrix..."
}: MedicalPulseLoaderProps) {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
      {/* Hospital Pulse ECG Monitor Badge */}
      <div className="relative w-28 h-28 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl overflow-hidden group">
        {/* Hospital ECG Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        />

        {/* Ambient Heartbeat Glow Ring */}
        <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full bg-teal-500/30 animate-pulse" />

        {/* Center Heart/Pulse Icon */}
        {/* <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/20">
          <Activity className="w-8 h-8 animate-pulse text-white" />
        </div> */}

        {/* ECG Moving Heartbeat Line SVG */}
        {/* <div className="absolute bottom-1.5 left-0 right-0 h-150 overflow-hidden pointer-events-none opacity-90"> */}
          <svg className="w-full h-full stroke-emerald-400 fill-none stroke-[2.5]" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              d="M0 15 L20 15 L25 15 L28 4 L32 26 L36 1 L40 23 L44 15 L50 15 L100 15"
              className="animate-ecg"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>
        {/* </div> */}
      </div>

      {/* Hospital Pulse Message */}
      <div className="max-w-md space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
          <HeartPulse className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>CC NEET ANALYSER</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{title}</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{subtitle}</p>
      </div>

      {/* ECG Progress Line Bar */}
      <div className="w-56 h-2 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200/80 shadow-inner">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-full animate-indeterminate-pulse" />
      </div>
    </div>
  );
}

