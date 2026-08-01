import { GTM_ID, MS_CLARITY_ID } from '@/constants';
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

const GTM_SCRIPT = (id: string) => (`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-${id}');
`.trim());

const MS_CLARITY_SCRIPT = (id: string) => (`
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${id}");
`.trim());

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        {/* Google Tag Manager Script Injection */}
        {
          GTM_ID && <>
            <Script strategy="afterInteractive" async src={`https://www.googletagmanager.com/gtag/js?id=G-${GTM_ID}`} />
            <Script strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html: GTM_SCRIPT(GTM_ID),
            }} />
          </>
        }
        {/* Microsoft Clarity Script Injection */}
        {
          MS_CLARITY_ID && <Script strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: MS_CLARITY_SCRIPT(MS_CLARITY_ID),
          }} />
        }
      </body>
    </html>
  );
}
