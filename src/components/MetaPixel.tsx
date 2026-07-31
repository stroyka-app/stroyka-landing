import Script from "next/script";

/**
 * Meta (Facebook) Pixel.
 *
 * Inert unless NEXT_PUBLIC_META_PIXEL_ID is set, so local dev and preview
 * builds don't pollute the audience with our own traffic.
 *
 * Purpose today is audience building, not conversion optimisation: every
 * visitor becomes retargetable later at a fraction of cold-click cost. We are
 * not running ads yet — see Marketing/Signals in the Stroyka vault for why.
 *
 * PRIVACY: this sets third-party cookies. Fine for US traffic; if we ever
 * market into the EU/UK we need a consent banner gating this component, and
 * GDPR requires opt-IN before it loads. Do not ship EU campaigns without it.
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
