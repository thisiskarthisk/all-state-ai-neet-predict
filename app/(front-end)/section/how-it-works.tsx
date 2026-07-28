'use client';

import { BarChart2, LineChart, Target, ClipboardList, ArrowRight } from 'lucide-react';
import Reveal from './reveal';

interface HowItWorksSectionProps {
  switchTab?: (t: 'rank' | 'college') => void;
}

export default function HowItWorksSection({ switchTab }: HowItWorksSectionProps) {
  const steps = [
    {
      icon: <BarChart2 className="w-7 h-7 text-indigo-400" />,
      title: 'Expected Score Analysis',
      text: "Enter your expected NEET score and tell us how difficult you felt this year's exam was compared to previous years.",
    },
    {
      icon: <LineChart className="w-7 h-7 text-rose-400" />,
      title: 'Historical Trend Mapping',
      text: "We compare your score with previous years' NEET marks vs. rank data to estimate your likely All India Rank.",
    },
    {
      icon: <Target className="w-7 h-7 text-rose-500" />,
      title: 'Difficulty & Competition Adjustment',
      text: 'The same score can result in different ranks every year. Our prediction considers changes in exam difficulty and the number of candidates.',
    },
    {
      icon: <ClipboardList className="w-7 h-7 text-amber-400" />,
      title: 'Smarter Admission Planning',
      text: 'Your predicted rank helps you shortlist suitable Government, Private, and Deemed Medical Colleges before counselling begins.',
    },
  ];

  return (
    <section className="py-20 bg-white text-[#0a0e1a]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a0e1a] mb-4">
              How We Estimate Your NEET Rank
            </h2>
            <p className="text-[#5b6478] text-sm sm:text-base leading-relaxed">
              Understand how Campus Continents predicts your expected NEET UG rank using previous
              years' trends and your expected score.
            </p>
          </div>
        </Reveal>

        {/* Steps Grid / Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-6xl mx-auto mb-14">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="flex flex-col items-center text-center group relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0a0e1a] shadow-xl flex items-center justify-center text-white mb-6 border border-slate-800 transition-transform duration-200 group-hover:scale-105">
                  {step.icon}
                </div>
                <h3 className="text-base font-extrabold text-[#0a0e1a] mb-2.5">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#5b6478] leading-relaxed max-w-xs">
                  {step.text}
                </p>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 translate-x-1/2 text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Action Button */}
        <Reveal>
          <div className="text-center">
            <a
              href="#tools-section"
              onClick={() => switchTab && switchTab('rank')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#075389] to-[#0e6e5e] hover:from-[#075389] hover:to-[#0e6e5e] text-white font-bold text-sm shadow-lg shadow-sky-400/25 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Predict My NEET Rank
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}