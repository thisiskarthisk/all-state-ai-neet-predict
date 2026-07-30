// 'use client';

// import { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import { useRouter } from 'next/navigation';
// import {
//   Loader2,
//   BarChart2,
//   AlertTriangle,
//   TrendingUp,
//   Lightbulb,
//   Handshake,
//   ArrowRight,
//   GraduationCap,
//   MapPin,
//   Search,
//   Info,
//   X,
//   CheckCircle2,
//   Plus,
//   Filter,
//   Sparkles,
// } from 'lucide-react';
// import MedicalPulseLoader from '@/components/MedicalPulseLoader';
// import CounsellingModal from '@/components/CounsellingModal';
// import MultiSelect from '@/components/Multiselect';
// import Dropdown from '@/components/dropdown';
// import { isStateMatched } from '@/lib/data/collegeMatcher';
// import {
//   SUPPORTED_EXAMS,
//   getCoursesByExam,
//   INDIAN_STATES,
//   NEET_CATEGORIES,
//   ALL_COURSES,
//   getRankConfidenceLevel,
// } from '@/constants';
// import Reveal from './reveal';

// interface HeroSectionProps {
//   marks: string;
//   setMarks: (v: string) => void;
//   rankResult: any;
//   setRankResult: (v: any) => void;
//   rankLoading: boolean;
//   rankError: string;
//   setRankError: (v: string) => void;
//   rankExamType: string;
//   setRankExamType: (v: string) => void;
//   handleRankSubmit: (e: React.FormEvent) => void;
//   getMaxMarks: (exam: string) => number;
//   fmt: (n: number) => string;
//   mode?: 'allstate' | 'karnataka';
//   handleNavigateToCollegePredictor?: () => void;
// }

// type HeroTab = 'rank' | 'college';

// // Shared brand gradient used across the site's dark hero / accent cards
// const BRAND_GRADIENT = 'linear-gradient(135deg, #0095ff 0%, #00e5bf 60%, #2dd4bf 100%)';

// /**
//  * Calculates admission chance based on student rank vs college closing cutoff:
//  * - High Chance: when student rank <= closing cutoff (e.g. rank 5000 <= cutoff 6100).
//  * - Medium Chance: when student rank > closing cutoff, but close (e.g. cutoff 4800 to 4990 for rank 5000).
//  * - Low Chance / Reach: when student rank > closing cutoff by a larger margin (e.g. cutoff < 4800 for rank 5000).
//  */
// function calculateAdmissionChance(studentRank: number, closingCutoff: number): 'High' | 'Medium' | 'Reach' {
//   if (!closingCutoff || closingCutoff <= 0) return 'Reach';
//   if (!studentRank || studentRank <= 0) return 'High';

//   if (studentRank <= closingCutoff) {
//     return 'High';
//   }

//   const diff = studentRank - closingCutoff;
//   if (diff <= 350 || diff / closingCutoff <= 0.08) {
//     return 'Medium';
//   }

//   return 'Reach';
// }

// /**
//  * Robustly matches a selected course (by code like MD_GEN_MED, MBBS or name)
//  * against a cutoff's course name string returned by AI / DB.
//  */
// function matchCourseName(selectedCourse: string, cutCourseName: string): boolean {
//   if (!selectedCourse || selectedCourse === 'ALL') return true;
//   if (!cutCourseName) return true;

//   const s = selectedCourse.toLowerCase().trim();
//   const c = cutCourseName.toLowerCase().trim();

//   if (c.includes(s) || s.includes(c)) return true;

//   const found = ALL_COURSES.find(
//     (item) =>
//       item.code.toLowerCase() === s ||
//       item.name.toLowerCase().includes(s) ||
//       s.includes(item.code.toLowerCase())
//   );
//   if (found) {
//     const code = found.code.toLowerCase();
//     const name = found.name.toLowerCase();
//     if (c.includes(code) || name.includes(c) || c.includes(name)) return true;
//   }

//   const normS = s.replace(/[^a-z0-9]/g, '');
//   const normC = c.replace(/[^a-z0-9]/g, '');
//   if (normC.includes(normS) || normS.includes(normC)) return true;

//   return false;
// }

// export default function HeroSection({
//   marks,
//   setMarks,
//   rankResult,
//   setRankResult,
//   rankLoading,
//   rankError,
//   setRankError,
//   rankExamType,
//   setRankExamType,
//   handleRankSubmit,
//   getMaxMarks,
//   fmt,
//   mode = 'karnataka',
// }: HeroSectionProps) {
//   const router = useRouter();

//   // ---- Tab state (defaults to College Predictor) ----
//   const [activeTab, setActiveTab] = useState<HeroTab>('college');

//   // ---- Portal mount guard (document is undefined during SSR) ----
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // ---- College Predictor state ----
//   const [collegeRank, setCollegeRank] = useState('');
//   const [collegeExamType, setCollegeExamType] = useState('NEET_UG');
//   const [selectedCourse, setSelectedCourse] = useState('MBBS');
//   const [selectedCategory, setSelectedCategory] = useState('UR');
//   const [selectedStates, setSelectedStates] = useState<string[]>(mode === 'allstate' ? ['AI'] : ['KA']);
//   const [selectedRound, setSelectedRound] = useState<string>('Round 1');

//   const COUNSELLING_ROUNDS = [
//     { code: 'Round 1', name: 'Round 1 (Default)' },
//     { code: 'Round 2', name: 'Round 2' },
//     { code: 'Round 3', name: 'Round 3 / Mop-up' },
//     { code: 'Stray', name: 'Stray Vacancy Round' },
//     { code: 'ALL', name: 'All Rounds' },
//   ];

//   const [collegeResult, setCollegeResult] = useState<any>(null);
//   const [collegeLoading, setCollegeLoading] = useState(false);
//   const [collegeError, setCollegeError] = useState('');
//   const [collegeSearch, setCollegeSearch] = useState('');

//   // Filter drawer controls
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [chanceFilter, setChanceFilter] = useState<'all' | 'High' | 'Medium' | 'Reach'>('all');
//   const [roundFilter, setRoundFilter] = useState<'all' | 'Round 1' | 'Round 2' | 'Round 3' | 'Stray'>('all');
//   const [roundCategoryFilter, setRoundCategoryFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<'all' | 'Government' | 'Private' | 'Deemed'>('all');

//   // Automatically update default roundFilter based on selected states:
//   // All States / AI -> 'all' (All Rounds)
//   // Specific State -> 'Round 1'
//   useEffect(() => {
//     const isAllStates =
//       selectedStates.length === 0 ||
//       selectedStates.includes('AI') ||
//       selectedStates.includes('ALL');

//     if (isAllStates) {
//       setRoundFilter('all');
//     } else {
//       setRoundFilter('Round 1');
//     }
//   }, [selectedStates]);

//   const scrollToResults = () => {
//     setTimeout(() => {
//       const el = document.getElementById('results-section');
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 150);
//   };

//   const [selectedCollegesForCounselling, setSelectedCollegesForCounselling] = useState<any[]>([]);
//   const [infoModalCollege, setInfoModalCollege] = useState<any | null>(null);

//   const [lastSearchParams, setLastSearchParams] = useState<{
//     rank: string;
//     examType: string;
//     course: string;
//     category: string;
//     states: string[];
//     round: string;
//   } | null>(null);

//   // ---- Counselling Kit modal state (shared by both tabs) ----
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalName, setModalName] = useState('');
//   const [modalEmail, setModalEmail] = useState('');
//   const [modalMobile, setModalMobile] = useState('');
//   const [modalCourse, setModalCourse] = useState('');
//   const [modalScore, setModalScore] = useState('');
//   const [modalCollegeInput, setModalCollegeInput] = useState('');
//   const [modalFavColleges, setModalFavColleges] = useState<string[]>([]);
//   const [modalConsent, setModalConsent] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalSuccess, setModalSuccess] = useState(false);
//   const [modalError, setModalError] = useState('');

//   // ---- Lead Capture Modal for College Predictor ----
//   const [isPredictLeadModalOpen, setIsPredictLeadModalOpen] = useState(false);
//   const [predictLeadName, setPredictLeadName] = useState('');
//   const [predictLeadEmail, setPredictLeadEmail] = useState('');
//   const [predictLeadMobile, setPredictLeadMobile] = useState('');
//   const [predictLeadLoading, setPredictLeadLoading] = useState(false);
//   const [predictLeadError, setPredictLeadError] = useState('');

//   const availableCourses = getCoursesByExam(collegeExamType as any);

//   // Restore states from localStorage on client mount if they exist
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const isRestore = urlParams.get('restore') === 'true';
//       const tabParam = urlParams.get('tab');

//       const storedRank = localStorage.getItem('predict_rank');
//       const storedExamType = localStorage.getItem('predict_examType');
//       const storedCourse = localStorage.getItem('predict_course');
//       const storedCategory = localStorage.getItem('predict_category');
//       const storedStates = localStorage.getItem('predict_states');
//       const storedRound = localStorage.getItem('predict_round');
//       const storedList = localStorage.getItem('collegeList') || localStorage.getItem('college_prediction_results');
//       const storedSelected = localStorage.getItem('selectCollege') || localStorage.getItem('selectedColleges');

//       if (isRestore || tabParam === 'college') {
//         if (storedRank) setCollegeRank(storedRank);
//         if (storedExamType) setCollegeExamType(storedExamType);
//         if (storedCourse) setSelectedCourse(storedCourse);
//         if (storedCategory) setSelectedCategory(storedCategory);
//         if (storedRound) setSelectedRound(storedRound);
//         if (storedStates) {
//           try {
//             const parsed = JSON.parse(storedStates);
//             if (Array.isArray(parsed)) setSelectedStates(parsed);
//           } catch {}
//         }
//         if (storedList) {
//           try {
//             const parsedList = JSON.parse(storedList);
//             setCollegeResult(parsedList);
//             setLastSearchParams({
//               rank: storedRank || '',
//               examType: storedExamType || 'NEET_UG',
//               course: storedCourse || 'MBBS',
//               category: storedCategory || 'ALL',
//               round: storedRound || 'Round 1',
//               states: (() => {
//                 if (!storedStates) return mode === 'allstate' ? ['AI'] : ['KA'];
//                 try {
//                   const parsed = JSON.parse(storedStates);
//                   return Array.isArray(parsed) ? parsed : (mode === 'allstate' ? ['AI'] : ['KA']);
//                 } catch {
//                   return mode === 'allstate' ? ['AI'] : ['KA'];
//                 }
//               })(),
//             });
//           } catch {}
//         }
//         if (storedSelected) {
//           try {
//             const parsedSel = JSON.parse(storedSelected);
//             if (Array.isArray(parsedSel)) setSelectedCollegesForCounselling(parsedSel);
//           } catch {}
//         }
//         setActiveTab('college');
//       } else if (tabParam === 'rank') {
//         setActiveTab('rank');
//       }
//     }
//   }, []);

//   const goToCollegeTab = () => {
//     setActiveTab('college');

//     if (rankResult) {
//       const rStr = String(rankResult.expected);
//       setCollegeRank(rStr);
//       setCollegeExamType(rankExamType);
//       const courses = getCoursesByExam(rankExamType as any);
//       const defaultCourse = courses && courses.length > 0 ? courses[0].code : 'MBBS';
//       setSelectedCourse(defaultCourse);
//       setSelectedCategory('UR');
//       const statesToUse = selectedStates && selectedStates.length > 0 ? selectedStates : (mode === 'allstate' ? ['AI'] : ['KA']);
//       setSelectedStates(statesToUse);
//       setSelectedRound('Round 1');

//       setCollegeResult(null);
//       setSelectedCollegesForCounselling([]);

//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('collegeList');
//         localStorage.removeItem('college_prediction_results');
//         localStorage.removeItem('selectCollege');
//         localStorage.removeItem('selectedColleges');
//         localStorage.removeItem('predict_states');
//         localStorage.removeItem('predict_course');
//         localStorage.removeItem('predict_category');
//         localStorage.removeItem('predict_round');
//         localStorage.setItem('predict_rank', rStr);
//         localStorage.setItem('predict_examType', rankExamType);
//       }
//       executeCollegeSearch(rStr, rankExamType, defaultCourse, 'UR', statesToUse, 'Round 1');
//       scrollToResults();
//     }
//   };

//   const executeCollegeSearch = async (
//     rStr: string,
//     eStr: string,
//     cStr: string,
//     catStr: string,
//     sArr: string[],
//     rRoundStr: string = 'Round 1'
//   ) => {
//     const rankNum = parseInt(rStr, 10);
//     if (isNaN(rankNum) || rankNum <= 0) {
//       setCollegeError('Please enter a valid All India Rank (AIR).');
//       return;
//     }

//     setCollegeLoading(true);
//     setCollegeError('');

//     try {
//       const coursesForExam = getCoursesByExam(eStr as any);
//       const coursesToUse = cStr === 'ALL' ? coursesForExam.map((c) => c.code) : [cStr];

//       const res = await fetch('/api/ai-predict-colleges', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           rank: rankNum,
//           examType: eStr,
//           course: cStr,
//           courses: coursesToUse,
//           category: catStr,
//           states: sArr,
//           round: rRoundStr,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setCollegeError(data.error || 'Failed to predict colleges.');
//       } else {
//         setCollegeResult(data);
//         setLastSearchParams({ rank: rStr, examType: eStr, course: cStr, category: catStr, states: sArr, round: rRoundStr });
//         scrollToResults();
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('predict_rank', rStr);
//           localStorage.setItem('predict_examType', eStr);
//           localStorage.setItem('predict_course', cStr);
//           localStorage.setItem('predict_category', catStr);
//           localStorage.setItem('predict_round', rRoundStr);
//           localStorage.setItem('predict_states', JSON.stringify(sArr));
//           localStorage.setItem('collegeList', JSON.stringify(data));
//           localStorage.setItem('college_prediction_results', JSON.stringify(data));
//         }
//       }
//     } catch {
//       setCollegeError('Connection error. Please try again.');
//     } finally {
//       setCollegeLoading(false);
//     }
//   };

//   const handleCollegeSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const rankNum = parseInt(collegeRank, 10);
//     if (isNaN(rankNum) || rankNum <= 0) {
//       setCollegeError('Please enter a valid All India Rank (AIR).');
//       return;
//     }
//     setCollegeError('');
//     setPredictLeadError('');
//     setPredictLeadName('');
//     setPredictLeadEmail('');
//     setPredictLeadMobile('');
//     setIsPredictLeadModalOpen(true);
//   };

//   const handlePredictLeadSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setPredictLeadError('');
//     if (!predictLeadName.trim()) {
//       setPredictLeadError('Please enter your full name.');
//       return;
//     }
//     if (!predictLeadEmail.trim()) {
//       setPredictLeadError('Please enter your email address.');
//       return;
//     }
//     if (!predictLeadMobile.trim()) {
//       setPredictLeadError('Please enter your phone number.');
//       return;
//     }

//     setPredictLeadLoading(true);

