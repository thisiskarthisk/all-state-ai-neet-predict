// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { Download, CheckCircle2, ChevronDown, GraduationCap, Stethoscope, Building2, MapPin, Award, Plus, Layers } from 'lucide-react';
// import Header from '../section/header';
// import Footer from '../section/footer';
// import MedicalPulseLoader from '@/components/MedicalPulseLoader';
// import MASTER_UG_COLLEGE_LIST from '@/lib/data/allstate/UgMasterCollegeList.json';

// export interface Criterion {
//   key: string;
//   label: string;
//   better: 'lower' | 'higher' | null;
// }

// const CRITERIA: Criterion[] = [
//   { key: 'fees', label: 'Total Fees', better: 'lower' },
//   { key: 'seats', label: 'Total Seats', better: 'higher' },
//   { key: 'cutoff', label: 'Category Cutoff (AIR)', better: 'lower' },
//   { key: 'address', label: 'College Address', better: null },
//   { key: 'hostel', label: 'Hostel & Mess', better: null },
//   { key: 'accreditation', label: 'Accreditation', better: null },
// ];

// const MAX_COLLEGES = 3;

// // Helper to normalize raw college types (Govt = Government, Society, Trust; Pvt = Private; Deemed)
// const normalizeCollegeType = (typeRaw: any): string => {
//   if (!typeRaw) return 'Govt';
//   const t = String(typeRaw).toLowerCase();
//   if (t.includes('deem')) return 'Deemed';
//   if (t.includes('pvt') || t.includes('private') || t.includes('priv') || t.includes('vate')) return 'Private';
//   if (t.includes('govt') || t.includes('govern') || t.includes('society') || t.includes('trust')) return 'Govt';
//   return 'Govt';
// };

// export default function CollegeComparisonPage() {
//   const router = useRouter();
//   const [isFaqOpen, setIsFaqOpen] = useState(false);

//   // Exam Type State: UG (MBBS) or PG (MD/MS)
//   const [examType, setExamType] = useState<'UG' | 'PG'>('UG');

//   // PG Degree Filter: ALL, MD, MS
//   const [selectedCourseType, setSelectedCourseType] = useState<'ALL' | 'MD' | 'MS'>('ALL');

//   // College Selection & Form States
//   const [selectedRawColleges, setSelectedRawColleges] = useState<any[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>('Gen');
//   const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
//   const [pgSpecialtiesList, setPgSpecialtiesList] = useState<string[]>([]);
//   const [checkedCriteria, setCheckedCriteria] = useState<Set<string>>(
//     new Set(['fees', 'seats', 'cutoff', 'address'])
//   );
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [totalMatchingCount, setTotalMatchingCount] = useState<number>(0);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // View Mode: 'list' (shows Matching Colleges (XX)) or 'compare' (shows side-by-side comparison table)
//   const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');

//   // Comparison Results & AI Loading States
//   const [comparedColleges, setComparedColleges] = useState<any[]>([]);
//   const [isComparing, setIsComparing] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [isPdfGenerating, setIsPdfGenerating] = useState(false);
//   const [waFineprint, setWaFineprint] = useState('');

//   // Tracks which long-text cells are expanded
//   const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

//   const pickerRef = useRef<HTMLDivElement>(null);
//   const resultsRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on click outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Fetch PG specialties list whenever examType or selectedCourseType changes
//   useEffect(() => {
//     if (examType === 'PG') {
//       fetch(`/api/college-list?exam=PG&action=specialties&course=${selectedCourseType}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success && Array.isArray(data.specialties)) {
//             setPgSpecialtiesList(data.specialties);
//           }
//         })
//         .catch((err) => console.error('Failed to load PG specialties:', err));
//     }
//   }, [examType, selectedCourseType]);

//   // Fetch colleges list & matching count whenever filters change
//   useEffect(() => {
//     if (examType === 'UG') {
//       const masterUg = Array.isArray(MASTER_UG_COLLEGE_LIST) ? MASTER_UG_COLLEGE_LIST : [];
//       const q = searchQuery.trim().toLowerCase();
//       if (!q) {
//         setSearchResults(masterUg);
//         setTotalMatchingCount(masterUg.length);
//       } else {
//         const filtered = masterUg.filter((c: any) => {
//           const name = (c['College Name'] || c.name || '').toLowerCase();
//           const city = (c['City'] || c.city || '').toLowerCase();
//           const state = (c['State'] || c.state || '').toLowerCase();
//           const id = (c['ID'] || c.id || '').toLowerCase();
//           const type = normalizeCollegeType(c['Type'] || c.type).toLowerCase();
//           return name.includes(q) || city.includes(q) || state.includes(q) || id.includes(q) || type.includes(q);
//         });
//         setSearchResults(filtered);
//         setTotalMatchingCount(filtered.length);
//       }
//     } else {
//       // PG Mode: Fetch via API route
//       const params = new URLSearchParams();
//       params.set('exam', 'PG');
//       params.set('course', selectedCourseType);
//       params.set('specialty', selectedSpecialty);
//       if (searchQuery.trim()) params.set('q', searchQuery.trim());

