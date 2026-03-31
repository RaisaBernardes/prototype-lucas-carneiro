"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ScrollTextRevealProps {
  /** The text revealed word by word on scroll */
  text: string;
  /** Section background color */
  bgColor?: string;
  /** Starting color of every word (before reveal) */
  colorFrom?: string;
  /** Final color of regular words after reveal */
  colorTo?: string;
  /**
   * Words that animate to `accentColor` instead of `colorTo`.
   * Matching is case-insensitive and ignores trailing punctuation —
   * "história" also matches "história." in the text.
   */
  accentWords?: string[];
  /** Final color for accent words — default #2B3B3F */
  accentColor?: string;
  /** Font weight for accent words — default 700 */
  accentFontWeight?: number | string;
  /** Any valid CSS font-family */
  fontFamily?: string;
  /** Any valid CSS font-size — supports clamp() */
  fontSize?: string;
  /** CSS line-height */
  lineHeight?: string | number;
  /** CSS font-weight for regular words */
  fontWeight?: number | string;
  /** CSS font-style */
  fontStyle?: "normal" | "italic";
  /** CSS letter-spacing */
  letterSpacing?: string;
  /** Scroll distance per word in px — lower = faster (default 15) */
  wordSpeed?: number;
  /**
   * Left padding of the text container — shifts the block toward the right.
   * Accepts any CSS value: "38%", "420px", "38vw".
   * Default "0" (no offset).
   */
  contentPaddingLeft?: string;
  /** Max-width of the text container — default "1320px" */
  contentMaxWidth?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function normalise(w: string) {
  return w.replace(/[.,!?;:"""''—–-]+$/, "").toLowerCase();
}

function isAccent(word: string, accentWords: string[]): boolean {
  return accentWords.some((a) => normalise(a) === normalise(word));
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

let hasInitialized = false;

export default function ScrollTextReveal({
  text,
  bgColor = "#FAFAF8",
  colorFrom = "rgba(13,25,33,0.18)",
  colorTo = "rgba(13,25,33,0.45)",
  accentWords = [],
  accentColor = "#2B3B3F",
  accentFontWeight = 700,
  fontFamily = "var(--font-body), system-ui, sans-serif",
  fontSize = "clamp(24px, 3.2vw, 52px)",
  lineHeight = 1.35,
  fontWeight = 300,
  fontStyle = "normal",
  letterSpacing = "-0.02em",
  wordSpeed = 15,
  contentPaddingLeft = "0",
  contentMaxWidth = "1320px",
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasInitialized) return;
    hasInitialized = true;

    gsap.registerPlugin(ScrollTrigger);

    const wordEls = gsap.utils.toArray<HTMLSpanElement>(
      containerRef.current?.querySelectorAll(".scroll-word") ?? []
    );

    wordEls.forEach((el, index) => {
      const accent = el.dataset.accent === "true";
      const targetColor = accent ? accentColor : colorTo;
      const wordStart = index * wordSpeed;
      const wordEnd = wordStart + wordSpeed * 2;

      gsap.fromTo(
        el,
        { color: colorFrom },
        {
          color: targetColor,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${wordStart} top`,
            end: `top+=${wordEnd} top`,
            scrub: true,
          },
        }
      );
    });

    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${wordEls.length * wordSpeed + 200}`,
      pin: true,
      anticipatePin: 1,
    });

    return () => {
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      hasInitialized = false;
    };
  }, [colorFrom, colorTo, accentColor, wordSpeed]);

  const words = text.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative h-dvh overflow-hidden flex items-center"
      style={{ background: bgColor }}
    >
      {/* ── Text container ─────────────────────────────────────────────────
       *  contentPaddingLeft shifts the block rightward.
       *  The right padding stays fixed so long lines don't bleed off-screen.
       * ─────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: contentMaxWidth,
          paddingLeft: `max(${contentPaddingLeft}, 1.5rem)`,
          paddingRight: "1.5rem",
        }}
      >
        <p style={{ fontFamily, fontSize, lineHeight, letterSpacing }}>
          {words.map((word, index) => {
            const accent = isAccent(word, accentWords);
            return (
              <span
                key={index}
                className="scroll-word inline-block"
                data-accent={accent ? "true" : "false"}
                style={{
                  marginRight: "0.35em",
                  color: colorFrom,
                  fontWeight: accent ? accentFontWeight : fontWeight,
                  fontStyle: accent ? "italic" : fontStyle,
                  fontFamily: accent
                    ? "var(--font-display), Georgia, serif"
                    : fontFamily,
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}