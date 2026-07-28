'use client';

import { useState } from 'react';
import Reveal from './reveal';
import { Plus, X, Loader2, MessageSquare } from 'lucide-react';

export default function HandbookSection({ onOpenModal }: { onOpenModal?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states inside the popup modal
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('MBBS');
  const [score, setScore] = useState('');

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setError('');
      setCollegesList([]);
      setName('');
      setMobile('');
      setEmail('');
      setScore('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedMessage =
      `This is your NEET UG Counselling Handbook & Guide\n\n` +
      `NEET Exam / Score : ${score || 'Not specified'}\n` +
      `Course : ${course}\n` +
      `Shortlisted Colleges : ${collegesList.length > 0 ? collegesList.join(', ') : 'General Medical Colleges'}\n\n` +
      `Student Name: ${name}`;

    let cleanMobile = (mobile || '').replace(/\D/g, '');
    if (cleanMobile.length === 10) {
      cleanMobile = `91${cleanMobile}`;
    }

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanMobile}&text=${encodeURIComponent(formattedMessage)}`;

    try {
      await fetch('/api/expert-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: mobile,
          email,
          course,
          score,
          exam: 'NEET UG',
          category: 'General / All Categories',
          states: 'KA ( Karnataka )',
          colleges: collegesList.length > 0 ? collegesList : ['Karnataka Medical & Dental Colleges'],
          message: formattedMessage,
        }),
      });

      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: mobile,
          email,
          rank: score ? `AIR ${score}` : 'AIR 106',
          exam: 'NEET UG',
          course,
          category: 'General / All Categories',
          states: 'KA ( Karnataka )',
          colleges: collegesList,
          messageText: formattedMessage,
        }),
      });

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container-cc max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 md:p-14 bg-white text-slate-900 shadow-2xl border border-slate-100">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-slate-100/60 pointer-events-none" />
              <div className="absolute -bottom-32 right-12 w-[30rem] h-[30rem] rounded-full bg-slate-100/40 pointer-events-none" />
              <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-slate-100/50 pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-5 flex justify-center items-center">
                  <div className="w-full max-w-[440px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 transition-transform hover:scale-[1.02] duration-300">
                    <img
                      src="/assets/image/book.jpeg"
                      alt="The Complete Guide to NEET UG Counselling"
                      className="w-full h-auto object-cover block"
                    />
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col items-start justify-center text-left">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#e6f9f6] border border-[#a3edd9] text-[#00b88d] text-xs font-extrabold tracking-wider uppercase shadow-sm">
                      FREE HANDBOOK
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black text-[#0f172a] tracking-tight leading-[1.15] max-w-lg mb-4">
                    The Complete Guide to <br className="hidden sm:block" />
                    NEET UG <br className="hidden sm:block" />
                    Counselling
                  </h2>

                  <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed max-w-lg mb-8">
                    Everything you need to navigate the medical admission process from registration
                    to seat allotment, in one easy-to-understand handbook designed for students and
                    parents.
                  </p>

                  <div>
                    <button
                      type="button"
                      onClick={() => (onOpenModal ? onOpenModal() : setIsModalOpen(true))}
                      className="px-8 py-4 rounded-2xl bg-[#00e5a3] hover:bg-[#00d094] text-[#0f172a] font-black text-sm sm:text-base shadow-lg shadow-[#00e5a3]/30 transition-all active:scale-95 cursor-pointer"
                    >
                      Download Free Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* POPUP MODAL CONTAINING THE FORM */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="relative w-full max-w-lg bg-[#0f1523] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-white">Handbook Sent Successfully!</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Your free handbook link and guide details have been sent to your WhatsApp number <span className="text-emerald-400 font-bold">{mobile}</span>.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
                <h3 className="text-xl font-black text-white mb-1">Get Your Free Guide Now</h3>
                <p className="text-xs text-slate-400 mb-4">Fill out your details to receive the handbook on WhatsApp.</p>

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

                {/* Multiple College Input + Plus Button */}
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
                      className="w-12 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
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
                            className="text-indigo-400 hover:text-white cursor-pointer"
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
                      className="mt-0.5 rounded border-slate-800 bg-[#0b0f19] text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to receive counselling information and handbook updates via WhatsApp and Email.
                    </span>
                  </label>
                </div>

                {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Free Handbook...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" /> Download Free Guide
                    </>
                  )}
                </button>

                {/* Bottom Disclaimer */}
                <p className="text-[11px] text-center text-slate-500 pt-1">
                  No spam. Instant delivery to your WhatsApp.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}