import { motion } from 'framer-motion';

export default function CoreValues() {
  const values = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Growth Over Perfection",
      description: "We prioritize progress, not polish. Your journey matters more than an impossible standard of 'having it all together.'",
      color: "text-[#00337C]",
      bg: "bg-[#00337C]/10"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Radical Self-Honesty",
      description: "True transformation begins when we stop pretending. We create space for uncomfortable truths that lead to breakthroughs.",
      color: "text-[#B76E79]",
      bg: "bg-[#B76E79]/10"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community-Driven Growth",
      description: "Your journey isn't meant to be walked alone. We believe in the power of shared wisdom and collective elevation.",
      color: "text-[#00337C]",
      bg: "bg-[#00337C]/10"
    }
  ];

  return (
    <section className="relative bg-white py-5 md:py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 w-64 h-64 rounded-full bg-[#F7D9D9] opacity-20 mix-blend-multiply filter blur-3xl -translate-x-1/2 -translate-y-1/3 animate-float-slow"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
              Our Core Values
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            The non-negotiable principles that guide every program, resource, and conversation
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${value.bg} ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                {value.icon}
              </div>
              
              <h3 className={`text-xl font-bold mb-3 ${value.color}`}>{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200 group-hover:border-[#B76E79]/30 transition-colors duration-300">
                <div className="flex items-center text-gray-500 group-hover:text-[#00337C] transition-colors duration-300">
                  <span className="text-sm">Why this matters</span>
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These values shape <span className="font-semibold text-[#00337C]">how</span> we work, <span className="font-semibold text-[#B76E79]">who</span> we serve, and <span className="font-semibold text-[#00337C]">why</span> we're committed to your transformation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}