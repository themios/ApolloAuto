(function () {
  const gallery = document.querySelector("[data-hero-gallery]");
  if (!gallery) return;

  const img = gallery.querySelector(".hero-gallery-img");
  const dotsHost = gallery.querySelector(".hero-gallery-dots");
  const caption = gallery.querySelector(".hero-gallery-caption");
  if (!img || !dotsHost) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let slides = [];
  let index = 0;
  let timer = null;

  fetch("/data/hero-slides.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])
    .then((items) => {
      slides = Array.isArray(items) ? items : [];
      if (!slides.length) return;
      renderDots(slides.length);
      show(0);
      bindDots();
      if (!reducedMotion && slides.length > 1) start();
    });

  function show(i) {
    index = i;
    const slide = slides[index];
    img.src = slide.src;
    img.alt = slide.alt;
    if (caption) caption.textContent = slide.caption || "";
    dotsHost.querySelectorAll(".hero-gallery-dot").forEach((dot, di) => {
      dot.classList.toggle("is-active", di === index);
      dot.setAttribute("aria-current", di === index ? "true" : "false");
    });
  }

  function renderDots(count) {
    dotsHost.innerHTML = Array.from({ length: count }, (_, i) =>
      `<button type="button" class="hero-gallery-dot${i === 0 ? " is-active" : ""}" data-hero-dot="${i}" aria-label="Show photo ${i + 1} of ${count}"></button>`
    ).join("");
  }

  function bindDots() {
    dotsHost.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-hero-dot]");
      if (!btn) return;
      stop();
      show(Number(btn.dataset.heroDot));
      if (!reducedMotion) start();
    });
  }

  function start() {
    stop();
    timer = window.setInterval(() => show((index + 1) % slides.length), 6000);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", () => {
    if (!reducedMotion && slides.length > 1) start();
  });
})();
