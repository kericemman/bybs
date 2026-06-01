import React from 'react'
import { useEffect } from 'react'
import Hero from '../../components/home/Hero'
import AboutSection from '../../components/home/About'
import ServicesProducts from '../../components/home/Services'

import WhoWeServe from '../../components/home/Who'
import Testimonials from '../../components/home/Testimonials'
import FeaturedProducts from '../../components/home/FeatureProduct'
import FloatingCharityBanner from '../../components/home/FloatingCharity';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div>
      
      <Hero/>
      <AboutSection/>
      <WhoWeServe/>
      <ServicesProducts/>
      <FeaturedProducts/>
      <Testimonials/>
       <FloatingCharityBanner />
    </div>
  )
}

export default Home
