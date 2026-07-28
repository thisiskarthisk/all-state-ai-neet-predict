'use client';

import React, { useState } from 'react';
import { ChevronDown, Lock, Mail, Globe } from 'lucide-react';
import Header from '../section/header';

const privacyData = [
  {
    q: '1. About Campus Continents',
    content: (
      <p>
        Campus Continents is a medical admissions platform that helps students predict NEET Rank, discover eligible medical colleges, compare Government, Private and Deemed Medical Colleges, access counselling information, save favourite colleges, and receive personalised counselling windows and admission information through WhatsApp and Email. Campus Continents is an independent information platform and is not affiliated with any government counselling authority. (campuscontinents.com)
      </p>
    ),
  },
  {
    q: '2. Information We Collect',
    content: (
      <div className="space-y-3">
        <p className="font-bold text-slate-800">Information You Provide:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Mobile Number</li>
          <li>WhatsApp Number</li>
          <li>Home State &amp; Target State</li>
          <li>NEET Rank or Expected Rank</li>
          <li>Category</li>
          <li>Preferred Course</li>
          <li>Favourite Medical Colleges</li>
          <li>Information submitted through enquiry forms</li>
        </ul>
        <p className="font-bold text-slate-800 pt-2">Automatically Collected Information:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>IP Address</li>
          <li>Browser Information</li>
          <li>Device Information</li>
          <li>Operating System</li>
          <li>Pages Visited</li>
          <li>Session Duration</li>
          <li>Cookies</li>
          <li>Analytics Data</li>
        </ul>
      </div>
    ),
  },
  {
    q: '3. How We Use Your Information',
    content: (
      <div className="space-y-3">
        <p>Your information may be used to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Provide NEET Rank Prediction</li>
          <li>Display eligible medical colleges</li>
          <li>Save your favourite colleges</li>
          <li>Generate personalised college recommendations</li>
          <li>Send personalised counselling windows via WhatsApp and Email</li>
          <li>Respond to enquiries</li>
          <li>Improve website performance</li>
          <li>Analyse user behaviour</li>
          <li>Prevent fraud and misuse</li>
          <li>Communicate updates regarding our services</li>
        </ul>
        <p className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
          We do not sell your personal information.
        </p>
      </div>
    ),
  },
  {
    q: '4. WhatsApp & Email Communications',
    content: (
      <div className="space-y-3">
        <p>
          If you request personalised counselling information, Campus Continents may send information relating to your selected medical colleges, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Counselling windows</li>
          <li>Important admission timelines</li>
          <li>Counselling announcements</li>
          <li>College-specific admission information</li>
        </ul>
        <p>These communications are personalised based on the colleges you choose within the platform.</p>
        <p className="font-semibold text-slate-700">You may opt out of promotional communications at any time.</p>
      </div>
    ),
  },
  {
    q: '5. Cookies',
    content: (
      <div className="space-y-3">
        <p>We use cookies to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Improve website functionality</li>
          <li>Remember user preferences</li>
          <li>Analyse website traffic</li>
          <li>Improve user experience</li>
        </ul>
        <p>You may disable cookies through your browser settings, although some features may not function correctly.</p>
      </div>
    ),
  },
  {
    q: '6. Third-Party Services',
    content: (
      <div className="space-y-3">
        <p>We may use third-party services including:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Google Analytics</li>
          <li>Google Ads</li>
          <li>Meta Pixel</li>
          <li>Email Service Providers</li>
          <li>WhatsApp Business Platform</li>
          <li>CRM Systems</li>
        </ul>
        <p>These providers process information according to their own privacy policies.</p>
      </div>
    ),
  },
  {
    q: '7. Data Security',
    content: (
      <p>
        We implement reasonable administrative, technical, and organisational safeguards to protect your information. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    q: '8. Data Retention',
    content: (
      <div className="space-y-2">
        <p>We retain personal information only for as long as necessary to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Provide our services</li>
          <li>Improve our platform</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
        </ul>
      </div>
    ),
  },
  {
    q: '9. Your Rights',
    content: (
      <div className="space-y-3">
        <p>Subject to applicable law, you may request to:</p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
          <li>Access your information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information</li>
          <li>Withdraw consent</li>
          <li>Opt out of marketing communications</li>
        </ul>
        <p>Please contact us using the details below.</p>
      </div>
    ),
  },
  {
    q: '10. Children’s Privacy',
    content: (
      <p>
        Campus Continents is intended for students and parents seeking admission information. If you believe personal information has been collected inappropriately, please contact us.
      </p>
    ),
  },
  {
    q: '11. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any changes become effective immediately after publication on this page.
      </p>
    ),
  },
  {
    q: '12. Contact Us',
    content: (
      <div className="space-y-2">
        <p className="font-bold text-slate-800">Campus Continents</p>
        <p>Website: <a href="https://campuscontinents.com" className="text-indigo-600 font-bold hover:underline">campuscontinents.com</a></p>
        <p>Email: <a href="mailto:info@campuscontinents.com" className="text-indigo-600 font-bold hover:underline">info@campuscontinents.com</a></p>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
              <Lock className="w-4 h-4" /> Privacy Policy
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Effective Date: 27 July 2026. This Privacy Policy explains how Campus Continents collects, uses, discloses, and protects your information when you use campuscontinents.com.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-14">
            {privacyData.map((item, index) => {
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
              Questions About Your Data?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              We&apos;re Here to Help
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 font-medium">
              If you have any questions about how your information is collected or protected, reach out to us at{' '}
              <a href="mailto:info@campuscontinents.com" className="text-teal-400 font-bold hover:underline">
                info@campuscontinents.com
              </a>.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}