"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import texts from "../app/texts/texts.json";

interface ScrollTextRevealProps {
  bgColor?: string;
  colorFrom?: string;
  colorTo?: string;
  accentColor?: string;
  accentFontWeight?: number | string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string | number;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  letterSpacing?: string;
  wordSpeed?: number;
  contentPaddingLeft?: string;
  contentMaxWidth?: string;
}

function normalise(w: string) {
  return w.replace(/[.,!?;:"""''—–-]+$/, "").toLowerCase();
}

function isAccent(word: string, accentWords: string[]): boolean {
  return accentWords.some((a) => normalise(a) === normalise(word));
}

let hasInitialized = false;

export default function ScrollTextReveal({
  bgColor = "var(--color-bg)",
  colorFrom = "var(--color-text-reveal-from)",
  colorTo = "var(--color-text-reveal-to)",
  accentColor = "var(--color-button)",
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

  const text = texts.scrollTextReveal.text;
  const accentWords = texts.scrollTextReveal.accentWords;

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
      className="relative flex h-dvh items-center overflow-hidden"
      style={{ background: bgColor }}
    >
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