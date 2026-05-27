(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  const expandBtn = document.getElementById("form-expand");
  const optional = document.getElementById("form-optional");
  if (expandBtn && optional) {
    expandBtn.addEventListener("click", () => {
      const open = expandBtn.getAttribute("aria-expanded") === "true";
      expandBtn.setAttribute("aria-expanded", String(!open));
      optional.hidden = open;
      expandBtn.innerHTML = open
        ? 'Add email or location <span aria-hidden="true">+</span>'
        : 'Hide optional fields <span aria-hidden="true">−</span>';
    });
  }

  const locationHidden = document.getElementById("location-hidden");
  document.querySelectorAll(".pill[data-location]").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill[data-location]").forEach((p) => p.classList.remove("is-selected"));
      pill.classList.add("is-selected");
      if (locationHidden) locationHidden.value = pill.dataset.location || "";
    });
  });

  const form = document.getElementById("lead-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) {
      e.preventDefault();
      return;
    }

    const required = form.querySelectorAll("[required]");
    let valid = true;
    required.forEach((field) => {
      field.classList.remove("error");
      if (!field.value.trim()) {
        field.classList.add("error");
        valid = false;
      }
    });
    if (!valid) {
      e.preventDefault();
      form.querySelector(".error")?.focus();
      return;
    }

    const interestHidden = document.getElementById("interest-hidden");
    if (interestHidden) interestHidden.value = "Website message";

    const action = form.getAttribute("action") || "";
    if (action.includes("formsubmit.co") && !action.includes("YOUR_EMAIL")) {
      return;
    }

    e.preventDefault();
    showSuccess();
  });

  function showSuccess() {
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  if (window.location.search.includes("submitted=true")) {
    showSuccess();
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
})();
