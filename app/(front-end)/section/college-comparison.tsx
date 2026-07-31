'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from './reveal';

export default function CollegeComparison() {
  return (
    <section id="college-comparison" className="py-16 bg-white">
      <div className="container-cc max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 md:p-14 bg-white text-slate-900 shadow-2xl border border-slate-100">
            {/* Background Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-slate-100/60 pointer-events-none" />
            <div className="absolute -bottom-32 right-12 w-[30rem] h-[30rem] rounded-full bg-slate-100/40 pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-slate-100/50 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="md:col-span-8 flex flex-col items-start justify-center text-left">
                {/* Eyebrow Badge */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00e5a3]/10 border border-[#00e5a3]/30 text-[#00b37e] text-xs font-extrabold uppercase tracking-widest mb-4">
                  Compare &amp; Decide
                </span>

                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                  Choose Your MBBS College with Confidence
                </h2>

                {/* Description Content */}
                <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed font-medium max-w-2xl">
                  Stop switching between multiple websites. Compare your shortlisted medical colleges side-by-side on Total Fees, MBBS Seats, NEET AIR Cutoffs, NAAC Accreditation, Hostel &amp; Mess, and Complete Address.
                </p>

                {/* CTA Button */}
                <div>
                  <Link
                    href="/compare-mbbs-colleges"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#00e5a3] hover:bg-[#00d094] text-[#0f172a] font-black text-sm sm:text-base shadow-lg shadow-[#00e5a3]/30 transition-all active:scale-95 cursor-pointer no-underline"
                  >
                    College compare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
