import { GOOGLE_ANALYTICS_ID, GTM_ID, MS_CLARITY_ID } from "@/constants";
import Script from "next/script";

function GoogleAnalyticsScript() {
  return (
    <>{
        GOOGLE_ANALYTICS_ID && <>
          <Script id="analytics-google-src" strategy="afterInteractive" async src={`https://www.googletagmanager.com/gtag/js?id=G-${GOOGLE_ANALYTICS_ID}`} />
          <Script id="analytics-google-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-${GOOGLE_ANALYTICS_ID}');
`.trim(),
          }} />
        </>
      }
    </>
  );
}

function GoogleTagsManagerHeadScript() {
  return (
    <>{
      GTM_ID && <Script id="analytics-gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-${GTM_ID}');
`.trim(),
        }} />
      }
    </>
  );
}

function GoogleTagsManagerBodyScript() {
  return (
    <>{
      GTM_ID && <>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=GTM-${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
      </>
    }</>
  );
}

function MSClarityScript() {
  return (
    <>{
        MS_CLARITY_ID && <Script id="analytics-msClarity" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${MS_CLARITY_ID}");
`.trim(),
        }} />
      }
    </>
  );
}

export function BodyAnalyticsScripts() {
  return (
    <>
      <GoogleTagsManagerHeadScript />
      <GoogleTagsManagerBodyScript />
      <GoogleAnalyticsScript />
      <MSClarityScript />
    </>
  );
}
