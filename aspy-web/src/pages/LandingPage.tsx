// aspy-web/src/page/LandingPage.tsx
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { C } from "@components/landing/constants";
import Navbar          from "@components/landing/Navbar";
import HeroSection     from "@components/landing/HeroSection";
import MissionSection  from "@components/landing/MissionSection";
import ServicesSection from "@components/landing/ServicesSection";
import AspyBandSection from "@components/landing/AspyBandSection";
import FooterCTA       from "@components/landing/FooterCTA";

export default function LandingPage() {
  return (
    <Box sx={{ background: C.offWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <HeroSection />
      <MissionSection />
      <Divider sx={{ borderColor: C.border, mx: { xs: 3, md: 8 } }} />
      <ServicesSection />
      <Divider sx={{ borderColor: C.border, mx: { xs: 3, md: 8 } }} />
      <AspyBandSection />
      <FooterCTA />
    </Box>
  );
}