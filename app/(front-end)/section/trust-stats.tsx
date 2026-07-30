'use client';

import Reveal from './reveal';

interface TrustStatsProps {
  mode?: 'karnataka' | 'allstate';
}

export default function TrustStats({ mode = 'allstate' }: TrustStatsProps) {
  const isKarnataka = mode === 'karnataka';

  return (
    <section
      className="w-full bg-gradient-to-r from-sky-500 to-teal-400 py-12 md:py-16 overflow-hidden"
      aria-label="Our track record"
    >
      <Reveal>
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <h3 className="trust-text">
            {isKarnataka
              ? 'Open to students from every state — no Karnataka domicile needed'
              : 'Which MBBS college can you get? Compare Government, Private & Deemed colleges across India.'}
          </h3>
        </div>
      </Reveal>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .trust-text {
          animation: fadeInScale 1s ease forwards;

          color: #0f172a;
          font-weight: 800;
          text-align: center;
          line-height: 1.2;

          /* Decrease font size */
          font-size: clamp(20px, 3vw, 35px);

          /* Keep on one line on desktop */
          white-space: nowrap;

          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .trust-text {
            font-size: 34px;
          }
        }

        @media (max-width: 768px) {
          .trust-text {
            white-space: normal;
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .trust-text {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}