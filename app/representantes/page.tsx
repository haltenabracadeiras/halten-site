import type { Metadata } from "next";
import "../v2/v2.css";
import "./representantes.css";
import { getSupabaseAdmin } from "../../lib/supabase";
import { contarRepresentantes } from "../v2/_dados/linha";
import { NOMES_UF } from "../v2/_dados/mapa";
import { archivo } from "../v2/_partes/fonte";
import { WHATSAPP_COMERCIAL, linkWhatsapp } from "../v2/_partes/contato";
import { Rodape, Topo } from "../v2/_partes/moldura";
import { MapaRepresentantes, type Representante } from "./mapa-representantes";

// representante novo no admin aparece na hora (o admin não revalida esta rota)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Representantes — Halten Abraçadeiras",
  description:
    "A Halten atende todo o Brasil. Encontre o representante comercial do seu estado e fale direto pelo WhatsApp.",
};

/** "5545999998888" → "(45) 99999-8888"; o que não reconhecer, mostra como veio. */
function telefone(bruto: string) {
  const d = bruto.replace(/\D/g, "");
  const local = d.startsWith("55") && d.length >= 12 ? d.slice(2) : d;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return bruto;
}

async function carregarRepresentantes(): Promise<Representante[]> {
  const { data } = await getSupabaseAdmin()
    .from("representatives")
    .select("id, name, whatsapp, state, email, regiao")
    .eq("active", true)
    .order("state", { ascending: true });

  return (data ?? []).map((r) => {
    const uf = String(r.state).toUpperCase();
    return {
      id: r.id,
      nome: String(r.name ?? "").replace(/\s+/g, " ").trim(),
      uf,
      regiao: r.regiao?.trim() || null,
      email: r.email?.trim().toLowerCase() || null, // há e-mail cadastrado todo em maiúsculas
      telefone: telefone(String(r.whatsapp ?? "")),
      whatsapp: linkWhatsapp(
        String(r.whatsapp ?? "").replace(/\D/g, ""),
        `Olá! Vim pelo site da Halten Abraçadeiras e gostaria de falar com o representante de ${NOMES_UF[uf] ?? uf}.`,
      ),
    };
  });
}

export default async function RepresentantesV2Page() {
  const reps = await carregarRepresentantes();
  const estados = Array.from(new Set(reps.map((r) => r.uf)));
  const empresas = contarRepresentantes(reps.map((r) => ({ whatsapp: r.telefone, name: r.nome })));

  return (
    <main className={`v2 rv2 ${archivo.variable}`} id="v2">
      <Topo />

      <MapaRepresentantes reps={reps}>
        <p className="rotulo">
          Representantes <i>·</i> rede comercial
        </p>
        <h1 className="rv2-titulo">
          Fale com a Halten
          <br />
          no seu estado.
        </h1>
        <p className="rv2-lead">
          A Halten atende os 26 estados e o Distrito Federal. Em {estados.length} deles, {empresas} representantes
          comerciais atendem de perto: escolha o seu no mapa e fale direto pelo WhatsApp. Nos outros, a fábrica atende
          você.
        </p>
        <dl className="brasil-numeros rv2-numeros">
          <div>
            <dt>Estados atendidos</dt>
            <dd>
              26<small> + DF</small>
            </dd>
          </div>
          <div>
            <dt>Com representante</dt>
            <dd>{String(estados.length).padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Representantes</dt>
            <dd>{empresas}</dd>
          </div>
        </dl>
      </MapaRepresentantes>

      {/* ───────────── Lista completa (também é o caminho mais fácil no celular) ───────────── */}
      <section className="rv2-lista" aria-labelledby="rv2-lista-titulo">
        <div className="rv2-lista-cabeca">
          <p className="rotulo">Lista completa</p>
          <h2 id="rv2-lista-titulo">Representantes por estado.</h2>
        </div>
        <ol className="rv2-tabela">
          {reps.map((r) => (
            <li key={r.id} id={`rep-${r.id}`}>
              <span className="rv2-t-uf">{r.uf}</span>
              <span className="rv2-t-estado">
                {NOMES_UF[r.uf] ?? r.uf}
                {r.regiao ? <small>Região {r.regiao}</small> : null}
              </span>
              <span className="rv2-t-nome">{r.nome}</span>
              <span className="rv2-t-contato">
                <a href={r.whatsapp} target="_blank" rel="noreferrer">
                  {r.telefone}
                </a>
                {r.email ? <a href={`mailto:${r.email}`}>{r.email}</a> : null}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Sem representante? A fábrica atende ───────────── */}
      <section className="rv2-fim">
        <p className="rotulo">Atendimento direto</p>
        <h2>
          Não achou o seu estado?
          <br />
          A fábrica atende você.
        </h2>
        <a className="botao rv2-fim-botao" href={WHATSAPP_COMERCIAL} target="_blank" rel="noreferrer">
          Falar com a fábrica no WhatsApp
        </a>
        <p className="rv2-fim-contato">
          (45) 99151-7308 <i>·</i> (45) 3197-2130 <i>·</i> contato@halten.ind.br
        </p>
      </section>

      <Rodape />
    </main>
  );
}
