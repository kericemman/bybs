import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="min-h-screen bg-white py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-[#00337C] mb-8 leading-tight">
                About Us
              </h1>
              <div className="w-20 h-1 bg-[#B76E79] mb-8"></div>
            </div>

            <p className="text-lg text-gray-700 font-light leading-relaxed">
              BYBS is a personal and professional development movement that helps women and youth 
              <span className="font-medium text-[#00337C]"> reconnect with who they are</span>, 
              <span className="font-medium text-[#00337C]"> heal what holds them back</span>, and 
              <span className="font-medium text-[#00337C]"> grow into the best version of themselves</span> , from the inside out.
            </p>

            <div className="space-y-2">
              <p className="text-gray-600 leading-relaxed">
                We believe true success comes from wholeness. That's why we don't just teach people how to succeed, 
                we help them become whole first, then build from there.
              </p>
              {/* <a href="/our-story" className="text-[#00337C] font-medium underline">Click here to Download Our Guide</a> */}
              
              
            </div>

            {/* Values */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-6 pt-3 md:pt-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-[#00337C] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-semibold">1</span>
                </div>
                <h3 className="font-medium text-[#00337C] mb-2">Inspire</h3>
               
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-[#00337C] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-semibold">2</span>
                </div>
                <h3 className="font-medium text-[#00337C] mb-2">Heal</h3>
                
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-[#00337C] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-semibold">3</span>
                </div>
                <h3 className="font-medium text-[#00337C] mb-2">Evolve</h3>
                
              </div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-white rounded-none overflow-hidden">
              {/* Replace with your actual image */}
              <img
                src="/assets/abt.jpg" // Add your image path here
                alt="Build Your Best Self - Personal Growth Journey"
                className="w-full h-[500px] object-cover"
              />
              
             
            </div>
            
            
          </motion.div>
        </div>

        
      </div>
    </section>
  );
};

export default AboutSection;