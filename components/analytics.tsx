import { GOOGLE_ANALYTICS_ID, GTM_ID, MS_CLARITY_ID, OPENAI_PIXEL_ID, OPENAI_PIXEL_DEBUG } from "@/constants";
import Script from "next/script";

function OpenAiPixelHeadScript() {
  return (
    <>
      {OPENAI_PIXEL_ID && (
        <Script
          id="analytics-openai-pixel"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}",debug:${OPENAI_PIXEL_DEBUG ? 'true' : 'false'}});
`.trim(),
          }}
        />
      )}
    </>
  );
}

export function HeadAnalyticsScripts() {
  return (
    <>
      <OpenAiPixelHeadScript />
    </>
  );
}

export function triggerOpenAiPixel() {
  if (typeof window === 'undefined') return;

  const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || OPENAI_PIXEL_ID || "Xae3JP7Nc4xnkyifrMB8B8";
  const isDebug = process.env.NEXT_PUBLIC_OPENAI_PIXEL_DEBUG === 'true' || OPENAI_PIXEL_DEBUG || true;

  try {
    const w = window as any;
    const d = document;

    // Guard: Prevent duplicate script injection
    const existingScript = d.querySelector('script[src*="oaiq.min.js"]');
    if (!w.oaiq && !existingScript) {
      const q: any = function () {
        q.q.push(arguments);
      };
      q.q = [];
      w.oaiq = q;

      const j = d.createElement('script');
      j.async = true;
      j.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
      const f = d.getElementsByTagName('script')[0];
      if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
      } else {
        d.head.appendChild(j);
      }
    }

    // Guard: Ensure init is called only once
    if (!w._oaiq_initialized && w.oaiq) {
      w.oaiq('init', { pixelId, debug: isDebug });
      w._oaiq_initialized = true;
    }

    // Fire the Lead event
    if (w.oaiq) {
      w.oaiq('event', 'Lead');
    }
  } catch (err) {
    console.warn('[OpenAI Pixel] Error executing pixel script:', err);
  }
}

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
