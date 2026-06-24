const TYPE_LABELS = {
  blog: "Blog articles",
  daily: "Daily messages",
  special: "Specials",
  trends: "Trends",
  trend: "Trends",
  trends: "Trends",
  news: "News",
};

const COLOR_LABELS = {
  navy: "Primary navy",
  navySoft: "Navy soft / success",
  gold: "Gold accent",
  goldLight: "Gold light",
  paper: "Background paper",
  paperDeep: "Paper deep",
  ink: "Text ink",
  inkMuted: "Muted text",
};

let currentType = "blog";
let currentView = "content";
let selectedId = null;
let themeMeta = null;

const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const postList = document.getElementById("post-list");
const listEmpty = document.getElementById("list-empty");
const editorForm = document.getElementById("editor-form");
const editorPlaceholder = document.getElementById("editor-placeholder");
const editorError = document.getElementById("editor-error");
const panelTitle = document.getElementById("panel-title");
const contentView = document.getElementById("content-view");
const stylingView = document.getElementById("styling-view");
const newBtn = document.getElementById("new-btn");
const themeForm = document.getElementById("theme-form");
const themeError = document.getElementById("theme-error");
const themeSuccess = document.getElementById("theme-success");
const colorFields = document.getElementById("color-fields");
const fontPairSelect = document.getElementById("theme-font-pair");
const fontPreview = document.getElementById("font-preview");

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function updateEditorFields(type) {
  const isBlog = type === "blog";
  document.querySelector(".slug-row").hidden = !isBlog;
  document.querySelector(".category-row").hidden = !isBlog;
  document.querySelector(".link-row").hidden = isBlog;
  document.querySelector(".expires-wrap").hidden = type !== "special";
  document.getElementById("post-body-hint").hidden = !isBlog;
  HtmlEditor.setMode(isBlog);
}

async function checkSession() {
  try {
    const me = await api("/api/auth/me");
    showApp(me.email);
    return true;
  } catch {
    return false;
  }
}

function showApp(email) {
  loginScreen.hidden = true;
  app.hidden = false;
  document.getElementById("admin-email").textContent = email;
  loadList();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  try {
    const fd = new FormData(loginForm);
    await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const me = await api("/api/auth/me");
    showApp(me.email);
  } catch (err) {
    loginError.textContent = err.message;
    loginError.hidden = false;
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  location.reload();
});

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.view === "styling") {
      currentView = "styling";
      showStylingView();
      return;
    }

    currentView = "content";
    showContentView();
    currentType = btn.dataset.type;
    panelTitle.textContent = TYPE_LABELS[currentType] || currentType;
    selectedId = null;
    resetEditor();
    loadList();
  });
});

function showContentView() {
  contentView.hidden = false;
  stylingView.hidden = true;
  newBtn.hidden = false;
}

function showStylingView() {
  contentView.hidden = true;
  stylingView.hidden = false;
  newBtn.hidden = true;
  themeSuccess.hidden = true;
  themeError.hidden = true;
  loadThemeEditor();
}

document.getElementById("new-btn").addEventListener("click", () => {
  selectedId = null;
  openEditor({
    type: currentType,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "",
    link_url: "",
    active: true,
    published_at: new Date().toISOString(),
    expires_at: null,
  });
});

async function loadList() {
  postList.innerHTML = "";
  try {
    const rows = await api(`/api/admin/posts?type=${currentType}`);
    listEmpty.hidden = rows.length > 0;
    for (const row of rows) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.id = row.id;
      if (row.id === selectedId) btn.classList.add("active");
      const status = row.active ? "" : " · draft";
      btn.innerHTML = `${escapeHtml(row.title)}<span class="item-meta">${formatDate(row.published_at)}${status}</span>`;
      btn.addEventListener("click", () => selectPost(row.id));
      li.appendChild(btn);
      postList.appendChild(li);
    }
  } catch (err) {
    listEmpty.textContent = err.message;
    listEmpty.hidden = false;
  }
}

