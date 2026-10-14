/* Topo e rodapé das páginas v2. Os links são <a> comuns (recarga completa) para o motor de rolagem
   da home (que mexe no <html> e no fundo do <body>) não vazar para as outras páginas. */
import { ROTAS, WHATSAPP_COMERCIAL } from "./contato";

/** Topo de vidro escuro das páginas v2. */
export function Topo() {
  return (
    <header className="topo" data-topo>
      <a href={ROTAS.inicio} className="topo-marca" aria-label="Halten Abraçadeiras — início">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-240-60.svg" alt="Halten Abraçadeiras" width={160} height={40} />
      </a>
      <nav className="topo-nav" aria-label="Principal">
        <a href={ROTAS.produtos}>Produtos</a>
        <a href={ROTAS.quemSomos}>Quem somos</a>
        <a href={ROTAS.representantes}>Representantes</a>
        <a href={ROTAS.catalogo}>Catálogo</a>
        <a href={ROTAS.contato}>Contato</a>
      </nav>
      <a className="topo-cta" href={WHATSAPP_COMERCIAL} target="_blank" rel="noreferrer">
        Orçamento
      </a>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-240-60.svg" alt="Halten Abraçadeiras" width={140} height={35} />
      <nav aria-label="Rodapé">
        <a href={ROTAS.inicio}>Início</a>
        <a href={ROTAS.produtos}>Produtos</a>
        <a href={ROTAS.quemSomos}>Quem somos</a>
        <a href={ROTAS.representantes}>Representantes</a>
        <a href={ROTAS.contato}>Contato</a>
        <a href="https://www.instagram.com/haltenabracadeiras/" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </nav>
      <p>© {new Date().getFullYear()} Halten Abraçadeiras · CNPJ 43.453.407/0001-87</p>
      <a
        className="rodape-credito"
        href="https://wa.me/5545991250788?text=Ol%C3%A1%20vi%20seu%20projeto%20da%20Halten%2C%20gostaria%20de%20falar%20sobre%3A"
        target="_blank"
        rel="noreferrer"
      >
        Desenvolvido por Consoli Web Designer
      </a>
    </footer>
  );
}
