'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Mail, Globe, CheckCircle2 } from 'lucide-react';
import Header from '../section/header';
import Footer from '../section/footer';

const termsData = [
  {
    q: '1. About Campus Continents',
    content: (
      <div className="space-y-3">
        <p>Campus Continents provides digital tools and information relating to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>NEET Rank Prediction</li>
          <li>Medical College Prediction</li>
          <li>Medical Colleges</li>
          <li>Counselling Information</li>
          <li>Admission Resources</li>
        </ul>
        <p className="mt-2">Campus Continents is an independent information platform. We are not affiliated with or endorsed by:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>National Testing Agency (NTA)</li>
          <li>Medical Counselling Committee (MCC)</li>
          <li>National Medical Commission (NMC)</li>
          <li>Karnataka Examinations Authority (KEA)</li>
          <li>State Counselling Authorities</li>
          <li>Any Government Department or Medical College</li>
        </ul>
      </div>
    ),
  },
  {
    q: '2. Informational Purpose Only',
    content: (
      <p>
        The information available on Campus Continents is provided for educational and informational purposes only. Users should always verify counselling schedules, admission requirements, eligibility criteria, and official announcements through the respective counselling authorities before making admission decisions.
      </p>
    ),
  },
  {
    q: '3. Rank Predictor Disclaimer',
    content: (
      <div className="space-y-3">
        <p>The NEET Rank Predictor provides estimated rankings based on historical data and available trends. Predictions are estimates only.</p>
        <p>Campus Continents does not guarantee:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Official NEET Rank</li>
          <li>Admission into any college</li>
          <li>Seat Allotment</li>
          <li>Counselling Outcome</li>
        </ul>
        <p className="font-semibold text-slate-700">Only official counselling authorities determine admissions.</p>
      </div>
    ),
  },
  {
    q: '4. College Predictor Disclaimer',
    content: (
      <div className="space-y-3">
        <p>College predictions are generated using historical counselling trends and available admission data. Predictions are indicative and should not be considered guaranteed admission offers.</p>
        <p>Admission depends on factors including:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Official NEET Rank</li>
          <li>Reservation Category</li>
          <li>Seat Availability</li>
          <li>Counselling Rules</li>
          <li>Choice Filling</li>
          <li>Government Policies</li>
        </ul>
      </div>
    ),
  },
  {
    q: '5. Counselling Information',
    content: (
      <div className="space-y-3">
        <p>Campus Continents aims to provide accurate counselling information. However:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Counselling schedules may change.</li>
          <li>Authorities may revise dates.</li>
          <li>Colleges may update admission procedures.</li>
        </ul>
        <p className="font-semibold text-slate-700">Users must verify all information with the relevant official counselling authority before taking any action.</p>
      </div>
    ),
  },
  {
    q: '6. User Responsibilities',
    content: (
      <div className="space-y-2">
        <p>You agree to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Provide accurate information</li>
          <li>Use the platform lawfully</li>
          <li>Not misuse our prediction tools</li>
          <li>Not attempt unauthorised access</li>
          <li>Not reproduce or distribute website content without permission</li>
        </ul>
      </div>
    ),
  },
  {
    q: '7. Intellectual Property',
    content: (
      <div className="space-y-3">
        <p>All content on Campus Continents, including website design, software, predictors, databases, logos, graphics, text, and user interface, is the intellectual property of Campus Continents unless otherwise stated.</p>
        <p>No content may be copied, reproduced, or redistributed without prior written permission.</p>
      </div>
    ),
  },
  {
    q: '8. Third-Party Links',
    content: (
      <p>
        Our website may contain links to third-party websites. Campus Continents is not responsible for their content, policies, or services.
      </p>
    ),
  },
  {
    q: '9. Limitation of Liability',
    content: (
      <div className="space-y-3">
        <p>Campus Continents shall not be liable for:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Admission decisions</li>
          <li>Seat allotments</li>
          <li>Missed counselling deadlines</li>
          <li>Errors in official government notifications</li>
          <li>Educational or financial decisions made based on website information</li>
        </ul>
        <p className="font-semibold text-slate-700">Users remain responsible for verifying all official information.</p>
      </div>
    ),
  },
  {
    q: '10. Service Availability',
    content: (
      <p>
        We may modify, suspend, or discontinue any part of the website or its services without prior notice.
      </p>
    ),
  },
  {
    q: '11. Governing Law',
    content: (
      <p>
        These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
      </p>
    ),
  },
  {
    q: '12. Changes to These Terms',
    content: (
      <p>
        We reserve the right to update these Terms of Use at any time. Continued use of the website constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    q: '13. Consent for WhatsApp & Email Communications',
    content: (
      <div className="space-y-3">
        <p>
          Since Campus Continents collects information such as your name, email address, mobile number, WhatsApp number, Home State, NEET rank, and favourite medical colleges to deliver personalized counselling window alerts, this section sets clear expectations about what you will receive:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Personalized counselling timeline updates and seat allotment notifications.</li>
          <li>KEA and MCC official admission updates and choice-filling guidelines.</li>
          <li>Direct WhatsApp and Email alerts regarding counselling window openings for your selected colleges.</li>
        </ul>
        <p>You may opt out of promotional communications at any time by contacting us or following the unsubscribe instructions.</p>
      </div>
    ),
  },
  {
    q: '14. Contact Us',
    content: (
      <div className="space-y-2">
        <p className="font-bold text-slate-800">Campus Continents</p>
        <p>Website: <a href="https://campuscontinents.com" className="text-indigo-600 font-bold hover:underline">campuscontinents.com</a></p>
        <p>Email: <a href="mailto:info@campuscontinents.com" className="text-indigo-600 font-bold hover:underline">info@campuscontinents.com</a></p>
      </div>
    ),
  },
];

export default function TermsOfUsePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const toggleItem = (index: number) => {
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

      <main className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-extrabold tracking-wider uppercase mb-4">
              <ShieldCheck className="w-4 h-4" /> Terms of Use
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug mb-4">
              Terms of Use
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Effective Date: 27 July 2026. Welcome to Campus Continents. By using campuscontinents.com, you agree to these Terms of Use.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-14">
            {termsData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-xs ${
                    isOpen ? 'border-indigo-300 ring-2 ring-indigo-100/60 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left select-none transition-colors cursor-pointer"
                  >
                    <span className={`text-base sm:text-lg font-black transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isOpen ? 'rotate-180 bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-150 pt-4">
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Contact Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-800/60 rounded-3xl p-8 sm:p-10 text-center shadow-xl">
            <div className="text-indigo-400 text-xs font-black tracking-widest uppercase mb-2">
              Questions About Our Terms?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Contact Campus Continents
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 font-medium">
              If you have any questions regarding these Terms of Use, reach out to our team at{' '}
              <a href="mailto:info@campuscontinents.com" className="text-teal-400 font-bold hover:underline">
                info@campuscontinents.com
              </a>.
            </p>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}