//     try {
//       const homeStateName = INDIAN_STATES.find((s) => s.code === (selectedStates[0] || 'KA'))?.name || selectedStates[0] || 'Karnataka';
//       await fetch('/api/zoho-crm', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: predictLeadName.trim(),
//           email: predictLeadEmail.trim(),
//           mobileNo: predictLeadMobile.trim(),
//           homeState: homeStateName,
//           studentProfile: {
//             rank: collegeRank,
//             course: selectedCourse,
//             exam: collegeExamType,
//             category: selectedCategory,
//             states: selectedStates.join(', '),
//           },
//           leadSource: 'College Predictor Modal Form',
//         }),
//       });
//     } catch (zohoErr) {
//       console.warn('[HeroSection] Lead push to Zoho CRM warning:', zohoErr);
//     } finally {
//       setPredictLeadLoading(false);
//       setIsPredictLeadModalOpen(false);
//       setSelectedCollegesForCounselling([]);
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('selectedColleges');
//         localStorage.removeItem('selectCollege');
//       }
//       executeCollegeSearch(collegeRank, collegeExamType, selectedCourse, selectedCategory, selectedStates, selectedRound);
//     }
//   };

//   const handleClearCollegeForm = () => {
//     setCollegeRank('');
//     setSelectedStates(mode === 'allstate' ? ['AI'] : ['KA']);
//     setSelectedCourse('MBBS');
//     setSelectedCategory('UR');
//     setCollegeError('');
//     setCollegeResult(null);
//     setSelectedCollegesForCounselling([]);
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('predict_rank');
//       localStorage.removeItem('college_prediction_results');
//       localStorage.removeItem('collegeList');
//       localStorage.removeItem('selectedColleges');
//       localStorage.removeItem('selectCollege');
//     }
//   };

//   const toggleCollegeSelection = (college: any) => {
//     let updated: any[] = [];
//     const collegeId = college.college_id;
//     if (selectedCollegesForCounselling.some((c) => c.college_id === collegeId)) {
//       updated = selectedCollegesForCounselling.filter((c) => c.college_id !== collegeId);
//     } else {
//       updated = [...selectedCollegesForCounselling, college];
//     }
//     setSelectedCollegesForCounselling(updated);
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('selectCollege', JSON.stringify(updated));
//       localStorage.setItem('selectedColleges', JSON.stringify(updated));
//     }
//   };

//   const handleBookSession = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setModalError('');
//     if (!modalEmail) {
//       setModalError('Please enter your email.');
//       return;
//     }
//     setModalLoading(true);
//     try {
//       const res = await fetch('/api/counselling/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: modalName, email: modalEmail, type: 'simple' }),
//       });
//       if (res.ok) {
//         setModalSuccess(true);
//         setTimeout(() => {
//           setIsModalOpen(false);
//           setModalSuccess(false);
//           setModalName('');
//           setModalEmail('');
//         }, 1500);
//       } else {
//         setModalError('Failed to submit request.');
//       }
//     } catch {
//       setModalError('Connection error. Please try again.');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // Grouping colleges to support BOTH { colleges: [...] } and { results: [...] } API JSON schemas
//   const getGroupedColleges = () => {
//     if (!collegeResult) return [];

//     const rawList = collegeResult.colleges || collegeResult.results || [];
//     if (!Array.isArray(rawList) || rawList.length === 0) return [];

//     const map = new Map<string | number, any>();

//     for (const c of rawList) {
//       const name = c.college_name || c.name || 'Medical College';
//       const key = c.college_id || name;
//       const state = c.state_name || c.state || 'All India';
//       const type = c.college_type || c.collegeType || c.type || 'Government';

//       let extractedCutoffs: any[] = [];
//       let counsellingInfo = c.counsellingDetail || null;
//       let topChance = c.best_chance || 'High';
//       let topCutoff = c.closest_cutoff || 0;

//       if (c.cutoffs && Array.isArray(c.cutoffs)) {
//         extractedCutoffs = c.cutoffs.map((cut: any) => ({
//           course_name: cut.course_name || cut.course || 'MBBS',
//           category_name: cut.category_name || cut.category || 'General',
//           closing_rank: cut.closing_rank || cut.cutoffRank || 0,
//           best_chance: cut.best_chance || cut.chanceOfAdmission || 'High',
//         }));
//       } else if (c.courses && Array.isArray(c.courses)) {
//         for (const crs of c.courses) {
//           const crsName = crs.course || crs.course_name || 'MBBS';
//           if (crs.counsellingDetail) {
//             counsellingInfo = crs.counsellingDetail;
//           }

//           if (crs.categories && Array.isArray(crs.categories)) {
//             for (const cat of crs.categories) {
//               const catName = cat.category || cat.category_name || 'General';
//               const rankVal = cat.cutoffRank || cat.closing_rank || 0;
//               const chanceVal = cat.chanceOfAdmission || cat.best_chance || 'High';

//               extractedCutoffs.push({
//                 course_name: crsName,
//                 category_name: catName,
//                 closing_rank: rankVal,
//                 best_chance: chanceVal,
//               });

//               if (!topCutoff || (rankVal > 0 && rankVal < topCutoff)) {
//                 topCutoff = rankVal;
//               }
//               if (chanceVal) topChance = chanceVal;
//             }
//           }
//         }
//       }

//       if (!topCutoff && extractedCutoffs.length > 0) {
//         topCutoff = extractedCutoffs[0].closing_rank;
//       }

//       if (!map.has(key)) {
//         map.set(key, {
//           college_id: key,
//           college_name: name,
//           state_name: state,
//           city_name: c.city_name || c.city || '',
//           college_type: type,
//           best_chance: topChance,
//           closest_cutoff: topCutoff,
//           counsellingDetail: counsellingInfo,
//           cutoffs: extractedCutoffs,
//           allRoundCutoffs: c.allRoundCutoffs || null,
//           overallRangeStr: c.overallRangeStr || null,
//         });
//       } else {
//         const existing = map.get(key);
//         if (!existing.allRoundCutoffs && c.allRoundCutoffs) {
//           existing.allRoundCutoffs = c.allRoundCutoffs;
//         }
//         if (!existing.overallRangeStr && c.overallRangeStr) {
//           existing.overallRangeStr = c.overallRangeStr;
//         }
//         if (!existing.counsellingDetail && counsellingInfo) {
//           existing.counsellingDetail = counsellingInfo;
//         }
//         for (const newCut of extractedCutoffs) {
//           if (!existing.cutoffs.some((x: any) => x.course_name === newCut.course_name && x.category_name === newCut.category_name)) {
//             existing.cutoffs.push(newCut);
//           }
//         }
//       }
//     }

//     return Array.from(map.values());
//   };

//   const groupedColleges = getGroupedColleges();

//   // True when the person has changed rank/exam/course/category/states in the
//   // form since the results currently on screen were fetched. We deliberately
//   // do NOT re-filter the existing (stale) results client-side when this is
//   // true — that was producing a confusing, visually-broken panel (list would
//   // look wrong/empty while the header still showed the old total). Instead
//   // we surface a clear banner telling the person to click Predict again.
//   const statesMatch = (a: string[], b: string[]) => {
//     const sa = [...a].sort().join(',');
//     const sb = [...b].sort().join(',');
//     return sa === sb;
//   };
//   const filtersOutOfSync =
//     !!collegeResult &&
//     !!lastSearchParams &&
//     (collegeRank !== lastSearchParams.rank ||
//       collegeExamType !== lastSearchParams.examType ||
//       selectedCourse !== lastSearchParams.course ||
//       selectedCategory !== lastSearchParams.category ||
//       !statesMatch(selectedStates, lastSearchParams.states));

//   const isRankTab = activeTab === 'rank';
//   const isCollegeTab = activeTab === 'college';
//   const noResultYet = (isRankTab && !rankResult) || (isCollegeTab && !collegeResult);
//   const isLoadingNow = (isRankTab && rankLoading) || (isCollegeTab && collegeLoading);

//   // ---- Modal markup, rendered via portal so it's never trapped by an
//   // ancestor's overflow/transform (this section uses overflow-hidden which
//   // otherwise breaks position:fixed) ----

//   const infoModalMarkup = infoModalCollege && (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-xs"
//         onClick={() => setInfoModalCollege(null)}
//       />
//       <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden animate-in fade-in duration-200 flex flex-col">
//         <div className="p-4 sm:p-6 text-black relative shrink-0" style={{ background: BRAND_GRADIENT }}>
//           <button
//             type="button"
//             onClick={() => setInfoModalCollege(null)}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-black hover:bg-white/20 transition-colors"
//           >
//             <X className="w-4 h-4" />
//           </button>
//           <span className="text-[10px] font-black uppercase tracking-wider text-black/80 bg-white/10 px-2.5 py-1 rounded-md">
//             Course &amp; Category Cutoff Details
//           </span>
//           <h3 className="text-base sm:text-lg font-black text-black mt-2 leading-snug pr-8">
//             {infoModalCollege.college_name}
//           </h3>
//           <p className="text-xs text-black/80 mt-1 font-semibold flex flex-wrap items-center gap-2">
//             <span>{infoModalCollege.state_name}</span>
//             <span>•</span>
//             <span className="uppercase">{infoModalCollege.college_type || 'Government'}</span>
//             <span>•</span>
//             <span>Closing Cutoff: {fmt(infoModalCollege.closest_cutoff)}</span>
//           </p>
//         </div>

//         <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 grow">
//           {infoModalCollege.allRoundCutoffs && (
//             <div className="bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
//               <div
//                 className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2"
//                 style={{ background: BRAND_GRADIENT }}
//               >
//                 <h4 className="font-black text-black text-sm">All Rounds &amp; Categories Cutoff Matrix</h4>
//                 <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-black px-2.5 py-0.5 rounded-full">
//                   UgMasterCollegeList Dataset
//                 </span>
//               </div>
//               <div className="p-3 sm:p-4 overflow-x-auto">
//                 <table className="w-full text-left text-xs min-w-[500px]">
//                   <thead>
//                     <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-extrabold">
//                       <th className="p-2.5">Counselling Round</th>
//                       <th className="p-2.5 text-indigo-700">General (UR)</th>
//                       <th className="p-2.5 text-indigo-700">OBC-NCL</th>
//                       <th className="p-2.5 text-indigo-700">EWS</th>
//                       <th className="p-2.5 text-indigo-700">SC</th>
//                       <th className="p-2.5 text-indigo-700">ST</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {['Round 1', 'Round 2', 'Round 3', 'Stray'].map((rnd) => {
//                       const rData = infoModalCollege.allRoundCutoffs[rnd] || {};
//                       return (
//                         <tr key={rnd} className="hover:bg-slate-50 font-semibold">
//                           <td className="p-2.5 font-black text-slate-800">{rnd}</td>
//                           <td className="p-2.5 font-mono font-bold text-slate-900">
//                             {rData['Gen'] ? `AIR ~${fmt(rData['Gen'])}` : '—'}
//                           </td>
//                           <td className="p-2.5 font-mono font-bold text-slate-900">
//                             {rData['OBC-NCL'] ? `AIR ~${fmt(rData['OBC-NCL'])}` : '—'}
//                           </td>
//                           <td className="p-2.5 font-mono font-bold text-slate-900">
//                             {rData['EWS'] ? `AIR ~${fmt(rData['EWS'])}` : '—'}
//                           </td>
//                           <td className="p-2.5 font-mono font-bold text-slate-900">
//                             {rData['SC'] ? `AIR ~${fmt(rData['SC'])}` : '—'}
//                           </td>
//                           <td className="p-2.5 font-mono font-bold text-slate-900">
//                             {rData['ST'] ? `AIR ~${fmt(rData['ST'])}` : '—'}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {(() => {
//             const ALL_NEET_CATS = [
//               { code: 'UR', name: 'General (UR)', factor: 1.0 },
//               { code: 'OBC', name: 'OBC Category', factor: 1.08 },
//               { code: 'EWS', name: 'EWS Category', factor: 1.06 },
//               { code: 'SC', name: 'SC Category', factor: 2.15 },
//               { code: 'ST', name: 'ST Category', factor: 3.1 },
//             ];

//             // Determine category and course displayed outside on card so we hide outside category only for that specific course
//             const outsideCatCode = (selectedCategory === 'ALL' || selectedCategory === 'UR') ? 'UR' : selectedCategory.toUpperCase();
//             const allExamCourses = getCoursesByExam(collegeExamType as any);
//             const primaryCourseCode = selectedCourse === 'ALL' ? (allExamCourses[0]?.code || 'MBBS') : selectedCourse;
//             const rawCutoffs = infoModalCollege.cutoffs || [];

//             return allExamCourses.map((crsObj) => {
//               const crsCode = crsObj.code;
//               const crsFullName = crsObj.name;

//               const isOutsideCourse = matchCourseName(primaryCourseCode, crsCode) || matchCourseName(primaryCourseCode, crsFullName);
//               const modalCategories = isOutsideCourse
//                 ? ALL_NEET_CATS.filter(
//                     (cat) => cat.code.toUpperCase() !== outsideCatCode && !cat.name.toUpperCase().includes(outsideCatCode)
//                   )
//                 : ALL_NEET_CATS;

//               const courseCutoffs = (rawCutoffs || []).filter((cut: any) => {
//                 const cName = cut.course_name || cut.course || '';
//                 return matchCourseName(crsCode, cName);
//               });

//               // Check if course is offered at this institution
//               const isCourseOffered =
//                 courseCutoffs.length > 0 ||
//                 (rawCutoffs.length === 0 && (crsCode === 'MBBS' || crsCode === 'MD_GEN_MED' || crsCode === 'MDS_CONS_END'));

//               if (!isCourseOffered) {
//                 return (
//                   <div
//                     key={crsCode}
//                     className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs"
//                   >
//                     <div className="flex items-center gap-2.5 min-w-0">
//                       <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
//                       <div className="min-w-0">
//                         <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm leading-snug">
//                           {crsFullName}
//                         </h5>
//                         <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
//                           Not Applicable / Course Not Offered at {infoModalCollege.college_name}
//                         </p>
//                       </div>
//                     </div>
//                     <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100/80 text-amber-900 px-2.5 py-1 rounded-full shrink-0 border border-amber-200">
//                       Not Offered
//                     </span>
//                   </div>
//                 );
//               }

//               const baseGeneralCutoff =
//                 courseCutoffs.find(
//                   (c: any) =>
//                     c.category_name?.toLowerCase().includes('general') ||
//                     c.category_name?.toLowerCase().includes('ur')
//                 )?.closing_rank ||
//                 infoModalCollege.closest_cutoff ||
//                 15000;

//               const userRankNum = parseInt(collegeRank, 10) || 0;

//               const displayCategories = modalCategories.map((cat) => {
//                 const found = courseCutoffs.find(
//                   (c: any) =>
//                     c.category_name?.toLowerCase().includes(cat.code.toLowerCase()) ||
//                     c.category_name?.toLowerCase().includes(cat.name.toLowerCase())
//                 );

