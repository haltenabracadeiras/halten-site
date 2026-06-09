import { notFound } from "next/navigation";
import { BannerForm } from "../BannerForm";
import { updateBanner } from "../actions";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: banner } = await getSupabaseAdmin().from("banners").select("*").eq("id", id).single();

  if (!banner) notFound();

  const action = updateBanner.bind(null, id);

  return (
    <div style={{ padding: "var(--admin-pad)", maxWidth: 800 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Editar Banner
      </h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <BannerForm banner={banner} action={action} />
      </div>
    </div>
  );
}
