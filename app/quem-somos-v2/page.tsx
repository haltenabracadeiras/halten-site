import type { Metadata } from "next";
import "../v2/v2.css";
import "../v2/v2-paginas.css";
import { carregarDadosV2 } from "../v2/_dados/linha";
import { CONTATO, ROTAS } from "../v2/_partes/contato";
import { archivo } from "../v2/_partes/fonte";
import { Rodape, Topo } from "../v2/_partes/moldura";
import { Revelar } from "../v2/_partes/revelar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quem somos — Halten Abraçadeiras (prévia v2)",
  robots: { index: false, follow: false },
};

const APLICACOES = ["Montagem de motores", "Intercooler", "Sistemas hidráulicos", "Agrícola", "Cargas pesadas"];

const PILARES = [
  {
    k: "Missão",
    titulo: "Fornecer soluções técnicas que apertam de verdade.",
    texto: "Abraçadeiras que garantem operações mais seguras e eficientes para o setor industrial brasileiro.",
  },
  {
    k: "Visão",
    titulo: "Ser a referência nacional em fixação.",
    texto: "Reconhecida pela qualidade, pela inovação no processo produtivo e pelo cuidado com o cliente — peça a peça.",
  },
  {
    k: "Valores",
    titulo: "Integridade, robustez e atendimento dedicado.",
    texto:
      "Resultado do cliente como métrica principal. Comprometimento com prazo, qualidade e a verdade técnica em cada catálogo.",
  },
];

export default async function QuemSomosV2Page() {
  const { pecas, totalCodigos, estados, representantes } = await carregarDadosV2();

  return (
    <main className={`v2 pg ${archivo.variable}`} id="v2">
      <Topo />

      <header className="pg-cabeca qs-cabeca">
        <p className="rotulo" data-revela>
          Quem somos
        </p>
        <h1 className="pg-titulo" data-revela>
          Uma fábrica jovem, com propósito claro.
        </h1>
        <p className="pg-lead" data-revela>
          Nascemos em 2022, em Cascavel/PR, para oferecer abraçadeiras de alta qualidade ao mercado industrial
          brasileiro, com transparência, ética e inovação em cada etapa do processo.
        </p>
        <dl className="qs-numeros" data-revela>
          <div>
            <dt>Desde</dt>
            <dd>2022</dd>
          </div>
          <div>
            <dt>Modelos na linha</dt>
            <dd>{pecas.length}</dd>
          </div>
          <div>
            <dt>Códigos com tabela técnica</dt>
            <dd>{totalCodigos}</dd>
          </div>
          <div>
            <dt>Estados atendidos</dt>
            <dd>{estados.length}</dd>
          </div>
        </dl>
      </header>

      <section className="qs-onde" aria-labelledby="qs-onde-titulo">
        <p className="rotulo" id="qs-onde-titulo" data-revela>
          Onde a Halten trabalha
        </p>
        <ul className="qs-aplicacoes">
          {APLICACOES.map((a, i) => (
            <li key={a} data-revela>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {a}
            </li>
          ))}
        </ul>
        <p className="qs-onde-pe" data-revela>
          Abraçadeiras desenvolvidas para suportar <em>vibração</em>, <em>pressão</em> e{" "}
          <em>ciclos térmicos extremos</em>.
        </p>
      </section>

      <section className="qs-fabrica">
        <div className="qs-fabrica-grade">
          <figure className="placa qs-placa" data-revela>
            <i className="rebite r1" />
            <i className="rebite r2" />
            <i className="rebite r3" />
            <i className="rebite r4" />
            <p className="placa-razao">{CONTATO.razao}</p>
            <dl className="placa-dados">
              <div>
                <dt>CNPJ</dt>
                <dd>{CONTATO.cnpj}</dd>
              </div>
              <div>
                <dt>Fábrica</dt>
                <dd>
                  {CONTATO.endereco} — {CONTATO.bairro}
                </dd>
              </div>
              <div>
                <dt>Cidade</dt>
                <dd>
                  {CONTATO.cidade} · CEP {CONTATO.cep}
                </dd>
              </div>
              <div>
                <dt>Desde</dt>
                <dd>2022</dd>
              </div>
            </dl>
            <figcaption>Placa de identificação</figcaption>
          </figure>

          <div className="qs-fabrica-texto">
            <p className="rotulo" data-revela>
              A fábrica
            </p>
            <h2 data-revela>Cascavel/PR, capital industrial do Oeste.</h2>
            <p className="qs-fabrica-lead" data-revela>
              Uma empresa jovem com propósito claro: trazer qualidade, transparência e inovação para o mercado de
              fixação industrial.
            </p>
            <ol className="pilares">
              {PILARES.map((p) => (
                <li key={p.k} data-revela>
                  <span className="pilar-k">{p.k}</span>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="qs-fim" aria-label="Próximos passos">
        <a className="qs-saida" href={ROTAS.produtos} data-revela>
          <span className="rotulo">A linha</span>
          <b>
            Conheça os {pecas.length} modelos <span aria-hidden="true">→</span>
          </b>
        </a>
        <a className="qs-saida" href={ROTAS.representantes} data-revela>
          <span className="rotulo">Rede comercial</span>
          <b>
            Fale com um dos {representantes} representantes <span aria-hidden="true">→</span>
          </b>
        </a>
      </section>

      <Rodape />
      <Revelar />
    </main>
  );
}
