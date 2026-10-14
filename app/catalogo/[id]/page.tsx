import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { Flipbook } from "./Flipbook";
import { fileVersion } from "./version";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getSupabaseAdmin().from("links").select("title").eq("id", id).single();
  return { title: data?.title ? `${data.title} — Halten` : "Catálogo — Halten" };
}

export default async function CatalogoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ origem?: string }>;
}) {
  const [{ id }, { origem }] = await Promise.all([params, searchParams]);
  const db = getSupabaseAdmin();

  const { data: link } = await db.from("links").select("id, title, url").eq("id", id).single();
  if (!link?.url) notFound();

  // Conta o clique (mesma métrica do botão na /links)
  await db.rpc("increment_link_clicks", { link_id: id });

  // aberta pelo menu do site: fundo da v2 e o X volta para o site; pela /links, fica como sempre foi
  const doSite = origem === "site";

  return (
    <Flipbook
      fileUrl={`/catalogo/${id}/file?v=${fileVersion(link.url)}`}
      title={link.title ?? "Catálogo"}
      {...(doSite ? { voltar: "/", fundo: "radial-gradient(ellipse 70% 60% at 50% 0%, #1a2129 0%, #090c0f 72%)" } : {})}
    />
  );
}
