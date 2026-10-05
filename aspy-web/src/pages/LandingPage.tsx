// aspy-web/src/pages/LandingPage.tsx
import Box from "@mui/material/Box";
import { C, largeScreenZoom } from "@components/landing/constants";
import Navbar from "@components/landing/Navbar";
import HeroSection from "@components/landing/HeroSection";
import ImpactSection from "@components/landing/ImpactSection";
import MissionSection from "@components/landing/MissionSection";
import ServicesSection from "@components/landing/ServicesSection";
import StepsSection from "@components/landing/StepsSection";
import TestimonialsSection from "@components/landing/TestimonialsSection";
import AspyBandSection from "@components/landing/AspyBandSection";
import SupportSection from "@components/landing/SupportSection";
import Footer from "@components/landing/Footer";
import WhatsAppButton from "@components/landing/WhatsAppButton";
import { useLandingContent } from "@/content/landing/useLandingContent";

export default function LandingPage() {
  const content = useLandingContent();
  // Con sesión iniciada, "Agendar" lleva al panel; si no, al registro
  const scheduleHref = localStorage.getItem("token") ? "/dashboard" : "/register";

  return (
    <Box sx={{ bgcolor: C.offWhite, minHeight: "100vh", overflowX: "hidden", ...largeScreenZoom }}>
      <Navbar navigation={content.navigation} logo={content.site.logo} />
      <Box component="main">
        <HeroSection content={content.hero} social={content.social} showScrollHint={content.impact.stats.length === 0} primaryHref={scheduleHref} />
        <ImpactSection content={content.impact} />
        <MissionSection content={content.mission} />
        <ServicesSection content={content.services} />
        <StepsSection content={content.steps} ctaHref={scheduleHref} />
        <TestimonialsSection content={content.testimonials} />
        <AspyBandSection content={content.band} />
        <SupportSection content={content.support} />
      </Box>
      <Footer
        contact={content.contact}
        social={content.social}
        footer={content.footer}
        navigation={content.navigation}
        logo={content.site.logo}
        ctaLabel={content.hero.primaryCtaLabel}
        primaryHref={scheduleHref}
      />
      <WhatsAppButton contact={content.contact} />
    </Box>
  );
}
