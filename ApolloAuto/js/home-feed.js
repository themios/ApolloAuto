(function () {
  const feedSection = document.getElementById("site-updates");
  const dailyEl = document.getElementById("feed-daily");
  const specialsEl = document.getElementById("feed-specials");
  const trendsEl = document.getElementById("feed-trends");
  const newsEl = document.getElementById("feed-news");
  const blogGrid = document.getElementById("home-blog-grid");

  if (!feedSection && !blogGrid) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function itemHtml(post, opts = {}) {
    const body = post.excerpt || "";
    const link = post.link_url
      ? `<a class="feed-link" href="${escapeHtml(post.link_url)}" target="_blank" rel="noopener">Learn more →</a>`
      : "";
    const tag = opts.tag ? `<span class="feed-tag">${escapeHtml(opts.tag)}</span>` : "";
    return `<article class="feed-item">${tag}<h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(body)}</p>${link}</article>`;
  }

  function renderBlock(el, posts, tag) {
    if (!el || !posts.length) return;
    el.innerHTML = posts.map((p) => itemHtml(p, { tag })).join("");
  }

  function blogCard(post) {
    const href = `blog/post.html?slug=${encodeURIComponent(post.slug)}`;
    const tag = post.category ? `<p class="blog-tag">${escapeHtml(post.category)}</p>` : "";
    return `
      <article class="blog-card">
        ${tag}
        <h3><a href="${href}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.excerpt || "")}</p>
      </article>`;
  }

  Promise.all([
    fetch("/api/feed").then((r) => (r.ok ? r.json() : null)),
    fetch("/api/posts?type=blog").then((r) => (r.ok ? r.json() : null)),
  ])
    .then(([feed, blogs]) => {
      if (feed && feedSection) {
        const hasContent =
          feed.daily?.length ||
          feed.specials?.length ||
          feed.trends?.length ||
          feed.news?.length;
        if (hasContent) {
          feedSection.hidden = false;
          if (feed.daily?.[0] && dailyEl) {
            const d = feed.daily[0];
            dailyEl.innerHTML = `<p class="feed-daily-text"><strong>${escapeHtml(d.title)}</strong> — ${escapeHtml(d.excerpt || "")}</p>`;
          }
          renderBlock(specialsEl, feed.specials || [], "Special");
          renderBlock(trendsEl, feed.trends || [], "Trend");
          renderBlock(newsEl, feed.news || [], "News");
        }
      }

      if (blogs?.length && blogGrid) {
        blogGrid.innerHTML = blogs.slice(0, 3).map(blogCard).join("");
      }
    })
    .catch(() => {
      /* static fallback remains */
    });
})();
