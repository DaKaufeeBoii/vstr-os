# VSTR-OS Portfolio

An interactive OS-themed portfolio for **Sai Tarun Reddy Velagala**, built with Next.js 15, React 19, TypeScript, Framer Motion, and Tailwind CSS.

## Features

- **Window manager** — draggable, minimizable, focus-stacked windows with taskbar and start menu
- **Portfolio apps** — About, Projects, Skills, Experience, Achievements, Contact, Terminal, Settings
- **Themes** — Cyberpunk (default), Retro 95, and Light mode (persisted in localStorage)
- **Mobile support** — fullscreen windows and compact taskbar on small screens
- **Web resume** — printable resume at `/resume` (use browser Print → Save as PDF)
- **Easter eggs** — hidden games and apps discoverable via the Terminal
- **PWA support** — installable with offline caching via service worker
- **System sounds** — UI interaction feedback (clicks, window actions)
- **Notification Center** — system notifications with toast and panel views
- **BSOD Easter Egg** — triggerable via `blue-screen` or `bsod` terminal command
- **Brightness & Volume controls** — in Settings and Quick Settings panel

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: static resume PDF

To enable a direct PDF download, add your file as `public/assets/resume/resume.pdf`. The site uses `/resume` by default.

## Secret terminal commands

Open the **Terminal** app and try:

| Command | Action |
|---------|--------|
| `help` | List available commands |
| `whoami` | Profile summary |
| `ls` / `ls projects/` | Browse sections |
| `play flappy` | Launch Flappy.exe mini-game |
| `ask hintmaster` | Coin-toss hint giver |
| `open disk_cleanup` | Disk Cleanup easter egg |
| `start desktop_pet` | Desktop Pet companion |
| `crack password` | PwnTool typing challenge |
| `blue-screen` / `bsod` | Trigger BSOD Easter Egg |
| `resume` | Resume page info |

Hidden route: [`/games/secret`](/games/secret)

## Tech stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Framer Motion
- Tailwind CSS 4
- Custom `useReducer` window state

## Deploy

Deploy to [Vercel](https://vercel.com) and set `NEXT_PUBLIC_SITE_URL` to your production URL for correct Open Graph metadata.
