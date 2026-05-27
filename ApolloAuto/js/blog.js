(function () {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const apiBase = document.body.dataset.apiBase || "";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function postUrl(slug) {
    return `post.html?slug=${encodeURIComponent(slug)}`;
  }

  function card(post) {
    const tag = post.category ? `<p class="blog-tag">${escapeHtml(post.category)}</p>` : "";
    const excerpt = post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : "";
    const href = postUrl(post.slug);
    return `
      <article class="blog-card">
        ${tag}
        <h2><a href="${href}">${escapeHtml(post.title)}</a></h2>
        ${excerpt}
        <a class="link-arrow" href="${href}">Read article →</a>
      </article>`;
  }

  fetch(`${apiBase}/api/posts?type=blog`)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((posts) => {
      if (!posts.length) return;
      grid.innerHTML = posts.map(card).join("");
    })
    .catch(() => {
      /* keep static HTML fallback */
    });
})();
