import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { COMMUNITY_LINKS, INVOLVEMENT_LINKS, PROGRAM_LINKS, SITE } from "../config/site";

const linkClass = ({ isActive }) =>
  `inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors ${
    isActive ? "text-[#00337C]" : "text-gray-600 hover:text-[#00337C]"
  }`;

function Dropdown({
  id,
  label,
  to,
  items,
  open,
  onToggle,
  onNavigate,
  align = "left",
  prominent = false,
}) {
  return (
    <div
      className="relative flex items-center"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onNavigate();
      }}
    >
      <NavLink
        to={to}
        onClick={onNavigate}
        className={
          prominent
            ? "public-button-primary px-5 py-2.5 text-sm"
            : ({ isActive }) =>
                `inline-flex min-h-11 items-center pl-3 pr-1 text-sm font-medium transition-colors ${
                  isActive ? "text-[#00337C]" : "text-gray-600 hover:text-[#00337C]"
                }`
        }
      >
        {label}
      </NavLink>
      <button
        type="button"
        onClick={onToggle}
        aria-label={`${open ? "Hide" : "Show"} ${label} links`}
        aria-expanded={open}
        aria-controls={id}
        className={`flex h-11 w-11 flex-none items-center justify-center text-[#00337C] hover:bg-[#F5F9FF] ${
          prominent ? "rounded-lg" : "rounded-md"
        }`}
      >
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          id={id}
          className={`absolute top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-[#F5F9FF] hover:text-[#00337C]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ label, to, items, onNavigate }) {
  const [open, setOpen] = useState(false);
  const id = `mobile-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <div className="flex items-center">
        <NavLink
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex min-h-12 min-w-0 flex-1 items-center rounded-md px-3 py-3 font-medium ${
              isActive ? "bg-[#F5F9FF] text-[#00337C]" : "text-gray-800 hover:bg-[#F5F9FF]"
            }`
          }
        >
          {label}
        </NavLink>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={`${open ? "Hide" : "Show"} ${label} links`}
          aria-expanded={open}
          aria-controls={id}
          className="flex h-12 w-12 flex-none items-center justify-center rounded-md text-[#00337C] hover:bg-[#F5F9FF]"
        >
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {open && (
        <div id={id} className="ml-3 border-l border-gray-200 pl-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-[#F5F9FF]"
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
  }, [location.hash, location.pathname]);

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
  const closeNavigation = () => {
    setOpenMenu("");
    setMobileOpen(false);
  };

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
              <p className="truncate text-[0.67rem] font-semibold uppercase text-[#B96500]">
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
              to="/programs"
              items={PROGRAM_LINKS}
              open={openMenu === "programs"}
              onToggle={() => toggle("programs")}
              onNavigate={closeNavigation}
            />
            <Dropdown
              id="community-menu"
              label="Community"
              to="/community"
              items={COMMUNITY_LINKS}
              open={openMenu === "community"}
              onToggle={() => toggle("community")}
              onNavigate={closeNavigation}
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

          <div className="hidden xl:flex">
            <Dropdown
              id="involvement-menu"
              label="Get involved"
              to="/get-involved"
              items={INVOLVEMENT_LINKS}
              open={openMenu === "involvement"}
              onToggle={() => toggle("involvement")}
              onNavigate={closeNavigation}
              align="right"
              prominent
            />
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
                onClick={closeNavigation}
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeNavigation}
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                About
              </NavLink>
              <MobileGroup
                label="Programs"
                to="/programs"
                items={PROGRAM_LINKS}
                onNavigate={closeNavigation}
              />
              <MobileGroup
                label="Community"
                to="/community"
                items={COMMUNITY_LINKS}
                onNavigate={closeNavigation}
              />
              <NavLink
                to="/impact"
                onClick={closeNavigation}
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Impact
              </NavLink>
              <NavLink
                to="/insights"
                onClick={closeNavigation}
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Insights
              </NavLink>
              <NavLink
                to="/shop"
                onClick={closeNavigation}
                className="rounded-md px-3 py-3 font-medium text-gray-800 hover:bg-[#F5F9FF]"
              >
                Shop BYBS
              </NavLink>
              <MobileGroup
                label="Get involved"
                to="/get-involved"
                items={INVOLVEMENT_LINKS}
                onNavigate={closeNavigation}
              />
              <Link
                to="/get-involved"
                onClick={closeNavigation}
                className="public-button-primary mt-2 w-full px-5 py-3"
              >
                Explore ways to help
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
