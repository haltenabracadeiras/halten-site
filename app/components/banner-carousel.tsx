"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string | null;
};

type BannerCarouselProps = {
  banners: Banner[];
};

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = window.setInterval(() => emblaApi.scrollNext(), 5000);
    return () => window.clearInterval(autoplay);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="flex w-full" style={{ aspectRatio: "1920 / 650" }}>
          {banners.map((banner) => {
            const hasText = !!(banner.title || banner.subtitle);
            const hasCta = !!(banner.cta_text && banner.cta_link);

            return (
              <div key={banner.id} className="relative min-w-full bg-[var(--ink)]" style={{ aspectRatio: "1920 / 650" }}>

                {/* Imagem limpa, sem overlay */}
                {banner.image_url && (
                  <img
                    src={banner.image_url}
                    alt={banner.title ?? "Banner"}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                )}

                {/* Overlay de texto — só renderiza se houver título ou subtítulo */}
                {(hasText || hasCta) && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, transparent 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "0 40px 52px",
                    }}
                  >
                    <div style={{ maxWidth: 680 }}>
                      {banner.title && (
                        <h2
                          className="font-sans"
                          style={{
                            fontSize: "clamp(28px, 4vw, 52px)",
                            fontWeight: 800,
                            color: "white",
                            lineHeight: 1.08,
                            letterSpacing: "-0.03em",
                            margin: 0,
                            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                          }}
                        >
                          {banner.title}
                        </h2>
                      )}

                      {banner.subtitle && (
                        <p
                          style={{
                            fontSize: "clamp(14px, 1.5vw, 17px)",
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "var(--font-mono)",
                            lineHeight: 1.6,
                            marginTop: banner.title ? 12 : 0,
                            marginBottom: 0,
                            textShadow: "0 1px 8px rgba(0,0,0,0.35)",
                          }}
                        >
                          {banner.subtitle}
                        </p>
                      )}

                      {hasCta && (
                        <Link
                          href={banner.cta_link!}
                          className="font-sans"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            marginTop: 24,
                            padding: "13px 28px",
                            borderRadius: 999,
                            background: "white",
                            color: "var(--blue)",
                            fontSize: 14,
                            fontWeight: 700,
                            textDecoration: "none",
                            letterSpacing: "0.01em",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                            transition: "opacity 0.15s ease",
                          }}
                        >
                          {banner.cta_text}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {scrollSnaps.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2.5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              style={{
                pointerEvents: "all",
                width: selectedIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: selectedIndex === index ? "white" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s ease",
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Setas — só aparecem com mais de 1 banner */}
      {scrollSnaps.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[var(--blue)] shadow-lg transition hover:bg-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[var(--blue)] shadow-lg transition hover:bg-white"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
