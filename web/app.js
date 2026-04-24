const products = [
  { name: "Oversized Unisex Tee", sku: "ZAB-TEE-OS", reorder: 20 },
  { name: "Women's Denim Capri", sku: "ZAB-WDC", reorder: 12 },
  { name: "Men's Embroidered Denim Pant 1", sku: "ZAB-MEDP-01", reorder: 8 },
  { name: "Men's Embroidered Denim Pant 2", sku: "ZAB-MEDP-02", reorder: 8 }
];

const sections = [
  ["dashboard", "Dashboard"],
  ["insights", "Insights"],
  ["accounts", "Accounts"],
  ["selling", "Selling"],
  ["marketing", "Marketing"],
  ["social", "Social"],
  ["inventory", "Inventory"],
  ["website", "Website"],
  ["news", "News"],
  ["suggestions", "Ideas"]
];

const seed = {
  marketing: [
    { id: id(), title: "First focused catalog launch", campaign: "Zabhla First Drop", channel: "Instagram", dueDate: today(), owner: "Founder", budget: 15000, status: "In Progress", notes: "Launch only the current four product lines." },
    { id: id(), title: "Creator shortlist for tees and denim", campaign: "Zabhla First Drop", channel: "Influencer", dueDate: addDays(2), owner: "Marketing", budget: 25000, status: "Planned", notes: "India-based streetwear, denim, and campus fashion creators." }
  ],
  social: [
    { id: id(), platform: "Instagram", type: "Reel", date: today(), caption: "Oversized unisex tee fit check for campus, cafe, and night plans.", status: "Planned", views: 0, likes: 0, saves: 0 },
    { id: id(), platform: "TikTok", type: "Short", date: addDays(1), caption: "Denim capri and embroidered denim pant detail shots.", status: "Idea", views: 0, likes: 0, saves: 0 }
  ],
  inventory: products.map((p) => ({ id: id(), product: p.name, sku: p.sku, stock: 0, reorder: p.reorder, cost: 0, price: 0, shopify: "Manual" })),
  website: [
    { id: id(), page: "zabhla.com Home", task: "Update hero and product messaging for the focused first catalog.", priority: "High", dueDate: today(), status: "Open" },
    { id: id(), page: "zabhla.com Product Pages", task: "Create clean product pages for tees, capri, and two embroidered denim pants.", priority: "High", dueDate: addDays(3), status: "Open" }
  ],
  accounts: [
    { id: id(), date: today(), type: "Income", category: "Shopify Sales", amount: 42000, status: "Received", note: "First drop online sales" },
    { id: id(), date: today(), type: "Expense", category: "Production", amount: 18500, status: "Paid", note: "Samples and embroidery work" },
    { id: id(), date: addDays(7), type: "Payable", category: "Vendor", amount: 12000, status: "Pending", note: "Denim stitching balance" }
  ],
  selling: [
    { id: id(), date: today(), channel: "Shopify", customer: "Online Customer", product: "Oversized Unisex Tee", units: 8, value: 11992, status: "Packed", note: "Check size demand before restock." },
    { id: id(), date: today(), channel: "Instagram DM", customer: "Campus Lead", product: "Women's Denim Capri", units: 3, value: 7497, status: "Lead", note: "Send fit video and payment link." }
  ],
  analytics: [
    { id: id(), period: "Week 1", visits: 850, orders: 18, revenue: 42000, adSpend: 9000, engagement: 620 },
    { id: id(), period: "Week 2", visits: 1200, orders: 26, revenue: 67000, adSpend: 12000, engagement: 910 },
    { id: id(), period: "Week 3", visits: 1540, orders: 34, revenue: 89000, adSpend: 14500, engagement: 1180 },
    { id: id(), period: "Week 4", visits: 1900, orders: 44, revenue: 116000, adSpend: 17000, engagement: 1480 }
  ],
  launch: { units: 90, price: 1499, cost: 620, ads: 16000, visits: 2600 }
};

let state = load();
let active = localStorage.getItem("zabhla-active") || "dashboard";
let news = JSON.parse(localStorage.getItem("zabhla-news") || "[]");

