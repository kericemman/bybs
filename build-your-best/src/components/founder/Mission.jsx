import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

export default function AboutMission() {
  return (
    <section className="relative bg-white py-5 md:py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F7D9D9] opacity-20 mix-blend-multiply filter blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#00337C] opacity-10 mix-blend-multiply filter blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00337C] mb-6">
            Our Purpose
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] rounded-2xl p-8 shadow-lg border border-[#00337C]/20"
            >
              <h3 className="text-2xl font-bold text-[#B76E79] mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700">
                To see a generation of women living in full alignment with who they are healed, confident, 
                and creating impact from a place of inner wholeness.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#FFF0F0] to-[#F5F9FF] rounded-2xl p-8 shadow-lg border border-[#B76E79]/20"
            >
              <h3 className="text-2xl font-bold text-[#00337C] mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700">
                To empower women to reconnect with their identity, shift their mindset, and grow with intention, so they 
                can build a life and career that aligns with who they truly are.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}