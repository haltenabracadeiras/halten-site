import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { criarCinta, type Cinta } from "./cinta";

gsap.registerPlugin(ScrollTrigger);

const limitar = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const suave = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const mm = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type Medidor = { min: number; max: number };

function q<T extends Element = HTMLElement>(raiz: ParentNode, sel: string) {
  return raiz.querySelector(sel) as T;
}
function qq<T extends Element = HTMLElement>(raiz: ParentNode, sel: string) {
  return Array.from(raiz.querySelectorAll(sel)) as T[];
}

/** Embaralha os dígitos de um texto e assenta da esquerda para a direita (leitura de instrumento). */
function embaralhar(el: HTMLElement, final: string) {
  gsap.killTweensOf(el);
  const prog = { t: 0 };
  gsap.to(prog, {
    t: 1,
    duration: 0.42,
    ease: "none",
    onUpdate: () => {
      const corte = Math.floor(final.length * prog.t);
      let s = "";
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        s += i < corte || !/\d/.test(c) ? c : String(Math.floor(Math.random() * 10));
      }
      el.textContent = s;
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/* ───────────── 1 · O aperto ───────────── */

function cenaAperto(raiz: HTMLElement, medidor: Medidor, reduzido: boolean) {
  const secao = q(raiz, "#aperto");
  const alvo = q(secao, "[data-alvo]");
  const titulo = q(secao, ".aperto-titulo");
  const letras = qq(titulo, ".letra");
  const svg = q<SVGSVGElement>(secao, "[data-cinta]");
  const valor = q(secao, "[data-medidor-valor]");
  const estado = q(secao, "[data-medidor-estado]");
  const medidorEl = q(secao, "[data-medidor]");
  const pe = q(secao, "[data-aperto-pe]");
  const rotulo = q(secao, "[data-intro]");

  const opcoes = () => {
    const sw = limitar(window.innerWidth * 0.0145, 10, 24);
    const celular = window.innerWidth < 640;
    return {
      espessura: sw,
      folga: [celular ? 24 : limitar(window.innerWidth * 0.045, 34, 84), celular ? 15 : 18] as [number, number],
      vao: [sw * 8.5, sw * 2.4] as [number, number],
      giros: 7,
    };
  };

  let cinta: Cinta = criarCinta(svg, alvo, opcoes());
  let aperto = reduzido ? 1 : 0;
  let travado = false;

  function aplicar(a: number) {
    aperto = a;
    const solta = window.innerWidth < 640 ? 106 : 125;
    titulo.style.setProperty("--wdth", lerp(solta, 66, a).toFixed(2));
    titulo.style.setProperty("--wght", lerp(780, 900, a).toFixed(0));
    const { folgaX, folgaY } = cinta.desenhar(a);
    alvo.style.setProperty("--folga-x", folgaX.toFixed(1) + "px");
    alvo.style.setProperty("--folga-y", folgaY.toFixed(1) + "px");
    if (!travado) valor.textContent = mm(lerp(medidor.max, medidor.min, a));
  }

  function travar(animar: boolean) {
    if (travado) return;
    travado = true;
    valor.textContent = mm(medidor.min);
    estado.textContent = "travada";
    medidorEl.classList.add("travado");
    if (animar) {
      cinta.brilhar();
      gsap.fromTo(alvo, { x: -5 }, { x: 0, duration: 0.6, ease: "elastic.out(1.1, 0.25)" });
      gsap.fromTo(estado, { scale: 1.25 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
      gsap.fromTo(
        letras,
        { scaleY: 0.9 },
        { scaleY: 1, duration: 0.5, ease: "back.out(4)", stagger: { each: 0.012, from: "center" }, transformOrigin: "50% 100%" },
      );
    }
  }

  function destravar() {
    if (!travado) return;
    travado = false;
    estado.textContent = "solta";
    medidorEl.classList.remove("travado");
  }

  const refazer = () => {
    cinta.destruir();
    cinta = criarCinta(svg, alvo, opcoes());
    aplicar(aperto);
  };
  ScrollTrigger.addEventListener("refreshInit", refazer);

  if (reduzido) {
    aplicar(1);
    travar(false);
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", refazer);
      cinta.destruir();
    };
  }

  aplicar(0);

  // Entrada: letras caem pesadas, a cinta se desenha, o tucho encaixa.
  gsap.set(pe, { autoAlpha: 0, y: 28 });
  const intro = gsap.timeline({ delay: 0.12 });
  intro
    .from(rotulo, { autoAlpha: 0, y: 10, duration: 0.6, ease: "power2.out" }, 0)
    .from(letras, { yPercent: -55, autoAlpha: 0, scaleY: 1.5, duration: 0.5, ease: "power3.in", stagger: 0.035 }, 0.1)
    .fromTo(titulo, { y: 6 }, { y: 0, duration: 0.55, ease: "elastic.out(1, 0.3)" }, ">-0.02")
    .add(cinta.intro(), "<-0.15")
    .from(medidorEl, { autoAlpha: 0, y: 12, duration: 0.5, ease: "power2.out" }, "-=0.4");

  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 1,
    ease: "none",
    scrollTrigger: { trigger: secao, start: "top top", end: "bottom bottom", scrub: 0.6 },
    onUpdate: () => {
      const p = proxy.p;
      const a = suave(limitar(p / 0.6));
      aplicar(a);
      if (p >= 0.6) travar(true);
      else if (p < 0.56) destravar();
      const k = limitar((p - 0.64) / 0.2);
      gsap.set(pe, { autoAlpha: k, y: 28 * (1 - k) });
    },
  });

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", refazer);
    cinta.destruir();
  };
}

/* ───────────── 1b · O outdoor do pátio ───────────── */

const OUTDOOR_SEGUNDOS = 6.5; // por arte, o mesmo tempo do carrossel da home atual

function cenaOutdoor(raiz: HTMLElement, reduzido: boolean) {
  const secao = raiz.querySelector<HTMLElement>("#novidades");
  if (!secao) return;
  const outdoor = q(secao, "[data-outdoor]");
  const painel = q(secao, ".outdoor-painel");
  const slides = qq(secao, "[data-outdoor-slide]");
  const N = slides.length;

  // as luzes do pátio acendem quando o outdoor aparece, piscando como lâmpada de vapor
  let aceso = reduzido;
  if (!reduzido) gsap.set(outdoor, { "--luz": 0 });
  const acender = () => {
    aceso = true;
    gsap
      .timeline()
      .to(outdoor, { "--luz": 0.55, duration: 0.06 })
      .to(outdoor, { "--luz": 0.08, duration: 0.08 }, "+=0.06")
      .to(outdoor, { "--luz": 0.8, duration: 0.05 }, "+=0.14")
      .to(outdoor, { "--luz": 0.3, duration: 0.07 })
      .to(outdoor, { "--luz": 1, duration: 0.6, ease: "power2.out" }, "+=0.08");
  };

  // a tela real decide (e não o ScrollTrigger, que mede antes de a abertura fixa ganhar altura)
  let aoVer: (visivel: boolean) => void = () => {};
  const io = new IntersectionObserver(
    (entradas) => {
      const e = entradas[entradas.length - 1];
      if (!aceso && e.intersectionRatio >= 0.35) acender();
      aoVer(e.isIntersecting);
    },
    { threshold: [0, 0.35] },
  );
  io.observe(outdoor);

  if (N < 2) return () => io.disconnect();

  const marcas = qq<HTMLButtonElement>(secao, "[data-outdoor-ir]");
  const barras = marcas.map((m) => q(m, "i"));
  const contador = secao.querySelector<HTMLElement>("[data-outdoor-n]");
  let atual = 0;

  function marcar(i: number) {
    slides.forEach((s, j) => {
      s.toggleAttribute("inert", j !== i);
      s.setAttribute("aria-hidden", String(j !== i));
    });
    marcas.forEach((m, j) => {
      m.classList.toggle("ativo", j === i);
      m.setAttribute("aria-current", String(j === i));
    });
    if (contador) contador.textContent = String(i + 1).padStart(2, "0");
  }

  // o relógio só corre com o outdoor na tela, sem o mouse em cima, sem foco dentro e com a aba à vista
  const parado = new Set<string>(["fora"]);
  let relogio: gsap.core.Tween | null = null;

  function armar() {
    relogio?.kill();
    gsap.set(barras, { scaleX: 0 });
    if (reduzido) {
      gsap.set(barras[atual], { scaleX: 1 });
      return;
    }
    relogio = gsap.to(barras[atual], {
      scaleX: 1,
      duration: OUTDOOR_SEGUNDOS,
      ease: "none",
      paused: parado.size > 0,
      onComplete: () => ir(atual + 1, 1),
    });
  }
  const parar = (motivo: string) => {
    parado.add(motivo);
    relogio?.pause();
  };
  const seguir = (motivo: string) => {
    parado.delete(motivo);
    if (!parado.size) relogio?.resume();
  };

  // painel de rolo: a arte atual sobe e a próxima entra por baixo (voltando, o contrário)
  function ir(alvo: number, dir: number) {
    const i = (alvo + N) % N;
    if (i === atual) return;
    const velho = slides[atual];
    const novo = slides[i];
    gsap.killTweensOf([velho, novo]);
    if (reduzido) {
      gsap.set(velho, { yPercent: 100 });
      gsap.set(novo, { yPercent: 0 });
    } else {
      gsap.fromTo(novo, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.9, ease: "power3.inOut" });
      gsap.to(velho, { yPercent: -100 * dir, duration: 0.9, ease: "power3.inOut" });
    }
    atual = i;
    marcar(i);
    armar();
  }

  gsap.set(slides, { yPercent: (j: number) => (j === 0 ? 0 : 100) });
  marcar(0);
  armar();

  q(secao, "[data-outdoor-ant]").addEventListener("click", () => ir(atual - 1, -1));
  q(secao, "[data-outdoor-prox]").addEventListener("click", () => ir(atual + 1, 1));
  marcas.forEach((m, j) => m.addEventListener("click", () => ir(j, j > atual ? 1 : -1)));

  aoVer = (visivel) => (visivel ? seguir("fora") : parar("fora"));
  outdoor.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && parar("mouse"));
  outdoor.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && seguir("mouse"));
  secao.addEventListener("focusin", () => parar("foco"));
  secao.addEventListener("focusout", (e) => {
    if (!secao.contains(e.relatedTarget as Node | null)) seguir("foco");
  });
  const aba = () => (document.hidden ? parar("aba") : seguir("aba"));
  document.addEventListener("visibilitychange", aba);

  // no celular, arrastar para o lado troca a arte (e não abre o link sem querer)
  let x0 = 0;
  let y0 = 0;
  let arrastou = false;
  painel.addEventListener("pointerdown", (e) => {
    x0 = e.clientX;
    y0 = e.clientY;
    arrastou = false;
  });
  painel.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse") return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - y0) * 1.4) {
      arrastou = true;
      ir(atual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  });
  painel.addEventListener(
    "click",
    (e) => {
      if (arrastou) {
        e.preventDefault();
        arrastou = false;
      }
    },
    true,
  );

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", aba);
    relogio?.kill();
  };
}

