'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Tag,
  MapPin,
  Hash,
  Landmark,
  X,
  Calendar,
  Clock,
  ArrowLeft,
  Download,
  Handshake,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileSpreadsheet,
  Building,
  Sparkles,
  ChevronRight,
  Bell,
  Circle,
} from 'lucide-react';
import type { SelectedCollege, StudentProfile } from '@/types/counselling';
import Header from '../section/header';
import MedicalPulseLoader from '@/components/MedicalPulseLoader';
import CounsellingModal from '@/components/CounsellingModal';
import { getAuthorityForState } from '@/lib/ai/counsellingAuthorities';
import Reveal from '../section/reveal';

// Color themes mapping for dynamic styling across timeline stages
const stepThemes = [
  { icon: ClipboardCheck },
  { icon: FileSpreadsheet },
  { icon: Building },
  { icon: GraduationCap },
  { icon: Sparkles },
  { icon: Bell },
];

// Shared brand gradient used across the site's dark hero / accent cards
const BRAND_GRADIENT = 'linear-gradient(135deg, #0095ff 0%, #00e5bf 60%, #2dd4bf 100%)';

function formatDateToDDMMMYYYY(dateStr: string): string {
  if (!dateStr || dateStr.toUpperCase() === 'TBA') return 'TBA';
  const cleanStr = dateStr.trim();
  if (/^\d{1,2}\/[A-Za-z]{3}\/\d{4}$/.test(cleanStr)) {
    return cleanStr;
  }
  try {
    const d = new Date(cleanStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch {}
  return cleanStr;
}

export default function CollegeCounsellingPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const isHomePage = pathname === '/';
  const isFaqPage = pathname.includes('/faq');

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [selectedColleges, setSelectedColleges] = useState<SelectedCollege[]>([]);
  const [expandedCollegeId, setExpandedCollegeId] = useState<number | string | null>(null);

  // Tracks which college's "Official Website & State Counselling Authority" panel is expanded
  const [expandedAuthorityIds, setExpandedAuthorityIds] = useState<Record<string, boolean>>({});

  const toggleAuthorityPanel = (id: number | string) => {
    setExpandedAuthorityIds((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  // Refs + scroll-position state for each college's horizontal timeline stepper
  const stepperRefs = useState(() => new Map<string, HTMLDivElement | null>())[0];
  const stepperRefCallbacks = useState(() => new Map<string, (el: HTMLDivElement | null) => void>())[0];
  const [stepperScrollState, setStepperScrollState] = useState<Record<string, { atStart: boolean; atEnd: boolean }>>({});

  const updateStepperScrollState = (id: number | string) => {
    const el = stepperRefs.get(String(id));
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setStepperScrollState((prev) => {
      const key = String(id);
      const existing = prev[key];
      if (existing && existing.atStart === atStart && existing.atEnd === atEnd) return prev;
      return { ...prev, [key]: { atStart, atEnd } };
    });
  };

  const getStepperRefCallback = (id: number | string) => {
    const key = String(id);
    if (!stepperRefCallbacks.has(key)) {
      stepperRefCallbacks.set(key, (el: HTMLDivElement | null) => {
        stepperRefs.set(key, el);
        if (el) {
          requestAnimationFrame(() => updateStepperScrollState(id));
        }
      });
    }
    return stepperRefCallbacks.get(key)!;
  };

  const scrollStepper = (id: number | string, direction: 1 | -1) => {
    const el = stepperRefs.get(String(id));
    if (!el) return;
    el.scrollBy({ left: direction * 260, behavior: 'smooth' });
    setTimeout(() => updateStepperScrollState(id), 300);
  };

  // Modal State — shared CounsellingModal component
  const [expertModalOpen, setExpertModalOpen] = useState(false);

  // Download PDF Loading
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Counselling details API fetch state
  const [counsellingLoading, setCounsellingLoading] = useState(false);

  const fetchCounsellingDetails = async (collegesList: any[], storedExamType: string, storedCategory: string, storedCourse: string) => {
    if (!collegesList || collegesList.length === 0) return;
    setCounsellingLoading(true);
    try {
      const res = await fetch('/api/ai-predict-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'counselling',
          selectedColleges: collegesList.map(c => ({
            name: c.college_name || c.name,
            state: c.state_name || c.state,
            city: c.city_name || c.city || '',
            college_id: c.college_id
          })),
          examType: storedExamType,
          category: storedCategory,
          course: storedCourse
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch counselling details.');
      }

      const data = await res.json();
      if (data && Array.isArray(data.colleges)) {
        setSelectedColleges((prev) =>
          prev.map((c) => {
            const match = data.colleges.find(
              (dc: any) =>
                dc.college_id === c.college_id ||
                dc.name.toLowerCase() === (c.college_name || '').toLowerCase() ||
                (c.college_name || '').toLowerCase().includes(dc.name.toLowerCase()) ||
                dc.name.toLowerCase().includes((c.college_name || '').toLowerCase())
            );
            if (match) {
              return {
                ...c,
                officialWebsite: match.officialWebsite,
                city_name: match.city || c.city_name || '',
                authorityInfo: match.authorityInfo || getAuthorityForState(c.state_name),
                counsellingDetail: match.counsellingDetail
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Counselling fetch failed:', err);
    } finally {
      setCounsellingLoading(false);
    }
  };

  // Load from localStorage on client mount & trigger smooth auto-scroll to main content
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedRank = localStorage.getItem('predict_rank') || '—';
      const storedExamType = localStorage.getItem('predict_examType') || 'NEET_UG';
      const storedCourse = localStorage.getItem('predict_course') || 'ALL';
      const storedCategory = localStorage.getItem('predict_category') || 'ALL';
      const storedStates = localStorage.getItem('predict_states');
      const storedColleges = localStorage.getItem('selectCollege') || localStorage.getItem('selectedColleges');

      let statesArr: string[] = ['Karnataka (KA)'];
      if (storedStates) {
        try {
          const parsed = JSON.parse(storedStates);
          statesArr = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          statesArr = ['Karnataka (KA)'];
        }
      }

      setProfile({
        course: storedCourse === 'ALL' ? 'MBBS' : storedCourse,
        exam: storedExamType.replace(/_/g, ' '),
        category: storedCategory === 'ALL' ? 'General / All Categories' : storedCategory,
        quota: 'State Quota (85%) / AIQ',
        states: statesArr,
        rank: storedRank,
      });

      if (storedColleges) {
        try {
          const parsedColleges = JSON.parse(storedColleges);
          if (Array.isArray(parsedColleges)) {
            setSelectedColleges(parsedColleges);
            if (parsedColleges.length > 0) {
              setExpandedCollegeId(parsedColleges[0].college_id || parsedColleges[0].name);
              fetchCounsellingDetails(parsedColleges, storedExamType, storedCategory, storedCourse);
            }
          }
        } catch {}
      }

      // Smooth auto scroll directly to counselling main section
      setTimeout(() => {
        const el = document.getElementById('counselling-main-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  const handleRemoveCollege = (id: number | string) => {
    const updated = selectedColleges.filter((c) => c.college_id !== id);
    setSelectedColleges(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedColleges', JSON.stringify(updated));
    }
  };

  // Robust PDF & Printable Plan Download Handler
  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const payload = {
        studentProfile: profile,
        selectedColleges: selectedColleges,
      };

      const res = await fetch('/api/counselling/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';

      if (res.ok) {
        if (contentType.includes('application/pdf')) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `NEET-Counselling-Plan-AIR-${profile?.rank || 'NEET'}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          const htmlText = await res.text();
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(htmlText);
            printWindow.document.close();
            setTimeout(() => {
              printWindow.focus();
              printWindow.print();
            }, 500);
          } else {
            alert('Popup blocked. Please allow popups to download/print your PDF report.');
          }
        }
      } else {
        alert('Failed to generate PDF download. Please try again.');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Error downloading PDF plan.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!mounted) return null;

  const fmt = (n?: number | string) => {
    if (n === null || n === undefined) return '—';
    if (typeof n === 'number') {
      if (isNaN(n)) return '—';
      return Math.trunc(n).toLocaleString('en-IN');
    }
    return String(n).replace(/\.\d+/g, '');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans leading-relaxed section-dark">
      {/* ===== COMMON SITE HEADER ===== */}
      <Header
        isHomePage={isHomePage}
        isFaqPage={isFaqPage}
        isFaqOpen={isFaqOpen}
        setIsFaqOpen={setIsFaqOpen}
        onGetCounsellingClick={() => setExpertModalOpen(true)}
      />

      {/* Main Responsive Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          
          {/* ===== LEFT COLUMN: STUDENT PROFILE CARD ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden lg:sticky lg:top-24">
              <div className="p-5 text-white" style={{ background: BRAND_GRADIENT }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-black/80 uppercase tracking-wider block">
                      Student Profile
                    </span>
                    <h3 className="text-base font-black text-black leading-tight">Your NEET Profile</h3>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-black text-xs">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      NEET All India Rank
                    </p>
                    <p className="text-base font-black text-indigo-900 leading-tight">
                      AIR {profile?.rank || '—'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">NEET Exam</p>
                    <p className="text-xs font-extrabold text-slate-800">{profile?.exam || 'NEET UG'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Target Course</p>
                    <p className="text-xs font-extrabold text-slate-800">{profile?.course || 'MBBS'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Category</p>
                    <p className="text-xs font-extrabold text-slate-800">{profile?.category || 'General'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Quota</p>
                    <p className="text-xs font-extrabold text-slate-800">{profile?.quota || 'State Quota (85%) / AIQ'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Preferred States
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 leading-snug">
                      {Array.isArray(profile?.states)
                        ? profile?.states.length === 0 || profile?.states.includes('AI')
                          ? 'Karnataka (KA)'
                          : profile?.states.join(', ')
                        : profile?.states || 'Karnataka (KA)'}
                    </p>
                  </div>
                </div>

                {/* <button
                  onClick={() => setExpertModalOpen(true)}
                  className="section-dark-btn w-full mt-2 py-3 px-4 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Show counselling window</span>
                </button> */}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN: SELECTED COLLEGES & COUNSELLING KIT (FIXED HEADER & FOOTER, INNER SCROLL) ===== */}
          <div id="counselling-main-section" className="lg:col-span-3 min-w-0">
            <Reveal delay={120}>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[640px] max-h-[850px]">
                
                {/* 1. FIXED TOP HEADER BAR */}
                <div className="shrink-0 p-4 sm:p-5 border-b border-slate-200 bg-white/95 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-150">
                      Counselling Kit
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                      Selected Colleges ({selectedColleges.length})
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Click on any college card to view its AI-predicted admission timeline stages.
                    </p>
                  </div>

                  {/* <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloadingPdf}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {downloadingPdf ? (
                        <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span>PDF Report</span>
                    </button>

                    <button
                      onClick={() => setExpertModalOpen(true)}
                      className="section-dark-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Handshake className="w-4 h-4" />
                      <span>Alert my counselling window on Email</span>
                    </button>
                  </div> */}
                </div>

                {/* 2. SCROLLABLE MIDDLE CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {selectedColleges.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                      <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-extrabold text-slate-800 text-base">No Colleges Selected</h3>
                      <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto font-semibold">
                        Go back to the NEET College Predictor page, search for matching seats, and select
                        college cards.
                      </p>
                      <button
                        onClick={() => router.push('/?tab=college&restore=true')}
                        className="section-dark-btn mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all shadow-md cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to College Predictor</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedColleges.map((college, index) => {
                        const isExpanded = expandedCollegeId === college.college_id;
                        const isAuthorityOpen = !!expandedAuthorityIds[String(college.college_id)];

                        return (
                          <div
                            key={college.college_id}
                            className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden ${
                              isExpanded
                                ? 'border-indigo-300 ring-2 ring-indigo-100 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {/* Main College Card Bar */}
                            <div
                              onClick={() => setExpandedCollegeId(isExpanded ? null : college.college_id)}
                              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug break-words">
                                    {college.college_name}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-semibold mt-1 flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {college.city_name ? `${college.city_name}, ` : ''}{college.state_name}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-extrabold border whitespace-nowrap ${
                                    college.best_chance === 'High'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : college.best_chance === 'Medium'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                >
                                  {college.best_chance || 'Reach'} Chance
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedCollegeId(isExpanded ? null : college.college_id);
                                  }}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                    isExpanded
                                      ? 'section-dark-btn border-transparent'
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/60'
                                  }`}
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{isExpanded ? 'Hide Timeline' : 'Counselling Info'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCollege(college.college_id);
                                  }}
                                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-150 transition-colors shrink-0 cursor-pointer"
                                  title="Remove college"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Expandable College Timeline Area inside card */}
                            {isExpanded && (
                              <div className="border-t border-slate-150 bg-slate-50/70 p-4 sm:p-6 space-y-5 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-150">
                                      Admission Pathway Roadmap
                                    </span>
                                    <h4 className="font-black text-sm sm:text-base text-slate-900 mt-1 flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                                      <span className="break-words">
                                        Counselling &amp; Seat Allotment Timeline — {college.college_name}
                                      </span>
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                                      Cutoff: AIR ~{fmt(college.closest_cutoff)}
                                    </span>
                                  </div>
                                </div>

                                {counsellingLoading ? (
                                  <div className="py-12 flex justify-center">
                                    <MedicalPulseLoader
                                      title="Generating Official Counselling Timeline..."
                                      subtitle={`Fetching official dates, websites, and procedures for ${college.college_name}...`}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    {/* Horizontal Process Stepper UI */}
                                    {(() => {
                                      const eventsList =
                                        college.counsellingDetail &&
                                        Array.isArray(college.counsellingDetail.events) &&
                                        college.counsellingDetail.events.length > 0
                                          ? college.counsellingDetail.events.map((ev: any, idx: number) => ({
                                              stage: ev.stage || `Step ${idx + 1}`,
                                              event: ev.event || `Phase ${idx + 1}`,
                                              startDate: formatDateToDDMMMYYYY(ev.startDate || ev.date || 'Date TBA'),
                                              endDate: formatDateToDDMMMYYYY(ev.endDate || ''),
                                              status: ev.status || 'upcoming',
                                            }))
                                          : null;

                                      if (!eventsList || !Array.isArray(eventsList)) return null;

                                      const scrollState = stepperScrollState[String(college.college_id)] || { atStart: true, atEnd: false };

                                      return (
                                        <div className="w-full bg-white border border-indigo-100/80 rounded-2xl p-4 sm:p-6 shadow-xs relative">
                                          {!scrollState.atStart && (
                                            <button
                                              type="button"
                                              onClick={() => scrollStepper(college.college_id, -1)}
                                              aria-label="Scroll timeline left"
                                              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border border-indigo-100 text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
                                            >
                                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
                                            </button>
                                          )}
                                          {!scrollState.atEnd && (
                                            <button
                                              type="button"
                                              onClick={() => scrollStepper(college.college_id, 1)}
                                              aria-label="Scroll timeline right"
                                              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border border-indigo-100 text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
                                            >
                                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                          )}

                                          {!scrollState.atStart && (
                                            <div className="pointer-events-none absolute left-0 top-4 bottom-4 w-10 sm:w-14 z-10 bg-gradient-to-r from-white to-transparent rounded-l-2xl" />
                                          )}
                                          {!scrollState.atEnd && (
                                            <div className="pointer-events-none absolute right-0 top-4 bottom-4 w-10 sm:w-14 z-10 bg-gradient-to-l from-white to-transparent rounded-r-2xl" />
                                          )}

                                          <div
                                            ref={getStepperRefCallback(college.college_id)}
                                            onScroll={() => updateStepperScrollState(college.college_id)}
                                            className="overflow-x-auto scrollbar-none pb-2 pt-1"
                                          >
                                            <div className="flex items-start min-w-[850px] relative px-4">
                                              {eventsList.map((ev: any, evIdx: number) => {
                                                const isLast = evIdx === eventsList.length - 1;
                                                const isCompleted = ev.status === 'completed';
                                                const isCurrent = ev.status === 'current';
                                                const isUpcoming = ev.status === 'upcoming';

                                                const theme = stepThemes[evIdx % stepThemes.length];
                                                const IconComp = theme.icon;

                                                return (
                                                  <div
                                                    key={evIdx}
                                                    className={`flex-1 flex flex-col items-center relative group ${
                                                      isUpcoming ? 'opacity-60' : 'opacity-100'
                                                    }`}
                                                  >
                                                    {!isLast && (
                                                      <div className="absolute top-6 left-[50%] right-[-50%] h-[2px] z-0">
                                                        <div
                                                          className={`h-full w-full ${
                                                            isCompleted
                                                              ? 'bg-emerald-500'
                                                              : isCurrent
                                                              ? 'bg-gradient-to-r from-indigo-500 to-slate-200'
                                                              : 'bg-slate-200'
                                                          }`}
                                                        />
                                                      </div>
                                                    )}

                                                    <div
                                                      className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-xs ${
                                                        isCompleted
                                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                                          : isCurrent
                                                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600 ring-4 ring-indigo-100'
                                                          : 'bg-slate-50 border-slate-300 text-slate-400'
                                                      }`}
                                                    >
                                                      {isCompleted ? (
                                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                                                      ) : isCurrent ? (
                                                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                                                      ) : (
                                                        <Circle className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                                                      )}
                                                    </div>

                                                    <div className="mt-3 text-center flex flex-col items-center max-w-[130px]">
                                                      <h5
                                                        className={`text-xs font-bold leading-snug ${
                                                          isUpcoming ? 'text-slate-500' : 'text-slate-800'
                                                        }`}
                                                      >
                                                        {ev.event || ev.stage}
                                                      </h5>

                                                      <div className="mt-1.5 flex flex-col items-center gap-0.5 text-center">
                                                        <span className="text-[10px] font-black text-slate-700">
                                                          Start: <span className="font-semibold text-slate-600">{ev.startDate}</span>
                                                        </span>
                                                        {ev.endDate ? (
                                                          <span className="text-[10px] font-black text-indigo-650 mt-0.5">
                                                            End: <span className="font-semibold text-indigo-500">{ev.endDate}</span>
                                                          </span>
                                                        ) : (
                                                          <span className="text-[9px] font-bold text-slate-400">
                                                            End: TBA
                                                          </span>
                                                        )}
                                                      </div>

                                                      <span
                                                        className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                                                          isCompleted
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                            : isCurrent
                                                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}
                                                      >
                                                        {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Upcoming'}
                                                      </span>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {(!scrollState.atStart || !scrollState.atEnd) && (
                                            <p className="mt-2 text-center text-[10px] font-bold text-slate-400 sm:hidden">
                                              Swipe or tap arrows to see full timeline
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })()}

                                    {/* State Counselling Authority Section */}
                                    {(() => {
                                      const auth = college.authorityInfo || getAuthorityForState(college.state_name);
                                      const isPrivate = ['private', 'deemed', 'management'].includes(college.college_type?.toLowerCase() || '');

                                      return (
                                        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-lg overflow-hidden">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleAuthorityPanel(college.college_id);
                                            }}
                                            className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                                          >
                                            <div className="min-w-0">
                                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/30">
                                                Official State Counselling Authority &amp; Portals
                                              </span>
                                              <h4 className="font-extrabold text-base text-white mt-1.5 flex items-center gap-2">
                                                <Landmark className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                                                <span className="break-words">
                                                  {auth ? auth.authority : `${college.state_name} Counselling Board`}
                                                </span>
                                              </h4>
                                              {auth && (
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                  {auth.organization} · <span className="text-indigo-300 font-semibold">{auth.quotaType}</span>
                                                </p>
                                              )}
                                              {!isAuthorityOpen && (
                                                <p className="text-[11px] text-indigo-300 font-bold mt-2 flex items-center gap-1">
                                                  <span>Tap to view official portals &amp; links</span>
                                                  <ChevronDown className="w-3.5 h-3.5" />
                                                </p>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                              {college.officialWebsite && (
                                                <a
                                                  href={college.officialWebsite}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-colors shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
                                                >
                                                  <span>{isPrivate ? 'College Website' : 'Official Portal'}</span>
                                                  <ChevronRight className="w-3.5 h-3.5" />
                                                </a>
                                              )}
                                              <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                                                {isAuthorityOpen ? (
                                                  <ChevronUp className="w-4 h-4 text-white" />
                                                ) : (
                                                  <ChevronDown className="w-4 h-4 text-white" />
                                                )}
                                              </span>
                                            </div>
                                          </button>

                                          {isAuthorityOpen && (
                                            <div className="px-5 pb-5 pt-1 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                                              {auth && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-4">
                                                  {auth.ugPortal && (
                                                    <a
                                                      href={auth.ugPortal}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs transition-all hover:border-indigo-500/50 flex flex-col group"
                                                    >
                                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300">UG Admissions Portal</span>
                                                      <span className="font-extrabold text-indigo-400 truncate text-[11px] mt-0.5">{auth.ugPortal.replace(/^https?:\/\//, '')}</span>
                                                    </a>
                                                  )}
                                                  {auth.pgPortal && (
                                                    <a
                                                      href={auth.pgPortal}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs transition-all hover:border-indigo-500/50 flex flex-col group"
                                                    >
                                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300">PG Admissions Portal</span>
                                                      <span className="font-extrabold text-indigo-400 truncate text-[11px] mt-0.5">{auth.pgPortal.replace(/^https?:\/\//, '')}</span>
                                                    </a>
                                                  )}
                                                  {auth.registrationPortal && (
                                                    <a
                                                      href={auth.registrationPortal}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs transition-all hover:border-indigo-500/50 flex flex-col group"
                                                    >
                                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300">Registration / Choice Portal</span>
                                                      <span className="font-extrabold text-indigo-400 truncate text-[11px] mt-0.5">{auth.registrationPortal.replace(/^https?:\/\//, '')}</span>
                                                    </a>
                                                  )}
                                                  {auth.officialWebsite && (
                                                    <a
                                                      href={auth.officialWebsite}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs transition-all hover:border-indigo-500/50 flex flex-col group"
                                                    >
                                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300 font-mono">Main Board Site</span>
                                                      <span className="font-extrabold text-indigo-400 truncate text-[11px] mt-0.5">{auth.officialWebsite.replace(/^https?:\/\//, '')}</span>
                                                    </a>
                                                  )}
                                                </div>
                                              )}

                                              {auth && auth.notes && (
                                                <p className="text-[11px] text-slate-400 font-medium italic">
                                                  Note: {auth.notes}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. FIXED BOTTOM FOOTER BAR */}
                <div className="sticky bottom-0 z-20 shrink-0 p-4 sm:p-5 border-t border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_-6px_16px_rgba(15,23,42,0.06)] flex items-center justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setExpertModalOpen(true)}
                    className="section-dark-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download My Counselling Info</span>
                  </button>
                </div>

              </div>
            </Reveal>
          </div>

        </div>
      </main>

      {/* Shared Counselling Modal */}
      <CounsellingModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        studentProfile={profile}
        selectedColleges={selectedColleges}
      />

      {/* Responsive Styles */}
      <style jsx global>{`
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
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
      `}</style>
    </div>
  );
}