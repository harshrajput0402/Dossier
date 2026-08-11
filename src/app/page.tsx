import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { ProblemCards } from "@/components/landing/ProblemCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AiSpotlight } from "@/components/landing/AiSpotlight";
import { FooterCta } from "@/components/landing/FooterCta";

// Public landing page — no auth required.
export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <ProblemCards />
      <HowItWorks />
      <AiSpotlight />
      <FooterCta />
    </>
  );
}
