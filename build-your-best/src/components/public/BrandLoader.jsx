const logoSizes = {
  sm: "h-11 w-11",
  md: "h-16 w-16",
  lg: "h-20 w-20",
};

export default function BrandLoader({
  label = "Loading",
  size = "md",
  fullPage = false,
  minHeight,
  className = "",
}) {
  const heightClass = minHeight || (fullPage ? "min-h-screen" : "min-h-40");

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${heightClass} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex h-24 items-end justify-center" aria-hidden="true">
        <img
          src="/assets/Logo1.png"
          alt=""
          draggable="false"
          className={`${logoSizes[size] || logoSizes.md} animate-bounce select-none object-contain motion-reduce:animate-none`}
        />
        <span className="absolute bottom-0 h-1.5 w-10 animate-pulse rounded-full bg-[#00337C]/15 blur-[1px] motion-reduce:animate-none" />
      </div>
      <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
