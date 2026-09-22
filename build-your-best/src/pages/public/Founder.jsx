import React, { useEffect } from "react";
import AboutHero from "../../components/founder/Founderhero";
import OurApproach from "../../components/founder/Process";
import CoreValues from "../../components/founder/Values";
import AboutMission from "../../components/founder/Mission";
import FinalCTA from "../../components/founder/FinalCTA";

const Founder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <AboutHero />
      <OurApproach />
      <AboutMission />
      <CoreValues />
      <FinalCTA />
    </div>
  );
};

export default Founder;
