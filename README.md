# Zabhla OS

Private full-stack brand command center for Zabhla, a premium Indian streetwear brand based in Bharuch, Gujarat.

Live app: <https://zabhla-omjayesh-20260425.onrender.com>

## Stack

- React 18 + Vite frontend
- Express backend
- JSON file store in `backend/data/`
- Recharts dashboards
- Anthropic proxy endpoints for News and CEO Playbook

## Local Run

```bash
npm run build
npm start
```

The backend serves the built React app from `frontend/dist`.

## Environment

Set this on Render for live AI news and playbook generation:

```text
ANTHROPIC_API_KEY=sk-ant-...
```

If the key is missing, the app returns built-in fallback news and playbook content so the dashboard still works.
