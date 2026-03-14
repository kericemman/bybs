import { motion } from 'framer-motion';

export default function AboutMission() {
  return (
    <div className="bg-white">
      {/* Personal Story Component */}
      <section className="relative py-5 md:py-15 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-[#00337C] mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-[#B76E79] mix-blend-multiply filter blur-xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
                My Story
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-700 max-w-5xl mx-auto"
          >
            <p className="text-l md:text-xl mb-8">
              I was the woman who smiled while struggling, one who showed up for everyone else while quietly battling exhaustion.
            </p>
            
            <p className="mb-6">
              Early motherhood found me lost in the shuffle of shoulds and supposed-tos. The more I tried to "have it all," the emptier I felt. Burnout became my normal, and self-doubt my constant companion.
            </p>
            
            <div className="border-l-4 border-[#00337C] pl-6 my-8">
              <p className="italic text-gray-600">
                "I hit my breaking point when I realized I couldn't remember the last time I felt like myself—not a mom, not a wife, not an employee... just me."
              </p>
            </div>
            
            <p className="mb-8">
              My transformation began with small acts of rebellion—saying no, asking for help, carving out moments just for me. Through self-discovery work and mindset shifts, I rebuilt my relationship with myself. The woman who emerged was stronger, wiser, and finally free from the need for perfection.
            </p>
            
            <p className="text-xl font-medium text-gray-900">
              Build Your Best Self was born from this journey, a space where women can shed expectations and rediscover their power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement Component */}
      <section className="relative py-5 md:py-15 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] rounded-2xl p-8 md:p-12 shadow-lg border border-[#00337C]/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">My Mission</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 mb-6">
              Build Your Best Self exists to empower women to grow with intention, clarity, and confidence.
            </p>
            
            <p className="text-2xl font-medium text-gray-900">
              Every woman deserves to <span className="text-[#B76E79] font-semibold">live fully</span>, not just survive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Component */}
      <section className="relative py-5 md:py-15 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
                My Values
              </span>
            </h2>
            <p className="text-xl text-gray-600">What guides my work</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Authenticity",
                description: "You don't need to be polished to be powerful."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Growth",
                description: "Progress over perfection."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Purpose",
                description: "You're not random. You're needed."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 11h16M4 15h16M4 19h16" />
                  </svg>
                ),
                title: "Simplicity",
                description: "Small steps create lasting change."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#00337C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Compassion",
                description: "Honor your pace, not pressure."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#00337C]/10"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-5">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}