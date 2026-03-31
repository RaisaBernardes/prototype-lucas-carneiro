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
   TYPES
   ───────────────────────────────────────────── */
interface Testimonial {
  quote: string;
  name: string;
  date?: string;
  image?: string;
}

interface TestimonialsMarqueeProps {
  label?: string;
  title?: string;
  titleAccent?: string;
  testimonials?: Testimonial[];
  className?: string;
}

/* ─────────────────────────────────────────────
   DEFAULT DATA
   ───────────────────────────────────────────── */
const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "Working with her was the single most transformative professional experience of my life. She saw what I couldn't see in myself.",
    name: "Daniel Kramer",
    date: "March 2026",
  },
  {
    quote:
      "She doesn't coach you toward her answers — she coaches you toward your own clarity.",
    name: "Sofia Almqvist",
    date: "February 2026",
  },
  {
    quote:
      "Three months in, I had left a career that was killing me and started the company I'd been dreaming about for a decade.",
    name: "Marcus Webb",
    date: "January 2026",
  },
  {
    quote:
      "What surprised me most was how quickly she cut through the noise. Session one, she named the exact pattern I'd been running from.",
    name: "Lena Horowitz",
    date: "December 2025",
  },
  {
    quote:
      "I went in thinking I needed a strategy. I left with a spine.",
    name: "Thomas Eriksson",
    date: "November 2025",
  },
  {
    quote:
      "She has this rare ability to hold space for your vulnerability while also holding you accountable to your potential.",
    name: "Amara Chen",
    date: "October 2025",
  },
  {
    quote:
      "Before coaching, I was successful but exhausted. After, I was successful and alive. That distinction changed everything.",
    name: "James Aldridge",
    date: "September 2025",
  },
  {
    quote:
      "The ROI conversation misses the point entirely. You can't put a number on finally understanding who you are at your best.",
    name: "Nina Vasquez",
    date: "August 2025",
  },
  {
    quote:
      "I've had executive coaches before. They gave me frameworks. She gave me the courage to stop hiding behind them.",
    name: "Oliver Strauss",
    date: "July 2025",
  },
  {
    quote:
      "She asked me one question in our first session that I'm still answering six months later. That's the mark of a real coach.",
    name: "Rachel Fontaine",
    date: "June 2025",
  },
];

