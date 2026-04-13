"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  /** PNG (or any format) logo shown on the left */
  logoSrc: string;
  logoAlt?: string;
  /** Rendered width of the logo in px — height scales proportionally */
  logoWidth?: number;
  logoHeight?: number;
  /** Navigation links rendered in the centre-right area */
  links?: NavLink[];
  /** Label and href for the primary CTA at the far right */
  cta?: { label: string; href: string };
  /**
   * When true the navbar starts opaque (useful for interior pages).
   * When false (default) it starts transparent and becomes opaque on scroll.
   */
  alwaysOpaque?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_LINKS: NavLink[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Procedimentos", href: "#tratamentos" },
  { label: "Contato", href: "#contato" },
];

const DEFAULT_CTA = { label: "Agendar consulta", href: "#contato" };

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────

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

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    if (alwaysOpaque) return;

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysOpaque]);

  // ── Lock body scroll when mobile menu is open ─────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Close mobile menu on route change (basic hash navigation) ────────────
  const handleMobileLink = useCallback(() => setMobileOpen(false), []);

  // ── Derived style values ──────────────────────────────────────────────────
  const opaque = scrolled || alwaysOpaque;

  return (
    <>
      {/* ── TOKEN SCOPE + MOBILE MENU ANIMATIONS ───────────────────── */}
      <style>{`
        .navbar-root {
          --font-body:        'DM Sans', system-ui, sans-serif;
          --font-display:     'Cormorant Garamond', Georgia, serif;
          --color-bg:         #FAFAF8;
          --color-ink:        #0D1921;
          --color-ink-mid:    #555550;
          --color-ink-light:  #888883;
          --color-border:     #E8E4DE;
          --color-cta-bg:     #132529;
          --color-cta-text:   #FAFAF8;
          --color-accent:     #4A6B72;
          --nav-height:       64px;
        }

        /* Underline grow on hover */
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

        /* CTA underline-only style */
        .nav-cta-link {
          position: relative;
          padding-bottom: 2px;
          border-bottom: 1px solid currentColor;
          transition: opacity 0.2s;
        }
        .nav-cta-link:hover { opacity: 0.7; }

        /* ═══════════════════════════════════════
           MOBILE MENU — Cellart-inspired motion
           ═══════════════════════════════════════ */

        /* Hamburger → X morph */
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

        /* Full-screen overlay — slides down from top */
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

        /* Staggered link reveal — clips + slides text upward */
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

        /* Per-link stagger delays (0.5s base + i * 0.08s) */
        .mobile-overlay.is-open .stagger-0 { transition-delay: 0.50s; }
        .mobile-overlay.is-open .stagger-1 { transition-delay: 0.58s; }
        .mobile-overlay.is-open .stagger-2 { transition-delay: 0.66s; }
        .mobile-overlay.is-open .stagger-3 { transition-delay: 0.74s; }
        .mobile-overlay.is-open .stagger-4 { transition-delay: 0.82s; }
        .mobile-overlay.is-open .stagger-5 { transition-delay: 0.90s; }

        /* CTA button entrance */
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

        /* Exit: reset immediately (no lingering stagger on close) */
        .mobile-overlay:not(.is-open) .mobile-link-inner,
        .mobile-overlay:not(.is-open) .mobile-cta-inner {
          transition-delay: 0s;
          transition-duration: 0.2s;
        }

        /* Decorative divider inside overlay */
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

      {/* ── DESKTOP / TABLET NAVBAR ────────────────────────────────────── */}
      <header
        className={[
          "navbar-root",
          "fixed inset-x-0 top-0 z-50",
          "transition-[background-color,border-color,backdrop-filter] duration-300",
        ].join(" ")}
        style={{
          height: "var(--nav-height)",
          backgroundColor: opaque ? "rgba(250,250,248,0.97)" : "transparent",
          borderBottom: opaque
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          backdropFilter: opaque ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 md:px-10 lg:px-14">
          {/* ── LOGO ─────────────────────────────────────────────────── */}
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

          {/* ── DESKTOP LINKS ────────────────────────────────────────── */}
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-8 md:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: opaque
                    ? "var(--color-ink-mid)"
                    : "rgba(255,255,255,0.78)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Separator */}
            <span
              aria-hidden
              style={{
                width: 1,
                height: 16,
                background: opaque
                  ? "var(--color-border)"
                  : "rgba(255,255,255,0.2)",
                transition: "background 0.3s",
              }}
            />

            {/* CTA */}
            <Link
              href={cta.href}
              className="nav-cta-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: opaque
                  ? "var(--color-accent)"
                  : "rgba(255,255,255,0.9)",
                textDecoration: "none",
                transition: "color 0.3s, border-color 0.3s",
                borderBottomColor: opaque
                  ? "var(--color-accent)"
                  : "rgba(255,255,255,0.5)",
              }}
            >
              {cta.label}
            </Link>
          </nav>

          {/* ── HAMBURGER (morphs to X) ──────────────────────────────── */}
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
                  : "#fff",
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

      {/* ── MOBILE OVERLAY MENU ────────────────────────────────────────── */}
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
        {/* Decorative divider */}
        <div className="mobile-divider mb-10" />

        {/* Mobile nav links — staggered clip-reveal */}
        <nav aria-label="Navegação mobile">
          <ul className="flex flex-col items-center gap-7 list-none p-0 m-0">
            {links.map((link, i) => (
              <li key={link.href} className="mobile-link-clip">
                <Link
                  href={link.href}
                  onClick={handleMobileLink}
                  className={`mobile-link-inner stagger-${i}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 7vw, 40px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "var(--color-ink)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile CTA — enters last in the stagger sequence */}
        <div className="mobile-cta-wrap mt-10">
          <Link
            href={cta.href}
            onClick={handleMobileLink}
            className="mobile-cta-inner"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 34px",
              background: "var(--color-cta-bg)",
              color: "var(--color-cta-text)",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            {cta.label}
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mobile-divider mt-10" />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Usage example
// ─────────────────────────────────────────────────────────────────────────────
//
//   import Navbar from "@/components/Navbar";
//
//   // In layout.tsx (recommended — renders once across all pages):
//   export default function RootLayout({ children }) {
//     return (
//       <html lang="pt-BR">
//         <body>
//           <Navbar
//             logoSrc="/images/logo.png"
//             logoAlt="Dr. Leandro Gregório"
//             logoWidth={148}
//             logoHeight={36}
//           />
//           <main>{children}</main>
//         </body>
//       </html>
//     );
//   }
//
//   // Pair with HeroSection — the transparent-to-opaque transition
//   // happens automatically as the user scrolls past the hero image.
//
//   // For interior pages where the nav should always be opaque:
//   <Navbar logoSrc="/images/logo.png" alwaysOpaque />
//
// ─────────────────────────────────────────────────────────────────────────────
