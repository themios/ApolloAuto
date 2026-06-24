const DEFAULT_THEME = {
  preset: "craft",
  colors: {
    navy: "#0c2836",
    navySoft: "#164456",
    gold: "#c8872a",
    goldLight: "#e8b04a",
    paper: "#f6f2ea",
    paperDeep: "#ebe4d7",
    ink: "#121a1f",
    inkMuted: "#4f5d66",
  },
  fonts: {
    pairId: "sora-karla",
    display: "Sora",
    body: "Karla",
  },
};

const FONT_PAIRS = [
  { id: "sora-karla", display: "Sora", body: "Karla", label: "Sora + Karla (Craft default)" },
  { id: "outfit-albert", display: "Outfit", body: "Albert Sans", label: "Outfit + Albert Sans (Legacy)" },
  { id: "libre-source", display: "Libre Baskerville", body: "Source Sans 3", label: "Libre Baskerville + Source Sans 3" },
  { id: "bitter-nunito", display: "Bitter", body: "Nunito Sans", label: "Bitter + Nunito Sans" },
];

const COLOR_KEYS = Object.keys(DEFAULT_THEME.colors);

const CSS_VAR_MAP = {
  navy: "--navy",
  navySoft: "--navy-soft",
  gold: "--gold",
  goldLight: "--gold-light",
  paper: "--paper",
  paperDeep: "--paper-deep",
  ink: "--ink",
  inkMuted: "--ink-muted",
};

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

function getFontPair(id) {
  return FONT_PAIRS.find((p) => p.id === id) || FONT_PAIRS[0];
}

function normalizeTheme(input) {
  const base = structuredClone(DEFAULT_THEME);
  if (!input || typeof input !== "object") return base;

  if (input.preset === "craft" || input.preset === "legacy") {
    base.preset = input.preset;
  }

  if (input.colors && typeof input.colors === "object") {
    for (const key of COLOR_KEYS) {
      const val = input.colors[key];
      if (typeof val === "string" && HEX_RE.test(val)) {
        base.colors[key] = val.toLowerCase();
      }
    }
  }

  if (input.fonts && typeof input.fonts === "object") {
    const pair = getFontPair(input.fonts.pairId);
    base.fonts = {
      pairId: pair.id,
      display: pair.display,
      body: pair.body,
    };
  }

  return base;
}

function validateTheme(theme) {
  normalizeTheme(theme);
  return { ok: true };
}

function themeCssVariables(theme) {
  const t = normalizeTheme(theme);
  const vars = {};
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    vars[cssVar] = t.colors[key];
  }
  vars["--success"] = t.colors.navySoft;
  vars["--font-display"] = `"${t.fonts.display}", system-ui, sans-serif`;
  vars["--font-body"] = `"${t.fonts.body}", system-ui, sans-serif`;
  return vars;
}

function googleFontsUrl(display, body) {
  const d = encodeURIComponent(display.replace(/ /g, "+"));
  const b = encodeURIComponent(body.replace(/ /g, "+"));
  return `https://fonts.googleapis.com/css2?family=${d}:wght@500;600;700;800&family=${b}:ital,wght@0,400;0,500;0,600;0,700&display=swap`;
}

module.exports = {
  DEFAULT_THEME,
  FONT_PAIRS,
  COLOR_KEYS,
  CSS_VAR_MAP,
  normalizeTheme,
  validateTheme,
  themeCssVariables,
  googleFontsUrl,
  getFontPair,
};
