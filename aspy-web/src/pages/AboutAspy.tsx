// aspy-web/src/pages/AboutAspy.tsx
// Versión de la landing para usuarios con sesión iniciada (sin botones de ingreso ni de agenda).
import Box from "@mui/material/Box";
import { C } from "@components/landing/constants";
import { vh } from "@shared-theme/pantallaGrande";
import Navbar from "@components/landing/Navbar";
import HeroSection from "@components/landing/HeroSection";
import ImpactSection from "@components/landing/ImpactSection";
import MissionSection from "@components/landing/MissionSection";
import ServicesSection from "@components/landing/ServicesSection";
import TestimonialsSection from "@components/landing/TestimonialsSection";
import AspyBandSection from "@components/landing/AspyBandSection";
import SupportSection from "@components/landing/SupportSection";
import Footer from "@components/landing/Footer";
import WhatsAppButton from "@components/landing/WhatsAppButton";
import { useLandingContent } from "@/content/landing/useLandingContent";

export default function AboutAspy() {
  const content = useLandingContent();

  return (
    <Box sx={{ bgcolor: C.offWhite, minHeight: vh(100), overflowX: "hidden" }}>
      <Navbar navigation={content.navigation} logo={content.site.logo} showAuthButton={false} />
      <Box component="main">
        <HeroSection content={content.hero} social={content.social} showScrollHint={content.impact.stats.length === 0} showCtas={false} />
        <ImpactSection content={content.impact} />
        <MissionSection content={content.mission} />
        <ServicesSection content={content.services} />
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
        showCtas={false}
      />
      <WhatsAppButton contact={content.contact} />
    </Box>
  );
}