//       fetch(`/api/college-list?${params.toString()}`)
//         .then((res) => res.json())
//         .then((resData) => {
//           if (resData.success && Array.isArray(resData.data)) {
//             setSearchResults(resData.data);
//             setTotalMatchingCount(resData.data.length);
//           }
//         })
//         .catch((err) => console.error('Failed to search PG colleges:', err));
//     }
//   }, [examType, searchQuery, selectedCourseType, selectedSpecialty]);

//   // Filter out already selected colleges from dropdown list
//   const filteredColleges = searchResults.filter((c: any) => {
//     const cName = c['College Name'] || c.name || '';
//     const cCourse = c['Course Name'] || '';
//     const uniqueKey = examType === 'PG' ? `${cName}-${cCourse}` : cName;

//     return !selectedRawColleges.some((s: any) => {
//       const sName = s['College Name'] || s.name || '';
//       const sCourse = s['Course Name'] || '';
//       const sKey = examType === 'PG' ? `${sName}-${sCourse}` : sName;
//       return sKey === uniqueKey;
//     });
//   });

//   // When switching exam types, reset selections
//   const handleExamTypeChange = (type: 'UG' | 'PG') => {
//     if (type !== examType) {
//       setExamType(type);
//       setSelectedRawColleges([]);
//       setSelectedCourseType('ALL');
//       setSelectedSpecialty('ALL');
//       setSearchQuery('');
//       setShowResults(false);
//       setViewMode('list');
//       setComparedColleges([]);
//       setFormError('');
//     }
//   };

//   const handleSelectCollege = (college: any) => {
//     if (selectedRawColleges.length < MAX_COLLEGES) {
//       setSelectedRawColleges([...selectedRawColleges, college]);
//       setSearchQuery('');
//       setIsDropdownOpen(false);
//       setFormError('');
//     }
//   };

//   const handleRemoveCollege = (index: number) => {
//     const updated = [...selectedRawColleges];
//     updated.splice(index, 1);
//     setSelectedRawColleges(updated);
//     if (updated.length < 2) {
//       setShowResults(false);
//       setViewMode('list');
//     }
//   };

//   const handleToggleCriterion = (key: string) => {
//     const updated = new Set(checkedCriteria);
//     if (updated.has(key)) {
//       updated.delete(key);
//     } else {
//       updated.add(key);
//     }
//     setCheckedCriteria(updated);
//     setFormError('');
//   };

//   const toggleCellExpanded = (cellKey: string) => {
//     const updated = new Set(expandedCells);
//     if (updated.has(cellKey)) {
//       updated.delete(cellKey);
//     } else {
//       updated.add(cellKey);
//     }
//     setExpandedCells(updated);
//   };

//   const isCompareDisabled = selectedRawColleges.length < 2 || checkedCriteria.size < 1;
//   const LONG_TEXT_KEYS = new Set(['hostel', 'accreditation', 'address']);

//   // Trigger Perplexity AI Comparison request with selected category & exam type
//   const handleCompareNow = async () => {
//     if (isCompareDisabled) {
//       setFormError('Please select at least 2 colleges and 1 criterion to compare.');
//       return;
//     }

//     setFormError('');
//     setIsComparing(true);
//     setShowResults(false);
//     setViewMode('compare');
//     setExpandedCells(new Set());

//     // Smooth auto scroll directly to results target container on mobile & desktop
//     setTimeout(() => {
//       if (resultsRef.current) {
//         resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 50);

//     try {
//       const response = await fetch('/api/ai-compare-colleges', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           colleges: selectedRawColleges,
//           category: selectedCategory,
//           examType: examType,
//         }),
//       });

//       const resData = await response.json();

//       if (response.ok && resData.success && Array.isArray(resData.colleges)) {
//         setComparedColleges(resData.colleges);
//         setShowResults(true);
//       } else {
//         setFormError(resData.error || 'Failed to fetch AI comparison data. Please try again.');
//       }
//     } catch (err: any) {
//       console.error('Error fetching college comparison:', err);
//       setFormError('Network or server error while generating comparison.');
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   // Helper to determine best index for a criterion
//   const getBestIndex = (criterion: Criterion): number => {
//     if (!criterion.better || comparedColleges.length === 0) return -1;
//     let bestIdx = 0;
//     for (let i = 1; i < comparedColleges.length; i++) {
//       const currentVal = Number(comparedColleges[i][criterion.key]) || 0;
//       const bestVal = Number(comparedColleges[bestIdx][criterion.key]) || 0;

