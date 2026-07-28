'use client';

import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  switchTab?: (t: 'rank' | 'college') => void;
  openCounselling: () => void;
  counsellingKitURL: string;
}

export default function Footer({ switchTab, openCounselling, counsellingKitURL }: FooterProps) {
  return (
    <footer className="bg-[#0a0e1a] text-slate-300 border-t border-slate-800/80 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-4 space-y-5">
            <a href="#" className="inline-block" aria-label="Campus Continents Home">
              <img
                src="/assets/image/logo.png"
                alt="Campus Continents Educational Research Centre"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Established in 2006, Campus Continents Educational Research Centre helps students
              find the right path in education — in India and abroad — with expert counselling
              and admission guidance.
            </p>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Since 2006
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">EXPLORE</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a
                  href="#tools-section"
                  onClick={() => switchTab && switchTab('rank')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Rank Predictor
                </a>
              </li>
              <li>
                <a
                  href="#tools-section"
                  onClick={() => switchTab && switchTab('college')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  College Predictor
                </a>
              </li>
              <li>
                <button
                  style={{display:"none"}}
                  type="button"
                  onClick={openCounselling}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Get Personalised Update
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              RESOURCES
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="/faq/ug-faq" className="text-slate-400 hover:text-white transition-colors">
                  NEET UG Counselling FAQs
                </a>
              </li>
              <li>
                <a href="/faq/pg-faq" className="text-slate-400 hover:text-white transition-colors">
                  NEET PG Counselling FAQs
                </a>
              </li>
              <li>
                <a
                  href={counsellingKitURL || '#'}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  The Counselling Atlas Handbook
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">CONTACT</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a href="mailto:info@campuscontinents.com" className="hover:text-white transition-colors">
                  info@campuscontinents.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a href="tel:+918884421111" className="hover:text-white transition-colors">
                  +91 888 442 1111 / +91 888 442 2221
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Toll Free: 1800 309 4445</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>#86, Gokul Towers, Dr. M.S. Ramaiah Road, Gokula, Bangalore 560 054</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* <p>© 2026 Campus Continents Educational Research Centre. All rights reserved.</p>
          <a href="/Privacy-Policy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/Terms-of-Use" className="hover:text-white transition-colors">
            Terms of Use
          </a> */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 py-6 px-4">
            <p>© 2026 Campus Continents Educational Research Centre. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-slate-700">•</span>
              <a href="/Privacy-Policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-slate-700">•</span>
              <a href="/Terms-of-Use" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}