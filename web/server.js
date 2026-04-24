const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const topics = [
  ["India oversized t-shirt fashion trend", "Oversized Tees"],
  ["India denim fashion retail women capri", "Denim Capri"],
  ["India men's denim fashion embroidery", "Men's Denim"],
  ["India ecommerce fashion Shopify", "Ecommerce"],
  ["India sustainable denim textile waste", "Sustainability"],
];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function cleanHTML(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? match[1] : "";
}

function parseRSS(xml, topic) {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return blocks.map((block) => ({
    title: cleanHTML(tag(block, "title")),
    link: cleanHTML(tag(block, "link")),
    source: cleanHTML(tag(block, "source")) || "Google News",
    summary: cleanHTML(tag(block, "description")),
    published: cleanHTML(tag(block, "pubDate")),
    topic,
  })).filter((item) => item.title && item.link);
}

async function loadNews() {
  const all = [];
  for (const [query, topic] of topics) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "ZabhlaCommandCenter/1.0" },
      });
      const xml = await response.text();
      all.push(...parseRSS(xml, topic));
    } catch (error) {
      all.push({
        title: `Could not load ${topic} news`,
        link: "https://news.google.com/",
        source: "Local server",
        summary: error.message,
        published: new Date().toUTCString(),
        topic,
      });
    }
  }

  const seen = new Set();
  return all
    .filter((item) => {
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .slice(0, 40);
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/news") {
    const news = await loadNews();
    send(res, 200, JSON.stringify({ news, loadedAt: new Date().toISOString() }), mime[".json"]);
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) send(res, 404, "Not found");
        else send(res, 200, fallback, mime[".html"]);
      });
      return;
    }
    send(res, 200, data, mime[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Zabhla web app running at http://localhost:${port}`);
  console.log("Open from iPhone using your Mac local IP on the same Wi-Fi.");
});
