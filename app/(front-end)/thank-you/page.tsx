'use client';

import Link from 'next/link';
import { CheckCircle2, Mail, ArrowLeft, GraduationCap } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-500 ease-out my-auto">
        {/* Soft glowing outer border */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[32px] scale-[1.02] -z-10 blur-md" />

        <div className="w-full bg-[#0f1523]/90 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 shadow-2xl text-center rounded-[32px]">
          {/* Success Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 duration-1000" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-10 h-10 stroke-[2.25]" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Your Personalized Medical College Report Is Being Prepared.
          </h1>

          {/* Message Content */}
          <div className="space-y-3 mb-8 text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto">
            <p className="text-emerald-400 font-bold text-base">
              Thank you for sharing your details.
            </p>
            <p className="text-slate-300">
              We're generating a personalized report based on your NEET Rank, Category, and College Preferences.
            </p>
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 font-semibold mt-2 w-full">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You'll receive it shortly on your Email.</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800/80">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
            <Link
              href="/college-counselling"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-colors border border-slate-700/60 flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> College Counselling
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}