import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About", to: "/about" },
    { label: "Coaching", to: "/coaching" },
    { label: "Articles", to: "/articles" },
    { label: "Shop", to: "/shop" },
    { label: "Contact", to: "/contact" },
  ];

  const resources = [
    { label: "FAQs", to: "/faqs" },
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk",
      icon: FaInstagram,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/176ZP54B6X/",
      icon: FaFacebook,
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@buildyourbestselfblog?_t=ZM-8yf0LRoJoT2&_r=1",
      icon: FaTiktok,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/211921650576",
      icon: FaWhatsapp,
    },
    {
      label: "Email",
      href: "mailto:info@buildyourbestselfblog.com",
      icon: HiOutlineMail,
    },
  ];

  return (
    <footer className="bg-[#07111F] text-white">
      <div className="public-container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-white text-[#00337C] rounded-lg flex items-center justify-center font-bold">
                BY
              </div>
              <div>
                <h3 className="font-semibold">Build Your Best Self</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  Inspire. Heal. Evolve.
                </p>
              </div>
            </div>

            <p className="text-sm leading-7 text-white/70 max-w-sm">
              Helping women and youth reclaim their power, build inner
              wholeness, and create lives rooted in purpose.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60 mb-4">
              Stay connected
            </h3>
            <p className="text-sm text-white/70 leading-7 mb-5">
              Follow the work, join the conversations, and reach out when you
              are ready to begin.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg border border-white/10 text-white/75 flex items-center justify-center hover:bg-white hover:text-[#00337C] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="public-container py-5 flex flex-col md:flex-row justify-between gap-3 text-sm text-white/55">
          <p>© {currentYear} Build Your Best Self. All rights reserved.</p>
          <p>
            Designed & maintained by{" "}
            <a
              href="https://www.thedigitalagame.com"
              className="text-white/80 hover:text-white"
            >
              The Digital A-Game
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
