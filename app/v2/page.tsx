/* A v2 é uma prévia isolada: os links são <a> comuns (recarga completa) para o motor de rolagem
   (que mexe no <html> e no fundo do <body>) não vazar para as outras páginas. */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "./sites-incriveis.css";
import "./v2.css";
import { carregarDadosV2 } from "./_dados/linha";
import { BRASIL_VIEWBOX, CASCAVEL, ESTADOS } from "./_dados/brasil";
import { NOMES_UF, ROTULO_DESLOCADO, rotaAte } from "./_dados/mapa";
import { linkDoCatalogo } from "./_dados/catalogo";
import { archivo } from "./_partes/fonte";
import { ROTAS, WHATSAPP_COMERCIAL as WHATSAPP, rotaInterna } from "./_partes/contato";
import { Rodape, Topo } from "./_partes/moldura";
import { Movimento } from "./_fx/movimento";

export const metadata: Metadata = {
  title: "Halten Abraçadeiras — v2 (prévia)",
  robots: { index: false, follow: false },
};

const APP_STORE = "https://apps.apple.com/br/app/halten-abra%C3%A7adeiras/id6761189859";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=br.com.ideia2001.HaltenAbracadeiras&hl=pt_BR";

/** Letra a letra, já no HTML (o leitor de tela lê o aria-label do título). */
function letras(texto: string) {
  return texto.split("").map((c, i) =>
    c === " " ? " " : (
      <span key={i} className="letra" aria-hidden="true">
        {c}
      </span>
    ),
  );
}