//                 const finalCutoff = found?.closing_rank || Math.round(baseGeneralCutoff * cat.factor);
//                 const computedChance = userRankNum > 0 ? calculateAdmissionChance(userRankNum, finalCutoff) : (found?.best_chance || 'High');

//                 return {
//                   category_name: cat.name,
//                   closing_rank: finalCutoff,
//                   best_chance: computedChance,
//                 };
//               });

//               return (
//                 <div
//                   key={crsCode}
//                   className="bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0"
//                 >
//                   <div
//                     className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2"
//                     style={{ background: BRAND_GRADIENT }}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
//                       <h4 className="font-black text-black text-sm">{crsFullName} Cutoff Matrix</h4>
//                     </div>
//                     <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-black px-2.5 py-0.5 rounded-full">
//                       {isOutsideCourse ? `Other Categories (Excluding ${outsideCatCode})` : 'All 5 Categories Matrix'}
//                     </span>
//                   </div>

//                   <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {displayCategories.map((catItem, idx) => (
//                       <div
//                         key={idx}
//                         className="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-colors shadow-2xs flex flex-col justify-between gap-1.5"
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs font-black text-slate-900">{catItem.category_name}</span>
//                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AIQ</span>
//                         </div>

//                         <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
//                           <span className="text-[10px] font-extrabold text-slate-400 uppercase">Closing Cutoff</span>
//                           <span className="font-mono font-black text-indigo-600 text-xs">
//                             AIR ~{fmt(catItem.closing_rank)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             });
//           })()}
//         </div>

//         <div className="p-4 border-t border-slate-150 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
//           <span className="text-xs text-slate-500 font-bold">Detailed Cutoffs by Course &amp; Category</span>
//           <button
//             type="button"
//             onClick={() => setInfoModalCollege(null)}
//             className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-xs"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-8 lg:py-12 px-4 sm:px-6 overflow-hidden section-dark">
//       {/* Background glow overlay */}
//       <div
//         className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent pointer-events-none"
//         aria-hidden="true"
//       />

//       {/* Main Centered Container */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <Reveal>
//           <div className="section-head center mb-12 hero-heading-wrap">
//             <h2 className="hero-title-cc font-extrabold text-white tracking-tight leading-tight">
//               {mode === 'allstate' ? (
//                 <>
//                   <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">NEET College</span> Predictor 2026 — Find Your MBBS College
//                 </>
//               ) : (
//                 <>
//                   Find Your Eligible <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">Karnataka</span> Medical Colleges
//                 </>
//               )}
//             </h2>
//             <p className="hero-subtitle-cc" style={{ color: '#fff' }}>
//               {mode === 'allstate'
//                 ? 'See which Government, Private and Deemed medical colleges you can get with your NEET rank or marks — real cutoff data, trusted since 2006..'
//                 : 'Predict eligible Karnataka medical colleges using your NEET rank and category. Get personalized college recommendations and counselling schedules'}
//             </p>
//           </div>
//         </Reveal>

//         {/*
//           Grid Layout (4 Cols Form | 8 Cols Results)

//           IMPORTANT: both tabs (Rank Predictor and College Predictor) share the
//           exact same layout behaviour now — items-start, no forced heights, no
//           isCollegeTab-specific stretching. Each card sizes to its own content,
//           same as Rank Predictor always did. This removes the earlier mismatch
//           where the College tab's form card would get force-stretched to match
//           a tall results list.
//         */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//           {/* Left Card: Form (4 Columns on LG screens) */}
//           <Reveal className="lg:col-span-4" delay={80}>
//             <div
//               id="tools-section"
//               className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl flex flex-col justify-between"
//             >
//               {/* Tab Switcher */}
//               <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-2xl bg-slate-100 border border-slate-200">
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab('rank')}
//                   className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
//                     isRankTab
//                       ? 'tab-btn text-white shadow-sm'
//                       : 'bg-transparent text-slate-500'
//                   }`}
//                 >
//                   <BarChart2 className="w-3.5 h-3.5" />
//                   Rank Predictor
//                 </button>

//                 <button
//                   type="button"
//                   onClick={goToCollegeTab}
//                   className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
//                     isCollegeTab
//                       ? 'tab-btn text-white shadow-sm'
//                       : 'bg-transparent text-slate-500'
//                   }`}
//                 >
//                   <GraduationCap className="w-3.5 h-3.5" />
//                   College Predictor
//                 </button>
//               </div>

//               {isRankTab ? (
//                 <>
//                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
//                     <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
//                       <BarChart2 className="w-5 h-5" style={{color:"#2b255f"}} />
//                     </div>
//                     <div>
//                       <h3 id="hero-title" className="text-base font-black text-slate-900">
//                         NEET UG &amp; PG Rank Predictor
//                       </h3>
//                     </div>
//                   </div>

//                   <form onSubmit={(e) => { handleRankSubmit(e); scrollToResults(); }} className="flex-1 flex flex-col space-y-5">
//                     <div>
//                       <label
//                         htmlFor="rankExamSelect"
//                         className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider"
//                       >
//                         Select NEET Exam
//                       </label>
//                       <Dropdown
//                         options={SUPPORTED_EXAMS}
//                         value={rankExamType}
//                         onChange={(val) => {
//                           setRankExamType(val);
//                           setMarks('');
//                           setRankResult(null);
//                           setRankError('');
//                         }}
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="marksInput"
//                         className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider"
//                       >
//                         Total {rankExamType.replace(/_/g, ' ')} Marks (0 – {getMaxMarks(rankExamType)})
//                       </label>
//                       <input
//                         type="number"
//                         id="marksInput"
//                         value={marks}
//                         onChange={(e) => setMarks(e.target.value)}
//                         placeholder={`e.g. ${
//                           rankExamType === 'NEET_PG' ? '600' : rankExamType === 'NEET_MDS' ? '700' : '640'
//                         }`}
//                         min={0}
//                         max={getMaxMarks(rankExamType)}
//                         required
//                         className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
//                       />
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                       <button
//                         type="submit"
//                         disabled={rankLoading}
//                         className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
//                       >
//                         {rankLoading ? (
//                           <>
//                             <Loader2 className="w-4 h-4 animate-spin" /> Predicting...
//                           </>
//                         ) : (
//                           <>
//                             Predict Rank <ArrowRight className="w-4 h-4" />
//                           </>
//                         )}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setMarks('');
//                           setRankResult(null);
//                           setRankError('');
//                         }}
//                         className="px-5 py-3.5 rounded-2xl border border-slate-250 text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors shrink-0"
//                       >
//                         Reset
//                       </button>
//                     </div>
//                   </form>

//                   {rankError && (
//                     <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 reveal-el reveal-el-visible">
//                       <AlertTriangle className="w-4 h-4 shrink-0" />
//                       <span>{rankError}</span>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
//                     <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
//                       <GraduationCap className="w-5 h-5" style={{color:"#2b255f"}}/>
//                     </div>
//                     <div>
//                       <h3 className="text-base font-black text-slate-900">College Predictor</h3>
//                       <p className="text-xs text-slate-500 font-semibold mt-0.5">Enter rank and preferences</p>
//                     </div>
//                   </div>

//                   <form onSubmit={(e) => { handleCollegeSubmit(e); scrollToResults(); }} className="flex-1 flex flex-col space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
//                           NEET Rank (AIR)
//                         </label>
//                         <input
//                           type="number"
//                           value={collegeRank}
//                           onChange={(e) => setCollegeRank(e.target.value)}
//                           placeholder="e.g. 15000"
//                           required
//                           className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2.5 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
//                           Exam
//                         </label>
//                         <Dropdown
//                           options={SUPPORTED_EXAMS}
//                           value={collegeExamType}
//                           onChange={(val) => {
//                             setCollegeExamType(val);
//                             const courses = getCoursesByExam(val as any);
//                             if (courses && courses.length > 0) {
//                               setSelectedCourse(courses[0].code);
//                             }
//                             setSelectedCategory('UR');
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
//                         State
//                       </label>
//                       {mode === 'karnataka' ? (
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value="Karnataka"
//                             readOnly
//                             className="w-full rounded-2xl border border-slate-250 bg-slate-100/90 pl-10 pr-4 py-2.5 text-sm font-extrabold text-slate-800 outline-none cursor-default select-none shadow-xs"
//                           />
//                           <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3 shrink-0 pointer-events-none" />
//                         </div>
//                       ) : (
//                         <MultiSelect
//                           options={INDIAN_STATES}
//                           selectedValues={selectedStates}
//                           onChange={setSelectedStates}
//                           placeholder="Select States / AIQ"
//                         />
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
//                           Course
//                         </label>
//                         <Dropdown
//                           options={availableCourses}
//                           value={selectedCourse}
//                           onChange={setSelectedCourse}
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
//                           Category
//                         </label>
//                         <Dropdown
//                           options={NEET_CATEGORIES}
//                           value={selectedCategory}
//                           onChange={setSelectedCategory}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 mt-2">
//                       <button
//                         type="submit"
//                         disabled={collegeLoading}
//                         className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
//                       >
//                         {collegeLoading ? (
//                           <>
//                             <Loader2 className="w-4 h-4 animate-spin" /> Matching Colleges...
//                           </>
//                         ) : (
//                           <>
//                             Predict Matching Colleges <ArrowRight className="w-4 h-4" />
//                           </>
//                         )}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleClearCollegeForm}
//                         className="py-3.5 px-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center shrink-0"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   </form>

//                   {collegeError && (
//                     <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
//                       <AlertTriangle className="w-4 h-4 shrink-0" />
//                       <span>{collegeError}</span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </Reveal>

//           {/* Right Card: Value/Results (8 Columns on LG screens) */}
//           <Reveal className="lg:col-span-8" delay={160}>
//             <div
//               id="results-section"
//               className={`bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between ${
//                 !isLoadingNow && noResultYet ? 'p-0 overflow-hidden' : 'p-6 sm:p-8 relative'
//               }`}
//             >
//               {isLoadingNow ? (
//                 <MedicalPulseLoader
//                   title={
//                     isRankTab
//                       ? 'Calculating NEET All India Rank...'
//                       : 'Predicting Matching Medical Colleges...'
//                   }
//                   subtitle={
//                     isRankTab
//                       ? 'Analyzing historical score distribution & 4-year NEET paper trends...'
//                       : 'Evaluating All India Quota (AIQ) & State quota cutoff databases...'
//                   }
//                 />
//               ) : noResultYet ? (
//                 <div className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-100">
//                   <img
//                     src="/assets/image/hero-banner-bg-image.jpeg"
//                     alt="NEET Rank Predictor Banner"
//                     className="w-full h-full object-cover rounded-3xl"
//                   />
//                 </div>
//               ) : isRankTab ? (
//                 <div className="space-y-6 animate-in fade-in duration-300 w-full">
//                   <div
//                     className="p-6 rounded-3xl text-slate-900 shadow-lg text-center"
//                     style={{ background: BRAND_GRADIENT }}
//                   >
//                     <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest block mb-1">
//                       Expected Rank Range
//                     </span>
//                     <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
//                       AIR {fmt(rankResult.rangeLow)} – {fmt(rankResult.rangeHigh)}
//                     </div>
//                     <span className="inline-block mt-2 px-3.5 py-1 rounded-full bg-black/10 text-xs font-extrabold backdrop-blur-xs text-slate-900">
//                       Estimated Rank: AIR {fmt(rankResult.expected)}
//                     </span>
//                   </div>

//                   {/* Stats Grid */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
//                       <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
//                         Percentile
//                       </span>
//                       <span className="text-lg font-black text-slate-900">{rankResult.percentile}%</span>
//                     </div>

//                     <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
//                       <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">
//                         4-Year Average
//                       </span>
//                       <span className="text-lg font-black text-black-900">
//                         AIR ~{fmt(rankResult.averageRank)}
//                       </span>
//                     </div>
//                     {(() => {
//                       const predictedRank = rankResult.expected || rankResult.averageRank || 0;

//                       const confidence = getRankConfidenceLevel(
//                         predictedRank,
//                         rankExamType as any
//                       );

//                       let badgeStyle = "bg-red-100 text-red-900 border border-red-200";

//                       switch (confidence) {
//                         case "Very High":
//                           badgeStyle =
//                             "bg-green-100 text-green-900 border border-green-200";
//                           break;

//                         case "High":
//                           badgeStyle =
//                             "bg-emerald-100 text-emerald-900 border border-emerald-200";
//                           break;

//                         case "Medium":
//                           badgeStyle =
//                             "bg-blue-100 text-blue-900 border border-blue-200";
//                           break;

//                         case "Low":
//                           badgeStyle =
//                             "bg-amber-100 text-amber-900 border border-amber-200";
//                           break;

//                         case "Very Low":
//                           badgeStyle =
//                             "bg-red-100 text-red-900 border border-red-200";
//                           break;
//                       }

//                       return (
//                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
//                           <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
//                             Confidence Level
//                           </span>

//                           <span
//                             className={`text-xs font-black px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${badgeStyle}`}
//                           >
//                             {confidence}
//                           </span>
//                         </div>
//                       );
//                     })()}
//                   </div>

//                   {/* YoY Trend */}
//                   <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
//                     <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
//                       <TrendingUp className="w-4 h-4 text-indigo-600" /> Year-over-Year Trend Analysis
//                     </p>
//                     <p className="text-slate-600 font-semibold text-[11px] leading-relaxed">
//                       {rankResult.trendAnalysis}
//                     </p>
//                   </div>

//                   {/* What this means for you */}
//                   {rankResult.whatThisMeans && (
//                     <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-1">
//                       <p className="font-extrabold text-indigo-900 flex items-center gap-1.5">
//                         <Lightbulb className="w-4 h-4 text-black-500" /> What this means for you
//                       </p>
//                       <p className="text-indigo-950 font-semibold text-[11px] leading-relaxed">
//                         {rankResult.whatThisMeans}
//                       </p>
//                     </div>
//                   )}

//                   {/* Transparency breakdown table */}
//                   {rankResult.years && rankResult.years.length > 0 && (
//                     <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
//                       <table className="w-full text-left text-xs min-w-[320px]">
//                         <thead>
//                           <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-extrabold">
//                             <th className="p-3">NEET Year</th>
//                             <th className="p-3">Estimated Rank</th>
//                             <th className="p-3">Paper Trend</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {rankResult.years.map((y: any) => (
//                             <tr key={y.year} className="border-b border-slate-100">
//                               <td className="p-3 font-bold text-black-800">NEET {y.year}</td>
//                               <td className="p-3 font-black text-black-600">AIR ~{fmt(y.rank)}</td>
//                               <td className="p-3 font-semibold text-black-500">{y.trend}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
//                     <button
//                       onClick={goToCollegeTab}
//                       className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
//                     >
//                       <span>Find Matching Colleges for AIR {fmt(rankResult.expected)}</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </button>

