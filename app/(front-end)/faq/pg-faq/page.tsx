'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '../../section/header';


const pgFaqData = [
  {
    q: 'What is NEET PG Counselling?',
    a: 'NEET PG Counselling is the centralized admission process for MD, MS, PG Diploma, DNB, and other postgraduate medical courses. Seat allotment is based on the NEET PG rank, reservation category, choices filled, and seat availability.',
  },
  {
    q: 'Who conducts NEET PG Counselling?',
    a: 'The Medical Counselling Committee (MCC) conducts counselling for 50% All India Quota (AIQ) seats, Central Universities, Deemed Universities, ESIC institutions, and Armed Forces Medical Services registrations. State counselling authorities conduct admissions for the remaining State Quota seats.',
  },
  {
    q: 'Can I participate in both AIQ and State PG Counselling?',
    a: 'Yes. Eligible candidates can participate in both MCC All India Quota counselling and their respective state counselling. Separate registration is required for each counselling authority.',
  },
  {
    q: 'What courses are offered through NEET PG Counselling?',
    a: 'NEET PG counselling includes admissions to MD, MS, PG Diploma, DNB, Diploma (Post MBBS), and other postgraduate medical courses offered by participating institutions.',
  },
  {
    q: 'How many rounds are there in NEET PG Counselling?',
    a: 'NEET PG counselling generally consists of Round 1, Round 2, Round 3, and the Stray Vacancy Round. Additional rounds may be conducted if seats remain vacant.',
  },
  {
    q: 'How do I register for NEET PG Counselling?',
    a: 'Candidates must register online through the MCC portal for All India Quota counselling and separately through the respective state counselling portals for State Quota admissions. Registration includes fee payment, choice filling, and document submission.',
  },
  {
    q: 'What is choice filling in NEET PG Counselling?',
    a: 'Choice filling is the process of selecting and prioritizing your preferred colleges and specialties. Your final allotment depends on your NEET PG rank, reservation category, preferences, and seat availability.',
  },
  {
    q: 'Can I change my choices after submitting them?',
    a: 'Yes. You can modify your choices until the choice-locking deadline. Once choices are locked, they cannot usually be changed for that counselling round.',
  },
  {
    q: 'How is the NEET PG seat allotment decided?',
    a: 'Seat allotment is based on your NEET PG rank, reservation category, specialty preferences, college choices, and the availability of seats during each counselling round.',
  },
  {
    q: 'What documents are required for NEET PG Counselling?',
    a: 'Candidates typically need their NEET PG admit card, NEET PG scorecard, MBBS degree or provisional certificate, permanent or provisional medical registration certificate, internship completion certificate, a valid photo ID, category certificate (if applicable), PwD certificate (if applicable), and the allotment letter after seat allotment.',
  },
  {
    q: 'Can I upgrade my allotted seat in the next counselling round?',
    a: 'Yes. Depending on the counselling rules, candidates may opt for upgradation to a higher-preference specialty or college in subsequent rounds.',
  },
  {
    q: 'What is the Stray Vacancy Round in NEET PG Counselling?',
    a: 'The Stray Vacancy Round is the final counselling stage conducted to fill seats that remain vacant after the regular counselling rounds. Only eligible candidates can participate according to MCC or state counselling rules.',
  },
  {
    q: 'Can I resign from my allotted seat?',
    a: 'The resignation and exit rules differ by counselling round and counselling authority. Candidates should carefully review the applicable MCC or state counselling guidelines before making a decision.',
  },
  {
    q: 'What are the common mistakes to avoid during NEET PG Counselling?',
    a: 'Some common mistakes include missing registration deadlines, filling unrealistic specialty preferences, not locking choices, missing document verification, failing to report to the allotted college on time, and registering only for MCC or only for State Counselling when eligible for both.',
  },
];

export default function PgFaqPage() {
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
                Frequently Asked Questions About NEET PG Counselling
              </h1>
              <p className="text-[#5b6478] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Answers to the questions doctors search most — from MCC and AIQ to specialty choice filling, seat allotment, and document checklists.
              </p>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3 mb-12">
              {pgFaqData.map((item, index) => {
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
                Campus Continents helps you explore postgraduate medical colleges, compare specialties, review previous cutoff trends, save your favourite colleges, access counselling information, and receive personalised counselling details on WhatsApp and Email to make informed admission decisions.
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