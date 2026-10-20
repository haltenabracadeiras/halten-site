"use client";

/* Banner de cookies (LGPD / guia de cookies da ANPD).
   - Nada de medição (GA4) ou publicidade (Meta Pixel) antes da escolha: o Rastreamento só carrega cada
     ferramenta quando a categoria dela foi aceita.
   - "Aceitar" e "Recusar" com o mesmo destaque; "Personalizar" abre as categorias, todas desligadas.
   - Fechar no X não conta como aceite: o aviso some nesta aba e volta na próxima visita.
   - A escolha fica no navegador (data, categorias e versão) e muda pelo "Preferências de cookies" do rodapé. */

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { archivo } from "../v2/_partes/fonte";
import { ROTAS } from "../v2/_partes/contato";
import "./consentimento.css";

/** Mudou o texto do banner ou as ferramentas usadas? Suba a versão: todo mundo é perguntado de novo. */
export const VERSAO_BANNER = "1";

const CHAVE = "halten-cookies";
const CHAVE_FECHADO = "halten-cookies-fechado"; // X nesta aba (sessionStorage)
const EVENTO_MUDOU = "halten:cookies";
const EVENTO_ABRIR = "halten:abrir-cookies";

export type Categorias = { necessarios: true; medicao: boolean; publicidade: boolean };
export type Escolha = { versao: string; data: string; categorias: Categorias };

function lerBruto(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function interpretar(bruto: string | null): Escolha | null {
  if (!bruto) return null;
  try {
    const e = JSON.parse(bruto) as Escolha;
    if (e?.versao !== VERSAO_BANNER || !e.categorias) return null; // versão antiga: pergunta de novo
    return {
      versao: e.versao,
      data: String(e.data),
      categorias: { necessarios: true, medicao: e.categorias.medicao === true, publicidade: e.categorias.publicidade === true },
    };
  } catch {
    return null;
  }
}

/** Escolha salva (ou null se a pessoa ainda não escolheu nesta versão do banner). */
export function lerEscolha() {
  return interpretar(lerBruto());
}

/** Apaga os cookies de uma ferramenta em todos os níveis do domínio (o GA grava no domínio raiz). */
function apagarCookies(prefixo: RegExp) {
  const partes = location.hostname.split(".");
  const dominios = [""];
  for (let i = 0; i < partes.length - 1; i++) dominios.push(`; domain=.${partes.slice(i).join(".")}`);
  for (const par of document.cookie.split(";")) {
    const nome = par.split("=")[0].trim();
    if (!prefixo.test(nome)) continue;
    for (const d of dominios) document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  }
}

function salvarEscolha(medicao: boolean, publicidade: boolean) {
  const escolha: Escolha = {
    versao: VERSAO_BANNER,
    data: new Date().toISOString(),
    categorias: { necessarios: true, medicao, publicidade },
  };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(escolha));
  } catch {
    // navegador sem armazenamento: a escolha vale só enquanto a página estiver aberta
  }
  if (!medicao) apagarCookies(/^(_ga|_gid|_gat)/);
  if (!publicidade) apagarCookies(/^(_fbp|_fbc)$/);
  window.dispatchEvent(new Event(EVENTO_MUDOU));
}

function assinar(avisar: () => void) {
  window.addEventListener(EVENTO_MUDOU, avisar);
  window.addEventListener("storage", avisar); // escolha feita em outra aba
  return () => {
    window.removeEventListener(EVENTO_MUDOU, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Escolha atual, atualizada na hora quando muda. No servidor e antes de hidratar: null. */
export function useEscolha() {
  const bruto = useSyncExternalStore(assinar, lerBruto, () => null);
  return useMemo(() => interpretar(bruto), [bruto]);
}

const nada = () => () => {};
function useNoNavegador() {
  return useSyncExternalStore(nada, () => true, () => false);
}

/** Link "Preferências de cookies" (rodapés): reabre o painel com a escolha atual. */
export function BotaoPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button type="button" className={`ck-link-rodape ${className ?? ""}`} onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))}>
      Preferências de cookies
    </button>
  );
}

const CATEGORIAS = [
  {
    chave: "necessarios",
    nome: "Necessários",
    texto: "Fazem o site funcionar: guardam esta escolha e o seu pedido de orçamento. Não identificam você.",
  },
  {
    chave: "medicao",
    nome: "Medição",
    ferramenta: "Google Analytics 4",
    texto: "Contam visitas, páginas vistas e cliques no WhatsApp para entendermos o que melhorar no site.",
  },
  {
    chave: "publicidade",
    nome: "Publicidade",
    ferramenta: "Meta Pixel",
    texto: "Medem os resultados dos nossos anúncios no Facebook e no Instagram e ajudam a mostrar anúncios da Halten.",
  },
] as const;

