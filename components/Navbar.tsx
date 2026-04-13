"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logoSrc: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  links?: NavLink[];
  cta?: { label: string; href: string };
  alwaysOpaque?: boolean;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Procedimentos", href: "#tratamentos" },
  { label: "Contato", href: "#contato" },
];

const DEFAULT_CTA = { label: "Agendar consulta", href: "#contato" };

export default function Navbar({
  logoSrc,
  logoAlt = "Logo",
  logoWidth = 140,
  logoHeight = 40,
  links = DEFAULT_LINKS,
  cta = DEFAULT_CTA,
  alwaysOpaque = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(alwaysOpaque);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (alwaysOpaque) return;

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysOpaque]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMobileLink = useCallback(() => setMobileOpen(false), []);

  const opaque = scrolled || alwaysOpaque;

  return (
    <>
      <style>{`
        .navbar-root {
          --nav-height: 64px;
        }

        .nav-link-item {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: currentColor;
          transition: width 0.25s ease;
        }
        .nav-link-item:hover::after { width: 100%; }

        .nav-cta-link {
          position: relative;
          padding-bottom: 2px;
          border-bottom: 1px solid currentColor;
          transition: opacity 0.2s;
        }
        .nav-cta-link:hover { opacity: 0.7; }

        .burger-line {
          display: block;
          width: 20px;
          height: 1.4px;
          background: currentColor;
          border-radius: 1px;
          transition: transform 0.35s cubic-bezier(0.76, 0, 0.18, 1),
                      opacity  0.25s ease;
          transform-origin: center;
        }
        .burger-open .burger-top {
          transform: translateY(6.3px) rotate(45deg);
        }
        .burger-open .burger-mid {
          opacity: 0;
          transform: scaleX(0);
        }
        .burger-open .burger-bot {
          transform: translateY(-6.3px) rotate(-45deg);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          transform: translate3d(0, -100%, 0);
          transition: transform 0.55s cubic-bezier(0.76, 0, 0.18, 1) 0.05s;
          will-change: transform;
          pointer-events: none;
        }
        .mobile-overlay.is-open {
          transform: translateZ(0);
          pointer-events: auto;
        }

        .mobile-link-clip {
          overflow: hidden;
        }
        .mobile-link-inner {
          display: block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.18, 1),
                      opacity  0.4s ease;
        }
        .mobile-overlay.is-open .mobile-link-inner {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-overlay.is-open .stagger-0 { transition-delay: 0.50s; }
        .mobile-overlay.is-open .stagger-1 { transition-delay: 0.58s; }
        .mobile-overlay.is-open .stagger-2 { transition-delay: 0.66s; }
        .mobile-overlay.is-open .stagger-3 { transition-delay: 0.74s; }
        .mobile-overlay.is-open .stagger-4 { transition-delay: 0.82s; }
        .mobile-overlay.is-open .stagger-5 { transition-delay: 0.90s; }

        .mobile-cta-wrap {
          overflow: hidden;
        }
        .mobile-cta-inner {
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.18, 1),
                      opacity  0.4s ease;
        }
        .mobile-overlay.is-open .mobile-cta-inner {
          transform: translateY(0);
          opacity: 1;
          transition-delay: ${0.5 + DEFAULT_LINKS.length * 0.08 + 0.06}s;
        }

        .mobile-overlay:not(.is-open) .mobile-link-inner,
        .mobile-overlay:not(.is-open) .mobile-cta-inner {
          transition-delay: 0s;
          transition-duration: 0.2s;
        }

        .mobile-divider {
          width: 28px;
          height: 1px;
          background: var(--color-border);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .mobile-overlay.is-open .mobile-divider {
          opacity: 1;
          transition-delay: 0.46s;
        }
      `}</style>

      <header
        className="navbar-root fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
        style={{
          height: "var(--nav-height)",
          backgroundColor: opaque ? "var(--color-nav-bg-opaque)" : "transparent",
          borderBottom: opaque
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          backdropFilter: opaque ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 md:px-10 lg:px-14">
          <Link
            href="/"
            aria-label="Ir para o início"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ outlineColor: "var(--color-accent)" }}
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              style={{
                width: logoWidth,
                height: logoHeight,
                objectFit: "contain",
                objectPosition: "left center",
                filter: opaque ? "none" : "brightness(0) invert(1)",
                transition: "filter 0.3s ease",
              }}
            />
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 md:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item font-body text-[11px] font-normal uppercase tracking-[0.12em] no-underline transition-colors duration-300"
                style={{
                  color: opaque
                    ? "var(--color-ink-mid)"
                    : "var(--color-nav-link-on-image)",
                }}
              >
                {link.label}
              </Link>
            ))}

            <span
              aria-hidden
              style={{
                width: 1,
                height: 16,
                background: opaque
                  ? "var(--color-border)"
                  : "var(--color-nav-divider-on-image)",
                transition: "background 0.3s",
              }}
            />

            <Link
              href={cta.href}
              className="nav-cta-link font-body text-[11px] font-medium uppercase tracking-[0.12em] no-underline"
              style={{
                color: opaque
                  ? "var(--color-accent)"
                  : "var(--color-nav-cta-on-image)",
                transition: "color 0.3s, border-color 0.3s",
                borderBottomColor: opaque
                  ? "var(--color-accent)"
                  : "var(--color-nav-cta-border-on-image)",
              }}
            >
              {cta.label}
            </Link>
          </nav>

          <button
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className={[
              "relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden",
              mobileOpen ? "burger-open" : "",
            ].join(" ")}
            style={{
              color: mobileOpen
                ? "var(--color-ink)"
                : opaque
                  ? "var(--color-ink)"
                  : "var(--color-white)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.3s",
            }}
          >
            <span className="burger-line burger-top" />
            <span className="burger-line burger-mid" />
            <span className="burger-line burger-bot" />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={[
          "navbar-root mobile-overlay md:hidden",
          mobileOpen ? "is-open" : "",
        ].join(" ")}
      >
        <div className="mobile-divider mb-10" />

        <nav aria-label="Navegação mobile">
          <ul className="m-0 flex list-none flex-col items-center gap-7 p-0">
            {links.map((link, i) => (
              <li key={link.href} className="mobile-link-clip">
                <Link
                  href={link.href}
                  onClick={handleMobileLink}
                  className={`mobile-link-inner stagger-${i} font-display text-[clamp(28px,7vw,40px)] font-light tracking-[0.01em] text-ink no-underline`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-cta-wrap mt-10">
          <Link
            href={cta.href}
            onClick={handleMobileLink}
            className="mobile-cta-inner inline-flex items-center bg-card px-[34px] py-[14px] font-body text-[11px] font-normal uppercase tracking-[0.1em] text-bg no-underline"
          >
            {cta.label}
          </Link>
        </div>

        <div className="mobile-divider mt-10" />
      </div>
    </>
  );
}