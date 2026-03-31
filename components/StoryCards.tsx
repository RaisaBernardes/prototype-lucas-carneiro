"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─────────────────────────────────────────────
   cn() — lightweight class merger
   ───────────────────────────────────────────── */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────
   SplitText replacement (free)
   ───────────────────────────────────────────── */
function splitIntoWords(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  const words = text.split(/\s+/).filter(Boolean);
  element.innerHTML = "";
  const spans: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "inline-block will-change-[opacity]";
    span.textContent = word;
    element.appendChild(span);
    if (i < words.length - 1) {
      element.appendChild(document.createTextNode("\u00A0"));
    }
    spans.push(span);
  });
  return spans;
}

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
interface StoryCard {
  index: string;
  title: string;
  body: string;
  bodyMobile?: string;
  bulletImages?: { src: string; alt: string }[];
}

interface StorySectionProps {
  label?: string;
  title?: string;
  titleItalic?: string;
  subtitle?: string;
  cards?: StoryCard[];
  className?: string;
}

/* ─────────────────────────────────────────────
   DEFAULT DATA
   ───────────────────────────────────────────── */
const defaultCards: StoryCard[] = [
  {
    index: "01",
    title: "When Dreams Start Small",
    body: "I grew up in post-communist Poland, a world where ambition was dangerous and opportunity scarce. Tennis became my escape and my whole identity.\n\nBy eighteen I was traveling the world on the WTA tour, ranked among the top players, fighting with nothing but grit and stubbornness.\n\nBut without financial backing, the dream collapsed. Overnight, the identity I had built my life around was gone, and I was forced to face the question: who am I without the game?",
    bodyMobile:
      "I grew up in post-communist Poland, where ambition was risky and opportunities scarce. Tennis became my escape and identity.\n\nBy eighteen I was on the WTA tour, fueled only by grit.\n\nBut without financial backing, the dream collapsed — and overnight I had to face the question: who am I without the game?",
    bulletImages: [
      { src: "/images/poland-90s.jpg", alt: "Poland, 1990s" },
      { src: "/images/wta-tour.jpg", alt: "WTA Tour" },
      { src: "/images/crossroads.jpg", alt: "The Crossroads" },
    ],
  },
  {
    index: "02",
    title: "From Wall Street to the Freezer Floor",
    body: "With nothing left to fall back on, I left Poland for America. I started in a community college in Kansas, pushed my way to Baylor, and eventually earned a scholarship at the University of California, Berkeley.\n\nI became the first in my family to graduate from university, and I did it with honors.\n\nIt wasn't about the degree itself; it was about proving that reinvention is possible, even when you're standing on broken ground.",
    bulletImages: [
      { src: "/images/kansas.jpg", alt: "Kansas" },
      { src: "/images/berkeley.jpg", alt: "Berkeley" },
      { src: "/images/graduation.jpg", alt: "Graduation" },
    ],
  },
  {
    index: "03",
    title: "Betting Everything on Myself",
    body: "After Berkeley I went straight into investment banking in London. Prestige, power, the adrenaline of 100-hour weeks — it looked like success.\n\nBut the longer I stayed, the louder the question became: is this really it?\n\nSo I left and opened a restaurant. I traded boardrooms for basements, Armani suits for aprons. Three years later, I closed it, broke and exhausted.\n\nLater I thrived in venture capital, working with founders and shaping strategy — until COVID collapsed our fund.",
    bodyMobile:
      "After Berkeley, I entered investment banking in London — prestige, power, 100-hour weeks. It looked like success, but the question grew louder: is this really it?\n\nI left to open a restaurant, only to close it three years later, broke and exhausted.\n\nLater I thrived in venture capital — until COVID collapsed our fund.",
    bulletImages: [
      { src: "/images/banking.jpg", alt: "Banking" },
      { src: "/images/restaurant.jpg", alt: "Restaurant" },
      { src: "/images/venture.jpg", alt: "Venture Capital" },
    ],
  },
  {
    index: "04",
    title: "The Moment It All Made Sense",
    body: "Through all those chapters — tennis, banking, entrepreneurship, venture — I began to see the same truth: the strongest performers never do it alone. Athletes always have coaches. Executives and founders need them too.\n\nCoaching is not damage control. It's not about fixing what is broken. It is about clarity, performance, and the courage to make the moves you know you need to make.\n\nThat realization didn't come from a book. It came from living every version of reinvention firsthand.",
    bodyMobile:
      "Through tennis, banking, entrepreneurship, and venture — the same truth emerged: the strongest performers never do it alone.\n\nCoaching isn't damage control. It's about clarity, performance, and courage.\n\nThat realization came from living every version of reinvention firsthand.",
    bulletImages: [
      { src: "/images/coaching.jpg", alt: "Coaching" },
      { src: "/images/clarity.jpg", alt: "Clarity" },
      { src: "/images/performance.jpg", alt: "Performance" },
    ],
  },
];