/* ───────────── 2 · Onde trabalha ───────────── */

function quebrarPalavras(el: HTMLElement) {
  const palavras: HTMLElement[] = [];
  const percorrer = (no: Node) => {
    Array.from(no.childNodes).forEach((filho) => {
      if (filho.nodeType === Node.TEXT_NODE) {
        const partes = (filho.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        partes.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else {
            const s = document.createElement("span");
            s.className = "palavra";
            s.textContent = p;
            frag.appendChild(s);
            palavras.push(s);
          }
        });
        filho.replaceWith(frag);
      } else if (filho.nodeType === Node.ELEMENT_NODE) {
        percorrer(filho);
      }
    });
  };
  percorrer(el);
  return palavras;
}

function cenaManifesto(raiz: HTMLElement) {
  const texto = q(raiz, "[data-manifesto]");
  const palavras = quebrarPalavras(texto);
  const forcas = qq(texto, "[data-forca]");

  gsap.set(palavras, { opacity: 0.13 });
  gsap.set(forcas, { "--sub": 0 });

  gsap
    .timeline({ scrollTrigger: { trigger: texto, start: "top 80%", end: "bottom 42%", scrub: 0.5 } })
    .to(palavras, { opacity: 1, duration: 0.3, stagger: 0.12, ease: "none" });

  forcas.forEach((em) => {
    const tipo = em.dataset.forca;
    const suas = qq(em, ".palavra");
    ScrollTrigger.create({
      trigger: em,
      start: "top 56%",
      onEnter: () => {
        gsap.to(em, { "--sub": 1, duration: 0.7, ease: "power3.out" });
        if (tipo === "vibracao") {
          gsap.fromTo(suas, { x: -2.5 }, { x: 2.5, duration: 0.045, repeat: 11, yoyo: true, ease: "none", onComplete: () => gsap.set(suas, { x: 0 }) });
        } else if (tipo === "pressao") {
          gsap.fromTo(suas, { scaleY: 0.62, scaleX: 1.16, transformOrigin: "50% 92%" }, { scaleY: 1, scaleX: 1, duration: 0.9, ease: "elastic.out(1, 0.32)" });
        } else if (tipo === "calor") {
          gsap.fromTo(suas, { y: 0 }, { y: -4, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.07, ease: "sine.inOut", onComplete: () => gsap.set(suas, { y: 0 }) });
        }
      },
      onLeaveBack: () => gsap.to(em, { "--sub": 0, duration: 0.3 }),
    });
  });
}

