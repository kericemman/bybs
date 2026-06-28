import { useEffect, useState } from "react";
import { ArrowRight, Heart, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Cohorts", to: "/fellowship" },
    { name: "Coaching", to: "/coaching" },
    { name: "Updates", to: "/articles" },
    { name: "Buy Merchandise", to: "/shop" },
    
    { name: "Contact Us", to: "/contact" },
  ];

  return (
    <>
      <div className="bg-[#00337C] text-white text-sm relative z-50">
        <div className="public-container py-2.5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
          <p className="text-white/90">
            BYBS Charity Campaign: supporting Divine Mercy Charity Home through
            merchandise purchases.
          </p>

          <Link
            to="/charity-merch"
            className="inline-flex items-center gap-2 bg-white text-[#00337C] hover:bg-[#FFD166] px-4 py-1.5 rounded-full font-semibold transition-colors text-xs sm:text-sm"
          >
            Support the mission
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <nav
        className={`bg-white/95 backdrop-blur sticky top-0 z-40 border-b transition-shadow ${
          scrolled
            ? "border-gray-200 shadow-sm"
            : "border-gray-100"
        }`}
      >
        <div className="public-container">
          <div className="flex justify-between h-18 md:h-20 items-center">
            <Link to="/" className="flex items-center gap-4 group">
             

              <div>
                <div className="text-lg font-semibold text-gray-950 group-hover:text-[#00337C] transition-colors">
                  Build Your Best Self
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Inspire. Heal. Evolve.
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-[#00337C] bg-[#F5F9FF]"
                        : "text-gray-600 hover:text-[#00337C] hover:bg-gray-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/charity-merch"
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg text-[#B76E79] hover:border-[#B76E79]/40 hover:bg-[#FFF7F8] transition-colors"
                aria-label="Charity campaign"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <a
                href="https://calendly.com/buildyourbestselfblog-info"
                className="public-button-primary px-5 py-2.5 text-sm"
              >
                Book session
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-[#00337C] hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-5 bg-white border-t border-gray-100">
            <div className="public-container py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "text-[#00337C] bg-[#F5F9FF]"
                        : "text-gray-700 hover:text-[#00337C] hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}

              <Link
                to="/charity-merch"
                className="flex items-center justify-center gap-2 w-full bg-[#FFF7F8] text-[#B76E79] px-4 py-3 rounded-lg font-semibold mt-3"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Support charity campaign
              </Link>

              <a
                href="https://calendly.com/buildyourbestselfblog-info"
                className="public-button-primary w-full px-4 py-3 mt-2"
                onClick={() => setIsOpen(false)}
              >
                Book a session
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
