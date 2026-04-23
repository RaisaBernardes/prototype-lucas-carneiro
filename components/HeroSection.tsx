import Image from "next/image";
import texts from "../app/texts/texts.json";

interface CredentialItem {
  label: string;
  value: string;
}

interface HeroSectionProps {
  imageSrc: string;
  imageAlt?: string;
  headline?: React.ReactNode;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  credentials?: CredentialItem[];
  quote?: string;
  quoteAttribution?: string;
  eyebrow?: string;
}

/* ── Desktop credential sub-components (unchanged) ── */
function CredentialDivider() {
  return <div className="h-6 w-px shrink-0 bg-border" aria-hidden />;
}

function CredentialPair({ label, value }: CredentialItem) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-body text-[9px] font-medium uppercase tracking-[0.14em] text-ink-light">
        {label}
      </span>
      <span className="font-body text-[12px] font-light text-ink-mid">
        {value}
      </span>
    </div>
  );
}

/* ── Mobile-only credential sub-components (v2) ── */
function MobileCredentialDivider() {
  return <div className="hero-mobile-credential-divider" aria-hidden />;
}

function MobileCredentialPair({ label, value }: CredentialItem) {
  return (
    <div className="hero-mobile-credential-item">
      <span className="hero-mobile-credential-label">{label}</span>
      <span className="hero-mobile-credential-value">{value}</span>
    </div>
  );
}

const t = texts.hero;

export default function HeroSection({
  imageSrc,
  imageAlt = t.imageAlt,
  headline = t.headline,
  body = t.body,
  ctaLabel = t.ctaLabel,
  ctaHref = t.ctaHref,
  credentials = t.credentials,
  quote = t.quote,
  quoteAttribution = t.quoteAttribution,
  eyebrow = t.eyebrow,
}: HeroSectionProps) {
  /* ─── Extract first / last name for sculptural mobile typography ─── */
  const headlineStr = typeof headline === "string" ? headline : "";
  const nameParts = headlineStr.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || headlineStr;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          MOBILE HERO — Cinematic Editorial v2 (≤ 767px)
          Completely separate markup for mobile-native art direction.
          Hidden on md+ via Tailwind.
         ═══════════════════════════════════════════════════════════ */}
      <section
        className="hero-mobile-surface block md:hidden"
        aria-label="Hero"
      >
        {/* Photo — cinematic portrait crop */}
        <div className="hero-mobile-photo-wrap hero-m-reveal-photo">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "52% 15%" }}
          />

          {/* Quote — hidden on mobile per brief */}
          {quote && (
            <div className="hero-mobile-quote-hide absolute bottom-5 left-5 z-10 max-w-[180px]" aria-hidden>
              <p className="mb-2 font-display text-[10px] font-light leading-relaxed italic text-overlay-strong">
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAttribution && (
                <p className="font-body text-[9px] font-normal uppercase tracking-[0.1em] text-overlay-medium">
                  {quoteAttribution}
                </p>
              )}
            </div>
          )}

          {/* Index number — hidden on mobile */}
          <span className="hero-mobile-index-hide absolute bottom-7 right-7 select-none font-display text-[11px] font-normal tracking-[0.15em] text-overlay-subtle" aria-hidden>
            01
          </span>
        </div>

        {/* Name — the signature move: anchored deeper into the photo/surface transition */}
        <div className="hero-mobile-name-anchor hero-m-reveal hero-m-delay-2">
          <h1 className="hero-mobile-name">
            <span className="hero-mobile-name-first">{firstName}</span>
            {lastName && <span className="hero-mobile-name-last">{lastName}</span>}
          </h1>
        </div>

        {/* Eyebrow — structural label */}
        <div className="hero-mobile-eyebrow hero-m-reveal hero-m-delay-3">
          <span className="hero-mobile-eyebrow-rule" aria-hidden />
          <span className="hero-mobile-eyebrow-text">{eyebrow}</span>
        </div>

        {/* Body copy */}
        <p className="hero-mobile-body hero-m-reveal hero-m-delay-4">
          {body}
        </p>

        {/* CTA — institutional object */}
        <a
          href={ctaHref}
          className="hero-mobile-cta hero-m-reveal hero-m-delay-5"
        >
          {ctaLabel}
        </a>

        {/* Credentials — architectural grid seal */}
        {credentials.length > 0 && (
          <div
            className="hero-mobile-credentials-wrap hero-m-reveal hero-m-delay-6"
            aria-label="Credenciais"
          >
            <div className="hero-mobile-credentials-inner">
              {credentials.map((cred) => (
                <MobileCredentialPair key={cred.label} {...cred} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP HERO — Original layout (md+), completely untouched.
          Hidden on mobile via Tailwind.
         ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative hidden min-h-svh min-h-[600px] w-full md:flex md:flex-row"
        aria-label="Hero"
      >
        <div
          className={[
            "relative overflow-hidden bg-button",
            "md:h-auto md:flex-1 md:order-2",
          ].join(" ")}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="73vw"
            className="object-cover"
            style={{ objectPosition: "70% top" }}
          />

          {quote && (
            <div className="absolute bottom-5 left-5 z-10 max-w-[180px]" aria-hidden>
              <p className="mb-2 font-display text-[10px] font-light leading-relaxed italic text-overlay-strong">
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAttribution && (
                <p className="font-body text-[9px] font-normal uppercase tracking-[0.1em] text-overlay-medium">
                  {quoteAttribution}
                </p>
              )}
            </div>
          )}

          <span
            className="absolute bottom-7 right-7 select-none font-display text-[11px] font-normal tracking-[0.15em] text-overlay-subtle"
            aria-hidden
          >
            01
          </span>
        </div>

        <div
          className={[
            "relative z-10 flex flex-col justify-center bg-bg",
            "w-full shrink-0 md:order-1 md:w-[40%]",
            "px-6 pb-12 pt-8",
            "md:px-10 md:pb-14 md:pt-[72px] lg:px-14",
          ].join(" ")}
        >
          <div className="mb-10 flex items-center gap-2.5">
            <span className="block h-px w-[22px] shrink-0 bg-accent" aria-hidden />
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </span>
          </div>

          <h1 className="mb-5 font-display text-[clamp(48px,5.5vw,82px)] font-light leading-[1.08] tracking-[-0.03em] text-ink">
            {headline}
          </h1>

          <p className="mb-9 max-w-[300px] font-body text-[16px] font-light leading-[1.75] text-ink-mid">
            {body}
          </p>

          <a
            href={ctaHref}
            className="self-start rounded-xs bg-button px-[30px] py-[13px] font-body text-[11px] font-normal uppercase tracking-[0.1em] text-bg no-underline transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-offset-2"
          >
            {ctaLabel}
          </a>

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
