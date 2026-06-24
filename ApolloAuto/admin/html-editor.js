(function (global) {
  let quill = null;
  let sourceMode = false;

  const toolbar = [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ];

  function wrap() {
    return document.getElementById("post-body-html-wrap");
  }

  function plainWrap() {
    return document.getElementById("post-body-plain-wrap");
  }

  function plainField() {
    return document.getElementById("post-body-plain");
  }

  function sourceField() {
    return document.getElementById("post-body-source");
  }

  function sourceBtn() {
    return document.getElementById("post-body-source-btn");
  }

  function ensureQuill() {
    if (quill || typeof Quill === "undefined") return quill;
    quill = new Quill("#post-body-editor", {
      theme: "snow",
      modules: { toolbar },
      placeholder: "Write your article…",
    });
    return quill;
  }

  function setSourceMode(on) {
    sourceMode = on;
    const editor = ensureQuill();
    const htmlWrap = wrap();
    const source = sourceField();
    const btn = sourceBtn();
    if (!editor || !htmlWrap || !source || !btn) return;

    if (sourceMode) {
      source.value = normalizeHtml(editor.root.innerHTML);
      htmlWrap.classList.add("is-source");
      btn.textContent = "Visual editor";
      btn.setAttribute("aria-pressed", "true");
    } else {
      editor.root.innerHTML = source.value || "";
      htmlWrap.classList.remove("is-source");
      btn.textContent = "Edit HTML";
      btn.setAttribute("aria-pressed", "false");
    }
  }

  function normalizeHtml(html) {
    const trimmed = (html || "").trim();
    if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<p></p>") return "";
    return trimmed;
  }

  function setMode(isBlog) {
    const htmlWrap = wrap();
    const plain = plainWrap();
    if (!htmlWrap || !plain) return;

    if (isBlog) {
      ensureQuill();
      plain.hidden = true;
      htmlWrap.hidden = false;
      if (sourceMode) setSourceMode(false);
    } else {
      plain.hidden = false;
      htmlWrap.hidden = true;
      if (sourceMode) setSourceMode(false);
    }
  }

  function setContent(html) {
    const value = html || "";
    if (wrap()?.hidden) {
      plainField().value = value;
      return;
    }
    ensureQuill();
    if (sourceMode) {
      sourceField().value = value;
    } else if (quill) {
      quill.root.innerHTML = value || "";
    }
  }

  function getContent(isBlog) {
    if (!isBlog) return plainField().value.trim() || null;
    if (sourceMode) return normalizeHtml(sourceField().value) || null;
    if (!quill) return null;
    return normalizeHtml(quill.root.innerHTML) || null;
  }

  function toggleSourceMode() {
    setSourceMode(!sourceMode);
  }

  global.HtmlEditor = {
    setMode,
    setContent,
    getContent,
    toggleSourceMode,
  };
})(window);