/* ───────────── 3 · A linha (pico) ───────────── */

function cenaLinha(raiz: HTMLElement) {
  const secao = q(raiz, "#linha");
  const itens = qq(secao, ".peca");
  const N = itens.length;
  if (!N) return;
  secao.classList.add("linha-ativa");

  const nomeCaixa = q(secao, "[data-linha-nome]");
  const nomes = qq(nomeCaixa, "span");
  const faixaPortal = q(secao, "[data-linha-faixa]");
  const indice = q(secao, "[data-linha-indice]");
  const fichaCodigos = q(secao, "[data-linha-ficha-codigos]");
  const fichaPalavra = q(secao, "[data-linha-ficha-palavra]");
  const fichaLink = q<HTMLAnchorElement>(secao, "[data-linha-link]");
  const selo = q(secao, "[data-linha-selo]");
  const fita = q(secao, ".esteira-fita");
  const scan = q(secao, ".portal-scan");
  const rolos = qq(secao, ".esteira-rolo");
  const marcas = qq<HTMLButtonElement>(secao, "[data-linha-ir]");

  const dados = itens.map((li) => ({
    nome: li.dataset.nome ?? "",
    faixa: li.dataset.faixa || "—",
    codigos: li.dataset.codigos ?? "",
    href: li.querySelector("a")?.getAttribute("href") ?? "#",
    lancamento: li.hasAttribute("data-lancamento"),
  }));

  // esteira indexada: anda, para no portal, anda de novo
  const INI = 0.035;
  const FAIXA = 0.93;
  const cDe = (p: number) => {
    const u = limitar((p - INI) / FAIXA) * (N - 1);
    const k = Math.floor(u);
    if (k >= N - 1) return N - 1;
    const f = u - k;
    const anda = f < 0.28 ? 0 : f > 0.82 ? 1 : suave((f - 0.28) / 0.54);
    return k + anda;
  };
  const pDe = (i: number) => INI + ((i + 0.02) / (N - 1)) * FAIXA;

  let atual = -1;
  let visivel = 0; // qual dos dois spans de nome está à mostra

  function ajustarNome(span: HTMLElement) {
    span.style.fontSize = "";
    const max = nomeCaixa.clientWidth;
    const w = span.scrollWidth;
    if (w > max && w > 0) {
      const base = parseFloat(getComputedStyle(span).fontSize);
      span.style.fontSize = Math.floor(base * (max / w) * 0.98) + "px";
    }
  }

  function trocar(i: number, animar: boolean) {
    if (i === atual) return;
    const dir = i > atual ? 1 : -1;
    const velho = nomes[visivel];
    visivel = 1 - visivel;
    const novo = nomes[visivel];
    novo.textContent = dados[i].nome;
    ajustarNome(novo);
    atual = i;
    indice.textContent = String(i + 1).padStart(2, "0");
    fichaCodigos.textContent = dados[i].codigos;
    if (fichaPalavra) fichaPalavra.textContent = dados[i].codigos === "1" ? "código" : "códigos";
    fichaLink.href = dados[i].href;
    fichaLink.setAttribute("aria-label", `Tabela técnica — ${dados[i].nome}`);
    marcas.forEach((m, j) => m.classList.toggle("ativo", j === i));
    selo?.classList.toggle("ligado", dados[i].lancamento);
    if (animar) {
      gsap.killTweensOf([velho, novo]);
      gsap.fromTo(novo, { yPercent: 105 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" });
      gsap.to(velho, { yPercent: -105 * dir, autoAlpha: 0, duration: 0.4, ease: "power3.in" });
      embaralhar(faixaPortal, dados[i].faixa);
      embaralhar(fichaCodigos, dados[i].codigos);
      if (scan) gsap.fromTo(scan, { yPercent: 0, autoAlpha: 1 }, { yPercent: 100, autoAlpha: 0, duration: 0.75, ease: "power2.inOut" });
    } else {
      gsap.set(novo, { yPercent: 0, autoAlpha: 1 });
      gsap.set(velho, { autoAlpha: 0 });
      faixaPortal.textContent = dados[i].faixa;
    }
  }

  let passo = 0;
  let raioRolo = 10;
  const medir = () => {
    passo = window.innerWidth < 640 ? window.innerWidth * 0.6 : limitar(window.innerWidth * 0.3, 300, 520);
    raioRolo = (rolos[0]?.offsetWidth ?? 20) / 2;
  };
  medir();
  ScrollTrigger.addEventListener("refreshInit", medir);

  function render(c: number) {
    for (let i = 0; i < N; i++) {
      const li = itens[i];
      const d = i - c;
      const ad = Math.abs(d);
      if (ad > 3.4) {
        if (li.style.visibility !== "hidden") li.style.visibility = "hidden";
        continue;
      }
      if (li.style.visibility) li.style.visibility = "";
      const s = ad < 1 ? lerp(1, 0.5, ad) : lerp(0.5, 0.36, limitar(ad - 1));
      const o = ad < 1 ? lerp(1, 0.5, ad) : lerp(0.5, 0, limitar((ad - 1) / 2.2));
      const giro = limitar(-d * 16, -26, 26);
      li.style.transform = `translate3d(${(d * passo).toFixed(1)}px,0,0) rotate(${giro.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      li.style.opacity = o.toFixed(3);
      li.classList.toggle("no-portal", ad < 0.35);
    }
    const desloc = c * passo;
    fita.style.transform = `translate3d(${(-(desloc % 52)).toFixed(1)}px,0,0)`;
    const giroRolo = (desloc / (2 * Math.PI * raioRolo)) * 360;
    for (const r of rolos) r.style.transform = `rotate(${giroRolo.toFixed(1)}deg)`;
    const i = Math.round(c);
    if (i !== atual) trocar(i, atual !== -1);
  }

  trocar(0, false);
  render(0);

  const proxy = { p: 0 };
  const st = gsap.to(proxy, {
    p: 1,
    ease: "none",
    scrollTrigger: { trigger: secao, start: "top top", end: "bottom bottom", scrub: 0.55 },
    onUpdate: () => render(cDe(proxy.p)),
  }).scrollTrigger!;

  marcas.forEach((m, i) =>
    m.addEventListener("click", () => {
      const y = st.start + pDe(i) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: "smooth" });
    }),
  );

  // a luz do portal acende quando a cena prende
  gsap.from(q(secao, ".linha-luz"), {
    opacity: 0,
    scrollTrigger: { trigger: secao, start: "top 60%", end: "top top", scrub: true },
  });

  return () => ScrollTrigger.removeEventListener("refreshInit", medir);
}

/* ───────────── 4 · A placa (inclina com o ponteiro, reflexo acompanha) ───────────── */

function cenaPlaca(raiz: HTMLElement) {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const placa = q(raiz, "[data-placa]");
  const area = placa.parentElement as HTMLElement;
  gsap.set(placa, { transformPerspective: 900 });
  const rx = gsap.quickTo(placa, "rotationX", { duration: 0.7, ease: "power3" });
  const ry = gsap.quickTo(placa, "rotationY", { duration: 0.7, ease: "power3" });
  const mover = (e: PointerEvent) => {
    const r = placa.getBoundingClientRect();
    const x = limitar((e.clientX - r.left) / r.width) - 0.5;
    const y = limitar((e.clientY - r.top) / r.height) - 0.5;
    ry(x * 14);
    rx(-y * 12);
    placa.style.setProperty("--luz-x", ((x + 0.5) * 100).toFixed(1) + "%");
    placa.style.setProperty("--luz-y", ((y + 0.5) * 100).toFixed(1) + "%");
  };
  const sair = () => {
    rx(0);
    ry(0);
  };
  area.addEventListener("pointermove", mover);
  area.addEventListener("pointerleave", sair);
  return () => {
    area.removeEventListener("pointermove", mover);
    area.removeEventListener("pointerleave", sair);
  };
}

/* ───────────── 5 · De Cascavel para o Brasil ───────────── */

function cenaBrasil(raiz: HTMLElement) {
  const secao = q(raiz, "#brasil");
  const mapa = q<SVGSVGElement>(secao, ".brasil-mapa");
  const rotas = qq<SVGPathElement>(secao, "[data-rota]");
  const contador = q(secao, "[data-brasil-contador]");
  const grupoRotas = q<SVGGElement>(secao, ".mapa-rotas");

  const itens = rotas.map((rota) => {
    const uf = rota.dataset.rota!;
    const L = rota.getTotalLength();
    rota.style.strokeDasharray = `${L} ${L}`;
    rota.style.strokeDashoffset = String(L);
    const caminhao = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    caminhao.setAttribute("r", "6");
    caminhao.setAttribute("class", "rota-ponta");
    caminhao.style.opacity = "0";
    grupoRotas.appendChild(caminhao);
    return {
      rota,
      L,
      caminhao,
      estado: secao.querySelector(`[data-uf="${uf}"]`) as SVGPathElement | null,
      rotulo: secao.querySelector(`[data-rotulo="${uf}"]`) as SVGGElement | null,
    };
  });

  itens.forEach((it) => {
    it.estado?.classList.add("apagado");
    it.rotulo?.classList.add("apagado");
  });
  contador.textContent = "01";

  const INI = 0.12;
  const CADA = (0.84 - INI) / Math.max(itens.length, 1);
  const DUR = CADA * 1.6;

  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 1,
    ease: "none",
    scrollTrigger: { trigger: secao, start: "top top", end: "bottom bottom", scrub: 0.6 },
    onUpdate: () => {
      const p = proxy.p;
      let acesos = 1; // o Paraná (casa) já começa aceso
      itens.forEach((it, i) => {
        const k = limitar((p - (INI + i * CADA)) / DUR);
        it.rota.style.strokeDashoffset = (it.L * (1 - k)).toFixed(1);
        if (k > 0 && k < 1) {
          const pt = it.rota.getPointAtLength(it.L * k);
          it.caminhao.setAttribute("cx", pt.x.toFixed(1));
          it.caminhao.setAttribute("cy", pt.y.toFixed(1));
          it.caminhao.style.opacity = "1";
        } else it.caminhao.style.opacity = "0";
        const aceso = k >= 1;
        it.estado?.classList.toggle("apagado", !aceso);
        it.rotulo?.classList.toggle("apagado", !aceso);
        if (aceso) acesos++;
      });
      contador.textContent = String(acesos).padStart(2, "0");
    },
  });

  gsap.from(mapa, {
    autoAlpha: 0,
    scale: 0.94,
    transformOrigin: "50% 60%",
    scrollTrigger: { trigger: secao, start: "top 75%", end: "top top", scrub: 0.6 },
  });
  gsap.from(qq(secao, ".brasil-texto > *"), {
    autoAlpha: 0,
    y: 30,
    stagger: 0.08,
    scrollTrigger: { trigger: secao, start: "top 70%", end: "top 5%", scrub: 0.6 },
  });
}

/* ───────────── 6 · No bolso ───────────── */

function cenaApp(raiz: HTMLElement) {
  const secao = q(raiz, "#app");
  const celular = q(secao, "[data-celular]");
  const telas = qq(secao, "[data-tela]");
  const largo = window.matchMedia("(min-width: 961px)").matches;

  gsap.set(telas.slice(1), { yPercent: 100 });
  const tl = gsap.timeline({
    scrollTrigger: largo
      ? { trigger: secao, start: "top 20%", end: "bottom 80%", scrub: 0.6 }
      : { trigger: celular, start: "top 75%", end: "bottom 15%", scrub: 0.6 },
  });
  telas.slice(1).forEach((t, i) => {
    tl.to(t, { yPercent: 0, duration: 1, ease: "power2.inOut" }, i * 1.5).to(
      telas[i],
      { yPercent: -30, opacity: 0, duration: 1, ease: "power2.inOut" },
      "<",
    );
  });

  gsap.from(celular, {
    y: 90,
    rotation: -7,
    scrollTrigger: { trigger: secao, start: "top 95%", end: "top 25%", scrub: 0.7 },
  });
}

/* ───────────── 7 · Fechamento ───────────── */

function cenaFim(raiz: HTMLElement, reduzido: boolean) {
  const alvo = q(raiz, "[data-fim-alvo]");
  const svg = q<SVGSVGElement>(raiz, "[data-cinta-fim]");
  const botao = q(raiz, "[data-fim-botao]");
  const opcoes = () => {
    const sw = limitar(window.innerWidth * 0.0075, 7, 11);
    return { espessura: sw, folga: [70, 12] as [number, number], vao: [sw * 10, sw * 2.6] as [number, number], giros: 5 };
  };
  let cinta = criarCinta(svg, alvo, opcoes());
  let a = reduzido ? 1 : 0;
  let travado = false;
  const aplicar = () => cinta.desenhar(a);
  const refazer = () => {
    cinta.destruir();
    cinta = criarCinta(svg, alvo, opcoes());
    aplicar();
  };
  ScrollTrigger.addEventListener("refreshInit", refazer);

  if (reduzido) {
    aplicar();
    botao.classList.add("travado");
  } else {
    const proxy = { a: 0 };
    gsap.to(proxy, {
      a: 1,
      ease: "power1.inOut",
      scrollTrigger: { trigger: alvo, start: "top 96%", end: "top 64%", scrub: 0.6 },
      onUpdate: () => {
        a = proxy.a;
        aplicar();
        if (a > 0.995 && !travado) {
          travado = true;
          botao.classList.add("travado");
          cinta.brilhar();
          gsap.fromTo(alvo, { x: -4 }, { x: 0, duration: 0.55, ease: "elastic.out(1.1, 0.25)" });
        } else if (a < 0.97 && travado) {
          travado = false;
          botao.classList.remove("travado");
        }
      },
    });
  }

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", refazer);
    cinta.destruir();
  };
}

/* ───────────── Topo ───────────── */

function topo(raiz: HTMLElement) {
  const t = q(raiz, "[data-topo]");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      t.classList.toggle("oculto", self.direction === 1 && y > 240);
      t.classList.toggle("rolou", y > 40);
    },
  });
}

/* ───────────── Orquestra ───────────── */

export function iniciarV2(raiz: HTMLElement, medidor: Medidor) {
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;
  const limpezas: (() => void)[] = [];
  let vivo = true;

  const ctx = gsap.context(() => {
    const fim = cenaAperto(raiz, medidor, reduzido);
    if (fim) limpezas.push(fim);
  }, raiz);
  html.classList.add("v2-js");

  // O motor da skill (cenas fixas, revelações, contadores, fundo que viaja, paralaxe) carrega depois;
  // as cenas com rolagem só nascem quando ele já definiu a altura das cenas fixas.
  const motor = document.createElement("script");
  motor.src = "/v2/sites-incriveis.js";
  motor.async = true;
  motor.onload = () => {
    if (!vivo) return;
    ctx.add(() => {
      // depois do motor: a posição do outdoor depende da altura da abertura fixa
      const o = cenaOutdoor(raiz, reduzido);
      if (o) limpezas.push(o);
      if (!reduzido) {
        cenaManifesto(raiz);
        const l = cenaLinha(raiz);
        if (l) limpezas.push(l);
        const pl = cenaPlaca(raiz);
        if (pl) limpezas.push(pl);
        cenaBrasil(raiz);
        cenaApp(raiz);
      }
      limpezas.push(cenaFim(raiz, reduzido));
      topo(raiz);
    });
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => vivo && ScrollTrigger.refresh());
  };
  document.body.appendChild(motor);

  return () => {
    vivo = false;
    limpezas.forEach((f) => f());
    ctx.revert();
    motor.remove();
    // o motor marca o <html>; ao sair da v2 nada disso pode ficar para as outras páginas
    html.classList.remove("v2-js", "fx-pronto", "fx-fundo-ativo", "fx-reduzido");
    html.style.removeProperty("--fx-fundo");
    html.style.removeProperty("--fx-tinta");
  };
}
