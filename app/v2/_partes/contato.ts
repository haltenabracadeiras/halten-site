/* Endereços e contatos das páginas v2. Sem nada de servidor: pode ser importado por componente de cliente. */

/** Para onde cada link das páginas v2 leva (os antigos /xxx-v2 redirecionam para cá, ver next.config.ts). */
export const ROTAS = {
  inicio: "/",
  produtos: "/produtos",
  produto: (slug: string) => `/produtos/${slug}`,
  quemSomos: "/quem-somos",
  representantes: "/representantes",
  contato: "/contato",
  /** sempre a revista ativa do admin de Links (app/catalogo/route.ts resolve qual é) */
  catalogo: "/catalogo",
  revista: (id: string) => `/catalogo/${id}?origem=site`,
};

/** Link do admin que aponta para um produto ("/produtos/x" ou URL completa do site) → página v2 do produto. */
export function rotaInterna(link: string) {
  const slug = link.match(/^\/produtos\/([^/?#]+)/)?.[1];
  return slug ? ROTAS.produto(slug) : link;
}

export const WHATSAPP_NUMERO = "5545991517308";

export function linkWhatsapp(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export const WHATSAPP_COMERCIAL = linkWhatsapp(WHATSAPP_NUMERO, "Olá, Halten! Gostaria de fazer um orçamento.");

export const CONTATO = {
  whatsapp: "(45) 99151-7308",
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
