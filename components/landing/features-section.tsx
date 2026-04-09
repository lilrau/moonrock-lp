"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Agentes inteligentes",
    description: "Substitua operadores humanos por agentes autônomos que trabalham 24/7, escalam infinitamente e mitigam erros. De atendimento ao cliente e vendas a processos administrativos, deixe os agentes cuidarem do trabalho pesado para você.",
    stats: { value: "99.7%", label: "taxa de conclusão" },
  },
  {
    number: "02",
    title: "Automações em escala",
    description: "Implemente fluxos de trabalho complexos com facilidade. Nossos agentes se integram e substituem perfeitamente planilhas e sistemas legados para automatizar tarefas em qualquer escala.",
    stats: { value: "50+", label: "processos automatizados" },
  },
  {
    number: "03",
    title: "Softwares de gestão",
    description: "Monitore e controle sua empresa com painéis intuitivos, sistemas financeiros, de estoque, funcionários e muito mais. Nossa inteligência mantêm tudo funcionando sem problemas, para que você possa se concentrar no crescimento.",
    stats: { value: "500+", label: "colaboradores conectados" },
  },
  {
    number: "04",
    title: "Segurança de dados",
    description: "Proteja suas informações com criptografia de ponta a ponta, protocolos de segurança e monitoramento proativo. Nossas soluções garantem que seus dados estejam seguros, para que você possa operar com confiança.",
    stats: { value: "0", label: "data breaches" },
  },
];

// Floating dot particles visualization
function ParticleVisualization({ trackingRef }: { trackingRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      mouseRef.current = {
        x: Math.min(1, Math.max(0, x)),
        y: Math.min(1, Math.max(0, y)),
      };
    };

    const handlePointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const trackingEl = trackingRef.current ?? canvas.parentElement;
    if (!trackingEl) return;

    trackingEl.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
    trackingEl.addEventListener("mousemove", handleMouseMove, { passive: true, capture: true });
    trackingEl.addEventListener("touchmove", handleTouchMove, { passive: true, capture: true });

    // Generate stable particle positions
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: ((seed * 127.1) % 1),
        by: ((seed * 311.7) % 1),
        phase: seed * Math.PI * 2,
        speed: 0.4 + (seed % 0.4),
        radius: 1.2 + (seed % 2.2),
      };
    });

    let time = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38;
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24;

        const bx = p.bx * w;
        const by = p.by * h;
        const dx = p.bx - mx;
        const dy = p.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist * 2.8);

        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36;
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36;

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      time += 0.016;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      trackingEl.removeEventListener("pointermove", handlePointerMove, true);
      trackingEl.removeEventListener("mousemove", handleMouseMove, true);
      trackingEl.removeEventListener("touchmove", handleTouchMove, true);
      cancelAnimationFrame(frameRef.current);
    };
  }, [trackingRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesTrackingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [isVisible, isPaused]);

  const goToFeature = (index: number) => {
    setActiveFeature(index);
  };

  const goToNextFeature = () => {
    setActiveFeature((current) => (current + 1) % features.length);
  };

  const goToPreviousFeature = () => {
    setActiveFeature((current) => (current - 1 + features.length) % features.length);
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header - Full width with diagonal layout */}
        <div className="relative mb-24 lg:mb-32">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-12 h-px bg-foreground/30" />
                Soluções
              </span>
              <h2
                className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Agentes
                <br />
                <span className="text-muted-foreground">inteligentes</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-4">
              <p className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                Substitua operadores humanos por agentes autônomos que trabalham 24/7, escalam infinitamente e mitigam erros. De atendimento ao cliente e vendas a processos administrativos, deixe os agentes cuidarem do trabalho pesado para você.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large feature card */}
          <div 
            className={`lg:col-span-12 relative bg-black border border-foreground/10 min-h-[500px] overflow-hidden group transition-all duration-700 flex ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left: text content */}
            <div ref={particlesTrackingRef} className="relative flex-1 p-8 lg:p-12 bg-black">
              <ParticleVisualization trackingRef={particlesTrackingRef} />
              <div className="relative z-10 min-h-[340px] lg:min-h-[360px]">
                {features.map((feature, index) => (
                  <article
                    key={feature.number}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      index === activeFeature
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6 pointer-events-none"
                    }`}
                  >
                    <span className="font-mono text-sm text-muted-foreground">{feature.number}</span>
                    <h3 className="text-3xl lg:text-4xl font-display mt-4 mb-6 group-hover:translate-x-2 transition-transform duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
                      {feature.description}
                    </p>
                    <div>
                      <span className="text-5xl lg:text-6xl font-display">{feature.stats.value}</span>
                      <span className="block text-sm text-muted-foreground font-mono mt-2">{feature.stats.label}</span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="relative z-10 mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6">
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => {
                    const isActive = index === activeFeature;
                    return (
                      <button
                        key={`feature-tab-${feature.number}`}
                        type="button"
                        onClick={() => goToFeature(index)}
                        className={`rounded-full border px-4 py-2 text-xs font-mono tracking-wide transition-all duration-300 ${
                          isActive
                            ? "border-foreground/60 bg-foreground text-background"
                            : "border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                        aria-pressed={isActive}
                        aria-label={`Ativar feature ${feature.number}: ${feature.title}`}
                      >
                        {feature.number}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousFeature}
                    className="h-10 w-10 rounded-full border border-foreground/20 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    aria-label="Feature anterior"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goToNextFeature}
                    className="h-10 w-10 rounded-full border border-foreground/20 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    aria-label="Próxima feature"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Right: mirrored image, full height */}
            <div className="hidden lg:block relative w-[42%] shrink-0 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2812%29-ng3RrNnsPMJ5CrtOjcPTmhHg01W11q.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
                style={{
                  transform: `scaleX(-1) scale(${1 + activeFeature * 0.03})`,
                  filter: `brightness(${0.9 + activeFeature * 0.03}) saturate(${1 + activeFeature * 0.08})`,
                }}
              />
              {/* Fade left edge into black */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <div className="flex items-center justify-between text-xs font-mono text-foreground/80 mb-3">
                  <span>{features[activeFeature].number}</span>
                  <span>{activeFeature + 1}/{features.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {features.map((feature, index) => (
                    <button
                      key={`progress-${feature.number}`}
                      type="button"
                      onClick={() => goToFeature(index)}
                      className="h-1.5 bg-white/20"
                      aria-label={`Selecionar ${feature.title}`}
                    >
                      <span
                        className={`block h-full bg-white transition-all duration-500 ${
                          index === activeFeature ? "w-full" : "w-0"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
