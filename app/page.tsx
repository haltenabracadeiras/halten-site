import { AboutSection } from "./components/about-section";
import { AppSection } from "./components/app-section";
import { CatalogSection } from "./components/catalog-section";
import { ContactSection } from "./components/contact-section";
import { Footer } from "./components/footer";
import HeroSection from "./components/hero-section";
import { LocationSection } from "./components/location-section";
import { Navbar } from "./components/navbar";
import ProductsSection from "./components/products-section";
import { StatsBar } from "./components/stats-bar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]" style={{ paddingTop: 80 }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ProductsSection />
      <AboutSection />
      <LocationSection />
      <ContactSection />
      <AppSection />
      <CatalogSection />
      <Footer />
    </main>
  );
}
