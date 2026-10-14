import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../v2/v2.css";
import "../../v2/v2-paginas.css";
import { carregarProdutoV2 } from "../../v2/_dados/produto";
import { ROTAS, WHATSAPP_NUMERO, linkWhatsapp } from "../../v2/_partes/contato";
import { archivo } from "../../v2/_partes/fonte";
import { Rodape, Topo } from "../../v2/_partes/moldura";
import { Galeria } from "./galeria";
import { TabelaTecnica } from "./tabela";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await carregarProdutoV2(slug);
  return {
    title: `${p?.nome ?? "Produto"} — Halten Abraçadeiras (prévia v2)`,
    robots: { index: false, follow: false },
  };
}

export default async function ProdutoV2Page({ params }: Params) {
  const { slug } = await params;
  const p = await carregarProdutoV2(slug);
  if (!p) notFound();

  const pedido = linkWhatsapp(WHATSAPP_NUMERO, `Olá! Tenho interesse na ${p.nome}. Poderia me enviar um orçamento?`);
  const temTabela = !!p.tabela || p.conversoes.length > 0;

  return (
    <main className={`v2 pg pp ${archivo.variable}`} id="v2">
      <Topo />

      <section className="pp-heroi">
        <nav className="pp-trilha" aria-label="Você está em">
          <a href={ROTAS.produtos}>Produtos</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.curto}</span>
        </nav>

        <div className="pp-grade">
          <Galeria imagens={p.imagens} nome={p.nome} zoom={p.zoom} />

          <div className="pp-info">
            <p className="rotulo pp-rotulo">
              Abraçadeira
              {p.lancamento ? (
                <em className="pp-selo">
                  <i aria-hidden="true" />
                  Lançamento
                </em>
              ) : null}
            </p>
            <h1 className="pp-nome">{p.curto}</h1>

            {p.faixa ? (
              <p className="pp-cota">
                <span className="cota-seta" aria-hidden="true" />
                <b>{p.faixa}</b>
                <span className="cota-seta" aria-hidden="true" />
              </p>
            ) : null}

            {p.texto.map((par, i) => (
              <p key={i} className="pp-texto">
                {par}
              </p>
            ))}

            {p.ficha.length ? (
              <div className="pp-ficha">
                <p className="pp-ficha-titulo">{p.fichaTitulo ?? "Especificações"}</p>
                <dl>
                  {p.ficha.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="pp-acoes">
              <a className="botao" href={pedido} target="_blank" rel="noreferrer">
                Pedir orçamento no WhatsApp
              </a>
              {temTabela ? (
                <a className="botao pp-botao-linha" href="#tabela">
                  {p.codigos ? `Ver os ${p.codigos} códigos` : "Ver as conversões"} <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
            <p className="pp-cnpj">Venda exclusiva para CNPJ. Tenha o seu em mãos ao pedir orçamento.</p>
          </div>
        </div>
      </section>

      {temTabela ? (
        <section id="tabela" className="pp-tabela">
          <div className="pp-tabela-cabeca">
            <div>
              <p className="rotulo">Tabela técnica{p.tabela ? ` · ${p.tabela.nome}` : ""}</p>
              <h2>{p.codigos ? `${p.codigos} ${p.codigos === 1 ? "código." : "códigos."}` : "Conversões."}</h2>
            </div>
            <p className="pp-dica">
              <b>Monte seu orçamento:</b> marque os códigos que precisa e envie tudo de uma vez pelo WhatsApp, no
              botão do carrinho. Sem cadastro.
            </p>
          </div>
          <TabelaTecnica
            colunas={p.tabela?.colunas ?? []}
            linhas={p.tabela?.linhas ?? []}
            conversoes={p.conversoes}
            produto={p.nome}
            qtdUm={p.qtdUm}
          />
        </section>
      ) : null}

      <nav className="pp-vizinhos" aria-label="Outros modelos da linha">
        {p.vizinhos.anterior ? (
          <a className="pp-viz" href={ROTAS.produto(p.vizinhos.anterior.slug)}>
            <span>← Anterior</span>
            <b>{p.vizinhos.anterior.curto}</b>
          </a>
        ) : (
          <span />
        )}
        <a className="pp-viz-todos" href={ROTAS.produtos}>
          Ver a linha completa
        </a>
        {p.vizinhos.proximo ? (
          <a className="pp-viz pp-viz-prox" href={ROTAS.produto(p.vizinhos.proximo.slug)}>
            <span>Próximo →</span>
            <b>{p.vizinhos.proximo.curto}</b>
          </a>
        ) : (
          <span />
        )}
      </nav>

      <Rodape />
    </main>
  );
}
