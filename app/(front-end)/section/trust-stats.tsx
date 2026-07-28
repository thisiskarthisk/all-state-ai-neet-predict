// 'use client';

// import Reveal from './reveal';

// export default function TrustStats() {
//   return (
//     <section className="stats-band trust-stats" aria-label="Our track record">
//       <div className="container-cc">
//         <Reveal>
//           <div className="stats-grid">
//             <div className="stat">
//               <b>50,000+</b>
//               <span>Students Helped</span>
//             </div>
//             <div className="stat">
//               <b>1,20,000+</b>
//               <span>Predictions Generated</span>
//             </div>
//             <div className="stat">
//               <b>15,000+</b>
//               <span>Counselling Guidance Sessions</span>
//             </div>
//             <div className="stat">
//               <b>8,000+</b>
//               <span>Admission Success Stories</span>
//             </div>
//           </div>
//         </Reveal>
//       </div>
//     </section>
//   );
// }


// 'use client';

// import Reveal from './reveal';

// export default function TrustStats() {
//   return (
//     <section className="stats-band trust-stats" aria-label="Our track record">
//       <div className="container-cc">
//         <Reveal>
//           <div className="flex flex-col items-center justify-center text-center py-12 px-4">
//             <p className="text-3xl md:text-5xl font-extrabold text-[rgb(8, 61, 160)] tracking-wide animate-pulse drop-shadow-lg">
//               Open to students from every state — no Karnataka domicile needed
//             </p>
//           </div>
//         </Reveal>
//       </div>
//     </section>
//   );
// }



'use client';

import Reveal from './reveal';

export default function TrustStats() {
  return (
    <section
      className="w-full bg-gradient-to-r from-sky-500 to-teal-400 py-12 md:py-16 overflow-hidden"
      aria-label="Our track record"
    >
      <Reveal>
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <h2 className="trust-text">
            Open to students from every state — no Karnataka domicile needed
          </h2>
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
          font-size: clamp(20px, 3vw, 52px);

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