async function selectPost(id) {
  selectedId = id;
  const row = await api(`/api/admin/posts/${id}`);
  openEditor(row);
  loadList();
}

function resetEditor() {
  editorForm.hidden = true;
  editorPlaceholder.hidden = false;
  document.getElementById("delete-btn").hidden = true;
  editorError.hidden = true;
}

function openEditor(row) {
  editorPlaceholder.hidden = true;
  editorForm.hidden = false;
  updateEditorFields(row.type);

  document.getElementById("post-id").value = row.id || "";
  document.getElementById("post-type").value = row.type;
  document.getElementById("post-title").value = row.title || "";
  document.getElementById("post-slug").value = row.slug || "";
  document.getElementById("post-category").value = row.category || "";
  document.getElementById("post-excerpt").value = row.excerpt || "";
  HtmlEditor.setContent(row.body || "");
  document.getElementById("post-link").value = row.link_url || "";
  document.getElementById("post-published").value = toLocalInput(row.published_at);
  document.getElementById("post-expires").value = toLocalInput(row.expires_at);
  document.getElementById("post-active").checked = row.active !== false;
  document.getElementById("delete-btn").hidden = !row.id;
}

editorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  editorError.hidden = true;
  const id = document.getElementById("post-id").value;
  const type = document.getElementById("post-type").value || currentType;
  const payload = {
    type,
    title: document.getElementById("post-title").value.trim(),
    slug: document.getElementById("post-slug").value.trim() || null,
    category: document.getElementById("post-category").value.trim() || null,
    excerpt: document.getElementById("post-excerpt").value.trim() || null,
    body: HtmlEditor.getContent(type === "blog"),
    link_url: document.getElementById("post-link").value.trim() || null,
    active: document.getElementById("post-active").checked,
    published_at: fromLocalInput(document.getElementById("post-published").value),
    expires_at: fromLocalInput(document.getElementById("post-expires").value),
  };

  try {
    if (id) {
      await api(`/api/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      selectedId = Number(id);
    } else {
      const created = await api("/api/admin/posts", { method: "POST", body: JSON.stringify(payload) });
      selectedId = created.id;
      document.getElementById("post-id").value = created.id;
      document.getElementById("delete-btn").hidden = false;
    }
    await loadList();
    if (selectedId) await selectPost(selectedId);
  } catch (err) {
    editorError.textContent = err.message;
    editorError.hidden = false;
  }
});

document.getElementById("delete-btn").addEventListener("click", async () => {
  const id = document.getElementById("post-id").value;
  if (!id || !confirm("Delete this item permanently?")) return;
  await api(`/api/admin/posts/${id}`, { method: "DELETE" });
  selectedId = null;
  resetEditor();
  loadList();
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function buildColorFields(keys) {
  colorFields.innerHTML = "";
  for (const key of keys) {
    const wrap = document.createElement("div");
    wrap.className = "color-field";
    wrap.innerHTML = `
      <label for="color-${key}">${COLOR_LABELS[key] || key}</label>
      <div class="color-input-row">
        <input type="color" id="color-${key}" data-color-key="${key}" />
        <input type="text" class="color-hex" data-color-key="${key}" maxlength="7" spellcheck="false" />
      </div>
    `;
    colorFields.appendChild(wrap);
  }

  colorFields.querySelectorAll('input[type="color"]').forEach((picker) => {
    picker.addEventListener("input", () => {
      const hex = picker.value.toLowerCase();
      const text = colorFields.querySelector(`.color-hex[data-color-key="${picker.dataset.colorKey}"]`);
      if (text) text.value = hex;
      updateThemePreview();
    });
  });

  colorFields.querySelectorAll(".color-hex").forEach((text) => {
    text.addEventListener("input", () => {
      let val = text.value.trim();
      if (!val.startsWith("#")) val = `#${val}`;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        val = val.toLowerCase();
        text.value = val;
        const picker = colorFields.querySelector(`input[type="color"][data-color-key="${text.dataset.colorKey}"]`);
        if (picker) picker.value = val;
        updateThemePreview();
      }
    });
  });
}

