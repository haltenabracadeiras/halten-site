import BannerCarousel from "./banner-carousel";
import { getSupabaseAdmin } from "../../lib/supabase";

type BannerRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string | null;
};

async function getActiveBanners() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("banners")
    .select("id,title,subtitle,cta_text,cta_link,image_url")
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Supabase error fetching banners:", error.message);
    return [];
  }

  return (data ?? []) as BannerRow[];
}

export default async function HeroSection() {
  const banners = await getActiveBanners();
  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: "placeholder",
            title: "Halten Abraçadeiras",
            subtitle: "Soluções em fixação industrial com excelência",
            cta_text: "Ver produtos",
            cta_link: "/produtos",
            image_url: null,
          },
        ];

  return (
    <section className="relative">
      <BannerCarousel banners={slides} />
    </section>
  );
}
