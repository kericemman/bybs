import BrandLoader from "./BrandLoader";

export function LoadingState({ label = "Loading" }) {
  return <BrandLoader label={label} />;
}

export function EmptyState({ title, message }) {
  return (
    <div className="border-y border-gray-200 py-10 text-center">
      <h3 className="text-xl font-semibold text-[#00337C]">{title}</h3>
      {message && <p className="public-copy mx-auto mt-3 max-w-xl">{message}</p>}
    </div>
  );
}