//       if (criterion.better === 'lower' && currentVal < bestVal) {
//         bestIdx = i;
//       } else if (criterion.better === 'higher' && currentVal > bestVal) {
//         bestIdx = i;
//       }
//     }
//     return bestIdx;
//   };

//   const categoryDisplayLabel = selectedCategory === 'Gen' ? 'General' : selectedCategory;

//   const getDisplayValue = (college: any, criterion: Criterion): string => {
//     if (criterion.key === 'fees') return college.feesLabel || `₹${(college.fees || 0).toLocaleString('en-IN')}`;
//     if (criterion.key === 'seats') return college.seatsLabel || `${college.seats || (examType === 'PG' ? 3 : 150)} seats`;
//     if (criterion.key === 'cutoff') return college.cutoffLabel || `AIR ${(college.cutoff || 0).toLocaleString('en-IN')} (${categoryDisplayLabel})`;
//     if (criterion.key === 'address') return college.address || 'Location Details Available';
//     if (criterion.key === 'hostel') return college.hostelLabel || college.hostel || 'Available';
//     if (criterion.key === 'accreditation') return college.accreditation || 'Recognized Medical Institution';
//     return String(college[criterion.key] || 'N/A');
//   };

//   // Helper to get category rank string from item
//   const getCategoryRankDisplay = (college: any) => {
//     const r1Key = `Round 1 ${selectedCategory}`;
//     const r2Key = `Round 2 ${selectedCategory}`;
//     const r3Key = `Round 3 ${selectedCategory}`;
//     const strayKey = `Stray ${selectedCategory}`;

//     if (college[r1Key]) return `AIR ${Number(college[r1Key]).toLocaleString('en-IN')}`;
//     if (college[r2Key]) return `AIR ${Number(college[r2Key]).toLocaleString('en-IN')}`;
//     if (college[r3Key]) return `AIR ${Number(college[r3Key]).toLocaleString('en-IN')}`;
//     if (college[strayKey]) return `AIR ${Number(college[strayKey]).toLocaleString('en-IN')}`;
//     if (college['Overall Rank Range (All Rounds)']) return `AIR ${college['Overall Rank Range (All Rounds)']}`;
//     if (college['Overall Rank Range']) return `AIR ${college['Overall Rank Range']}`;
//     if (college['Round 1 Gen']) return `AIR ${Number(college['Round 1 Gen']).toLocaleString('en-IN')}`;
//     return 'AIR Cutoff Available';
//   };

//   // Generate and Download PDF directly
//   const handleDownloadPdf = async () => {
//     setIsPdfGenerating(true);
//     setWaFineprint('Generating PDF...');

//     try {
//       const html2pdf = (await import('html2pdf.js')).default;
//       const activeCriteriaList = CRITERIA.filter((c) => checkedCriteria.has(c.key));

//       const pdfContainer = document.createElement('div');
//       pdfContainer.style.padding = '24px';
//       pdfContainer.style.fontFamily = 'Arial, sans-serif';
//       pdfContainer.style.color = '#0a0e1a';
//       pdfContainer.style.backgroundColor = '#ffffff';

//       let collegeHeaderCols = comparedColleges
//         .map(
//           (c) =>
//             `<th style="padding: 10px 12px; background: #0a0e1a; color: #ffffff; text-align: left; font-size: 13px;">${c.name}</th>`
//         )
//         .join('');

//       let rowsHtml = activeCriteriaList
//         .map((crit) => {
//           const bestIdx = getBestIndex(crit);
//           const cols = comparedColleges
//             .map((c, i) => {
//               const val = getDisplayValue(c, crit);
//               const isBest = i === bestIdx;
//               return `<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; ${
//                 isBest ? 'font-weight: bold; background-color: #f0fdf4;' : ''
//               }">${val} ${isBest ? '<span style="color: #0f8f7e; font-size: 10px; font-weight: bold;">(Best)</span>' : ''}</td>`;
//             })
//             .join('');
//           return `<tr><td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #5b6478; font-size: 12px;">${crit.label}</td>${cols}</tr>`;
//         })
//         .join('');

