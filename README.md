# Zabhla Brand Command Center

Native macOS desktop MVP and responsive web app for tracking Zabhla brand operations:

- Official website: <https://zabhla.com/>
- Product focus: oversized unisex tees, women's denim capri, and men's embroidered denim pants
- Marketing campaigns and tasks
- Social media content calendar
- Shopify-style inventory control
- Website and SEO work
- India-focused clothing industry news
- Practical suggestions from your tracker data and live news
- Desktop and web Insights sections with editable KPI values, charts, product margin graphs, and a drop simulator
- Accounts department for income, expenses, payables, receivables, tax/compliance planning, and cash position
- Selling department for sales channels, leads, orders, fulfillment status, product demand, and follow-up notes

## Run Desktop App

Build the app:

```bash
chmod +x build.sh
./build.sh
```

Open:

```bash
open "build/Zabhla Brand Command Center.app"
```

Your tracker data is saved locally in:

```text
~/Library/Application Support/ZabhlaCommandCenter/zabhla-data.json
```

## Run Web App

Run it from your Mac:

```bash
/Users/omjayeshkumarprajapati/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node web/server.js
```

Open on the Mac:

```text
http://localhost:4173
```

Open on iPhone when it is on the same Wi-Fi as this Mac:

```text
http://192.168.178.21:4173
```

In Safari on iPhone, tap Share, then Add to Home Screen. The web app uses the Zabhla logo from `web/assets/apple-touch-icon.png`.

If the iPhone screen looks blank, reload the page once. If Safari still shows the old blank page, open `http://192.168.178.21:4173/?v=20260425departments` to force a fresh copy.

The web app now includes Insights, Accounts, and Selling sections with editable KPI values, revenue/ad-spend charts, inventory and margin graphs, product controls, a drop simulator, account totals, and selling pipeline totals.

For access anywhere, the next step is hosting this web app with a shared cloud database.

## Next Suggested Integrations

- Responsive web app hosting for iPhone access outside your Wi-Fi
- Shared cloud database sync
- Shopify Admin API for live inventory and product sync
- Google Analytics for website traffic and conversion tracking
- Meta, TikTok, YouTube, and Pinterest analytics for social performance
- AI blog draft generation from the live news screen
