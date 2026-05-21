import { getSupabaseAdmin } from "../../lib/supabase";
import { HeroCarousel, AdminBanner } from "./hero-carousel";

async function getActiveBanners(): Promise<AdminBanner[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("banners")
      .select("id,title,subtitle,cta_text,cta_link,image_url")
      .eq("active", true)
      .order("position", { ascending: true });

    if (error) return [];
    return (data ?? []) as AdminBanner[];
  } catch {
    return [];
  }
}

export default async function HeroSection() {
  const adminBanners = await getActiveBanners();
  return <HeroCarousel adminBanners={adminBanners} />;
}
