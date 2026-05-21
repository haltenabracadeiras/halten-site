const stats = [
  { value: "12k+", label: "Produtos vendidos" },
  { value: "98%", label: "Satisfação" },
  { value: "24h", label: "Suporte rápido" },
  { value: "45 anos", label: "Experiência" },
];

export function StatsBar() {
  return (
    <section className="bg-[var(--bg-white)] px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 sm:grid sm:grid-cols-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-[var(--line)] bg-[var(--bg)] p-6 text-center">
            <p className="text-4xl font-[700] text-[var(--ink)]">{stat.value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.15em] text-[var(--ink-mid)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
