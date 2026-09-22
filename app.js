(() => {
  const STORAGE_KEY = "ai-tools-tierlist-v1";
  const TIERS = ["S", "A", "B", "C", "D", "F"];

  /** @type {{ id: string, label: string, icon: string }[]} */
  const TOOLS = [
    { id: "oh-my-pi", label: "Oh My Pi", icon: "assets/icons/oh-my-pi.png" },
    { id: "factory-droid", label: "Factory Droid", icon: "assets/icons/factory-droid.png" },
    { id: "pi", label: "Pi", icon: "assets/icons/pi.png" },
    { id: "zed", label: "Zed", icon: "assets/icons/zed.png" },
    { id: "fx", label: "fx", icon: "assets/icons/fx.png" },
    { id: "codex", label: "Codex", icon: "assets/icons/codex.png" },
    { id: "opencode", label: "Opencode (2)", icon: "assets/icons/opencode.png" },
    { id: "cursor", label: "Cursor", icon: "assets/icons/cursor.png" },
    { id: "amp", label: "Amp", icon: "assets/icons/amp.png" },
    { id: "devin", label: "Devin", icon: "assets/icons/devin.png" },
    { id: "claude-code", label: "Claude Code", icon: "assets/icons/claude-code.png" },
    { id: "grok-build", label: "Grok Build", icon: "assets/icons/grok-build.png" },
    { id: "warp", label: "Warp", icon: "assets/icons/warp.png" },
    { id: "roo-code", label: "Roo Code", icon: "assets/icons/roo-code.png" },
    { id: "cline", label: "Cline", icon: "assets/icons/cline.png" },
    { id: "antigravity", label: "Antigravity", icon: "assets/icons/antigravity.png" },
    { id: "github-copilot", label: "GitHub Copilot", icon: "assets/icons/github-copilot.png" },
    { id: "capy", label: "Capy (capy.ai)", icon: "assets/icons/capy.png" },
  ];

  const toolById = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

  function emptyState() {
    const state = { pool: TOOLS.map((t) => t.id) };
    for (const t of TIERS) state[t] = [];
    return state;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch {
      return emptyState();
    }
  }

  function normalizeState(parsed) {
    const state = emptyState();
    const seen = new Set();
    const buckets = [...TIERS, "pool"];
    for (const key of buckets) {
      const list = Array.isArray(parsed[key]) ? parsed[key] : [];
      state[key] = [];
      for (const id of list) {
        if (toolById[id] && !seen.has(id)) {
          state[key].push(id);
          seen.add(id);
        }
      }
    }
    // Any missing tools go to pool
    for (const t of TOOLS) {
      if (!seen.has(t.id)) state.pool.push(t.id);
    }
    return state;
  }

  function saveState(state) {
    const out = {};
    for (const key of [...TIERS, "pool"]) {
      out[key] = [...state[key]];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  }

  function readDomState() {
    const state = {};
    for (const key of [...TIERS, "pool"]) {
      const el = document.getElementById(key === "pool" ? "pool" : `tier-${key}`);
      state[key] = [...el.querySelectorAll(".tool-tile")].map((n) => n.dataset.id);
    }
    return state;
  }

  function createTile(tool) {
    const el = document.createElement("div");
    el.className = "tool-tile";
    el.dataset.id = tool.id;
    el.title = tool.label;
    el.innerHTML = `
      <img src="${tool.icon}" alt="${escapeAttr(tool.label)}" width="56" height="56" loading="lazy" />
      <span class="label">${escapeHtml(tool.label)}</span>
    `;
    return el;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  function render(state) {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (const tier of TIERS) {
      const row = document.createElement("div");
      row.className = "tier-row";
      row.innerHTML = `
        <div class="tier-label" data-tier="${tier}">${tier}</div>
        <div class="tier-drop" id="tier-${tier}" data-tier="${tier}"></div>
      `;
      board.appendChild(row);
      const drop = row.querySelector(".tier-drop");
      for (const id of state[tier]) {
        drop.appendChild(createTile(toolById[id]));
      }
    }

    const pool = document.getElementById("pool");
    pool.innerHTML = "";
    for (const id of state.pool) {
      pool.appendChild(createTile(toolById[id]));
    }

    initSortables();
  }

  let sortables = [];

  function initSortables() {
    for (const s of sortables) s.destroy();
    sortables = [];

    const containers = [
      ...TIERS.map((t) => document.getElementById(`tier-${t}`)),
      document.getElementById("pool"),
    ];

    for (const el of containers) {
      sortables.push(
        new Sortable(el, {
          group: "ai-tools-tierlist",
          animation: 150,
          draggable: ".tool-tile",
          ghostClass: "sortable-ghost",
          onAdd: persist,
          onUpdate: persist,
          onRemove: persist,
        })
      );
    }
  }

  function persist() {
    saveState(readDomState());
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    render(emptyState());
  }

  function exportJson() {
    const state = readDomState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-tools-tierlist.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Reset all rankings? Tools return to the unranked pool.")) reset();
  });
  document.getElementById("btn-export").addEventListener("click", exportJson);

  render(loadState());
})();
