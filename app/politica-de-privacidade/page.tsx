import type { Metadata } from "next";
import "../v2/v2.css";
import "../v2/v2-paginas.css";
import "./politica.css";
import { BotaoPreferenciasCookies } from "../components/consentimento";
import { CONTATO, ROTAS } from "../v2/_partes/contato";
import { archivo } from "../v2/_partes/fonte";
import { Rodape, Topo } from "../v2/_partes/moldura";

export const metadata: Metadata = {
  title: "Política de Privacidade — Halten Abraçadeiras",
  description:
    "Como a Halten Abraçadeiras trata dados pessoais no site, quais cookies usa (necessários, medição e publicidade) e como você controla a sua escolha.",
};

const ATUALIZADA_EM = "20 de outubro de 2026";

const SECOES = [
  { id: "controlador", titulo: "Quem cuida dos seus dados" },
  { id: "dados", titulo: "Que dados tratamos e para quê" },
  { id: "cookies", titulo: "Cookies" },
  { id: "compartilhamento", titulo: "Com quem compartilhamos" },
  { id: "prazos", titulo: "Por quanto tempo guardamos" },
  { id: "direitos", titulo: "Seus direitos" },
  { id: "seguranca", titulo: "Segurança" },
  { id: "contato", titulo: "Fale com a gente" },
  { id: "mudancas", titulo: "Mudanças nesta política" },
];

