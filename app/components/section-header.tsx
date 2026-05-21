type SectionHeaderProps = {
  badge: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ badge, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 inline-flex rounded-full bg-[var(--blue-light)] px-4 py-2 text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--blue)]">
        {badge}
      </p>
      <h2 className="text-4xl font-[700] leading-[1.05] tracking-[-0.03em] text-[var(--ink)]">
        {title}{" "}
        {subtitle ? (
          <span className="italic" style={{ fontFamily: "var(--font-serif)", color: "var(--blue)" }}>
            {subtitle}
          </span>
        ) : null}
      </h2>
    </div>
  );
}