//       pdfContainer.innerHTML = `
//         <div style="margin-bottom: 20px; border-bottom: 2px solid #4d9bf5; padding-bottom: 12px;">
//           <h2 style="margin: 0 0 6px 0; color: #0a0e1a; font-size: 20px;">NEET ${examType} Medical College Comparison Report (${categoryDisplayLabel})</h2>
//           <p style="margin: 0; color: #5b6478; font-size: 12px;">Generated by Campus Continents — ${new Date().toLocaleDateString('en-IN')}</p>
//         </div>
//         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
//           <thead>
//             <tr>
//               <th style="padding: 10px 12px; background: #0a0e1a; color: #ffffff; text-align: left; font-size: 13px;">Criterion</th>
//               ${collegeHeaderCols}
//             </tr>
//           </thead>
//           <tbody>
//             ${rowsHtml}
//           </tbody>
//         </table>
//         <div style="margin-top: 30px; font-size: 11px; color: #8992a3; text-align: center;">
//           Campus Continents — Medical College Predictor & Counselling Portal
//         </div>
//       `;

//       const worker = html2pdf().from(pdfContainer).set({
//         margin: 8,
//         filename: `NEET-${examType}-College-Comparison-${categoryDisplayLabel}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, logging: false },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//       });

//       const pdfBlob = await worker.outputPdf('blob');
//       const fileName = `NEET-${examType}-College-Comparison-${categoryDisplayLabel}.pdf`;

//       const downloadUrl = window.URL.createObjectURL(pdfBlob);
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1500);

//       setWaFineprint('PDF downloaded successfully!');
//     } catch (err: any) {
//       console.error('PDF error:', err);
//       setWaFineprint('Something went wrong generating the PDF. Please try again.');
//     } finally {
//       setIsPdfGenerating(false);
//     }
//   };

//   const activeCriteriaList = CRITERIA.filter((c) => checkedCriteria.has(c.key));

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-sky-500 selection:text-white">
//       {/* HEADER */}
//       <Header
//         isHomePage={false}
//         isFaqPage={false}
//         isFaqOpen={isFaqOpen}
//         setIsFaqOpen={setIsFaqOpen}
//         onGetCounsellingClick={() => router.push('/#why')}
//       />

//       {/* MAIN CONTENT */}
//       <main className="flex-grow">
//         <section className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-8 lg:py-12 px-4 sm:px-6 overflow-hidden section-dark">
//           {/* Centered hero heading */}
//           <div className="w-full max-w-6xl mx-auto text-center mb-8 sm:mb-10">
//             <h2 className="hero-title-cc font-extrabold text-white tracking-tight leading-tight whitespace-nowrap">
//               Compare{' '}
//               <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">
//                 {examType === 'UG' ? 'MBBS Colleges' : 'NEET PG (MD/MS)'}
//               </span>{' '}
//               Side by Side
//             </h2>
//             <p className="hero-subtitle-cc text-white mt-2">
//               Compare fees, cutoffs, seats, specialties, facilities, and more to find the right medical college for your admission.
//             </p>
//           </div>

//           {/* Grid Layout */}
//           <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

//             {/* LEFT FORM CARD — sticky on desktop */}
//             <div className="lg:col-span-4 lg:sticky lg:top-6 lg:self-start w-full">
//               <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col">
                
//                 {/* Exam Level Segmented Toggle Control (UG vs PG) */}
//                 <div className="mb-6 bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/80">
//                   <button
//                     type="button"
//                     onClick={() => handleExamTypeChange('UG')}
//                     className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
//                       examType === 'UG'
//                         ? 'bg-white text-slate-900 shadow-md border border-slate-200/50'
//                         : 'text-slate-500 hover:text-slate-900'
//                     }`}
//                   >
//                     <GraduationCap className="w-4 h-4 text-[#0095ff]" />
//                     <span>NEET UG (MBBS)</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleExamTypeChange('PG')}
//                     className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
//                       examType === 'PG'
//                         ? 'bg-white text-slate-900 shadow-md border border-slate-200/50'
//                         : 'text-slate-500 hover:text-slate-900'
//                     }`}
//                   >
//                     <Stethoscope className="w-4 h-4 text-[#00e5bf]" />
//                     <span>NEET PG (MD/MS)</span>
//                   </button>
//                 </div>

//                 <div className="mb-5">
//                   <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0095ff] text-xs font-extrabold uppercase tracking-wider mb-2">
//                     {examType === 'UG' ? 'NEET UG Selection' : 'NEET PG Speciality Selection'}
//                   </span>
//                   <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
//                     Select {examType === 'UG' ? 'Colleges' : 'PG Courses'} to Compare
//                   </h2>
//                   <p className="text-xs text-slate-500 mt-1 font-medium">
//                     Pick 2 or 3 {examType === 'UG' ? 'MBBS colleges' : 'MD/MS specialty courses'} from master database
//                   </p>
//                 </div>

