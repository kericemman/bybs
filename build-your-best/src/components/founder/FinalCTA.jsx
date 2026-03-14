import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="relative py-5 md:py-10 overflow-hidden bg-gradient-to-br from-[#00337C] to-[#1E4B9E]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#B76E79] opacity-20 mix-blend-lighten filter blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white opacity-10 mix-blend-lighten filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Best Self?
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-l md:text-xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            Take the first step toward your transformation today. Whether you're looking for clarity, confidence, or purpose, we're here to guide you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link 
              to="https://calendly.com/buildyourbestselfblog-info" 
              className="relative overflow-hidden group px-8 py-4 rounded-xl font-bold text-[#00337C] bg-white hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Book a Discovery Call
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/shop" 
              className="px-8 py-4 rounded-xl font-bold text-white border-2 border-white hover:bg-white/10 transition-all duration-300"
            >
              Explore Resources
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-white/80 text-sm"
          >
            Join us today as we transform your lives with our guidance
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}