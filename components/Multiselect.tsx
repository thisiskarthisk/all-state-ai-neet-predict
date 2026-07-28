// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { ChevronDown, Search, X, Check } from 'lucide-react';

// interface Option {
//   code: string;
//   name: string;
// }

// interface MultiSelectProps {
//   options: Option[];
//   selectedValues: string[];
//   onChange: (values: string[]) => void;
//   placeholder?: string;
//   maxSelections?: number;
// }

// export default function MultiSelect({
//   options,
//   selectedValues,
//   onChange,
//   placeholder = 'Select...',
//   maxSelections = 5,
// }: MultiSelectProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//         setSearch('');
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Autofocus the search box whenever the dropdown opens
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => searchInputRef.current?.focus(), 0);
//     }
//   }, [isOpen]);

//   const filteredOptions = options.filter((opt) =>
//     opt.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const limitReached = selectedValues.length >= maxSelections;

//   const toggleValue = (code: string) => {
//     if (selectedValues.includes(code)) {
//       onChange(selectedValues.filter((v) => v !== code));
//     } else {
//       if (limitReached) return;
//       onChange([...selectedValues, code]);
//     }
//   };

//   const removeValue = (code: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     onChange(selectedValues.filter((v) => v !== code));
//   };

//   const clearAll = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onChange([]);
//   };

//   const getLabel = (code: string) => options.find((o) => o.code === code)?.name || code;

//   return (
//     <div className="relative" ref={wrapperRef}>
//       {/* Trigger */}
//       <div
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="w-full min-h-[42px] rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 transition-colors cursor-pointer flex items-center justify-between gap-2"
//       >
//         <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
//           {selectedValues.length === 0 ? (
//             <span className="text-slate-400 font-semibold text-sm px-1">{placeholder}</span>
//           ) : (
//             selectedValues.map((v) => (
//               <span
//                 key={v}
//                 className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200"
//               >
//                 {getLabel(v)}
//                 <button
//                   type="button"
//                   onClick={(e) => removeValue(v, e)}
//                   className="hover:text-indigo-950"
//                   aria-label={`Remove ${getLabel(v)}`}
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             ))
//           )}
//         </div>

//         <div className="flex items-center gap-1 shrink-0">
//           {selectedValues.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="text-slate-400 hover:text-rose-600 p-0.5"
//               aria-label="Clear all selected states"
//               title="Clear all"
//             >
//               <X className="w-3.5 h-3.5" />
//             </button>
//           )}
//           <ChevronDown
//             className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//           />
//         </div>
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-30 mt-2 w-full min-w-[240px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
//           {/* Search box */}
//           <div className="p-2 border-b border-slate-100 bg-slate-50">
//             <div className="relative">
//               <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search states..."
//                 className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
//               />
//             </div>
//           </div>

//           {/* Selection status */}
//           <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-white">
//             <span className="text-[11px] font-extrabold text-slate-500">
//               Select up to {maxSelections} state{maxSelections > 1 ? 's' : ''}
//             </span>
//             <span
//               className={`text-[11px] font-bold ${
//                 limitReached ? 'text-rose-600' : 'text-slate-400'
//               }`}
//             >
//               {selectedValues.length}/{maxSelections} selected
//             </span>
//           </div>

//           {/* Options list */}
//           <div className="max-h-40 overflow-y-auto py-1">
//             {filteredOptions.length === 0 ? (
//               <div className="px-4 py-4 text-xs font-semibold text-slate-400 text-center">
//                 No states match &ldquo;{search}&rdquo;
//               </div>
//             ) : (
//               filteredOptions.map((opt) => {
//                 const checked = selectedValues.includes(opt.code);
//                 const disabled = !checked && limitReached;
//                 return (
//                   <div
//                     key={opt.code}
//                     onClick={() => toggleValue(opt.code)}
//                     className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold transition-colors ${
//                       checked
//                         ? 'bg-indigo-50 text-indigo-800 cursor-pointer'
//                         : disabled
//                         ? 'text-slate-300 cursor-not-allowed'
//                         : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
//                     }`}
//                   >
//                     <span className="flex items-center gap-2 min-w-0">
//                       <span
//                         className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
//                           checked
//                             ? 'bg-indigo-600 border-indigo-600'
//                             : disabled
//                             ? 'border-slate-200 bg-slate-50'
//                             : 'border-slate-300 bg-white'
//                         }`}
//                       >
//                         {checked && <Check className="w-3 h-3 text-white" />}
//                       </span>
//                       <span className="truncate">{opt.name}</span>
//                     </span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// Multiple Select inside count show
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { ChevronDown, Search, X, Check } from 'lucide-react';

// interface Option {
//   code: string;
//   name: string;
// }

// interface MultiSelectProps {
//   options: Option[];
//   selectedValues: string[];
//   onChange: (values: string[]) => void;
//   placeholder?: string;
// }

// export default function MultiSelect({
//   options,
//   selectedValues,
//   onChange,
//   placeholder = 'Select...',
// }: MultiSelectProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//         setSearch('');
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Autofocus the search box whenever the dropdown opens
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => searchInputRef.current?.focus(), 0);
//     }
//   }, [isOpen]);

