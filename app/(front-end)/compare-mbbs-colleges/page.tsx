'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle2, ChevronDown } from 'lucide-react';
import Header from '../section/header';
import Footer from '../section/footer';
import MedicalPulseLoader from '@/components/MedicalPulseLoader';
import MASTER_UG_COLLEGE_LIST from '@/lib/data/allstate/UgMasterCollegeList.json';

export interface Criterion {
  key: string;
  label: string;
  better: 'lower' | 'higher' | null;
}

const CRITERIA: Criterion[] = [
  { key: 'fees', label: 'Total Fees', better: 'lower' },
  { key: 'seats', label: 'Total MBBS Seats', better: 'higher' },
  { key: 'cutoff', label: 'Category Cutoff (AIR)', better: 'lower' },
  { key: 'address', label: 'College Address', better: null },
  { key: 'hostel', label: 'Hostel & Mess', better: null },
  { key: 'accreditation', label: 'Accreditation', better: null },
];

const MAX_COLLEGES = 3;

export default function CollegeComparisonPage() {
  const router = useRouter();
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // College Selection & Form States
  const [selectedRawColleges, setSelectedRawColleges] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Gen');
  const [checkedCriteria, setCheckedCriteria] = useState<Set<string>>(
    new Set(['fees', 'seats', 'cutoff', 'address'])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Comparison Results & AI Loading States
  const [comparedColleges, setComparedColleges] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formError, setFormError] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [waFineprint, setWaFineprint] = useState('');

  // Tracks which long-text cells are expanded
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

  const pickerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const masterList: any[] = Array.isArray(MASTER_UG_COLLEGE_LIST) ? MASTER_UG_COLLEGE_LIST : [];

  // Filter master JSON list by user query (All Colleges from UgMasterCollegeList.json)
  const filteredColleges = masterList
    .filter((c: any) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const name = (c['College Name'] || c.name || '').toLowerCase();
      const city = (c['City'] || c.city || '').toLowerCase();
      const state = (c['State'] || c.state || '').toLowerCase();
      const id = (c['ID'] || c.id || '').toLowerCase();
      const board = (c['Board'] || c.board || '').toLowerCase();
      const type = (c['Type'] || c.type || '').toLowerCase();
      return name.includes(q) || city.includes(q) || state.includes(q) || id.includes(q) || board.includes(q) || type.includes(q);
    })
    .filter((c: any) => !selectedRawColleges.some((s: any) => (s['College Name'] || s.name) === (c['College Name'] || c.name)));

  const handleSelectCollege = (college: any) => {
    if (selectedRawColleges.length < MAX_COLLEGES) {
      setSelectedRawColleges([...selectedRawColleges, college]);
      setSearchQuery('');
      setIsDropdownOpen(false);
      setFormError('');
    }
  };

  const handleRemoveCollege = (index: number) => {
    const updated = [...selectedRawColleges];
    updated.splice(index, 1);
    setSelectedRawColleges(updated);
    if (updated.length < 2) {
      setShowResults(false);
    }
  };

  const handleToggleCriterion = (key: string) => {
    const updated = new Set(checkedCriteria);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setCheckedCriteria(updated);
    setFormError('');
  };

  const toggleCellExpanded = (cellKey: string) => {
    const updated = new Set(expandedCells);
    if (updated.has(cellKey)) {
      updated.delete(cellKey);
    } else {
      updated.add(cellKey);
    }
    setExpandedCells(updated);
  };

  const isCompareDisabled = selectedRawColleges.length < 2 || checkedCriteria.size < 1;
  const LONG_TEXT_KEYS = new Set(['hostel', 'accreditation', 'address']);

  // Trigger Perplexity AI Comparison request with selected category
  const handleCompareNow = async () => {
    if (isCompareDisabled) {
      setFormError('Please select at least 2 colleges and 1 criterion to compare.');
      return;
    }

    setFormError('');
    setIsComparing(true);
    setShowResults(false);
    setExpandedCells(new Set());

    // Smooth auto scroll directly to results target container on mobile & desktop
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    try {
      const response = await fetch('/api/ai-compare-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colleges: selectedRawColleges,
          category: selectedCategory,
        }),
      });

      const resData = await response.json();
      // console.log("resData", resData);

      if (response.ok && resData.success && Array.isArray(resData.colleges)) {
        setComparedColleges(resData.colleges);
        setShowResults(true);
      } else {
        setFormError(resData.error || 'Failed to fetch AI comparison data. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching college comparison:', err);
      setFormError('Network or server error while generating comparison.');
    } finally {
      setIsComparing(false);
    }
  };

  // Helper to determine best index for a criterion
  const getBestIndex = (criterion: Criterion): number => {
    if (!criterion.better || comparedColleges.length === 0) return -1;
    let bestIdx = 0;
    for (let i = 1; i < comparedColleges.length; i++) {
      const currentVal = Number(comparedColleges[i][criterion.key]) || 0;
      const bestVal = Number(comparedColleges[bestIdx][criterion.key]) || 0;

      if (criterion.better === 'lower' && currentVal < bestVal) {
        bestIdx = i;
      } else if (criterion.better === 'higher' && currentVal > bestVal) {
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const categoryDisplayLabel = selectedCategory === 'Gen' ? 'General' : selectedCategory;

  const getDisplayValue = (college: any, criterion: Criterion): string => {
    if (criterion.key === 'fees') return college.feesLabel || `₹${(college.fees || 0).toLocaleString('en-IN')}`;
    if (criterion.key === 'seats') return college.seatsLabel || `${college.seats || 150} seats`;
    if (criterion.key === 'cutoff') return college.cutoffLabel || `AIR ${(college.cutoff || 0).toLocaleString('en-IN')} (${categoryDisplayLabel})`;
    if (criterion.key === 'address') return college.address || 'Location Details Available';
    if (criterion.key === 'hostel') return college.hostelLabel || college.hostel || 'Available';
    if (criterion.key === 'accreditation') return college.accreditation || 'Recognized Medical College';
    return String(college[criterion.key] || 'N/A');
  };

  // Generate and Download PDF directly
  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    setWaFineprint('Generating PDF...');

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const activeCriteriaList = CRITERIA.filter((c) => checkedCriteria.has(c.key));

      const pdfContainer = document.createElement('div');
      pdfContainer.style.padding = '24px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      pdfContainer.style.color = '#0a0e1a';
      pdfContainer.style.backgroundColor = '#ffffff';

      let collegeHeaderCols = comparedColleges
        .map(
          (c) =>
            `<th style="padding: 10px 12px; background: #0a0e1a; color: #ffffff; text-align: left; font-size: 13px;">${c.name}</th>`
        )
        .join('');

      let rowsHtml = activeCriteriaList
        .map((crit) => {
          const bestIdx = getBestIndex(crit);
          const cols = comparedColleges
            .map((c, i) => {
              const val = getDisplayValue(c, crit);
              const isBest = i === bestIdx;
              return `<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; ${
                isBest ? 'font-weight: bold; background-color: #f0fdf4;' : ''
              }">${val} ${isBest ? '<span style="color: #0f8f7e; font-size: 10px; font-weight: bold;">(Best)</span>' : ''}</td>`;
            })
            .join('');
          return `<tr><td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #5b6478; font-size: 12px;">${crit.label}</td>${cols}</tr>`;
        })
        .join('');

      pdfContainer.innerHTML = `
        <div style="margin-bottom: 20px; border-bottom: 2px solid #4d9bf5; padding-bottom: 12px;">
          <h2 style="margin: 0 0 6px 0; color: #0a0e1a; font-size: 20px;">UG MBBS College Comparison Report (${categoryDisplayLabel})</h2>
          <p style="margin: 0; color: #5b6478; font-size: 12px;">Generated by Campus Continents — ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="padding: 10px 12px; background: #0a0e1a; color: #ffffff; text-align: left; font-size: 13px;">Criterion</th>
              ${collegeHeaderCols}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div style="margin-top: 30px; font-size: 11px; color: #8992a3; text-align: center;">
          Campus Continents — Medical College Predictor & Counselling Portal
        </div>
      `;

      const worker = html2pdf().from(pdfContainer).set({
        margin: 8,
        filename: `MBBS-College-Comparison-${categoryDisplayLabel}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      });

      const pdfBlob = await worker.outputPdf('blob');
      const fileName = `MBBS-College-Comparison-${categoryDisplayLabel}.pdf`;

      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1500);

      setWaFineprint('PDF downloaded successfully!');
    } catch (err: any) {
      console.error('PDF error:', err);
      setWaFineprint('Something went wrong generating the PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const activeCriteriaList = CRITERIA.filter((c) => checkedCriteria.has(c.key));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* HEADER */}
      <Header
        isHomePage={false}
        isFaqPage={false}
        isFaqOpen={isFaqOpen}
        setIsFaqOpen={setIsFaqOpen}
        onGetCounsellingClick={() => router.push('/#why')}
      />

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <section className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-8 lg:py-12 px-4 sm:px-6 overflow-hidden section-dark">
          {/* Centered hero heading */}
          <div className="w-full max-w-6xl mx-auto text-center mb-8 sm:mb-10">
            <h2 className="hero-title-cc font-extrabold text-white tracking-tight leading-tight whitespace-nowrap">
              Compare{" "}
              <span className="bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] bg-clip-text text-transparent">
                MBBS Colleges
              </span>{" "}
              Side by Side
            </h2>

            <p className="hero-subtitle-cc text-white">
              Compare fees, cutoffs, seats, facilities, and more to find the right MBBS college for your admission.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT FORM CARD — sticky on desktop */}
            <div className="lg:col-span-4 lg:sticky lg:top-6 lg:self-start w-full">
              <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0095ff] text-xs font-extrabold uppercase tracking-wider mb-2">
                    College Selection
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Select Colleges to Compare</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Pick 2 or 3 colleges from the master database</p>
                </div>

                {/* Search & Autocomplete Input */}
                <div className="mb-6" ref={pickerRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Search Medical Colleges
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0095ff] focus:ring-2 focus:ring-[#0095ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={
                        selectedRawColleges.length >= MAX_COLLEGES
                          ? 'Maximum 3 colleges selected'
                          : 'Search name, city, state, or ID...'
                      }
                      autoComplete="off"
                      disabled={selectedRawColleges.length >= MAX_COLLEGES}
                      value={searchQuery}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                    />

                    {/* Dropdown Overlay */}
                    {isDropdownOpen && selectedRawColleges.length < MAX_COLLEGES && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100">
                        {filteredColleges.length === 0 ? (
                          <div className="p-4 text-xs font-semibold text-slate-400 text-center">No matching colleges found</div>
                        ) : (
                          filteredColleges.map((college: any, idx: number) => (
                            <div
                              key={college['College Name'] || college.name || idx}
                              className="p-3 text-sm cursor-pointer hover:bg-sky-50 transition-colors flex items-center justify-between gap-3"
                              onClick={() => handleSelectCollege(college)}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                                  {college['College Name'] || college.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium truncate">
                                  {college.Type || 'Medical College'} • {college.Board || ''}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full shrink-0">
                                {college.City ? `${college.City}, ${college.State}` : college.State}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Chips */}
                  <div className="mt-3 max-h-28 overflow-y-auto pr-1 space-y-2">
                    {selectedRawColleges.map((college: any, idx: number) => (
                      <div
                        key={college['College Name'] || college.name || idx}
                        className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-slate-800 text-xs font-bold pl-3 pr-2 py-2 rounded-xl"
                      >
                        <span className="truncate">{college['College Name'] || college.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollege(idx)}
                          className="w-5 h-5 shrink-0 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center text-xs transition-colors"
                          aria-label={`Remove ${college['College Name'] || college.name}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedRawColleges.length === 0 && (
                    <p className="text-xs text-slate-400 font-medium italic mt-2">
                      No colleges selected yet. Start typing above to pick colleges.
                    </p>
                  )}
                </div>

                {/* Category Selection Dropdown */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Category (For Cutoff AIR)
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0095ff] focus:ring-2 focus:ring-[#0095ff]/20 transition-all cursor-pointer"
                  >
                    <option value="Gen">General (Gen)</option>
                    <option value="OBC-NCL">OBC-NCL</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                  </select>
                </div>

                {/* Criteria Checkboxes */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    What matters most to you?
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                    {CRITERIA.map((criterion) => {
                      const isChecked = checkedCriteria.has(criterion.key);
                      return (
                        <label
                          key={criterion.key}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-sky-50/80 border-[#0095ff] text-slate-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-[#0095ff] focus:ring-[#0095ff] shrink-0"
                            checked={isChecked}
                            onChange={() => handleToggleCriterion(criterion.key)}
                          />
                          <span>{criterion.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Compare Button */}
                <button
                  type="button"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0095ff] via-[#00e5bf] to-[#2dd4bf] hover:from-[#0080ff] hover:to-[#00d094] text-black font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isCompareDisabled || isComparing}
                  onClick={handleCompareNow}
                >
                  {isComparing ? 'Processing AI Comparison...' : 'Compare Now'}
                </button>

                {formError && (
                  <p className="text-xs text-rose-500 font-bold mt-3 text-center">{formError}</p>
                )}
              </div>
            </div>

            {/* RIGHT RESULTS PANEL */}
            <div className="lg:col-span-8 w-full h-full flex flex-col justify-center" ref={resultsRef}>

              {/* Initial State Card (Banner image default state) */}
              {!isComparing && !showResults && (
                <div className="w-full rounded-[32px] overflow-hidden shadow-xl border-2 border-white/15 aspect-[1717/916]">
                  <img
                    src="/assets/image/college-compare-banner.png"
                    alt="Compare colleges side by side — fees, seats, cutoffs, hostel, accreditation and more, all in one place"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* AI Loading State */}
              {isComparing && (
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-xl flex-1 min-h-[420px] flex items-center justify-center">
                  <MedicalPulseLoader
                    title="College Comparison Processing..."
                    subtitle={`Analyzing MBBS cutoffs for ${categoryDisplayLabel} Category, fees matrix, total seats, location address, and accreditation...`}
                  />
                </div>
              )}

              {/* Comparison Results Table */}
              {!isComparing && showResults && comparedColleges.length >= 2 && (
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-5 sm:p-8 shadow-xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Side-by-Side Comparison <span className="text-[#0095ff] font-bold">({categoryDisplayLabel})</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Best value on each row is highlighted in green</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Comparison Ready</span>
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-auto max-h-[440px] sm:max-h-[520px]">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr>
                            <th
                              className="sticky top-0 left-0 z-30 bg-slate-100 text-left align-bottom px-3 sm:px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wide text-[10px] sm:text-[11px] border-r border-b border-slate-200 w-28 sm:w-36 shrink-0"
                            >
                              Criterion
                            </th>
                            {comparedColleges.map((college: any) => (
                              <th
                                key={college.name}
                                className="sticky top-0 z-20 bg-[#0a0e1a] text-white text-left align-bottom px-3 sm:px-4 py-3 font-extrabold leading-snug border-b border-slate-200 min-w-[150px] sm:min-w-[190px]"
                              >
                                {college.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeCriteriaList.map((crit, rowIdx) => {
                            const bestIdx = getBestIndex(crit);
                            return (
                              <tr key={crit.key} className={rowIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                                <td
                                  className={`sticky left-0 z-10 px-3 sm:px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wide text-[10px] sm:text-[11px] border-r border-b border-slate-200 align-top ${
                                    rowIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                                  }`}
                                >
                                  {crit.label}
                                </td>
                                {comparedColleges.map((college: any, colIdx: number) => {
                                  const isBest = colIdx === bestIdx;
                                  const value = getDisplayValue(college, crit);
                                  const cellKey = `${college.name}-${crit.key}`;
                                  const isLong = LONG_TEXT_KEYS.has(crit.key) && value.length > 90;
                                  const isExpanded = expandedCells.has(cellKey);

                                  return (
                                    <td
                                      key={college.name}
                                      className={`px-3 sm:px-4 py-3 border-b border-slate-200 align-top font-semibold text-slate-800 ${
                                        isBest ? 'bg-emerald-50/60' : ''
                                      }`}
                                    >
                                      {isBest && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap mb-1">
                                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                                          Best
                                        </span>
                                      )}
                                      <p className={`leading-relaxed break-words ${isLong && !isExpanded ? 'line-clamp-2' : ''}`}>
                                        {value}
                                      </p>
                                      {isLong && (
                                        <button
                                          type="button"
                                          onClick={() => toggleCellExpanded(cellKey)}
                                          className="text-[11px] font-bold text-sky-600 hover:text-sky-700 mt-1 inline-flex items-center gap-0.5"
                                        >
                                          {isExpanded ? 'Show less' : 'Show more'}
                                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="sm:hidden text-[11px] text-slate-400 font-semibold text-center mt-2">
                    ← Swipe to see the other colleges
                  </p>

                  {/* Download PDF Button */}
                  <button
                    type="button"
                    disabled={isPdfGenerating}
                    onClick={handleDownloadPdf}
                    className="w-full max-w-sm mx-auto mt-6 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0095ff] to-[#00e5bf] hover:from-[#0080ff] hover:to-[#00d094] text-white font-extrabold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>{isPdfGenerating ? 'Generating PDF...' : 'Download Comparison PDF'}</span>
                  </button>

                  {waFineprint && (
                    <p className="text-xs text-slate-400 font-semibold text-center mt-3">{waFineprint}</p>
                  )}
                </div>
              )}

            </div>

          </div>
        </section>
      </main>

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
          font-size: clamp(2rem, 4vw, 3.2rem);
          white-space: nowrap;
        }

        .hero-subtitle-cc {
          font-size: clamp(1rem, 2vw, 1.4rem);
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

      {/* FOOTER */}
      {/* <Footer
        switchTab={() => router.push('/')}
        openCounselling={() => router.push('/#why')}
        counsellingKitURL="/assets/counselling-kit/The Counselling Atlas.pdf"
      /> */}
    </div>
  );
}