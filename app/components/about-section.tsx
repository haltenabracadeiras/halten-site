import { SectionHeader } from "./section-header";

const pillars = [
  {
    title: "Missão",
    description: "Fornecer abraçadeiras e soluções técnicas que garantam operações mais seguras e eficientes para o setor industrial.",
  },
  {
    title: "Visão",
    description: "Ser reconhecida como a referência nacional em qualidade e inovação para fixação industrial.",
  },
  {
    title: "Valores",
    description: "Integridade, robustez, atendimento dedicado e comprometimento com o resultado do cliente.",
  },
];

export function AboutSection() {
  return (
    <section id="quem-somos" className="bg-[var(--bg-section)] px-6 py-20 text-[var(--ink)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px] rounded-[32px] bg-[var(--bg-white)] p-10 shadow-[0_18px_48px_rgba(15,25,35,0.06)]">
        <SectionHeader badge="Quem somos" title="A história" subtitle="da Halten" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[28px] border border-[var(--line)] bg-[var(--bg)] p-8">
              <p className="text-sm uppercase tracking-[0.15em] text-[var(--blue)]">{pillar.title}</p>
              <p className="mt-4 text-base leading-7 text-[var(--ink-mid)]" style={{ fontFamily: "var(--font-mono)" }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
