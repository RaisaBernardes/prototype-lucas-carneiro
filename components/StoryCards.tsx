"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import texts from "../app/texts/texts.json";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

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
        "motion-reduce:opacity-100! motion-reduce:translate-y-0!"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={cn(
          "block",
          "font-body text-[clamp(0.875rem,1.1vw,1.0625rem)]",
          "font-light leading-[1.7]",
          "text-light/70",
          "transition-colors duration-300",
          "group-hover/bullet:text-light/78"
        )}
      >
        {text}
      </span>

      <span
        className={cn(
          "absolute bottom-[-1px] left-0",
          "h-px w-full",
          "bg-accent",
          "origin-left scale-x-0",
          "transition-transform duration-500 ease-spring",
          "group-hover/bullet:scale-x-100",
          "motion-reduce:transition-none!"
        )}
        aria-hidden="true"
      />

      <div
        ref={imgRef}
        className={cn(
          "absolute top-0 left-0",
          "h-[140px] w-[140px]",
          "max-lg:h-[120px] max-lg:w-[120px]",
          "max-md:hidden",
          "bg-card-alt border border-accent/0 shadow-sm",
          "z-20 flex items-center justify-center",
          "pointer-events-none overflow-hidden",
          "opacity-0 will-change-[transform,opacity]"
        )}
        aria-hidden="true"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageLabel}
            className="block h-full w-full object-cover pointer-events-none select-none"
            draggable={false}
          />
        ) : (
          <span
            className={cn(
              "p-2 text-center font-body text-[0.5625rem] font-semibold uppercase tracking-[0.18em]",
              "text-accent/50"
            )}
          >
            {imageLabel}
          </span>
        )}
      </div>
    </li>
  );
}

