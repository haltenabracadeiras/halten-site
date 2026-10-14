/**
 * A cinta: uma abraçadeira tipo tucho (T-bolt) desenhada em SVG em volta de um elemento.
 * aperto 0 = solta (folga grande, vão aberto entre os olhais)
 * aperto 1 = travada (encostada, vão fechado, porca girou N voltas, parafuso sobrando)
 */
import gsap from "gsap";

const NS = "http://www.w3.org/2000/svg";

type Atributos = Record<string, string | number>;

function criar<K extends keyof SVGElementTagNameMap>(tag: K, atributos: Atributos, pai: Element) {
  const el = document.createElementNS(NS, tag);
  for (const k in atributos) el.setAttribute(k, String(atributos[k]));
  pai.appendChild(el);
  return el;
}

function attr(el: Element, atributos: Atributos) {
  for (const k in atributos) el.setAttribute(k, String(atributos[k]));
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sair = (t: number) => 1 - Math.pow(1 - t, 2);

export type OpcoesCinta = {
  espessura: number; // largura da fita em px
  folga: [number, number]; // distância fita ↔ conteúdo: solta, travada
  vao: [number, number]; // distância entre as pontas da fita: solta, travada
  giros: number; // voltas da porca do começo ao fim do aperto
};

export type Cinta = {
  desenhar(aperto: number): { folgaX: number; folgaY: number };
  intro(): gsap.core.Timeline;
  brilhar(): void;
  destruir(): void;
};

/** Faces visíveis de um sextavado girando em torno do eixo do parafuso (vista lateral). */
function sextavado(faces: SVGRectElement[], x: number, largura: number, cy: number, raio: number, giro: number) {
  const visiveis: { topo: number; altura: number; luz: number }[] = [];
  for (let k = 0; k < 6; k++) {
    const a1 = giro + (k * Math.PI) / 3;
    const a2 = a1 + Math.PI / 3;
    const normal = a1 + Math.PI / 6;
    const frente = Math.sin(normal);
    if (frente <= 0.001) continue;
    const y1 = cy - raio * Math.cos(a1);
    const y2 = cy - raio * Math.cos(a2);
    const cima = Math.cos(normal); // 1 = face virada para cima (pega a luz)
    visiveis.push({ topo: Math.min(y1, y2), altura: Math.abs(y2 - y1), luz: 0.3 + 0.45 * (cima * 0.5 + 0.5) + 0.25 * frente });
  }
  faces.forEach((f, i) => {
    const v = visiveis[i];
    if (!v) {
      f.setAttribute("height", "0");
      return;
    }
    const g = Math.round(60 + 170 * Math.min(1, v.luz));
    attr(f, { x, width: largura, y: v.topo, height: Math.max(0.4, v.altura), fill: `rgb(${g - 8},${g},${g + 7})` });
  });
}

export function criarCinta(svg: SVGSVGElement, alvo: HTMLElement, op: OpcoesCinta): Cinta {
  const sw = op.espessura;
  svg.innerHTML = "";

  const id = "m" + Math.random().toString(36).slice(2, 8);
  const defs = criar("defs", {}, svg);
  const mascara = criar("mask", { id, maskUnits: "userSpaceOnUse", x: -4000, y: -4000, width: 8000, height: 8000 }, defs);
  const mascaraTraco = criar("path", { fill: "none", stroke: "#fff", "stroke-width": sw * 4, "stroke-linecap": "round" }, mascara);

  const raiz = criar("g", {}, svg);
  const fitaG = criar("g", {}, raiz);
  const sombra = criar("path", { fill: "none", stroke: "rgba(0,0,0,0.55)", "stroke-width": sw + 7, transform: "translate(0 6)" }, fitaG);
  const borda = criar("path", { fill: "none", stroke: "#262E35", "stroke-width": sw + 2 }, fitaG);
  const fita = criar("path", { fill: "none", stroke: "url(#v2-aco)", "stroke-width": sw }, fitaG);
  const lustro = criar("path", { fill: "none", stroke: "rgba(255,255,255,0.6)", "stroke-width": Math.max(1, sw * 0.14), transform: `translate(0 ${-sw * 0.22})` }, fitaG);
  const marcas = criar(
    "path",
    { fill: "none", stroke: "rgba(24,30,36,0.5)", "stroke-width": sw * 0.38, "stroke-dasharray": `1.1 ${(sw * 1.15).toFixed(2)}` },
    fitaG,
  );
  const brilho = criar("path", { fill: "none", stroke: "#ffffff", "stroke-width": sw * 0.42, "stroke-linecap": "round", opacity: 0 }, fitaG);

  // Conjunto do tucho (T-bolt) no topo
  const tucho = criar("g", {}, raiz);
  const parafuso = criar("rect", { fill: "url(#v2-rosca)", stroke: "#2A3239", "stroke-width": 0.8 }, tucho);
  const cabeca = [0, 1, 2].map(() => criar("rect", { stroke: "#1E252B", "stroke-width": 0.8 }, tucho));
  const olhalE = criar("rect", { fill: "url(#v2-aco-peca)", stroke: "#262E35", "stroke-width": 1 }, tucho);
  const olhalD = criar("rect", { fill: "url(#v2-aco-peca)", stroke: "#262E35", "stroke-width": 1 }, tucho);
  const furoE = criar("rect", { fill: "rgba(20,25,30,0.55)" }, tucho);
  const furoD = criar("rect", { fill: "rgba(20,25,30,0.55)" }, tucho);
  const porca = [0, 1, 2].map(() => criar("rect", { stroke: "#1E252B", "stroke-width": 0.8 }, tucho));

  const caminhos = [sombra, borda, fita, lustro, marcas, brilho, mascaraTraco];

  const ow = sw * 1.6; // olhal: largura
  const oh = sw * 2.7; // olhal: altura
  const hw = sw * 1.05; // cabeça do parafuso
  const nw = sw * 1.25; // porca
  const raioSext = sw * 1.12;
  const bh = sw * 0.7; // diâmetro do parafuso
  // comprimento fixo do parafuso: com a cinta solta ele mal passa da porca
  const comprimento = op.vao[0] + 1.7 * ow + 0.5 * hw + nw + 0.7 * sw;

  let ultimo = 0;

  function desenhar(aperto: number) {
    ultimo = aperto;
    const w = alvo.offsetWidth;
    const h = alvo.offsetHeight;
    const folgaX = lerp(op.folga[0], op.folga[1], aperto);
    const folgaY = folgaX * 0.8;
    const x0 = -folgaX;
    const y0 = -folgaY;
    const W = w + 2 * folgaX;
    const H = h + 2 * folgaY;
    const r = Math.min(H * 0.34, W * 0.18, sw * 6.5);
    const cx = w / 2;
    const vao = lerp(op.vao[0], op.vao[1], sair(aperto));

    const d =
      `M${(cx + vao / 2).toFixed(2)} ${y0.toFixed(2)}` +
      `H${(x0 + W - r).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x0 + W).toFixed(2)} ${(y0 + r).toFixed(2)}` +
      `V${(y0 + H - r).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x0 + W - r).toFixed(2)} ${(y0 + H).toFixed(2)}` +
      `H${(x0 + r).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x0.toFixed(2)} ${(y0 + H - r).toFixed(2)}` +
      `V${(y0 + r).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(x0 + r).toFixed(2)} ${y0.toFixed(2)}` +
      `H${(cx - vao / 2).toFixed(2)}`;
    for (const c of caminhos) c.setAttribute("d", d);
    marcas.setAttribute("stroke-dashoffset", (-aperto * sw * 16).toFixed(2));

    // tucho
    const by = y0 - sw * 0.15; // eixo do parafuso
    const xE = cx - vao / 2; // ponta esquerda da fita
    const xD = cx + vao / 2; // ponta direita
    const oEx = xE - ow * 0.85;
    const oDx = xD - ow * 0.15;
    attr(olhalE, { x: oEx, y: by - oh / 2, width: ow, height: oh, rx: sw * 0.32 });
    attr(olhalD, { x: oDx, y: by - oh / 2, width: ow, height: oh, rx: sw * 0.32 });
    attr(furoE, { x: oEx + ow * 0.2, y: by - bh * 0.2, width: ow * 0.6, height: bh * 0.4 });
    attr(furoD, { x: oDx + ow * 0.2, y: by - bh * 0.2, width: ow * 0.6, height: bh * 0.4 });

    const cabecaX = oEx - hw;
    attr(parafuso, { x: cabecaX + hw * 0.5, y: by - bh / 2, width: comprimento, height: bh, rx: bh * 0.2 });
    sextavado(cabeca, cabecaX, hw, by, raioSext * 0.94, 0.42);
    const porcaX = oDx + ow;
    sextavado(porca, porcaX, nw, by, raioSext, aperto * op.giros * Math.PI * 2);

    return { folgaX, folgaY };
  }

  function intro() {
    const L = fita.getTotalLength();
    fitaG.setAttribute("mask", `url(#${id})`);
    mascaraTraco.setAttribute("stroke-dasharray", `${L} ${L}`);
    const tl = gsap.timeline({
      onComplete: () => {
        fitaG.removeAttribute("mask");
        mascaraTraco.removeAttribute("stroke-dasharray");
      },
    });
    tl.fromTo(mascaraTraco, { attr: { "stroke-dashoffset": L } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.15, ease: "power3.inOut" });
    tl.from(tucho, { opacity: 0, y: -sw * 1.5, duration: 0.45, ease: "back.out(2)" }, "-=0.35");
    return tl;
  }

  function brilhar() {
    const L = fita.getTotalLength();
    gsap.killTweensOf(brilho);
    attr(brilho, { "stroke-dasharray": `${sw * 5} ${L}`, "stroke-dashoffset": 0 });
    gsap.fromTo(brilho, { opacity: 0.9 }, { opacity: 0, duration: 0.9, ease: "power2.in" });
    gsap.fromTo(brilho, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -L * 0.55 }, duration: 0.9, ease: "power2.out" });
  }

  desenhar(ultimo);

  return {
    desenhar,
    intro,
    brilhar,
    destruir() {
      gsap.killTweensOf([brilho, mascaraTraco, tucho]);
      svg.innerHTML = "";
    },
  };
}
