// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { ChevronDown, Check } from 'lucide-react';

// interface Option {
//   code: string;
//   name: string;
// }

// interface DropdownProps {
//   options: Option[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// export default function Dropdown({
//   options,
//   value,
//   onChange,
//   placeholder = 'Select...',
// }: DropdownProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const selectedLabel = options.find((o) => o.code === value)?.name || placeholder;

//   const handleSelect = (code: string) => {
//     onChange(code);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative" ref={wrapperRef}>
//       {/* Trigger */}
//       <div
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2.5 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors cursor-pointer flex items-center justify-between gap-2"
//       >
//         <span className="truncate">{selectedLabel}</span>
//         <ChevronDown
//           className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-30 mt-2 w-full min-w-[180px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
//           <div className="max-h-52 overflow-y-auto py-1">
//             {options.map((opt) => {
//               const checked = opt.code === value;
//               return (
//                 <div
//                   key={opt.code}
//                   onClick={() => handleSelect(opt.code)}
//                   className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
//                     checked ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
//                   }`}
//                 >
//                   <span className="truncate">{opt.name}</span>
//                   {checked && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  code: string;
  name: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.code === value)?.name || placeholder;

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

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
      className="min-w-[180px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-100"
    >
      <div className="max-h-52 overflow-y-auto py-1">
        {options.map((opt) => {
          const checked = opt.code === value;
          return (
            <div
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
                checked ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{opt.name}</span>
              {checked && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-3 py-2.5 text-sm font-extrabold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors cursor-pointer flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown panel is portaled straight to <body> so it can never be
          clipped by an ancestor's overflow-hidden (e.g. the hero section)
          or mispositioned by a transformed/positioned ancestor. */}
      {mounted && panel && createPortal(panel, document.body)}
    </div>
  );
}