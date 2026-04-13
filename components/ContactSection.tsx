"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import texts from "../app/texts/texts.json";

gsap.registerPlugin(ScrollTrigger);

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

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

export default function ContactSection({
  label = texts.contactSection.label,
  title = texts.contactSection.title,
  titleItalic = texts.contactSection.titleItalic,
  subtitle = texts.contactSection.subtitle,
  contactItems = texts.contactSection.contactItems,
  whatsappHref = texts.contactSection.whatsappHref,
  whatsappLabel = texts.contactSection.whatsappLabel,
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

      if (titleRef.current) {
        const chars = splitIntoChars(titleRef.current);

        gsap.fromTo(
          chars,
          { opacity: 0, y: 60, rotateX: -90 },
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

  const titleBase = title.replace(titleItalic, "").trim();
  const marqueeText = texts.contactSection.marqueeText;
  const marqueeRepeat = marqueeText.repeat(12);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-deep py-[clamp(6rem,14vw,10rem)] max-md:py-[clamp(4rem,10vw,6rem)]",
        className
      )}
    >
      <div
        ref={marqueeRef}
        className="absolute top-1/2 left-0 max-w-full w-screen -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          data-marquee-inner
          className="overflow-hidden whitespace-nowrap font-display text-[clamp(8rem,20vw,16rem)] font-light leading-none tracking-[-0.04em] text-accent/[0.03]"
        >
          {marqueeRepeat}
          {marqueeRepeat}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-10 max-lg:px-[30px] max-md:px-5">
        <div className="mb-[clamp(3rem,6vw,5rem)]">
          <span
            ref={labelRef}
            className="mb-[18px] block font-body text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-accent/50 opacity-0 motion-reduce:opacity-100!"
          >
            {label}
          </span>

          <h2
            ref={titleRef}
            className="mb-6 font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[1.05] tracking-[-0.03em] text-light motion-reduce:opacity-100! [perspective:800px]"
          >
            {titleBase} <em className="italic text-accent">{titleItalic}</em>
          </h2>

          <p
            ref={subtitleRef}
            className="max-w-[520px] font-body text-[clamp(0.9375rem,1.1vw,1.0625rem)] font-light leading-[1.75] text-light/50 opacity-0 motion-reduce:opacity-100!"
          >
            {subtitle}
          </p>
        </div>

        <div
          ref={lineRef}
          className="mb-[clamp(3rem,6vw,5rem)] h-px w-full origin-left bg-accent/10 motion-reduce:scale-x-100!"
        />

        <div className="mb-[clamp(4rem,8vw,6rem)] grid grid-cols-3 gap-[clamp(2rem,4vw,4rem)] max-md:grid-cols-1">
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => {
                contactRefs.current[i] = el;
              }}
              className="group opacity-0 motion-reduce:opacity-100!"
            >
              <span className="mb-3 block font-body text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent/40">
                {item.label}
              </span>

              {item.href ? (
                <a
                  href={item.href}
                  className="block font-display text-[clamp(1.25rem,2vw,1.75rem)] font-light leading-[1.3] tracking-[-0.01em] text-light/80 transition-colors duration-300 hover:text-accent"
                >
                  {item.value}
                </a>
              ) : (
                <span className="block whitespace-pre-line font-display text-[clamp(1.25rem,2vw,1.75rem)] font-light leading-[1.3] tracking-[-0.01em] text-light/80">
                  {item.value}
                </span>
              )}

              <div className="mt-4 h-px w-8 bg-accent/15 transition-all duration-500 ease-spring group-hover:w-16 group-hover:bg-accent/30" />
            </div>
          ))}
        </div>

        <div className="flex justify-center max-md:justify-start">
          <div
            ref={ctaWrapperRef}
            className="opacity-0 motion-reduce:opacity-100!"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xs bg-accent px-12 py-5 font-body text-[0.75rem] font-medium uppercase tracking-[0.18em] text-on-accent-soft max-md:px-10 max-md:py-4"
            >
              {whatsappLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}