//                     <button
//                       style={{display:"none"}}
//                       type="button"
//                       onClick={() => setIsModalOpen(true)}
//                       className="w-full sm:w-auto py-4 px-6 rounded-2xl text-black-700 font-extrabold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Handshake className="w-4 h-4" style={{color:"#2b255f"}} />
//                       <span style={{color:"#2b255f"}}>get personalised counselling information</span>
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col justify-between w-full space-y-0 relative">
//                   {/* Fixed Header with Filter Toggle Button & Search */}
//                   <div className="shrink-0 pb-3 border-b border-slate-100 bg-white z-10 sticky top-0 flex flex-col space-y-3">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//                       <div>
//                         <h4 className="font-black text-slate-900 text-base">
//                           Matching Colleges ({groupedColleges.length})
//                         </h4>
//                         <p className="text-xs text-slate-500 font-semibold mt-0.5">
//                           Sorted by cutoff competitiveness · Click any card to select for counselling
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2 w-full sm:w-auto">
//                         <button
//                           type="button"
//                           onClick={() => setIsFilterOpen(!isFilterOpen)}
//                           className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
//                             isFilterOpen || chanceFilter !== 'all' || roundFilter !== 'all' || typeFilter !== 'all'
//                               ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
//                               : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
//                           }`}
//                         >
//                           <Filter className="w-3.5 h-3.5" />
//                           <span>Filter</span>
//                           {(chanceFilter !== 'all' || roundFilter !== 'all' || typeFilter !== 'all') && (
//                             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//                           )}
//                         </button>

//                         <div className="relative flex-1 sm:w-48">
//                           <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
//                           <input
//                             type="text"
//                             placeholder="Search college name..."
//                             value={collegeSearch}
//                             onChange={(e) => setCollegeSearch(e.target.value)}
//                             className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none focus:border-indigo-600 text-slate-800 w-full"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Filter Drawer Panel */}
//                     {isFilterOpen && (
//                       <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
//                         <div>
//                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
//                             Admission Chance
//                           </label>
//                           <select
//                             value={chanceFilter}
//                             onChange={(e) => setChanceFilter(e.target.value as any)}
//                             className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
//                           >
//                             <option value="all">All Admission Chances</option>
//                             <option value="High">High Chance</option>
//                             <option value="Medium">Medium Chance</option>
//                             <option value="Reach">Low / Reach Chance</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
//                             College Type
//                           </label>
//                           <select
//                             value={typeFilter}
//                             onChange={(e) => setTypeFilter(e.target.value as any)}
//                             className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
//                           >
//                             <option value="all">All College Types</option>
//                             <option value="Government">Government</option>
//                             <option value="Private">Private</option>
//                             <option value="Deemed">Deemed University</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
//                             Counselling Round
//                           </label>
//                           <select
//                             value={roundFilter}
//                             onChange={(e) => setRoundFilter(e.target.value as any)}
//                             className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
//                           >
//                             <option value="all">All Rounds</option>
//                             <option value="Round 1">Round 1</option>
//                             <option value="Round 2">Round 2</option>
//                             <option value="Round 3">Round 3 / Mop-up</option>
//                             <option value="Stray">Stray Vacancy Round</option>
//                           </select>
//                         </div>

//                         {roundFilter !== 'all' && selectedCategory === 'ALL' && (
//                           <div>
//                             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
//                               Round Category
//                             </label>
//                             <select
//                               value={roundCategoryFilter}
//                               onChange={(e) => setRoundCategoryFilter(e.target.value)}
//                               className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
//                             >
//                               <option value="all">All Categories</option>
//                               <option value="Gen">General (UR)</option>
//                               <option value="OBC-NCL">OBC-NCL</option>
//                               <option value="EWS">EWS</option>
//                               <option value="SC">SC</option>
//                               <option value="ST">ST</option>
//                             </select>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Scrollable College List Body */}
//                   <div className="grow overflow-y-auto py-3 space-y-3 sm:space-y-4 pr-1 max-h-[420px] sm:max-h-[460px]">
//                     {(() => {
//                       const filteredColleges = groupedColleges.filter((c: any) => {
//                         if (chanceFilter !== 'all') {
//                           const cChance = c.best_chance || 'High';
//                           if (cChance.toLowerCase() !== chanceFilter.toLowerCase()) return false;
//                         }

//                         if (roundFilter !== 'all') {
//                           let targetCat: string | null = null;
//                           if (selectedCategory !== 'ALL') {
//                             targetCat = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
//                           } else if (roundCategoryFilter !== 'all') {
//                             targetCat = roundCategoryFilter;
//                           }

//                           const roundData = c.allRoundCutoffs?.[roundFilter];

//                           if (!roundData) return false;

//                           const userRankNum = parseInt(collegeRank, 10) || 0;

//                           if (targetCat) {
//                             const roundVal = roundData[targetCat];
//                             if (typeof roundVal !== 'number' || roundVal <= 0) {
//                               return false;
//                             }
//                             if (userRankNum > 0 && userRankNum > Math.round(roundVal * 1.15)) {
//                               return false;
//                             }
//                           } else {
//                             const eligibleCutoffs = Object.values(roundData).filter(
//                               (v) => typeof v === 'number' && (v as number) > 0 && (userRankNum <= 0 || userRankNum <= Math.round((v as number) * 1.15))
//                             );

//                             if (eligibleCutoffs.length === 0) return false;
//                           }
//                         }

//                         if (typeFilter !== 'all') {
//                           const cType = c.college_type || c.collegeType || c.type || 'Government';
//                           if (!cType.toLowerCase().includes(typeFilter.toLowerCase())) return false;
//                         }

//                         const searchLower = collegeSearch.toLowerCase().trim();
//                         const matchesSearch =
//                           !searchLower ||
//                           c.college_name.toLowerCase().includes(searchLower) ||
//                           c.state_name.toLowerCase().includes(searchLower) ||
//                           (c.cutoffs || []).some(
//                             (cut: any) =>
//                               cut.course_name?.toLowerCase().includes(searchLower) ||
//                               cut.category_name?.toLowerCase().includes(searchLower)
//                           );

//                         const matchesCourse =
//                           selectedCourse === 'ALL' ||
//                           (c.cutoffs || []).length === 0 ||
//                           (c.cutoffs || []).some((cut: any) =>
//                             matchCourseName(selectedCourse, cut.course_name || cut.course || '')
//                           );

//                         const hasSpecificStates = selectedStates.filter(code => code !== 'AI' && code !== 'ALL').length > 0;
//                         const matchesState =
//                           !hasSpecificStates ||
//                           selectedStates.some((code) => {
//                             if (code === 'AI' || code === 'ALL') return false;
//                             const stateName = (
//                               INDIAN_STATES.find((s) => s.code === code)?.name || code
//                             );
//                             return isStateMatched(c.state_name, stateName);
//                           });

//                         return matchesSearch && matchesCourse && matchesState;
//                       });

//                       if (filteredColleges.length === 0) {
//                         return (
//                           <div className="h-full min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 my-auto">
//                             <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center mb-3 text-indigo-600 shadow-2xs">
//                               <GraduationCap className="w-6 h-6" />
//                             </div>
//                             <h5 className="font-black text-slate-900 text-sm sm:text-base">
//                               No Medical Colleges Found
//                             </h5>
//                             <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1.5 leading-relaxed">
//                               No colleges match your current state/course filter criteria. Try selecting "All Courses", picking additional preferred states, or clearing your search query.
//                             </p>
//                           </div>
//                         );
//                       }

//                       return filteredColleges.map((c: any) => {
//                         const isSelected = selectedCollegesForCounselling.some(
//                           (item) => item.college_id === c.college_id
//                         );

//                         return (
//                           <div
//                             key={c.college_id}
//                             onClick={() => toggleCollegeSelection(c)}
//                             className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer relative shadow-xs ${
//                               isSelected
//                                 ? 'bg-emerald-50/80 border-emerald-400 border-l-4 border-l-emerald-500 shadow-sm'
//                                 : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
//                             }`}
//                           >
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                               <div className="flex items-start gap-3 min-w-0">
//                                 <input
//                                   type="checkbox"
//                                   checked={isSelected}
//                                   onChange={() => {}}
//                                   className="w-4 h-4 mt-1 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0 cursor-pointer"
//                                 />
//                                 <div className="min-w-0">
//                                   <h5 className="font-black text-slate-900 text-sm sm:text-base leading-snug break-words">
//                                     {c.college_name}
//                                   </h5>
//                                   <p className="text-xs text-slate-500 font-semibold mt-1 flex flex-wrap items-center gap-2">
//                                     <span className="flex items-center gap-1">
//                                       <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {c.city_name ? `${c.city_name}, ` : ''}{c.state_name}
//                                     </span>
//                                     <span className="w-1 h-1 rounded-full bg-slate-300 hidden xs:inline-block" />
//                                     <span className="uppercase text-[9px] bg-slate-100 px-2 py-0.5 rounded border text-slate-600 font-bold" style={{display:"none"}}>
//                                       {c.college_type}
//                                     </span>
//                                   </p>

//                                   {(() => {
//                                     const isRoundActive = roundFilter !== 'all';
//                                     const categoryCodeMap: Record<string, string> = {
//                                       'Gen': 'General',
//                                       'OBC-NCL': 'OBC',
//                                       'EWS': 'EWS',
//                                       'SC': 'SC',
//                                       'ST': 'ST',
//                                     };

//                                     if (isRoundActive) {
//                                       const roundData = c.allRoundCutoffs?.[roundFilter] || {};

//                                       let effectiveCatKey: string | null = null;
//                                       if (selectedCategory !== 'ALL') {
//                                         effectiveCatKey = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
//                                       } else if (roundCategoryFilter !== 'all') {
//                                         effectiveCatKey = roundCategoryFilter;
//                                       }

//                                       if (effectiveCatKey) {
//                                         const roundVal = roundData[effectiveCatKey];
//                                         if (typeof roundVal === 'number' && roundVal > 0) {
//                                           return (
//                                             <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
//                                               <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200">
//                                                 <span>{roundFilter} ({categoryCodeMap[effectiveCatKey] || effectiveCatKey}):</span>
//                                                 <span className="font-mono text-indigo-600">AIR ~{fmt(roundVal)}</span>
//                                               </span>
//                                             </div>
//                                           );
//                                         }
//                                       } else {
//                                         const userRankNum = parseInt(collegeRank, 10) || 0;
//                                         const validEntries = Object.entries(roundData).filter(
//                                           ([_, v]) => typeof v === 'number' && (v as number) > 0 && (userRankNum <= 0 || userRankNum <= Math.round((v as number) * 1.15))
//                                         );

//                                         if (validEntries.length > 0) {
//                                           return (
//                                             <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
//                                               {validEntries.map(([catKey, val]) => (
//                                                 <span
//                                                   key={catKey}
//                                                   className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200"
//                                                 >
//                                                   <span>{roundFilter} ({categoryCodeMap[catKey] || catKey}):</span>
//                                                   <span className="font-mono text-indigo-600">AIR ~{fmt(val as number)}</span>
//                                                 </span>
//                                               ))}
//                                             </div>
//                                           );
//                                         }
//                                       }
//                                     }

//                                     if (c.overallRangeStr) {
//                                       return (
//                                         <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
//                                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
//                                             <span>Overall Rank Range:</span>
//                                             <span className="font-mono text-slate-900">{c.overallRangeStr}</span>
//                                           </span>
//                                         </div>
//                                       );
//                                     }

//                                     return (
//                                       <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
//                                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-150">
//                                           <span>MBBS:</span>
//                                           <span className="font-mono text-indigo-600">AIR ~{fmt(c.closest_cutoff)}</span>
//                                         </span>
//                                       </div>
//                                     );
//                                   })()}
//                                 </div>
//                               </div>

//                               <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-black border whitespace-nowrap ${
//                                     c.best_chance === 'High'
//                                       ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
//                                       : c.best_chance === 'Medium'
//                                       ? 'bg-amber-100 text-amber-800 border-amber-300'
//                                       : 'bg-rose-100 text-rose-800 border-rose-300'
//                                   }`}
//                                 >
//                                   {c.best_chance === 'High' ? 'High Chance' : c.best_chance === 'Medium' ? 'Medium Chance' : 'Low Chance'}
//                                 </span>

//                                 {(() => {
//                                   let displayCutoff = c.closest_cutoff;
//                                   const isRoundActive = roundFilter !== 'all';
//                                   let effectiveCatKey: string | null = null;
//                                   if (selectedCategory !== 'ALL') {
//                                     effectiveCatKey = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
//                                   } else if (roundCategoryFilter !== 'all') {
//                                     effectiveCatKey = roundCategoryFilter;
//                                   }

//                                   if (isRoundActive && c.allRoundCutoffs?.[roundFilter]) {
//                                     const roundData = c.allRoundCutoffs[roundFilter];
//                                     if (effectiveCatKey && typeof roundData[effectiveCatKey] === 'number') {
//                                       displayCutoff = roundData[effectiveCatKey];
//                                     } else {
//                                       const nums = Object.values(roundData).filter((v): v is number => typeof v === 'number' && v > 0);
//                                       if (nums.length > 0) displayCutoff = Math.min(...nums);
//                                     }
//                                   }

//                                   return (
//                                     <span className="text-slate-600 font-extrabold text-xs whitespace-nowrap">
//                                       Closing Cutoff:{' '}
//                                       <b className="text-slate-900 font-mono text-sm ml-1">{fmt(displayCutoff)}</b>
//                                     </span>
//                                   );
//                                 })()}

//                                 <button
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setInfoModalCollege(c);
//                                   }}
//                                   className="w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 shadow-xs shrink-0"
//                                   title="View Cutoffs & Details (i)"
//                                 >
//                                   <Info className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       });
//                     })()}
//                   </div>

//                   {/* Fixed Bottom Footer Bar */}
//                   <div className="shrink-0 pt-3 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white z-10 sticky bottom-0">
//                     <button
//                       style={{display:"none"}}
//                       type="button"
//                       onClick={() => setIsModalOpen(true)}
//                       className="w-full sm:w-auto px-5 py-3 rounded-2xl text-black-700 font-extrabold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Handshake className="w-4 h-4" />
//                       <span>get personalised counselling information</span>
//                     </button>

//                     <button
//                       type="button"
//                       disabled={selectedCollegesForCounselling.length === 0}
//                       onClick={() => {
//                         if (selectedCollegesForCounselling.length === 0) return;
//                         if (typeof window !== 'undefined') {
//                           localStorage.setItem(
//                             'selectedColleges',
//                             JSON.stringify(selectedCollegesForCounselling)
//                           );
//                         }
//                         router.push('/college-counselling');
//                       }}
//                       className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
//                         selectedCollegesForCounselling.length === 0
//                           ? 'bg-gradient-to-r from-[#E2E8F0] to-[#E2E8F0] text-white shadow-md cursor-not-allowed shadow-none disable'
//                           : 'bg-gradient-to-r section-dark-btn text-white shadow-md active:scale-98 cursor-pointer'
//                       }`}
//                     >
//                       <span>
//                         {selectedCollegesForCounselling.length === 0
//                           ? 'Select Colleges to Proceed'
//                           : `${selectedCollegesForCounselling.length} College Counselling`}
//                       </span>
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Reveal>
//         </div>
//       </div>

