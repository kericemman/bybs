import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgramCard({ program }) {
  return (
    <article className="group  pt-3">
      <Link to={program.to} className="block">
        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
          <img
            src={program.image}
            alt={program.imageAlt || program.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="pt-5">
          {program.status && (
            <p className="mb-2 text-xs font-semibold uppercase text-[#B96500]">{program.status}</p>
          )}
          <h3 className="text-xl font-semibold text-[#00337C]">{program.title}</h3>
          <p className="public-copy mt-3">{program.description}</p>
          {/* <dl className="mt-5 grid gap-4 border-y border-gray-200 py-5 text-sm sm:grid-cols-3">
            <div><dt className="font-semibold text-gray-900">Who it serves</dt><dd className="mt-1 leading-6 text-gray-600">{program.audience}</dd></div>
            <div><dt className="font-semibold text-gray-900">The experience</dt><dd className="mt-1 leading-6 text-gray-600">{program.experience}</dd></div>
            <div><dt className="font-semibold text-gray-900">The outcome</dt><dd className="mt-1 leading-6 text-gray-600">{program.outcome}</dd></div>
          </dl> */}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00337C]">
            {program.cta || "Learn more"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
