(function () {
  const catalog = document.getElementById("forms-catalog");
  if (!catalog) return;

  const GROUPS = [
    {
      id: "dmv",
      title: "California DMV & verification",
      intro: "Registration, report of sale, and vehicle verification forms.",
      match: (id) =>
        id.startsWith("reg-") ||
        id === "title-reassignment" ||
        id === "smog-check-vir",
    },
    {
      id: "financing",
      title: "Retail installment contract",
      intro: "Six-page financing agreement (LAW 553-CA). Read all pages before you sign.",
      match: (id) => id.startsWith("risc-page-"),
    },
    {
      id: "disclosures",
      title: "Disclosures & add-ons",
      intro: "Buyer's Guide, insurance, due bill, cancellation option, and pre-contract disclosure.",
      match: () => true,
    },
  ];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function card(section) {
    const href =
      "view.html?file=" +
      encodeURIComponent(section.file) +
      "&title=" +
      encodeURIComponent(section.title);
    return `
      <a class="forms-hub-card" href="${href}">
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.description || "")}</p>
        <span>Review document →</span>
      </a>`;
  }

  function render(data) {
    const sections = data.sections || [];
    const used = new Set();

    const html = GROUPS.map((group) => {
      const items = sections.filter((s) => {
        if (used.has(s.id)) return false;
        if (group.id === "disclosures") {
          return !(
            s.id.startsWith("reg-") ||
            s.id === "title-reassignment" ||
            s.id === "smog-check-vir" ||
            s.id.startsWith("risc-page-")
          );
        }
        return group.match(s.id);
      });
      items.forEach((s) => used.add(s.id));
      if (!items.length) return "";
      return `
        <section class="forms-group" aria-labelledby="${group.id}-heading">
          <h2 class="resources-group-title" id="${group.id}-heading">${escapeHtml(group.title)}</h2>
          ${group.intro ? `<p class="resources-group-intro">${escapeHtml(group.intro)}</p>` : ""}
          <div class="forms-hub-grid">${items.map(card).join("")}</div>
        </section>`;
    }).join("");

    catalog.innerHTML = html || "<p>No forms listed yet.</p>";
  }

  fetch("../../documents/contract-sections/manifest.json")
    .then((r) => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    })
    .then(render)
    .catch(() => {
      catalog.innerHTML =
        '<p class="resources-error">Forms could not be loaded. <a href="../../index.html#contact">Contact Tim</a> and he will send you the paperwork to review.</p>';
    });
})();
