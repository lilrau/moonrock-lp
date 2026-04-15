import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import './globals.css'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'MoonRock - Soluções Técnológicas',
  description: 'Soluções de IA, infraestrutura e integração para empresas inovadoras. Capacite sua equipe com tecnologia de ponta.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://sgtm-production-540b.up.railway.app/ns.html?id=GTM-5H9MVWN7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="tracking-cookies" strategy="beforeInteractive">
          {`(function(){
  var params = new URLSearchParams(window.location.search);
  var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'];
  var exp = new Date(); exp.setTime(exp.getTime() + 30*24*60*60*1000);
  keys.forEach(function(k){
    var v = params.get(k);
    if(v) document.cookie = k+'='+encodeURIComponent(v)+'; expires='+exp.toUTCString()+'; path=/; SameSite=Lax';
  });
  if(params.get('fbclid')){
    var fbc = 'fb.1.'+Date.now()+'.'+params.get('fbclid');
    document.cookie = '_fbc='+fbc+'; expires='+exp.toUTCString()+'; path=/; SameSite=Lax';
  }
})();`}
        </Script>
        <Script id="gtm-web" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://sgtm-production-540b.up.railway.app/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5H9MVWN7');`}
        </Script>
        <Script id="meta-pixel-fallback" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://sgtm-production-540b.up.railway.app/fbevents.js');
fbq('init', '927710820235665');
fbq('track', 'PageView');`}
        </Script>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://sgtm-production-540b.up.railway.app/tr?id=927710820235665&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Analytics />
      </body>
    </html>
  )
}