export function BannerCookies() {
  const pathname = usePathname();
  const noNavegador = useNoNavegador();
  const escolha = useEscolha();
  const [fechado, setFechado] = useState(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem(CHAVE_FECHADO) === "1";
    } catch {
      return false;
    }
  });
  const [personalizar, setPersonalizar] = useState(false);
  const [reaberto, setReaberto] = useState(false); // aberto pelo rodapé
  const [rascunho, setRascunho] = useState({ medicao: false, publicidade: false });
  const caixa = useRef<HTMLDivElement>(null);
  const idTitulo = useId();

  // "Preferências de cookies" no rodapé: abre já nas categorias, com o que está valendo
  useEffect(() => {
    function abrir() {
      const atual = lerEscolha()?.categorias;
      setRascunho({ medicao: atual?.medicao ?? false, publicidade: atual?.publicidade ?? false });
      setPersonalizar(true);
      setReaberto(true);
    }
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  // aberto pelo rodapé: leva o foco do teclado para o painel
  useEffect(() => {
    if (reaberto) caixa.current?.focus();
  }, [reaberto]);

  if (!noNavegador || pathname?.startsWith("/admin")) return null;
  const visivel = reaberto || (!escolha && !fechado);
  if (!visivel) return null;

  function concluir(medicao: boolean, publicidade: boolean) {
    salvarEscolha(medicao, publicidade);
    setReaberto(false);
    setPersonalizar(false);
  }

  function fecharNoX() {
    // não é aceite: sem escolha salva, nada de medição/publicidade carrega
    if (!escolha) {
      try {
        sessionStorage.setItem(CHAVE_FECHADO, "1");
      } catch {}
    }
    setFechado(true);
    setReaberto(false);
    setPersonalizar(false);
  }

  return (
    <div
      ref={caixa}
      className={`ck ${archivo.variable}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={idTitulo}
      tabIndex={-1}
      onKeyDown={(e) => e.key === "Escape" && fecharNoX()}
    >
      <button type="button" className="ck-x" onClick={fecharNoX} aria-label="Fechar sem aceitar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <p className="ck-rotulo">Privacidade</p>
      <h2 className="ck-titulo" id={idTitulo}>
        {personalizar ? "Preferências de cookies" : "Cookies, só com a sua permissão"}
      </h2>

      {!personalizar ? (
        <p className="ck-texto">
          Usamos cookies necessários para o site funcionar. Com a sua permissão, também usamos cookies de medição
          (Google Analytics) e de publicidade (Meta Pixel). Você pode mudar isso quando quiser em “Preferências de
          cookies”, no rodapé. Saiba mais na <a href={ROTAS.privacidade}>Política de Privacidade</a>.
        </p>
      ) : (
        <>
          <p className="ck-texto">
            Escolha o que pode ser usado. Medição e publicidade começam desligadas e só ligam se você ativar. Detalhes
            na <a href={ROTAS.privacidade}>Política de Privacidade</a>.
          </p>
          <ul className="ck-categorias">
            {CATEGORIAS.map((c) => {
              const sempre = c.chave === "necessarios";
              const ligado = sempre ? true : rascunho[c.chave];
              const idCampo = `${idTitulo}-${c.chave}`;
              return (
                <li key={c.chave} className="ck-categoria">
                  <div className="ck-categoria-topo">
                    <label htmlFor={idCampo} className="ck-categoria-nome">
                      {c.nome}
                      {"ferramenta" in c && <small>{c.ferramenta}</small>}
                    </label>
                    {sempre ? (
                      <span className="ck-sempre">Sempre ativos</span>
                    ) : null}
                    <input
                      id={idCampo}
                      type="checkbox"
                      role="switch"
                      className="ck-chave"
                      checked={ligado}
                      disabled={sempre}
                      aria-checked={ligado}
                      onChange={(e) => !sempre && setRascunho({ ...rascunho, [c.chave]: e.target.checked })}
                    />
                  </div>
                  <p>{c.texto}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="ck-botoes">
        <button type="button" className="ck-botao" onClick={() => concluir(false, false)}>
          Recusar
        </button>
        <button type="button" className="ck-botao" onClick={() => concluir(true, true)}>
          Aceitar
        </button>
        {personalizar ? (
          <button type="button" className="ck-botao-sec" onClick={() => concluir(rascunho.medicao, rascunho.publicidade)}>
            Salvar minhas escolhas
          </button>
        ) : (
          <button
            type="button"
            className="ck-botao-sec"
            onClick={() => {
              setRascunho({ medicao: false, publicidade: false });
              setPersonalizar(true);
            }}
          >
            Personalizar
          </button>
        )}
      </div>
    </div>
  );
}
