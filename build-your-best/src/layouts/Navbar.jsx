import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { COMMUNITY_LINKS, INVOLVEMENT_LINKS, PROGRAM_LINKS, SITE } from "../config/site";

const linkClass = ({ isActive }) =>
  `inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors ${
    isActive ? "text-[#00337C]" : "text-gray-600 hover:text-[#00337C]"
  }`;

function Dropdown({ id, label, items, open, onToggle }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="menu"
        className="inline-flex min-h-11 items-center gap-1 px-3 text-sm font-medium text-gray-600 hover:text-[#00337C]"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          id={id}
          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-[#F5F9FF] hover:text-[#00337C]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ label, items }) {
  const [open, setOpen] = useState(false);
  const id = `mobile-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-12 w-full items-center justify-between rounded-md px-3 py-3 text-left font-medium text-gray-800 hover:bg-[#F5F9FF]"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={id} className="ml-3 border-l border-gray-200 pl-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-[#F5F9FF]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu("");
  }, [location.pathname]);

  useEffect(() => {
    const handlePointer = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenMenu("");
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpenMenu("");
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const toggle = (name) => setOpenMenu((current) => (current === name ? "" : name));

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur"
    >
      <nav className="public-container" aria-label="Primary navigation">
        <div className="flex min-h-20 items-center justify-between gap-5">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="Build Your Best Self home"
          >
            <img src={SITE.logo} alt="" className="h-14 w-11 flex-none object-contain" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#00337C] sm:text-lg">
                {SITE.name}
              </p>
              <p className="text-[0.67rem] font-semibold uppercase text-[#B96500]">
                {SITE.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden items-center xl:flex">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <Dropdown
              id="programs-menu"
              label="Programs"
              items={PROGRAM_LINKS}
              open={openMenu === "programs"}
              onToggle={() => toggle("programs")}
            />
            <Dropdown
              id="community-menu"
              label="Community"
              items={COMMUNITY_LINKS}
              open={openMenu === "community"}
              onToggle={() => toggle("community")}
            />
            <NavLink to="/impact" className={linkClass}>
              Impact
            </NavLink>
            <NavLink to="/insights" className={linkClass}>
              Insights
            </NavLink>
            <NavLink to="/shop" className={linkClass}>
              Shop BYBS
            </NavLink>
          </div>

          <div className="relative hidden items-center gap-1 xl:flex">
            <Link to="/get-involved" className="public-button-primary px-5 py-2.5 text-sm">
              Get involved
            </Link>
            <button
              type="button"
              onClick={() => toggle("involvement")}
              aria-label="Show Get Involved options"
              aria-expanded={openMenu === "involvement"}
              className="flex h-11 w-9 items-center justify-center rounded-lg text-[#00337C] hover:bg-[#F5F9FF]"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openMenu === "involvement" ? "rotate-180" : ""}`}
              />
            </button>
            {openMenu === "involvement" && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
                {INVOLVEMENT_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-[#F5F9FF] hover:text-[#00337C]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-[#00337C] hover:bg-[#F5F9FF] xl:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="border-t border-gray-100 py-4 xl:hidden">
            <div className="grid gap-1">
              <NavLink
                to="/"
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                About
              </NavLink>
              <MobileGroup label="Programs" items={PROGRAM_LINKS} />
              <MobileGroup label="Community" items={COMMUNITY_LINKS} />
              <NavLink
                to="/impact"
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Impact
              </NavLink>
              <NavLink
                to="/insights"
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Insights
              </NavLink>
              <NavLink
                to="/shop"
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Shop BYBS
              </NavLink>
              <MobileGroup label="Get involved" items={INVOLVEMENT_LINKS} />
              <Link to="/get-involved" className="public-button-primary mt-2 w-full px-5 py-3">
                Explore ways to help
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