//   const filteredOptions = options.filter((opt) =>
//     opt.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // No cap on how many states can be picked — select as many as you like.
//   const toggleValue = (code: string) => {
//     if (selectedValues.includes(code)) {
//       onChange(selectedValues.filter((v) => v !== code));
//     } else {
//       onChange([...selectedValues, code]);
//     }
//   };

//   const removeValue = (code: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     onChange(selectedValues.filter((v) => v !== code));
//   };

//   const clearAll = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onChange([]);
//   };

//   const getLabel = (code: string) => options.find((o) => o.code === code)?.name || code;

//   // 1-3 selected -> show each as its own chip.
//   // 4+ selected -> collapse into a single "N states selected" summary so the
//   // field doesn't grow into a wall of chips.
//   const showIndividualChips = selectedValues.length > 0 && selectedValues.length <= 2;
//   const showCountSummary = selectedValues.length > 2;

//   return (
//     <div className="relative" ref={wrapperRef}>
//       {/* Trigger */}
//       <div
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="w-full min-h-[42px] rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 transition-colors cursor-pointer flex items-center justify-between gap-2"
//       >
//         <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
//           {selectedValues.length === 0 ? (
//             <span className="text-slate-400 font-semibold text-sm px-1">{placeholder}</span>
//           ) : showIndividualChips ? (
//             selectedValues.map((v) => (
//               <span
//                 key={v}
//                 className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200"
//               >
//                 {getLabel(v)}
//                 <button
//                   type="button"
//                   onClick={(e) => removeValue(v, e)}
//                   className="hover:text-indigo-950"
//                   aria-label={`Remove ${getLabel(v)}`}
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             ))
//           ) : showCountSummary ? (
//             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200">
//               {selectedValues.length} states selected
//             </span>
//           ) : null}
//         </div>

