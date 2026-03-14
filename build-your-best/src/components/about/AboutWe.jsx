import { motion } from 'framer-motion';


export default function WhoSheServes() {
  return (
    <section className="relative py-5 md:py-15 bg-white overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F7D9D9] opacity-20 mix-blend-multiply filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#00337C] opacity-10 mix-blend-multiply filter blur-3xl translate-x-1/4 translate-y-1/4 animate-float"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
              Who I Serve
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-8"></div>
          <p className="text-l md:text-2xl text-gray-600 max-w-3xl mx-auto">
            I specialize in helping women who are <span className="font-semibold text-[#00337C]">ready to transform</span> their lives
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <img
              src="/assets/women.jpg"
              alt="Women in community supporting each other"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00337C]/30 via-transparent to-transparent"></div>
          </motion.div>

          {/* List - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <ul className="space-y-4">
              {[
                "Women feeling stuck, lost, or disconnected from their purpose",
                "Women navigating major life transitions (motherhood, career changes, healing journeys)",
                "High-achievers who secretly battle imposter syndrome",
                "Chronic over-givers and people-pleasers running on autopilot",
                "Women craving deeper clarity, inner peace, and clear direction",
                "Those ready to take action but needing the right tools and support"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start bg-white text-sm"
                >
                  <div className="flex-shrink-0 mt-1 mr-4 text-[#00337C]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base md:text-lg text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <div className="border-l-4 border-[#00337C] pl-6 mb-8">
                <p className="text-xl md:text-2xl italic text-gray-600">
                  "Wherever you are in your journey, you'll find <span className="font-semibold text-[#B76E79]">understanding</span> and <span className="font-semibold text-[#00337C]">support</span> here."
                </p>
              </div>
              
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}