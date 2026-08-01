import { GOOGLE_ANALYTICS_ID, GTM_ID, MS_CLARITY_ID } from '@/constants';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BodyAnalyticsScripts } from '@/components/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEET Rank & College Predictor | AIQ Cutoff Data',
  description: 'See which MBBS, BDS and other medical colleges you can get with your NEET rank or marks — compare Government, Private and Deemed options across India using real cutoff data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <BodyAnalyticsScripts />
      </body>
    </html>
  );
}