function populateFontPairs(pairs) {
  fontPairSelect.innerHTML = "";
  for (const pair of pairs) {
    const opt = document.createElement("option");
    opt.value = pair.id;
    opt.textContent = pair.label;
    fontPairSelect.appendChild(opt);
  }
  fontPairSelect.addEventListener("change", updateFontPreview);
}

function fillThemeForm(theme) {
  document.getElementById("theme-preset").value = theme.preset || "craft";
  fontPairSelect.value = theme.fonts?.pairId || "sora-karla";
  for (const [key, value] of Object.entries(theme.colors || {})) {
    const picker = colorFields.querySelector(`input[type="color"][data-color-key="${key}"]`);
    const text = colorFields.querySelector(`.color-hex[data-color-key="${key}"]`);
    if (picker) picker.value = value;
    if (text) text.value = value;
  }
  updateFontPreview();
  updateThemePreview();
}

function readThemeForm() {
  const colors = {};
  colorFields.querySelectorAll('input[type="color"]').forEach((picker) => {
    colors[picker.dataset.colorKey] = picker.value.toLowerCase();
  });
  return {
    preset: document.getElementById("theme-preset").value,
    colors,
    fonts: { pairId: fontPairSelect.value },
  };
}

function updateFontPreview() {
  const pair = themeMeta?.fontPairs?.find((p) => p.id === fontPairSelect.value);
  if (!pair) return;
  fontPreview.style.setProperty("--preview-display", `"${pair.display}", system-ui, sans-serif`);
  fontPreview.style.setProperty("--preview-body", `"${pair.body}", system-ui, sans-serif`);
}

function updateThemePreview() {
  const theme = readThemeForm();
  const preview = document.getElementById("theme-preview");
  preview.querySelector('[data-color="navy"]').style.background = theme.colors.navy;
  preview.querySelector('[data-color="gold"]').style.background = theme.colors.gold;
  preview.querySelector('[data-color="paper"]').style.background = theme.colors.paper;
  preview.querySelector('[data-color="ink"]').style.background = theme.colors.ink;
}

async function loadThemeEditor() {
  if (!themeMeta) {
    themeMeta = await api("/api/admin/theme");
    buildColorFields(themeMeta.colorKeys);
    populateFontPairs(themeMeta.fontPairs);
  }
  fillThemeForm(themeMeta.theme);
}

document.getElementById("theme-preset").addEventListener("change", (e) => {
  if (e.target.value === "legacy" && fontPairSelect.value === "sora-karla") {
    fontPairSelect.value = "outfit-albert";
    updateFontPreview();
  }
});

themeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  themeError.hidden = true;
  themeSuccess.hidden = true;
  try {
    const payload = readThemeForm();
    const res = await api("/api/admin/theme", { method: "PUT", body: JSON.stringify(payload) });
    themeMeta.theme = res.theme;
    themeSuccess.hidden = false;
  } catch (err) {
    themeError.textContent = err.message;
    themeError.hidden = false;
  }
});

document.getElementById("theme-reset-btn").addEventListener("click", async () => {
  if (!confirm("Reset all styling to the default Craft preset?")) return;
  themeError.hidden = true;
  themeSuccess.hidden = true;
  try {
    const res = await api("/api/admin/theme/reset", { method: "POST" });
    themeMeta.theme = res.theme;
    fillThemeForm(res.theme);
    themeSuccess.textContent = "Reset to defaults.";
    themeSuccess.hidden = false;
  } catch (err) {
    themeError.textContent = err.message;
    themeError.hidden = false;
  }
});

document.getElementById("post-body-source-btn")?.addEventListener("click", () => {
  HtmlEditor.toggleSourceMode();
});

checkSession();
