"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GEO_COOKIE, consentRequired } from "@/lib/geo";

/**
 * Meta (Facebook) Pixel.
 *
 * Inert unless NEXT_PUBLIC_META_PIXEL_ID is set, so local dev and preview
 * builds don't pollute the audience with our own traffic.
 *
 * Purpose today is audience building, not conversion optimisation: every
 * visitor becomes retargetable later at a fraction of cold-click cost.
 *
 * PRIVACY — the comment that used to sit here said "fine for US traffic; if we
 * ever market into the EU/UK we need a consent banner." That was written as a
 * future problem and had already become a present one: the app is live in EU
 * App Store and Play territories (Slovak and Dutch accounts created 2026-09-21
 * and 09-18), and getstroyka.com took ~41 EEA/UK visitors in 30 days with no
 * gate of any kind.
 *
 * Since we run no consent UI, this component now simply does not load where
 * opt-in is required. That is not a workaround — not setting the cookie is a
 * better answer than asking for permission to set it, and it costs nothing:
 * every campaign we run is targeted at the United States, so no EEA visitor
 * was ever attributable traffic.
 *
 * If you ever DO market into the EU, this gate is where a real consent banner
 * hooks in: keep the geo check, and let an explicit opt-in override it.
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // The middleware writes this on every matched request. Reading it in an
    // effect keeps the page statically rendered — see src/middleware.ts.
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${GEO_COOKIE}=([^;]*)`),
    );
    setAllowed(!consentRequired(match?.[1]));
  }, []);

  if (!pixelId || !allowed) return null;

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
