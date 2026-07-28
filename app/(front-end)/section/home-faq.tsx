'use client';

import Reveal from './reveal';

export default function HomeFAQ() {
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-500 text-xs font-bold tracking-widest uppercase mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Have Questions About Counselling?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Get clear answers to the questions students and doctors ask most, for both
              undergraduate and postgraduate NEET counselling.
            </p>
          </div>
        </Reveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* NEET UG Card */}
          <Reveal delay={0}>
            <div className="bg-[#f9fafc] border border-slate-200/80 rounded-3xl p-8 sm:p-9 flex flex-col items-start transition-all duration-200 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c2a44] to-[#05070d] flex items-center justify-center text-2xl mb-6 shadow-md">
                🎓
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                NEET UG Counselling FAQs
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                MCC vs. state quota, choice filling, seat allotment, required documents, and
                common mistakes to avoid for MBBS and BDS admissions.
              </p>
              <a
                href="./faq/ug-faq"
                className="mt-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#075389] to-[#0e6e5e] hover:from-[#075389] hover:to-[#0e6e5e] text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 active:scale-95 group"
              >
                <span>View UG FAQs</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </Reveal>

          {/* NEET PG Card */}
          <Reveal delay={100}>
            <div className="bg-[#f9fafc] border border-slate-200/80 rounded-3xl p-8 sm:p-9 flex flex-col items-start transition-all duration-200 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123334] to-[#05070d] flex items-center justify-center text-2xl mb-6 shadow-md">
                🩺
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                NEET PG Counselling FAQs
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                AIQ vs. state counselling, specialty choice filling, seat upgradation, required
                documents, and rules for MD, MS and DNB admissions.
              </p>
              <a
                href="./faq/pg-faq"
                className="mt-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#075389] to-[#0e6e5e] hover:from-[#075389] hover:to-[#0e6e5e] text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 active:scale-95 group"
              >
                <span>View PG FAQs</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}