export default function StorySection({
  label = texts.storySection.label,
  title = texts.storySection.title,
  titleItalic = texts.storySection.titleItalic,
  subtitle = texts.storySection.subtitle,
  cards = texts.storySection.cards,
  className = "",
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
      if (
        !sectionRef.current ||
        !labelRef.current ||
        !titleRef.current ||
        !subtitleRef.current
      ) {
        return;
      }

      const ctx = gsap.context(() => {
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

        const vh = window.innerHeight;
        const stickyCards = gsap.utils.toArray<HTMLElement>(
          "[data-sticky-card]"
        );

        if (!isMobile) {
          stickyCards.forEach((stickyEl) => {
            const inner = stickyEl.querySelector(
              "[data-card-inner]"
            ) as HTMLElement | null;
            const container = stickyEl.querySelector(
              "[data-card-container]"
            ) as HTMLElement | null;

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

        stickyCards.forEach((card, i) => {
          if (i >= stickyCards.length - 1) return;
          const overlay = card.querySelector(
            "[data-dim-overlay]"
          ) as HTMLElement | null;
          const inner = card.querySelector(
            "[data-card-inner]"
          ) as HTMLElement | null;
          const nextCard = stickyCards[i + 1];

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

        gsap.utils
          .toArray<HTMLElement>("[data-bullet-list]")
          .forEach((list) => {
            const items = list.querySelectorAll("[data-bullet-item]");
            if (!items.length) return;

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
  }, [mounted]);

  return (
    <section ref={sectionRef} className={cn("w-full bg-card", className)}>
      <div
        data-header
        className={cn(
          "bg-card border-b border-accent/10",
          "pt-[clamp(5rem,10vw,7.5rem)] pb-[clamp(3rem,6vw,4.5rem)]",
          "max-md:pt-[clamp(3rem,8vw,5rem)] max-md:pb-[clamp(2rem,4vw,3rem)]"
        )}
      >
        <div className="mx-auto px-10 max-md:px-5 md:max-w-[1320px]">
          <span
            ref={labelRef}
            className={cn(
              "mb-[18px] block font-body text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-accent/50",
              mounted && "opacity-0",
              "motion-reduce:opacity-100!"
            )}
          >
            {label}
          </span>

          <h2
            ref={titleRef}
            className={cn(
              "mb-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.025em] text-light/78",
              mounted && "opacity-0",
              "motion-reduce:opacity-100!"
            )}
          >
            {title} <em className="italic text-accent">{titleItalic}</em>
          </h2>

          {subtitle && (
            <p
              ref={subtitleRef}
              className={cn(
                "max-w-[500px] font-body text-[clamp(0.9375rem,1.1vw,1.0625rem)] font-light leading-[1.75] text-accent/50",
                mounted && "opacity-0",
                "motion-reduce:opacity-100!"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="relative w-full">
        {cards.map((card, i) => {
          const desktopBullets = (card.body || "").split("\n\n").filter(Boolean);
          const mobileBullets = (card.bodyMobile || card.body || "")
            .split("\n\n")
            .filter(Boolean);

          return (
            <div
              key={card.index}
              data-sticky-card
              className={cn(
                "sticky top-0 w-full min-h-screen min-h-[100svh]",
                "max-md:min-h-0!"
              )}
              style={{ zIndex: i + 1 }}
            >
              <div
                data-card-inner
                className={cn(
                  "relative flex min-h-screen min-h-[100svh] w-full items-start",
                  "py-[120px] max-lg:py-20 max-md:py-[60px]",
                  i % 2 === 1 ? "bg-card-alt" : "bg-card",
                  "origin-top border-t border-accent/10 will-change-transform",
                  "max-md:min-h-0! max-md:h-auto! max-md:overflow-visible!",
                  "motion-reduce:transform-none!"
                )}
              >
                <div
                  data-dim-overlay
                  className={cn(
                    "absolute inset-0 z-10 bg-black opacity-0 pointer-events-none",
                    "motion-reduce:hidden!"
                  )}
                  style={{ backgroundColor: "var(--color-story-overlay)" }}
                />

                <div
                  data-card-container
                  className={cn(
                    "relative z-[1] mx-auto w-full max-w-[1320px] px-10 will-change-transform",
                    "max-lg:px-[30px] max-md:px-5",
                    "max-md:transform-none! motion-reduce:transform-none!"
                  )}
                >
                  <div
                    className={cn(
                      "grid grid-cols-[minmax(60px,1fr)_5fr]",
                      "md:gap-100 max-lg:gap-6",
                      "max-md:grid-cols-1 max-md:gap-4"
                    )}
                  >
                    <div
                      data-animate="index-fade"
                      className={cn(
                        "font-display text-[clamp(4rem,12vw,7rem)] font-normal italic leading-[0.9] tracking-[-0.04em] text-accent/12",
                        "md:text-[clamp(2.5rem,14vw,12.5rem)]",
                        mounted && "opacity-0",
                        "motion-reduce:opacity-100!"
                      )}
                    >
                      {card.index}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="m-0 font-display text-[clamp(1.75rem,2vw,2.5rem)] font-light leading-[1.15] tracking-[-0.01em] text-light/78">
                        {card.title}
                      </h3>

                      <div className="h-[2em]" />

                      <ul
                        data-bullet-list
                        className="m-0 hidden max-w-[560px] list-none p-0 uppercase md:block"
                      >
                        {desktopBullets.map((text, bi) => (
                          <BulletItem
                            key={bi}
                            text={text}
                            imageLabel={card.bulletImages?.[bi]?.alt || card.title}
                            imageSrc={card.bulletImages?.[bi]?.src}
                            index={bi}
                          />
                        ))}
                      </ul>

                      <ul
                        data-bullet-list
                        className="m-0 block max-w-[560px] list-none p-0 md:hidden"
                      >
                        {mobileBullets.map((text, bi) => (
                          <BulletItem
                            key={bi}
                            text={text}
                            imageLabel={card.bulletImages?.[bi]?.alt || card.title}
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