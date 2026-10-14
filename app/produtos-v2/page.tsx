import type { Metadata } from "next";
import "../v2/v2.css";
import "../v2/v2-paginas.css";
import { carregarDadosV2 } from "../v2/_dados/linha";
import { archivo } from "../v2/_partes/fonte";
import { Rodape, Topo } from "../v2/_partes/moldura";
import { Revelar } from "../v2/_partes/revelar";
import { ListaProdutos } from "./lista";

// produto novo ou trocado no admin aparece na hora
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produtos — Halten Abraçadeiras (prévia v2)",
  robots: { index: false, follow: false },
};

export default async function ProdutosV2Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { pecas, totalCodigos } = await carregarDadosV2();

  return (
    <main className={`v2 pg ${archivo.variable}`} id="v2">
      <Topo />

      <header className="pg-cabeca">
        <p className="rotulo" data-revela>
          Produtos <i>·</i> linha completa
        </p>
        <h1 className="pg-titulo" data-revela>
          A linha Halten.
        </h1>
        <p className="pg-lead" data-revela>
          {pecas.length} modelos e {totalCodigos} códigos com tabela técnica, da linha pesada ao nylon. Busque pelo nome,
          pela medida ou por um código, Halten ou original.
        </p>
      </header>

      <ListaProdutos pecas={pecas} inicial={q ?? ""} />

      <Rodape />
      <Revelar />
    </main>
  );
}
