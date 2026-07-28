'use client';

import { useState, useEffect } from 'react';

interface MultiSelectProps {
  options: { code: string; name: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...'
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (code: string) => {
    if (code === 'AI') {
      onChange(['AI']);
    } else {
      let next = selectedValues.filter(v => v !== 'AI');
      if (next.includes(code)) {
        next = next.filter(v => v !== code);
      } else {
        next = [...next, code];
      }
      if (next.length === 0) {
        next = ['AI'];
      }
      onChange(next);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.multiselect-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const getDisplayText = () => {
    if (selectedValues.includes('AI') || selectedValues.length === 0) {
      return 'All India Quota (AI)';
    }
    if (selectedValues.length === 1) {
      const opt = options.find(o => o.code === selectedValues[0]);
      return opt ? opt.name : selectedValues[0];
    }
    return `${selectedValues.length} States Selected`;
  };

  return (
    <div className="relative multiselect-container w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-800 outline-none text-left flex items-center justify-between transition-colors focus:border-indigo-600 focus:bg-white"
      >
        <span className="truncate">{getDisplayText()}</span>
        <span className="text-slate-400 text-xs ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1">
          <button
            type="button"
            onClick={() => {
              onChange(['AI']);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between ${
              selectedValues.includes('AI') ? 'bg-indigo-50 text-indigo-700 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All India Quota (AI)</span>
            {selectedValues.includes('AI') && <span>✓</span>}
          </button>
          <div className="h-px bg-slate-150 my-1" />
          {options.map(opt => {
            if (opt.code === 'AI') return null;
            const isSel = selectedValues.includes(opt.code);
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => toggleOption(opt.code)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  isSel ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{opt.name}</span>
                {isSel && <span>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
