import { AboutSection } from "./components/about-section";
import { AppSection } from "./components/app-section";
import { CatalogSection } from "./components/catalog-section";
import { CtaBand } from "./components/cta-band";
import { Footer } from "./components/footer";
import HeroSection from "./components/hero-section";
import { MarqueeSection } from "./components/marquee-section";
import { Navbar } from "./components/navbar";
import ProductsSection from "./components/products-section";
export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <ProductsSection />
      <AboutSection />
      <AppSection />
      <CatalogSection />
      <CtaBand />
      <Footer />
    </main>
  );
}
