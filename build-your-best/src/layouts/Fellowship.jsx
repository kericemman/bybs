import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function FellowshipPopup() {
  const [show, setShow] = useState(false);

  // Auto-open popup after short delay
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-lg w-full p-6 md:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-2xl"
            >
              &times;
            </button>

            {/* Header */}
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-[#4A7CFF] to-[#FF9E3B] text-transparent bg-clip-text"
            >
              Build Your Best Self Fellowship 2025
            </motion.h2>

            <p className="text-center text-sm font-medium mb-6 text-[#FF9E3B]">
              Cohort 2 Applications Now Open
            </p>

            {/* Fellowship Description */}
            <div className="space-y-4 text-sm text-white/90 leading-relaxed">
              <p>
                The <strong>Build Your Best Self (BYBS) Fellowship 2025</strong> is a 3-month
                personal branding project powered by the <strong>Excellence Foundation for South Sudan (EFSS)</strong>.
                It equips 20 university students, entry-level professionals, and job seekers
                with the confidence and tools to stand out in today’s job market.
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Hands-on training in CV writing, LinkedIn optimisation & professional bios</li>
                <li>Guidance on goal setting, networking & personal branding</li>
                <li>One-on-one mentorship & group coaching</li>
                <li>A supportive community to help you grow</li>
              </ul>

              <p className="text-[#FF9E3B]/90 font-semibold mt-4">
                Duration: November 2025 – January 2026  
                Location: Juba (Hybrid)
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSezPOiRSX32YUrVHQBQnIfpYxx-TLxfUI27-V-rt-olf2Ywew/viewform"
                
                className="px-6 py-3 rounded-full font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#00337C] to-[#FF9E3B] hover:scale-105 shadow-lg"
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
