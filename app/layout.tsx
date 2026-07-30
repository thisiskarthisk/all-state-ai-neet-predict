import { GTM_ID } from '@/constants';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEET Rank & College Predictor | AIQ Cutoff Data',
  description: 'See which MBBS, BDS and other medical colleges you can get with your NEET rank or marks — compare Government, Private and Deemed options across India using real cutoff data.',
};

const GTM_SCRIPT = () => (`
(function(w, d, s, l, i) {
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});

  var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';

  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
}) (window, document, 'script', 'dataLayer', 'GTM-${GTM_ID}');
`.trim());

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        {/* Google Tag Manager Script Injection */}
        {
          GTM_ID && <Script strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: GTM_SCRIPT(),
          }} />
        }
      </Head>

      <body className={inter.className}>
        {children}

        {/* Google Tag Manager (noscript) Fallback Injection */}
        {
          GTM_ID && <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=GTM-${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }} />
            </noscript>
        }
      </body>
    </html>
  );
}
