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
  description: 'Soluções de IA, infraestrutura e integração para empresas inovadoras. Capacite sua equipe com tecnologia de ponta.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
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
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H9MVWN7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="tracking-cookies" strategy="beforeInteractive">
          {`(function(){
  function getParam(n){var r=new RegExp('[?&]'+n+'=([^&#]*)').exec(location.href);return r?decodeURIComponent(r[1]):null}
  function setCookie(n,v,d){var x=new Date();x.setTime(x.getTime()+d*86400000);document.cookie=n+'='+v+';expires='+x.toUTCString()+';path=/;SameSite=Lax'}
  function getCookie(n){var m=document.cookie.match('(^|;)\\\\s*'+n+'\\\\s*=\\\\s*([^;]+)');return m?decodeURIComponent(m.pop()):''}
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'].forEach(function(p){
    var v=getParam(p);
    if(v){
      if(p==='fbclid'){
        if(!getCookie('_fbc')) setCookie('_fbc','fb.1.'+Math.floor(Date.now()/1000)+'.'+v,30);
      } else {
        setCookie(p,encodeURIComponent(v),30);
      }
    }
  });
  if(!getCookie('_fbp')) setCookie('_fbp','fb.1.'+Date.now()+'.'+Math.floor(Math.random()*2147483648),390);
})();`}
        </Script>
        <Script id="gtm-web" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5H9MVWN7');`}
        </Script>
        <Script id="lead-tracking" strategy="afterInteractive">
          {`(function(){
  function getCookie(n){var m=document.cookie.match('(^|;)\\\\s*'+n+'\\\\s*=\\\\s*([^;]+)');return m?decodeURIComponent(m.pop()):''}

  function fireLead(extra){
    var eventId='lead_'+Date.now()+'_'+Math.random().toString(36).slice(2,9);
    var src=(extra && extra.source) || 'cta';
    var contentName=(extra && extra.content_name) || 'moonrock-lp';

    var payload={
      event:'lead_submit',
      event_id:eventId,
      brand:'moonrock',
      source:src,
      content_name:contentName,
      event_source_url:location.href,
      user_data:{
        fbp:getCookie('_fbp'),
        fbc:getCookie('_fbc')
      },
      utms:{
        source:getCookie('utm_source'),
        medium:getCookie('utm_medium'),
        campaign:getCookie('utm_campaign'),
        content:getCookie('utm_content'),
        term:getCookie('utm_term')
      }
    };
    if(extra && extra.lead) payload.lead = extra.lead;

    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(payload);

    if(window.fbq){
      window.fbq('track','Lead',{
        content_name:contentName,
        value:0,
        currency:'BRL'
      },{eventID:eventId});
    }

    return eventId;
  }

  function isCTA(el){
    if(!el || !el.tagName) return false;
    var id=(el.id||'').toLowerCase();
    var cls=(el.className && el.className.toString && el.className.toString().toLowerCase())||'';
    var txt=(el.textContent||'').toLowerCase().trim();
    var href=(el.getAttribute && el.getAttribute('href'))||'';
    return /cta|btn-lead|btn-cta|comecar|fale-conosco|whatsapp|contato/.test(id+' '+cls)
        || /(falar|fale)\\s+(com|no)|whatsapp|começar|comece|quero|contato|orçamento|orcamento|agendar|demo/i.test(txt)
        || /wa\\.me|api\\.whatsapp\\.com|whatsapp\\.com|mailto:|tel:/i.test(href);
  }

  document.addEventListener('click', function(e){
    var t=e.target;
    if(t && t.closest && t.closest('[data-lead-no-auto]')) return;
    while(t && t!==document.body){
      if(isCTA(t)){
        fireLead({source:'cta_click', content_name:(t.id||t.className||'cta')});
        return;
      }
      t=t.parentElement;
    }
  }, true);

  window.fireLead = fireLead;
})();`}
        </Script>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  )
}
