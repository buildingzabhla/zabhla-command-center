import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, "data");
const dataPath = path.join(dataDir, "store.json");

const seed = {
  inventory: [
    { id: "ZB-001", name: "Chaos Theory Tee", cat: "Tees", variant: "Ink Black / M", stock: 45, sold: 120, price: 1299, reorder: 15 },
    { id: "ZB-002", name: "Chaos Theory Tee", cat: "Tees", variant: "Bone White / M", stock: 8, sold: 98, price: 1299, reorder: 15 },
    { id: "ZB-003", name: "Zabhla Oversized Tee", cat: "Tees", variant: "Washed Black / L", stock: 22, sold: 67, price: 1499, reorder: 10 },
    { id: "ZB-004", name: "Women Denim Capri", cat: "Bottoms", variant: "Mid Blue / 28", stock: 18, sold: 44, price: 2199, reorder: 10 },
    { id: "ZB-005", name: "Embroidered Denim Pant", cat: "Bottoms", variant: "Men / Indigo / 32", stock: 6, sold: 21, price: 3299, reorder: 8 },
    { id: "ZB-006", name: "Embroidered Denim Pant", cat: "Bottoms", variant: "Men / Black / 34", stock: 0, sold: 18, price: 3299, reorder: 8 }
  ],
  tasks: [
    { id: 1, text: "Set up cart abandonment email on Shopify", cat: "Website", done: false, priority: "high" },
    { id: 2, text: "Add alt text to all product images", cat: "Website", done: false, priority: "high" },
    { id: 3, text: "Restock embroidered denim pant - black", cat: "Inventory", done: false, priority: "high" },
    { id: 4, text: "Shoot Drop 002 content for Instagram", cat: "Marketing", done: false, priority: "medium" },
    { id: 5, text: "WhatsApp broadcast for Drop 002", cat: "Marketing", done: false, priority: "medium" },
    { id: 6, text: "Submit sitemap to Google Search Console", cat: "Website", done: true, priority: "low" }
  ],
  campaigns: [
    { id: 1, name: "Drop 002 Teaser Reel", platform: "Instagram", status: "active", reach: "12.4K", eng: "4.2%", date: "Apr 22" },
    { id: 2, name: "Summer Launch Reel", platform: "Instagram", status: "completed", reach: "34.2K", eng: "6.8%", date: "Apr 10" },
    { id: 3, name: "Ramadan Edit Broadcast", platform: "WhatsApp", status: "planned", reach: "-", eng: "-", date: "Apr 28" }
  ],
  posts: [
    { id: 1, caption: "Every thread tells a story. Drop 002 loading.", platform: "Instagram", type: "Reel", status: "draft", date: "Apr 27" },
    { id: 2, caption: "Made in India. Worn everywhere. Behind the scenes at our Bharuch studio.", platform: "Instagram", type: "Carousel", status: "scheduled", date: "Apr 29" },
    { id: 3, caption: "Limited restock on Chaos Tee - Bone White. DM before it is gone.", platform: "WhatsApp", type: "Broadcast", status: "draft", date: "Apr 30" }
  ]
};
const fallbackNews = [
  { title: "Indian D2C fashion brands sharpen community-led drops", summary: "Streetwear labels are using Instagram and WhatsApp launches to create urgency without heavy paid ads. Zabhla can use limited drops and creator proof before scaling inventory.", source: "Zabhla OS", category: "D2C" },
  { title: "Denim and relaxed fits stay strong with urban Indian shoppers", summary: "Comfort-led bottoms and oversized silhouettes continue to perform with young buyers. Test denim washes through polls before restocking deeply.", source: "Zabhla OS", category: "Market" },
  { title: "Sustainable textile storytelling becomes a conversion lever", summary: "Indian fashion shoppers increasingly respond to material and production transparency. A Bharuch-made story can strengthen product pages and WhatsApp broadcasts.", source: "Zabhla OS", category: "Sustainability" },
  { title: "WhatsApp remains a high-intent fashion sales channel", summary: "Owned subscriber lists are outperforming broad social reach for launch-day conversion. Zabhla's open rate makes WhatsApp the best 48-hour pre-drop channel.", source: "Zabhla OS", category: "Technology" },
  { title: "Streetwear brands move toward smaller monthly capsules", summary: "Focused monthly capsules reduce inventory risk and keep content fresh. Zabhla should avoid new categories until tees, capri and denim pants prove repeat demand.", source: "Zabhla OS", category: "Streetwear" }
];
const fallbackPlaybook = { playbook: [
  { title: "Own the WhatsApp Drop Room", description: "Segment buyers, warm leads and VIPs, then launch every capsule on WhatsApp 48 hours before Instagram.", priority: "High", investment: "₹15k", timeframe: "2 weeks", impact: "150 launch orders possible from one tuned broadcast", category: "Growth" },
  { title: "Keep the Catalog Ruthlessly Tight", description: "Stay focused on oversized tees, women's denim capri and two men's embroidered denim pants until sell-through proves the next category.", priority: "High", investment: "₹0", timeframe: "Immediate", impact: "Lower dead stock and clearer brand memory", category: "Product" },
  { title: "Build Bharuch Studio Proof", description: "Show production, embroidery, packing and founder decisions from Gujarat to make the brand feel real and premium.", priority: "High", investment: "₹20k", timeframe: "30 days", impact: "Higher trust and repeat purchase", category: "Brand" },
  { title: "Create a Weekly Stock War Room", description: "Review low stock, sold units, content performance and open orders every Monday before any purchase order.", priority: "High", investment: "₹0", timeframe: "Weekly", impact: "Cleaner cash flow and fewer bad buys", category: "Operations" },
  { title: "Launch Campus Micro-Creator Loops", description: "Give Gujarat and Mumbai campus creators unique WhatsApp links and reward orders, not likes.", priority: "Medium", investment: "₹60k", timeframe: "45 days", impact: "Low-cost customer acquisition", category: "Distribution" },
  { title: "Turn Customers Into Fit Proof", description: "Collect fit photos, size notes and short reviews after delivery. Use them on product pages and broadcasts.", priority: "Medium", investment: "₹10k", timeframe: "30 days", impact: "Reduces size hesitation and returns", category: "Community" },
  { title: "Pre-Sell Before Restock", description: "Use waitlists and refundable reservations for low-stock winners before placing large production runs.", priority: "High", investment: "₹25k", timeframe: "3 weeks", impact: "Inventory funded by demand", category: "Revenue" },
  { title: "Instrument Shopify Basics", description: "Set up GA4, Meta Pixel, cart abandonment, image alt text and sitemap monitoring.", priority: "High", investment: "₹35k", timeframe: "2 weeks", impact: "Better conversion from the same traffic", category: "Tech" },
  { title: "Build a 60-Day Repeat System", description: "After first purchase, send care instructions, styling ideas, early access and restock alerts through WhatsApp.", priority: "Medium", investment: "₹12k", timeframe: "60 days", impact: "Higher LTV without paid ads", category: "Retention" }
] };