/* ─────────────────────────────────────────────
   TESTIMONIAL CARD
   ───────────────────────────────────────────── */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      data-card
      className={cn(
        "relative flex-shrink-0",
        "w-[340px] min-h-[280px]",
        "max-[1200px]:w-[300px]",
        "max-lg:w-[280px] max-lg:min-h-[260px]",
        "max-md:w-full max-md:min-h-0",
        "bg-white border border-ink/8",
        "p-[clamp(1.75rem,2.5vw,2.25rem)]",
        "max-md:p-[clamp(1.25rem,4vw,1.75rem)]",
        "flex flex-col justify-between",
        "cursor-default overflow-hidden",
        "transition-[border-color,box-shadow] duration-400",
        "ease-spring",
        "hover:border-ink/14 hover:shadow-[0_4px_32px_rgba(25,25,23,0.04)]",
        "motion-reduce:opacity-100! motion-reduce:translate-y-0!",
        "motion-reduce:rotate-0! motion-reduce:transition-none!",
      )}
    >
      {/* Quote mark */}
      <span
        className={cn(
          "block pointer-events-none select-none",
          "font-serif text-5xl max-md:text-4xl",
          "font-light leading-none",
          "text-green/30 mb-2",
        )}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote
        className={cn(
          "font-serif italic",
          "text-[clamp(0.9375rem,1.2vw,1.0625rem)]",
          "max-md:text-[0.9375rem]",
          "font-normal leading-[1.6]",
          "text-ink/75",
          "m-0 flex-grow",
        )}
      >
        {testimonial.quote}
      </blockquote>

      {/* Footer: divider + name + date */}
      <div className="mt-6 pt-4">
        {/* Accent divider */}
        <div className="w-6 h-px bg-green/40 mb-3" />

        <p
          className={cn(
            "font-body text-xs font-semibold",
            "tracking-[0.1em] uppercase",
            "text-ink m-0",
          )}
        >
          {testimonial.name}
        </p>

        {testimonial.date && (
          <p
            className={cn(
              "font-body text-[0.625rem] font-normal",
              "tracking-[0.06em]",
              "text-ink/40 mt-1 mb-0",
            )}
          >
            {testimonial.date}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function TestimonialsMarquee({
  label = "DEPOIMENTOS",
  title = "O que meus pacientes",
  titleAccent = "dizem",
  testimonials = defaultTestimonials,
  className = "",
}: TestimonialsMarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mobileStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      if (row1Ref.current) {
        gsap.set(row1Ref.current.querySelectorAll("[data-card]"), {
          opacity: 1,
          y: 0,
        });
      }
      if (row2Ref.current) {
        gsap.set(row2Ref.current.querySelectorAll("[data-card]"), {
          opacity: 1,
          y: 0,
        });
      }
      if (mobileStackRef.current) {
        gsap.set(mobileStackRef.current.querySelectorAll("[data-card]"), {
          opacity: 1,
          y: 0,
        });
      }
      gsap.set([labelRef.current, titleRef.current], { opacity: 1, y: 0 });
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        },
      });

      headerTl
        .from(labelRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
        })
        .from(
          titleRef.current,
          { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        );

      if (isMobile) {
        /* ── Mobile: elegant staggered reveal per card ── */
        const mobileCards =
          mobileStackRef.current?.querySelectorAll("[data-card]");
        if (mobileCards?.length) {
          gsap.set(Array.from(mobileCards), { opacity: 0, y: 40 });

          Array.from(mobileCards).forEach((card) => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true,
              },
            });
          });
        }
      } else {
        /* ── Desktop: original staggered entrance + parallax ── */

        /* Row 1 cards */
        const row1Cards = row1Ref.current?.querySelectorAll("[data-card]");
        if (row1Cards?.length) {
          gsap.from(Array.from(row1Cards), {
            opacity: 0,
            y: (i: number) => (i % 2 === 0 ? 80 : 120),
            rotation: (i: number) => (i % 2 === 0 ? -1.5 : 1),
            duration: 1,
            stagger: { each: 0.12, ease: "power1.in" },
            ease: "power3.out",
            scrollTrigger: {
              trigger: row1Ref.current,
              start: "top 90%",
              once: true,
            },
          });
        }

        /* Row 2 cards */
        const row2Cards = row2Ref.current?.querySelectorAll("[data-card]");
        if (row2Cards?.length) {
          gsap.from(Array.from(row2Cards), {
            opacity: 0,
            y: (i: number) => (i % 2 === 0 ? 100 : 70),
            rotation: (i: number) => (i % 2 === 0 ? 1 : -1.5),
            duration: 1,
            stagger: { each: 0.12, ease: "power1.in" },
            ease: "power3.out",
            scrollTrigger: {
              trigger: row2Ref.current,
              start: "top 92%",
              once: true,
            },
          });
        }

        /* Parallax: rows drift in opposite directions */
        if (row1Ref.current) {
          gsap.fromTo(
            row1Ref.current,
            { xPercent: 4 },
            {
              xPercent: -8,
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

        if (row2Ref.current) {
          gsap.fromTo(
            row2Ref.current,
            { xPercent: -4 },
            {
              xPercent: 8,
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Split testimonials into two rows (odds & evens) — desktop only */
  const row1 = testimonials.filter((_, i) => i % 2 === 0);
  const row2 = testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full bg-bg overflow-hidden",
        "py-[clamp(5rem,10vw,8rem)]",
        "max-md:py-[clamp(3rem,8vw,5rem)]",
        className,
      )}
    >
      {/* ══════════════════════════════════════
          HEADER
          ══════════════════════════════════════ */}
      <div
        ref={headerRef}
        className={cn(
          "max-w-[1440px] mx-auto",
          "mb-[clamp(3rem,6vw,5rem)]",
          "px-[clamp(1.25rem,3vw,2.5rem)]",
        )}
      >
        <div className="max-w-[680px]">
          <span
            ref={labelRef}
            className={cn(
              "block",
              "font-body text-[0.6875rem] font-medium",
              "tracking-[0.25em] uppercase",
              "text-ink/40 mb-4",
              "motion-reduce:opacity-100!",
            )}
          >
            {label}
          </span>

          <h2
            ref={titleRef}
            className={cn(
              "font-display text-[clamp(2.5rem,5.5vw,4.5rem)]",
              "font-light leading-[1.08] tracking-[-0.03em]",
              "text-ink m-0",
              "motion-reduce:opacity-100!",
            )}
          >
            {title}{" "}
            <em className="italic font-display text-green">{titleAccent}</em>
          </h2>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CARDS
          ══════════════════════════════════════ */}
      <div
        className={cn(
          "max-w-[1440px] mx-auto",
          "px-[clamp(1.25rem,3vw,2.5rem)]",
          "flex flex-col",
          "gap-[clamp(0.75rem,1.5vw,1.25rem)]",
          "max-md:gap-0",
        )}
      >
        {/* ── Mobile: single aligned stack (hidden on md+) ── */}
        <div
          ref={mobileStackRef}
          className="flex flex-col gap-3 md:hidden"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        {/* ── Desktop: two offset rows with parallax (hidden below md) ── */}

        {/* Row 1 */}
        <div
          ref={row1Ref}
          className={cn(
            "hidden md:flex will-change-transform",
            "gap-[clamp(0.75rem,1.5vw,1.25rem)]",
            "max-lg:overflow-x-auto max-lg:overflow-y-hidden",
            "max-lg:scrollbar-none max-lg:pb-1",
            "motion-reduce:transform-none!",
          )}
        >
          {row1.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        {/* Row 2 — offset right for asymmetry */}
        <div
          ref={row2Ref}
          className={cn(
            "hidden md:flex will-change-transform",
            "gap-[clamp(0.75rem,1.5vw,1.25rem)]",
            "pl-[clamp(3rem,10vw,10rem)]",
            "max-[1200px]:pl-[clamp(2rem,6vw,5rem)]",
            "max-lg:pl-[clamp(1.5rem,4vw,3rem)]",
            "max-lg:overflow-x-auto max-lg:overflow-y-hidden",
            "max-lg:scrollbar-none max-lg:pb-1",
            "motion-reduce:transform-none!",
          )}
        >
          {row2.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
