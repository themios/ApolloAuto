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

    if (data.logoUrl) {
      document.querySelectorAll("a.logo").forEach((logoEl) => {
        if (logoEl.querySelector("img.site-logo")) return;
        const img = document.createElement("img");
        img.src = data.logoUrl;
        img.alt = "Apollo Auto";
        img.className = "site-logo";
        img.style.cssText = "height:72px;width:auto;display:block;";
        logoEl.innerHTML = "";
        logoEl.appendChild(img);
      });
    }
  }

  fetch("/api/theme")
    .then((res) => (res.ok ? res.json() : null))
    .then(applyTheme)
    .catch(() => {});
})();
