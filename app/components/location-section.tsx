import { SectionHeader } from "./section-header";

export function LocationSection() {
  return (
    <section id="localizacao" className="bg-[var(--bg)] px-6 py-20 text-[var(--ink)] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-8 rounded-[32px] bg-[var(--bg-white)] p-10 shadow-[0_18px_48px_rgba(15,25,35,0.06)]">
          <SectionHeader badge="Localização" title="Onde estamos" subtitle="próximos a você" />
          <div className="space-y-6 text-[var(--ink-mid)]" style={{ fontFamily: "var(--font-mono)" }}>
            <p>R. Alba Vieira, 653</p>
            <p>Cataratas, Cascavel - PR</p>
            <p>CEP 85818-630</p>
            <p>Seg–Sex, 8h–18h</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--bg-white)] shadow-[0_18px_48px_rgba(15,25,35,0.06)]">
          <iframe
            title="Localização Halten"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13812.959226584091!2d-53.4595!3d-24.9566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f8643f51b8ba8b%3A0x0000000000000000!2sCascavel%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
