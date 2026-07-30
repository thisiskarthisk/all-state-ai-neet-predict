'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  isDark?: boolean;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  isDark = false,
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

  const updateCoords = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (isOpen) updateCoords();
  }, [isOpen]);

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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (code: string) => {
    if (code === 'AI') {
      if (selectedValues.length === 1 && selectedValues[0] === 'AI') {
        onChange([]);
      } else {
        onChange(['AI']);
      }
      return;
    }

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
      className={`min-w-[240px] rounded-2xl border shadow-xl overflow-hidden animate-in fade-in duration-100 ${
        isDark
          ? 'bg-[#090d16] border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Search box */}
      <div className={`p-2 border-b ${isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-100 bg-slate-50'}`}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold outline-none transition-colors ${
              isDark
                ? 'bg-[#0b0f19] border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-600'
            }`}
          />
        </div>
      </div>

      {/* Selection status */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b text-[11px] ${
        isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-100 bg-white'
      }`}>
        <span className={`font-extrabold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select options</span>
        <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{selectedValues.length} selected</span>
      </div>

      {/* Options list */}
      <div className="max-h-48 overflow-y-auto py-1">
        {filteredOptions.length === 0 ? (
          <div className={`px-4 py-4 text-xs font-semibold text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No options match &ldquo;{search}&rdquo;
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
                    ? isDark
                      ? 'text-slate-600 cursor-not-allowed select-none'
                      : 'text-slate-300 cursor-not-allowed select-none'
                    : checked
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-pointer'
                      : 'bg-indigo-50 text-indigo-800 cursor-pointer'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-800/80 cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      checked
                        ? isDark
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-indigo-600 border-indigo-600'
                        : disabledByAI
                        ? isDark
                          ? 'border-slate-800 bg-slate-900'
                          : 'border-slate-200 bg-slate-100'
                        : isDark
                        ? 'border-slate-700 bg-[#0b0f19]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="truncate">{opt.name}</span>
                </span>
                {disabledByAI && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                    isDark ? 'text-slate-600' : 'text-slate-300'
                  }`}>
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
        className={`w-full min-h-[42px] rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition-colors cursor-pointer flex items-center justify-between gap-2 ${
          isDark
            ? 'bg-[#0b0f19] border-slate-800 text-white focus:border-emerald-500'
            : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-indigo-600'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className={`font-semibold text-sm px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {placeholder}
            </span>
          ) : showIndividualChips ? (
            selectedValues.map((v) => (
              <span
                key={v}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}
              >
                <span className="truncate max-w-[180px]">{getLabel(v)}</span>
                <button
                  type="button"
                  onClick={(e) => removeValue(v, e)}
                  className={isDark ? 'hover:text-emerald-100' : 'hover:text-indigo-950'}
                  aria-label={`Remove ${getLabel(v)}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : showCountSummary ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}>
              {selectedValues.length} colleges selected
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className={`p-0.5 ${isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'}`}
              aria-label="Clear all"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isDark ? 'text-slate-400' : 'text-slate-500'} ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {mounted && panel && createPortal(panel, document.body)}
    </div>
  );
}