import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#07111F]">
      <img
        src="/assets/home-hero-1600.jpg"
        alt="The Build Your Best Self community"
        decoding="async"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[#07111F]/68" />
      <div className="public-container relative z-10 flex min-h-[78vh] items-center py-5 md:py-10 lg:py-15">
        <Motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <p className="public-eyebrow mb-6 border-white/15 bg-white/10 text-white">
            Inspire. Heal. Evolve.
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl max-w-4xl font-light leading-[1.06] text-white">
            Building people. Strengthening communities. Creating lasting change.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
            BYBS supports young people and women through mentorship, practical development,
            fellowship programmes, empowerment initiatives, and community action.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/community" className="public-button-primary px-6 py-3.5">
              Join the community <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/get-involved" className="public-button-on-dark px-6 py-3.5">
              Get involved
            </Link>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
