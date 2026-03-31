import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CredentialItem {
  label: string;
  value: string;
}

interface HeroSectionProps {
  /** Path to the doctor's photo — optimised via next/image */
  imageSrc: string;
  imageAlt?: string;
  /** Hero headline — accepts JSX so line breaks are easy */
  headline?: React.ReactNode;
  /** Short sub-paragraph under the headline */
  body?: string;
  /** Label shown on the primary CTA button */
  ctaLabel?: string;
  /** Where the CTA points – use "#contato" or a page route */
  ctaHref?: string;
  /** Small credential strip rendered at the bottom of the left column */
  credentials?: CredentialItem[];
  /** Pull-quote overlaid on the image */
  quote?: string;
  /** Attribution line for the quote */
  quoteAttribution?: string;
  /** Eyebrow label e.g. "Cirurgia Plástica · Consolação, São Paulo" */
  eyebrow?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function CredentialDivider() {
  return (
    <div
      className="w-px shrink-0"
      style={{ height: 24, background: "var(--color-border)" }}
      aria-hidden
    />
  );
}

function CredentialPair({ label, value }: CredentialItem) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="uppercase tracking-widest"
        style={{
          fontSize: 9,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          color: "var(--color-ink-light)",
          letterSpacing: "0.14em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          color: "var(--color-ink-mid)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default prop values — mirrors the Dr. Leandro Gregório project
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CREDENTIALS: CredentialItem[] = [
  { label: "CRM-SP", value: "231278" },
  { label: "RQE", value: "136020" },
  { label: "Membro", value: "SBCP · ISAPS" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection({
  imageSrc,
  imageAlt = "Dr. Leandro Gregório — Cirurgião Plástico",
  headline = (
    <>
      Leandro Gregório
    </>
  ),
  body = "Cirurgia plástica com precisão, critério e respeito absoluto pela sua identidade.",
  ctaLabel = "Agendar conversa",
  ctaHref = "#contato",
  credentials = DEFAULT_CREDENTIALS,
  quote = "Cada cirurgia é um encontro entre confiança, responsabilidade e propósito.",
  quoteAttribution = "Dr. Leandro Gregório — Cirurgião Plástico",
  eyebrow = "Cirurgia Plástica",
}: HeroSectionProps) {
  return (
    <>
      <style>{`
        .hero-root {
          --font-display: 'Fraunces', serif;
          --font-body:    'Work Sans', sans-serif;
          --color-white:      #FFFFFF;
          --color-off-white:  #FAFAF8;
          --color-ink:        #0D1921;
          --color-ink-mid:    #555550;
          --color-ink-light:  #888883;
          --color-cta-bg:     #2B3B3F;
          --color-cta-text:   #FAFAF8;
          --color-border:     #E8E4DE;
          --color-accent:     #4A6B72;
        }
      `}</style>

      <section
        className="hero-root relative flex flex-col md:flex-row min-h-svh min-h-[600px] w-full"
        aria-label="Hero"
      >
        {/*
         * ── IMAGE COLUMN ─────────────────────────────────────────────────────
         * On mobile: appears first (natural DOM order), fixed height.
         * On desktop: takes the remaining 73 % on the right side.
         */}
        <div
          className={[
            "relative overflow-hidden",
            // Mobile: fixed height at the top
            "h-[65vw] shrink-0",
            // Desktop: flexible right column
            "md:h-auto md:flex-1 md:order-2",
          ].join(" ")}
          style={{ background: "var(--color-button)" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 73vw"
            className="object-cover"
            style={{ objectPosition: "70% top" }}
          />

          {/* Pull-quote overlay — bottom-left of image */}
          {quote && (
            <div
              className="absolute left-5 bottom-5 z-10 max-w-[180px]"
              aria-hidden
            >
              <p
                className="mb-2 leading-relaxed"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAttribution && (
                <p
                  className="uppercase tracking-[0.1em]"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  {quoteAttribution}
                </p>
              )}
            </div>
          )}

          {/* Decorative section index */}
          <span
            className="absolute bottom-7 right-7 select-none"
            aria-hidden
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            01
          </span>
        </div>

        {/*
         * ── TEXT COLUMN ──────────────────────────────────────────────────────
         * On mobile: appears second (below the image).
         * On desktop: 40 % width on the left side.
         */}
        <div
          className={[
            "relative z-10 flex flex-col justify-center",
            "w-full md:w-[40%] shrink-0 md:order-1",
            "px-6 pb-12 pt-8",
            "md:px-10 lg:px-14 md:pb-14 md:pt-[72px]",
          ].join(" ")}
          style={{ background: "var(--color-offwhite)" }}
        >
          {/* Eyebrow */}
          <div className="mb-10 flex items-center gap-2.5">
            <span
              className="block shrink-0"
              style={{
                width: 22,
                height: 1,
                background: "var(--color-accent)",
              }}
              aria-hidden
            />
            <span
              className="uppercase tracking-[0.2em]"
              style={{
                fontSize: 10,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--color-accent)",
              }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mb-5 leading-[1.08]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 5.5vw, 82px)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
            }}
          >
            {headline}
          </h1>

          {/* Body */}
          <p
            className="mb-9 max-w-[300px]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.75,
              color: "var(--color-ink-mid)",
            }}
          >
            {body}
          </p>

          {/* CTA */}
          <a
            href={ctaHref}
            className="self-start rounded-xs transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-offset-2"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "13px 30px",
              background: "var(--color-cta-bg)",
              color: "var(--color-cta-text)",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "rounded-sm",
            }}
          >
            {ctaLabel}
          </a>

          {/* Credential strip — pinned to bottom of column */}
          {credentials.length > 0 && (
            <div
              className="mt-auto flex flex-wrap items-center gap-4 pt-12"
              aria-label="Credenciais"
            >
              {credentials.map((cred, i) => (
                <div key={cred.label} className="flex items-center gap-4">
                  {i > 0 && <CredentialDivider />}
                  <CredentialPair {...cred} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Usage example (delete before shipping):
//
//   import HeroSection from "@/components/HeroSection";
//   import drPhoto from "@/public/images/dr-leandro.jpg";
//
//   export default function Home() {
//     return <HeroSection imageSrc={drPhoto.src} />;
//   }
//
// All props have sensible defaults — just pass `imageSrc` to get started.
// ─────────────────────────────────────────────────────────────────────────────
