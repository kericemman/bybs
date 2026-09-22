import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="bg-[#07111F] text-white">
      <div className="public-container grid min-h-[32rem] items-center gap-10 py-5 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-15">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="public-eyebrow mb-5 border-white/15 bg-white/10 text-white">{eyebrow}</p>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.08]">{title}</h1>
          {description && (
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{description}</p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryAction && (
                <Link to={primaryAction.to} className="public-button-accent px-6 py-3.5">
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryAction && (
                <Link to={secondaryAction.to} className="public-button-on-dark px-6 py-3.5">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
        {image && (
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white/5 lg:aspect-[5/4]">
            <img
              src={image.src}
              alt={image.alt}
              decoding="async"
              fetchpriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
