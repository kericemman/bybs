import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

export default function NotFound() {
  return (
    <section className="flex min-h-[65vh] items-center bg-[#F7F9FC]">
      <SEO
        title="Page Not Found | Build Your Best Self"
        description="The requested page could not be found."
        noindex
      />
      <div className="public-container py-5 text-center md:py-10 lg:py-15">
        <p className="text-sm font-semibold uppercase text-[#B96500]">404</p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl mx-auto mt-4 max-w-2xl font-light leading-tight text-[#00337C]">
          This page is no longer here.
        </h1>
        <p className="public-copy mx-auto mt-6 max-w-xl text-lg">
          The link may be outdated, or the page may have moved as the BYBS website has grown.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="public-button-primary px-6 py-3">
            <Home className="h-4 w-4" />
            Go to homepage
          </Link>
          <Link to="/programs" className="public-button-secondary px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            Explore programmes
          </Link>
        </div>
      </div>
    </section>
  );
}
