"use client";

import { useState } from "react";
import { useCart } from "../../context/cart-context";
import type { Coluna } from "../../v2/_dados/linha";
import type { Conversao } from "../../v2/_dados/produto";

const compacto = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** "100 unidades" → 100: o carrinho já entra com a embalagem fechada, como no site atual. */
function qtdDaEmbalagem(embalagem: string | undefined) {
  const m = embalagem?.match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

function BotaoOrcamento({ codigo, produto, qtd, rotulo }: { codigo: string; produto: string; qtd: number; rotulo?: string }) {
  const { items, addItem, removeItem } = useCart();
  const dentro = items.some((i) => i.code === codigo);
  return (
    <button
      type="button"
      className={dentro ? "pt-botao dentro" : "pt-botao"}
      aria-pressed={dentro}
      aria-label={dentro ? `Tirar ${codigo} do orçamento` : `Adicionar ${codigo} ao orçamento`}
      onClick={() => (dentro ? removeItem(codigo) : addItem(codigo, produto, qtd))}
    >
      <span aria-hidden="true">{dentro ? "✓" : "+"}</span>
      {dentro ? "No orçamento" : "Orçamento"}
      {rotulo ? <small>{rotulo}</small> : null}
    </button>
  );
}

export function TabelaTecnica({
  colunas,
  linhas,
  conversoes,
  produto,
  qtdUm,
}: {
  colunas: Coluna[];
  linhas: Record<string, string>[];
  conversoes: Conversao[];
  produto: string;
  qtdUm: boolean;
}) {
  const [filtro, setFiltro] = useState("");
  const f = compacto(filtro);

  const destaques = colunas.filter((c) => c.highlight);
  const varios = destaques.length > 1;
  const embalagem = colunas.find((c) => /embalagem/i.test(c.key + c.label));

  const linhasF = f ? linhas.filter((l) => colunas.some((c) => compacto(l[c.key] ?? "").includes(f))) : linhas;
  const convF = f
    ? conversoes.filter((c) => compacto(c.codigo_halten).includes(f) || compacto(c.codigos_originais).includes(f))
    : conversoes;

  return (
    <div className="pt">
      <div className="pt-filtro">
        <label htmlFor="pt-f">Filtrar</label>
        <input
          id="pt-f"
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Código ou medida"
          autoComplete="off"
          spellCheck={false}
        />
        <span aria-live="polite">
          {linhas.length
            ? f
              ? `${linhasF.length} de ${linhas.length} ${linhas.length === 1 ? "linha" : "linhas"}`
              : `${linhas.length} ${linhas.length === 1 ? "linha" : "linhas"}`
            : null}
        </span>
      </div>

      {linhas.length ? (
        linhasF.length ? (
          <table className="pt-tabela">
            <caption className="sr-only">Tabela técnica — {produto}</caption>
            <thead>
              <tr>
                {colunas.map((c) => (
                  <th key={c.key} scope="col" className={c.highlight ? "pt-hl" : undefined}>
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="pt-th-orc">
                  Orçamento
                </th>
              </tr>
            </thead>
            <tbody>
              {linhasF.map((l, i) => (
                <tr key={`${destaques.map((c) => l[c.key]).join("|")}-${i}`}>
                  {colunas.map((c) =>
                    l[c.key] ? (
                      <td key={c.key} data-rotulo={c.label} className={c.highlight ? "pt-hl" : undefined}>
                        {l[c.key]}
                      </td>
                    ) : (
                      <td key={c.key} data-rotulo={c.label} className="pt-vazio-cel">
                        —
                      </td>
                    ),
                  )}
                  <td className="pt-orc">
                    {destaques.map((c) =>
                      l[c.key] ? (
                        <BotaoOrcamento
                          key={c.key}
                          codigo={l[c.key]}
                          produto={produto}
                          qtd={qtdUm ? 1 : qtdDaEmbalagem(embalagem ? l[embalagem.key] : undefined)}
                          rotulo={varios ? c.label : undefined}
                        />
                      ) : null,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="pt-nada">
            Nenhum código com “<b>{filtro.trim()}</b>” nesta tabela.
          </p>
        )
      ) : null}

      {conversoes.length ? (
        <div className="pt-conv">
          <h3>
            Conversões <span>código Halten ↔ códigos originais</span>
          </h3>
          {convF.length ? (
            <table className="pt-tabela pt-tabela-conv">
              <caption className="sr-only">Conversões de códigos — {produto}</caption>
              <thead>
                <tr>
                  <th scope="col" className="pt-hl">
                    Código Halten
                  </th>
                  <th scope="col">Códigos originais</th>
                </tr>
              </thead>
              <tbody>
                {convF.map((c, i) => (
                  <tr key={`${c.codigo_halten}-${i}`}>
                    <td data-rotulo="Código Halten" className="pt-hl">
                      {c.codigo_halten}
                    </td>
                    <td data-rotulo="Códigos originais">{c.codigos_originais}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="pt-nada">
              Nenhuma conversão com “<b>{filtro.trim()}</b>”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
