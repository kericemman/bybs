export default function SectionHeader({ eyebrow, title, description, align = "left" }) {
  const centered = align === "center";

  return (
    <header className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="public-eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading">{title}</h2>
      {description && <p className="public-copy mt-5 text-base md:text-lg">{description}</p>}
    </header>
  );
}