//                 {/* PG Course & Specialty Selectors (Visible ONLY for NEET PG) */}
//                 {examType === 'PG' && (
//                   <div className="mb-5 space-y-3">
//                     {/* Course Filter: MD vs MS */}
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
//                         Degree Course (MD / MS)
//                       </label>
//                       <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setSelectedCourseType('ALL');
//                             setSelectedSpecialty('ALL');
//                           }}
//                           className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
//                             selectedCourseType === 'ALL'
//                               ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
//                               : 'text-slate-500 hover:text-slate-900'
//                           }`}
//                         >
//                           All
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setSelectedCourseType('MD');
//                             setSelectedSpecialty('ALL');
//                           }}
//                           className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
//                             selectedCourseType === 'MD'
//                               ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
//                               : 'text-slate-500 hover:text-slate-900'
//                           }`}
//                         >
//                           MD
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setSelectedCourseType('MS');
//                             setSelectedSpecialty('ALL');
//                           }}
//                           className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
//                             selectedCourseType === 'MS'
//                               ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
//                               : 'text-slate-500 hover:text-slate-900'
//                           }`}
//                         >
//                           MS
//                         </button>
//                       </div>
//                     </div>

//                     {/* Specialities Dropdown */}
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
//                         Filter Specialities
//                       </label>
//                       <select
//                         value={selectedSpecialty}
//                         onChange={(e) => {
//                           setSelectedSpecialty(e.target.value);
//                           setSearchQuery('');
//                         }}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0095ff] focus:ring-2 focus:ring-[#0095ff]/20 transition-all cursor-pointer"
//                       >
//                         <option value="ALL">All Specialities ({selectedCourseType === 'ALL' ? 'MD & MS' : selectedCourseType})</option>
//                         {pgSpecialtiesList.map((spec) => (
//                           <option key={spec} value={spec}>
//                             {spec}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 )}

//                 {/* Search & Autocomplete Input */}
//                 <div className="mb-5" ref={pickerRef}>
//                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
//                     Search {examType === 'UG' ? 'Medical Colleges' : 'PG Colleges & Courses'}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0095ff] focus:ring-2 focus:ring-[#0095ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                       placeholder={
//                         selectedRawColleges.length >= MAX_COLLEGES
//                           ? 'Maximum 3 colleges selected'
//                           : examType === 'UG'
//                           ? 'Search name, city, or state...'
//                           : 'Search college or course (e.g. Anaesthesiology, OBG)...'
//                       }
//                       autoComplete="off"
//                       disabled={selectedRawColleges.length >= MAX_COLLEGES}
//                       value={searchQuery}
//                       onFocus={() => setIsDropdownOpen(true)}
//                       onChange={(e) => {
//                         setSearchQuery(e.target.value);
//                         setIsDropdownOpen(true);
//                       }}
//                     />

