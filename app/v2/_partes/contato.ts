/* Endereços e contatos das páginas v2. Sem nada de servidor: pode ser importado por componente de cliente. */

/** Para onde cada link das páginas v2 leva (os antigos /xxx-v2 redirecionam para cá, ver next.config.ts). */
export const ROTAS = {
  inicio: "/",
  produtos: "/produtos",
  produto: (slug: string) => `/produtos/${slug}`,
  quemSomos: "/quem-somos",
  representantes: "/representantes",
  contato: "/contato",
  privacidade: "/politica-de-privacidade",
  /** sempre a revista ativa do admin de Links (app/catalogo/route.ts resolve qual é) */
  catalogo: "/catalogo",
  revista: (id: string) => `/catalogo/${id}?origem=site`,
};

/** Link do admin que aponta para um produto ("/produtos/x" ou URL completa do site) → página v2 do produto. */
export function rotaInterna(link: string) {
  const slug = link.match(/^\/produtos\/([^/?#]+)/)?.[1];
  return slug ? ROTAS.produto(slug) : link;
}

/* O número do WhatsApp comercial vem do admin (Configurações → Número WhatsApp):
   no servidor, getConfigSite() (lib/configuracoes.ts); nos componentes de cliente, useWhatsapp(). */

export function linkWhatsapp(numero: string, texto?: string) {
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

/** Botões "Orçamento" / "Falar no WhatsApp" do site. */
export function whatsappComercial(numero: string) {
  return linkWhatsapp(numero, "Olá, Halten! Gostaria de fazer um orçamento.");
}

/** "5545999998888" → "(45) 99999-8888"; o que não reconhecer, mostra como veio. */
export function formatarTelefone(bruto: string) {
  const d = bruto.replace(/\D/g, "");
  const local = d.startsWith("55") && d.length >= 12 ? d.slice(2) : d;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return bruto;
}

export const CONTATO = {
  telefone: "(45) 3197-2130",
  telefoneLink: "tel:+554531972130",
  email: "contato@halten.ind.br",
  endereco: "R. Alba Vieira, 653",
  bairro: "Cataratas",
  cidade: "Cascavel/PR",
  cep: "85818-630",
  cnpj: "43.453.407/0001-87",
  razao: "Halten Indústria e Comércio Ltda.",
  horario: "Seg – Sex · 08:00 às 18:00",
  mapa: "https://maps.google.com/?q=R.+Alba+Vieira+653+Cascavel+PR",
  rota: "https://www.google.com/maps/dir/?api=1&destination=R.+Alba+Vieira+653+Cascavel+PR",
};
