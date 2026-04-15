"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  buildLeadWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "_fbc",
  "_fbp",
] as const;

type TrackingKey = (typeof TRACKING_KEYS)[number];

function getCookie(name: string): string {
  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? decodeURIComponent(match.pop() || "") : "";
}

function emptyTrackingValues(): Record<TrackingKey, string> {
  return TRACKING_KEYS.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as Record<TrackingKey, string>);
}

/** Atualiza hidden fields com cookies atuais (ex.: `_fbp` após o Pixel carregar). */
function syncTrackingCookiesToForm(form: HTMLFormElement) {
  for (const key of TRACKING_KEYS) {
    const el = form.querySelector<HTMLInputElement>(`[name="${key}"]`);
    if (el) el.value = getCookie(key);
  }
}

function pushGtmLeadEvent(
  eventName: "lead_submit" | "lead_callback_request",
  eventIdPrefix: string,
  formData: Record<string, string>
) {
  const eventId = `${eventIdPrefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  const win = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: eventName,
    event_id: eventId,
    brand: "moonrock",
    lead: {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      empresa: formData.empresa,
      vertical: formData.vertical,
    },
    utms: {
      source: formData.utm_source,
      medium: formData.utm_medium,
      campaign: formData.utm_campaign,
      content: formData.utm_content,
      term: formData.utm_term,
    },
  });
}

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leadFormRef = useRef<HTMLFormElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trackingValues, setTrackingValues] =
    useState<Record<TrackingKey, string>>(emptyTrackingValues);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captureKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
    ];
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + 30 * 24 * 60 * 60 * 1000);

    captureKeys.forEach((key) => {
      const value = params.get(key);
      if (!value) return;
      document.cookie = `${key}=${encodeURIComponent(
        value
      )}; expires=${expiration.toUTCString()}; path=/; SameSite=Lax`;
    });

    const fbclid = params.get("fbclid");
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      document.cookie = `_fbc=${fbc}; expires=${expiration.toUTCString()}; path=/; SameSite=Lax`;
    }

    const nextValues = TRACKING_KEYS.reduce((acc, key) => {
      acc[key] = getCookie(key);
      return acc;
    }, {} as Record<TrackingKey, string>);

    setTrackingValues(nextValues);
  }, []);

  const handleLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    syncTrackingCookiesToForm(form);
    const formData = Object.fromEntries(
      new FormData(form).entries()
    ) as Record<string, string>;

    pushGtmLeadEvent("lead_submit", "lead", formData);

    const url = buildWhatsAppUrl(
      buildLeadWhatsAppMessage({
        nome: formData.nome,
        empresa: formData.empresa,
        vertical: formData.vertical,
      })
    );

    setTimeout(() => {
      window.location.assign(url);
    }, 400);
  };

  const handleCallbackRequest = () => {
    const form = leadFormRef.current;
    if (!form) return;
    syncTrackingCookiesToForm(form);
    const formData = Object.fromEntries(
      new FormData(form).entries()
    ) as Record<string, string>;
    pushGtmLeadEvent("lead_callback_request", "callback", formData);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`
            }}
          />
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <h2 className="text-6xl md:text-7xl lg:text-[72px] font-display tracking-tight mb-8 leading-[0.95]">
                  Pronto para o seu negócio fora de órbita com a Moon?
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Descubra como a Moon pode impulsionar sua empresa para o próximo nível. Agende uma conversa personalizada e entendar o poder da nossa tecnologia em no seu negócio.
                </p>

                <form
                  id="lead-form"
                  ref={leadFormRef}
                  onSubmit={handleLead}
                  className="w-full max-w-2xl space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      name="nome"
                      required
                      placeholder="Seu nome"
                      className="h-12 px-4 rounded-full border border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="E-mail"
                      className="h-12 px-4 rounded-full border border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      name="telefone"
                      required
                      placeholder="WhatsApp"
                      className="h-12 px-4 rounded-full border border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      name="empresa"
                      required
                      placeholder="Empresa"
                      className="h-12 px-4 rounded-full border border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <select
                    name="vertical"
                    required
                    defaultValue=""
                    className="w-full h-12 px-4 rounded-full border border-foreground/20 bg-background text-foreground"
                  >
                    <option value="" disabled>
                      Vertical da operacao
                    </option>
                    <option value="comercio">Comercio</option>
                    <option value="servicos">Servicos</option>
                    <option value="industria">Industria</option>
                    <option value="outro">Outro</option>
                  </select>

                  {TRACKING_KEYS.map((key) => (
                    <input
                      key={key}
                      type="hidden"
                      name={key}
                      value={trackingValues[key]}
                      readOnly
                    />
                  ))}

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
                    >
                      Falar com socio no WhatsApp
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
                      onClick={handleCallbackRequest}
                    >
                      Quero que a Moon me chame
                    </Button>
                  </div>
                </form>

              </div>

              {/* Right image */}
              <div className="hidden lg:flex items-end justify-center w-[600px] h-[650px] -mr-16">
                <img
                  src="/images/bridge.png"
                  alt="Two trees connected by glowing arcs"
                  className="w-full h-full object-contain object-bottom"
                />
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
