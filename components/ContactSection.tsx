"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   cn() — lightweight class merger
   ───────────────────────────────────────────── */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────
   splitIntoChars — for character-level animation
   ───────────────────────────────────────────── */
function splitIntoChars(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.innerHTML = "";
  const spans: HTMLSpanElement[] = [];
  for (const char of text) {
    const span = document.createElement("span");
    span.className = "inline-block";
    span.style.willChange = "transform, opacity";
    if (char === " ") {
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = char;
    }
    element.appendChild(span);
    spans.push(span);
  }
  return spans;
}

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
interface ContactInfo {
  label: string;
  value: string;
  href?: string;
}

interface ContactSectionProps {
  label?: string;
  title?: string;
  titleItalic?: string;
  subtitle?: string;
  contactItems?: ContactInfo[];
  whatsappHref?: string;
  whatsappLabel?: string;
  className?: string;
}


/* ─────────────────────────────────────────────
   DEFAULT DATA
   ───────────────────────────────────────────── */
const defaultContactItems: ContactInfo[] = [
  {
    label: "Telefone",
    value: "(11) 3889-0893",
    href: "tel:+551138890893",
  },
  {
    label: "Endereço",
    value: "Rua Itapeva, 286 — Cj. 82\nBela Vista, São Paulo — SP",
  },
  {
    label: "Horário",
    value: "Seg – Sex, 9h – 18h",
  },
];