//       {/* Predict Lead Capture Modal */}
//       {isPredictLeadModalOpen &&
//         mounted &&
//         createPortal(
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
//             onMouseDown={(e) => {
//               if (e.target === e.currentTarget) setIsPredictLeadModalOpen(false);
//             }}
//           >
//             <div className="relative w-full max-w-md bg-[#090d16] text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
//               <button
//                 type="button"
//                 onClick={() => setIsPredictLeadModalOpen(false)}
//                 className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
//                 aria-label="Close"
//               >
//                 <X className="w-4 h-4" />
//               </button>

//               <div className="text-center mb-6">
//                 <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase mb-2">
//                   <Sparkles className="w-3.5 h-3.5" /> Unlock College Prediction
//                 </span>
//                 <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
//                   Get your favourite college counselling info
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
//                   Enter your contact info to view matching medical colleges &amp; cutoffs.
//                 </p>
//               </div>

//               <form onSubmit={handlePredictLeadSubmit} className="space-y-4 text-left">
//                 <div>
//                   <label className="block text-xs font-bold text-slate-300 mb-1.5">
//                     Full Name <span className="text-amber-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={predictLeadName}
//                     onChange={(e) => setPredictLeadName(e.target.value)}
//                     placeholder="Enter your full name"
//                     className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-300 mb-1.5">
//                     Email Address <span className="text-amber-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     value={predictLeadEmail}
//                     onChange={(e) => setPredictLeadEmail(e.target.value)}
//                     placeholder="you@example.com"
//                     className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-300 mb-1.5">
//                     WhatsApp / Phone Number <span className="text-amber-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     required
//                     value={predictLeadMobile}
//                     onChange={(e) => setPredictLeadMobile(e.target.value)}
//                     placeholder="e.g. 9876543210"
//                     className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
//                   />
//                 </div>

//                 {predictLeadError && (
//                   <p className="text-xs text-rose-400 font-bold break-words">{predictLeadError}</p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={predictLeadLoading}
//                   className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
//                 >
//                   {predictLeadLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" /> Saving &amp; Matching...
//                     </>
//                   ) : (
//                     <>
//                       Submit &amp; View Colleges <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>,
//           document.body
//         )}

//       {/* Modals rendered via portal into document.body so they aren't
//           trapped by this section's overflow-hidden/transform. */}
//       {mounted && infoModalMarkup && createPortal(infoModalMarkup, document.body)}
//       <CounsellingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </section>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  BarChart2,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Handshake,
  ArrowRight,
  GraduationCap,
  MapPin,
  Search,
  Info,
  X,
  CheckCircle2,
  Plus,
  Filter,
  Sparkles,
  Download,
} from 'lucide-react';
import MedicalPulseLoader from '@/components/MedicalPulseLoader';
import CounsellingModal from '@/components/CounsellingModal';
import MultiSelect from '@/components/Multiselect';
import Dropdown from '@/components/dropdown';
import { isStateMatched } from '@/lib/data/collegeMatcher';
import { downloadCounsellingPdf } from '@/lib/downloadPdf';
import {
  SUPPORTED_EXAMS,
  getCoursesByExam,
  INDIAN_STATES,
  NEET_CATEGORIES,
  ALL_COURSES,
  getRankConfidenceLevel,
} from '@/constants';
import Reveal from './reveal';
import UgMasterCollegeList from '@/lib/data/allstate/UgMasterCollegeList.json';

const ALL_COLLEGE_OPTIONS: { code: string; name: string }[] = (() => {
  if (!Array.isArray(UgMasterCollegeList)) return [];
  const set = new Set<string>();
  for (const item of UgMasterCollegeList as any[]) {
    const rawName = item["College Name"];
    if (rawName && typeof rawName === 'string' && rawName.trim()) {
      const cleanName = rawName.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanName) {
        set.add(cleanName);
      }
    }
  }
  return Array.from(set).sort().map((name) => ({ code: name, name }));
})();

interface HeroSectionProps {
  marks: string;
  setMarks: (v: string) => void;
  rankResult: any;
  setRankResult: (v: any) => void;
  rankLoading: boolean;
  rankError: string;
  setRankError: (v: string) => void;
  rankExamType: string;
  setRankExamType: (v: string) => void;
  handleRankSubmit: (e: React.FormEvent) => void;
  getMaxMarks: (exam: string) => number;
  fmt: (n: number) => string;
  mode?: 'allstate' | 'karnataka';
  handleNavigateToCollegePredictor?: () => void;
}

type HeroTab = 'rank' | 'college';

// Shared brand gradient used across the site's dark hero / accent cards
const BRAND_GRADIENT = 'linear-gradient(135deg, #0095ff 0%, #00e5bf 60%, #2dd4bf 100%)';

/**
 * Calculates admission chance based on student rank vs college closing cutoff:
 * - High Chance: when student rank <= closing cutoff (e.g. rank 5000 <= cutoff 6100).
 * - Medium Chance: when student rank > closing cutoff, but close (e.g. cutoff 4800 to 4990 for rank 5000).
 * - Low Chance / Reach: when student rank > closing cutoff by a larger margin (e.g. cutoff < 4800 for rank 5000).
 */
function calculateAdmissionChance(studentRank: number, closingCutoff: number): 'High' | 'Medium' | 'Reach' {
  if (!closingCutoff || closingCutoff <= 0) return 'Reach';
  if (!studentRank || studentRank <= 0) return 'High';

  if (studentRank <= closingCutoff) {
    return 'High';
  }

  const diff = studentRank - closingCutoff;
  if (diff <= 350 || diff / closingCutoff <= 0.08) {
    return 'Medium';
  }

  return 'Reach';
}

/**
 * Robustly matches a selected course (by code like MD_GEN_MED, MBBS or name)
 * against a cutoff's course name string returned by AI / DB.
 */
function matchCourseName(selectedCourse: string, cutCourseName: string): boolean {
  if (!selectedCourse || selectedCourse === 'ALL') return true;
  if (!cutCourseName) return true;

  const s = selectedCourse.toLowerCase().trim();
  const c = cutCourseName.toLowerCase().trim();

  if (c.includes(s) || s.includes(c)) return true;

  const found = ALL_COURSES.find(
    (item) =>
      item.code.toLowerCase() === s ||
      item.name.toLowerCase().includes(s) ||
      s.includes(item.code.toLowerCase())
  );
  if (found) {
    const code = found.code.toLowerCase();
    const name = found.name.toLowerCase();
    if (c.includes(code) || name.includes(c) || c.includes(name)) return true;
  }

  const normS = s.replace(/[^a-z0-9]/g, '');
  const normC = c.replace(/[^a-z0-9]/g, '');
  if (normC.includes(normS) || normS.includes(normC)) return true;

  return false;
}

