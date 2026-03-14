import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00337C]/10 blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#B76E79]/10 blur-3xl animate-float"></div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">Brenda</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mb-8"></div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl text-gray-600 mb-8 font-medium italic"
            >
              From Self-Doubt to Self-Discovery: My Journey to Becoming My Best Self
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              I'm Brenda Viola, founder of Build Your Best Self. My journey from self-doubt to empowerment fuels my passion for helping women rediscover their worth and purpose.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="/discovery" 
                className="px-8 py-4  border-2 border-[#00337C] text-[#00337C] hover:bg-[#00337C]/10 rounded-full font-bold transition-all duration-300"
              >
                Rediscover Yourself
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Image Component */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
            className="order-1 lg:order-2 relative h-80 md:h-[450px] lg:h-[500px] w-full"
          >
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white">
              <img
                src="/assets/AB.jpg"
                alt="Brenda Viola - Founder of Build Your Best Self"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                loading="eager"
                decoding="sync"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00337C]/20 via-transparent to-transparent"></div>
            </div>
            {/* Decorative corner accent */}
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-tl-full bg-[#00337C]/20 blur-xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-br-full bg-[#B76E79]/20 blur-xl z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}