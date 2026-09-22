import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection({ eyebrow, title, description, actions = [] }) {
  return (
    <section className="bg-[#E9EEF5] text-gray-900">
      <div className="public-container grid gap-8 py-5 md:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:py-15">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-sm font-semibold uppercase text-[#B96500]">{eyebrow}</p>}
          <h2 className="mt-3 text-2xl font-light leading-tight text-[#00337C] md:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {actions.map((action, index) => (
            <Link
              key={action.to}
              to={action.to}
              className={
                index === 0
                  ? "public-button-primary px-6 py-3.5"
                  : "public-button-secondary px-6 py-3.5"
              }
            >
              {action.label}
              {index === 0 && <ArrowRight className="h-4 w-4" />}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
