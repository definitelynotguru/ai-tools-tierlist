# AI Coding Tools Tier List

Interactive drag-and-drop tier list for AI coding tools — like tiermaker, but static and free.

**Live:** https://definitelynotguru.github.io/ai-tools-tierlist/

## Features

- Tiers **S / A / B / C / D / F** with classic tiermaker colors
- Unranked pool with all tools at start (nothing pre-ranked)
- Drag tiles between pool and tiers (SortableJS, vendored — no CDN)
- Persists ranking in `localStorage` (`ai-tools-tierlist-v1`)
- **Reset** and **Export JSON** buttons
- Static site — plain HTML/CSS/JS, GitHub Pages from `main` `/`

## Add a new tool

1. Drop a square logo into `assets/icons/` (PNG or SVG, ~128×128 works well).
2. Append an entry to the `TOOLS` array in `app.js`:

```js
{ id: "my-tool", label: "My Tool", icon: "assets/icons/my-tool.png" },
```

3. Commit and push. Existing visitors keep their saved layout; the new tool is appended to **Unranked** automatically.

## Logo attribution

Icons are local copies under `assets/icons/` (no CDN hotlinks).

### Official / brand sources

| Tool | Source |
|------|--------|
| Factory Droid | Official Factory.ai mark (`factory-droid.svg` rendered to PNG) |
| Zed, Cursor, Warp, GitHub Copilot | [Simple Icons](https://simpleicons.org/) (rendered to PNG) |
| Cline | Official icon from [cline/cline](https://github.com/cline/cline) |
| Capy | Official apple-touch icon from [capy.ai](https://capy.ai) |

### Screenshot crops

These were cropped from `docs/reference/reference-tierlist.png` when a clean official SVG/PNG matching the desired mark was not available:

- Oh My Pi
- Pi
- fx
- Codex
- Opencode (2)
- Amp
- Devin
- Claude Code
- Grok Build
- Roo Code
- Antigravity

If you own a mark above and prefer a different asset, open an issue or PR with an official SVG/PNG.

## Local preview

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

## License

Site code: MIT. Brand logos remain property of their respective owners; used here for identification only.
