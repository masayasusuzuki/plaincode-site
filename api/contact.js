// お問い合わせフォーム送信 API（Vercel Serverless Function）
// フォーム → ここ → Resend → masayasusuzuki@plaincode.work
const TO = "masayasusuzuki@plaincode.work";
const FROM = "plaincode <notify@plaincode.work>";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method" });

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot（ボット対策の隠しフィールド）

  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim();
  const company = String(b.company || "").trim();
  const type = String(b.type || "").trim();
  const message = String(b.message || "").trim();

  if (!name || !email || !message) return res.status(400).json({ ok: false, error: "required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: "email" });
  if (message.length > 5000) return res.status(400).json({ ok: false, error: "too_long" });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: "not_configured" });

  const subject = `[plaincode.work] ${type || "お問い合わせ"} / ${name}${company ? `（${company}）` : ""}`;
  const text = [
    `名前: ${name}`, `会社: ${company || "-"}`, `メール: ${email}`, `種別: ${type || "-"}`, "",
    "---", message, "---", "",
    `UA: ${req.headers["user-agent"] || "-"}`, `IP: ${req.headers["x-forwarded-for"] || "-"}`,
  ].join("\n");
  const html = `<pre style="font:14px/1.7 ui-monospace,Menlo,monospace;white-space:pre-wrap">${esc(text)}</pre>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
  });
  if (!r.ok) {
    console.error("resend error", r.status, await r.text());
    return res.status(502).json({ ok: false, error: "send" });
  }
  return res.status(200).json({ ok: true });
};
