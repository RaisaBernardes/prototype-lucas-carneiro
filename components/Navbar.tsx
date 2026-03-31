"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Close mobile menu on route change (basic hash navigation) ────────────
  const handleMobileLink = () => setMobileOpen(false);

  // ── Derived style values ──────────────────────────────────────────────────
  const opaque = scrolled || alwaysOpaque;

  return (
    <>
      {/* ── TOKEN SCOPE ────────────────────────────────────────────────── */}
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
        <div
          className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-10 lg:px-14"
        >
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
                /*
                 * When the nav is transparent (over the dark hero image) we
                 * invert the logo so a dark PNG becomes white.
                 * Remove this filter if your logo already handles both states.
                 */
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

          {/* ── HAMBURGER ────────────────────────────────────────────── */}
          <button
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center md:hidden"
            style={{
              color: opaque ? "var(--color-ink)" : "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.3s",
            }}
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
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
          "navbar-root",
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 md:hidden",
          "transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ background: "var(--color-bg)" }}
      >
        {/* Mobile logo */}
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          style={{
            width: logoWidth,
            height: logoHeight,
            objectFit: "contain",
            marginBottom: 8,
          }}
        />

        {/* Mobile nav links */}
        <nav aria-label="Navegação mobile">
          <ul className="flex flex-col items-center gap-8 list-none p-0 m-0">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleMobileLink}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px,7vw,36px)",
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

        {/* Mobile CTA */}
        <Link
          href={cta.href}
          onClick={handleMobileLink}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "13px 32px",
            background: "var(--color-cta-bg)",
            color: "var(--color-cta-text)",
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 0,
            marginTop: 8,
          }}
        >
          {cta.label}
        </Link>

        {/* Mobile close button (top-right) */}
        <button
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
          className="absolute right-6 top-5 flex h-11 w-11 items-center justify-center"
          style={{
            color: "var(--color-ink)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <IconClose />
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon primitives
// ─────────────────────────────────────────────────────────────────────────────

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <line x1="2" y1="5"  x2="18" y2="5"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <line x1="4" y1="4"  x2="16" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="4" x2="4"  y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
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
