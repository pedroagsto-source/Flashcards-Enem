// ============================================================================
// WORKFLOW 3 — NINGUÉM NO VÁCUO (alerta de quem está esperando resposta)
//
// Gatilho: Schedule → Cron "*/30 8-19 * * 1-6", fuso America/Sao_Paulo
// (a cada 30 min, segunda a sábado, das 8h às 19h).
//
// Manda um e-mail (para o e-mail da sua conta Pipedream) só quando tiver
// alguém passando do limite. Os limites ficam nas constantes abaixo.
//
// Variáveis de ambiente: NOTION_DB_ID
// ============================================================================
const LIMITE_MIN = { Urgente: 30, Alta: 120, Normal: 240, Baixa: 24 * 60 };
const JANELA_ALERTA_H = 20; // avisa quando faltar pouco para fechar a janela de 24h
const TZ = "America/Sao_Paulo";

export default defineComponent({
  props: { notion: { type: "app", app: "notion" } },
  async run({ $ }) {
    const token = this.notion.$auth.oauth_access_token;
    const r = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: { and: [
          { property: "Aguardando resposta", checkbox: { equals: true } },
          { property: "Categoria", select: { does_not_equal: "Spam" } },
        ] },
        sorts: [{ property: "Última msg recebida", direction: "ascending" }],
        page_size: 100,
      }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(`Notion ${r.status}: ${j.message}`);

    const agora = Date.now();
    const atrasados = [];
    for (const page of j.results) {
      const p = page.properties;
      const desde = p["Última msg recebida"]?.date?.start;
      if (!desde) continue;
      const min = (agora - new Date(desde).getTime()) / 60000;
      const prio = p.Prioridade?.select?.name || "Normal";
      if (min < (LIMITE_MIN[prio] ?? 240)) continue;
      atrasados.push({
        nome: (p.Nome.title || []).map((t) => t.plain_text).join(""),
        prio, min,
        fechando: min >= JANELA_ALERTA_H * 60 && min < 24 * 60,
        expirada: min >= 24 * 60,
        msg: (p["Última mensagem"].rich_text || []).map((t) => t.plain_text).join("").slice(0, 120),
        link: p["Enviar resposta"]?.url || page.url,
      });
    }

    if (!atrasados.length) return $.flow.exit("Ninguém no vácuo 🎉");

    const ordem = { Urgente: 0, Alta: 1, Normal: 2, Baixa: 3 };
    atrasados.sort((a, b) => ordem[a.prio] - ordem[b.prio] || b.min - a.min);
    const tempo = (m) => (m < 120 ? `${Math.round(m)} min` : `${Math.round(m / 60)} h`);
    const linhas = atrasados.map((a) =>
      `${a.prio === "Urgente" ? "🔴" : a.prio === "Alta" ? "🟠" : "⚪"} ${a.nome} — esperando há ${tempo(a.min)}` +
      (a.fechando ? " ⏳ JANELA DE 24h FECHANDO" : a.expirada ? " (passou de 24h: usar modelo)" : "") +
      `\n   “${a.msg}”\n   Responder: ${a.link}`);

    await $.send.email({
      subject: `WhatsApp: ${atrasados.length} pessoa(s) esperando resposta` + (atrasados.some((a) => a.prio === "Urgente") ? " — tem URGENTE" : ""),
      text: `${new Date().toLocaleString("pt-BR", { timeZone: TZ })}\n\n${linhas.join("\n\n")}`,
    });
    return atrasados;
  },
});
