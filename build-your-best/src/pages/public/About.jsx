import React, { useEffect } from 'react'
import AboutHero from '../../components/about/AboutHero'
import AboutMission from '../../components/about/AboutMission'
import WhoSheServes from '../../components/about/AboutWe'
import TransformationSection from '../../components/about/AboutCTA'

const About = () => {
            useEffect(() => {
                    window.scrollTo(0, 0);
            }, []);
        return (
            <div>
                <AboutHero/>
                <AboutMission/>
                <WhoSheServes/>
                <TransformationSection/>
            </div>
        )
    }

export default About
