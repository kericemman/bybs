import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-[#0A0F24]">
      {/* ELECTRIC Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F24] via-[#00337C] to-[#C66D02] opacity-95 z-0"></div>
      
      {/* PULSING Animated elements */}
      {loaded && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#00337C] mix-blend-screen filter blur-[100px]"
          ></motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ duration: 3, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#C66D02] mix-blend-screen filter blur-[120px]"
          ></motion.div>
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content - HIGH IMPACT */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="order-2 lg:order-1"
          >
            <div className="mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block px-4 py-2 bg-[#C66D02]/20 rounded-full mb-6 border border-[#C66D02]/50"
              >
                <span className="text-[#FF9E3B] font-bold text-sm tracking-widest ">INSPIRE, HEAL,EVOLVE</span>
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-8">
                <span className="text-white">Before you build a life you’re proud of, </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A7CFF] to-[#FF9E3B]">You must first build yourself. </span>
              </h1>
              
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-l md:text-xl text-white/80 mb-10 max-w-lg font-light"
              >
                We guide women and youth on a journey of<span className="text-[#FF9E3B] font-semibold"> self-awareness, healing, and intentional growth</span> so they can live, lead, and create from a place of inner wholeness.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col "
            >
              <Link 
                to="/coaching" 
                className="px-8 py-4 rounded-full font-bold transition-all duration-300 hover:shadow-lg border-2 border-white/20 hover:border-[#4A7CFF]/50 hover:bg-[#00337C]/20 text-white"
                style={{
                  background: 'linear-gradient(45deg, #00337C 0%, #4A7CFF 100%)',
                  boxShadow: '0 4px 20px rgba(74, 124, 255, 0.3)'
                }}
              >
                <span className="relative z-10 flex justify-center gap-2">
                  <span>Start Transformation Today</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF9E3B] to-[#C66D02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></span>
              </Link>
              
              
            </motion.div>
          </motion.div>

          {/* Image Section - DYNAMIC SHOWCASE */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full h-[400px] rounded-[40px] overflow-hidden transform perspective-1000 rotate-y-6 hover:rotate-y-0 transition-transform duration-700 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00337C]/80 via-transparent to-[#C66D02]/50 z-10"></div>
              <img
                src="/assets/1.jpg"
                alt="Transformational coaching"
                className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
              
             
              
            </div>
            
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}