'use client';

import { useState } from 'react';
import { GraduationCap, ChevronDown, Stethoscope, Menu, X } from 'lucide-react';

interface HeaderProps {
  isHomePage: boolean;
  isFaqPage: boolean;
  isFaqOpen: boolean;
  setIsFaqOpen: (v: boolean) => void;
  onGetCounsellingClick: () => void;
}

export default function Header({
  isHomePage,
  isFaqPage,
  isFaqOpen,
  setIsFaqOpen,
  onGetCounsellingClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFaqOpen, setIsMobileFaqOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-100 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="inline-block shrink-0">
          <img
            src="/assets/image/logo.png"
            alt="Campus Continents"
            className="h-9 sm:h-10 lg:h-12 w-auto object-contain"
          />
        </a>

        {/* ===== DESKTOP NAVIGATION (md and up) ===== */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* 1. Rank Predictor */}
          <a
            href="/?tab=rank#tools-section"
            className="relative py-2 text-sm font-bold text-slate-800 hover:text-[#0095ff] transition-colors group whitespace-nowrap"
          >
            <span>Rank Predictor</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#0095ff] to-[#00e5bf] rounded-full transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"
            />
          </a>

          {/* 1.5. College Predictor */}
          <a
            href="/?tab=college#tools-section"
            className="relative py-2 text-sm font-bold text-slate-800 hover:text-[#0095ff] transition-colors group whitespace-nowrap"
          >
            <span>College Predictor</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#0095ff] to-[#00e5bf] rounded-full transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"
            />
          </a>

          {/* 2. FAQs with Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={() => setIsFaqOpen(true)}
            onMouseLeave={() => setIsFaqOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsFaqOpen(!isFaqOpen)}
              className={`relative py-2 text-sm font-bold flex items-center gap-1.5 transition-colors group whitespace-nowrap ${
                isFaqPage ? 'text-[#0095ff]' : 'text-slate-800 hover:text-[#0095ff]'
              }`}
            >
              <span>FAQs on Counselling</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isFaqOpen ? 'rotate-180 text-[#0095ff]' : 'text-slate-500 group-hover:text-[#0095ff]'
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#0095ff] to-[#00e5bf] rounded-full transition-transform duration-300 origin-left ${
                  isFaqPage ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>

            {/* Dropdown Box */}
            {isFaqOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* UG FAQ Link */}
                <a
                  href="/faq/ug-faq"
                  onClick={() => setIsFaqOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0095ff] flex items-center justify-center shrink-0 group-hover/item:bg-[#0095ff] group-hover/item:text-white transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover/item:text-[#0095ff] transition-colors">
                      NEET UG FAQs
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      MBBS / BDS Admissions
                    </div>
                  </div>
                </a>

                {/* PG FAQ Link */}
                <a
                  href="/faq/pg-faq"
                  onClick={() => setIsFaqOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00e5bf] flex items-center justify-center shrink-0 group-hover/item:bg-[#00e5bf] group-hover/item:text-white transition-colors">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover/item:text-[#0095ff] transition-colors">
                      NEET PG FAQs
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      MD / MS / DNB Admissions
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* 3. CTA Button */}
          <button
            type="button"
            onClick={onGetCounsellingClick}
            className="px-5 lg:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#075389] to-[#0e6e5e] hover:from-[#075389] hover:to-[#0e6e5e] text-white font-bold text-xs lg:text-sm shadow-md shadow-sky-400/20 transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            Get Personalised Counselling Update
          </button>
        </div>

        {/* ===== MOBILE HAMBURGER TOGGLE (below md) ===== */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ===== MOBILE MENU PANEL (below md) ===== */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl px-4 sm:px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="max-w-7xl mx-auto flex flex-col gap-1">
            <a
              href="/?tab=rank#tools-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Rank Predictor
            </a>

            <a
              href="/?tab=college#tools-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              College Predictor
            </a>

            {/* Mobile FAQ accordion */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileFaqOpen(!isMobileFaqOpen)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isFaqPage ? 'text-[#0095ff] bg-sky-50' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>FAQs on Counselling</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileFaqOpen ? 'rotate-180 text-[#0095ff]' : 'text-slate-500'
                  }`}
                />
              </button>

              {isMobileFaqOpen && (
                <div className="pl-2 pr-1 pb-1 pt-1 flex flex-col gap-1">
                  <a
                    href="/faq/ug-faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0095ff] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">NEET UG FAQs</div>
                      <div className="text-[11px] text-slate-400 font-medium">MBBS / BDS Admissions</div>
                    </div>
                  </a>
                  <a
                    href="/faq/pg-faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00e5bf] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">NEET PG FAQs</div>
                      <div className="text-[11px] text-slate-400 font-medium">MD / MS / DNB Admissions</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onGetCounsellingClick();
              }}
              className="mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#075389] to-[#0e6e5e] text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
            >
              Get Personalised Counselling Update
            </button>
          </div>
        </div>
      )}
    </header>
  );
}