/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function ContactSection({
  label = "05 — CONTATO",
  title = "Vamos conversar",
  titleItalic = "conversar",
  subtitle = "Agende uma consulta ou entre em contato para tirar suas dúvidas. Estamos à disposição para atendê-lo com excelência.",
  contactItems = defaultContactItems,
  whatsappHref = "https://wa.me/551138890893",
  whatsappLabel = "Agendar pelo WhatsApp",
  className = "",
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contactRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      /* ── Background marquee — continuous horizontal scroll ── */
      if (marqueeRef.current) {
        const marqueeInner = marqueeRef.current.querySelector(
          "[data-marquee-inner]"
        ) as HTMLElement;
        if (marqueeInner) {
          gsap.to(marqueeInner, {
            xPercent: -50,
            duration: 40,
            ease: "none",
            repeat: -1,
          });
        }

        // Parallax: marquee shifts vertically on scroll
        gsap.fromTo(
          marqueeRef.current,
          { yPercent: 0 },
          {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      /* ── Label reveal ── */
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      /* ── Title: character-by-character reveal ── */
      if (titleRef.current) {
        const chars = splitIntoChars(titleRef.current);

        gsap.fromTo(
          chars,
          {
            opacity: 0,
            y: 60,
            rotateX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      /* ── Subtitle ── */
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      /* ── Decorative line grows ── */
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      /* ── Contact items: stagger in with scale + Y ── */
      const validRefs = contactRefs.current.filter(Boolean);
      if (validRefs.length) {
        gsap.fromTo(
          validRefs,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: validRefs[0],
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      /* ── CTA button: simple fade in ── */
      if (ctaWrapperRef.current) {
        gsap.fromTo(
          ctaWrapperRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaWrapperRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Split title: "Vamos conversar" → "Vamos " + italic "conversar" */
  const titleBase = title.replace(titleItalic, "").trim();

  /* Marquee text repeated */
  const marqueeText = "Contato  ·  ";
  const marqueeRepeat = marqueeText.repeat(12);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden",
        "bg-deep",
        "py-[clamp(6rem,14vw,10rem)]",
        "max-md:py-[clamp(4rem,10vw,6rem)]",
        className,
      )}
    >
      {/* ══════════════════════════════════════
          BACKGROUND MARQUEE — subtle scrolling text
          ══════════════════════════════════════ */}
      <div
        ref={marqueeRef}
        className={cn(
          "absolute top-1/2 left-0 -translate-y-1/2",
          "w-screen max-w-full pointer-events-none select-none",
        )}
        aria-hidden="true"
      >
        <div
          data-marquee-inner
          className={cn(
            "overflow-hidden",
            "whitespace-nowrap",
            "font-display font-light",
            "text-[clamp(8rem,20vw,16rem)]",
            "leading-none tracking-[-0.04em]",
            "text-accent/[0.03]",
          )}
        >
          {marqueeRepeat}
          {marqueeRepeat}
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONTENT
          ══════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-[1320px] px-10 max-lg:px-[30px] max-md:px-5">
        {/* ── Header ── */}
        <div className="mb-[clamp(3rem,6vw,5rem)]">
          {/* Label */}
          <span
            ref={labelRef}
            className={cn(
              "block",
              "font-body text-[0.6875rem] font-medium",
              "tracking-[0.22em] uppercase",
              "text-accent/50 mb-[18px]",
              "opacity-0",
              "motion-reduce:opacity-100!",
            )}
          >
            {label}
          </span>

          {/* Title — char-by-char reveal */}
          <h2
            ref={titleRef}
            className={cn(
              "font-display",
              "text-[clamp(3rem,7vw,6rem)]",
              "font-light leading-[1.05] tracking-[-0.03em]",
              "text-light",
              "mb-6",
              "[perspective:800px]",
              "motion-reduce:opacity-100!",
            )}
          >
            {titleBase} <em className="italic text-accent">{titleItalic}</em>
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className={cn(
              "font-body text-[clamp(0.9375rem,1.1vw,1.0625rem)]",
              "font-light leading-[1.75]",
              "text-light/50 max-w-[520px]",
              "opacity-0",
              "motion-reduce:opacity-100!",
            )}
          >
            {subtitle}
          </p>
        </div>

        {/* ── Decorative line ── */}
        <div
          ref={lineRef}
          className={cn(
            "w-full h-px",
            "bg-accent/10",
            "origin-left",
            "mb-[clamp(3rem,6vw,5rem)]",
            "motion-reduce:scale-x-100!",
          )}
        />

        {/* ── Contact grid ── */}
        <div
          className={cn(
            "grid",
            "grid-cols-3 max-md:grid-cols-1",
            "gap-[clamp(2rem,4vw,4rem)]",
            "mb-[clamp(4rem,8vw,6rem)]",
          )}
        >
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { contactRefs.current[i] = el; }}
              className={cn(
                "group",
                "opacity-0",
                "motion-reduce:opacity-100!",
              )}
            >
              {/* Label */}
              <span
                className={cn(
                  "block",
                  "font-body text-[0.6875rem] font-semibold",
                  "tracking-[0.18em] uppercase",
                  "text-accent/40",
                  "mb-3",
                )}
              >
                {item.label}
              </span>

              {/* Value */}
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    "block",
                    "font-display text-[clamp(1.25rem,2vw,1.75rem)]",
                    "font-light leading-[1.3] tracking-[-0.01em]",
                    "text-light/80",
                    "transition-colors duration-300",
                    "hover:text-accent",
                  )}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className={cn(
                    "block whitespace-pre-line",
                    "font-display text-[clamp(1.25rem,2vw,1.75rem)]",
                    "font-light leading-[1.3] tracking-[-0.01em]",
                    "text-light/80",
                  )}
                >
                  {item.value}
                </span>
              )}

              {/* Subtle accent line under each item */}
              <div
                className={cn(
                  "mt-4 w-8 h-px",
                  "bg-accent/15",
                  "transition-all duration-500 ease-spring",
                  "group-hover:w-16 group-hover:bg-accent/30",
                )}
              />
            </div>
          ))}
        </div>

        {/* ── WhatsApp CTA ── */}
        <div className="flex justify-center max-md:justify-start">
          <div
            ref={ctaWrapperRef}
            className={cn(
              "opacity-0",
              "motion-reduce:opacity-100!",
            )}
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-block",
                "px-12 py-5 rounded-xs max-md:px-10 max-md:py-4",
                "bg-accent text-neutral/80",
                "font-body text-[0.75rem]",
                "font-medium tracking-[0.18em] uppercase",
              )}
            >
              {whatsappLabel}
            </a>
          </div>
        </div>

       
      </div>
    </section>
  );
}
