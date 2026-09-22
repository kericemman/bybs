import { Facebook, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SITE, SOCIAL_LINKS } from "../config/site";

const groups = [
  {
    title: "BYBS",
    links: [
      ["About", "/about"],
      ["Impact", "/impact"],
      ["Community", "/community"],
    ],
  },
  {
    title: "Programs",
    links: [
      ["Fellowship", "/programs/fellowship"],
      ["Mentorship", "/programs/mentorship"],
      ["EmpowerHer", "/programs/empowerher"],
      ["Outreach", "/programs/outreach"],
    ],
  },
  {
    title: "Get involved",
    links: [
      ["Volunteer", "/get-involved/volunteer"],
      ["Mentor", "/get-involved/mentor"],
      ["Partner", "/get-involved/partner"],
      ["Support", "/support"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Insights", "/insights"],
      ["Weekly Reflection", "/community/reflections"],
      ["Shop BYBS", "/shop"],
      ["Contact", "/contact"],
    ],
  },
];

const icons = { Instagram, Facebook, LinkedIn: Linkedin, TikTok: FaTiktok };

export default function Footer() {
  return (
    <footer className="bg-[#07111F] text-white">
      <div className="public-container py-5 md:py-10 lg:py-15">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold">{SITE.name}</p>
                <p className="text-xs font-semibold uppercase text-[#FFD166]">{SITE.tagline}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-white/70">{SITE.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = icons[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white/75 hover:bg-white hover:text-[#00337C]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map(([label, to]) => (
                    <li key={to}>
                      <Link to={to} className="text-sm text-white/65 hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
            <a href={SITE.whatsappUrl} className="inline-flex items-center gap-2 hover:text-white">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