/* ─────────────────────────────────────────────
   BULLET ITEM (with hover image + underline)
   ───────────────────────────────────────────── */
function BulletItem({
  text,
  imageLabel,
  imageSrc,
}: {
  text: string;
  imageLabel: string;
  imageSrc?: string;
  index: number;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current || !itemRef.current || !isHovered.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    gsap.to(imgRef.current, {
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top - 70,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current || !itemRef.current) return;
    isHovered.current = true;
    gsap.killTweensOf(imgRef.current);
    const rect = itemRef.current.getBoundingClientRect();
    gsap.set(imgRef.current, {
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top - 70,
      scale: 0.85,
      opacity: 0,
    });
    gsap.to(imgRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!imgRef.current) return;
    isHovered.current = false;
    gsap.killTweensOf(imgRef.current);
    gsap.to(imgRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.15,
      ease: "power2.in",
      overwrite: true,
    });
  }, []);

  return (
    <li
      ref={itemRef}
      data-bullet-item
      className={cn(
        "group/bullet relative",
        "py-[18px] max-md:py-4",
        "border-b border-accent/10",
        "first:border-t first:border-accent/10",
        "cursor-default",
        // FIX — opacity-0 removed from here.
        // Initial opacity is now set via gsap.set() inside useEffect (client-only).
        // Having it in Tailwind className means the SSR HTML contains opacity-0;
        // if React reconciles before GSAP runs the attribute can briefly differ
        // between server and client trees, triggering the hydration mismatch warning.
        "motion-reduce:opacity-100! motion-reduce:translate-y-0!",
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={cn(
          "block",
          "font-body text-[clamp(0.4375rem,1.1vw,1.0625rem)]",
          "font-light leading-[1.7]",
          "text-light/70",
          "transition-colors duration-300",
          "group-hover/bullet:text-light/78",
        )}
      >
        {text}
      </span>

      <span
        className={cn(
          "absolute bottom-[-1px] left-0",
          "w-full h-px",
          "bg-accent",
          "scale-x-0 origin-left",
          "transition-transform duration-500 ease-spring",
          "group-hover/bullet:scale-x-100",
          "motion-reduce:transition-none!",
        )}
        aria-hidden="true"
      />

      <div
        ref={imgRef}
        className={cn(
          "absolute top-0 left-0",
          "w-[140px] h-[140px]",
          "max-lg:w-[120px] max-lg:h-[120px]",
          "max-md:hidden",
          "bg-card-alt border border-accent/0 shadow-sm",
          "flex items-center justify-center",
          "pointer-events-none z-20",
          "opacity-0 will-change-[transform,opacity]",
          "overflow-hidden",
        )}
        aria-hidden="true"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageLabel}
            className="w-full h-full object-cover block pointer-events-none select-none"
            draggable={false}
          />
        ) : (
          <span
            className={cn(
              "font-body text-[0.5625rem] font-semibold",
              "tracking-[0.18em] uppercase",
              "text-accent/50 text-center p-2",
            )}
          >
            {imageLabel}
          </span>
        )}
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function StorySection({
  label = "04 — PROCEDIMENTOS",
  title = "Procedimentos",
  titleItalic = "realizados",
  subtitle = "Cada procedimento é planejado de forma individualizada, com base na anatomia, nos desejos e no estilo de vida de cada paciente.",
  cards = defaultCards,
  className = "",
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // FIX — `mounted` state gates the opacity-0 class on GSAP-targeted elements.
  //
  // Why this solves the hydration mismatch:
  //   • Server render  → mounted = false → NO opacity-0 class in HTML
  //   • Client render  → mounted = false → same HTML, React hydrates cleanly ✓
  //   • After mount    → mounted = true  → opacity-0 applied in the same paint
  //                      that useEffect runs, so GSAP picks it up immediately
  //                      with no visible flash of content.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Do not run GSAP until after the mounted render has committed —
    // refs are guaranteed valid at that point.
    if (!mounted) return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let gsapCtx: gsap.Context | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      // FIX — guard all refs before touching them.
      // The 150 ms delay means this callback can fire after the component
      // unmounts during fast client-side navigation. Without null checks, GSAP
      // targets null elements and logs "GSAP target not found" warnings.
      if (
        !sectionRef.current ||
        !labelRef.current ||
        !titleRef.current ||
        !subtitleRef.current
      ) {
        return;
      }

      const ctx = gsap.context(() => {
        /* ── Header reveal ── */
        const headerTriggerEl =
          sectionRef.current?.querySelector("[data-header]");
        if (!headerTriggerEl) return;

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerTriggerEl,
            start: "top 85%",
            once: true,
          },
        });

        // Initial states are set here (client-only) rather than in Tailwind
        // classes. This is the companion to the mounted gate above: GSAP owns
        // the initial hidden state so it is never baked into SSR HTML.
        gsap.set(labelRef.current, { opacity: 0, y: 16 });
        gsap.set(titleRef.current, { opacity: 0, y: 30 });
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 });

        headerTl
          .to(labelRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(
            titleRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.35"
          )
          .to(
            subtitleRef.current,
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            "-=0.45"
          );

        /* ── Sticky stacking cards ── */
        const vh = window.innerHeight;
        const stickyCards = gsap.utils.toArray<HTMLElement>(
          "[data-sticky-card]"
        );

        /* PHASE 1 — overflow scrub (desktop only) */
        if (!isMobile) {
          stickyCards.forEach((stickyEl) => {
            const inner = stickyEl.querySelector(
              "[data-card-inner]"
            ) as HTMLElement | null;
            const container = stickyEl.querySelector(
              "[data-card-container]"
            ) as HTMLElement | null;

            // FIX — guard querySelector results; missing elements were one
            // source of the blank "GSAP target not found" warnings.
            if (!inner || !container) return;

            inner.style.height = "auto";
            inner.style.minHeight = "auto";
            inner.style.overflow = "visible";
            stickyEl.style.minHeight = "auto";
            container.style.transform = "";

            const overflow = inner.scrollHeight - vh;

            if (overflow > 0) {
              inner.style.height = `${vh}px`;
              inner.style.minHeight = `${vh}px`;
              inner.style.overflow = "hidden";
              stickyEl.style.minHeight = `${overflow + vh}px`;

              gsap.fromTo(
                container,
                { y: 0 },
                {
                  y: -overflow,
                  ease: "none",
                  scrollTrigger: {
                    trigger: stickyEl,
                    start: "top top",
                    end: `+=${overflow}`,
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                }
              );
            } else {
              inner.style.height = "";
              inner.style.minHeight = "100vh";
              inner.style.overflow = "hidden";
              stickyEl.style.minHeight = "100vh";
            }
          });
        }

        /* PHASE 2 — dim + scale on stack (desktop only) */
        if (!isMobile) {
          stickyCards.forEach((card, i) => {
            if (i >= stickyCards.length - 1) return;
            const overlay = card.querySelector(
              "[data-dim-overlay]"
            ) as HTMLElement | null;
            const inner = card.querySelector(
              "[data-card-inner]"
            ) as HTMLElement | null;
            const nextCard = stickyCards[i + 1];

            // FIX — same guard applied here.
            if (!inner || !nextCard) return;

            gsap.to(inner, {
              scale: 0.97,
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 10%",
                scrub: true,
              },
            });
            if (overlay) {
              gsap.to(overlay, {
                opacity: 0.15,
                ease: "none",
                scrollTrigger: {
                  trigger: nextCard,
                  start: "top bottom",
                  end: "top 10%",
                  scrub: true,
                },
              });
            }
          });
        }

        /* PHASE 3 — content entrance animations */

        // Index number fade
        gsap.utils
          .toArray<HTMLElement>("[data-animate='index-fade']")
          .forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true,
                },
              }
            );
          });

        // Bullet items stagger in
        gsap.utils
          .toArray<HTMLElement>("[data-bullet-list]")
          .forEach((list) => {
            const items = list.querySelectorAll("[data-bullet-item]");
            if (!items.length) return;

            // Set initial opacity here (client-only) — opacity-0 was removed
            // from BulletItem's Tailwind className for the same hydration reason.
            gsap.set(items, { opacity: 0, y: 24 });

            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: list,
                start: "top 82%",
                once: true,
              },
            });
          });

        // Lesson text — word-by-word opacity reveal
        gsap.utils
          .toArray<HTMLElement>("[data-animate='word']")
          .forEach((el) => {
            const words = splitIntoWords(el);
            if (!words.length) return;
            gsap.fromTo(
              words,
              { opacity: 0.3 },
              {
                opacity: 1,
                ease: "power2.out",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  end: "top 35%",
                  scrub: true,
                },
              }
            );
          });
      }, sectionRef);

      gsapCtx = ctx;
    }, 150);

    /* ── Resize handler (desktop — reloads to recalc sticky heights) ── */
    const handleResize = () => {
      gsapCtx?.revert();
      gsapCtx = null;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => window.location.reload(), 300);
    };
    if (!isMobile) window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      gsapCtx?.revert();
    };
  }, [mounted]); // re-runs only when mounted flips true

  return (
    <section ref={sectionRef} className={cn("w-full bg-card", className)}>
      {/* ══════════════════════════════════════
          HEADER
          ══════════════════════════════════════ */}
      <div
        data-header
        className={cn(
          "bg-card border-b border-accent/10",
          "pt-[clamp(5rem,10vw,7.5rem)] pb-[clamp(3rem,6vw,4.5rem)]",
          "max-md:pt-[clamp(3rem,8vw,5rem)] max-md:pb-[clamp(2rem,4vw,3rem)]",
        )}
      >
        <div className="mx-auto md:max-w-[1320px] px-10  max-md:px-5 ">
          {/* Label — opacity-0 gated behind `mounted` so SSR omits it */}
          <span
            ref={labelRef}
            className={cn(
              "block",
              "font-body text-[0.6875rem] font-medium",
              "tracking-[0.22em] uppercase",
              "text-accent/50 mb-[18px]",
              mounted && "opacity-0",
              "motion-reduce:opacity-100!",
            )}
          >
            {label}
          </span>

          {/* Title */}
          <h2
            ref={titleRef}
            className={cn(
              "font-display text-[clamp(2.4rem,5vw,4.5rem)] ",
              "font-light leading-[1.05] tracking-[-0.025em]",
              "text-light/78 mb-6",
              mounted && "opacity-0",
              "motion-reduce:opacity-100!",
            )}
          >
            {title} <em className="italic text-accent">{titleItalic}</em>
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p
              ref={subtitleRef}
              className={cn(
                "font-body text-[clamp(0.9375rem,1.1vw,1.0625rem)]",
                "font-light leading-[1.75]",
                "text-accent/50 max-w-[500px]",
                mounted && "opacity-0",
                "motion-reduce:opacity-100!",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STICKY STACKING CARDS
          ══════════════════════════════════════ */}
      <div className="relative w-full">
        {cards.map((card, i) => {
          const desktopBullets = (card.body || "")
            .split("\n\n")
            .filter(Boolean);
          const mobileBullets = (card.bodyMobile || card.body || "")
            .split("\n\n")
            .filter(Boolean);

          return (
            <div
              key={card.index}
              data-sticky-card
              className={cn(
                "sticky top-0 w-full",
                "min-h-screen min-h-[100svh]",
                "max-md:relative! max-md:top-auto!",
                "max-md:min-h-0! max-md:z-auto!",
              )}
              style={{ zIndex: i + 1 }}
            >
              <div
                data-card-inner
                className={cn(
                  "relative w-full",
                  "min-h-screen min-h-[100svh]",
                  "flex items-start",
                  "py-[120px] max-lg:py-20 max-md:py-[60px]",
                  i % 2 === 1 ? "bg-card-alt" : "bg-card",
                  "will-change-transform origin-top",
                  "border-t border-accent/10",
                  "max-md:min-h-0! max-md:h-auto! max-md:overflow-visible!",
                  "motion-reduce:transform-none!",
                )}
              >
                <div
                  data-dim-overlay
                  className={cn(
                    "absolute inset-0",
                    "bg-black opacity-0",
                    "pointer-events-none z-10",
                    "max-md:hidden",
                    "motion-reduce:hidden!",
                  )}
                />

                <div
                  data-card-container
                  className={cn(
                    "relative z-[1]",
                    "w-full max-w-[1320px] mx-auto",
                    "px-10 max-lg:px-[30px] max-md:px-5",
                    "will-change-transform",
                    "max-md:transform-none!",
                    "motion-reduce:transform-none!",
                  )}
                >
                  <div
                    className={cn(
                      "grid",
                      "grid-cols-[minmax(60px,1fr)_5fr]",
                      "md:gap-100 max-lg:gap-6",
                      "max-md:grid-cols-1 max-md:gap-4",
                    )}
                  >
                    {/* ── Index number ── */}
                    <div
                      data-animate="index-fade"
                      className={cn(
                        "font-display italic font-normal",
                        "text-[clamp(4rem,12vw,7rem)]",
                        "md:text-[clamp(2.5rem,14vw,12.5rem)]",
                        "leading-[0.9] tracking-[-0.04em]",
                        "text-accent/12",
                        mounted && "opacity-0",
                        "motion-reduce:opacity-100!",
                      )}
                    >
                      {card.index}
                    </div>

                    {/* ── Content block ── */}
                    <div className="flex flex-col">
                      <h3
                        className={cn(
                          "font-display",
                          "text-[clamp(1.75rem,2vw,2.5rem)]",
                          "font-light leading-[1.15] tracking-[-0.01em]",
                          "text-light/78 m-0",
                        )}
                      >
                        {card.title}
                      </h3>

                      <div className="h-[2em]" />

                      {/* Desktop bullet list */}
                      <ul
                        data-bullet-list
                        className={cn(
                          "hidden md:block",
                          "max-w-[560px] list-none m-0 p-0 uppercase",
                        )}
                      >
                        {desktopBullets.map((text, bi) => (
                          <BulletItem
                            key={bi}
                            text={text}
                            imageLabel={
                              card.bulletImages?.[bi]?.alt || card.title
                            }
                            imageSrc={card.bulletImages?.[bi]?.src}
                            index={bi}
                          />
                        ))}
                      </ul>

                      {/* Mobile bullet list */}
                      <ul
                        data-bullet-list
                        className={cn(
                          "block md:hidden",
                          "max-w-[560px] list-none m-0 p-0",
                        )}
                      >
                        {mobileBullets.map((text, bi) => (
                          <BulletItem
                            key={bi}
                            text={text}
                            imageLabel={
                              card.bulletImages?.[bi]?.alt || card.title
                            }
                            index={bi}
                          />
                        ))}
                      </ul>

                      <div className="h-[2em]" />

                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}