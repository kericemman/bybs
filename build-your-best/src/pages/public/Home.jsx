import { useEffect } from "react";
import Hero from "../../components/home/Hero";
import AboutSection from "../../components/home/About";
import WhoWeServe from "../../components/home/Who";
import Services from "../../components/home/Services";
import Testimonials from "../../components/home/Testimonials";
import FeaturedProducts from "../../components/home/FeatureProduct";
import {
  CommunityPreview,
  FeaturedImpact,
  GetInvolvedPreview,
  ImpactProof,
  LatestInsights,
  StayConnected,
  WeeklyReflectionPreview,
} from "../../components/home/HomeSections";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Hero />
      <ImpactProof />
      <AboutSection />
      <WhoWeServe />
      <Services />
      <FeaturedImpact />

      <CommunityPreview />
      <LatestInsights />
      <WeeklyReflectionPreview />
      <GetInvolvedPreview />
      <FeaturedProducts />
      <Testimonials />
      <StayConnected />
    </div>
  );
}
