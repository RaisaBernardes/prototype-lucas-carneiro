"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface SplashScreenProps {
  onComplete: () => void;
}

function SplitWord({ word, charClass }: { word: string; charClass: string }) {
  return (
    <>
      {word.split("").map((char, i) => (
        <span
          key={i}
          className={charClass}
          style={{
            display: "inline-block",
            willChange: "transform",
            transform: "translateY(115%)", // ← estado inicial no JSX
          }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      // gsap.set ainda aqui como garantia, mas o CSS inline já previne o flash
      gsap.set(".char-name", { y: "115%" });
      gsap.set([".splash-label", ".splash-logo", ".splash-corner"], {
        opacity: 0,
      });
      gsap.set(".splash-hairline", {
        scaleX: 0,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline();

      tl.to(
        ".splash-hairline",
        { scaleX: 1, duration: 0.85, ease: "expo.inOut" },
        0.15
      );

      tl.to(
        ".splash-label",
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        0.65
      );

      tl.to(
        ".char-first",
        { y: "0%", duration: 0.8, stagger: 0.042, ease: "power3.out" },
        0.88
      );

      tl.to(
        ".char-last",
        { y: "0%", duration: 0.8, stagger: 0.042, ease: "power3.out" },
        1.18
      );

      tl.to(
        ".splash-logo",
        { opacity: 1, duration: 0.7, ease: "power2.out" },
        1.3
      );

      tl.to(
        ".splash-corner",
        { opacity: 1, duration: 0.55, stagger: 0.15, ease: "power2.out" },
        2.05
      );

      tl.to(
        splashRef.current,
        {
          yPercent: -100,
          duration: 0.95,
          ease: "expo.inOut",
          onComplete: () => {
            if (splashRef.current) {
              splashRef.current.style.display = "none";
            }
            onComplete();
          },
        },
        2.6
      );
    }, splashRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <div className="flex flex-col items-center select-none">

        {/* Estado inicial: scaleX(0) e transformOrigin inline */}
        <div
          className="splash-hairline mb-7"
          style={{
            width: "clamp(72px, 10vw, 120px)",
            height: "1px",
            backgroundColor: "var(--color-accent)",
            transform: "scaleX(0)",           // ← invisível desde o início
            transformOrigin: "center center",  // ← consistente com o gsap.set
          }}
        />

        {/* Estado inicial: opacity 0 inline */}
        <div
          className="splash-label mb-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            letterSpacing: "0.52em",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            opacity: 0, // ← invisível desde o início
          }}
        >
          LEANDRO GREGÓRIO
        </div>

        {/* Estado inicial: opacity 0 inline */}
        <img
          src="/images/leandro-gregorio/logo-leandro.webp"
          alt="Leandro Gregório"
          className="splash-logo mt-5"
          style={{
            width: "clamp(16px, 8vw, 16px)",
            height: "auto",
            filter: "brightness(0) invert(1)",
            opacity: 0, // ← invisível desde o início
          }}
        />

      </div>
    </div>
  );
}