'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '../../section/header';

const ugFaqData = [
  {
    q: 'What is NEET UG Counselling?',
    a: 'NEET UG Counselling is the admission process through which eligible candidates are allotted MBBS, BDS, and other undergraduate medical seats based on their NEET rank, category, choices filled, and seat availability. The counselling process begins after the NEET UG results are declared.',
  },
  {
    q: 'Who conducts NEET UG Counselling?',
    a: 'NEET UG counselling is conducted by two authorities: the Medical Counselling Committee (MCC) for 15% All India Quota (AIQ), AIIMS, JIPMER, Central Universities, ESIC, AFMC, and Deemed Universities; and State Counselling Authorities for 85% State Quota seats and admissions to state government and private medical colleges.',
  },
  {
    q: 'What is the difference between All India Quota (AIQ) and State Quota?',
    a: 'The 15% All India Quota (AIQ) allows eligible students from any state to compete for government medical seats across India. The 85% State Quota is managed by individual states and usually requires candidates to meet domicile or state eligibility criteria.',
  },
  {
    q: 'Who is eligible for NEET UG Counselling?',
    a: 'Candidates who qualify the NEET UG examination by securing the required qualifying percentile are eligible to participate in counselling. Eligibility for specific quotas depends on the counselling authority and applicable domicile or reservation rules.',
  },
  {
    q: 'How do I register for NEET UG Counselling?',
    a: 'Candidates must register online through the respective counselling portal, complete the application, pay the counselling fee, upload the required information, and participate in choice filling before the deadline. Separate registration is required for MCC counselling and each state counselling process.',
  },
  {
    q: 'Can I participate in both MCC and State Counselling?',
    a: 'Yes. Eligible candidates can participate in both MCC (All India Quota) counselling and their respective State Counselling simultaneously, improving their chances of securing a medical seat. Separate registrations are required.',
  },
  {
    q: 'How many rounds are there in NEET UG Counselling?',
    a: 'NEET UG counselling generally includes Round 1, Round 2, a Mop-Up Round, and a Stray Vacancy Round. Additional rounds may be conducted if seats remain vacant.',
  },
  {
    q: 'What is choice filling in NEET Counselling?',
    a: 'Choice filling is the process of selecting and arranging your preferred medical colleges and courses in order of preference. Seat allotment depends on your NEET rank, category, seat availability, and the order of choices you submit.',
  },
  {
    q: 'How should I fill my college choices?',
    a: 'List colleges in your genuine order of preference. Include ambitious, realistic, and safe options rather than selecting only top colleges. A well-planned choice list can significantly improve your chances of getting a seat.',
  },
  {
    q: 'Can I change my choices after submitting them?',
    a: 'Yes, but only during the choice-filling and editing period. Once the choice-locking deadline passes, your submitted choices are considered final for that counselling round.',
  },
  {
    q: 'How is the seat allotment decided?',
    a: 'Seat allotment is based on your NEET rank, reservation category, college preferences, seat availability, and counselling rules. Candidates with better ranks receive higher priority during allotment.',
  },
  {
    q: 'What documents are required for NEET UG Counselling?',
    a: 'Candidates generally need their NEET admit card, NEET scorecard/rank letter, Class 10 and 12 mark sheets and certificates, a valid photo ID, passport-size photographs, category certificate (if applicable), PwD certificate (if applicable), allotment letter (after seat allotment), and any other documents specified by the counselling authority.',
  },
  {
    q: 'What happens after seat allotment?',
    a: 'If allotted a seat, candidates must report to the allotted college within the specified time for document verification and admission confirmation. Failure to report may result in cancellation of the allotted seat.',
  },
  {
    q: 'Can I upgrade my allotted college in the next round?',
    a: 'Yes. Depending on the counselling rules and the round, eligible candidates may choose an upgradation option to participate in subsequent rounds for a higher-preference college.',
  },
  {
    q: 'What is the Mop-Up Round?',
    a: 'The Mop-Up Round is conducted after the main counselling rounds to fill vacant seats that remain unfilled. Eligible candidates who have not secured a seat or meet the eligibility conditions can participate.',
  },
  {
    q: 'What is the Stray Vacancy Round?',
    a: 'The Stray Vacancy Round is the final counselling round conducted to fill the remaining vacant seats after all previous rounds are completed. Eligibility and participation rules vary depending on the counselling authority.',
  },
  {
    q: 'What are the most common mistakes during NEET UG Counselling?',
    a: 'Common mistakes include missing registration deadlines, forgetting to lock choices, filling colleges in the wrong order, missing document verification, not reporting to the allotted college on time, and registering only for one counselling authority when eligible for multiple.',
  },
];

export default function UgFaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isFaqOpen, setIsFaqOpen] = useState(false);


  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans leading-relaxed">
      <Header
        isHomePage={false}
        isFaqPage={false}
        isFaqOpen={isFaqOpen}
        setIsFaqOpen={setIsFaqOpen}
        onGetCounsellingClick={() => {}}
      />
      <main className="min-h-screen bg-white text-[#0a0e1a] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#4d9bf5]/30 bg-[#4d9bf5]/10 text-[#4d9bf5] text-xs font-extrabold tracking-widest uppercase mb-5">
              FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#0a0e1a] tracking-tight leading-snug mb-4">
              Frequently Asked Questions About NEET UG Counselling
            </h1>
            <p className="text-[#5b6478] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Answers to the questions students search most — from MCC and state quota to choice filling, seat allotment, and document checklists.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 mb-12">
            {ugFaqData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`bg-[#f9fafc] border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen ? 'border-[#4d9bf5]/40 shadow-md' : 'border-slate-200/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left select-none transition-colors"
                  >
                    <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-[#4d9bf5]' : 'text-[#0a0e1a]'}`}>
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-gradient-to-r from-[#4d9bf5] to-[#2dd4bf] text-white'
                          : 'bg-[#4d9bf5]/10 text-[#4d9bf5]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#5b6478] leading-relaxed border-t border-slate-100/60 pt-3">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Card */}
          <div className="bg-gradient-to-br from-[#4d9bf5]/10 via-[#2dd4bf]/10 to-[#4d9bf5]/5 border border-[#4d9bf5]/20 rounded-3xl p-8 sm:p-10 text-center shadow-lg">
            <div className="text-[#2dd4bf] text-xs font-extrabold tracking-widest uppercase mb-3">
              How Campus Continents Helps
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a0e1a] tracking-tight mb-3">
              Everything you need in one place
            </h3>
            <p className="text-[#5b6478] text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6">
              Campus Continents helps you predict your NEET rank, explore medical colleges, compare admission options, save your favourite colleges, track counselling information, and receive personalised counselling details on WhatsApp and Email — making it easier to plan your medical admission journey.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#4d9bf5] to-[#2dd4bf] hover:from-[#3a8be7] hover:to-[#22c55e] text-white font-extrabold text-sm shadow-lg shadow-[#4d9bf5]/25 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Get My Personalised Counselling Update
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}