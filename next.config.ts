import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async redirects() {
    return [
      // as prévias da v2 viraram as páginas oficiais: link antigo de prévia não quebra
      { source: "/v2", destination: "/", permanent: true },
      { source: "/produtos-v2", destination: "/produtos", permanent: true },
      { source: "/produtos-v2/:slug", destination: "/produtos/:slug", permanent: true },
      { source: "/contato-v2", destination: "/contato", permanent: true },
      { source: "/quem-somos-v2", destination: "/quem-somos", permanent: true },
      { source: "/representantes-v2", destination: "/representantes", permanent: true },
      { source: "/catalogo-v2/:id", destination: "/catalogo/:id?origem=site", permanent: true },
      // a localização agora fica na página de contato
      { source: "/localizacao", destination: "/contato", permanent: true },
    ];
  },
};

export default nextConfig;
