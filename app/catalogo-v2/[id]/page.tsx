import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { Flipbook } from "../../catalogo/[id]/Flipbook";
import { fileVersion } from "../../catalogo/[id]/version";
import { ROTAS } from "../../v2/_partes/contato";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo — Halten Abraçadeiras (prévia v2)",
  robots: { index: false, follow: false },
};

/**
 * O mesmo leitor da revista do catálogo, no asfalto da v2 e voltando para o site.
 * Prévia: não conta clique (a /catalogo/[id] atual continua contando).
 */
export default async function CatalogoV2Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: link } = await getSupabaseAdmin().from("links").select("id, title, url").eq("id", id).single();
  if (!link?.url) notFound();

  return (
    <Flipbook
      fileUrl={`/catalogo/${id}/file?v=${fileVersion(link.url)}`}
      title={link.title ?? "Catálogo"}
      voltar={ROTAS.inicio}
      fundo="radial-gradient(ellipse 70% 60% at 50% 0%, #1a2129 0%, #090c0f 72%)"
    />
  );
}
