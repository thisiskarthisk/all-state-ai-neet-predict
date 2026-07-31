'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/CommonUI';
import { getCoursesByExam } from '@/constants';

import Header from './(front-end)/section/header';
import HeroSection from './(front-end)/section/hero';
import TrustStats from './(front-end)/section/trust-stats';
import WhySection from './(front-end)/section/why';
import CollegeComparison from './(front-end)/section/college-comparison';
import HandbookSection from './(front-end)/section/handbook';
import HowItWorksSection from './(front-end)/section/how-it-works';
import CounsellingSection from './(front-end)/section/counselling';
import HomeFAQ from './(front-end)/section/home-faq';
import Footer from './(front-end)/section/footer';
import CounsellingModal from '@/components/CounsellingModal';

const CounsellingKitURL = '/assets/counselling-kit/The Counselling Atlas.pdf';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  // ---- Portal mount guard (document is undefined during SSR) ----
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Active tool tab - default to College Predictor
  const [activeTab, setActiveTab] = useState<'rank' | 'college'>('college');

  // Rank predictor inputs
  const [marks, setMarks] = useState('');
  const [rankResult, setRankResult] = useState<any>(null);
  const [rankLoading, setRankLoading] = useState(false);
  const [rankError, setRankError] = useState('');
  const [rankExamType, setRankExamType] = useState('NEET_UG');

  // College predictor inputs
  const [rank, setRank] = useState('');
  const [examType, setExamType] = useState('NEET_UG');
  const [selectedCourse, setSelectedCourse] = useState('MBBS');
  const [selectedCategory, setSelectedCategory] = useState('UR');
  const [selectedStates, setSelectedStates] = useState<string[]>(['ALL']);

  const [collegeResult, setCollegeResult] = useState<any>(null);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeError, setCollegeError] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [chanceFilter, setChanceFilter] = useState('all');
  const [selectedCounselling, setSelectedCounselling] = useState<any>(null);

  // Mobile nav menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Unified counselling modal (used for handbook, expert help, CTA)
  const [isCounsellingOpen, setIsCounsellingOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CTA overlay suppression flags (so we show modal once per session)
  const [hasShownRankCTA, setHasShownRankCTA] = useState(false);
  const [hasShownCollegeCTA, setHasShownCollegeCTA] = useState(false);

  // FAQ nav dropdown
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isFaqPage = pathname.includes('/faq');

  const fmt = (n?: number | string) => {
    if (n === null || n === undefined) return '—';
    if (typeof n === 'number') {
      if (isNaN(n)) return '—';
      return Math.trunc(n).toLocaleString('en-IN');
    }
    return String(n).replace(/\.\d+/g, '');
  };

  const getMaxMarks = (exam: string) => {
    if (exam === 'NEET_PG') return 800;
    if (exam === 'NEET_MDS') return 960;
    return 720;
  };

  // --- Rank Prediction ---
  const handleRankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRankError('');
    setRankResult(null);
    const marksNum = parseInt(marks, 10);
    const maxM = getMaxMarks(rankExamType);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > maxM) {
      setRankError(`Please enter a valid NEET marks score (0–${maxM}).`);
      return;
    }
    setRankLoading(true);
    try {
      const res = await fetch('/api/ai-predict-markTorank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: marksNum, examType: rankExamType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRankError(data.error || 'Failed to predict rank.');
      } else {
        setRankResult(data);
      }
    } catch {
      setRankError('Connection failed. Please try again.');
    } finally {
      setRankLoading(false);
    }
  };

  // --- College Prediction (AI API query) ---
  const handleCollegeSubmit = async (
    e: React.FormEvent | null,
    overrideRank?: string,
    overrideExam?: string
  ) => {
    if (e) e.preventDefault();
    setCollegeError('');
    setCollegeResult(null);
    setCollegeSearch('');
    setChanceFilter('all');

    const rankToUse = overrideRank !== undefined ? overrideRank : rank;
    const rankNum = parseInt(rankToUse, 10);
    if (isNaN(rankNum) || rankNum < 1) {
      setCollegeError('Please enter a valid NEET All India Rank.');
      return;
    }

    const examToUse = overrideExam !== undefined ? overrideExam : examType;
    const coursesForExam = getCoursesByExam(examToUse as any);
    const coursesToUse =
      selectedCourse === 'ALL' || overrideExam !== undefined
        ? coursesForExam.map((course) => course.code)
        : [selectedCourse];

    setCollegeLoading(true);
    try {
      const res = await fetch('/api/ai-predict-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: rankNum,
          examType: examToUse,
          category: selectedCategory === 'ALL' ? null : selectedCategory,
          courses: coursesToUse,
          states: selectedStates.length > 0 ? selectedStates : ['KA'],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCollegeError(data.error || 'Failed to predict colleges.');
        return;
      }

      const aiResults: any[] = [];

      if (data.colleges && Array.isArray(data.colleges)) {
        data.colleges.forEach((college: any, index: number) => {
          const nameLower = college.name.toLowerCase();

          let type = 'Government';

          if (nameLower.includes('private') || nameLower.includes('society')) {
            type = 'Private';
          } else if (
            nameLower.includes('deemed') ||
            nameLower.includes('symbiosis') ||
            nameLower.includes('gitam')
          ) {
            type = 'Deemed';
          }

          college.courses?.forEach((courseObj: any) => {
            courseObj.categories?.forEach((cat: any) => {
              aiResults.push({
                college_id: index + 1,
                college_name: college.name,
                state_name: college.state,
                college_type: type,
                best_chance: cat.chanceOfAdmission,
                closest_cutoff: cat.cutoffRank,
                cutoffs: [
                  {
                    course_name: courseObj.course,
                    category_name: cat.category,
                    closing_rank: cat.cutoffRank,
                  },
                ],
                counsellingDetail: courseObj.counsellingDetail,
              });
            });
          });
        });
      }

      setCollegeResult({ results: aiResults });
    } catch {
      setCollegeError('Connection failed. Please try again.');
    } finally {
      setCollegeLoading(false);
    }
  };

  // Use predicted rank → switch to college tab
  const handleUseRankForColleges = () => {
    if (rankResult?.expected) {
      const expectedRankStr = rankResult.expected.toString();
      setRank(expectedRankStr);
      setExamType(rankExamType);
      setSelectedCourse('ALL');
      setActiveTab('college');
      setTimeout(
        () => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' }),
        100
      );
      handleCollegeSubmit(null, expectedRankStr, rankExamType);
    }
  };

  const openCounselling = () => {
    setIsCounsellingOpen(true);
  };

  const switchTab = (t: 'rank' | 'college') => {
    setActiveTab(t);
    setRankError('');
    setCollegeError('');
  };

  const handleNavigateToCollegePredictor = () => {
    if (rankResult && typeof window !== 'undefined') {
      localStorage.setItem('predict_rank', rankResult.expected.toString());
      localStorage.setItem('predict_examType', rankExamType);
      localStorage.removeItem('college_prediction_results');
      localStorage.removeItem('collegeList');
      localStorage.removeItem('selectedColleges');
      localStorage.removeItem('selectCollege');
      localStorage.removeItem('predict_states');
      localStorage.removeItem('predict_course');
      localStorage.removeItem('predict_category');
    }
    router.push('/?tab=college');
  };

  // ---- Modal markup, rendered via portal so none of these are ever
  // trapped by an ancestor section's overflow/transform ----


  const counsellingTimelineModalMarkup = selectedCounselling && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="bg-white border-slate-100 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 rounded-[32px] overflow-hidden my-8">
        <div className="border-b border-slate-100 px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-2 border ${
                !selectedCounselling.detail
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : selectedCounselling.detail?.type === 'actual'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                  : 'bg-amber-50 text-amber-700 border-amber-250'
              }`}
            >
              {!selectedCounselling.detail ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1 shrink-0" /> No Schedule
                </>
              ) : selectedCounselling.detail?.type === 'actual' ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1 shrink-0" /> Actual Counselling Schedule
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> Predicted Counselling Detail
                </>
              )}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">
              {selectedCounselling.college_name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {selectedCounselling.course_name} Admission Process
            </p>
          </div>
          <button
            onClick={() => setSelectedCounselling(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 mt-1 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {(() => {
            const detail = selectedCounselling.detail;

            if (!detail || !detail.events || detail.events.length === 0) {
              return (
                <div className="text-center py-8 px-4 flex flex-col items-center">
                  <AlertTriangle className="w-10 h-10 text-rose-500 mb-3" />
                  <h4 className="font-extrabold text-slate-800 text-sm mb-2">
                    Counselling Schedule Not Found
                  </h4>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-xs mb-4">
                    This college does not have any counselling timeline details available.
                    Please contact our expert for assistance.
                  </p>
                </div>
              );
            }

            const isActual = detail.type === 'actual';
            const events = detail.events;

            return (
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6 py-2">
                {events.map((ev: any, index: number) => (
                  <div key={index} className="relative">
                    <span
                      className={`absolute -left-[32px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 ${
                        isActual ? 'border-emerald-600' : 'border-indigo-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isActual ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                      />
                    </span>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 border ${
                          isActual
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {ev.date}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-snug">
                        {ev.event}
                      </h4>
                      {ev.additionalDetails && (
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed font-semibold">
                          {ev.additionalDetails}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[10px] text-slate-400 font-semibold text-center sm:text-left leading-relaxed">
            {!selectedCounselling.detail
              ? 'Connect with our experts to get assistance on this college.'
              : selectedCounselling.detail?.type === 'actual'
              ? 'Based on official announcements. Dates may change.'
              : 'AI predicted based on general academic calendar trends.'}
          </span>
          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => setSelectedCounselling(null)}
              className="px-4 py-2 bg-white text-slate-650 hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-200 transition-all flex-1 sm:flex-initial text-center"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSelectedCounselling(null);
                openCounselling();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex-1 sm:flex-initial text-center"
            >
              Get Expert Help
            </button>
          </div>
        </div>
      </Card>
    </div>
  );


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans leading-relaxed selection:bg-blue-100 selection:text-blue-800">
      {/* ===== HEADER ===== */}
      <Header
        isHomePage={isHomePage}
        isFaqPage={isFaqPage}
        isFaqOpen={isFaqOpen}
        setIsFaqOpen={setIsFaqOpen}
        onGetCounsellingClick={() => {
          const section = document.getElementById('why');
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      <main>
        <HeroSection
          mode="allstate"
          marks={marks}
          setMarks={setMarks}
          rankResult={rankResult}
          setRankResult={setRankResult}
          rankLoading={rankLoading}
          rankError={rankError}
          setRankError={setRankError}
          rankExamType={rankExamType}
          setRankExamType={setRankExamType}
          handleRankSubmit={handleRankSubmit}
          getMaxMarks={getMaxMarks}
          fmt={fmt}
          handleNavigateToCollegePredictor={handleNavigateToCollegePredictor}
        />

        <TrustStats mode="allstate" />

        <WhySection />

        <CollegeComparison />

        {/* <HandbookSection onOpenModal={() => setIsModalOpen(true)} /> */}

        <HowItWorksSection switchTab={switchTab} />

        <CounsellingSection />

        <HomeFAQ />
      </main>

      {/* ===== FOOTER ===== */}
      <Footer
        switchTab={switchTab}
        openCounselling={openCounselling}
        counsellingKitURL={CounsellingKitURL}
      />

      {/* All modals - unified CounsellingModal used everywhere */}
      <CounsellingModal
        isOpen={isModalOpen || isCounsellingOpen}
        mode={isModalOpen ? 'handbook' : 'counselling'}
        onClose={() => { setIsModalOpen(false); setIsCounsellingOpen(false); }}
      />
      {mounted && counsellingTimelineModalMarkup && createPortal(counsellingTimelineModalMarkup, document.body)}

      {/* ===== RESPONSIVE + ANIMATION STYLES ===== */}
      <style jsx global>{`
        :root {
          --container-pad: 16px;
        }
        html {
          -webkit-text-size-adjust: 100%;
        }
        img,
        svg {
          max-width: 100%;
          height: auto;
        }

        html,
        body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .container-cc {
          width: 100%;
          max-width: 1280px;
          margin-inline: auto;
          padding-inline: var(--container-pad);
          box-sizing: border-box;
          min-width: 0;
        }

        :root {
          --header-h: 72px;
        }
        html {
          scroll-padding-top: var(--header-h);
        }
        #tools-section,
        #rank-predictor-section,
        #college-predictor-section,
        #counselling,
        #how-it-works,
        #faq,
        #why,
        #features,
        #trust {
          scroll-margin-top: var(--header-h);
        }

        /* ---------- Smooth scroll-reveal animation used by <Reveal /> ---------- */
        .reveal-el {
          opacity: 0;
          transform: translateY(var(--reveal-y, 24px));
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }
        .reveal-el-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          text-align: center;
          padding-block: 32px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
          .reveal-el {
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .hero-heading-wrap {
          max-width: 100%;
        }

        .hero-title-cc {
          font-size: 3.8rem;
          white-space: normal;
        }
        .hero-subtitle-cc {
          font-size: 2rem;
          line-height: 1.3;
        }
        @media (max-width: 1024px) {
          .hero-title-cc {
            font-size: 2.5rem;
          }
          .hero-subtitle-cc {
            font-size: 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .hero-title-cc {
            font-size: 1.75rem;
          }
          .hero-subtitle-cc {
            font-size: 1rem;
          }
        }

        .section-dark {
          background: linear-gradient(360deg, #0f172a 0%, #111827 100%);
        }

        .section-dark::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(37, 99, 235, 0.32), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .section-dark > * {
          position: relative;
          z-index: 1;
        }

        .section-dark-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;

          background: linear-gradient(180deg, #2b255f 0%, #221d4f 100%);
          color: #fff;
          border: 1px solid rgba(118, 105, 255, 0.35);

          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 20px rgba(35, 29, 79, 0.35);
        }

        .section-dark-btn::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;

          background: radial-gradient(ellipse, rgba(37, 99, 235, 0.32), transparent 70%);

          pointer-events: none;
          z-index: -1;
        }

        .trust-stats {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(135deg, #0095ff 0%, #00e5bf 60%, #2dd4bf 100%);
          color: #fff;
          padding: 4rem 1rem;
        }

        .trust-stats > * {
          position: relative;
          z-index: 1;
        }

        .trust-stats .stat b {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          color: #0b41a7;
          line-height: 1.2;
        }

        .trust-stats .stat span {
          color: #0b41a7;
          font-size: 1.05rem;
          font-weight: 600;
          opacity: 0.95;
        }

        .nav-link {
          position: relative;
          padding-bottom: 6px;
          color: #0a0e1a;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2.5px;
          background: linear-gradient(90deg, #4d9bf5, #2dd4bf);
          border-radius: 99px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          transform: scaleX(1);
        }

        .nav-link:hover,
        .nav-link.active {
          color: #4d9bf5;
        }

        .tab-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;

          background: linear-gradient(180deg, #2b255f 0%, #221d4f 100%);
          color: #fff !important;
          border: 1px solid rgba(118, 105, 255, 0.35);

          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 8px 20px rgba(35, 29, 79, 0.35);
        }

        .tab-btn::before {
          content: "";
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;

          background: radial-gradient(
            ellipse,
            rgba(37, 99, 235, 0.32),
            transparent 70%
          );

          pointer-events: none;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}