'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './reveal';
import { Plus, X, Loader2, MessageSquare } from 'lucide-react';

export default function WhySection() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('MBBS');
  const [score, setScore] = useState('');
  
  // Multiple colleges dynamic list state
  const [collegeInput, setCollegeInput] = useState('');
  const [collegesList, setCollegesList] = useState<string[]>([]);
  
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addCollege = () => {
    if (collegeInput.trim() && !collegesList.includes(collegeInput.trim())) {
      setCollegesList((prev) => [...prev, collegeInput.trim()]);
      setCollegeInput('');
    }
  };

  const removeCollege = (indexToRemove: number) => {
    setCollegesList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    let collegesToRender: any[] = collegesList.map((c) => ({ college_name: c, name: c }));
    if (collegesToRender.length === 0 && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('selectCollege') || localStorage.getItem('selectedColleges') || localStorage.getItem('collegeList') || localStorage.getItem('college_prediction_results');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            collegesToRender = parsed;
          }
        }
      } catch {}
    }

    try {
      // 1. Send Email payload to student and admin via /api/counselling/send-email
      if (email) {
        await fetch('/api/counselling/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Student',
            email: email,
            mobileNo: mobile,
            studentProfile: {
              rank: storedRank,
              course: course || 'MBBS',
              exam: examType,
              category: category,
              states: preferredStates,
            },
            selectedColleges: collegesToRender,
            type: 'counselling',
          }),
        });
      }

      // 2. Submit lead to expert-help backend
      await fetch('/api/expert-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Student',
          phone: mobile,
          email,
          course: course || 'MBBS',
          score,
          exam: examType,
          category,
          states: preferredStates,
          colleges: collegesList.length > 0 ? collegesList : ['Karnataka Medical & Dental Colleges'],
          message: `Personalized Counselling Report requested via Email by ${name || 'Student'}`
        }),
      });

      router.push('/thank-you');
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
              Get Personalized Counselling Information
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
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

                  {/* Favourite Medical College(s) Input + Plus Button */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Favourite Medical College(s) ({collegesList.length})
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">Optional</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={collegeInput}
                        onChange={(e) => setCollegeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCollege();
                          }
                        }}
                        placeholder="Type a college name and press +"
                        className="flex-1 rounded-xl bg-[#0b0f19] border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addCollege}
                        className="w-12 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-indigo-600/30"
                        title="Add College"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Added Colleges Badges List */}
                    {collegesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-h-28 overflow-y-auto pr-1">
                        {collegesList.map((colName, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-bold"
                          >
                            <span>{idx + 1}. {colName}</span>
                            <button
                              type="button"
                              onClick={() => removeCollege(idx)}
                              className="text-indigo-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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

                  {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    id="personalized-form-submit-btn"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Preparing Report...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" /> Alert my counselling window on Email
                      </>
                    )}
                  </button>

                  {/* Bottom Disclaimer */}
                  <p className="text-[11px] text-center text-slate-500 pt-1">
                    No spam. Sent directly to your Email.
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