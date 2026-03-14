import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      summary: "Transformed through resilience and emotional intelligence",
      fullText: "The BYBS fellowship provided a safe space for me to learn personal resilience, emotional intelligence, networking techniques and many more others. The mentors were supportive and encouraging, guiding me through exercises that challenged my self-perceptions. Each session pushed me to confront my fears and build my confidence faster. The fellowship's emphasis on practical learning and continuous improvement made me realize that I could do more than I believed.",
      author: "Kajokare Santos Evans"
    },
    {
      id: 2,
      summary: "Discovering purpose beyond career",
      fullText: "From the first sessions, I was challenged to reflect on my values, strengths, and purpose. The fellowship helped me realize that a career is not just about earning a living — it's about discovering who you are and aligning your passion with service.",
      author: "Gabriel Garang Garang"
    },
    {
      id: 3,
      summary: "Learning persistence through challenges",
      fullText: "Commitment has finally paid off. Sincerely speaking, if someone is not committed, he/she can not receive a certificate otherwise. I can say BYBS has taught us how to remain persistent even though things get hard. Looking back to all the assignments in different styles, it is a bit toughest than university engagement.",
      author: "Taluga Robin Druku"
    },
    {
      id: 4,
      summary: "Growth through adaptation and mentorship",
      fullText: "Indeed it's been challenging but so educative, being introduced into new things and expected to adapt and move it was the real training. Thanks to our mentors for the patience and dedication, imagine the stress we give them, doing assignments at the last minute panicking and expecting them to respond, I've been this one person with late assignments but their patience was really something amazing and inspiring.",
      author: "BYBS Graduate"
    },
    {
      id: 5,
      summary: "Digital transformation and newfound confidence",
      fullText: "By the time the fellowship reached its midpoint, I noticed a significant change in how I saw myself. I no longer felt lost or unsure. I started taking small but deliberate steps toward my goals. I updated my personal vision statement, aligning it with my strengths and passions. I began exploring career paths that connect technology and community impact areas that excite me and allow me to contribute to something larger than myself.",
      author: "Samuel Wei Gai"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="min-h-screen bg-gray-50 py-5 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#00337C] mb-4">
            Transformations Stories
          </h2>
          <div className="w-16 h-0.5 bg-[#B76E79] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from those who've walked the journey of reconnection, healing, and growth
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-100 rounded-none p-8 md:p-12 shadow-sm"
            >
              {/* Quote Icon */}
              <div className="text-[#B76E79] mb-6">
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                </svg>
              </div>

              {/* Summary */}
              <h3 className="text-xl font-normal text-[#00337C] mb-4 leading-tight">
                "{testimonials[currentTestimonial].summary}"
              </h3>

              {/* Full Text */}
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {testimonials[currentTestimonial].fullText}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p className="font-medium text-[#00337C]">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-sm text-gray-500">
                    BYBS Fellowship Graduate
                  </p>
                </div>
                
                {/* Progress Dots */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-[#00337C]' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Ready to start your own transformation story?
          </p>
          <button className="px-8 py-3 bg-[#00337C] text-white hover:bg-[#1E4B9E] transition-colors duration-300">
            Join Our Next Cohort
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;