export default async function V2Page() {
  const [dados, catalogo] = await Promise.all([carregarDadosV2(), linkDoCatalogo()]);
  const { pecas, totalCodigos, medidor, representantes, estados, banners } = dados;
  const rotas = estados
    .filter((uf) => uf !== "PR" && ESTADOS[uf])
    .map((uf) => ({ uf, ...rotaAte(uf) }))
    .sort((a, b) => a.dist - b.dist);
  const fmtMm = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <main className={`v2 ${archivo.variable}`} id="v2">
      {/* Gradientes de aço usados pela cinta (desenhada em JS) */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="v2-aco" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6EBEF" />
            <stop offset="0.3" stopColor="#AEB8C1" />
            <stop offset="0.72" stopColor="#6F7A85" />
            <stop offset="1" stopColor="#4A545E" />
          </linearGradient>
          <linearGradient id="v2-aco-peca" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1F4F6" />
            <stop offset="0.38" stopColor="#B7C0C8" />
            <stop offset="0.62" stopColor="#7D8892" />
            <stop offset="1" stopColor="#C3CBD2" />
          </linearGradient>
          <pattern id="v2-rosca" width="5" height="10" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)">
            <rect width="5" height="10" fill="#8F9AA4" />
            <rect width="1.6" height="10" fill="#3B444D" />
          </pattern>
        </defs>
      </svg>

      {/* ───────────── Topo ───────────── */}
      <Topo />

      {/* ───────────── 1 · O aperto ───────────── */}
      <section
        id="aperto"
        className="cena cena-aperto"
        data-fx-fixa=""
        data-fx-altura="3"
        data-fx-fundo="#090C0F"
        data-fx-tinta="#E9EDF0"
      >
        <div className="fx-palco">
          <p className="rotulo aperto-rotulo" data-intro>
            Halten Abraçadeiras <i>·</i> Cascavel/PR <i>·</i> desde 2022
          </p>

          <div className="aperto-alvo" data-alvo>
            <svg className="cinta" data-cinta aria-hidden="true" />
            <h1 className="aperto-titulo" aria-label="Aperta de verdade.">
              <span className="aperto-linha">{letras("Aperta")}</span>
              <span className="aperto-linha">
                {letras("de")}
                <br className="br-cel" /> {letras("verdade.")}
              </span>
            </h1>
            <div className="medidor" data-medidor aria-hidden="true">
              <span className="medidor-leitura">
                Ø <b data-medidor-valor>{fmtMm(medidor.max)}</b> mm
              </span>
              <span className="medidor-estado" data-medidor-estado>
                solta
              </span>
              <small>
                {medidor.codigo} · {medidor.produto}
              </small>
            </div>
          </div>

          <div className="aperto-pe" data-aperto-pe>
            <p>
              Abraçadeiras para a linha pesada, automotiva e industrial.
              <br />
              Fábrica em Cascavel/PR, desde 2022.
            </p>
            <a className="botao" href="#linha">
              Ver a linha completa
            </a>
          </div>

          <p className="aperto-coord" aria-hidden="true">
            24°57′S · 53°27′O
          </p>
        </div>
      </section>

      {/* ───────────── 1b · O outdoor do pátio (banners do admin) ───────────── */}
      {banners.length > 0 ? (
        <section id="novidades" className="cena cena-outdoor" data-fx-fundo="#090C0F" data-fx-tinta="#E9EDF0">
          <div className="outdoor-cabeca">
            <p className="rotulo">Novidades</p>
            {banners.length > 1 ? (
              <p className="outdoor-contador" aria-hidden="true">
                <b data-outdoor-n>01</b> / {String(banners.length).padStart(2, "0")}
              </p>
            ) : null}
          </div>

          <div className="outdoor" data-outdoor>
            <div className="outdoor-refletores" aria-hidden="true">
              <i className="refletor" />
              <i className="refletor" />
              <i className="refletor" />
            </div>
            <div className="outdoor-moldura" role="region" aria-roledescription="carrossel" aria-label="Novidades da Halten">
              <div className="outdoor-painel">
                {banners.map((b, i) => {
                  const arte = (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.imagem}
                      alt={b.alt}
                      width={1920}
                      height={650}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  );
                  return (
                    <div
                      key={b.id}
                      className="outdoor-slide"
                      data-outdoor-slide={i}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} de ${banners.length}`}
                    >
                      {b.link ? (
                        <a href={b.externo ? b.link : rotaInterna(b.link)} {...(b.externo ? { target: "_blank", rel: "noreferrer" } : {})}>
                          {arte}
                        </a>
                      ) : (
                        arte
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="outdoor-pes" aria-hidden="true">
              <i />
              <i />
            </div>
          </div>

          {banners.length > 1 ? (
            <div className="outdoor-controles">
              <button type="button" className="outdoor-seta" data-outdoor-ant aria-label="Novidade anterior">
                <span aria-hidden="true">←</span>
              </button>
              <div className="outdoor-regua">
                {banners.map((b, i) => (
                  <button key={b.id} type="button" data-outdoor-ir={i} aria-label={`Mostrar novidade ${i + 1}`}>
                    <span>
                      <i />
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="outdoor-seta" data-outdoor-prox aria-label="Próxima novidade">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ───────────── 2 · Onde trabalha ───────────── */}
      <section id="aplicacoes" className="cena cena-manifesto" data-fx-fundo="#090C0F" data-fx-tinta="#E9EDF0">
        <p className="rotulo">Aplicações</p>
        <p className="manifesto" data-manifesto>
          Montagem de motores, intercooler, sistemas hidráulicos, agrícola e cargas pesadas. Abraçadeiras
          desenvolvidas para suportar <em data-forca="vibracao">vibração</em>, <em data-forca="pressao">pressão</em> e{" "}
          <em data-forca="calor">ciclos térmicos extremos</em>.
        </p>
      </section>

      {/* ───────────── 3 · A linha (pico) ───────────── */}
      <section id="linha" className="cena cena-linha" data-fx-fixa="" data-fx-altura="7" data-fx-fundo="#090C0F" data-fx-tinta="#E9EDF0">
        <div className="fx-palco">
          <div className="linha-cabeca">
            <p className="rotulo">A linha Halten</p>
            <p className="linha-total">
              <b data-fx="contar" data-fx-fim={pecas.length}>
                {pecas.length}
              </b>{" "}
              modelos <i>·</i>{" "}
              <b data-fx="contar" data-fx-fim={totalCodigos}>
                {totalCodigos}
              </b>{" "}
              códigos com tabela técnica
            </p>
          </div>

          <div className="linha-luz" aria-hidden="true" />
          <p className="linha-selo" data-linha-selo aria-hidden="true">
            <i />
            Lançamento
          </p>
          <div className="linha-nome" data-linha-nome aria-hidden="true">
            <span>{pecas[0]?.curto}</span>
            <span />
          </div>

          <div className="linha-portal" aria-hidden="true">
            <i className="canto c1" />
            <i className="canto c2" />
            <i className="canto c3" />
            <i className="canto c4" />
            <span className="portal-scan" />
            <div className="linha-cota">
              <span className="cota-seta" />
              <b data-linha-faixa>{pecas[0]?.faixa ?? ""}</b>
              <span className="cota-seta" />
            </div>
          </div>

          <ol className="linha-trilho" data-linha-trilho>
            {pecas.map((p, i) => (
              <li
                key={p.slug}
                className="peca"
                data-peca={i}
                data-nome={p.curto}
                data-faixa={p.faixa ?? ""}
                data-codigos={p.codigos}
                data-lancamento={p.lancamento ? "" : undefined}
                style={{ "--zoom": String(p.zoom / 100) } as CSSProperties}
              >
                <a href={ROTAS.produto(p.slug)}>
                  {p.lancamento ? <em className="peca-selo">Lançamento</em> : null}
                  <span className="peca-foto">
                    {p.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagem} alt={p.nome} decoding="async" fetchPriority={i < 4 ? "high" : "low"} />
                    ) : null}
                  </span>
                  <span className="peca-texto">
                    <b>{p.curto}</b>
                    {p.faixa ? <span>{p.faixa}</span> : null}
                    <span>
                      {p.codigos} {p.codigos === 1 ? "código" : "códigos"}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>

          <div className="linha-ficha" data-linha-ficha>
            <p className="ficha-indice">
              <b data-linha-indice>01</b> / {String(pecas.length).padStart(2, "0")}
            </p>
            <p className="ficha-codigos">
              <b data-linha-ficha-codigos>{pecas[0]?.codigos}</b>{" "}
              <span data-linha-ficha-palavra>{pecas[0]?.codigos === 1 ? "código" : "códigos"}</span> na tabela técnica
            </p>
            <a className="ficha-link" data-linha-link href={ROTAS.produto(pecas[0]?.slug ?? "")}>
              Ver tabela <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="linha-esteira" data-linha-esteira aria-hidden="true">
            <span className="esteira-fita" />
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="esteira-rolo" />
            ))}
          </div>

          <div className="linha-regua" aria-label="Ir para um modelo">
            {pecas.map((p, i) => (
              <button key={p.slug} type="button" data-linha-ir={i} aria-label={p.nome}>
                <span />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 4 · A fábrica (ato claro) ───────────── */}
      <section id="fabrica" className="cena cena-fabrica" data-fx-fundo="#D6DBDF" data-fx-tinta="#0B1014">
        <div className="fabrica-grade">
          <div className="fabrica-placa-col" data-fx="crescer">
            <figure className="placa" data-placa>
              <i className="rebite r1" />
              <i className="rebite r2" />
              <i className="rebite r3" />
              <i className="rebite r4" />
              <p className="placa-razao" data-fx="digitar" data-fx-duracao="1600">
                Halten Indústria e Comércio Ltda.
              </p>
              <dl className="placa-dados">
                <div>
                  <dt>CNPJ</dt>
                  <dd>43.453.407/0001-87</dd>
                </div>
                <div>
                  <dt>Fábrica</dt>
                  <dd>R. Alba Vieira, 653 — Cataratas</dd>
                </div>
                <div>
                  <dt>Cidade</dt>
                  <dd>Cascavel/PR · CEP 85818-630</dd>
                </div>
                <div>
                  <dt>Desde</dt>
                  <dd>2022</dd>
                </div>
              </dl>
              <figcaption>Placa de identificação</figcaption>
            </figure>
          </div>

          <div className="fabrica-texto">
            <p className="rotulo" data-fx="surgir">
              Quem somos
            </p>
            <h2 data-fx="subir">Uma empresa jovem, com propósito claro.</h2>
            <p className="fabrica-lead" data-fx="subir" data-fx-atraso="120">
              Nascemos com o propósito de oferecer abraçadeiras de alta qualidade para o mercado industrial
              brasileiro, com transparência, ética e inovação em cada etapa do processo.
            </p>
            <ol className="pilares">
              <li data-fx="subir">
                <span className="pilar-k">Missão</span>
                <div>
                  <h3>Fornecer soluções técnicas que apertam de verdade.</h3>
                  <p>Abraçadeiras que garantem operações mais seguras e eficientes para o setor industrial brasileiro.</p>
                </div>
              </li>
              <li data-fx="subir">
                <span className="pilar-k">Visão</span>
                <div>
                  <h3>Ser a referência nacional em fixação.</h3>
                  <p>
                    Reconhecida pela qualidade, pela inovação no processo produtivo e pelo cuidado com o cliente — peça
                    a peça.
                  </p>
                </div>
              </li>
              <li data-fx="subir">
                <span className="pilar-k">Valores</span>
                <div>
                  <h3>Integridade, robustez e atendimento dedicado.</h3>
                  <p>
                    Resultado do cliente como métrica principal. Comprometimento com prazo, qualidade e a verdade técnica
                    em cada catálogo.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── 5 · De Cascavel para o Brasil ───────────── */}
      <section
        id="brasil"
        className="cena cena-brasil"
        data-fx-fixa=""
        data-fx-altura="3"
        data-fx-fundo="#D6DBDF"
        data-fx-tinta="#0B1014"
      >
        <div className="fx-palco">
          <div className="brasil-texto">
            <p className="rotulo">Presença</p>
            <h2>
              De Cascavel
              <br />
              para <span data-brasil-n>{estados.length}</span> estados.
            </h2>
            <p className="brasil-lead">
              {representantes} representantes comerciais levam a Halten de Cascavel/PR para {estados.length} estados
              do Brasil.
            </p>
            <dl className="brasil-numeros">
              <div>
                <dt>Estados atendidos</dt>
                <dd data-brasil-contador>{String(estados.length).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Representantes</dt>
                <dd>{representantes}</dd>
              </div>
            </dl>
            <a className="botao botao-escuro" href={ROTAS.representantes}>
              Encontre seu representante
            </a>
          </div>

          <svg className="brasil-mapa" viewBox={BRASIL_VIEWBOX} role="img" aria-label={`Mapa do Brasil com os estados atendidos: ${estados.map((uf) => NOMES_UF[uf] ?? uf).join(", ")}.`}>
            <g className="mapa-estados">
              {Object.entries(ESTADOS).map(([uf, e]) => (
                <path key={uf} d={e.d} data-uf={uf} className={estados.includes(uf) ? "uf uf-atendido" : "uf"} />
              ))}
            </g>
            <g className="mapa-rotas">
              {rotas.map((r) => (
                <path key={r.uf} d={r.d} data-rota={r.uf} className="rota" />
              ))}
            </g>
            <g className="mapa-rotulos">
              {estados
                .filter((uf) => ESTADOS[uf])
                .map((uf) => {
                  const [x, y] = ESTADOS[uf].c;
                  const off = ROTULO_DESLOCADO[uf];
                  const lx = off ? x + off[0] : x;
                  const ly = off ? y + off[1] : y;
                  return (
                    <g key={uf} className="rotulo-uf" data-rotulo={uf}>
                      {off ? <line x1={x} y1={y} x2={lx - 22} y2={ly - 6} /> : null}
                      <text x={lx} y={ly}>
                        {uf}
                      </text>
                    </g>
                  );
                })}
            </g>
            <g className="mapa-cascavel" transform={`translate(${CASCAVEL[0]} ${CASCAVEL[1]})`}>
              <circle className="pulso" r="16" />
              <circle className="nucleo" r="7" />
              <text x="-14" y="34">
                Cascavel
              </text>
            </g>
          </svg>
        </div>
      </section>

      {/* ───────────── 6 · No bolso ───────────── */}
      <section id="app" className="cena cena-app" data-fx-fundo="#090C0F" data-fx-tinta="#E9EDF0">
        <div className="app-grade">
          <div className="app-texto">
            <p className="rotulo" data-fx="surgir">
              Aplicativo e catálogo
            </p>
            <h2 data-fx="subir">A linha inteira no seu bolso.</h2>
            <p className="app-lead" data-fx="subir" data-fx-atraso="120">
              Consulte códigos, tabelas técnicas e o catálogo completo de abraçadeiras direto do smartphone. Disponível
              gratuitamente para Android e iOS.
            </p>
            <ul className="app-recursos">
              <li data-fx="esquerda">Busca por código e nº de conversão</li>
              <li data-fx="esquerda" data-fx-atraso="90">
                Filtro por medida, grupo e montadora
              </li>
              <li data-fx="esquerda" data-fx-atraso="180">
                Carrinho para montar o pedido
              </li>
            </ul>
            <div className="app-lojas" data-fx="subir" data-fx-atraso="120">
              <a href={APP_STORE} target="_blank" rel="noreferrer" className="loja">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 12.04c-.03-2.46 2.01-3.64 2.1-3.7-1.15-1.68-2.94-1.91-3.57-1.93-1.5-.16-2.95.9-3.72.9-.78 0-1.96-.88-3.23-.86-1.65.03-3.2.96-4.05 2.44-1.74 3.01-.44 7.45 1.24 9.89.82 1.19 1.79 2.52 3.07 2.48 1.24-.05 1.7-.79 3.2-.79 1.49 0 1.92.79 3.22.77 1.33-.02 2.17-1.2 2.98-2.4.94-1.37 1.32-2.71 1.34-2.78-.03-.01-2.55-.98-2.58-3.89zM14.65 4.52c.69-.83 1.15-2 1.02-3.14-.99.04-2.18.66-2.89 1.49-.64.73-1.2 1.9-1.05 3.02 1.1.08 2.23-.55 2.92-1.37z" />
                </svg>
                <span>
                  <small>Baixe na</small>App Store
                </span>
              </a>
              <a href={GOOGLE_PLAY} target="_blank" rel="noreferrer" className="loja">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/google-play-store-icon.svg" alt="" width={20} height={20} />
                <span>
                  <small>Disponível no</small>Google Play
                </span>
              </a>
            </div>
            <a className="app-catalogo" href={catalogo.href} {...(catalogo.externo ? { target: "_blank", rel: "noreferrer" } : {})} data-fx="surgir">
              Prefere folhear? Abrir o catálogo digital <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="app-visual">
            <div className="app-chips" aria-hidden="true">
              <span data-fx-paralaxe="0.22" style={{ top: "12%", left: "-4%" }}>TCH120132</span>
              <span data-fx-paralaxe="0.12" style={{ top: "38%", right: "-8%" }}>MT3238</span>
              <span data-fx-paralaxe="0.3" style={{ bottom: "26%", left: "-10%" }}>OM2545</span>
              <span data-fx-paralaxe="0.18" style={{ bottom: "8%", right: "0%" }}>WG105</span>
            </div>
            <div className="app-ponteiro" data-fx-mouse="10">
              <div className="celular" data-celular>
                <div className="celular-tela">
                  {[2, 3, 4, 5].map((n, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/v2/app/tela-${n}.webp`}
                      alt={
                        [
                          "Tela de boas-vindas do app Halten",
                          "Menu do app: pesquisar produtos, lançamentos e carrinho",
                          "Busca por código, nº de conversão, grupo, subgrupo e montadora",
                          "Resultados da busca com códigos e descrições",
                        ][i]
                      }
                      data-tela={i}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ))}
                </div>
                <span className="celular-ilha" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 7 · Fechamento ───────────── */}
      <section id="contato" className="cena cena-fim" data-fx-fundo="#090C0F" data-fx-tinta="#E9EDF0">
        <p className="rotulo" data-fx="surgir">
          Atendimento comercial
        </p>
        <h2 className="fim-titulo">
          <span data-fx="subir">Vamos apertar</span>
          <span data-fx="subir" data-fx-atraso="110">
            seu próximo
          </span>
          <span data-fx="subir" data-fx-atraso="220">
            projeto?
          </span>
        </h2>
        <div className="fim-alvo" data-fim-alvo>
          <svg className="cinta" data-cinta-fim aria-hidden="true" />
          <a className="botao botao-grande" href={WHATSAPP} target="_blank" rel="noreferrer" data-fim-botao>
            Pedir orçamento no WhatsApp
          </a>
        </div>
        <ul className="fim-contatos">
          <li>
            <span>WhatsApp comercial</span>
            <a href={WHATSAPP} target="_blank" rel="noreferrer">
              (45) 99151-7308
            </a>
          </li>
          <li>
            <span>Telefone</span>
            <a href="tel:+554531972130">(45) 3197-2130</a>
          </li>
          <li>
            <span>E-mail</span>
            <a href="mailto:contato@halten.ind.br">contato@halten.ind.br</a>
          </li>
          <li>
            <span>Fábrica</span>
            <a href="https://maps.google.com/?q=R.+Alba+Vieira+653+Cascavel+PR" target="_blank" rel="noreferrer">
              R. Alba Vieira, 653 — Cascavel/PR
            </a>
          </li>
          <li>
            <span>Horário</span>
            <b>Seg – Sex · 08:00 às 18:00</b>
          </li>
        </ul>
      </section>

      <Rodape />

      <Movimento medidor={{ min: medidor.min, max: medidor.max }} />
    </main>
  );
}
