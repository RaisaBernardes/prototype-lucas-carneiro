"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import texts from "../app/texts/texts.json";

gsap.registerPlugin(ScrollTrigger);

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  columns?: FooterColumn[];
  socials?: { platform: string; href: string }[];
  copyright?: string;
  legalLinks?: FooterLink[];
  giantName?: string;
  className?: string;
}

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = "size-4 fill-current";

  switch (platform.toLowerCase()) {
    case "instagram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    default:
      return null;
  }
}

function LogoIcon() {
  return (
    <Image
      src="/images/personal/logo-lucas.png"
      alt={texts.footerSection.logoAlt}
      width={12}
      height={24}
    />
  );
}

function FooterNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-block",
        "font-body text-sm font-normal leading-relaxed text-light/55",
        "transition-colors duration-300 hover:text-light",
        "motion-reduce:transition-none"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px w-full",
          "origin-right scale-x-0 bg-accent",
          "transition-transform duration-400 ease-spring",
          "group-hover:origin-left group-hover:scale-x-100",
          "motion-reduce:transition-none"
        )}
      />
    </a>
  );
}

export default function Footer({
  brandName = texts.footerSection.brandName,
  brandDescription = texts.footerSection.brandDescription,
  columns = texts.footerSection.columns,
  socials = texts.footerSection.socials,
  copyright = texts.footerSection.copyright,
  legalLinks = texts.footerSection.legalLinks,
  giantName = texts.footerSection.giantName,
  className = "",
}: FooterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameMaskRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const name = nameRef.current;
    const wrapper = nameWrapperRef.current;
    if (!name || !wrapper) return;

    const fitText = () => {
      name.style.fontSize = "10vw";
      const style = getComputedStyle(wrapper);
      const containerW =
        wrapper.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const textW = name.scrollWidth;
      if (textW <= 0) return;

      const ratio = containerW / textW;
      const currentSize = parseFloat(getComputedStyle(name).fontSize);
      name.style.fontSize = `${Math.floor(currentSize * ratio)}px`;
    };

    fitText();

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitText, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [giantName]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(cardRef.current, { opacity: 1, y: 0 });
      gsap.set(nameRef.current, { opacity: 1, yPercent: 0 });
      gsap.set(scrollTopRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
      });

      cardTl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });

      cardTl.from(
        brandRef.current,
        { opacity: 0, y: 24, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      );

      const cols = colRefs.current.filter(Boolean);
      if (cols.length > 0) {
        cardTl.from(
          cols,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: { each: 0.08, ease: "power1.in" },
            ease: "power3.out",
          },
          "-=0.45"
        );
      }

      cardTl.from(
        bottomRef.current,
        { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );

      if (nameRef.current && nameMaskRef.current) {
        gsap.fromTo(
          nameRef.current,
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: nameMaskRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }

      gsap.to(scrollTopRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scrollTopRef.current,
          start: "top 95%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-deep px-5 pt-8 md:px-8 md:pt-12 lg:px-10 lg:pt-14",
        className
      )}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative mx-auto max-w-[1440px] overflow-hidden rounded-xl border border-accent/6 bg-card px-6 py-8 translate-y-10 opacity-0 md:rounded-2xl md:px-12 md:py-14 lg:rounded-[28px] lg:px-16 lg:py-[4.5rem] motion-reduce:translate-y-0 motion-reduce:opacity-100"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-1/2 h-px w-[70%] -translate-x-1/2",
            "bg-linear-to-r from-transparent via-accent/12 to-transparent"
          )}
        />

        <div
          className={cn(
            "grid items-start grid-cols-1 gap-8",
            "md:flex-row",
            "min-[860px]:grid-cols-[1.2fr_1fr_1fr] min-[860px]:gap-6",
            "min-[1100px]:grid-cols-[1.3fr_1fr_1fr_1fr] min-[1100px]:gap-12"
          )}
        >
          <div ref={brandRef} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                <LogoIcon />
              </div>
              <span className="font-display text-lg font-medium leading-none tracking-tight text-light">
                {brandName}
              </span>
            </div>

            <p className="max-w-[340px] font-body text-sm font-normal leading-relaxed text-light/55">
              {brandDescription}
            </p>

            <div className="mt-1 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  className={cn(
                    "flex size-9.5 items-center justify-center rounded-lg border border-accent/8 text-light/55",
                    "transition-all duration-300 ease-spring",
                    "hover:-translate-y-0.5 hover:border-accent/20 hover:bg-accent/4 hover:text-accent",
                    "motion-reduce:transition-none"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col, i) => (
            <div
              key={col.title}
              ref={(el) => {
                colRefs.current[i] = el;
              }}
              className={cn(i === 1 && "min-[860px]:hidden min-[1100px]:block")}
            >
              <span className="mb-5 block font-body text-sm font-semibold tracking-tight text-light">
                {col.title}
              </span>
              <ul className="m-0 list-none p-0">
                {col.links.map((link) => (
                  <li key={link.label} className="mb-3.5">
                    {link.href ? (
                      <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                    ) : (
                      <span className="font-body text-sm font-normal leading-relaxed text-light/55">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          ref={bottomRef}
          className={cn(
            "mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-accent/8 pt-6",
            "md:mt-14 md:pt-7 lg:mt-16 lg:pt-8",
            "max-md:flex-col max-md:items-start max-md:gap-3"
          )}
        >
          <p className="font-body text-xs font-normal tracking-wide text-accent/30">
            {copyright}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || "#"}
                className="font-body text-xs font-normal tracking-wide text-accent/30 transition-colors duration-300 hover:text-accent motion-reduce:transition-none"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={nameWrapperRef}
        className="mx-auto max-w-[1440px] overflow-hidden px-5 pt-8 md:px-8 lg:px-10"
      >
        <div
          ref={nameMaskRef}
          className="relative overflow-hidden pt-4 pb-4 md:pt-6 md:pb-8 lg:pt-8 lg:pb-12"
        >
          <h2
            ref={nameRef}
            className={cn(
              "text-giant-name-gradient m-0 w-full select-none whitespace-nowrap p-0 text-center",
              "font-display text-[10vw] font-light leading-[0.85] tracking-[-0.04em]",
              "opacity-0 motion-reduce:opacity-100",
              "max-md:leading-[0.9] max-md:tracking-[-0.03em]"
            )}
            aria-label={giantName}
          >
            {giantName}
          </h2>
        </div>
      </div>

      <button
        ref={scrollTopRef}
        onClick={handleScrollTop}
        type="button"
        aria-label={texts.footerSection.scrollTopAriaLabel}
        className={cn(
          "relative z-2 mx-auto mt-4 flex items-center gap-2 bg-transparent p-2",
          "cursor-pointer border-none",
          "font-body text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-accent/30",
          "transition-colors duration-300 hover:text-accent",
          "opacity-0 motion-reduce:opacity-100",
          "md:absolute md:right-8 md:bottom-8 md:mx-0 md:mt-0"
        )}
      >
        {texts.footerSection.scrollTopLabel}
        <span
          className={cn(
            "inline-flex size-7.5 items-center justify-center rounded-md border border-accent/8",
            "transition-all duration-300 ease-spring",
            "group-hover:border-accent",
            "motion-reduce:transition-none"
          )}
        >
          <svg
            className="size-3 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
              transform="rotate(-90 12 12)"
            />
          </svg>
        </span>
      </button>
    </footer>
  );
}