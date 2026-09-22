import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";

const pillars = [
  {
    title: "Inspire",
    description:
      "Help people recognise possibility, voice, strengths, and the value of their experience.",
    icon: CheckCircle,
  },
  {
    title: "Heal",
    description:
      "Create room for honest reflection, healthier beliefs, support, and recovery from what holds growth back.",
    icon: CheckCircle,
  },
  {
    title: "Evolve",
    description:
      "Turn awareness into practical choices, skills, leadership, service, and intentional action.",
    icon: CheckCircle,
  },
];

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="About BYBS"
        title="People grow stronger when support, practical learning, and community come together."
        description="Build Your Best Self exists to help young people and women grow personally and professionally while creating opportunities to contribute to their communities."
        image={{ src: "/assets/about-1600.jpg", alt: "Build Your Best Self community" }}
        primaryAction={{ label: "Explore our programmes", to: "/programs" }}
        secondaryAction={{ label: "See our impact", to: "/impact" }}
      />

      <section className="public-section bg-white">
        <div className="public-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="public-eyebrow mb-4">Why BYBS exists</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading">
              Growth should not happen in isolation
            </h2>
          </div>
          <div className="space-y-5 public-copy text-lg">
            <p>
              People often carry ambition, responsibility, uncertainty, and difficult transitions
              without the guidance or community needed to navigate them well.
            </p>
            <p>
              BYBS brings reflection, mentorship, practical development, fellowship learning,
              empowerment, and service into a shared space. Personal growth is treated as a
              foundation for stronger relationships, better decisions, meaningful work, and
              contribution.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <SectionHeader
            eyebrow="Our identity"
            title="Inspire. Heal. Evolve."
            description="These three ideas shape how BYBS supports people and how the community turns learning into action."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title}>
                  <Icon className="h-7 w-7 text-[#00337C]" />
                  <h3 className="mt-5 text-2xl font-semibold text-[#00337C]">{pillar.title}</h3>
                  <p className="public-copy mt-3">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <img
            src="/assets/AB.jpg"
            alt="Roman Viola Brenda, founder of Build Your Best Self"
            className="aspect-[4/5] w-full max-h-[38rem] rounded-lg object-cover"
          />
          <div>
            <p className="public-eyebrow mb-4">Founder story</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading">Roman Viola Brenda</h2>
            <div className="mt-6 space-y-4 public-copy text-lg">
              <p>
                My experience of showing up for others while carrying exhaustion and self-doubt
                shaped the earliest idea behind Build Your Best Self.
              </p>
              <p>
                My own process of asking for help, setting boundaries, rebuilding confidence, and
                reconnecting with purpose made one need especially clear: people need spaces where
                honest personal development is connected to practical support.
              </p>
              <p>
                BYBS grew from that conviction into Fellowship learning, mentorship, women’s
                empowerment, community conversations, and outreach. The work is founder-led, but its
                future depends on shared ownership by fellows, alumni, mentors, volunteers,
                partners, and supporters.
              </p>
            </div>
            <Link to="/community" className="public-button-primary mt-7 px-6 py-3">
              Meet the community <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid gap-8 md:grid-cols-2">
          <div className="border-t border-gray-300 pt-6">
            <p className="text-sm font-semibold uppercase text-[#B96500]">Mission</p>
            <h2 className="mt-3 text-xl font-normal text-[#00337C]">
              Support personal and professional growth that leads to meaningful participation and
              contribution.
            </h2>
          </div>
          <div className="border-t border-gray-300 pt-6">
            <p className="text-sm font-semibold uppercase text-[#B96500]">Vision</p>
            <h2 className="mt-3 text-xl font-normal text-[#00337C]">
              A growing community of people equipped to build healthier lives, stronger careers, and
              stronger communities.
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
