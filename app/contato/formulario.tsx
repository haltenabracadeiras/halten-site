"use client";

import { useState, type FormEvent } from "react";
import { linkWhatsapp } from "../v2/_partes/contato";
import { useWhatsapp } from "../components/config-site";
import { rastrearCliqueWhatsapp } from "../components/rastreamento";

/** Como no site atual: o formulário monta a mensagem e abre o WhatsApp comercial (nada é guardado). */
export function Formulario() {
  const whatsapp = useWhatsapp();
  const [f, setF] = useState({ nome: "", empresa: "", email: "", telefone: "", mensagem: "" });
  const mudar = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  function enviar(e: FormEvent) {
    e.preventDefault();
    const linhas = [
      `Olá! Meu nome é *${f.nome.trim()}*${f.empresa.trim() ? `, da ${f.empresa.trim()}` : ""}.`,
      "",
      f.mensagem.trim(),
      "",
      `E-mail: ${f.email.trim()}`,
    ];
    if (f.telefone.trim()) linhas.push(`Telefone: ${f.telefone.trim()}`);
    const url = linkWhatsapp(whatsapp, linhas.join("\n"));
    rastrearCliqueWhatsapp(url);
    window.open(url, "_blank", "noopener");
  }

  return (
    <form className="cf" onSubmit={enviar}>
      <p className="cf-titulo">Escreva sua mensagem</p>
      <div className="cf-linha">
        <label className="cf-campo">
          <span>Nome *</span>
          <input required value={f.nome} onChange={mudar("nome")} autoComplete="name" />
        </label>
        <label className="cf-campo">
          <span>Empresa</span>
          <input value={f.empresa} onChange={mudar("empresa")} autoComplete="organization" />
        </label>
      </div>
      <div className="cf-linha">
        <label className="cf-campo">
          <span>E-mail *</span>
          <input required type="email" value={f.email} onChange={mudar("email")} autoComplete="email" />
        </label>
        <label className="cf-campo">
          <span>Telefone</span>
          <input type="tel" inputMode="tel" value={f.telefone} onChange={mudar("telefone")} autoComplete="tel" placeholder="(00) 00000-0000" />
        </label>
      </div>
      <label className="cf-campo">
        <span>Mensagem *</span>
        <textarea
          required
          rows={5}
          value={f.mensagem}
          onChange={mudar("mensagem")}
          placeholder="Ex.: preciso de 200 unidades do código TCH7783"
        />
      </label>
      <button type="submit" className="botao cf-enviar">
        Enviar pelo WhatsApp
      </button>
      <p className="cf-nota">A mensagem abre pronta no WhatsApp comercial. É só confirmar o envio.</p>
    </form>
  );
}
