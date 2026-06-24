(function () {
  const carousel = document.querySelector("[data-testimonial-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const viewport = carousel.querySelector(".carousel-viewport");
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  const pauseBtn = carousel.querySelector("[data-carousel-pause]");
  const dotsHost = carousel.querySelector(".carousel-dots");
  if (!track || !viewport || !prevBtn || !nextBtn || !dotsHost) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let slides = [];
  let index = 0;
  let autoplayTimer = null;
  let paused = reducedMotion;

  fetch("/data/testimonials.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])
    .then((items) => {
      slides = Array.isArray(items) ? items : [];
      if (!slides.length) {
        carousel.hidden = true;
        return;
      }
      renderSlides(slides);
      renderDots(slides.length);
      bindControls();
      goTo(0, false);
      if (!paused) startAutoplay();
    });

  function renderSlides(items) {
    track.innerHTML = items
      .map(
        (item, i) => `
      <li class="carousel-slide${i === 0 ? " is-active" : ""}" id="testimonial-slide-${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}"${i === 0 ? "" : " hidden"}>
        <figure class="testimonial-card">
          <div class="testimonial-stars" aria-label="${item.rating} out of 5 stars">${"★".repeat(item.rating)}<span class="sr-only">${item.rating} out of 5</span></div>
          <blockquote><p>${escapeHtml(item.quote)}</p></blockquote>
          <figcaption><strong>${escapeHtml(item.name)}</strong> · ${escapeHtml(item.location)}</figcaption>
        </figure>
      </li>`
      )
      .join("");
  }

  function renderDots(count) {
    dotsHost.innerHTML = Array.from({ length: count }, (_, i) =>
      `<button type="button" class="carousel-dot${i === 0 ? " is-active" : ""}" data-carousel-dot="${i}" aria-label="Show review ${i + 1} of ${count}"${i === 0 ? ' aria-current="true"' : ""}></button>`
    ).join("");
  }

  function bindControls() {
    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    dotsHost.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-carousel-dot]");
      if (!btn) return;
      goTo(Number(btn.dataset.carouselDot));
    });

    if (pauseBtn) {
      pauseBtn.hidden = reducedMotion;
      pauseBtn.addEventListener("click", () => {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", String(paused));
        pauseBtn.textContent = paused ? "Play reviews" : "Pause reviews";
        if (paused) stopAutoplay();
        else startAutoplay();
      });
    }

    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", () => {
      if (!paused) startAutoplay();
    });

    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", () => {
      if (!paused) startAutoplay();
    });
  }

  function goTo(nextIndex, animate = true) {
    const count = slides.length;
    if (!count) return;
    index = ((nextIndex % count) + count) % count;

    track.querySelectorAll(".carousel-slide").forEach((el, i) => {
      const active = i === index;
      el.classList.toggle("is-active", active);
      el.hidden = !active;
      el.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dotsHost.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    viewport.setAttribute("aria-live", animate ? "polite" : "off");
  }

  function startAutoplay() {
    stopAutoplay();
    if (paused || slides.length < 2) return;
    autoplayTimer = window.setInterval(() => goTo(index + 1), 7000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
