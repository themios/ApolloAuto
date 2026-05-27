(function () {
  const main = document.getElementById("post-content");
  if (!main) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  if (!slug) {
    main.innerHTML = "<p>Article not found. <a href=\"index.html\">Back to blog</a></p>";
    return;
  }

  const apiBase = document.body.dataset.apiBase || "";

  fetch(`${apiBase}/api/posts/slug/${encodeURIComponent(slug)}`)
    .then((r) => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    })
    .then((post) => {
      document.title = `${post.title} | Apollo Auto Blog`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta && post.excerpt) meta.content = post.excerpt;

      const date = post.published_at
        ? new Date(post.published_at).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "";

      main.innerHTML = `
        <header class="article-header">
          <div class="container">
            ${post.category ? `<p class="eyebrow">${escapeHtml(post.category)}</p>` : ""}
            <h1>${escapeHtml(post.title)}</h1>
            ${date ? `<p class="article-meta">${date}</p>` : ""}
          </div>
        </header>
        <article class="container article-body">
          ${post.body || `<p>${escapeHtml(post.excerpt || "")}</p>`}
          <p class="article-back"><a href="index.html">← All articles</a></p>
        </article>`;
    })
    .catch(() => {
      main.innerHTML =
        '<p class="container">Article not found. <a href="index.html">Back to blog</a></p>';
    });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