function status(item) { const stock = Number(item.stock || 0); const reorder = Number(item.reorder || 0); return stock <= 0 ? "out" : stock <= reorder ? "low" : "good"; }
function now() { return new Date().toISOString(); }
function withMeta(rows) { return rows.map((row) => ({ created_at: now(), ...row })); }
function seeded() { return { inventory: withMeta(seed.inventory).map((x) => ({ ...x, status: status(x) })), tasks: withMeta(seed.tasks), campaigns: withMeta(seed.campaigns), posts: withMeta(seed.posts) }; }
function writeDB(db) { fs.writeFileSync(dataPath, JSON.stringify(db, null, 2)); return db; }
function initDB() {
  fs.mkdirSync(dataDir, { recursive: true });
  let db = {};
  if (fs.existsSync(dataPath)) {
    try { db = JSON.parse(fs.readFileSync(dataPath, "utf8")); } catch { db = {}; }
  }
  const initial = seeded();
  for (const key of ["inventory", "tasks", "campaigns", "posts"]) {
    if (!Array.isArray(db[key]) || db[key].length === 0) db[key] = initial[key];
  }
  db.inventory = db.inventory.map((item) => ({ ...item, status: status(item) }));
  writeDB(db);
}
function readDB() { initDB(); return JSON.parse(fs.readFileSync(dataPath, "utf8")); }
function nextId(rows) { return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1; }
function nextSku(rows) { const next = rows.reduce((max, row) => { const m = String(row.id || "").match(/^ZB-(\d+)$/); return m ? Math.max(max, Number(m[1])) : max; }, 0) + 1; return `ZB-${String(next).padStart(3, "0")}`; }
function norm(collection, item, rows = []) { if (collection === "inventory") { const next = { id: item.id || nextSku(rows), name: item.name || "New SKU", cat: item.cat || "Tees", variant: item.variant || "", stock: Number(item.stock || 0), sold: Number(item.sold || 0), price: Number(item.price || 0), reorder: Number(item.reorder || 10), ...item }; next.stock = Number(next.stock || 0); next.sold = Number(next.sold || 0); next.price = Number(next.price || 0); next.reorder = Number(next.reorder || 0); next.status = status(next); return next; } if (collection === "tasks") return { text: item.text || "", cat: item.cat || "Other", priority: item.priority || "medium", done: Boolean(item.done), ...item }; if (collection === "campaigns") return { name: item.name || "", platform: item.platform || "Instagram", status: item.status || "planned", reach: item.reach || "-", eng: item.eng || "-", date: item.date || "", ...item }; return { caption: item.caption || "", platform: item.platform || "Instagram", type: item.type || "Reel", status: item.status || "draft", date: item.date || "", ...item }; }
function crud(collection) { app.get(`/api/${collection}`, (req, res) => res.json(readDB()[collection])); app.post(`/api/${collection}`, (req, res) => { const db = readDB(); const id = collection === "inventory" ? (req.body.id || nextSku(db[collection])) : nextId(db[collection]); const item = { created_at: now(), ...norm(collection, { ...req.body, id }, db[collection]) }; db[collection].unshift(item); writeDB(db); res.status(201).json(item); }); app.put(`/api/${collection}/:id`, (req, res) => { const db = readDB(); const i = db[collection].findIndex((x) => String(x.id) === String(req.params.id)); if (i < 0) return res.status(404).json({ error: "Not found" }); db[collection][i] = norm(collection, { ...db[collection][i], ...req.body, id: db[collection][i].id }, db[collection]); writeDB(db); res.json(db[collection][i]); }); app.delete(`/api/${collection}/:id`, (req, res) => { const db = readDB(); db[collection] = db[collection].filter((x) => String(x.id) !== String(req.params.id)); writeDB(db); res.json({ ok: true }); }); }
async function callAnthropic(body) { if (!process.env.ANTHROPIC_API_KEY) return null; const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(`Anthropic ${r.status}`); const payload = await r.json(); const text = (payload.content || []).map((b) => b.text || "").join("\n"); const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/); if (!match) throw new Error("No JSON in AI response"); return JSON.parse(match[0]); }