//         <div className="flex items-center gap-1 shrink-0">
//           {selectedValues.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="text-slate-400 hover:text-rose-600 p-0.5"
//               aria-label="Clear all selected states"
//               title="Clear all"
//             >
//               <X className="w-3.5 h-3.5" />
//             </button>
//           )}
//           <ChevronDown
//             className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//           />
//         </div>
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-30 mt-2 w-full min-w-[240px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
//           {/* Search box */}
//           <div className="p-2 border-b border-slate-100 bg-slate-50">
//             <div className="relative">
//               <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search states..."
//                 className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
//               />
//             </div>
//           </div>

//           {/* Selection status */}
//           <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-white">
//             <span className="text-[11px] font-extrabold text-slate-500">
//               Select any number of states
//             </span>
//             <span className="text-[11px] font-bold text-slate-400">
//               {selectedValues.length} selected
//             </span>
//           </div>

//           {/* Options list */}
//           <div className="max-h-40 overflow-y-auto py-1">
//             {filteredOptions.length === 0 ? (
//               <div className="px-4 py-4 text-xs font-semibold text-slate-400 text-center">
//                 No states match &ldquo;{search}&rdquo;
//               </div>
//             ) : (
//               filteredOptions.map((opt) => {
//                 const checked = selectedValues.includes(opt.code);
//                 return (
//                   <div
//                     key={opt.code}
//                     onClick={() => toggleValue(opt.code)}
//                     className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
//                       checked ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
//                     }`}
//                   >
//                     <span className="flex items-center gap-2 min-w-0">
//                       <span
//                         className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
//                           checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
//                         }`}
//                       >
//                         {checked && <Check className="w-3 h-3 text-white" />}
//                       </span>
//                       <span className="truncate">{opt.name}</span>
//                     </span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Option {
  code: string;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Recompute the trigger's position so the portaled panel lines up under it
  const updateCoords = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (isOpen) updateCoords();
  }, [isOpen]);

  // Keep the panel aligned with the trigger while open (scroll/resize anywhere)
  useEffect(() => {
    if (!isOpen) return;
    const handle = () => updateCoords();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside — checks BOTH the trigger wrapper
  // and the portaled panel, since the panel now lives outside wrapperRef
  // in the DOM (it's rendered directly under document.body).
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = wrapperRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);
      if (!clickedTrigger && !clickedPanel) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus the search box whenever the dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  // No cap on how many states can be picked — select as many as you like.
  // Exception: 'AI' (All India) already covers every state, so it's mutually
  // exclusive with picking individual states.
  const toggleValue = (code: string) => {
    if (code === 'AI') {
      // Toggle All India on/off; selecting it always clears any specific states.
      if (selectedValues.length === 1 && selectedValues[0] === 'AI') {
        onChange([]);
      } else {
        onChange(['AI']);
      }
      return;
    }

    // Individual state options are disabled while All India is selected,
    // but guard here too in case this is ever called programmatically.
    if (selectedValues.includes('AI')) return;

    if (selectedValues.includes(code)) {
      onChange(selectedValues.filter((v) => v !== code));
    } else {
      onChange([...selectedValues, code]);
    }
  };

  const removeValue = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== code));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const getLabel = (code: string) => options.find((o) => o.code === code)?.name || code;

  // 1-3 selected -> show each as its own chip.
  // 4+ selected -> collapse into a single "N states selected" summary so the
  // field doesn't grow into a wall of chips.
  const showIndividualChips = selectedValues.length > 0 && selectedValues.length <= 2;
  const showCountSummary = selectedValues.length > 2;

  const panel = isOpen && (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999,
      }}
      className="min-w-[240px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-100"
    >
      {/* Search box */}
      <div className="p-2 border-b border-slate-100 bg-slate-50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search states..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Selection status */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-white">
        <span className="text-[11px] font-extrabold text-slate-500">Select any number of states</span>
        <span className="text-[11px] font-bold text-slate-400">{selectedValues.length} selected</span>
      </div>

      {/* Options list */}
      <div className="max-h-40 overflow-y-auto py-1">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-4 text-xs font-semibold text-slate-400 text-center">
            No states match &ldquo;{search}&rdquo;
          </div>
        ) : (
          filteredOptions.map((opt) => {
            const checked = selectedValues.includes(opt.code);
            const isAI = opt.code === 'AI';
            const disabledByAI = !isAI && selectedValues.includes('AI');
            return (
              <div
                key={opt.code}
                onClick={() => {
                  if (disabledByAI) return;
                  toggleValue(opt.code);
                }}
                aria-disabled={disabledByAI}
                className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold transition-colors ${
                  disabledByAI
                    ? 'text-slate-300 cursor-not-allowed select-none'
                    : checked
                    ? 'bg-indigo-50 text-indigo-800 cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-indigo-600 border-indigo-600'
                        : disabledByAI
                        ? 'border-slate-200 bg-slate-100'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="truncate">{opt.name}</span>
                </span>
                {disabledByAI && (
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider shrink-0">
                    Included
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full min-h-[42px] rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 transition-colors cursor-pointer flex items-center justify-between gap-2"
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-slate-400 font-semibold text-sm px-1">{placeholder}</span>
          ) : showIndividualChips ? (
            selectedValues.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200"
              >
                {getLabel(v)}
                <button
                  type="button"
                  onClick={(e) => removeValue(v, e)}
                  className="hover:text-indigo-950"
                  aria-label={`Remove ${getLabel(v)}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : showCountSummary ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200">
              {selectedValues.length} states selected
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-rose-600 p-0.5"
              aria-label="Clear all selected states"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown panel is portaled straight to <body> so it can never be
          clipped by an ancestor's overflow-hidden (e.g. the hero section)
          or mispositioned by a transformed/positioned ancestor. */}
      {mounted && panel && createPortal(panel, document.body)}
    </div>
  );
}