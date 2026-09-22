import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SubscribeModal from "../components/modal/SubcriberModal";
import SEO from "../components/SEO";
import { absoluteUrl, breadcrumbSchema, getSeoForPathname } from "../lib/seo";

export default function PublicLayout() {
  const location = useLocation();
  const mainRef = useRef(null);
  const isArticleDetail = /^\/(articles|insights)\/[^/]+/.test(location.pathname);
  const routeSeo = getSeoForPathname(location.pathname);
  const canonicalPath = location.pathname === "/" ? "/" : location.pathname;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
      if (location.hash) {
        document
          .getElementById(location.hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        {...routeSeo}
        canonical={absoluteUrl(canonicalPath)}
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          ...(location.pathname === "/"
            ? []
            : [{ name: routeSeo.title?.split("|")[0]?.trim() || "Page", path: canonicalPath }]),
        ])}
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      {isArticleDetail && <SubscribeModal showOnArticles />}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={isArticleDetail ? undefined : "overflow-x-hidden"}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