app.use(express.json({ limit: "1mb" }));
["inventory", "tasks", "campaigns", "posts"].forEach(crud);
app.all("/api/news", async (req, res) => { try { const data = await callAnthropic({ model: "claude-sonnet-4-20250514", max_tokens: 1000, tools: [{ type: "web_search_20250305", name: "web_search" }], system: "Fashion industry analyst. Search web for latest India fashion/streetwear/D2C clothing/garment/textile news 2025-2026. Return ONLY valid JSON array. Each item: {title, summary, source, category}. Category must be one of: Market|D2C|Exports|Sustainability|Technology|Policy|Streetwear. Exactly 5 items.", messages: [{ role: "user", content: "Search: India fashion clothing industry news 2026. Return JSON array only." }] }); res.json({ items: data || fallbackNews, fallback: !data, updatedAt: now() }); } catch (e) { res.json({ items: fallbackNews, fallback: true, error: e.message, updatedAt: now() }); } });
app.all("/api/playbook", async (req, res) => { try { const data = await callAnthropic({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: "Strategic advisor Indian D2C fashion. Return ONLY valid JSON. Structure: {\"playbook\":[{title,description,priority,investment,timeframe,impact,category}]} exactly 9 items for Zabhla, premium Indian streetwear, 89 orders/month, Instagram+WhatsApp led, Gujarat, no paid ads, budget under ₹5L.", messages: [{ role: "user", content: "Zabhla ₹1Cr playbook. JSON only." }] }); res.json({ ...(data || fallbackPlaybook), fallback: !data, updatedAt: now() }); } catch (e) { res.json({ ...fallbackPlaybook, fallback: true, error: e.message, updatedAt: now() }); } });

const dist = path.join(__dirname, "../frontend/dist");
app.use(express.static(dist));
app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
app.listen(port, "0.0.0.0", () => console.log(`Zabhla OS running on port ${port}`));
