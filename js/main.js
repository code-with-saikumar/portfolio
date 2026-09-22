/* =========================================================
   main.js — cursor, nav, reveal, counters, magnetic, toast
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Year ---------------- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------------- Loader ---------------- */
  (function loader() {
    const el = $("#loader"); if (!el) return;
    const steps = $$("#loader-steps li");
    const bar = $(".loader-bar i");
    let i = 0;
    function next() {
      steps.forEach((s, k) => s.classList.toggle("active", k === i));
      if (bar) bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      i++;
      if (i < steps.length) setTimeout(next, 380);
      else setTimeout(() => el.classList.add("hide"), 500);
    }
    // Kick off after initial paint
    window.addEventListener("load", () => setTimeout(next, 120));
    // Fallback: never keep loader forever
    setTimeout(() => el.classList.add("hide"), 5000);
  })();

  /* ---------------- Nav scroll blur + hamburger ---------------- */
  const nav = $("#nav");
  const navLinks = $("#nav-links");
  const burger = $("#hamburger");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    const tt = $("#to-top");
    if (tt) tt.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks?.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navLinks.classList.remove("open");
      burger?.classList.remove("open");
      burger?.setAttribute("aria-expanded", "false");
    }
  });
  $("#to-top")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  const certModal = $("#certificate-modal");
  function closeCertificate() {
    certModal?.setAttribute("aria-hidden", "true");
    if (!["#project-modal", "#blog-modal"].some((id) => $(id)?.getAttribute("aria-hidden") === "false")) document.body.style.overflow = "";
  }
  certModal?.addEventListener("click", (e) => { if (e.target.matches("[data-certificate-close]")) closeCertificate(); });



  /* ---------------- Magnetic buttons ---------------- */
  if (!reduced && matchMedia("(hover:hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      $$(".magnetic").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
    });
  }, { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 });
  function observeReveals() {
    $$(".reveal:not(.in-view)").forEach((el) => io.observe(el));
    // Skill bar fill on view
    $$(".skill-bar i[data-fill]").forEach((bar) => {
      const io2 = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) { bar.style.width = bar.dataset.fill + "%"; io2.disconnect(); }
        });
      }, { threshold: 0.2 });
      io2.observe(bar);
    });
    // Counter animation
    $$("[data-counter]").forEach((el) => {
      const target = Number(el.dataset.counter) || 0;
      const io3 = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          if (!e.isIntersecting) return;
          io3.disconnect();
          const dur = 1400, start = performance.now();
          function tick(now) {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });
      io3.observe(el);
    });
  }
  document.addEventListener("DOMContentLoaded", observeReveals);
  window.addEventListener("portfolio:rendered", observeReveals);

  /* ---------------- Nav active section ---------------- */
  const sections = () => $$("main section[id]");
  const linkFor = (id) => $$(`#nav-links a[href="#${id}"]`)[0];
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const link = linkFor(e.target.id);
      if (link && e.isIntersecting) {
        $$("#nav-links a").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.addEventListener("DOMContentLoaded", () => sections().forEach((s) => navObs.observe(s)));

  /* ---------------- Contact form ---------------- */
  $("#contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entry = { at: new Date().toISOString(), ...Object.fromEntries(fd) };
    try {
      const inbox = JSON.parse(localStorage.getItem("portfolio:inbox") || "[]");
      inbox.push(entry);
      localStorage.setItem("portfolio:inbox", JSON.stringify(inbox));
    } catch {}
    e.currentTarget.reset();
    toast("Message sent — I'll get back to you soon.");
  });

  /* ---------------- Toast ---------------- */
  const toastEl = $("#toast");
  let toastT = null;
  window.toast = function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };
})();
