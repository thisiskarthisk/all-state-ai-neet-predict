'use client';

import Reveal from './reveal';

export default function CounsellingSection() {
  const features = [
    { icon: '⭐', title: 'Compare Government, Private & Deemed Options' },
    { icon: '📅', title: 'Save Your Shortlisted Colleges' },
    { icon: '🏥', title: 'Track Every Counselling Deadline' },
    { icon: '👨‍⚕️', title: 'Receive College Details by Email' },
  ];

  return (
    <section className="counselling py-20" id="counselling">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headings */}
        <Reveal>
          <div className="mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Your College Match Is Just the <br className="hidden sm:inline" />
              Beginning.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 font-medium">
              Everything that comes next happens here.
            </p>
          </div>
        </Reveal>

        {/* 2x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl bg-[#111726]/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0 text-xl">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {f.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom Footer Note */}
        <Reveal>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            One platform. Every counselling update. Every opportunity.
          </p>
        </Reveal>
      </div>
    </section>
  );
}