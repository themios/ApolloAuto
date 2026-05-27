(function () {
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");
  const title = params.get("title");
  const frame = document.getElementById("pdf-frame");
  const titleEl = document.getElementById("doc-title");
  const openLink = document.getElementById("open-pdf");

  if (!file || !/^[\w.-]+\.pdf$/.test(file)) {
    titleEl.textContent = "Document not found";
    return;
  }

  const pdfUrl = "../../documents/contract-sections/" + encodeURIComponent(file);
  if (title) titleEl.textContent = title;
  frame.src = pdfUrl;
  openLink.href = pdfUrl;
})();
