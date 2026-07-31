'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './reveal';
import { Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import MultiSelect from '@/components/Multiselect';
import MASTER_UG_COLLEGE_LIST from '@/lib/data/allstate/UgMasterCollegeList.json';

const ALL_COLLEGE_OPTIONS: { code: string; name: string }[] = (() => {
  const masterUg = Array.isArray(MASTER_UG_COLLEGE_LIST) ? MASTER_UG_COLLEGE_LIST : [];
  const set = new Set<string>();
  for (const c of masterUg) {
    const rawName = (c as any)['College Name'] || (c as any).name;
    if (rawName && typeof rawName === 'string' && rawName.trim()) {
      const cleanName = rawName.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanName) set.add(cleanName);
    }
  }
  return Array.from(set)
    .sort()
    .map((name) => ({ code: name, name }));
})();

export default function WhySection() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('MBBS');
  const [score, setScore] = useState('');
  
  // Multiple colleges selected via MultiSelect dropdown
  const [collegesList, setCollegesList] = useState<string[]>([]);
  
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = mobile.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    let storedRank = typeof window !== 'undefined' ? localStorage.getItem('predict_rank') : null;
    if (storedRank) {
      storedRank = storedRank.startsWith('AIR') ? storedRank : `AIR ${storedRank}`;
    } else {
      storedRank = score ? (score.startsWith('AIR') ? score : `AIR ${score}`) : 'AIR 106';
    }

    let storedExamType = typeof window !== 'undefined' ? localStorage.getItem('predict_examType') : null;
    const examType = storedExamType ? storedExamType.replace(/_/g, ' ') : 'NEET UG';

    let storedCategory = typeof window !== 'undefined' ? localStorage.getItem('predict_category') : null;
    const category = storedCategory ? (storedCategory === 'UR' ? 'General (UR)' : storedCategory) : 'General / All Categories';

    let preferredStates = 'Karnataka (KA)';
    try {
      if (typeof window !== 'undefined') {
        const storedStates = localStorage.getItem('predict_states');
        if (storedStates) {
          const parsed = JSON.parse(storedStates);
          if (Array.isArray(parsed) && parsed.length > 0) {
            preferredStates = parsed.join(', ');
          }
        }
      }
    } catch {}

    const selectedCollegeObjects = collegesList.map((c) => ({ college_name: c, name: c }));

    try {
      // 1. Insert lead into Zoho CRM
      try {
        await fetch('/api/zoho-crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            mobileNo: cleanPhone,
            homeState: preferredStates,
            selectedColleges: selectedCollegeObjects,
            studentProfile: {
              preferredColleges: collegesList.join(', '),
              rank: storedRank,
              course: course || 'MBBS',
              exam: examType,
              category: category,
              states: preferredStates,
            },
            leadSource: 'Personalized Counselling Update',
          }),
        });
      } catch (crmErr) {
        console.warn('[CRM Push Warning]:', crmErr);
      }

      // 2. Send email payload to student and admin via /api/counselling/send-email
      try {
        await fetch('/api/counselling/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            mobileNo: cleanPhone,
            studentProfile: {
              rank: storedRank,
              course: course || 'MBBS',
              exam: examType,
              category: category,
              states: preferredStates,
            },
            selectedColleges: selectedCollegeObjects,
            preferredCollegesList: collegesList,
            type: 'counselling',
          }),
        });
      } catch (emailErr) {
        console.warn('[Email Push Warning]:', emailErr);
      }

      setSuccess(true);
    } catch (err) {
      console.error('[WhySection] Submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="why" className="py-20 bg-[#090d16] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ===== LEFT SIDE CONTENT ===== */}
          <Reveal className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-[11px] font-extrabold tracking-widest text-sky-400 uppercase mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>BEYOND PREDICTION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Get My Personalised Counselling Update
            </h2>

            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed mb-8">
              Receive everything you need about your favourite medical college directly on
              Email — counselling schedules, eligibility, fee structure, seat matrix,
              and admission dates, tracked for you so you never miss an update.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30 text-xs">
                  ✓
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Round-wise counselling schedules and important dates, sent as they're announced
                </p>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30 text-xs">
                  ✓
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Eligibility, fee structure, and seat matrix for your shortlisted colleges
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>Trusted by students across India</span>
              <span>•</span>
              <span>No spam, ever</span>
            </div>
          </Reveal>

          {/* ===== RIGHT SIDE FORM CARD ===== */}
          <Reveal className="lg:col-span-7" delay={120}>
            <div className="bg-[#0f1523] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    ✓
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    Your Personalized Medical College Report Is Being Prepared.
                  </h3>
                  <div className="text-sm text-slate-300 max-w-md mx-auto space-y-2 font-medium">
                    <p className="text-emerald-400 font-bold text-base">Thank you for sharing your details.</p>
                    <p>We're generating a personalized report based on your NEET Rank, Category, and College Preferences.</p>
                    <p className="text-xs text-slate-400 font-semibold pt-1">
                      You'll receive it shortly on your Email{email ? <span className="text-white font-bold"> ({email})</span> : ''}.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setCollegesList([]);
                      
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* WhatsApp Number & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        WhatsApp Number <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Email Address <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* NEET Course & NEET Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        NEET Course <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="MBBS">MBBS</option>
                          <option value="BDS">BDS</option>
                          <option value="MD/MS">MD/MS</option>
                          <option value="MDS">MDS</option>
                          <option value="BAMS">BAMS</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                          ▼
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">NEET Score / Rank</label>
                        <span className="text-[10px] text-slate-500 font-semibold">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="e.g. 620 or AIR 106"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Favourite Medical College(s) Multiple Select Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Favourite Medical College(s) ({collegesList.length})
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">Optional</span>
                    </div>

                    <MultiSelect
                      options={ALL_COLLEGE_OPTIONS}
                      selectedValues={collegesList}
                      onChange={setCollegesList}
                      placeholder="Search & select favourite colleges..."
                      isDark={true}
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 bg-[#0b0f19] text-indigo-600 focus:ring-0 accent-indigo-600"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        I agree to receive counselling information and admission updates via Email.
                      </span>
                    </label>
                  </div>

                  {error && <p className="text-xs text-rose-400 font-bold text-center">{error}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    id="personalized-form-submit-btn"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Preparing Report...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" /> Get My Personalised Counselling Update
                      </>
                    )}
                  </button>

                  {/* Bottom Disclaimer */}
                  <p className="text-[11px] text-center text-slate-500 pt-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>No spam. Sent directly to your Email &amp; CRM.</span>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}