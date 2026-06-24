(function () {
  const root = document.documentElement;

  function applyTheme(data) {
    if (!data || typeof data !== "object") return;

    if (data.preset === "legacy") {
      root.classList.add("theme-legacy");
    } else {
      root.classList.remove("theme-legacy");
    }

    if (data.cssVariables) {
      for (const [key, value] of Object.entries(data.cssVariables)) {
        root.style.setProperty(key, value);
      }
    }

    if (data.googleFontsUrl && !document.querySelector('link[data-apollo-theme-fonts="1"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = data.googleFontsUrl;
      link.setAttribute("data-apollo-theme-fonts", "1");
      document.head.appendChild(link);
    }
  }

  fetch("/api/theme")
    .then((res) => (res.ok ? res.json() : null))
    .then(applyTheme)
    .catch(() => {});
})();
