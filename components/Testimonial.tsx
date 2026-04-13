"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
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
        "motion-reduce:rotate-0! motion-reduce:transition-none!"
      )}
    >
      <span
        className={cn(
          "block pointer-events-none select-none",
          "font-serif text-5xl max-md:text-4xl",
          "font-light leading-none",
          "text-green/30 mb-2"
        )}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <blockquote
        className={cn(
          "font-serif italic",
          "text-[clamp(0.9375rem,1.2vw,1.0625rem)]",
          "max-md:text-[0.9375rem]",
          "font-normal leading-[1.6]",
          "text-ink/75",
          "m-0 flex-grow"
        )}
      >
        {testimonial.quote}
      </blockquote>

      <div className="mt-6 pt-4">
        <div className="w-6 h-px bg-green/40 mb-3" />

        <p
          className={cn(
            "font-body text-xs font-semibold",
            "tracking-[0.1em] uppercase",
            "text-ink m-0"
          )}
        >
          {testimonial.name}
        </p>

        {testimonial.date && (
          <p
            className={cn(
              "font-body text-[0.625rem] font-normal",
              "tracking-[0.06em]",
              "text-ink/40 mt-1 mb-0"
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
  label = texts.testimonialsMarquee.label,
  title = texts.testimonialsMarquee.title,
  titleAccent = texts.testimonialsMarquee.titleAccent,
  testimonials = texts.testimonialsMarquee.testimonials,
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

  const row1 = testimonials.filter((_, i) => i % 2 === 0);
  const row2 = testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full bg-bg overflow-hidden",
        "py-[clamp(5rem,10vw,8rem)]",
        "max-md:py-[clamp(3rem,8vw,5rem)]",
        className
      )}
    >
      <div
        ref={headerRef}
        className={cn(
          "max-w-[1440px] mx-auto",
          "mb-[clamp(3rem,6vw,5rem)]",
          "px-[clamp(1.25rem,3vw,2.5rem)]"
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
              "motion-reduce:opacity-100!"
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
              "motion-reduce:opacity-100!"
            )}
          >
            {title}{" "}
            <em className="italic font-display text-green">{titleAccent}</em>
          </h2>
        </div>
      </div>

      <div
        className={cn(
          "max-w-[1440px] mx-auto",
          "px-[clamp(1.25rem,3vw,2.5rem)]",
          "flex flex-col",
          "gap-[clamp(0.75rem,1.5vw,1.25rem)]",
          "max-md:gap-0"
        )}
      >
        <div
          ref={mobileStackRef}
          className="flex flex-col gap-3 md:hidden"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        <div
          ref={row1Ref}
          className={cn(
            "hidden md:flex will-change-transform",
            "gap-[clamp(0.75rem,1.5vw,1.25rem)]",
            "max-lg:overflow-x-auto max-lg:overflow-y-hidden",
            "max-lg:scrollbar-none max-lg:pb-1",
            "motion-reduce:transform-none!"
          )}
        >
          {row1.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

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
            "motion-reduce:transform-none!"
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