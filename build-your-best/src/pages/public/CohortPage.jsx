import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ChevronRight, Users, Calendar, Award, Play, Pause, ChevronLeft, X } from 'lucide-react';
import { Link } from "react-router-dom";
import WaitlistModal from "../../components/modal/WaitlistModal";

export default function CohortsPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Auto-play slideshow
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % cohortImages.length);
      }, 4000);
    }
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isAutoPlaying]);

  const cohortImages = [
    { 
      id: 1, 
      title: "Opening Session", 
      description: "Beginning the journey together",
      image: "/assets/c1.jpeg"
    },
    { 
      id: 2, 
      title: "Group Workshop", 
      description: "Deep conversations and breakthroughs",
      image: "/assets/c2.jpeg"
    },
    { 
      id: 3, 
      title: "One-on-One Discussions", 
      description: "Personalized guidance sessions",
      image: "/assets/c3.jpeg"
    },
    { 
      id: 4, 
      
      image: "/assets/c6.jpeg"
    },
    { 
      id: 5, 
     
      image: "/assets/c4.jpeg"
    },
    { 
      id: 6, 
      
      image: "/assets/c5.jpeg"
    }
  ];

  const cohortDetails = {
    title: "First BYBS Fellowship Cohort",
    date: "August - October 2025",
    description: "The inaugural cohort that transformed vision into reality. What began as an idea became a shared journey of learning, unlearning, and becoming.",
    highlights: [
      { icon: <Users className="w-5 h-5" />, text: "20+ participants from diverse backgrounds" },
      { icon: <Calendar className="w-5 h-5" />, text: "12 weeks of intensive personal growth" },
      { icon: <Award className="w-5 h-5" />, text: "85% completion rate with transformative results" }
    ],
    achievements: [
      "Personal breakthrough stories from every participant",
      "Strong community bonds that continue beyond the program",
      "Measurable mindset shifts and emotional growth",
      "Practical life skills applied in real-world contexts"
    ]
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % cohortImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + cohortImages.length) % cohortImages.length);
  };

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* Hero Section - Responsive */}
      <section className="relative pt-16 md:pt-24 pb-12 md:pb-24 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 md:w-80 h-64 md:h-80 bg-[#B76E79] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 md:w-96 h-72 md:h-96 bg-[#FFD166] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-2 md:px-0"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 leading-tight">
              BYBS <span className="font-bold bg-gradient-to-r from-[#FFD166] to-[#B76E79] bg-clip-text text-transparent">Cohorts</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Shared journeys of growth, transformation, and intentional living.
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto px-2 sm:px-0">
              Each cohort is a chapter. Each participant, a story. Together, we rise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content & Gallery Section - Responsive Grid */}
      <section className="py-8 md:py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
            {/* Left Column: Cohort Content - Responsive Width */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6 md:space-y-8"
              >
                <div>
                  <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-[#00337C]/10 text-[#00337C] rounded-full text-xs md:text-sm mb-3 md:mb-4">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 flex-shrink-0" />
                    <span className="truncate">Graduated • {cohortDetails.date}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#00337C] mb-4 md:mb-6 break-words">
                    {cohortDetails.title}
                  </h2>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
                    {cohortDetails.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-light text-[#00337C]">Cohort Highlights</h3>
                  <div className="space-y-3 md:space-y-4">
                    {cohortDetails.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 md:gap-4">
                        
                        <p className="text-sm md:text-base text-gray-700 pt-1 flex-1">{highlight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="pt-4 md:pt-6 border-t border-gray-100">
                  <h3 className="text-lg md:text-xl font-light text-[#00337C] mb-3 md:mb-4">Key Achievements</h3>
                  <ul className="space-y-2 md:space-y-3">
                    {cohortDetails.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start text-sm md:text-base text-gray-700">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#B76E79] rounded-full mt-2 md:mt-2.5 mr-2 md:mr-3 flex-shrink-0"></div>
                        <span className="flex-1">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact Quote */}
                <div className="bg-gradient-to-r from-[#F5F9FF] to-[#FFF0F0] p-4 md:p-6 rounded-xl border-l-4 border-[#00337C] mt-4 md:mt-6">
                  <p className="text-sm md:text-base text-gray-700 italic leading-relaxed">
                    "This fellowship was never about perfection. It was about presence,
                    showing up honestly, doing the inner work, and choosing growth even when it felt uncomfortable."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Gallery - Responsive Width */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4 md:space-y-6"
                ref={galleryRef}
              >
                {/* Gallery Title - Mobile Only */}
                <div className="lg:hidden">
                  <h3 className="text-lg font-light text-[#00337C] mb-2">Gallery</h3>
                </div>

                {/* Main Gallery Image - Responsive */}
                <div 
                  className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl w-full"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {/* Maintain aspect ratio container */}
                  <div className="relative pt-[75%] md:pt-[75%]">
                    {/* Actual Image */}
                    <img
                      src={cohortImages[currentImage].image}
                      alt={cohortImages[currentImage].title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentElement?.parentElement?.querySelector('.image-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback if image fails to load */}
                    <div className="image-fallback hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center px-4">
                        <div className="text-3xl md:text-4xl lg:text-6xl mb-2 md:mb-3 lg:mb-4 text-gray-300">📸</div>
                        <div className="text-base md:text-lg lg:text-2xl font-light text-gray-700 mb-1 md:mb-2">
                          {cohortImages[currentImage].title}
                        </div>
                        <div className="text-xs md:text-sm lg:text-base text-gray-600">
                          {cohortImages[currentImage].description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4 lg:p-6 text-white">
                      <div className="text-sm md:text-base lg:text-lg font-medium truncate">
                        {cohortImages[currentImage].title}
                      </div>
                      <div className="text-xs md:text-sm text-white/80 mt-0.5 truncate">
                        {cohortImages[currentImage].description}
                      </div>
                    </div>
                    
                    {/* Navigation Controls */}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-2">
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="bg-black/40 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full transition-colors"
                        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                      >
                        {isAutoPlaying ? (
                          <Pause className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <Play className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Navigation Arrows - Always Visible on Mobile, Hover on Desktop */}
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    </button>
                    
                    {/* Image Navigation Dots */}
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
                      {cohortImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`rounded-full transition-all duration-300 ${
                            currentImage === index 
                              ? 'bg-white w-4 md:w-6 lg:w-8 h-1.5 md:h-2' 
                              : 'bg-white/50 hover:bg-white/75 w-1.5 md:w-2 h-1.5 md:h-2'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    {/* Current Image Indicator */}
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-black/40 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                      {currentImage + 1} / {cohortImages.length}
                    </div>
                  </div>
                </div>

                {/* Gallery Thumbnails - Responsive Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
                  {cohortImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImage(index)}
                      className={`relative rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 ${
                        currentImage === index 
                          ? 'ring-2 ring-[#00337C]' 
                          : 'opacity-75 hover:opacity-100 hover:ring-1 hover:ring-[#00337C]/50'
                      }`}
                      aria-label={`View ${image.title}`}
                    >
                      {/* Maintain square aspect ratio */}
                      <div className="relative pt-[100%]">
                        <img
                          src={image.image}
                          alt={`Thumbnail: ${image.title}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement?.querySelector('.thumbnail-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        
                        {/* Thumbnail Fallback */}
                        <div className="thumbnail-fallback hidden absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
                          <div className="text-center">
                            <div className="text-base md:text-xl text-gray-400">📸</div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Gallery Description */}
                <div className="text-center text-xs md:text-sm text-gray-600 pt-1 md:pt-2">
                  <p className="truncate">Click thumbnails to navigate • Swipe on mobile</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Responsive */}
      <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#00337C] to-[#1E4B9E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 md:mb-6 px-2 sm:px-0">
              Ready for Your Transformation?
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              New cohorts open periodically. If you feel the pull toward growth and community, 
              it's probably meant for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
            <button
                onClick={() => setWaitlistOpen(true)}
                className="px-8 py-4 bg-white text-[#00337C] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Join the Waitlist
            </button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-3 lg:px-10 lg:py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 active:scale-95 text-sm md:text-base lg:text-lg w-full sm:w-auto"
              >
                Support Us
              </Link>
            </div>
            
            <p className="text-white/70 mt-4 md:mt-6 text-xs md:text-sm px-4 sm:px-0">
              Limited spots available for meaningful growth journeys
            </p>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
      />
    </div>

  
  );
}