//                     {/* Dropdown Overlay */}
//                     {isDropdownOpen && selectedRawColleges.length < MAX_COLLEGES && (
//                       <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100">
//                         {filteredColleges.length === 0 ? (
//                           <div className="p-4 text-xs font-semibold text-slate-400 text-center">No matching colleges found</div>
//                         ) : (
//                           filteredColleges.slice(0, 35).map((college: any, idx: number) => (
//                             <div
//                               key={`${college['College Name']}-${college['Course Name'] || idx}`}
//                               className="p-3 text-sm cursor-pointer hover:bg-sky-50 transition-colors flex items-center justify-between gap-3"
//                               onClick={() => handleSelectCollege(college)}
//                             >
//                               <div className="flex flex-col min-w-0">
//                                 <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">
//                                   {college['College Name'] || college.name}
//                                 </span>
//                                 {examType === 'PG' && college['Course Name'] && (
//                                   <span className="text-[11px] font-extrabold text-[#0095ff] truncate">
//                                     {college['Course Name']}
//                                   </span>
//                                 )}
//                                 <span className="text-[11px] text-slate-400 font-medium truncate">
//                                   {normalizeCollegeType(college.Type || college.collegeType)} • {college.State || 'India'}
//                                 </span>
//                               </div>
//                               <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full shrink-0">
//                                 {college['2026 Total Seats'] ? `${college['2026 Total Seats']} Seats` : 'PG Seat'}
//                               </span>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Selected Chips */}
//                   <div className="mt-3 max-h-28 overflow-y-auto pr-1 space-y-2">
//                     {selectedRawColleges.map((college: any, idx: number) => (
//                       <div
//                         key={`${college['College Name']}-${college['Course Name'] || idx}`}
//                         className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-slate-800 text-xs font-bold pl-3 pr-2 py-2 rounded-xl"
//                       >
//                         <div className="flex flex-col min-w-0">
//                           <span className="truncate">{college['College Name'] || college.name}</span>
//                           {examType === 'PG' && college['Course Name'] && (
//                             <span className="text-[10px] text-emerald-700 font-bold truncate">
//                               {college['Course Name']}
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveCollege(idx)}
//                           className="w-5 h-5 shrink-0 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center text-xs transition-colors"
//                           aria-label={`Remove ${college['College Name'] || college.name}`}
//                         >
//                           &times;
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   {selectedRawColleges.length === 0 && (
//                     <p className="text-xs text-slate-400 font-medium italic mt-2">
//                       No {examType === 'UG' ? 'colleges' : 'PG courses'} selected yet. Start typing above to pick.
//                     </p>
//                   )}
//                 </div>

//                 {/* Category Selection Dropdown */}
//                 <div className="mb-6">
//                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
//                     Select Category (For Cutoff AIR)
//                   </label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0095ff] focus:ring-2 focus:ring-[#0095ff]/20 transition-all cursor-pointer"
//                   >
//                     <option value="Gen">General (Gen)</option>
//                     <option value="OBC-NCL">OBC-NCL</option>
//                     <option value="SC">Scheduled Caste (SC)</option>
//                     <option value="ST">Scheduled Tribe (ST)</option>
//                     <option value="EWS">Economically Weaker Section (EWS)</option>
//                   </select>
//                 </div>

//                 {/* Criteria Checkboxes */}
//                 <div className="mb-6">
//                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
//                     What matters most to you?
//                   </label>
//                   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
//                     {CRITERIA.map((criterion) => {
//                       const isChecked = checkedCriteria.has(criterion.key);
//                       return (
//                         <label
//                           key={criterion.key}
//                           className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
//                             isChecked
//                               ? 'bg-sky-50/80 border-[#0095ff] text-slate-900 shadow-sm'
//                               : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 rounded border-slate-300 text-[#0095ff] focus:ring-[#0095ff] shrink-0"
//                             checked={isChecked}
//                             onChange={() => handleToggleCriterion(criterion.key)}
//                           />
//                           <span>{criterion.label}</span>
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Compare Button */}
//                 <button
//                   type="button"
//                   className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] hover:from-[#0080ff] hover:to-[#00d094] text-black font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                   disabled={isCompareDisabled || isComparing}
//                   onClick={handleCompareNow}
//                 >
//                   {isComparing ? `Processing ${examType} Comparison...` : `Compare ${examType} Colleges Now`}
//                 </button>

//                 {formError && (
//                   <p className="text-xs text-rose-500 font-bold mt-3 text-center">{formError}</p>
//                 )}
//               </div>
//             </div>

//             {/* RIGHT RESULTS PANEL */}
//             <div className="lg:col-span-8 w-full h-full flex flex-col justify-center" ref={resultsRef}>

//               {/* View Toggle Tabs if comparison is active */}
//               {showResults && !isComparing && (
//                 <div className="flex items-center justify-between mb-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setViewMode('list')}
//                       className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
//                         viewMode === 'list'
//                           ? 'bg-white text-slate-900 shadow-md'
//                           : 'text-slate-300 hover:text-white'
//                       }`}
//                     >
//                       <Layers className="w-4 h-4 text-[#0095ff]" />
//                       <span>Matching Colleges ({totalMatchingCount})</span>
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setViewMode('compare')}
//                       className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
//                         viewMode === 'compare'
//                           ? 'bg-white text-slate-900 shadow-md'
//                           : 'text-slate-300 hover:text-white'
//                       }`}
//                     >
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                       <span>Side-by-Side Table</span>
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* AI Loading State */}
//               {isComparing && (
//                 <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-xl flex-1 min-h-[420px] flex items-center justify-center">
//                   <MedicalPulseLoader
//                     title={`NEET ${examType} College Comparison Processing...`}
//                     subtitle={`Analyzing ${examType} cutoffs for ${categoryDisplayLabel} Category, fees matrix, total seats, location address, and accreditation...`}
//                   />
//                 </div>
//               )}

//               {/* MODE 1: MATCHING COLLEGES CARD LIST (Displaying Matching Colleges (Count)) */}
//               {!isComparing && (viewMode === 'list' || !showResults) && (
//                 <div className="bg-white border border-slate-200/80 rounded-[32px] p-5 sm:p-7 shadow-xl animate-in fade-in duration-300">
//                   {/* Header Badge with Dynamic Count */}
//                   <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 flex-wrap gap-2">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0095ff] text-xs font-extrabold">
//                           <Building2 className="w-3.5 h-3.5" />
//                           <span>Matching Colleges ({totalMatchingCount})</span>
//                         </span>
//                         <span className="text-xs font-bold text-slate-500">
//                           {examType === 'UG' ? 'NEET UG MBBS' : `NEET PG (${selectedCourseType === 'ALL' ? 'MD & MS' : selectedCourseType})`}
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-400 font-medium mt-1">
//                         Showing filtered college list for <strong>{categoryDisplayLabel}</strong> category {selectedSpecialty !== 'ALL' ? `• Specialty: ${selectedSpecialty}` : ''}
//                       </p>
//                     </div>

