"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import SplashScreen from "@/components/SplashScreen";
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ScrollTextReveal from '@/components/ScrollTextReview';
import StoryCards from "@/components/StoryCards";
import TestimonialsMarquee from "@/components/Testimonial";
import Footer from "@/components/Footer";
import ContactSection from "../components/ContactSection";


export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  // ✅ useEffect dentro do componente
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Cleanup ao desmontar
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {!splashDone && (
        <SplashScreen onComplete={() => setSplashDone(true)} />
      )}

      <main
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Navbar
          logoSrc="/images/leandro-gregorio/logo-leandro.webp"
          logoAlt="Dr. Leandro Gregório"
          logoWidth={148}
          logoHeight={36}
        />
        <HeroSection imageSrc="/images/leandro-gregorio/hero1.png" />
        <AboutSection />
        <ScrollTextReveal
          text="Eu sei o que é sentir que algo não reflete quem você é por dentro. Cada paciente que entra no meu consultório traz muito mais do que um desejo estético — traz uma história. E é a partir dela que o trabalho verdadeiro começa."
          bgColor="#FAFAF8"
          colorFrom="rgba(13,25,33,0.18)"
          colorTo="rgba(13,25,33,0.45)"
          accentWords={["não", "reflete", "traz", "uma", "história.", "trabalho", "verdadeiro", "começa."]}
          accentColor="#2B3B3F"
          accentFontWeight={700}
          fontFamily="var(--font-body), system-ui, sans-serif"
          fontSize="clamp(20px, 2.8vw, 40px)"
          fontWeight={300}
          lineHeight={1.15}
          letterSpacing="-0.03em"
          contentPaddingLeft="38%"
          contentMaxWidth="100%"
        />
        <StoryCards
          cards={[
            {
              index: "01",
              title: "Cirurgia Plástica corporal",
              body: "Abdominoplastia.\n\nBraquioplastia.\n\nMamoplastia.\n\nGluteoplastia.\n\nLipoaspiração de definição.\n\nLipoescultura",
              bodyMobile: "Abdominoplastia.\n\nBraquioplastia.\n\nMamoplastia.\n\nGluteoplastia.\n\nLipoaspiração de definição.\n\nLipoescultura",
              bulletImages: [
                { src: "/images/leandro-gregorio/procedimentos/abdomem2.png", alt: "Abdominoplastia" },
                { src: "/images/leandro-gregorio/procedimentos/braco2.png", alt: "Braquioplastia" },
                { src: "/images/leandro-gregorio/procedimentos/mama2.png", alt: "Mamoplastia" },
                { src: "/images/leandro-gregorio/procedimentos/gluteo2.png", alt: "Gluteoplastia" },
                { src: "/images/leandro-gregorio/procedimentos/lipodefinicao2.png", alt: "Lipodefinicao" },
              ],
            },
            {
              index: "02",
              title: "Cirurgia Plástica da Face",
              body: "Blefaroplastia\n\nLifting Cervical (pescoço).\n\nLifting Facial.\n\nLipoenxertia.\n\nLipoaspiração de definição.\n\nPálpebras.\n\nRinoplastia.",
              bodyMobile: "Blefaroplastia\n\nLifting Cervical (pescoço).\n\nLifting Facial.\n\nLipoenxertia.\n\nLipoaspiração de definição.\n\nPálpebras.\n\nRinoplastia.",
            },
            {
              index: "03",
              title: "Cirurgia Plástica Estética e Reparadora",
              body: "Estética íntima.\n\nFlacidez nas mamas.\n\nMastopexia com e sem prótese.\n\nPós-bariátrica.\n\nPrótese de mama.\n\nRedução de mama.\n\nTumores de pele e cicatrizes.",
              bodyMobile: "Estética íntima.\n\nFlacidez nas mamas.\n\nMastopexia com e sem prótese.\n\nPós-bariátrica.\n\nPrótese de mama.\n\nRedução de mama.\n\nTumores de pele e cicatrizes.",
            
            },
                    {
              index: "04",
              title: "Procedimentos Estéticos injetáveis",
              body: "Bioestimuladores de colágeno\n\nPreenchimento com ácido hialurônico.\n\nToxina botulínica",
              bodyMobile: "Bioestimuladores de colágeno\n\nPreenchimento com ácido hialurônico.\n\nToxina botulínica",
            
            },
          ]}
          
        />
        <TestimonialsMarquee />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}