"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import texts from "../app/texts/texts.json";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   cn() — lightweight class merger
   ───────────────────────────────────────────── */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const about = texts.about;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(bodyRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bodyRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-bg"
      aria-label={about.ariaLabel}
    >
      <div className="mx-auto w-full max-w-330 px-6 md:px-10 lg:px-14">
        {/* ── Grid: headline | body ── */}
        <div
          className={cn(
            "grid grid-cols-1 gap-y-8",
            "pt-20 pb-0",
            "md:grid-cols-[1fr_360px] md:gap-x-16 md:pt-28 md:my-16",
            "lg:grid-cols-[1fr_400px] lg:gap-x-24"
          )}
        >
          {/* Headline */}
          <div className="flex flex-col">
            <h2
              ref={headlineRef}
              className={cn(
                "font-display",
                "text-[clamp(32px,5.2vw,80px)]",
                "font-light leading-[1.0] tracking-[-0.05em]",
                "text-ink",
                "antialiased"
              )}
            >
              {about.headline}
            </h2>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="md:self-end md:pb-1">
            <p
              className={cn(
                "font-body",
                "text-[clamp(14px,1vw,15px)]",
                "font-light leading-[1.75]",
                "text-ink-mid"
              )}
            >
              {about.bodyParts[0]}
              <strong className="font-medium">{about.bodyParts[1]}</strong>
              {about.bodyParts[2]}
            </p>
          </div>
        </div>

        {/* ── CTA Button ── */}
        <div
          ref={ctaRef}
          className="mt-6 pb-20 md:-mt-5 md:pb-28 max-w-[520px]"
        >
          <a
            href={about.ctaButtonHref}
            className={cn(
              "inline-block",
              "rounded-xs",
              "px-8 py-3.5",
              "bg-button text-white",
              "font-body text-[13px] font-medium",
              "tracking-[0.02em]",
              "no-underline",
              "transition-all duration-300 ease-spring",
              "hover:opacity-95  hover:text-white"
            )}
          >
            {about.ctaButtonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}