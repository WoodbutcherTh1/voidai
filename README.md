<div align="center">

# 🌌 VoidAI

**Your calm, modern, multilingual AI workspace.**

Chat, code, and create — beautifully focused. Built with Next.js 16, React 19,
TypeScript, Tailwind v4, and OpenRouter.

[Quick Start](#-quick-start-docker) · [Local Dev](#-local-development) ·
[Configuration](#-configuration) · [Project Structure](#-project-structure) ·
[Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Highlights

- 💬 **Conversational AI** powered by OpenRouter (GPT-4o-mini by default).
- 🌍 **Auto language detection** — replies in the user's language (Arabic,
  English, Russian, Chinese, Japanese, Korean, Hebrew, Hindi & more).
- 🎨 **Modern UI/UX** — glassmorphism, gradients, animations, dark theme.
- 🔐 **Bring Your Own Key** — provider keys live only in the user's browser.
- 📱 **Fully responsive** — sidebar on desktop, bottom nav on mobile.
- ⚡ **Auto-resize input**, typing indicator, message suggestions, focus
  retention after replies.
- 🐳 **One-command Docker deploy** — runs anywhere with a single `.env` file.

---

## 🚀 Quick Start (Docker)

The fastest way to run VoidAI on **any machine** that has Docker installed.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (24+)
- Docker Compose v2 (bundled with modern Docker installs)
- An [OpenRouter](https://openrouter.ai/keys) API key

### 1. Clone the repository

```bash
git clone https://github.com/WoodbutcherTh1/voidai.git
cd voidai
```

### 2. Configure your environment

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your real key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-real-key-here
```

> ⚠️ Never commit `.env` — it's already in `.gitignore`.

### 3. Build and run

```bash
docker compose up -d --build
```

That's it. Open **http://localhost:3000** 🎉

### Useful Docker commands

```bash
docker compose logs -f voidai      # Follow live logs
docker compose ps                  # Show container status
docker compose restart voidai      # Restart the app
docker compose down                # Stop and remove the container
docker compose up -d --build       # Rebuild after code or env changes
```

---

## 🧑‍💻 Local Development

If you prefer running without Docker:

### Prerequisites

- Node.js **20+**
- npm 10+ (bundled with Node)

### Setup

```bash
git clone https://github.com/WoodbutcherTh1/voidai.git
cd voidai
npm install
cp .env.example .env.local   # Next.js prefers .env.local for local dev
```

Edit `.env.local` and add your `OPENROUTER_API_KEY`.

### Run the dev server

```bash
npm run dev
```

Then open **http://localhost:3000**.

### Production build (without Docker)

```bash
npm run build
npm run start
```

---

## ⚙️ Configuration

### Environment variables

| Variable             | Required | Description                                                                                |
| -------------------- | :------: | ------------------------------------------------------------------------------------------ |
| `OPENROUTER_API_KEY` |    ✅    | Your OpenRouter API key. Get one at <https://openrouter.ai/keys>.                          |
| `NODE_ENV`           |    —     | Set automatically by Docker / Next.js. `development` for `npm run dev`, `production` else. |

### Where to put them

| Mode             | File                |
| ---------------- | ------------------- |
| Local dev        | `.env.local`        |
| Docker           | `.env`              |
| CI / production  | Platform secret store (Vercel, Railway, etc.) |

### Selecting a different model

The API route at `app/api/chat/route.ts` uses `openai/gpt-4o-mini` by default.
Change the `model` field there to any [model OpenRouter supports](https://openrouter.ai/models).

---

## 🧱 Tech Stack

| Layer        | Tool                              |
| ------------ | --------------------------------- |
| Framework    | Next.js 16 (App Router)           |
| Runtime      | React 19                          |
| Language     | TypeScript 5                      |
| Styling      | Tailwind CSS 4 (`@theme`-based)   |
| AI Backend   | OpenRouter (chat completions)     |
| Container    | Docker (multi-stage, Alpine, non-root user) |

---

## 📂 Project Structure

```
voidai/
├── app/
│   ├── (app)/                # Authenticated workspace (sidebar + bottom nav)
│   │   ├── chat/             # Main AI chat
│   │   ├── dev/              # Dev tools (placeholder)
│   │   ├── media/            # Media tools (placeholder)
│   │   ├── music/            # Music tools (placeholder)
│   │   ├── android/          # Android tools (placeholder)
│   │   ├── vault/            # Vault (placeholder)
│   │   ├── settings/         # API keys, theme, language
│   │   └── layout.tsx        # App shell with nav
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   └── chat/route.ts     # OpenRouter proxy + language enforcement
│   ├── components/           # Sidebar, BottomNav, ThemeProvider, ui/Button
│   ├── lib/storage.ts        # localStorage helpers for API keys
│   ├── globals.css           # Tailwind v4 theme + utilities
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # Service definition
├── .dockerignore
├── .env.example              # Template for OPENROUTER_API_KEY
├── next.config.ts            # output: "standalone" for Docker
└── tsconfig.json
```

---

## 🐛 Troubleshooting

### `Missing Authentication header` / 401 from OpenRouter

The server didn't receive a valid `OPENROUTER_API_KEY`.

1. Confirm the file exists:
   - Local dev: `.env.local`
   - Docker: `.env`
2. Confirm the line is exactly:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   ```
   No quotes, no spaces around `=`.
3. Restart the server:
   - Local dev: stop and re-run `npm run dev`
   - Docker: `docker compose up -d --build` (full rebuild needed if you
     just created `.env`)

### `cp: cannot stat '.env.example': No such file or directory`

You're not in the project root, or the repo was cloned without it. Re-clone
the repository or pull the latest version.

### `next: not found` when running `npm run dev`

Dependencies aren't installed. Run:

```bash
npm install
```

### Docker build fails on TypeScript errors

The Dockerfile runs `next build`, which type-checks the code. Fix the
reported error in your local files first, then rebuild:

```bash
docker compose up -d --build
```

### Port 3000 already in use

Either stop the conflicting process or change the host port in
`docker-compose.yml`:

```yaml
ports:
  - "8080:3000"   # exposes the app on http://localhost:8080
```

---

## 🗺 Roadmap

### ✅ Done

- [x] Chat interface with auto-scroll & focus retention
- [x] Multilingual auto-detection
- [x] Sidebar + bottom nav with active states
- [x] Modern landing, login, and register pages
- [x] Settings (API keys, theme, language)
- [x] Tailwind v4 design system with glassmorphism
- [x] Dockerfile + docker-compose deployment

### 🛠 Coming up

- [ ] Streaming token-by-token responses
- [ ] Persistent chat history
- [ ] Real authentication (sessions, OAuth)
- [ ] Voice input
- [ ] Light theme polish
- [ ] Per-user system prompt customization

---

## 🔒 Security Notes

- The Docker image runs as a **non-root** `nextjs` user.
- `.env` and other secret-bearing files are listed in `.dockerignore` and
  `.gitignore` — they are never baked into images or committed to git.
- API keys stored via the Settings page live in **the user's `localStorage`**,
  never on the server.
- The server only reads `OPENROUTER_API_KEY` from environment variables.

---

## 👥 Authors

- **Ameen**
- **Hammam**

---

## 📄 License

MIT — see [LICENSE](./LICENSE) if available, or treat this repo as MIT until
one is added.
