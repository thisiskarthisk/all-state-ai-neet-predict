'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  Phone,
  Mail,
  Award,
  GraduationCap,
  User,
} from 'lucide-react';
import { ZohoLead } from '@/lib/zoho';

/**
 * Gets Student Name (Lead Name)
 */
function getLeadName(lead: ZohoLead): string {
  if (lead.Student_Name?.trim()) return lead.Student_Name.trim();
  if (lead.Full_Name?.trim()) return lead.Full_Name.trim();
  const first = lead.First_Name || '';
  const last = lead.Last_Name || '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  return 'N/A';
}

/**
 * Formats NEET Rank with commas (e.g., 1,500)
 */
function getNeetRank(lead: ZohoLead): string {
  const val = lead.Neet_Rank ?? lead.NEET_Rank;
  if (val === null || val === undefined || val === '') return 'N/A';
  const num = parseInt(String(val).replace(/\D/g, ''), 10);
  if (isNaN(num)) return String(val);
  return num.toLocaleString('en-IN');
}

/**
 * Gets College Name (Displays exact comma-separated text as in Zoho CRM)
 */
function getCollegeName(lead: ZohoLead): string {
  const col = lead.College_Name || lead.College_name || lead.Selected_Colleges;
  if (!col || col.trim() === '' || col.trim().toLowerCase() === 'none') return 'None';
  return col.trim();
}

export default function CounsellingLeadsPage() {
  const [leads, setLeads] = useState<ZohoLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchLeads = useCallback(async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/counselling-leads?page=${page}&per_page=10`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch leads');
      }

      setLeads(data.data || []);
      if (data.info) {
        setHasMore(!!data.info.more_records);
        setTotalCount(data.info.count || (data.data || []).length);
      }
    } catch (err: any) {
      console.error('[CounsellingLeadsPage] Fetch Error:', err);
      setError(err.message || 'Error connecting to Zoho CRM API. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage, fetchLeads]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" /> Zoho CRM Counselling Leads (10 Records Per Page)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Counselling Student Information
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Live leads fetched directly from Zoho CRM API
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchLeads(currentPage)}
              disabled={loading}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Leads</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchLeads(currentPage)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-extrabold transition-colors border border-rose-300 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Table Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-600" /> Student Name
                    </span>
                  </th>
                  <th className="py-4 px-4">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-600" /> Email
                    </span>
                  </th>
                  <th className="py-4 px-4">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone
                    </span>
                  </th>
                  <th className="py-4 px-4">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" /> Neet Rank
                    </span>
                  </th>
                  <th className="py-4 px-5">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> College Name
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-slate-50/50">
                      <td className="py-4 px-5">
                        <div className="h-4 bg-slate-200 rounded-md w-32" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 rounded-md w-40" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 rounded-md w-28" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 rounded-md w-20" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 bg-slate-200 rounded-md w-56" />
                      </td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <UserCheck className="w-10 h-10 text-slate-400" />
                        <p className="font-extrabold text-slate-800 text-sm">No Zoho CRM Leads Found</p>
                        <p className="text-xs text-slate-500 font-semibold">
                          No leads are currently available on page {currentPage}.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const leadName = getLeadName(lead);
                    const email = lead.Email || 'N/A';
                    const phone = lead.Phone || lead.Mobile || 'N/A';
                    const rank = getNeetRank(lead);
                    const collegeName = getCollegeName(lead);

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/80 transition-colors font-medium text-slate-800"
                      >
                        <td className="py-4 px-5 font-black text-slate-900">{leadName}</td>
                        <td className="py-4 px-4 text-slate-700">{email}</td>
                        <td className="py-4 px-4 font-mono text-slate-700 text-xs">{phone}</td>
                        <td className="py-4 px-4 font-mono font-black text-indigo-600">{rank}</td>
                        <td className="py-4 px-5 text-slate-800 leading-relaxed font-medium">
                          {collegeName === 'None' ? (
                            <span className="text-slate-400">None</span>
                          ) : (
                            collegeName
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer (10 Records Per Page) */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div>
              Showing page <span className="font-black text-slate-900">{currentPage}</span>
              {totalCount > 0 && (
                <span>
                  {' '}
                  ({leads.length} records on this page)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || loading}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 border border-slate-200 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-slate-200/80 border border-slate-300 font-black text-slate-900 text-xs">
                {currentPage}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasMore || loading}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 border border-slate-200 shadow-2xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
