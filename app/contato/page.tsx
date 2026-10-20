import type { Metadata } from "next";
import "../v2/v2.css";
import "../v2/v2-paginas.css";
import { getConfigSite } from "../../lib/configuracoes";
import { CONTATO, ROTAS, formatarTelefone, whatsappComercial } from "../v2/_partes/contato";
import { archivo } from "../v2/_partes/fonte";
import { Rodape, Topo } from "../v2/_partes/moldura";
import { Revelar } from "../v2/_partes/revelar";
import { Formulario } from "./formulario";

export async function generateMetadata(): Promise<Metadata> {
  const { whatsapp } = await getConfigSite();
  return {
    title: "Contato — Halten Abraçadeiras",
    description: `Fale com a fábrica da Halten em Cascavel/PR: WhatsApp ${formatarTelefone(whatsapp)}, telefone (45) 3197-2130 e contato@halten.ind.br. Seg a sex, das 08:00 às 18:00.`,
  };
}

// o mesmo mapa da página de localização atual
const MAPA =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765!2d-53.4007868!3d-24.957148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d5ebc7600681:0x29b1524dc2f68e56!2sHalten+Abra%C3%A7adeiras!5e0!3m2!1spt-BR!2sbr!4v1748873600000!5m2!1spt-BR!2sbr";

export default async function ContatoV2Page() {
  const { whatsapp } = await getConfigSite();
  return (
    <main className={`v2 pg ${archivo.variable}`} id="v2">
      <Topo />

      <section className="ct-heroi">
        <div className="ct-canais">
          <p className="rotulo" data-revela>
            Contato <i>·</i> atendimento comercial
          </p>
          <h1 className="pg-titulo" data-revela>
            Fale com a fábrica.
          </h1>
          <p className="pg-lead" data-revela>
            Atendimento comercial e técnico direto de Cascavel/PR, de segunda a sexta, das 08:00 às 18:00.
          </p>

          <ul className="ct-lista" data-revela>
            <li>
              <span>WhatsApp comercial</span>
              <a href={whatsappComercial(whatsapp)} target="_blank" rel="noreferrer">
                {formatarTelefone(whatsapp)}
              </a>
            </li>
            <li>
              <span>Telefone</span>
              <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
            </li>
            <li>
              <span>E-mail</span>
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            </li>
            <li>
              <span>Horário</span>
              <b>{CONTATO.horario}</b>
            </li>
          </ul>

          <a className="ct-reps" href={ROTAS.representantes} data-revela>
            <span>Prefere falar com quem atende a sua região?</span>
            <b>
              Encontre seu representante <span aria-hidden="true">→</span>
            </b>
          </a>
        </div>

        <div className="ct-form" data-revela>
          <Formulario />
        </div>
      </section>

      <section className="ct-local" aria-labelledby="ct-local-titulo">
        <div className="ct-local-texto">
          <p className="rotulo" data-revela>
            Localização
          </p>
          <h2 id="ct-local-titulo" data-revela>
            Estamos em Cascavel, no Oeste do Paraná.
          </h2>
          <figure className="placa ct-placa" data-revela>
            <i className="rebite r1" />
            <i className="rebite r2" />
            <i className="rebite r3" />
            <i className="rebite r4" />
            <p className="placa-razao">{CONTATO.razao}</p>
            <dl className="placa-dados">
              <div>
                <dt>Endereço</dt>
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
                <dt>CNPJ</dt>
                <dd>{CONTATO.cnpj}</dd>
              </div>
            </dl>
            <figcaption>Placa de identificação</figcaption>
          </figure>
          <div className="ct-local-acoes" data-revela>
            <a className="botao botao-escuro" href={CONTATO.rota} target="_blank" rel="noreferrer">
              Traçar rota até a fábrica
            </a>
            <a className="ct-link" href={CONTATO.mapa} target="_blank" rel="noreferrer">
              Abrir no Google Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="ct-mapa" data-revela>
          <iframe
            src={MAPA}
            title="Mapa da fábrica da Halten em Cascavel/PR"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <Rodape />
      <Revelar />
    </main>
  );
}
