"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface SectionTitleProps {
  /** Section index label, e.g. "04" */
  index: string;
  /** Category label shown next to the index, e.g. "PROCEDIMENTOS" */
  category: string;
  /** Upright (roman) portion of the heading */
  romanText: string;
  /** Italic portion of the heading */
  italicText: string;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Optional extra class names for the wrapper */
  className?: string;
}

/**
 * SectionTitle
 *
 * Renders a typographic section header matching the editorial style:
 *   - Small spaced-caps label: "04 — PROCEDIMENTOS"
 *   - Large serif heading mixing upright + italic weight
 *   - GSAP-powered reveal: label fades up, words stagger in from below
 *
 * Usage:
 *   <SectionTitle
 *     index="04"
 *     category="PROCEDIMENTOS"
 *     romanText="Procedimentos"
 *     italicText="realizados"
 *   />
 */
export default function SectionTitle({
  index,
  category,
  romanText,
  italicText,
  delay = 0,
  className = "",
}: SectionTitleProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay });

      // ── Label reveal ──────────────────────────────────────────────
      gsap.set(labelRef.current, { autoAlpha: 0, y: 10 });
      tl.to(labelRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      // ── Heading words stagger in from below a clip mask ───────────
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "words" });

        gsap.set(split.words, { y: "110%", autoAlpha: 0 });

        tl.to(
          split.words,
          {
            y: "0%",
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.35"
        );

        // Cleanup SplitText on unmount
        return () => split.revert();
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={wrapperRef}
      className={`px-10 py-16 md:px-20 md:py-24 ${className}`}
    >
      {/* ── Label ── */}
      <p
        ref={labelRef}
        className="
          mb-4
          text-[11px] tracking-[0.22em] uppercase
          font-sans font-medium
          text-[#4a6650]/70
          select-none
        "
        aria-hidden="true"
      >
        {index}
        <span className="mx-2 opacity-60">—</span>
        {category}
      </p>

      {/* ── Heading ── */}
      <div className="overflow-hidden">
        <h2
          ref={headingRef}
          className="
            font-serif
            text-[clamp(2.6rem,6vw,5.5rem)]
            leading-[1.05]
            tracking-[-0.02em]
            text-[#2c4030]
          "
        >
          {/* Roman portion */}
          <span className="not-italic">{romanText} </span>
          {/* Italic portion */}
          <span className="italic">{italicText}</span>
        </h2>
      </div>
    </div>
  );
}