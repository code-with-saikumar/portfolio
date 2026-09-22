/* =========================================================
   projects.js — renders data-driven sections
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function phSvg(seed) {
    const hues = [
      ["#22E9FF", "#7C5CFF"],
      ["#FF3DCB", "#7C5CFF"],
      ["#B6FF3C", "#22E9FF"],
      ["#7C5CFF", "#FF3DCB"],
      ["#22E9FF", "#B6FF3C"],
      ["#FF3DCB", "#22E9FF"],
    ];
    const [a, b] = hues[Math.abs(seed) % hues.length];
    return `<svg viewBox='0 0 400 250' width='100%' height='100%' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g${seed}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}' stop-opacity='.35'/><stop offset='1' stop-color='${b}' stop-opacity='.15'/></linearGradient></defs><rect width='400' height='250' fill='#0A0D18'/><rect width='400' height='250' fill='url(#g${seed})'/><g stroke='rgba(255,255,255,.08)' stroke-width='1'><path d='M0 60h400M0 120h400M0 180h400M80 0v250M160 0v250M240 0v250M320 0v250'/></g><circle cx='${80 + (seed*40 % 240)}' cy='125' r='60' fill='${a}' opacity='.35'/></svg>`;
  }

  function bindText(data) {
    $$("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind").split(".");
      let v = data;
      for (const k of path) v = v?.[k];
      if (v != null) el.textContent = v;
    });
    const h = data.homepage || {};
    $$('[data-home-bind]').forEach((el) => { const value = h[el.getAttribute('data-home-bind')]; if (value != null) el.textContent = value; });
    $$('[data-home-list]').forEach((el) => {
      const values = Array.isArray(h[el.getAttribute('data-home-list')]) ? h[el.getAttribute('data-home-list')] : [];
      if (el.classList.contains('hero-stats') || el.classList.contains('about-list')) {
        el.innerHTML = values.map((value) => { const [strong, label] = String(value).split('|'); const counter = /^\d+$/.test(strong) ? ` data-counter="${strong}"` : ''; return `<li><b${counter}>${esc(strong)}</b><span>${esc(label || '')}</span></li>`; }).join('');
      } else if (el.classList.contains('float-chips')) {
        el.innerHTML = values.map((value, i) => `<span class="chip" style="--d:${(i % 6) * .3}s">${esc(value)}</span>`).join('');
      }
    });
    $$("[data-bind-href]").forEach((el) => {
      const path = el.getAttribute("data-bind-href").split(".");
      let v = data; for (const k of path) v = v?.[k];
      if (v) el.setAttribute("href", `mailto:${v}`);
    });
    $$("[data-bind-href-tel]").forEach((el) => {
      const path = el.getAttribute("data-bind-href-tel").split(".");
      let v = data; for (const k of path) v = v?.[k];
      if (v) el.setAttribute("href", `tel:${String(v).replace(/\s+/g, "")}`);
    });
  }

  function renderTheme(t) {
    const r = document.documentElement.style;
    if (t?.accent) r.setProperty("--accent", t.accent);
    if (t?.accent2) r.setProperty("--accent-2", t.accent2);
    if (t?.accent3) r.setProperty("--accent-3", t.accent3);
  }

  function iconMarkup(item) {
    if (item?.icon) return `<span class="tool-icon"><img src="${esc(item.icon)}" alt="" loading="lazy" onerror="this.parentElement.classList.add('broken');this.remove()"></span>`;
    const letter = esc(String(item?.name || "?").trim().charAt(0).toUpperCase() || "?");
    return `<span class="tool-icon tool-fallback">${letter}</span>`;
  }

  function renderSkills(list) {
    const grid = $("#skills-grid"); if (!grid) return;
    grid.innerHTML = list.map((cat) => `
      <article class="glass skill-card tilt reveal" data-reveal="fade-up">
        <header class="skill-head">
          <span class="ico">${esc(cat.icon || "◆")}</span>
          <h3>${esc(cat.category)}</h3>
        </header>
        <div class="skill-rows">
          ${(cat.items || []).map((tool) => `
            <div class="skill-row">${iconMarkup(tool)}<span class="name">${esc(tool.name)}</span></div>
          `).join("")}
        </div>
      </article>
    `).join("");
  }

  function renderProjects(list) {
    const grid = $("#projects-grid"); if (!grid) return;
    grid.innerHTML = list.map((p, i) => {
      const href = `project.html?id=${i}`;
      return `
      <article class="glass project-card tilt reveal" data-reveal="fade-up">
        <a class="project-media project-open" data-project-index="${i}" href="${href}" aria-label="View ${esc(p.title)} details">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" class="ph" />` : `<div class="ph">${phSvg(i)}</div>`}</a>
        <div class="project-body">
          <a class="project-title-link project-open" data-project-index="${i}" href="${href}"><h3>${esc(p.title)}</h3></a>
          ${p.duration ? `<p class="project-duration">Duration: ${esc(p.duration)}</p>` : ""}
          <p class="muted">${esc(p.desc)}</p>
          <div class="project-tech">${(p.tech || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="project-links">
            ${p.github && p.github !== "#" ? `<a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">↗ GitHub</a>` : ""}
            ${p.live && p.live !== "#" ? `<a href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">↗ Live Demo</a>` : ""}
            <a class="project-open" data-project-index="${i}" href="${href}">↗ Case Study</a>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function renderTimeline(sel, list) {
    const el = $(sel); if (!el) return;
    el.innerHTML = list.map((x) => `
      <li class="reveal" data-reveal="fade-up">
        <div class="glass card">
          <h3>${esc(x.role)}</h3>
          <p class="meta">${esc(x.org)} · ${esc(x.date)}</p>
          <p class="muted">${esc(x.desc)}</p>
        </div>
      </li>
    `).join("");
  }

  function renderCerts(list) {
    const grid = $("#cert-grid"); if (!grid) return;
    grid.innerHTML = list.map((c, i) => `
      <article class="glass cert-card tilt reveal" data-reveal="fade-up">
        <button class="cert-media cert-open" type="button" data-cert-index="${i}" aria-label="View ${esc(c.title)}">
          ${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy" />` : `<div class="ph">${phSvg(i + 20)}</div>`}
        </button>
        <div class="cert-body">
          <button class="cert-title cert-open" type="button" data-cert-index="${i}">${esc(c.title)}</button>
          <p class="muted">${esc(c.issuer)}</p>
            ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">↗ View</a>` : `<span class="muted cert-unavailable">Certificate link not added</span>`}
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".cert-open").forEach((btn) => btn.addEventListener("click", () => openCert(list[Number(btn.dataset.certIndex)])));
  }

  function openCert(c) {
    const modal = $("#certificate-modal");
    if (!modal) return;
    $("#certificate-modal-title").textContent = c?.title || "Certificate";
    $("#certificate-modal-issuer").textContent = c?.issuer || "";
    const img = $("#certificate-modal-image");
    if (c?.image) { img.src = c.image; img.alt = c.title || "Certificate"; img.hidden = false; }
    else { img.removeAttribute("src"); img.hidden = true; }
    const link = $("#certificate-modal-link");
    if (c?.url) { link.href = c.url; link.hidden = false; } else { link.hidden = true; }
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function openContentModal(id, item) {
    const modal = $(id); if (!modal || !item) return;
    const isProject = id === "#project-modal";
    const media = $(`${id}-media`);
    media.innerHTML = item.image || item.cover ? `<img src="${esc(item.image || item.cover)}" alt="${esc(item.title)}" />` : phSvg(isProject ? 0 : 40);
    $(`${id}-title`).textContent = item.title || "";
    $(`${id}-description`).textContent = isProject ? (item.fullDescription || item.desc || "") : (item.content || item.excerpt || "");
    if (isProject) {
      $(`${id}-duration`).textContent = item.duration ? `Duration: ${item.duration}` : "";
      $(`${id}-tech`).innerHTML = (item.tech || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
      const cs = item.caseStudy || {};
      $(`${id}-sections`).innerHTML = [["Overview", cs.overview], ["Key Features", (cs.features || []).join("\n")], ["My Role", cs.role], ["Challenges", cs.challenges], ["Solution", cs.solution], ["Results / Outcome", cs.results]].filter(([, value]) => value).map(([label, value]) => `<section><h3>${label}</h3><p>${esc(value).replace(/\n/g, "<br>")}</p></section>`).join("");
      $(`${id}-links`).innerHTML = [item.github && item.github !== "#" ? `<a class="btn ghost" href="${esc(item.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : "", item.live && item.live !== "#" ? `<a class="btn primary" href="${esc(item.live)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ""].join("");
    } else {
      $(`${id}-meta`).textContent = [item.category, item.date, item.read].filter(Boolean).join(" · ");
    }
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeContentModal(modal) {
    modal?.setAttribute("aria-hidden", "true");
    if (!["#project-modal", "#blog-modal", "#certificate-modal"].some((id) => $(id)?.getAttribute("aria-hidden") === "false")) document.body.style.overflow = "";
  }

  function renderCounters(list) {
    const el = $("#counters"); if (!el) return;
    el.innerHTML = list.map((c) => `
      <div class="glass counter tilt reveal" data-reveal="scale">
        <b data-counter="${Number(c.value) || 0}">0</b>
        <span>${esc(c.label)}</span>
      </div>
    `).join("");
  }

  let allBlog = [];
  function renderBlog(list) {
    allBlog = list.slice();
    const sel = $("#blog-cat");
    const previous = sel?.value || "All";
    const cats = ["All", ...Array.from(new Set(list.map((b) => b.category).filter(Boolean)))];
    if (sel) { sel.innerHTML = cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join(""); sel.value = cats.includes(previous) ? previous : "All"; }
    drawBlog();
  }

  function drawBlog() {
    const grid = $("#blog-grid"); if (!grid) return;
    const q = ($("#blog-search")?.value || "").trim().toLowerCase();
    const cat = $("#blog-cat")?.value || "All";
    const filtered = allBlog.filter((b) => {
      const inCat = cat === "All" || b.category === cat;
      const inQ = !q || [b.title, b.category, b.date, b.read, b.excerpt, b.content].filter(Boolean).join(" ").toLowerCase().includes(q);
      return inCat && inQ;
    });
    grid.innerHTML = filtered.map((b, i) => `
      <article class="glass blog-card tilt reveal blog-open" data-blog-index="${allBlog.indexOf(b)}" data-reveal="fade-up" tabindex="0" role="button">
        <div class="ph">${b.cover ? `<img src="${esc(b.cover)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"/>` : phSvg(i + 40)}</div>
        <div class="blog-body">
          <div class="blog-meta"><span>${esc(b.category)}</span><span>${esc(b.date)}</span><span>${esc(b.read)}</span></div>
          <h3>${esc(b.title)}</h3>
          <p class="muted">${esc(b.excerpt)}</p>
        </div>
      </article>
    `).join("") || `<p class="muted">No articles match your search.</p>`;
  }

  function renderSocials(list) {
    const el = $("#socials"); if (!el) return;
    el.innerHTML = list.map((s) =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">↗ ${esc(s.name)}</a></li>`
    ).join("");
  }

  function renderResume(data) {
    const url = data.resume || "";
    const rlink = $("#resume-link");
    const cta = $("#cta-resume");
    [rlink, cta].forEach((a) => {
      if (!a) return;
      if (url) { a.setAttribute("href", url); a.setAttribute("download", "resume.pdf"); }
      else { a.setAttribute("href", "#contact"); a.removeAttribute("download"); }
    });
  }

  function renderAll(data) {
    bindText(data);
    renderTheme(data.theme);
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    renderTimeline("#experience-list", data.experience || []);
    renderTimeline("#education-list", data.education || []);
    renderCerts(data.certificates || []);
    renderCounters(data.achievements || []);
    renderBlog(data.blog || []);
    renderSocials(data.socials || []);
    renderResume(data);
    // notify main.js so it can re-observe new nodes
    window.dispatchEvent(new CustomEvent("portfolio:rendered"));
  }

  window.Render = { all: renderAll, blog: drawBlog };

  document.addEventListener("DOMContentLoaded", () => {
    renderAll(window.Store.get());
    $("#blog-search")?.addEventListener("input", drawBlog);
    $("#blog-cat")?.addEventListener("change", drawBlog);
    $("#projects-grid")?.addEventListener("click", (e) => { const link = e.target.closest(".project-open"); if (!link) return; e.preventDefault(); openContentModal("#project-modal", window.Store.get().projects[Number(link.dataset.projectIndex)]); });
    $("#blog-grid")?.addEventListener("click", (e) => { const card = e.target.closest(".blog-open"); if (card) openContentModal("#blog-modal", allBlog[Number(card.dataset.blogIndex)]); });
    $("#blog-grid")?.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const card = e.target.closest(".blog-open"); if (card) openContentModal("#blog-modal", allBlog[Number(card.dataset.blogIndex)]); } });
    document.querySelectorAll(".content-modal").forEach((modal) => modal.addEventListener("click", (e) => { if (e.target.matches("[data-content-close]")) closeContentModal(modal); }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { document.querySelectorAll(".content-modal[aria-hidden=\"false\"], #certificate-modal[aria-hidden=\"false\"]").forEach(closeContentModal); } });
  });

  window.addEventListener("portfolio:update", (e) => renderAll(e.detail));
})();
