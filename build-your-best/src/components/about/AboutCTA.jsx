import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TransformationSection() {
  return (
    <div className="bg-white">
      {/* Transformation Journey Component */}
      <section className="relative py-5 md:py-15 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00337C] opacity-10 mix-blend-multiply filter blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#B76E79] opacity-10 mix-blend-multiply filter blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
                My Before & After
              </span>
              <br />
              <span className="text-gray-800">A Real Transformation</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto"></div>
          </motion.div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Before Column */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-4 md:p-10"
              >
                <h3 className="text-2xl font-bold text-[#00337C] mb-6 text-center">Before</h3>
                <ul className="space-y-5">
                  {[
                    "Saying yes to everyone but myself",
                    "Defined by roles (mom, employee, wife)",
                    "Doubting my ability to lead",
                    "Afraid to speak my truth",
                    "Emotionally drained and depleted"
                  ].map((item, index) => (
                    <li key={`before-${index}`} className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-4 text-[#00337C]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-lg text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* After Column */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-4 md:p-10"
              >
                <h3 className="text-2xl font-bold text-[#B76E79] mb-6 text-center">After</h3>
                <ul className="space-y-5">
                  {[
                    "Confident in my worth and voice",
                    "Clear on my unique purpose",
                    "Helping other women rise",
                    "Living by my core values",
                    "Creating space for others to grow"
                  ].map((item, index) => (
                    <li key={`after-${index}`} className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-4 text-[#B76E79]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-lg text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About CTA Component */}
      <section className="relative py-5 md:py-15 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00337C] opacity-5 mix-blend-multiply filter blur-3xl -translate-x-1/3 -translate-y-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-32xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00337C] to-[#B76E79]">
                Let's Walk This Journey 
              </span>
              
              <span className="text-gray-800"> Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your transformation begins with a single step. Choose yours:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Start Here",
                description: "Discover how we can work together",
                link: "/coaching",
                color: "bg-gradient-to-r from-[#00337C] to-[#1E4B9E] hover:from-[#1E4B9E] hover:to-[#00337C] text-white"
              },
              {
                title: "Book a Session",
                description: "Let's create a path that fits your vision",
                link: "/contact",
                color: "bg-white border-2 border-[#00337C] text-[#00337C] hover:bg-[#00337C]/10"
              },
              {
                title: "Free Resource",
                description: "Take your first step today",
                link: "/shop",
                color: "bg-white border-2 border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79]/10"
              }
            ].map((cta, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link
                  to={cta.link}
                  className={`block h-full p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${cta.color}`}
                >
                  <h3 className="text-xl font-bold mb-4">{cta.title}</h3>
                  <p className="mb-6">{cta.description}</p>
                  <span className="inline-flex items-center font-medium group-hover:translate-x-1 transition-transform duration-200">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}