import { CASCAVEL, ESTADOS } from "./brasil";

export const NOMES_UF: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AM: "Amazonas", AP: "Amapá", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
  ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MG: "Minas Gerais", MS: "Mato Grosso do Sul",
  MT: "Mato Grosso", PA: "Pará", PB: "Paraíba", PE: "Pernambuco", PI: "Piauí", PR: "Paraná",
  RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RO: "Rondônia", RR: "Roraima", RS: "Rio Grande do Sul",
  SC: "Santa Catarina", SE: "Sergipe", SP: "São Paulo", TO: "Tocantins",
};

// Rótulos do litoral saem para o mar, com linha de chamada (os estados são pequenos demais).
export const ROTULO_DESLOCADO: Record<string, [number, number]> = {
  RN: [78, -18], PB: [80, 0], PE: [84, 6], AL: [74, 22], SE: [64, 30], ES: [70, 18], RJ: [52, 40], SC: [74, 10],
};

/** Rota curva de Cascavel até o centro do estado (sempre arqueando para cima). */
export function rotaAte(uf: string) {
  const [cx, cy] = CASCAVEL;
  const [sx, sy] = ESTADOS[uf].c;
  const dx = sx - cx;
  const dy = sy - cy;
  const dist = Math.hypot(dx, dy) || 1;
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const curva = Math.min(dist * 0.28, 120);
  const qx = (cx + sx) / 2 + nx * curva;
  const qy = (cy + sy) / 2 + ny * curva;
  return { d: `M${cx} ${cy}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${sx} ${sy}`, dist };
}