//                     {selectedRawColleges.length >= 2 && (
//                       <button
//                         type="button"
//                         onClick={() => setViewMode('compare')}
//                         className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0095ff] to-[#00e5bf] text-black font-extrabold text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5"
//                       >
//                         <span>View Side-by-Side</span>
//                         <ChevronDown className="w-4 h-4 -rotate-90" />
//                       </button>
//                     )}
//                   </div>

//                   {/* Matching Colleges List Grid */}
//                   <div className="max-h-[540px] overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
//                     {filteredColleges.length === 0 ? (
//                       <div className="p-10 text-center flex flex-col items-center justify-center">
//                         <Building2 className="w-12 h-12 text-slate-300 mb-3" />
//                         <h4 className="text-base font-extrabold text-slate-800">No matching colleges found</h4>
//                         <p className="text-xs text-slate-400 mt-1 max-w-sm">
//                           Try adjusting your specialty or search query to view more colleges.
//                         </p>
//                       </div>
//                     ) : (
//                       filteredColleges.map((college: any, idx: number) => {
//                         const name = college['College Name'] || college.name || 'Medical College';
//                         const courseName = college['Course Name'] || (examType === 'PG' ? 'MD / MS' : 'MBBS');
//                         const state = college.State || college.city || 'India';
//                         const typeNormalized = normalizeCollegeType(college.Type || college.collegeType);
//                         const seats = college['2026 Total Seats'] || college.seats || (examType === 'PG' ? 3 : 150);
//                         const rankDisplay = getCategoryRankDisplay(college);
//                         const isSelected = selectedRawColleges.some(
//                           (s: any) => (s['College Name'] || s.name) === name && (examType === 'UG' || s['Course Name'] === courseName)
//                         );

//                         return (
//                           <div
//                             key={`${name}-${courseName}-${idx}`}
//                             className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
//                               isSelected
//                                 ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
//                                 : 'bg-slate-50/50 border-slate-200/80 hover:bg-sky-50/50 hover:border-sky-200'
//                             }`}
//                           >
//                             <div className="flex flex-col min-w-0">
//                               <div className="flex items-center gap-2 flex-wrap mb-1">
//                                 <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
//                                   {name}
//                                 </span>
//                                 <span className="text-[10px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full shrink-0">
//                                   {typeNormalized}
//                                 </span>
//                               </div>

//                               {examType === 'PG' && (
//                                 <span className="text-xs font-extrabold text-[#0095ff] mb-1">
//                                   Course: {courseName}
//                                 </span>
//                               )}

//                               <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
//                                 <span className="flex items-center gap-1">
//                                   <MapPin className="w-3.5 h-3.5 text-slate-400" />
//                                   {state}
//                                 </span>
//                                 <span>•</span>
//                                 <span className="flex items-center gap-1">
//                                   <Award className="w-3.5 h-3.5 text-slate-400" />
//                                   {seats} Total Seats
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Rank Cutoff Badge & Select Button */}
//                             <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
//                               <div className="text-left sm:text-right">
//                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
//                                   {categoryDisplayLabel} Cutoff
//                                 </span>
//                                 <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full inline-block mt-0.5">
//                                   {rankDisplay}
//                                 </span>
//                               </div>

//                               <button
//                                 type="button"
//                                 disabled={selectedRawColleges.length >= MAX_COLLEGES || isSelected}
//                                 onClick={() => handleSelectCollege(college)}
//                                 className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
//                                   isSelected
//                                     ? 'bg-emerald-600 text-white cursor-default'
//                                     : 'bg-gradient-to-r from-[#0095ff] to-[#00e5bf] text-black hover:opacity-95 shadow-sm active:scale-95 disabled:opacity-40'
//                                 }`}
//                               >
//                                 {isSelected ? (
//                                   <>
//                                     <CheckCircle2 className="w-3.5 h-3.5" />
//                                     <span>Selected</span>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Plus className="w-3.5 h-3.5" />
//                                     <span>Select</span>
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* MODE 2: SIDE-BY-SIDE COMPARISON TABLE */}
//               {!isComparing && viewMode === 'compare' && showResults && comparedColleges.length >= 2 && (
//                 <div className="bg-white border border-slate-200/80 rounded-[32px] p-5 sm:p-8 shadow-xl animate-in fade-in duration-300">
//                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-2">
//                     <div>
//                       <h3 className="text-xl font-extrabold text-slate-900">
//                         NEET {examType} Side-by-Side Comparison <span className="text-[#0095ff] font-bold">({categoryDisplayLabel})</span>
//                       </h3>
//                       <p className="text-xs text-slate-400 font-medium">Best value on each row is highlighted in green</p>
//                     </div>
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
//                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
//                       <span>Comparison Ready</span>
//                     </span>
//                   </div>