export default function PoliticaPrivacidadePage() {
  return (
    <main className={`v2 pg pol ${archivo.variable}`} id="v2">
      <Topo />

      <header className="pg-cabeca">
        <p className="rotulo">
          Privacidade <i>·</i> LGPD
        </p>
        <h1 className="pg-titulo">Política de Privacidade</h1>
        <p className="pg-lead">
          Como a Halten trata dados pessoais neste site, quais cookies usamos e como você controla isso — em
          linguagem direta, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
        <p className="pol-data">Última atualização: {ATUALIZADA_EM}</p>
      </header>

      <div className="pol-corpo">
        <nav className="pol-indice" aria-label="Nesta página">
          <p className="rotulo">Nesta página</p>
          <ol>
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.titulo}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="pol-texto">
          <section id="controlador">
            <h2>Quem cuida dos seus dados</h2>
            <p>
              O controlador dos dados tratados neste site é a <b>{CONTATO.razao}</b> (Halten Abraçadeiras), CNPJ{" "}
              {CONTATO.cnpj}, com sede na {CONTATO.endereco} — {CONTATO.bairro}, {CONTATO.cidade}, CEP {CONTATO.cep}.
            </p>
          </section>

          <section id="dados">
            <h2>Que dados tratamos e para quê</h2>
            <ul>
              <li>
                <b>Contato e orçamentos.</b> O formulário de contato e os botões de orçamento não guardam nada no site:
                eles montam a mensagem e abrem o WhatsApp. O que você escreve (nome, empresa, e-mail, telefone,
                mensagem, itens do orçamento) chega até nós pela conversa e é usado para responder e preparar a sua
                proposta. Base legal: procedimentos preliminares a um contrato, a seu pedido (art. 7º, V, da LGPD).
              </li>
              <li>
                <b>Representantes.</b> Ao clicar no WhatsApp ou no e-mail de um representante comercial, você fala
                direto com a empresa representante do seu estado, que atende em nome da Halten.
              </li>
              <li>
                <b>Contagem de visitas.</b> Para saber quais páginas são mais vistas, registramos apenas o endereço da
                página e o horário da visita — sem cookies e sem nada que identifique você.
              </li>
              <li>
                <b>Medição e publicidade.</b> Só com o seu consentimento (art. 7º, I): veja a seção{" "}
                <a href="#cookies">Cookies</a>.
              </li>
              <li>
                <b>Registros técnicos.</b> Os provedores que mantêm o site no ar registram dados técnicos de acesso
                (como endereço IP, navegador e horário) para segurança e funcionamento do serviço.
              </li>
            </ul>
            <p>Não vendemos dados pessoais. O site não é direcionado a crianças e adolescentes.</p>
          </section>

          <section id="cookies">
            <h2>Cookies</h2>
            <p>
              Cookies são pequenos arquivos que o site guarda no seu navegador. Aqui eles se dividem em três
              categorias. Apenas os <b>necessários</b> funcionam sempre; <b>medição</b> e <b>publicidade</b> começam
              desligados e só são ativados se você aceitar.
            </p>

            <div className="pol-tabela" role="region" aria-label="Cookies usados no site" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Categoria</th>
                    <th scope="col">Para que serve</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" rowSpan={3}>
                      Necessários
                      <small>sempre ativos</small>
                    </th>
                    <td>Guarda a sua escolha sobre cookies (data, categorias e versão do aviso)</td>
                    <td>
                      <code>halten-cookies</code>
                      <small>armazenamento local</small>
                    </td>
                    <td>Até você mudar a escolha ou limpar o navegador</td>
                  </tr>
                  <tr>
                    <td>Guarda os itens do seu pedido de orçamento</td>
                    <td>
                      <code>halten-cart</code>
                      <small>armazenamento local</small>
                    </td>
                    <td>Até você enviar o pedido ou limpar o navegador</td>
                  </tr>
                  <tr>
                    <td>Lembra que você fechou o aviso sem escolher, para não repeti-lo a cada página</td>
                    <td>
                      <code>halten-cookies-fechado</code>
                      <small>armazenamento da sessão</small>
                    </td>
                    <td>Até fechar a aba</td>
                  </tr>
                  <tr>
                    <th scope="row" rowSpan={2}>
                      Medição
                      <small>Google Analytics 4 · Google</small>
                    </th>
                    <td>Distingue visitantes e sessões para contar visitas, páginas vistas, origem do acesso e cliques no WhatsApp</td>
                    <td>
                      <code>_ga</code>
                    </td>
                    <td>2 anos</td>
                  </tr>
                  <tr>
                    <td>Mantém o estado da sessão de medição</td>
                    <td>
                      <code>_ga_&lt;ID&gt;</code>
                    </td>
                    <td>2 anos</td>
                  </tr>
                  <tr>
                    <th scope="row" rowSpan={2}>
                      Publicidade
                      <small>Meta Pixel · Meta</small>
                    </th>
                    <td>Mede visitas e contatos vindos dos nossos anúncios no Facebook e no Instagram</td>
                    <td>
                      <code>_fbp</code>
                    </td>
                    <td>3 meses</td>
                  </tr>
                  <tr>
                    <td>Registra que você chegou por um anúncio da Halten</td>
                    <td>
                      <code>_fbc</code>
                    </td>
                    <td>3 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Como funciona a sua escolha</h3>
            <ul>
              <li>
                Antes de você escolher, nenhuma ferramenta de medição ou de publicidade é carregada. Fechar o aviso no X
                não conta como aceite.
              </li>
              <li>
                “Aceitar” liga medição e publicidade; “Recusar” mantém só os necessários; “Personalizar” deixa você
                ligar cada categoria separadamente.
              </li>
              <li>
                Com medição aceita, o Google Analytics recebe dados de navegação (páginas vistas, tempo, tipo de
                aparelho, cidade aproximada, cliques no WhatsApp). Com publicidade aceita, a Meta recebe as visitas e os
                cliques de contato para medir e direcionar anúncios; ela também pode usar cookies próprios nos domínios
                dela, conforme a política de privacidade da Meta.
              </li>
              <li>
                Você pode mudar ou retirar o consentimento quando quiser, com a mesma facilidade, pelo link
                “Preferências de cookies” no rodapé de todas as páginas. Ao retirar, apagamos os cookies daquela
                categoria. Também é possível bloquear ou apagar cookies nas configurações do seu navegador.
              </li>
            </ul>
            <p className="pol-acao">
              <BotaoPreferenciasCookies className="botao" />
            </p>
          </section>

          <section id="compartilhamento">
            <h2>Com quem compartilhamos</h2>
            <ul>
              <li>
                <b>Google</b> (Google Analytics) e <b>Meta</b> (Meta Pixel), somente se você aceitar as categorias de
                medição e de publicidade.
              </li>
              <li>
                <b>WhatsApp</b> (Meta), que leva as mensagens que você nos envia.
              </li>
              <li>
                <b>Provedores de infraestrutura</b> que hospedam o site e o banco de dados (Vercel e Supabase).
              </li>
              <li>
                <b>Representantes comerciais</b>, quando você escolhe falar com eles.
              </li>
              <li>Autoridades públicas, quando a lei exigir.</li>
            </ul>
            <p>
              Alguns desses fornecedores podem tratar dados fora do Brasil, conforme as garantias previstas na LGPD
              (arts. 33 a 36) e nos termos que eles oferecem.
            </p>
          </section>

          <section id="prazos">
            <h2>Por quanto tempo guardamos</h2>
            <p>
              Os cookies duram os prazos da tabela acima. Os relatórios do Google Analytics ficam guardados pelo prazo de
              retenção configurado na conta (de 2 a 14 meses). Conversas de atendimento e orçamentos são mantidos pelo
              tempo necessário para o atendimento e para cumprir obrigações legais e fiscais.
            </p>
          </section>

          <section id="direitos">
            <h2>Seus direitos</h2>
            <p>Pela LGPD (art. 18), você pode pedir, a qualquer momento:</p>
            <ul>
              <li>confirmação de que tratamos seus dados e acesso a eles;</li>
              <li>correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;</li>
              <li>portabilidade dos dados a outro fornecedor;</li>
              <li>eliminação dos dados tratados com base no seu consentimento;</li>
              <li>informação sobre com quem compartilhamos seus dados;</li>
              <li>informação sobre a possibilidade de não consentir e as consequências disso;</li>
              <li>revogação do consentimento.</li>
            </ul>
            <p>
              Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), em{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer">
                gov.br/anpd
              </a>
              .
            </p>
          </section>

          <section id="seguranca">
            <h2>Segurança</h2>
            <p>
              Usamos conexão criptografada (HTTPS), acesso restrito à área administrativa e fornecedores com práticas
              reconhecidas de segurança. Nenhum sistema é totalmente imune a falhas; se ocorrer um incidente relevante,
              agiremos conforme a LGPD.
            </p>
          </section>

          <section id="contato">
            <h2>Fale com a gente</h2>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, fale com o nosso canal de privacidade:{" "}
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a> ou {CONTATO.telefone} ({CONTATO.horario}).
              Respondemos no prazo da lei.
            </p>
          </section>

          <section id="mudancas">
            <h2>Mudanças nesta política</h2>
            <p>
              Podemos atualizar esta política quando o site ou a lei mudarem. A data no topo indica a última versão.
              Se mudarmos as ferramentas de cookies, o aviso aparece de novo para você escolher outra vez.
            </p>
            <p>
              <a href={ROTAS.inicio}>Voltar ao início</a>
            </p>
          </section>
        </article>
      </div>

      <Rodape />
    </main>
  );
}