export default function HeroSection({
  marks,
  setMarks,
  rankResult,
  setRankResult,
  rankLoading,
  rankError,
  setRankError,
  rankExamType,
  setRankExamType,
  handleRankSubmit,
  getMaxMarks,
  fmt,
  mode = 'karnataka',
}: HeroSectionProps) {
  const router = useRouter();

  // Round-then-format helper for all cutoff / rank numbers shown to the user,
  // so values like 10711.7 always render as a clean whole number (10,711)
  // regardless of decimals coming back from the AI / DB layer.
  const fmtInt = (n: number) => fmt(Math.round(Number(n) || 0));

  // ---- Tab state (defaults to College Predictor) ----
  const [activeTab, setActiveTab] = useState<HeroTab>('college');

  // ---- Portal mount guard (document is undefined during SSR) ----
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- College Predictor state ----
  const [collegeRank, setCollegeRank] = useState('');
  const [collegeExamType, setCollegeExamType] = useState('NEET_UG');
  const [selectedCourse, setSelectedCourse] = useState('MBBS');
  const [selectedCategory, setSelectedCategory] = useState('UR');
  const [selectedStates, setSelectedStates] = useState<string[]>(mode === 'allstate' ? ['AI'] : ['KA']);
  const [selectedRound, setSelectedRound] = useState<string>('Round 1');

  const COUNSELLING_ROUNDS = [
    { code: 'Round 1', name: 'Round 1 (Default)' },
    { code: 'Round 2', name: 'Round 2' },
    { code: 'Round 3', name: 'Round 3 / Mop-up' },
    { code: 'Stray', name: 'Stray Vacancy Round' },
    { code: 'ALL', name: 'All Rounds' },
  ];

  const [collegeResult, setCollegeResult] = useState<any>(null);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeError, setCollegeError] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');

  // Filter drawer controls
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [chanceFilter, setChanceFilter] = useState<'all' | 'High' | 'Medium' | 'Reach'>('all');
  const [roundFilter, setRoundFilter] = useState<'all' | 'Round 1' | 'Round 2' | 'Round 3' | 'Stray'>('all');
  const [roundCategoryFilter, setRoundCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Government' | 'Private' | 'Deemed'>('all');

  // Automatically update default roundFilter based on selected states:
  // All States / AI -> 'all' (All Rounds)
  // Specific State -> 'Round 1'
  useEffect(() => {
    const isAllStates =
      selectedStates.length === 0 ||
      selectedStates.includes('AI') ||
      selectedStates.includes('ALL');

    if (isAllStates) {
      setRoundFilter('all');
    } else {
      setRoundFilter('Round 1');
    }
  }, [selectedStates]);

  const scrollToResults = () => {
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const [selectedCollegesForCounselling, setSelectedCollegesForCounselling] = useState<any[]>([]);
  const [infoModalCollege, setInfoModalCollege] = useState<any | null>(null);

  const [lastSearchParams, setLastSearchParams] = useState<{
    rank: string;
    examType: string;
    course: string;
    category: string;
    states: string[];
    round: string;
  } | null>(null);

  // ---- Counselling Kit modal state (shared by both tabs) ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalMobile, setModalMobile] = useState('');
  const [modalCourse, setModalCourse] = useState('');
  const [modalScore, setModalScore] = useState('');
  const [modalCollegeInput, setModalCollegeInput] = useState('');
  const [modalFavColleges, setModalFavColleges] = useState<string[]>([]);
  const [modalConsent, setModalConsent] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  // ---- Lead Capture Modal for College Predictor ----
  const [isPredictLeadModalOpen, setIsPredictLeadModalOpen] = useState(false);
  const [hasSubmittedPredictLeadInSession, setHasSubmittedPredictLeadInSession] = useState(false);
  const [predictLeadName, setPredictLeadName] = useState('');
  const [predictLeadEmail, setPredictLeadEmail] = useState('');
  const [predictLeadMobile, setPredictLeadMobile] = useState('');
  const [predictLeadHomeState, setPredictLeadHomeState] = useState('Karnataka');
  const [predictCollegeInput, setPredictCollegeInput] = useState('');
  const [predictPreferredColleges, setPredictPreferredColleges] = useState<string[]>([]);
  const [predictLeadLoading, setPredictLeadLoading] = useState(false);
  const [predictLeadError, setPredictLeadError] = useState('');

  const handleAddPreferredCollege = () => {
    const val = predictCollegeInput.trim();
    if (!val) return;
    if (!predictPreferredColleges.includes(val)) {
      setPredictPreferredColleges((prev) => [...prev, val]);
    }
    setPredictCollegeInput('');
  };

  const handleRemovePreferredCollege = (indexToRemove: number) => {
    setPredictPreferredColleges((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const availableCourses = getCoursesByExam(collegeExamType as any);

  // Sync form inputs to localStorage dynamically as user updates them
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (collegeRank) localStorage.setItem('predict_rank', collegeRank);
      if (collegeExamType) localStorage.setItem('predict_examType', collegeExamType);
      if (selectedCourse) localStorage.setItem('predict_course', selectedCourse);
      if (selectedCategory) localStorage.setItem('predict_category', selectedCategory);
      if (selectedRound) localStorage.setItem('predict_round', selectedRound);
      if (selectedStates && selectedStates.length > 0) {
        localStorage.setItem('predict_states', JSON.stringify(selectedStates));
      }
    }
  }, [collegeRank, collegeExamType, selectedCourse, selectedCategory, selectedStates, selectedRound]);

  // Restore states from localStorage on client mount if navigating back, OR clear if reloaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navEntries = performance.getEntriesByType('navigation');
      const isReload = navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload';

      // If user reloaded/refreshed the page -> clear localStorage fresh!
      if (isReload) {
        localStorage.removeItem('predict_rank');
        localStorage.removeItem('predict_examType');
        localStorage.removeItem('predict_course');
        localStorage.removeItem('predict_category');
        localStorage.removeItem('predict_states');
        localStorage.removeItem('predict_round');
        localStorage.removeItem('collegeList');
        localStorage.removeItem('college_prediction_results');
        localStorage.removeItem('selectCollege');
        localStorage.removeItem('selectedColleges');
        return;
      }

      // If navigation (e.g. Back button click) -> restore state from localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const isRestore = urlParams.get('restore') === 'true';
      const tabParam = urlParams.get('tab');

      const storedRank = localStorage.getItem('predict_rank');
      const storedExamType = localStorage.getItem('predict_examType');
      const storedCourse = localStorage.getItem('predict_course');
      const storedCategory = localStorage.getItem('predict_category');
      const storedStates = localStorage.getItem('predict_states');
      const storedRound = localStorage.getItem('predict_round');
      const storedList = localStorage.getItem('collegeList') || localStorage.getItem('college_prediction_results');
      const storedSelected = localStorage.getItem('selectCollege') || localStorage.getItem('selectedColleges');

      if (isRestore || tabParam === 'college' || storedRank || storedList || storedSelected) {
        if (storedRank) setCollegeRank(storedRank);
        if (storedExamType) setCollegeExamType(storedExamType);
        if (storedCourse) setSelectedCourse(storedCourse);
        if (storedCategory) setSelectedCategory(storedCategory);
        if (storedRound) setSelectedRound(storedRound);
        if (storedStates) {
          try {
            const parsed = JSON.parse(storedStates);
            if (Array.isArray(parsed)) setSelectedStates(parsed);
          } catch {}
        }
        if (storedList) {
          try {
            const parsedList = JSON.parse(storedList);
            setCollegeResult(parsedList);
            setLastSearchParams({
              rank: storedRank || '',
              examType: storedExamType || 'NEET_UG',
              course: storedCourse || 'MBBS',
              category: storedCategory || 'ALL',
              round: storedRound || 'Round 1',
              states: (() => {
                if (!storedStates) return mode === 'allstate' ? ['AI'] : ['KA'];
                try {
                  const parsed = JSON.parse(storedStates);
                  return Array.isArray(parsed) ? parsed : (mode === 'allstate' ? ['AI'] : ['KA']);
                } catch {
                  return mode === 'allstate' ? ['AI'] : ['KA'];
                }
              })(),
            });
          } catch {}
        }
        if (storedSelected) {
          try {
            const parsedSel = JSON.parse(storedSelected);
            if (Array.isArray(parsedSel)) setSelectedCollegesForCounselling(parsedSel);
          } catch {}
        }
        if (storedList || storedRank || tabParam === 'college') {
          setActiveTab('college');
        }
      } else if (tabParam === 'rank') {
        setActiveTab('rank');
      }
    }
  }, []);

  const goToCollegeTab = () => {
    setActiveTab('college');

    if (rankResult) {
      const rStr = String(rankResult.expected);
      setCollegeRank(rStr);
      setCollegeExamType(rankExamType);
      const courses = getCoursesByExam(rankExamType as any);
      const defaultCourse = courses && courses.length > 0 ? courses[0].code : 'MBBS';
      setSelectedCourse(defaultCourse);
      setSelectedCategory('UR');
      const statesToUse = selectedStates && selectedStates.length > 0 ? selectedStates : (mode === 'allstate' ? ['AI'] : ['KA']);
      setSelectedStates(statesToUse);
      setSelectedRound('Round 1');

      setCollegeResult(null);
      setSelectedCollegesForCounselling([]);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('collegeList');
        localStorage.removeItem('college_prediction_results');
        localStorage.removeItem('selectCollege');
        localStorage.removeItem('selectedColleges');
        localStorage.removeItem('predict_states');
        localStorage.removeItem('predict_course');
        localStorage.removeItem('predict_category');
        localStorage.removeItem('predict_round');
        localStorage.setItem('predict_rank', rStr);
        localStorage.setItem('predict_examType', rankExamType);
      }
      executeCollegeSearch(rStr, rankExamType, defaultCourse, 'UR', statesToUse, 'Round 1');
      scrollToResults();
    }
  };

  const executeCollegeSearch = async (
    rStr: string,
    eStr: string,
    cStr: string,
    catStr: string,
    sArr: string[],
    rRoundStr: string = 'Round 1'
  ) => {
    const rankNum = parseInt(rStr, 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      setCollegeError('Please enter a valid All India Rank (AIR).');
      return;
    }

    setCollegeLoading(true);
    setCollegeError('');

    try {
      const coursesForExam = getCoursesByExam(eStr as any);
      const coursesToUse = cStr === 'ALL' ? coursesForExam.map((c) => c.code) : [cStr];

      const res = await fetch('/api/ai-predict-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: rankNum,
          examType: eStr,
          course: cStr,
          courses: coursesToUse,
          category: catStr,
          states: sArr,
          round: rRoundStr,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCollegeError(data.error || 'Failed to predict colleges.');
      } else {
        setCollegeResult(data);
        setLastSearchParams({ rank: rStr, examType: eStr, course: cStr, category: catStr, states: sArr, round: rRoundStr });
        scrollToResults();
        if (typeof window !== 'undefined') {
          localStorage.setItem('predict_rank', rStr);
          localStorage.setItem('predict_examType', eStr);
          localStorage.setItem('predict_course', cStr);
          localStorage.setItem('predict_category', catStr);
          localStorage.setItem('predict_round', rRoundStr);
          localStorage.setItem('predict_states', JSON.stringify(sArr));
          localStorage.setItem('collegeList', JSON.stringify(data));
          localStorage.setItem('college_prediction_results', JSON.stringify(data));
        }
      }
    } catch {
      setCollegeError('Connection error. Please try again.');
    } finally {
      setCollegeLoading(false);
    }
  };

  const handleCollegeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(collegeRank, 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      setCollegeError('Please enter a valid All India Rank (AIR).');
      return;
    }
    setCollegeError('');

    // If user has already submitted the lead capture modal during this page session, skip modal & search directly
    if (hasSubmittedPredictLeadInSession) {
      executeCollegeSearch(collegeRank, collegeExamType, selectedCourse, selectedCategory, selectedStates, selectedRound);
      return;
    }

    setPredictLeadError('');
    setPredictLeadName('');
    setPredictLeadEmail('');
    setPredictLeadMobile('');
    const stateName = INDIAN_STATES.find((s) => s.code === (selectedStates[0] || 'KA'))?.name || selectedStates[0] || 'Karnataka';
    setPredictLeadHomeState(stateName);
    setPredictCollegeInput('');
    setPredictPreferredColleges([]);
    setIsPredictLeadModalOpen(true);
  };

  const handlePredictLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictLeadError('');
    if (!predictLeadName.trim()) {
      setPredictLeadError('Please enter your full name.');
      return;
    }
    if (!predictLeadEmail.trim()) {
      setPredictLeadError('Please enter your email address.');
      return;
    }
    if (!predictLeadMobile.trim()) {
      setPredictLeadError('Please enter your phone number.');
      return;
    }

    setPredictLeadLoading(true);

    const preferredCollegeListStr = predictPreferredColleges.join(', ');

    try {
      // 1. Push lead to Zoho CRM
      await fetch('/api/zoho-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: predictLeadName.trim(),
          email: predictLeadEmail.trim(),
          mobileNo: predictLeadMobile.trim(),
          homeState: predictLeadHomeState,
          studentProfile: {
            rank: collegeRank,
            course: selectedCourse,
            exam: collegeExamType,
            category: selectedCategory,
            states: selectedStates.join(', '),
            preferredColleges: preferredCollegeListStr,
          },
          selectedColleges: predictPreferredColleges.map((c) => ({ college_name: c })),
          leadSource: 'College Predictor Modal Form',
        }),
      });

      // 2. Send email notification
      await fetch('/api/counselling/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: predictLeadName.trim(),
          email: predictLeadEmail.trim(),
          mobileNo: predictLeadMobile.trim(),
          homeState: predictLeadHomeState,
          studentProfile: {
            rank: collegeRank,
            course: selectedCourse,
            exam: collegeExamType,
            category: selectedCategory,
            states: selectedStates.join(', '),
            preferredColleges: preferredCollegeListStr,
          },
          selectedColleges: predictPreferredColleges.map((c) => ({ college_name: c })),
          preferredCollegesList: predictPreferredColleges,
          type: 'counselling',
        }),
      });
    } catch (zohoErr) {
      console.warn('[HeroSection] Lead submission warning:', zohoErr);
    } finally {
      setHasSubmittedPredictLeadInSession(true);
      setPredictLeadLoading(false);
      setIsPredictLeadModalOpen(false);
      setSelectedCollegesForCounselling([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedColleges');
        localStorage.removeItem('selectCollege');
      }
      executeCollegeSearch(collegeRank, collegeExamType, selectedCourse, selectedCategory, selectedStates, selectedRound);
    }
  };

  const handleClearCollegeForm = () => {
    setCollegeRank('');
    setSelectedStates(mode === 'allstate' ? ['AI'] : ['KA']);
    setSelectedCourse('MBBS');
    setSelectedCategory('UR');
    setCollegeError('');
    setCollegeResult(null);
    setSelectedCollegesForCounselling([]);
    setHasSubmittedPredictLeadInSession(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('predict_rank');
      localStorage.removeItem('college_prediction_results');
      localStorage.removeItem('collegeList');
      localStorage.removeItem('selectedColleges');
      localStorage.removeItem('selectCollege');
    }
  };

  const toggleCollegeSelection = (college: any) => {
    let updated: any[] = [];
    const collegeId = college.college_id;
    if (selectedCollegesForCounselling.some((c) => c.college_id === collegeId)) {
      updated = selectedCollegesForCounselling.filter((c) => c.college_id !== collegeId);
    } else {
      updated = [...selectedCollegesForCounselling, college];
    }
    setSelectedCollegesForCounselling(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectCollege', JSON.stringify(updated));
      localStorage.setItem('selectedColleges', JSON.stringify(updated));
    }
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!modalEmail) {
      setModalError('Please enter your email.');
      return;
    }
    setModalLoading(true);
    try {
      const res = await fetch('/api/counselling/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modalName, email: modalEmail, type: 'simple' }),
      });
      if (res.ok) {
        setModalSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setModalSuccess(false);
          setModalName('');
          setModalEmail('');
        }, 1500);
      } else {
        setModalError('Failed to submit request.');
      }
    } catch {
      setModalError('Connection error. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Grouping colleges to support BOTH { colleges: [...] } and { results: [...] } API JSON schemas
  const getGroupedColleges = () => {
    if (!collegeResult) return [];

    const rawList = collegeResult.colleges || collegeResult.results || [];
    if (!Array.isArray(rawList) || rawList.length === 0) return [];

    const map = new Map<string | number, any>();

    for (const c of rawList) {
      const name = c.college_name || c.name || 'Medical College';
      const key = c.college_id || name;
      const state = c.state_name || c.state || 'All India';
      const type = c.college_type || c.collegeType || c.type || 'Government';

      let extractedCutoffs: any[] = [];
      let counsellingInfo = c.counsellingDetail || null;
      let topChance = c.best_chance || 'High';
      let topCutoff = c.closest_cutoff || 0;

      if (c.cutoffs && Array.isArray(c.cutoffs)) {
        extractedCutoffs = c.cutoffs.map((cut: any) => ({
          course_name: cut.course_name || cut.course || 'MBBS',
          category_name: cut.category_name || cut.category || 'General',
          closing_rank: cut.closing_rank || cut.cutoffRank || 0,
          best_chance: cut.best_chance || cut.chanceOfAdmission || 'High',
        }));
      } else if (c.courses && Array.isArray(c.courses)) {
        for (const crs of c.courses) {
          const crsName = crs.course || crs.course_name || 'MBBS';
          if (crs.counsellingDetail) {
            counsellingInfo = crs.counsellingDetail;
          }

          if (crs.categories && Array.isArray(crs.categories)) {
            for (const cat of crs.categories) {
              const catName = cat.category || cat.category_name || 'General';
              const rankVal = cat.cutoffRank || cat.closing_rank || 0;
              const chanceVal = cat.chanceOfAdmission || cat.best_chance || 'High';

              extractedCutoffs.push({
                course_name: crsName,
                category_name: catName,
                closing_rank: rankVal,
                best_chance: chanceVal,
              });

              if (!topCutoff || (rankVal > 0 && rankVal < topCutoff)) {
                topCutoff = rankVal;
              }
              if (chanceVal) topChance = chanceVal;
            }
          }
        }
      }

      if (!topCutoff && extractedCutoffs.length > 0) {
        topCutoff = extractedCutoffs[0].closing_rank;
      }

      if (!map.has(key)) {
        map.set(key, {
          college_id: key,
          college_name: name,
          state_name: state,
          city_name: c.city_name || c.city || '',
          college_type: type,
          best_chance: topChance,
          closest_cutoff: topCutoff,
          counsellingDetail: counsellingInfo,
          cutoffs: extractedCutoffs,
          allRoundCutoffs: c.allRoundCutoffs || null,
          overallRangeStr: c.overallRangeStr || null,
        });
      } else {
        const existing = map.get(key);
        if (!existing.allRoundCutoffs && c.allRoundCutoffs) {
          existing.allRoundCutoffs = c.allRoundCutoffs;
        }
        if (!existing.overallRangeStr && c.overallRangeStr) {
          existing.overallRangeStr = c.overallRangeStr;
        }
        if (!existing.counsellingDetail && counsellingInfo) {
          existing.counsellingDetail = counsellingInfo;
        }
        for (const newCut of extractedCutoffs) {
          if (!existing.cutoffs.some((x: any) => x.course_name === newCut.course_name && x.category_name === newCut.category_name)) {
            existing.cutoffs.push(newCut);
          }
        }
      }
    }

    return Array.from(map.values());
  };

  const groupedColleges = getGroupedColleges();

  // True when the person has changed rank/exam/course/category/states in the
  // form since the results currently on screen were fetched. We deliberately
  // do NOT re-filter the existing (stale) results client-side when this is
  // true — that was producing a confusing, visually-broken panel (list would
  // look wrong/empty while the header still showed the old total). Instead
  // we surface a clear banner telling the person to click Predict again.
  const statesMatch = (a: string[], b: string[]) => {
    const sa = [...a].sort().join(',');
    const sb = [...b].sort().join(',');
    return sa === sb;
  };
  const filtersOutOfSync =
    !!collegeResult &&
    !!lastSearchParams &&
    (collegeRank !== lastSearchParams.rank ||
      collegeExamType !== lastSearchParams.examType ||
      selectedCourse !== lastSearchParams.course ||
      selectedCategory !== lastSearchParams.category ||
      !statesMatch(selectedStates, lastSearchParams.states));

  const isRankTab = activeTab === 'rank';
  const isCollegeTab = activeTab === 'college';
  const noResultYet = (isRankTab && !rankResult) || (isCollegeTab && !collegeResult);
  const isLoadingNow = (isRankTab && rankLoading) || (isCollegeTab && collegeLoading);

  // ---- Modal markup, rendered via portal so it's never trapped by an
  // ancestor's overflow/transform (this section uses overflow-hidden which
  // otherwise breaks position:fixed) ----

  const infoModalMarkup = infoModalCollege && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setInfoModalCollege(null)}
      />
      <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden animate-in fade-in duration-200 flex flex-col">
        <div className="p-4 sm:p-6 text-black relative shrink-0" style={{ background: BRAND_GRADIENT }}>
          <button
            type="button"
            onClick={() => setInfoModalCollege(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-black hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider text-black/80 bg-white/10 px-2.5 py-1 rounded-md">
            Course &amp; Category Cutoff Details
          </span>
          <h3 className="text-base sm:text-lg font-black text-black mt-2 leading-snug pr-8">
            {infoModalCollege.college_name}
          </h3>
          <p className="text-xs text-black/80 mt-1 font-semibold flex flex-wrap items-center gap-2">
            <span>{infoModalCollege.state_name}</span>
            <span>•</span>
            <span className="uppercase">{infoModalCollege.college_type || 'Government'}</span>
            <span>•</span>
            <span>Closing Cutoff: {fmtInt(infoModalCollege.closest_cutoff)}</span>
          </p>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 grow">
          {infoModalCollege.allRoundCutoffs && (
            <div className="bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
              <div
                className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2"
                style={{ background: BRAND_GRADIENT }}
              >
                <h4 className="font-black text-black text-sm">All Rounds &amp; Categories Cutoff Matrix</h4>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-black px-2.5 py-0.5 rounded-full">
                  UgMasterCollegeList Dataset
                </span>
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-extrabold">
                      <th className="p-2.5">Counselling Round</th>
                      <th className="p-2.5 text-indigo-700">General (UR)</th>
                      <th className="p-2.5 text-indigo-700">OBC-NCL</th>
                      <th className="p-2.5 text-indigo-700">EWS</th>
                      <th className="p-2.5 text-indigo-700">SC</th>
                      <th className="p-2.5 text-indigo-700">ST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {['Round 1', 'Round 2', 'Round 3', 'Stray'].map((rnd) => {
                      const rData = infoModalCollege.allRoundCutoffs[rnd] || {};
                      return (
                        <tr key={rnd} className="hover:bg-slate-50 font-semibold">
                          <td className="p-2.5 font-black text-slate-800">{rnd}</td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {rData['Gen'] ? `AIR ~${fmtInt(rData['Gen'])}` : '—'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {rData['OBC-NCL'] ? `AIR ~${fmtInt(rData['OBC-NCL'])}` : '—'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {rData['EWS'] ? `AIR ~${fmtInt(rData['EWS'])}` : '—'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {rData['SC'] ? `AIR ~${fmtInt(rData['SC'])}` : '—'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {rData['ST'] ? `AIR ~${fmtInt(rData['ST'])}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(() => {
            const ALL_NEET_CATS = [
              { code: 'UR', name: 'General (UR)', factor: 1.0 },
              { code: 'OBC', name: 'OBC Category', factor: 1.08 },
              { code: 'EWS', name: 'EWS Category', factor: 1.06 },
              { code: 'SC', name: 'SC Category', factor: 2.15 },
              { code: 'ST', name: 'ST Category', factor: 3.1 },
            ];

            // Determine category and course displayed outside on card so we hide outside category only for that specific course
            const outsideCatCode = (selectedCategory === 'ALL' || selectedCategory === 'UR') ? 'UR' : selectedCategory.toUpperCase();
            const allExamCourses = getCoursesByExam(collegeExamType as any);
            const primaryCourseCode = selectedCourse === 'ALL' ? (allExamCourses[0]?.code || 'MBBS') : selectedCourse;
            const rawCutoffs = infoModalCollege.cutoffs || [];

            return allExamCourses.map((crsObj) => {
              const crsCode = crsObj.code;
              const crsFullName = crsObj.name;

              const isOutsideCourse = matchCourseName(primaryCourseCode, crsCode) || matchCourseName(primaryCourseCode, crsFullName);
              const modalCategories = isOutsideCourse
                ? ALL_NEET_CATS.filter(
                    (cat) => cat.code.toUpperCase() !== outsideCatCode && !cat.name.toUpperCase().includes(outsideCatCode)
                  )
                : ALL_NEET_CATS;

              const courseCutoffs = (rawCutoffs || []).filter((cut: any) => {
                const cName = cut.course_name || cut.course || '';
                return matchCourseName(crsCode, cName);
              });

              // Check if course is offered at this institution
              const isCourseOffered =
                courseCutoffs.length > 0 ||
                (rawCutoffs.length === 0 && (crsCode === 'MBBS' || crsCode === 'MD_GEN_MED' || crsCode === 'MDS_CONS_END'));

              if (!isCourseOffered) {
                return (
                  <div
                    key={crsCode}
                    className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm leading-snug">
                          {crsFullName}
                        </h5>
                        <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                          Not Applicable / Course Not Offered at {infoModalCollege.college_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100/80 text-amber-900 px-2.5 py-1 rounded-full shrink-0 border border-amber-200">
                      Not Offered
                    </span>
                  </div>
                );
              }

              const baseGeneralCutoff =
                courseCutoffs.find(
                  (c: any) =>
                    c.category_name?.toLowerCase().includes('general') ||
                    c.category_name?.toLowerCase().includes('ur')
                )?.closing_rank ||
                infoModalCollege.closest_cutoff ||
                15000;

              const userRankNum = parseInt(collegeRank, 10) || 0;

              const displayCategories = modalCategories.map((cat) => {
                const found = courseCutoffs.find(
                  (c: any) =>
                    c.category_name?.toLowerCase().includes(cat.code.toLowerCase()) ||
                    c.category_name?.toLowerCase().includes(cat.name.toLowerCase())
                );

                const finalCutoff = found?.closing_rank || Math.round(baseGeneralCutoff * cat.factor);
                const computedChance = userRankNum > 0 ? calculateAdmissionChance(userRankNum, finalCutoff) : (found?.best_chance || 'High');

                return {
                  category_name: cat.name,
                  closing_rank: finalCutoff,
                  best_chance: computedChance,
                };
              });

              return (
                <div
                  key={crsCode}
                  className="bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0"
                >
                  <div
                    className="px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
                      <h4 className="font-black text-black text-sm">{crsFullName} Cutoff Matrix</h4>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-black px-2.5 py-0.5 rounded-full">
                      {isOutsideCourse ? `Other Categories (Excluding ${outsideCatCode})` : 'All 5 Categories Matrix'}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayCategories.map((catItem, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-colors shadow-2xs flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{catItem.category_name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AIQ</span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Closing Cutoff</span>
                          <span className="font-mono font-black text-indigo-600 text-xs">
                            AIR ~{fmtInt(catItem.closing_rank)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="p-4 border-t border-slate-150 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-bold">Detailed Cutoffs by Course &amp; Category</span>
          <button
            type="button"
            onClick={() => setInfoModalCollege(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-8 lg:py-12 px-4 sm:px-6 overflow-hidden section-dark">
      {/* Background glow overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Centered Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="section-head center mb-12 hero-heading-wrap">
            <h2 className="hero-title-cc font-extrabold text-white tracking-tight leading-tight">
              {mode === 'allstate' ? (
                <>
                  <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">NEET College</span> Predictor 2026 — Find Your MBBS College
                </>
              ) : (
                <>
                  Find Your Eligible <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">Karnataka</span> Medical Colleges
                </>
              )}
            </h2>
            <p className="hero-subtitle-cc" style={{ color: '#fff' }}>
              {mode === 'allstate'
                ? 'See which Government, Private and Deemed medical colleges you can get with your NEET rank or marks — real cutoff data, trusted since 2006..'
                : 'Predict eligible Karnataka medical colleges using your NEET rank and category. Get personalized college recommendations and counselling schedules'}
            </p>
          </div>
        </Reveal>

        {/*
          Grid Layout (4 Cols Form | 8 Cols Results)

          IMPORTANT: both tabs (Rank Predictor and College Predictor) share the
          exact same layout behaviour now — items-start, no forced heights, no
          isCollegeTab-specific stretching. Each card sizes to its own content,
          same as Rank Predictor always did. This removes the earlier mismatch
          where the College tab's form card would get force-stretched to match
          a tall results list.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Card: Form (4 Columns on LG screens) */}
          <Reveal className="lg:col-span-4" delay={80}>
            <div
              id="tools-section"
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl flex flex-col justify-between"
            >
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('rank')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                    isRankTab
                      ? 'tab-btn text-white shadow-sm'
                      : 'bg-transparent text-slate-500'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Rank Predictor
                </button>

                <button
                  type="button"
                  onClick={goToCollegeTab}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                    isCollegeTab
                      ? 'tab-btn text-white shadow-sm'
                      : 'bg-transparent text-slate-500'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  College Predictor
                </button>
              </div>

              {isRankTab ? (
                <>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                      <BarChart2 className="w-5 h-5" style={{color:"#2b255f"}} />
                    </div>
                    <div>
                      <h3 id="hero-title" className="text-base font-black text-slate-900">
                        NEET UG &amp; PG Rank Predictor
                      </h3>
                    </div>
                  </div>

                  <form onSubmit={(e) => { handleRankSubmit(e); scrollToResults(); }} className="flex-1 flex flex-col space-y-5">
                    <div>
                      <label
                        htmlFor="rankExamSelect"
                        className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider"
                      >
                        Select NEET Exam
                      </label>
                      <Dropdown
                        options={SUPPORTED_EXAMS}
                        value={rankExamType}
                        onChange={(val) => {
                          setRankExamType(val);
                          setMarks('');
                          setRankResult(null);
                          setRankError('');
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="marksInput"
                        className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider"
                      >
                        Total {rankExamType.replace(/_/g, ' ')} Marks (0 – {getMaxMarks(rankExamType)})
                      </label>
                      <input
                        type="number"
                        id="marksInput"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder={`e.g. ${
                          rankExamType === 'NEET_PG' ? '600' : rankExamType === 'NEET_MDS' ? '700' : '640'
                        }`}
                        min={0}
                        max={getMaxMarks(rankExamType)}
                        required
                        className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={rankLoading}
                        className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
                      >
                        {rankLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Predicting...
                          </>
                        ) : (
                          <>
                            Predict Rank <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMarks('');
                          setRankResult(null);
                          setRankError('');
                        }}
                        className="px-5 py-3.5 rounded-2xl border border-slate-250 text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors shrink-0"
                      >
                        Reset
                      </button>
                    </div>
                  </form>

                  {rankError && (
                    <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 reveal-el reveal-el-visible">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{rankError}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                      <GraduationCap className="w-5 h-5" style={{color:"#2b255f"}}/>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">College Predictor</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Enter rank and preferences</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => { handleCollegeSubmit(e); scrollToResults(); }} className="flex-1 flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                          NEET Rank (AIR)
                        </label>
                        <input
                          type="number"
                          value={collegeRank}
                          onChange={(e) => setCollegeRank(e.target.value)}
                          placeholder="e.g. 15000"
                          required
                          className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2.5 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                          Exam
                        </label>
                        <Dropdown
                          options={SUPPORTED_EXAMS}
                          value={collegeExamType}
                          onChange={(val) => {
                            setCollegeExamType(val);
                            const courses = getCoursesByExam(val as any);
                            if (courses && courses.length > 0) {
                              setSelectedCourse(courses[0].code);
                            }
                            setSelectedCategory('UR');
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                        State
                      </label>
                      {mode === 'karnataka' ? (
                        <div className="relative">
                          <input
                            type="text"
                            value="Karnataka"
                            readOnly
                            className="w-full rounded-2xl border border-slate-250 bg-slate-100/90 pl-10 pr-4 py-2.5 text-sm font-extrabold text-slate-800 outline-none cursor-default select-none shadow-xs"
                          />
                          <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3 shrink-0 pointer-events-none" />
                        </div>
                      ) : (
                        <MultiSelect
                          options={INDIAN_STATES}
                          selectedValues={selectedStates}
                          onChange={setSelectedStates}
                          placeholder="Select States / AIQ"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                          Course
                        </label>
                        <Dropdown
                          options={availableCourses}
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                          Category
                        </label>
                        <Dropdown
                          options={NEET_CATEGORIES}
                          value={selectedCategory}
                          onChange={setSelectedCategory}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="submit"
                        disabled={collegeLoading}
                        className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
                      >
                        {collegeLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Matching Colleges...
                          </>
                        ) : (
                          <>
                            Predict Matching Colleges <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCollegeForm}
                        className="py-3.5 px-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors flex items-center justify-center shrink-0"
                      >
                        Clear
                      </button>
                    </div>
                  </form>

                  {collegeError && (
                    <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{collegeError}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </Reveal>

          {/* Right Card: Value/Results (8 Columns on LG screens) */}
          <Reveal className="lg:col-span-8" delay={160}>
            <div
              id="results-section"
              className={`bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between ${
                !isLoadingNow && noResultYet ? 'p-0 overflow-hidden' : 'p-6 sm:p-8 relative'
              }`}
            >
              {isLoadingNow ? (
                <MedicalPulseLoader
                  title={
                    isRankTab
                      ? 'Calculating NEET All India Rank...'
                      : 'Predicting Matching Medical Colleges...'
                  }
                  subtitle={
                    isRankTab
                      ? 'Analyzing historical score distribution & 4-year NEET paper trends...'
                      : 'Evaluating All India Quota (AIQ) & State quota cutoff databases...'
                  }
                />
              ) : noResultYet ? (
                <div className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-100">
                  <img
                    src="/assets/image/hero-banner-bg-image.jpeg"
                    alt="NEET Rank Predictor Banner"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              ) : isRankTab ? (
                <div className="space-y-6 animate-in fade-in duration-300 w-full">
                  <div
                    className="p-6 rounded-3xl text-slate-900 shadow-lg text-center"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest block mb-1">
                      Expected Rank Range
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      AIR {fmtInt(rankResult.rangeLow)} – {fmtInt(rankResult.rangeHigh)}
                    </div>
                    <span className="inline-block mt-2 px-3.5 py-1 rounded-full bg-black/10 text-xs font-extrabold backdrop-blur-xs text-slate-900">
                      Estimated Rank: AIR {fmtInt(rankResult.expected)}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                        Percentile
                      </span>
                      <span className="text-lg font-black text-slate-900">{rankResult.percentile}%</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                        4-Year Average
                      </span>
                      <span className="text-lg font-black text-black-900">
                        AIR ~{fmtInt(rankResult.averageRank)}
                      </span>
                    </div>
                    {(() => {
                      const predictedRank = rankResult.expected || rankResult.averageRank || 0;

                      const confidence = getRankConfidenceLevel(
                        predictedRank,
                        rankExamType as any
                      );

                      let badgeStyle = "bg-red-100 text-red-900 border border-red-200";

                      switch (confidence) {
                        case "Very High":
                          badgeStyle =
                            "bg-green-100 text-green-900 border border-green-200";
                          break;

                        case "High":
                          badgeStyle =
                            "bg-emerald-100 text-emerald-900 border border-emerald-200";
                          break;

                        case "Medium":
                          badgeStyle =
                            "bg-blue-100 text-blue-900 border border-blue-200";
                          break;

                        case "Low":
                          badgeStyle =
                            "bg-amber-100 text-amber-900 border border-amber-200";
                          break;

                        case "Very Low":
                          badgeStyle =
                            "bg-red-100 text-red-900 border border-red-200";
                          break;
                      }

                      return (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                            Confidence Level
                          </span>

                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${badgeStyle}`}
                          >
                            {confidence}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* YoY Trend */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" /> Year-over-Year Trend Analysis
                    </p>
                    <p className="text-slate-600 font-semibold text-[11px] leading-relaxed">
                      {rankResult.trendAnalysis}
                    </p>
                  </div>

                  {/* What this means for you */}
                  {rankResult.whatThisMeans && (
                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-1">
                      <p className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-black-500" /> What this means for you
                      </p>
                      <p className="text-indigo-950 font-semibold text-[11px] leading-relaxed">
                        {rankResult.whatThisMeans}
                      </p>
                    </div>
                  )}

                  {/* Transparency breakdown table */}
                  {rankResult.years && rankResult.years.length > 0 && (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                      <table className="w-full text-left text-xs min-w-[320px]">
                        <thead>
                          <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-extrabold">
                            <th className="p-3">NEET Year</th>
                            <th className="p-3">Estimated Rank</th>
                            <th className="p-3">Paper Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rankResult.years.map((y: any) => (
                            <tr key={y.year} className="border-b border-slate-100">
                              <td className="p-3 font-bold text-black-800">NEET {y.year}</td>
                              <td className="p-3 font-black text-black-600">AIR ~{fmtInt(y.rank)}</td>
                              <td className="p-3 font-semibold text-black-500">{y.trend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={goToCollegeTab}
                      className="flex-1 py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 section-dark-btn"
                    >
                      <span>Find Matching Colleges for AIR {fmtInt(rankResult.expected)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      style={{display:"none"}}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto py-4 px-6 rounded-2xl text-black-700 font-extrabold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Handshake className="w-4 h-4" style={{color:"#2b255f"}} />
                      <span style={{color:"#2b255f"}}>get personalised counselling information</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between w-full space-y-0 relative">
                  {/* Fixed Header with Filter Toggle Button & Search */}
                  <div className="shrink-0 pb-3 border-b border-slate-100 bg-white z-10 sticky top-0 flex flex-col space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-black text-slate-900 text-base">
                          Matching Colleges ({groupedColleges.length})
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Sorted by cutoff competitiveness · Click any card to select for counselling
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                            isFilterOpen || chanceFilter !== 'all' || roundFilter !== 'all' || typeFilter !== 'all'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filter</span>
                          {(chanceFilter !== 'all' || roundFilter !== 'all' || typeFilter !== 'all') && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </button>

                        <div className="relative flex-1 sm:w-48">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Search college name..."
                            value={collegeSearch}
                            onChange={(e) => setCollegeSearch(e.target.value)}
                            className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none focus:border-indigo-600 text-slate-800 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Filter Drawer Panel */}
                    {isFilterOpen && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                            Admission Chance
                          </label>
                          <select
                            value={chanceFilter}
                            onChange={(e) => setChanceFilter(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                          >
                            <option value="all">All Admission Chances</option>
                            <option value="High">High Chance</option>
                            <option value="Medium">Medium Chance</option>
                            <option value="Reach">Low / Reach Chance</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                            College Type
                          </label>
                          <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                          >
                            <option value="all">All College Types</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                            <option value="Deemed">Deemed University</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                            Counselling Round
                          </label>
                          <select
                            value={roundFilter}
                            onChange={(e) => setRoundFilter(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                          >
                            <option value="all">All Rounds</option>
                            <option value="Round 1">Round 1</option>
                            <option value="Round 2">Round 2</option>
                            <option value="Round 3">Round 3 / Mop-up</option>
                            <option value="Stray">Stray Vacancy Round</option>
                          </select>
                        </div>

                        {roundFilter !== 'all' && selectedCategory === 'ALL' && (
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                              Round Category
                            </label>
                            <select
                              value={roundCategoryFilter}
                              onChange={(e) => setRoundCategoryFilter(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                            >
                              <option value="all">All Categories</option>
                              <option value="Gen">General (UR)</option>
                              <option value="OBC-NCL">OBC-NCL</option>
                              <option value="EWS">EWS</option>
                              <option value="SC">SC</option>
                              <option value="ST">ST</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scrollable College List Body */}
                  <div className="grow overflow-y-auto py-3 space-y-3 sm:space-y-4 pr-1 max-h-[420px] sm:max-h-[460px]">
                    {(() => {
                      const filteredColleges = groupedColleges.filter((c: any) => {
                        if (chanceFilter !== 'all') {
                          const cChance = c.best_chance || 'High';
                          if (cChance.toLowerCase() !== chanceFilter.toLowerCase()) return false;
                        }

                        if (roundFilter !== 'all') {
                          let targetCat: string | null = null;
                          if (selectedCategory !== 'ALL') {
                            targetCat = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
                          } else if (roundCategoryFilter !== 'all') {
                            targetCat = roundCategoryFilter;
                          }

                          const roundData = c.allRoundCutoffs?.[roundFilter];

                          if (!roundData) return false;

                          const userRankNum = parseInt(collegeRank, 10) || 0;

                          if (targetCat) {
                            const roundVal = roundData[targetCat];
                            if (typeof roundVal !== 'number' || roundVal <= 0) {
                              return false;
                            }
                            if (userRankNum > 0 && userRankNum > Math.round(roundVal * 1.15)) {
                              return false;
                            }
                          } else {
                            const eligibleCutoffs = Object.values(roundData).filter(
                              (v) => typeof v === 'number' && (v as number) > 0 && (userRankNum <= 0 || userRankNum <= Math.round((v as number) * 1.15))
                            );

                            if (eligibleCutoffs.length === 0) return false;
                          }
                        }

                        if (typeFilter !== 'all') {
                          const cType = c.college_type || c.collegeType || c.type || 'Government';
                          if (!cType.toLowerCase().includes(typeFilter.toLowerCase())) return false;
                        }

                        const searchLower = collegeSearch.toLowerCase().trim();
                        const matchesSearch =
                          !searchLower ||
                          c.college_name.toLowerCase().includes(searchLower) ||
                          c.state_name.toLowerCase().includes(searchLower) ||
                          (c.cutoffs || []).some(
                            (cut: any) =>
                              cut.course_name?.toLowerCase().includes(searchLower) ||
                              cut.category_name?.toLowerCase().includes(searchLower)
                          );

                        const matchesCourse =
                          selectedCourse === 'ALL' ||
                          (c.cutoffs || []).length === 0 ||
                          (c.cutoffs || []).some((cut: any) =>
                            matchCourseName(selectedCourse, cut.course_name || cut.course || '')
                          );

                        const hasSpecificStates = selectedStates.filter(code => code !== 'AI' && code !== 'ALL').length > 0;
                        const matchesState =
                          !hasSpecificStates ||
                          selectedStates.some((code) => {
                            if (code === 'AI' || code === 'ALL') return false;
                            const stateName = (
                              INDIAN_STATES.find((s) => s.code === code)?.name || code
                            );
                            return isStateMatched(c.state_name, stateName);
                          });

                        return matchesSearch && matchesCourse && matchesState;
                      });

                      if (filteredColleges.length === 0) {
                        return (
                          <div className="h-full min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 my-auto">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center mb-3 text-indigo-600 shadow-2xs">
                              <GraduationCap className="w-6 h-6" />
                            </div>
                            <h5 className="font-black text-slate-900 text-sm sm:text-base">
                              No Medical Colleges Found
                            </h5>
                            <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1.5 leading-relaxed">
                              No colleges match your current state/course filter criteria. Try selecting "All Courses", picking additional preferred states, or clearing your search query.
                            </p>
                          </div>
                        );
                      }

                      return filteredColleges.map((c: any) => {
                        const isSelected = selectedCollegesForCounselling.some(
                          (item) => item.college_id === c.college_id
                        );

                        return (
                          <div
                            key={c.college_id}
                            onClick={() => toggleCollegeSelection(c)}
                            className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer relative shadow-xs ${
                              isSelected
                                ? 'bg-emerald-50/80 border-emerald-400 border-l-4 border-l-emerald-500 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="w-4 h-4 mt-1 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0 cursor-pointer"
                                />
                                <div className="min-w-0">
                                  <h5 className="font-black text-slate-900 text-sm sm:text-base leading-snug break-words">
                                    {c.college_name}
                                  </h5>
                                  <p className="text-xs text-slate-500 font-semibold mt-1 flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {c.city_name ? `${c.city_name}, ` : ''}{c.state_name}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 hidden xs:inline-block" />
                                    <span className="uppercase text-[9px] bg-slate-100 px-2 py-0.5 rounded border text-slate-600 font-bold" style={{display:"none"}}>
                                      {c.college_type}
                                    </span>
                                  </p>

                                  {(() => {
                                    const isRoundActive = roundFilter !== 'all';
                                    const categoryCodeMap: Record<string, string> = {
                                      'Gen': 'General',
                                      'OBC-NCL': 'OBC',
                                      'EWS': 'EWS',
                                      'SC': 'SC',
                                      'ST': 'ST',
                                    };

                                    if (isRoundActive) {
                                      const roundData = c.allRoundCutoffs?.[roundFilter] || {};

                                      let effectiveCatKey: string | null = null;
                                      if (selectedCategory !== 'ALL') {
                                        effectiveCatKey = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
                                      } else if (roundCategoryFilter !== 'all') {
                                        effectiveCatKey = roundCategoryFilter;
                                      }

                                      if (effectiveCatKey) {
                                        const roundVal = roundData[effectiveCatKey];
                                        if (typeof roundVal === 'number' && roundVal > 0) {
                                          return (
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200">
                                                <span>{roundFilter} ({categoryCodeMap[effectiveCatKey] || effectiveCatKey}):</span>
                                                <span className="font-mono text-indigo-600">AIR ~{fmtInt(roundVal)}</span>
                                              </span>
                                            </div>
                                          );
                                        }
                                      } else {
                                        const userRankNum = parseInt(collegeRank, 10) || 0;
                                        const validEntries = Object.entries(roundData).filter(
                                          ([_, v]) => typeof v === 'number' && (v as number) > 0 && (userRankNum <= 0 || userRankNum <= Math.round((v as number) * 1.15))
                                        );

                                        if (validEntries.length > 0) {
                                          return (
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                              {validEntries.map(([catKey, val]) => (
                                                <span
                                                  key={catKey}
                                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200"
                                                >
                                                  <span>{roundFilter} ({categoryCodeMap[catKey] || catKey}):</span>
                                                  <span className="font-mono text-indigo-600">AIR ~{fmtInt(val as number)}</span>
                                                </span>
                                              ))}
                                            </div>
                                          );
                                        }
                                      }
                                    }

                                    if (c.overallRangeStr) {
                                      return (
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
                                            <span>Overall Rank Range:</span>
                                            <span className="font-mono text-slate-900">{c.overallRangeStr}</span>
                                          </span>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-150">
                                          <span>MBBS:</span>
                                          <span className="font-mono text-indigo-600">AIR ~{fmtInt(c.closest_cutoff)}</span>
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-black border whitespace-nowrap ${
                                    c.best_chance === 'High'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : c.best_chance === 'Medium'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-rose-100 text-rose-800 border-rose-300'
                                  }`}
                                >
                                  {c.best_chance === 'High' ? 'High Chance' : c.best_chance === 'Medium' ? 'Medium Chance' : 'Low Chance'}
                                </span>

                                {(() => {
                                  let displayCutoff = c.closest_cutoff;
                                  const isRoundActive = roundFilter !== 'all';
                                  let effectiveCatKey: string | null = null;
                                  if (selectedCategory !== 'ALL') {
                                    effectiveCatKey = selectedCategory === 'UR' ? 'Gen' : selectedCategory;
                                  } else if (roundCategoryFilter !== 'all') {
                                    effectiveCatKey = roundCategoryFilter;
                                  }

                                  if (isRoundActive && c.allRoundCutoffs?.[roundFilter]) {
                                    const roundData = c.allRoundCutoffs[roundFilter];
                                    if (effectiveCatKey && typeof roundData[effectiveCatKey] === 'number') {
                                      displayCutoff = roundData[effectiveCatKey];
                                    } else {
                                      const nums = Object.values(roundData).filter((v): v is number => typeof v === 'number' && v > 0);
                                      if (nums.length > 0) displayCutoff = Math.min(...nums);
                                    }
                                  }

                                  return (
                                    <span className="text-slate-600 font-extrabold text-xs whitespace-nowrap">
                                      Closing Cutoff:{' '}
                                      <b className="text-slate-900 font-mono text-sm ml-1">{fmtInt(displayCutoff)}</b>
                                    </span>
                                  );
                                })()}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInfoModalCollege(c);
                                  }}
                                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 shadow-xs shrink-0"
                                  title="View Cutoffs & Details (i)"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Fixed Bottom Footer Bar */}
                  <div className="shrink-0 pt-3 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white z-10 sticky bottom-0">
                    <button
                      style={{display:"none"}}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl text-black-700 font-extrabold text-xs border border-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Handshake className="w-4 h-4" />
                      <span>get personalised counselling information</span>
                    </button>

                    <button
                      type="button"
                      disabled={selectedCollegesForCounselling.length === 0}
                      onClick={() => {
                        if (selectedCollegesForCounselling.length === 0) return;
                        if (typeof window !== 'undefined') {
                          localStorage.setItem(
                            'selectedColleges',
                            JSON.stringify(selectedCollegesForCounselling)
                          );
                        }
                        router.push('/college-counselling');
                      }}
                      className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                        selectedCollegesForCounselling.length === 0
                          ? 'bg-gradient-to-r from-[#E2E8F0] to-[#E2E8F0] text-white shadow-md cursor-not-allowed shadow-none disable'
                          : 'bg-gradient-to-r section-dark-btn text-white shadow-md active:scale-98 cursor-pointer'
                      }`}
                    >
                      <span>
                        {selectedCollegesForCounselling.length === 0
                          ? 'Select Colleges to Proceed'
                          : `${selectedCollegesForCounselling.length} College Counselling`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Predict Lead Capture Modal */}
      {isPredictLeadModalOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain">
            <div className="relative w-full max-w-md bg-[#090d16] text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
              <button
                type="button"
                onClick={() => setIsPredictLeadModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Unlock College Prediction
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Get your favourite college counselling info
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                  Enter your contact info to view matching medical colleges &amp; cutoffs.
                </p>
              </div>

              {/* <form onSubmit={handlePredictLeadSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={predictLeadName}
                    onChange={(e) => setPredictLeadName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={predictLeadEmail}
                    onChange={(e) => setPredictLeadEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    WhatsApp / Phone Number <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={predictLeadMobile}
                    onChange={(e) => setPredictLeadMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Which state you belong to? <span className="text-amber-500">*</span>
                  </label>
                  <select
                    value={predictLeadHomeState}
                    onChange={(e) => setPredictLeadHomeState(e.target.value)}
                    className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st.code} value={st.name} className="bg-[#0b0f19] text-white">
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Do you have any preferred college?
                  </label>
                  <MultiSelect
                    options={ALL_COLLEGE_OPTIONS}
                    selectedValues={predictPreferredColleges}
                    onChange={setPredictPreferredColleges}
                    placeholder="Search & select preferred colleges..."
                  />
                </div>

                {predictLeadError && (
                  <p className="text-xs text-rose-400 font-bold break-words">{predictLeadError}</p>
                )}

                <button
                  type="submit"
                  disabled={predictLeadLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {predictLeadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving &amp; Matching...
                    </>
                  ) : (
                    <>
                      Submit &amp; View Eligible Colleges <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form> */}
              <form onSubmit={handlePredictLeadSubmit} className="space-y-4 text-left">
                {/* Row 1: Full Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={predictLeadName}
                      onChange={(e) => setPredictLeadName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={predictLeadEmail}
                      onChange={(e) => setPredictLeadEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Phone + Home State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      WhatsApp / Phone <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={predictLeadMobile}
                      onChange={(e) => setPredictLeadMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Which state you belong to? <span className="text-amber-500">*</span>
                    </label>
                    <select
                      value={predictLeadHomeState}
                      onChange={(e) => setPredictLeadHomeState(e.target.value)}
                      className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st.code} value={st.name} className="bg-[#0b0f19] text-white">
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Preferred College — full width */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Do you have any preferred college?
                  </label>
                  <MultiSelect
                    options={ALL_COLLEGE_OPTIONS}
                    selectedValues={predictPreferredColleges}
                    onChange={setPredictPreferredColleges}
                    placeholder="Search & select preferred colleges..."
                  />
                </div>

                {predictLeadError && (
                  <p className="text-xs text-rose-400 font-bold break-words">{predictLeadError}</p>
                )}

                <button
                  type="submit"
                  disabled={predictLeadLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {predictLeadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving &amp; Matching...
                    </>
                  ) : (
                    <>
                      Submit &amp; View Eligible Colleges <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Modals rendered via portal into document.body so they aren't
          trapped by this section's overflow-hidden/transform. */}
      {mounted && infoModalMarkup && createPortal(infoModalMarkup, document.body)}
      <CounsellingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}