function id() { return crypto.randomUUID ? crypto.randomUUID() : `z-${Date.now()}-${Math.random()}`; }
function today() { return new Date().toISOString().slice(0, 10); }
function addDays(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("zabhla-data") || "null");
    return saved ? { ...clone(seed), ...saved } : clone(seed);
  } catch { return clone(seed); }
}
function save() {
  localStorage.setItem("zabhla-data", JSON.stringify(state));
  localStorage.setItem("zabhla-active", active);
  const node = document.querySelector("#saveState");
  if (node) node.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
function money(value) { return `INR ${Number(value || 0).toLocaleString("en-IN")}`; }
function num(value) { return Number(value || 0); }
function html(value) { return String(value || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function node(markup) { const t = document.createElement("template"); t.innerHTML = markup.trim(); return t.content.firstElementChild; }

function accountTotals() {
  const income = state.accounts.filter((x) => ["Income", "Receivable"].includes(x.type)).reduce((a, x) => a + num(x.amount), 0);
  const expense = state.accounts.filter((x) => ["Expense", "Payable", "Tax"].includes(x.type)).reduce((a, x) => a + num(x.amount), 0);
  const pending = state.accounts.filter((x) => !["Paid", "Received", "Cleared"].includes(x.status)).reduce((a, x) => a + num(x.amount), 0);
  return { income, expense, pending, balance: income - expense };
}
function sellingTotals() {
  const units = state.selling.reduce((a, x) => a + num(x.units), 0);
  const value = state.selling.reduce((a, x) => a + num(x.value), 0);
  const open = state.selling.filter((x) => !["Delivered", "Closed", "Cancelled"].includes(x.status)).length;
  return { units, value, open, average: state.selling.length ? value / state.selling.length : 0 };
}
function lowStock() { return state.inventory.filter((x) => num(x.stock) <= num(x.reorder)); }
function analyticsTotals() {
  const sum = (k) => state.analytics.reduce((a, x) => a + num(x[k]), 0);
  const visits = sum("visits"), orders = sum("orders"), revenue = sum("revenue"), adSpend = sum("adSpend"), engagement = sum("engagement");
  return { visits, orders, revenue, adSpend, engagement, conversion: visits ? ((orders / visits) * 100).toFixed(1) : "0.0", roas: adSpend ? (revenue / adSpend).toFixed(1) : "0.0" };
}
function readiness() {
  const stocked = state.inventory.filter((x) => num(x.stock) > 0).length / Math.max(state.inventory.length, 1);
  const priced = state.inventory.filter((x) => num(x.price) > num(x.cost) && num(x.price) > 0).length / Math.max(state.inventory.length, 1);
  const web = state.website.filter((x) => x.status === "Done").length / Math.max(state.website.length, 1);
  const content = state.social.filter((x) => ["Ready", "Posted"].includes(x.status)).length / Math.max(state.social.length, 1);
  return Math.round(stocked * 30 + priced * 25 + web * 25 + content * 20);
}
function ideas() {
  const out = ["Keep Zabhla focused on oversized unisex tees, women's denim capri, and two men's embroidered denim pants. Do not add other categories yet."];
  lowStock().forEach((x) => out.push(`Restock ${x.product}: stock ${x.stock}, reorder point ${x.reorder}. Check Shopify before the next campaign.`));
  state.website.filter((x) => x.priority === "High" && x.status !== "Done").forEach((x) => out.push(`Website priority: ${x.page} - ${x.task}`));
  const accounts = accountTotals();
  if (accounts.pending) out.push(`Accounts department: review ${money(accounts.pending)} pending amount before buying more inventory.`);
  const sales = sellingTotals();
  if (sales.open) out.push(`Selling department: follow up ${sales.open} open leads or orders today.`);
  if (news[0]) out.push(`Blog angle from today's clothing news: ${news[0].title}`);
  out.push("Next innovation: connect Shopify Admin API for live stock, prices, low-stock alerts, and product sync.");
  return out;
}

function renderNav() {
  for (const id of ["#nav", "#mobileNav"]) {
    const nav = document.querySelector(id);
    nav.innerHTML = "";
    sections.forEach(([key, label]) => {
      const b = document.createElement("button");
      b.className = active === key ? "active" : "";
      b.textContent = id === "#mobileNav" ? label.slice(0, 4) : label;
      b.onclick = () => { active = key; save(); render(); };
      nav.append(b);
    });
  }
}
function render() {
  renderNav();
  document.querySelector("#pageTitle").textContent = sections.find(([k]) => k === active)?.[1] || "Dashboard";
  const view = document.querySelector("#view");
  view.innerHTML = "";
  view.append(({ dashboard, insights, accounts, selling, marketing, social, inventory, website, news: newsView, suggestions }[active] || dashboard)());
}

function dashboard() {
  const d = document.querySelector("#dashboardTemplate").content.cloneNode(true);
  d.querySelector("#todaySuggestion").textContent = ideas()[0];
  d.querySelector("#metricMarketing").textContent = state.marketing.filter((x) => x.status !== "Done").length;
  d.querySelector("#metricSocial").textContent = state.social.filter((x) => x.status !== "Posted").length;
  d.querySelector("#metricInventory").textContent = lowStock().length;
  d.querySelector("#metricWebsite").textContent = state.website.filter((x) => x.status !== "Done").length;
  d.querySelector(".metrics").insertAdjacentHTML("beforeend", `<article class="metric glass"><span>Accounts</span><strong>${money(accountTotals().balance)}</strong><small>net balance</small></article><article class="metric glass"><span>Selling</span><strong>${money(sellingTotals().value)}</strong><small>${sellingTotals().open} open</small></article>`);
  d.querySelector(".metrics").after(node(`<section class="grid-two"><div class="panel glass chart-panel"><h3>Revenue vs ad spend</h3>${lineChart(state.analytics, [{ key: "revenue", label: "Revenue", color: "var(--teal)" }, { key: "adSpend", label: "Ad Spend", color: "var(--terracotta)" }])}</div><div class="panel glass chart-panel"><h3>Inventory health</h3>${barChart(state.inventory.map((x) => ({ label: x.product, value: num(x.stock), limit: num(x.reorder) })), true)}</div></section>`));
  list(d.querySelector("#dashboardSuggestions"), ideas().slice(0, 5));
  renderNews(d.querySelector("#dashboardNews"), news.slice(0, 5), true);
  return d;
}

function insights() {
  const t = analyticsTotals();
  const wrap = node(`<section class="view"><section class="hero glass insights-hero"><div><p class="eyebrow">Brand pulse</p><h3>Editable numbers and graphs for Zabhla.</h3><p>Change weekly values, product stock, prices, and launch targets. The graphs update from your entries.</p><div class="chips"><span>${money(t.revenue)} revenue</span><span>${t.orders} orders</span><span>${t.conversion}% conversion</span></div></div><div class="readiness-card"><div class="gauge" style="--score:${readiness()}"><div><strong>${readiness()}%</strong><span>ready</span></div></div><strong>Launch readiness</strong><small>Based on stock, pricing, website work, and content.</small></div></section></section>`);
  wrap.insertAdjacentHTML("beforeend", `<section class="metrics"><article class="metric glass"><span>Revenue</span><strong>${money(t.revenue)}</strong><small>weekly entries</small></article><article class="metric glass"><span>ROAS</span><strong>${t.roas}x</strong><small>revenue / ads</small></article><article class="metric glass"><span>Conversion</span><strong>${t.conversion}%</strong><small>orders / visits</small></article><article class="metric glass"><span>Engagement</span><strong>${t.engagement}</strong><small>social actions</small></article></section>`);
  wrap.insertAdjacentHTML("beforeend", `<section class="grid-two"><div class="panel glass chart-panel"><h3>Revenue vs ad spend</h3>${lineChart(state.analytics, [{ key: "revenue", label: "Revenue", color: "var(--teal)" }, { key: "adSpend", label: "Ad Spend", color: "var(--terracotta)" }])}</div><div class="panel glass chart-panel"><h3>Visits to orders</h3>${barChart(state.analytics.map((x) => ({ label: x.period, value: num(x.orders), limit: Math.max(1, num(x.visits) / 50) })), false)}</div></section>`);
  wrap.append(metricEditor(), productEditor(), launchEditor());
  return wrap;
}
function metricEditor() {
  const box = node(`<section class="panel glass"><div class="panel-head"><div><p class="eyebrow">Editable weekly values</p><h3>KPI points</h3></div></div><form class="form-grid metric-form"><label>Period<input name="period" value="Week ${state.analytics.length + 1}"></label><label>Visits<input name="visits" type="number" value="0"></label><label>Orders<input name="orders" type="number" value="0"></label><label>Revenue<input name="revenue" type="number" value="0"></label><label>Ad Spend<input name="adSpend" type="number" value="0"></label><label>Engagement<input name="engagement" type="number" value="0"></label><button class="primary-btn" type="submit">Add KPI</button></form><div class="editable-list"></div></section>`);
  box.querySelector("form").onsubmit = (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); state.analytics.push({ id: id(), period: f.period, visits: num(f.visits), orders: num(f.orders), revenue: num(f.revenue), adSpend: num(f.adSpend), engagement: num(f.engagement) }); save(); render(); };
  state.analytics.forEach((row) => box.querySelector(".editable-list").insertAdjacentHTML("beforeend", `<article class="metric-row"><input data-k="period" data-id="${row.id}" value="${html(row.period)}"><input data-k="visits" data-id="${row.id}" type="number" value="${num(row.visits)}"><input data-k="orders" data-id="${row.id}" type="number" value="${num(row.orders)}"><input data-k="revenue" data-id="${row.id}" type="number" value="${num(row.revenue)}"><input data-k="adSpend" data-id="${row.id}" type="number" value="${num(row.adSpend)}"><input data-k="engagement" data-id="${row.id}" type="number" value="${num(row.engagement)}"><button class="ghost-btn danger" data-remove="${row.id}">Delete</button></article>`));
  box.querySelectorAll("input[data-id]").forEach((input) => input.onchange = () => { const r = state.analytics.find((x) => x.id === input.dataset.id); r[input.dataset.k] = input.dataset.k === "period" ? input.value : num(input.value); save(); render(); });
  box.querySelectorAll("[data-remove]").forEach((b) => b.onclick = () => { state.analytics = state.analytics.filter((x) => x.id !== b.dataset.remove); save(); render(); });
  return box;
}
function productEditor() {
  const box = node(`<section class="panel glass"><h3>Product control</h3><div class="product-control"></div>${barChart(state.inventory.map((x) => ({ label: x.product, value: num(x.stock), limit: num(x.reorder) })), true)}</section>`);
  state.inventory.forEach((p) => box.querySelector(".product-control").insertAdjacentHTML("beforeend", `<article class="mini-editor"><strong>${html(p.product)}</strong><label>Stock<input data-p="${p.id}" name="stock" type="number" value="${num(p.stock)}"></label><label>Reorder<input data-p="${p.id}" name="reorder" type="number" value="${num(p.reorder)}"></label><label>Cost<input data-p="${p.id}" name="cost" type="number" value="${num(p.cost)}"></label><label>Price<input data-p="${p.id}" name="price" type="number" value="${num(p.price)}"></label></article>`));
  box.querySelectorAll("[data-p]").forEach((input) => input.onchange = () => { const p = state.inventory.find((x) => x.id === input.dataset.p); p[input.name] = num(input.value); save(); render(); });
  return box;
}
function launchEditor() {
  const l = state.launch;
  const profit = (num(l.price) - num(l.cost)) * num(l.units) - num(l.ads);
  const box = node(`<section class="panel glass"><h3>Drop simulator</h3><form class="form-grid"><label>Target Units<input name="units" type="number" value="${l.units}"></label><label>Price<input name="price" type="number" value="${l.price}"></label><label>Cost<input name="cost" type="number" value="${l.cost}"></label><label>Ad Spend<input name="ads" type="number" value="${l.ads}"></label><label>Visits<input name="visits" type="number" value="${l.visits}"></label></form><div class="sim-grid"><div><span>Revenue</span><strong>${money(num(l.units) * num(l.price))}</strong></div><div><span>Net Profit</span><strong>${money(profit)}</strong></div><div><span>Break-even Units</span><strong>${Math.ceil(num(l.ads) / Math.max(num(l.price) - num(l.cost), 1))}</strong></div><div><span>Conversion Needed</span><strong>${num(l.visits) ? ((num(l.units) / num(l.visits)) * 100).toFixed(1) : "0.0"}%</strong></div></div></section>`);
  box.querySelectorAll("input").forEach((input) => input.oninput = () => { state.launch[input.name] = num(input.value); save(); render(); });
  return box;
}

function tracker(title, subtitle, fields, key, mapper, row) {
  const wrap = node(`<section class="view"><div class="tracker-head"><div><h3>${title}</h3><p class="muted">${subtitle}</p></div></div><form class="form-card glass form-grid"></form><div class="panel glass"><h3>Tracker</h3><div class="rows"></div></div></section>`);
  const form = wrap.querySelector("form");
  form.innerHTML = fields.join("") + `<button class="primary-btn full" type="submit">Add</button>`;
  form.onsubmit = (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(form)); state[key].unshift({ id: id(), ...mapper(f) }); save(); render(); };
  state[key].forEach((x) => wrap.querySelector(".rows").append(row(x, key)));
  return wrap;
}
const input = (name, label, type = "text", value = "") => `<label>${label}<input name="${name}" type="${type}" value="${html(value)}"></label>`;
const area = (name, label) => `<label class="full">${label}<textarea name="${name}"></textarea></label>`;
const select = (name, label, opts) => `<label>${label}<select name="${name}">${opts.map((x) => `<option>${html(x)}</option>`).join("")}</select></label>`;
function rowCard(x, key, title, meta, body) {
  const card = node(`<article class="row-card"><header><div><h4>${html(title)}</h4><p class="muted">${html(meta)}</p></div><div class="row-actions"></div></header><p>${body}</p></article>`);
  const done = node(`<button class="ghost-btn">${key === "selling" ? "Delivered" : key === "accounts" ? "Clear" : "Done"}</button>`);
  done.onclick = () => { x.status = key === "social" ? "Posted" : key === "selling" ? "Delivered" : key === "accounts" ? (["Income", "Receivable"].includes(x.type) ? "Received" : "Paid") : "Done"; save(); render(); };
  const del = node(`<button class="ghost-btn danger">Delete</button>`);
  del.onclick = () => { state[key] = state[key].filter((item) => item.id !== x.id); save(); render(); };
  card.querySelector(".row-actions").append(done, del);
  return card;
}
function marketing() { return tracker("Marketing Work", "Campaigns, launches, offers, ads, creators, and brand tasks.", [input("title", "Task"), input("campaign", "Campaign"), select("channel", "Channel", ["Instagram", "TikTok", "Meta Ads", "Google Ads", "Email", "Influencer", "Offline"]), input("dueDate", "Due", "date", today()), input("owner", "Owner", "text", "Zabhla"), input("budget", "Budget", "number", 0), area("notes", "Notes")], "marketing", (f) => ({ ...f, budget: num(f.budget), status: "Planned" }), (x, k) => rowCard(x, k, x.title, `${x.campaign} | ${x.channel} | ${x.status}`, html(x.notes))); }
function social() { return tracker("Social Content Calendar", "Plan posts and track performance manually until platform APIs are connected.", [select("platform", "Platform", ["Instagram", "TikTok", "Facebook", "YouTube", "Pinterest"]), select("type", "Type", ["Reel", "Short", "Post", "Story", "Carousel", "Live"]), input("date", "Publish", "date", today()), area("caption", "Caption / Hook")], "social", (f) => ({ ...f, views: 0, likes: 0, saves: 0, status: "Planned" }), (x, k) => rowCard(x, k, x.caption, `${x.platform} ${x.type} | ${x.date} | ${x.status}`, `Views ${x.views} | Likes ${x.likes} | Saves ${x.saves}`)); }
function accounts() { const t = accountTotals(); const view = tracker("Accounts Department", "Track income, expenses, payables, receivables, GST/compliance, and cash position.", [input("date", "Date", "date", today()), select("type", "Type", ["Income", "Expense", "Payable", "Receivable", "Tax"]), input("category", "Category", "text", "Shopify Sales"), input("amount", "Amount", "number", 0), select("status", "Status", ["Pending", "Paid", "Received", "Planned", "Cleared"]), area("note", "Note")], "accounts", (f) => ({ ...f, amount: num(f.amount) }), (x, k) => rowCard(x, k, x.category, `${x.date} | ${x.type} | ${x.status}`, `${money(x.amount)} - ${html(x.note)}`)); view.insertBefore(node(`<section class="metrics"><article class="metric glass"><span>Income</span><strong>${money(t.income)}</strong><small>received + receivable</small></article><article class="metric glass"><span>Expenses</span><strong>${money(t.expense)}</strong><small>expense + payable + tax</small></article><article class="metric glass"><span>Pending</span><strong>${money(t.pending)}</strong><small>needs action</small></article><article class="metric glass"><span>Balance</span><strong>${money(t.balance)}</strong><small>cash view</small></article></section>`), view.children[1]); return view; }
function selling() { const t = sellingTotals(); const view = tracker("Selling Department", "Track every sale, lead, channel, demand, fulfillment status, and follow-up note.", [input("date", "Date", "date", today()), select("channel", "Channel", ["Shopify", "Instagram DM", "WhatsApp", "Pop-up / Offline", "Website Lead", "Referral"]), input("customer", "Customer / Lead"), select("product", "Product", products.map((x) => x.name)), input("units", "Units", "number", 1), input("value", "Value", "number", 0), select("status", "Status", ["Lead", "Follow-up", "Payment Pending", "Packed", "Shipped", "Delivered", "Closed", "Cancelled"]), area("note", "Note")], "selling", (f) => ({ ...f, units: num(f.units), value: num(f.value) }), (x, k) => rowCard(x, k, x.customer, `${x.date} | ${x.channel} | ${x.product} | ${x.status}`, `${x.units} units | ${money(x.value)} | ${html(x.note)}`)); view.insertBefore(node(`<section class="metrics"><article class="metric glass"><span>Sales Value</span><strong>${money(t.value)}</strong><small>tracked selling</small></article><article class="metric glass"><span>Units</span><strong>${t.units}</strong><small>current records</small></article><article class="metric glass"><span>Open</span><strong>${t.open}</strong><small>leads/orders</small></article><article class="metric glass"><span>Avg Order</span><strong>${money(t.average)}</strong><small>per record</small></article></section>`), view.children[1]); return view; }
function inventory() { return tracker("Shopify Inventory Control", "Current catalog only: oversized unisex tee, women's denim capri, and two men's embroidered denim pants.", [select("product", "Product", products.map((x) => x.name)), input("variant", "Variant / Color / Size"), input("sku", "SKU"), input("stock", "Stock", "number", 0), input("reorder", "Reorder", "number", 10), input("cost", "Cost", "number", 0), input("price", "Price", "number", 0)], "inventory", (f) => ({ product: f.variant ? `${f.product} - ${f.variant}` : f.product, sku: f.sku || products.find((x) => x.name === f.product)?.sku || "ZAB", stock: num(f.stock), reorder: num(f.reorder), cost: num(f.cost), price: num(f.price), shopify: "Manual" }), (x, k) => rowCard(x, k, x.product, `${x.sku} | Stock ${x.stock} | Reorder ${x.reorder}`, `<span class="${num(x.stock) <= num(x.reorder) ? "low" : "ok"}">${num(x.stock) <= num(x.reorder) ? "Low Stock" : "OK"}</span> | Price INR ${x.price} | ${x.shopify}`)); }
function website() { return tracker("Website Tracker", "Track zabhla.com SEO, product pages, bugs, copy, and conversion improvements.", [input("page", "Page", "text", "zabhla.com"), area("task", "Task"), select("priority", "Priority", ["High", "Medium", "Low"]), input("dueDate", "Due", "date", today())], "website", (f) => ({ ...f, status: "Open" }), (x, k) => rowCard(x, k, x.page, `${x.priority} | ${x.dueDate} | ${x.status}`, html(x.task))); }

function suggestions() { const wrap = node(`<section class="grid-two"><div class="panel glass"><h3>Recommended Actions</h3><div class="stack"></div></div><div class="panel glass"><h3>Build Next</h3><div class="stack next"></div></div></section>`); list(wrap.querySelector(".stack"), ideas()); list(wrap.querySelector(".next"), ["Host with a shared cloud database for iPhone access anywhere.", "Connect Shopify Admin API for live stock and product sync.", "Generate blog drafts from the live news feed.", "Add Google, Meta, TikTok, and YouTube analytics."]); return wrap; }
function newsView() { const wrap = node(`<section class="panel glass"><div class="tracker-head"><div><h3>Industry Blog & News</h3><p class="muted">India-first live feed for clothing, denim, ecommerce, Shopify, and sustainability signals.</p></div><button class="primary-btn">Refresh Today</button></div><div class="rows"></div></section>`); wrap.querySelector("button").onclick = refreshNews; renderNews(wrap.querySelector(".rows"), news, false); return wrap; }
function list(container, values) { container.innerHTML = values.map((x) => `<div class="suggestion">${html(x)}</div>`).join(""); }
function renderNews(container, values, compact) { container.innerHTML = values.length ? values.map((x) => `<a class="news-card" href="${x.link}" target="_blank" rel="noreferrer"><strong>${html(x.title)}</strong><div class="news-meta"><span>${html(x.topic)}</span><span>${html(x.source)}</span><span>${html(new Date(x.published).toLocaleDateString("en-IN", { day: "numeric", month: "short" }))}</span></div>${compact ? "" : `<p class="muted">${html(x.summary)}</p>`}</a>`).join("") : `<div class="suggestion">Refresh news to load live India-focused clothing industry headlines.</div>`; }
async function refreshNews() { const b = document.querySelector("#refreshNews"); if (b) b.textContent = "Loading"; try { const res = await fetch("/api/news"); const data = await res.json(); news = data.news || []; localStorage.setItem("zabhla-news", JSON.stringify(news)); } catch { news = JSON.parse(localStorage.getItem("zabhla-news") || "[]"); } finally { if (b) b.textContent = "Refresh"; render(); } }
function lineChart(rows, series) { const w = 680, h = 250, p = 34; const max = Math.max(1, ...rows.flatMap((r) => series.map((s) => num(r[s.key])))); const x = (i) => p + (rows.length < 2 ? 0 : i * ((w - p * 2) / (rows.length - 1))); const y = (v) => h - p - (num(v) / max) * (h - p * 2); return `<div class="chart-wrap"><svg class="line-chart" viewBox="0 0 ${w} ${h}">${series.map((s) => `<polyline fill="none" stroke="${s.color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="${rows.map((r, i) => `${x(i)},${y(r[s.key])}`).join(" ")}" />`).join("")}${rows.map((r, i) => `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" fill="#6b6f79" font-size="12">${html(r.period)}</text>`).join("")}</svg><div class="chart-legend">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.label}</span>`).join("")}</div></div>`; }
function barChart(items, limits) { const max = Math.max(1, ...items.map((x) => Math.max(num(x.value), num(x.limit)))); return `<div class="bar-chart">${items.map((x) => { const low = limits && num(x.value) <= num(x.limit); return `<div class="bar-row"><div class="bar-label"><strong>${html(x.label)}</strong><span class="${low ? "low" : "ok"}">${x.value}${limits ? ` / ${x.limit}` : ""}</span></div><div class="bar-track">${limits ? `<span class="bar-limit" style="left:${Math.min(100, (num(x.limit) / max) * 100)}%"></span>` : ""}<span class="bar-fill ${low ? "risk" : ""}" style="width:${Math.max(3, (num(x.value) / max) * 100)}%"></span></div></div>`; }).join("")}</div>`; }
function exportData() { const blob = new Blob([JSON.stringify({ ...state, news }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `zabhla-command-center-${today()}.json`; a.click(); URL.revokeObjectURL(url); }

document.querySelector("#refreshNews").onclick = refreshNews;
document.querySelector("#exportData").onclick = exportData;
render();
refreshNews();
