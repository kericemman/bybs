import { motion as Motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden bg-[#07111F]">
      <img
        src="/assets/1.jpg"
        alt="Build Your Best Self coaching and growth community"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[#07111F]/65" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="public-container relative z-10 py-20 md:py-28">
        <Motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="public-eyebrow bg-white/10 border-white/15 text-white mb-6">
            Inspire. Heal. Evolve.
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-white mb-6">
            Build your best self, from the inside out.
          </h1>

          <p className="text-lg md:text-xl text-white/82 leading-8 max-w-2xl mb-8">
            BYBS guides women and youth through self-awareness, healing, and
            intentional growth so they can live, lead, and create from a place
            of inner wholeness.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/coaching" className="public-button-primary px-6 py-3.5">
              Start transformation
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="https://calendly.com/buildyourbestselfblog-info"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 font-semibold text-white hover:bg-white hover:text-[#00337C] transition-colors"
            >
              <CalendarDays className="w-5 h-5" />
              Book a session
            </a>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
