// ============================================================================
// WORKFLOW 2 — ENVIAR RESPOSTA (link "Enviar resposta" do Notion)
//
// Gatilho: HTTP / Webhook → "Return a custom response from your workflow".
// A URL deste gatilho vai na variável SEND_URL.
//
// Fluxo: você clica no link no Notion → abre uma página com o rascunho
// (dá pra editar ali mesmo) → botão "Enviar" → sai pelo WhatsApp do escritório.
// O link abre uma página de confirmação em vez de enviar direto, para que
// pré-visualizações de link não disparem mensagens sozinhas.
//
// Variáveis de ambiente:
//   META_WA_TOKEN         token permanente do System User (Meta Business)
//   META_PHONE_NUMBER_ID  ID do número na API do WhatsApp
//   SEND_SECRET           o mesmo do workflow 1
//
// Fora da janela de 24h não envia nada: quem responde é você, pelo celular.
// ============================================================================
import crypto from "crypto";

// ----------------------------------------------------------------------------
// ⚙️ CONFIGURAÇÃO — se existir variável de ambiente com o mesmo nome, ela vale.
// ----------------------------------------------------------------------------
const CFG = {
  META_PHONE_NUMBER_ID: "1450312318158580", // número de teste +1 555 158-6606
  META_WA_TOKEN: "COLE_AQUI_O_TOKEN_DA_META", // começa com EAA... (Meta → Usuários do sistema → claude-api)
  SEND_SECRET: "__SEND_SECRET__",
};
for (const k of Object.keys(CFG)) if (process.env[k]) CFG[k] = process.env[k];

const GRAPH = "https://graph.facebook.com/v21.0";
const NOTION_VERSION = "2022-06-28";
const TZ = "America/Sao_Paulo";

