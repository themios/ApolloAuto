(function () {
  const catalog = document.getElementById("resources-catalog");
  if (!catalog) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function docCard(doc) {
    const hasFile = doc.file && !doc.comingSoon;
    const hasUrl = doc.url && !doc.comingSoon;
    let action = "";
    if (hasFile) {
      const label = doc.linkLabel || "Review document";
      let href = doc.file;
      if (doc.file.includes("contract-sections/")) {
        const fname = doc.file.split("/").pop();
        href =
          "forms/view.html?file=" +
          encodeURIComponent(fname) +
          "&title=" +
          encodeURIComponent(doc.title);
      }
      action = `<a class="doc-card-link" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    } else if (hasUrl) {
      const label = doc.linkLabel || "Read guide";
      action = `<a class="doc-card-link" href="${escapeHtml(doc.url)}">${escapeHtml(label)}</a>`;
    } else {
      action = `<span class="doc-card-soon">Coming soon</span>`;
    }
    return `
      <article class="doc-card">
        <h3 class="doc-card-title">${escapeHtml(doc.title)}</h3>
        <p class="doc-card-desc">${escapeHtml(doc.description || "")}</p>
        ${action}
      </article>`;
  }

  function render(data) {
    const categories = data.categories || [];
    const documents = data.documents || [];
    if (!categories.length) {
      catalog.innerHTML = "<p>No guides listed yet.</p>";
      return;
    }

    catalog.innerHTML = categories
      .map((cat) => {
        const items = documents.filter((d) => d.category === cat.id);
        if (!items.length) return "";
        return `
          <section class="resources-group" id="${escapeHtml(cat.id)}" aria-labelledby="${escapeHtml(cat.id)}-heading">
            <h2 class="resources-group-title" id="${escapeHtml(cat.id)}-heading">${escapeHtml(cat.title)}</h2>
            ${cat.intro ? `<p class="resources-group-intro">${escapeHtml(cat.intro)}</p>` : ""}
            <div class="doc-grid">${items.map(docCard).join("")}</div>
          </section>`;
      })
      .join("");
  }

  fetch("documents.json")
    .then((r) => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    })
    .then(render)
    .catch(() => {
      catalog.innerHTML =
        '<p class="resources-error">Guides could not be loaded. <a href="../index.html#contact">Contact Tim</a> and he will send you what you need.</p>';
    });
})();
