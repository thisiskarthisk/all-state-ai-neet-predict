'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Loader2, ShieldCheck, CheckCircle2, RefreshCw, Sparkles, GraduationCap } from 'lucide-react';
import { INDIAN_STATES } from '@/constants';
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

const STATE_OPTIONS: { code: string; name: string }[] = INDIAN_STATES.map((st) => ({
  code: st.name,
  name: st.name,
}));

export interface CounsellingInfoModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (leadData: {
    name: string;
    email: string;
    phone: string;
    homeState: string;
    preferredColleges: string[];
    rank?: string;
    exam?: string;
    course?: string;
    category?: string;
    states?: string[];
  }) => void;
  title?: string;
  subtitle?: string;
  isCollegePredictor?: boolean;
  initialStudentProfile?: {
    rank?: string;
    exam?: string;
    course?: string;
    category?: string;
    states?: string[];
  };
}

export default function CounsellingInfoModel({
  isOpen,
  onClose,
  onSuccess,
  title = 'Get your favourite college counselling info',
  subtitle = 'Enter your contact info to view matching medical colleges & cutoffs.',
  isCollegePredictor = false,
  initialStudentProfile,
}: CounsellingInfoModelProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Standard Form Fields
  const [predictLeadName, setPredictLeadName] = useState('');
  const [predictLeadEmail, setPredictLeadEmail] = useState('');
  const [predictLeadMobile, setPredictLeadMobile] = useState('');
  const [predictLeadHomeState, setPredictLeadHomeState] = useState('Karnataka');
  const [predictPreferredColleges, setPredictPreferredColleges] = useState<string[]>([]);

  // Academic Profile Fields (Pre-filled for College Predictor)
  const [profileRank, setProfileRank] = useState('');
  const [profileExam, setProfileExam] = useState('NEET-UG');
  const [profileCourse, setProfileCourse] = useState('MBBS');
  const [profileCategory, setProfileCategory] = useState('General');
  const [profileStates, setProfileStates] = useState<string[]>(['Karnataka']);

  // OTP Fields
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update Academic Profile state whenever initialStudentProfile changes
  useEffect(() => {
    if (initialStudentProfile) {
      if (initialStudentProfile.rank !== undefined) setProfileRank(initialStudentProfile.rank);
      if (initialStudentProfile.exam !== undefined) setProfileExam(initialStudentProfile.exam);
      if (initialStudentProfile.course !== undefined) setProfileCourse(initialStudentProfile.course);
      if (initialStudentProfile.category !== undefined) setProfileCategory(initialStudentProfile.category);
      if (initialStudentProfile.states && Array.isArray(initialStudentProfile.states)) {
        setProfileStates(initialStudentProfile.states);
      }
    }
  }, [initialStudentProfile]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen || !mounted) return null;

  // Step 1: Form Submission -> 1. CRM Insert, 2. Email Send, 3. Send WhatsApp OTP via Wati
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    const cleanPhone = predictLeadMobile.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    if (!predictLeadName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!predictLeadEmail.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Push lead to Zoho CRM
      try {
        await fetch('/api/zoho-crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: predictLeadName.trim(),
            email: predictLeadEmail.trim(),
            mobileNo: cleanPhone,
            homeState: predictLeadHomeState,
            selectedColleges: predictPreferredColleges.map((c) => ({ college_name: c })),
            studentProfile: {
              preferredColleges: predictPreferredColleges.join(', '),
              homeState: predictLeadHomeState,
              rank: isCollegePredictor ? profileRank : undefined,
              exam: isCollegePredictor ? profileExam : undefined,
              course: isCollegePredictor ? profileCourse : undefined,
              category: isCollegePredictor ? profileCategory : undefined,
              states: isCollegePredictor ? profileStates : undefined,
            },
            leadSource: title || 'Counselling Info OTP Modal',
          }),
        });
      } catch (crmErr) {
        console.warn('[CRM Push Warning]:', crmErr);
      }

      // 2. Send email notification
      try {
        await fetch('/api/counselling/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: predictLeadName.trim(),
            email: predictLeadEmail.trim(),
            mobileNo: cleanPhone,
            homeState: predictLeadHomeState,
            selectedColleges: predictPreferredColleges.map((c) => ({ college_name: c })),
            preferredCollegesList: predictPreferredColleges,
            type: 'counselling',
          }),
        });
      } catch (emailErr) {
        console.warn('[Email Push Warning]:', emailErr);
      }

      // 3. Send WhatsApp OTP via Wati
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          name: predictLeadName.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('otp');
        setSuccessMsg(data.message || 'OTP code sent to your WhatsApp number!');
        setResendTimer(30);
        setIsResendDisabled(true);

        // 4. If Rank is 500,000 or above (500000, 500001, or any rank >= 500000), send WhatsApp template message (neet_score_above_5lakh) after 2 minutes
        const rawRank = profileRank || initialStudentProfile?.rank || (typeof window !== 'undefined' ? localStorage.getItem('predict_rank') : '') || '';
        const numRank = parseInt(String(rawRank).replace(/\D/g, ''), 10);
        console.log('[WATI Score Template Rank Check]:', { rawRank, numRank, cleanPhone, name: predictLeadName.trim() });

        if (!isNaN(numRank) && numRank >= 500000) {
          setTimeout(async () => {
            try {
              console.log('[WATI Timer] 2 minutes elapsed for rank', numRank, '. Sending score template to +91', cleanPhone);
              const response = await fetch('/api/whatsapp/send-score-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  phone: cleanPhone,
                  name: predictLeadName.trim(),
                }),
              });
              const resData = await response.json();
              console.log('[WATI Score Template Result]:', resData);
            } catch (scoreTmplErr) {
              console.warn('[WATI Score Template Warning]:', scoreTmplErr);
            }
          }, 120000); // 2 minutes (120 seconds) delay
        }
      } else {
        setFormError(data.error || 'Failed to send OTP to WhatsApp. Please check your number.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setFormError('Network error while sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 4-Digit WhatsApp OTP & Display Results
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setFormError('Please enter the 4-digit verification code received on WhatsApp.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = predictLeadMobile.replace(/\D/g, '');
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp: cleanOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('is_whatsapp_verified', 'true');
          sessionStorage.setItem('verified_phone', cleanPhone);
          sessionStorage.setItem('verified_name', predictLeadName);
        }

        setSuccessMsg('WhatsApp verified successfully!');
        setTimeout(() => {
          onSuccess({
            name: predictLeadName,
            email: predictLeadEmail,
            phone: cleanPhone,
            homeState: predictLeadHomeState,
            preferredColleges: predictPreferredColleges,
            rank: isCollegePredictor ? profileRank : undefined,
            exam: isCollegePredictor ? profileExam : undefined,
            course: isCollegePredictor ? profileCourse : undefined,
            category: isCollegePredictor ? profileCategory : undefined,
            states: isCollegePredictor ? profileStates : undefined,
          });
        }, 300);
      } else {
        setFormError(data.error || 'Invalid OTP code. Please check your WhatsApp.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setFormError('Network error while verifying OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setFormError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const cleanPhone = predictLeadMobile.replace(/\D/g, '');
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, name: predictLeadName.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('A new 4-digit OTP has been sent to your WhatsApp.');
        setResendTimer(30);
        setIsResendDisabled(true);
      } else {
        setFormError(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setFormError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#090d16] text-white rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* FIXED Modal Header */}
        <div className="text-center pb-3 pr-6 shrink-0 border-b border-slate-800/60 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {step === 'form' ? 'Unlock College Prediction & Comparison' : 'WhatsApp Verification'}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {step === 'form' ? title : 'Enter WhatsApp 4-Digit OTP'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
            {step === 'form'
              ? subtitle
              : `We sent a 4-digit verification code to +91 ${predictLeadMobile.replace(/\D/g, '')} via WhatsApp.`}
          </p>
        </div>

        {/* Main Form Wrapping Content + Fixed Footer */}
        <form onSubmit={step === 'form' ? handleLeadSubmit : handleOtpVerify} className="flex flex-col grow min-h-0 overflow-hidden">
          {/* SCROLLABLE Inner Content Container */}
          <div className="overflow-y-auto grow pr-1 space-y-4 custom-scrollbar">
            {step === 'form' ? (
              <div className="space-y-4 text-left">
                {/* Contact Details Section */}
                <div className="space-y-4">
                  {/* Row 1: Full Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Full Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={predictLeadName}
                        onChange={(e) => setPredictLeadName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Email Address <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={predictLeadEmail}
                        onChange={(e) => setPredictLeadEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone + Home State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        WhatsApp / Phone <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={predictLeadMobile}
                        onChange={(e) => setPredictLeadMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 transition-colors font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Which state you belong to? <span className="text-amber-500">*</span>
                      </label>
                      <select
                        value={predictLeadHomeState}
                        onChange={(e) => setPredictLeadHomeState(e.target.value)}
                        className="w-full rounded-xl bg-[#0b0f19] border border-slate-800 px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st.code} value={st.name} className="bg-[#0b0f19] text-white">
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Preferred College */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Do you have any preferred college?
                    </label>
                    <MultiSelect
                      options={ALL_COLLEGE_OPTIONS}
                      selectedValues={predictPreferredColleges}
                      onChange={setPredictPreferredColleges}
                      placeholder="Search & select preferred colleges..."
                      isDark={true}
                    />
                  </div>
                </div>

                {/* Extra Academic Profile Fields (Only rendered when isCollegePredictor is true) */}
                {isCollegePredictor && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Academic Profile Details (Pre-filled)</span>
                    </div>

                    {/* Academic Row 1: Rank + Exam */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          NEET Rank
                        </label>
                        <input
                          type="text"
                          disabled
                          readOnly
                          value={profileRank || 'N/A'}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800/80 px-3.5 py-2 text-sm font-bold text-emerald-400 cursor-not-allowed opacity-80"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          Exam Type
                        </label>
                        <input
                          type="text"
                          disabled
                          readOnly
                          value={profileExam || 'NEET-UG'}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800/80 px-3.5 py-2 text-sm font-semibold text-slate-300 cursor-not-allowed opacity-80"
                        />
                      </div>
                    </div>

                    {/* Academic Row 2: Target Course + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          Target Course
                        </label>
                        <input
                          type="text"
                          disabled
                          readOnly
                          value={profileCourse || 'MBBS'}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800/80 px-3.5 py-2 text-sm font-semibold text-slate-300 cursor-not-allowed opacity-80"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          disabled
                          readOnly
                          value={profileCategory || 'General'}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800/80 px-3.5 py-2 text-sm font-semibold text-slate-300 cursor-not-allowed opacity-80"
                        />
                      </div>
                    </div>

                    {/* Academic Row 3: Preferred State(s) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Preferred State(s)
                      </label>
                      <div className="pointer-events-none opacity-80">
                        <MultiSelect
                          options={STATE_OPTIONS}
                          selectedValues={profileStates}
                          onChange={() => {}}
                          placeholder="Selected States..."
                          isDark={true}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* STEP 2: OTP Input Body */
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 text-center">
                    Enter 4-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="w-full rounded-2xl bg-[#0b0f19] border border-slate-700 px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] text-white placeholder:tracking-normal outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Resend OTP & Change Details Links */}
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Change Phone / Details
                  </button>

                  <button
                    type="button"
                    disabled={isResendDisabled || isLoading}
                    onClick={handleResendOtp}
                    className="text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isResendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FIXED FOOTER (Submit Button + Alerts + WhatsApp Notice) */}
          <div className="shrink-0 pt-3 mt-3 border-t border-slate-800/60 space-y-2">
            {successMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {formError && (
              <p className="text-xs text-rose-400 font-bold break-words text-center">{formError}</p>
            )}

            {step === 'form' ? (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending WhatsApp OTP...
                  </>
                ) : (
                  <>
                    Submit &amp; View Eligible Colleges <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || otp.trim().length !== 4}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying OTP &amp; Saving...
                  </>
                ) : (
                  <>
                    Verify OTP &amp; Continue <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <p className="text-[11px] text-slate-500 font-medium text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified WhatsApp OTP Delivery via Whatsapp</span>
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}