export default defineComponent({
  props: { notion: { type: "app", app: "notion" } },
  async run({ steps, $ }) {
    const ev = steps.trigger.event;
    const form = parseForm(ev.body);
    const pageId = form.page || ev.query?.page;
    const sig = form.sig || ev.query?.sig;
    const html = (status, body) => $.respond({ status, headers: { "content-type": "text/html; charset=utf-8" }, body: layout(body) });

    if (!pageId || !safeEq(sig, sign(pageId))) return html(403, "<h2>Link inválido</h2>");

    const token = this.notion.$auth.oauth_access_token;
    const page = await notion(token, "GET", `pages/${pageId}`);
    const p = page.properties;
    const nome = plain(p.Nome.title);
    const waId = p.WhatsApp.phone_number;
    const ultima = p["Última msg recebida"]?.date?.start;
    const janelaAberta = ultima && Date.now() - new Date(ultima).getTime() < 24 * 3600 * 1000 - 5 * 60 * 1000;
    const status = p["Status rascunho"]?.select?.name;

    // ---------- GET: página de confirmação ----------
    if (ev.method === "GET") {
      const rascunho = plain(p.Rascunho.rich_text);
      const ultimaMsg = plain(p["Última mensagem"].rich_text);
      const aviso = status === "Enviado" ? `<p class="warn">⚠️ Este rascunho já foi enviado.</p>` : "";
      if (!janelaAberta) {
        return html(200, `<h2>${esc(nome)}</h2>
          <p class="warn">⏳ Já passaram 24h desde a última mensagem dessa pessoa. A resposta automática não vale mais:
          responda você mesmo pelo WhatsApp no celular.</p>`);
      }
      return html(200, `<h2>${esc(nome)}</h2>${aviso}
        <p class="muted">Última mensagem: “${esc(ultimaMsg)}”</p>
        <form method="POST">${hidden(pageId, sig)}<input type="hidden" name="acao" value="texto">
        <textarea name="texto" rows="9">${esc(rascunho)}</textarea>
        <button>Enviar no WhatsApp ✅</button></form>
        <form method="POST">${hidden(pageId, sig)}<input type="hidden" name="acao" value="descartar">
        <button class="sec">Descartar rascunho</button></form>`);
    }

    // ---------- POST: executar ----------
    const agora = new Date().toISOString();
    if (form.acao === "descartar") {
      await updatePage(token, pageId, { "Status rascunho": { select: { name: "Descartado" } } });
      return html(200, "<h2>Rascunho descartado</h2>");
    }

    if (!janelaAberta) return html(400, "<h2>Janela de 24h fechada</h2><p>Responda pelo celular.</p>");
    const texto = (form.texto || "").trim();
    if (!texto) return html(400, "<h2>Texto vazio</h2>");
    const payload = { type: "text", text: { body: texto, preview_url: false } };
    const log = `📤 ${texto}`;

    const r = await fetch(`${GRAPH}/${CFG.META_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${CFG.META_WA_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: toBR(waId), ...payload }),
    });
    const j = await r.json();
    if (!r.ok) {
      await updatePage(token, pageId, { "Status rascunho": { select: { name: "Erro" } } });
      return html(500, `<h2>Erro ao enviar</h2><pre>${esc(JSON.stringify(j.error, null, 2))}</pre>`);
    }

    await updatePage(token, pageId, {
      "Status rascunho": { select: { name: "Enviado" } },
      "Aguardando resposta": { checkbox: false },
      "Última resposta enviada": { date: { start: agora } },
      Rascunho: rt(texto),
    });
    const quando = new Date().toLocaleString("pt-BR", { timeZone: TZ, dateStyle: "short", timeStyle: "short" });
    await notion(token, "PATCH", `blocks/${pageId}/children`, {
      children: [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: `${log.replace("📤", `📤 ${quando}:`)}`.slice(0, 1990) } }] } }],
    });
    return html(200, `<h2>Enviado ✅</h2><p>Mensagem enviada para ${esc(nome)}.</p>`);
  },
});

// ---------------------------------------------------------------------------
async function notion(token, method, path, body) {
  const r = await fetch(`https://api.notion.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Notion ${r.status}: ${j.message}`);
  return j;
}
const updatePage = (t, id, properties) => notion(t, "PATCH", `pages/${id}`, { properties });
const plain = (arr) => (arr || []).map((x) => x.plain_text).join("");
const rt = (s) => ({ rich_text: [{ type: "text", text: { content: String(s || "").slice(0, 1990) } }] });
const sign = (id) => crypto.createHmac("sha256", CFG.SEND_SECRET).update(id).digest("hex").slice(0, 32);
const safeEq = (a, b) => typeof a === "string" && a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hidden = (page, sig) => `<input type="hidden" name="page" value="${esc(page)}"><input type="hidden" name="sig" value="${esc(sig)}">`;

function parseForm(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  return Object.fromEntries(new URLSearchParams(String(body)));
}

const layout = (inner) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Enviar resposta</title>
<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:24px auto;padding:0 16px;color:#1f2328;background:#fff}
textarea{width:100%;box-sizing:border-box;font:inherit;padding:10px;border:1px solid #ccc;border-radius:8px}
button{margin-top:10px;width:100%;padding:12px;font:inherit;font-weight:600;border:0;border-radius:8px;background:#1a7f37;color:#fff}
button.sec{background:#eee;color:#333}.muted{color:#666}.warn{background:#fff8c5;padding:10px;border-radius:8px}
pre{white-space:pre-wrap;background:#f6f8fa;padding:10px;border-radius:8px}</style></head><body>${inner}</body></html>`;

// Celular brasileiro: a Meta devolve o wa_id sem o 9 (55 + DDD + 8 dígitos).
// Para enviar, recoloca o 9 — é o formato que a lista de destinatários aceita.
function toBR(n) {
  n = String(n).replace(/\D/g, "");
  return /^55\d{2}[6-9]\d{7}$/.test(n) ? n.slice(0, 4) + "9" + n.slice(4) : n;
}