//                   <div className="border border-slate-200 rounded-2xl overflow-hidden">
//                     <div className="overflow-auto max-h-[440px] sm:max-h-[520px]">
//                       <table className="w-full border-collapse text-xs sm:text-sm">
//                         <thead>
//                           <tr>
//                             <th
//                               className="sticky top-0 left-0 z-30 bg-slate-100 text-left align-bottom px-3 sm:px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wide text-[10px] sm:text-[11px] border-r border-b border-slate-200 w-28 sm:w-36 shrink-0"
//                             >
//                               Criterion
//                             </th>
//                             {comparedColleges.map((college: any) => (
//                               <th
//                                 key={college.name}
//                                 className="sticky top-0 z-20 bg-[#0a0e1a] text-white text-left align-bottom px-3 sm:px-4 py-3 font-extrabold leading-snug border-b border-slate-200 min-w-[150px] sm:min-w-[190px]"
//                               >
//                                 {college.name}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {activeCriteriaList.map((crit, rowIdx) => {
//                             const bestIdx = getBestIndex(crit);
//                             return (
//                               <tr key={crit.key} className={rowIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
//                                 <td
//                                   className={`sticky left-0 z-10 px-3 sm:px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wide text-[10px] sm:text-[11px] border-r border-b border-slate-200 align-top ${
//                                     rowIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
//                                   }`}
//                                 >
//                                   {crit.label}
//                                 </td>
//                                 {comparedColleges.map((college: any, colIdx: number) => {
//                                   const isBest = colIdx === bestIdx;
//                                   const value = getDisplayValue(college, crit);
//                                   const cellKey = `${college.name}-${crit.key}`;
//                                   const isLong = LONG_TEXT_KEYS.has(crit.key) && value.length > 90;
//                                   const isExpanded = expandedCells.has(cellKey);

//                                   return (
//                                     <td
//                                       key={college.name}
//                                       className={`px-3 sm:px-4 py-3 border-b border-slate-200 align-top font-semibold text-slate-800 ${
//                                         isBest ? 'bg-emerald-50/60' : ''
//                                       }`}
//                                     >
//                                       {isBest && (
//                                         <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap mb-1">
//                                           <CheckCircle2 className="w-3 h-3 shrink-0" />
//                                           Best
//                                         </span>
//                                       )}
//                                       <p className={`leading-relaxed break-words ${isLong && !isExpanded ? 'line-clamp-2' : ''}`}>
//                                         {value}
//                                       </p>
//                                       {isLong && (
//                                         <button
//                                           type="button"
//                                           onClick={() => toggleCellExpanded(cellKey)}
//                                           className="text-[11px] font-bold text-sky-600 hover:text-sky-700 mt-1 inline-flex items-center gap-0.5"
//                                         >
//                                           {isExpanded ? 'Show less' : 'Show more'}
//                                           <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
//                                         </button>
//                                       )}
//                                     </td>
//                                   );
//                                 })}
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                   <p className="sm:hidden text-[11px] text-slate-400 font-semibold text-center mt-2">
//                     ← Swipe to see the other colleges
//                   </p>

//                   {/* Download PDF Button */}
//                   <button
//                     type="button"
//                     disabled={isPdfGenerating}
//                     onClick={handleDownloadPdf}
//                     className="w-full max-w-sm mx-auto mt-6 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0095ff] to-[#00e5bf] hover:from-[#0080ff] hover:to-[#00d094] text-black font-extrabold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
//                   >
//                     <Download className="w-4 h-4 shrink-0" />
//                     <span>{isPdfGenerating ? 'Generating PDF...' : 'Download Comparison PDF'}</span>
//                   </button>

//                   {waFineprint && (
//                     <p className="text-xs text-slate-400 font-semibold text-center mt-3">{waFineprint}</p>
//                   )}
//                 </div>
//               )}

//             </div>

//           </div>
//         </section>
//       </main>

//       <style jsx global>{`
//         .section-dark {
//           background: linear-gradient(360deg, #0f172a 0%, #111827 100%);
//         }

//         .section-dark::before {
//           content: '';
//           position: absolute;
//           top: -200px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 900px;
//           height: 500px;
//           background: radial-gradient(ellipse, rgba(37, 99, 235, 0.32), transparent 70%);
//           pointer-events: none;
//           z-index: 0;
//         }

//         .section-dark > * {
//           position: relative;
//           z-index: 1;
//         }

//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>

//       {/* FOOTER */}
//       <Footer
//         switchTab={() => router.push('/')}
//         openCounselling={() => router.push('/#why')}
//         counsellingKitURL="/assets/counselling-kit/The Counselling Atlas.pdf"
//       />
//     </div>
//   );
// }
