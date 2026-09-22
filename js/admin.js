/* =========================================================
   admin.js — PIN login + dashboard editor
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- PIN modal ---------- */
  const pinModal = $("#pin-modal");
  const pinCard = pinModal?.querySelector(".modal-card");
  const pinInputs = $$("#pin-inputs input");
  const pinErr = $("#pin-err");

  function openPin() {
    if (!pinModal) return;
    pinModal.setAttribute("aria-hidden", "false");
    pinErr.textContent = "";
    pinInputs.forEach((i) => (i.value = ""));
    setTimeout(() => pinInputs[0]?.focus(), 50);
  }
  function closePin() { pinModal?.setAttribute("aria-hidden", "true"); }

  $("#admin-open")?.addEventListener("click", openPin);
  pinModal?.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closePin();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closePin(); }
  });

  pinInputs.forEach((inp, i) => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
      if (inp.value && i < pinInputs.length - 1) pinInputs[i + 1].focus();
      if (pinInputs.every((x) => x.value)) trySubmit();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && i > 0) pinInputs[i - 1].focus();
    });
  });

  async function trySubmit() {
    const pin = pinInputs.map((i) => i.value).join("");
    if (pin.length !== 4) return;
    const ok = await window.Store.checkPin(pin);
    if (ok) { closePin(); openAdmin(); }
    else {
      pinErr.textContent = "Wrong PIN. Try again.";
      pinCard.classList.remove("shake"); void pinCard.offsetWidth;
      pinCard.classList.add("shake");
      pinInputs.forEach((i) => (i.value = ""));
      pinInputs[0]?.focus();
    }
  }

  /* ---------- Admin dashboard ---------- */
  const admin = $("#admin");
  const body = $("#admin-body");
  const title = $("#admin-title");
  const nav = $("#admin-nav");

  let draft = null; // working copy
  let active = "dashboard";

  const SECTIONS = [
    { id: "dashboard",   label: "Dashboard" },
    { id: "site",        label: "Site" },
    { id: "homepage",    label: "Homepage Content" },
    { id: "hero",        label: "Hero" },
    { id: "about",       label: "About" },
    { id: "skills",      label: "Skills" },
    { id: "projects",    label: "Projects" },
    { id: "featured",    label: "Featured Project" },
    
    { id: "experience",  label: "Experience" },
    { id: "education",   label: "Education" },
    { id: "certificates",label: "Certificates" },
    { id: "achievements",label: "Achievements" },
    { id: "blog",        label: "Blog" },
    { id: "contact",     label: "Contact" },
    { id: "socials",     label: "Social Links" },
    { id: "theme",       label: "Theme" },
    { id: "resume",      label: "Resume" },
    { id: "security",    label: "Security (PIN)" },
  ];

  function openAdmin() {
    draft = JSON.parse(JSON.stringify(window.Store.get()));
    admin.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    nav.innerHTML = SECTIONS.map((s) => `<button data-nav="${s.id}">${s.label}</button>`).join("");
    if (nav.dataset.wired !== "true") { nav.addEventListener("click", onNav); nav.dataset.wired = "true"; }
    show("dashboard");
  }
  function closeAdmin() {
    admin.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function onNav(e) {
    const b = e.target.closest("[data-nav]"); if (!b) return;
    show(b.dataset.nav);
  }

  function show(id) {
    active = id;
    title.textContent = SECTIONS.find((s) => s.id === id)?.label || id;
    $$("#admin-nav button").forEach((b) => b.classList.toggle("active", b.dataset.nav === id));
    body.innerHTML = renderView(id);
    wireView(id);
  }

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function field(label, name, value, type = "text") {
    return `<div class="field"><label>${esc(label)}</label><input class="input" name="${name}" type="${type}" value="${esc(value)}"/></div>`;
  }
  function area(label, name, value) {
    return `<div class="field"><label>${esc(label)}</label><textarea class="input" name="${name}">${esc(value)}</textarea></div>`;
  }

  function readImage(file, maxKB = 2000) {
    return new Promise((res, rej) => {
      if (!file) return res("");
      if (file.size / 1024 > maxKB) return rej(new Error("Image too large (max " + maxKB + "KB)"));
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
  }

  /* ---------- views ---------- */
  function renderView(id) {
    if (id === "dashboard") return viewDashboard();
    if (id === "site") return viewSite();
    if (id === "homepage") return viewHomepage();
    if (id === "hero") return viewHero();
    if (id === "about") return viewAbout();
    if (id === "skills") return viewSkills();
    if (id === "projects") return viewProjects();
    if (id === "featured") return viewFeatured();
    if (id === "experience") return viewList("experience", ["role","org","date","desc"]);
    if (id === "education") return viewList("education", ["role","org","date","desc"]);
    if (id === "certificates") return viewCertificates();
    if (id === "achievements") return viewList("achievements", ["label","value"]);
    if (id === "blog") return viewBlog();
    if (id === "contact") return viewContact();
    if (id === "socials") return viewList("socials", ["name","url"]);
    if (id === "theme") return viewTheme();
    if (id === "resume") return viewResume();
    if (id === "security") return viewSecurity();
    return "";
  }

  function viewDashboard() {
    const d = draft;
    return `<section class="glass card">
      <h3>Welcome back 👋</h3>
      <p class="muted">Edit any section from the sidebar. Changes update the site live. Click <b>Save</b> to persist to your browser's local storage.</p>
      <div class="row" style="margin-top:14px">
        <div class="list-item"><b>${d.projects.length}</b><br/><span class="muted">Projects</span></div>
        <div class="list-item"><b>${d.blog.length}</b><br/><span class="muted">Blog posts</span></div>
        <div class="list-item"><b>${d.skills.length}</b><br/><span class="muted">Skill groups</span></div>
        <div class="list-item"><b>${d.certificates.length}</b><br/><span class="muted">Certificates</span></div>
      </div>
    </section>`;
  }

  function viewSite() {
    return `<section class="glass card">
      ${field("Site name", "site.name", draft.site.name)}
      ${field("Site tagline", "site.tagline", draft.site.tagline)}
    </section>`;
  }

  function viewHomepage() {
    const home = draft.homepage || {};
    return `<section class="glass card">
      ${field("Availability label", "homepage.availability", home.availability || "Available for work")}
      ${field("Hero greeting", "homepage.greeting", home.greeting || "Hi, I'm")}
      ${field("Hero button: projects", "homepage.projectsButton", home.projectsButton || "View Projects")}
      ${field("Hero button: contact", "homepage.contactButton", home.contactButton || "Hire Me")}
      ${field("Resume button", "homepage.resumeButton", home.resumeButton || "Download Resume")}
      ${area("Hero statistics (value|label, one per line)", "homepage.heroStats", (home.heroStats || []).join("\n"))}
      ${field("Terminal title", "homepage.terminalTitle", home.terminalTitle || "~/sai-kumar/portfolio")}
      ${area("Terminal content (one line per line)", "homepage.terminalContent", home.terminalContent || "")}
      ${area("Technology chips (one per line)", "homepage.technologyChips", (home.technologyChips || []).join("\n"))}
      ${field("About section label", "homepage.aboutKicker", home.aboutKicker || "About")}
      ${field("About heading", "homepage.aboutTitle", home.aboutTitle || "")}
      ${area("About highlights (value|label, one per line)", "homepage.aboutHighlights", (home.aboutHighlights || []).join("\n"))}
      ${field("About mission", "homepage.mission", home.mission || "")}
      ${field("Skills section label", "homepage.skillsKicker", home.skillsKicker || "Skills")}
      ${field("Skills heading", "homepage.skillsTitle", home.skillsTitle || "")}
      ${field("Projects section label", "homepage.projectsKicker", home.projectsKicker || "Work")}
      ${field("Projects heading", "homepage.projectsTitle", home.projectsTitle || "")}
      ${field("Experience section label", "homepage.experienceKicker", home.experienceKicker || "Experience")}
      ${field("Experience heading", "homepage.experienceTitle", home.experienceTitle || "")}
      ${field("Education section label", "homepage.educationKicker", home.educationKicker || "Education")}
      ${field("Education heading", "homepage.educationTitle", home.educationTitle || "")}
      ${field("Certificates section label", "homepage.certificatesKicker", home.certificatesKicker || "Certificates")}
      ${field("Certificates heading", "homepage.certificatesTitle", home.certificatesTitle || "")}
      ${field("Achievements section label", "homepage.achievementsKicker", home.achievementsKicker || "Achievements")}
      ${field("Achievements heading", "homepage.achievementsTitle", home.achievementsTitle || "")}
      ${field("Blog section label", "homepage.blogKicker", home.blogKicker || "Blog")}
      ${field("Blog heading", "homepage.blogTitle", home.blogTitle || "")}
      ${field("Contact section label", "homepage.contactKicker", home.contactKicker || "Contact")}
      ${field("Contact heading", "homepage.contactTitle", home.contactTitle || "")}
      ${field("Footer copyright", "homepage.copyright", home.copyright || "All rights reserved.")}
    </section>`;
  }

  function viewHero() {
    return `<section class="glass card">
      ${field("Name", "hero.name", draft.hero.name)}
      ${field("Location", "hero.location", draft.hero.location)}
      ${area("Tagline", "hero.tagline", draft.hero.tagline)}
      ${area("Roles (one per line)", "hero.roles", (draft.hero.roles || []).join("\n"))}
    </section>`;
  }

  function viewAbout() {
    return `<section class="glass card">
      ${area("Bio", "about.bio", draft.about.bio)}
    </section>`;
  }

  function viewFeatured() {
    return `<section class="glass card">
      ${field("Title", "featured.title", draft.featured.title)}
      ${area("Description", "featured.description", draft.featured.description)}
    </section>`;
  }

  function viewContact() {
    return `<section class="glass card">
      ${field("Email", "contact.email", draft.contact.email, "email")}
      ${field("Phone", "contact.phone", draft.contact.phone)}
      ${field("Location", "contact.location", draft.contact.location)}
    </section>`;
  }

  function viewTheme() {
    return `<section class="glass card">
      <div class="row">
        ${field("Accent 1", "theme.accent", draft.theme.accent, "color")}
        ${field("Accent 2", "theme.accent2", draft.theme.accent2, "color")}
      </div>
      ${field("Accent 3", "theme.accent3", draft.theme.accent3, "color")}
    </section>`;
  }

  function viewResume() {
    return `<section class="glass card">
      <p class="muted">Upload a PDF. It's stored in your browser and served for the Resume button.</p>
      <div class="field"><label>Resume PDF</label><input class="input" type="file" accept="application/pdf" data-resume/></div>
      ${draft.resume ? `<p class="muted">✓ Resume uploaded. <a href="${draft.resume}" target="_blank" style="color:var(--accent)">Preview</a></p>` : `<p class="muted">No resume uploaded.</p>`}
      <button class="mini-btn danger" data-clear-resume>Clear resume</button>
    </section>`;
  }

  function viewSecurity() {
    return `<section class="glass card">
      <p class="muted">Change the 4-digit PIN used to open the admin dashboard.</p>
      ${field("New PIN (4 digits)", "newpin", "", "password")}
      <button class="btn primary" data-set-pin>Update PIN</button>
    </section>`;
  }

  function viewSkills() {
    return `<section class="glass card">
      <div class="list-item-head"><b>Skill Domains & Tools</b>
        <div class="list-actions"><button class="mini-btn" data-add-skill-group>+ Add domain</button></div>
      </div>
      ${draft.skills.map((g, gi) => `
        <div class="list-item">
          <div class="list-item-head">
            <b>${esc(g.category)}</b>
            <div class="list-actions">
              <button class="mini-btn" data-move="skills" data-i="${gi}" data-dir="-1">↑</button>
              <button class="mini-btn" data-move="skills" data-i="${gi}" data-dir="1">↓</button>
              <button class="mini-btn danger" data-del="skills" data-i="${gi}">Delete</button>
            </div>
          </div>
          <div class="row">${field("Domain name", `skills.${gi}.category`, g.category)}${field("Domain icon", `skills.${gi}.icon`, g.icon)}</div>
          ${(g.items || []).map((it, ii) => `
            <div class="skill-admin-item">
              ${field(`Tool / Language ${ii + 1}`, `skills.${gi}.items.${ii}.name`, it.name)}
              ${field("Tool icon URL", `skills.${gi}.items.${ii}.icon`, it.icon || "", "url")}
              <div class="field"><label>Upload tool icon</label><input class="input" type="file" accept="image/*" data-img="skills.${gi}.items.${ii}.icon"/>${it.icon ? `<img src="${esc(it.icon)}" alt="" class="admin-image-preview"/>` : `<span class="muted">No icon image — initials will be shown.</span>`}</div>
              <div class="list-actions"><button class="mini-btn" data-move-skill data-gi="${gi}" data-ii="${ii}" data-dir="-1">↑</button><button class="mini-btn" data-move-skill data-gi="${gi}" data-ii="${ii}" data-dir="1">↓</button><button class="mini-btn danger" data-del-skill data-gi="${gi}" data-ii="${ii}">Delete tool</button></div>
            </div>
          `).join("")}
          <button class="mini-btn" data-add-skill data-gi="${gi}">+ Add tool / language</button>
        </div>
      `).join("")}
    </section>`;
  }

  function viewProjects() {
    return `<section class="glass card">
      <div class="list-item-head"><b>Projects</b>
        <div class="list-actions"><button class="mini-btn" data-add="projects" data-tpl='${JSON.stringify({title:"New Project",desc:"",fullDescription:"",tech:[],github:"",live:"",image:"",duration:"",caseStudy:{overview:"",features:[],role:"",challenges:"",solution:"",results:""}})}'>+ Add project</button></div>
      </div>
      ${draft.projects.map((p, i) => `
        <div class="list-item">
          <div class="list-item-head"><b>${esc(p.title)}</b>
            <div class="list-actions">
              <button class="mini-btn" data-move="projects" data-i="${i}" data-dir="-1">↑</button>
              <button class="mini-btn" data-move="projects" data-i="${i}" data-dir="1">↓</button>
              <button class="mini-btn" data-dup="projects" data-i="${i}">Duplicate</button>
              <button class="mini-btn danger" data-del="projects" data-i="${i}">Delete</button>
            </div>
          </div>
          <div class="row">${field("Title", `projects.${i}.title`, p.title)}${field("Duration", `projects.${i}.duration`, p.duration || "")}</div>
          ${field("Tech stack (comma-separated)", `projects.${i}.tech`, (p.tech || []).join(", "))}
          ${area("Short description", `projects.${i}.desc`, p.desc)}
          ${area("Complete description", `projects.${i}.fullDescription`, p.fullDescription || p.desc || "")}
          <div class="row">${field("GitHub URL", `projects.${i}.github`, p.github)}${field("Live URL", `projects.${i}.live`, p.live)}</div>
          ${field("Cover image URL", `projects.${i}.image`, p.image || "", "url")}
          <div class="field"><label>Upload cover image</label><input class="input" type="file" accept="image/*" data-img="projects.${i}.image"/>${p.image ? `<img src="${esc(p.image)}" alt="" class="admin-image-preview wide"/>` : ""}</div>
          <div class="case-study-editor">
            <h4>Case Study</h4>
            ${area("Overview", `projects.${i}.caseStudy.overview`, p.caseStudy?.overview || "")}
            ${area("Features (one per line)", `projects.${i}.caseStudy.features`, (p.caseStudy?.features || []).join("\n"))}
            ${field("My role", `projects.${i}.caseStudy.role`, p.caseStudy?.role || "")}
            ${area("Challenges", `projects.${i}.caseStudy.challenges`, p.caseStudy?.challenges || "")}
            ${area("Solution", `projects.${i}.caseStudy.solution`, p.caseStudy?.solution || "")}
            ${area("Results / Outcome", `projects.${i}.caseStudy.results`, p.caseStudy?.results || "")}
          </div>
        </div>
      `).join("")}
    </section>`;
  }

  function viewCertificates() {
    return `<section class="glass card">
      <div class="list-item-head"><b>Certificates</b>
        <div class="list-actions"><button class="mini-btn" data-add="certificates" data-tpl='${JSON.stringify({title:"New Certificate",issuer:"",url:"",image:""})}'>+ Add certificate</button></div>
      </div>
      ${draft.certificates.map((c, i) => `
        <div class="list-item">
          <div class="list-item-head"><b>${esc(c.title)}</b><div class="list-actions"><button class="mini-btn" data-move="certificates" data-i="${i}" data-dir="-1">↑</button><button class="mini-btn" data-move="certificates" data-i="${i}" data-dir="1">↓</button><button class="mini-btn danger" data-del="certificates" data-i="${i}">Delete</button></div></div>
          ${field("Certificate title", `certificates.${i}.title`, c.title)}
          ${field("Issuer", `certificates.${i}.issuer`, c.issuer)}
          ${field("Certificate link", `certificates.${i}.url`, c.url)}
          ${field("Certificate image URL", `certificates.${i}.image`, c.image || "", "url")}
          <div class="field"><label>Upload certificate image</label><input class="input" type="file" accept="image/*" data-img="certificates.${i}.image"/>${c.image ? `<img src="${esc(c.image)}" alt="" class="admin-image-preview wide"/>` : ""}</div>
        </div>
      `).join("")}
    </section>`;
  }

  function viewBlog() {
    return `<section class="glass card">
      <div class="list-item-head"><b>Blog Posts</b>
        <div class="list-actions"><button class="mini-btn" data-add="blog" data-tpl='{"title":"New Post","category":"Web","read":"5 min","date":"${new Date().toISOString().slice(0,10)}","excerpt":"","cover":""}'>+ Add post</button></div>
      </div>
      ${draft.blog.map((b, i) => `
        <div class="list-item">
          <div class="list-item-head"><b>${esc(b.title)}</b>
            <div class="list-actions">
              <button class="mini-btn" data-move="blog" data-i="${i}" data-dir="-1">↑</button>
              <button class="mini-btn" data-move="blog" data-i="${i}" data-dir="1">↓</button>
              <button class="mini-btn" data-dup="blog" data-i="${i}">Duplicate</button>
              <button class="mini-btn danger" data-del="blog" data-i="${i}">Delete</button>
            </div>
          </div>
          <div class="row">
            ${field("Title", `blog.${i}.title`, b.title)}
            ${field("Category", `blog.${i}.category`, b.category)}
          </div>
          <div class="row">
            ${field("Read time", `blog.${i}.read`, b.read)}
            ${field("Date", `blog.${i}.date`, b.date, "date")}
          </div>
          ${area("Excerpt", `blog.${i}.excerpt`, b.excerpt)}
          ${field("Cover image URL", `blog.${i}.cover`, b.cover || "", "url")}
          <div class="field"><label>Upload cover image</label>
            <input class="input" type="file" accept="image/*" data-img="blog.${i}.cover"/>
            ${b.cover ? `<img src="${b.cover}" alt="" style="max-width:200px;margin-top:8px;border-radius:8px"/>` : ""}
          </div>
        </div>
      `).join("")}
    </section>`;
  }

  function viewList(key, fields) {
    const arr = draft[key] || [];
    const tpl = JSON.stringify(fields.reduce((a, f) => (a[f] = "", a), {}));
    return `<section class="glass card">
      <div class="list-item-head"><b>${key[0].toUpperCase() + key.slice(1)}</b>
        <div class="list-actions"><button class="mini-btn" data-add="${key}" data-tpl='${tpl}'>+ Add</button></div>
      </div>
      ${arr.map((it, i) => `
        <div class="list-item">
          <div class="list-item-head"><b>${esc(it[fields[0]] || "Item " + (i+1))}</b>
            <div class="list-actions">
              <button class="mini-btn" data-move="${key}" data-i="${i}" data-dir="-1">↑</button>
              <button class="mini-btn" data-move="${key}" data-i="${i}" data-dir="1">↓</button>
              <button class="mini-btn" data-dup="${key}" data-i="${i}">Duplicate</button>
              <button class="mini-btn danger" data-del="${key}" data-i="${i}">Delete</button>
            </div>
          </div>
          ${fields.map((f) => field(f, `${key}.${i}.${f}`, it[f])).join("")}
        </div>
      `).join("")}
    </section>`;
  }

  /* ---------- wire form → draft ---------- */
  function setPath(obj, path, value) {
    const parts = path.split(".");
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i]; const nk = parts[i + 1];
      if (o[k] == null) o[k] = /^\d+$/.test(nk) ? [] : {};
      o = o[k];
    }
    o[parts[parts.length - 1]] = value;
  }
  function getPath(obj, path) {
    return path.split(".").reduce((a, k) => a?.[k], obj);
  }

  function wireView(id) {
    if (body.dataset.wired === "true") return;
    body.addEventListener("input", onInput);
    body.addEventListener("change", onChange);
    body.addEventListener("click", onClick);
    body.dataset.wired = "true";
  }

  function onInput(e) {
    const t = e.target;
    if (!t.name) return;
    let v = t.value;
    if (t.type === "number") v = Number(v) || 0;
    // roles textarea
    if (t.name === "hero.roles") v = v.split("\n").map((s) => s.trim()).filter(Boolean);
    if (/^homepage\.(heroStats|aboutHighlights|technologyChips)$/.test(t.name)) v = v.split("\n").map((s) => s.trim()).filter(Boolean);
    // tech comma-list
    if (/^projects\.\d+\.tech$/.test(t.name)) v = v.split(",").map((s) => s.trim()).filter(Boolean);
    if (/^projects\.\d+\.caseStudy\.features$/.test(t.name)) v = v.split("\n").map((s) => s.trim()).filter(Boolean);
    setPath(draft, t.name, v);
    livePreview();
  }
  function onChange(e) {
    const t = e.target;
    if (t.matches("[data-resume]")) {
      readImage(t.files[0], 4000).then((data) => { draft.resume = data; livePreview(); show(active); })
        .catch((err) => window.toast?.(err.message));
    }
    if (t.matches("[data-img]")) {
      const path = t.getAttribute("data-img");
      readImage(t.files[0], 2000).then((data) => { setPath(draft, path, data); livePreview(); show(active); })
        .catch((err) => window.toast?.(err.message));
    }
  }
  function onClick(e) {
    const t = e.target;
    if (t.matches("[data-add]")) {
      const key = t.getAttribute("data-add");
      const tpl = JSON.parse(t.getAttribute("data-tpl") || "{}");
      draft[key].push(tpl); livePreview(); show(active);
    }
    if (t.matches("[data-del]")) {
      const key = t.getAttribute("data-del"); const i = +t.dataset.i;
      draft[key].splice(i, 1); livePreview(); show(active);
    }
    if (t.matches("[data-dup]")) {
      const key = t.getAttribute("data-dup"); const i = +t.dataset.i;
      draft[key].splice(i + 1, 0, JSON.parse(JSON.stringify(draft[key][i]))); livePreview(); show(active);
    }
    if (t.matches("[data-move]")) {
      const key = t.getAttribute("data-move"); const i = +t.dataset.i; const dir = +t.dataset.dir;
      const j = i + dir; if (j < 0 || j >= draft[key].length) return;
      const [x] = draft[key].splice(i, 1); draft[key].splice(j, 0, x); livePreview(); show(active);
    }
    if (t.matches("[data-add-skill-group]")) {
      draft.skills.push({ category: "New Domain", icon: "◆", items: [] }); livePreview(); show(active);
    }
    if (t.matches("[data-add-skill]")) {
      const gi = +t.dataset.gi; draft.skills[gi].items.push({ name: "New Tool", icon: "", pct: 70 }); livePreview(); show(active);
    }
    if (t.matches("[data-del-skill]")) {
      const gi = +t.dataset.gi; const ii = +t.dataset.ii;
      draft.skills[gi].items.splice(ii, 1); livePreview(); show(active);
    }
    if (t.matches("[data-move-skill]")) {
      const gi = +t.dataset.gi; const ii = +t.dataset.ii; const next = ii + (+t.dataset.dir);
      if (next < 0 || next >= draft.skills[gi].items.length) return;
      const [tool] = draft.skills[gi].items.splice(ii, 1); draft.skills[gi].items.splice(next, 0, tool); livePreview(); show(active);
    }
    if (t.matches("[data-clear-resume]")) { draft.resume = ""; livePreview(); show(active); }
    if (t.matches("[data-set-pin]")) {
      const inp = body.querySelector('input[name="newpin"]');
      const v = (inp?.value || "").trim();
      if (!/^\d{4}$/.test(v)) return window.toast?.("PIN must be 4 digits.");
      window.Store.setPin(v).then(() => window.toast?.("PIN updated."));
    }
  }

  function livePreview() {
    // dispatch update WITHOUT persisting to storage
    window.dispatchEvent(new CustomEvent("portfolio:update", { detail: draft }));
  }

  /* ---------- toolbar ---------- */
  $("#admin-save")?.addEventListener("click", () => {
    if (!draft || !Array.isArray(draft.projects) || draft.projects.some((p) => !String(p.title || "").trim())) return window.toast?.("Every project needs a title.");
    window.Store.set(draft); window.location.href = "index.html";
  });
  $("#admin-cancel")?.addEventListener("click", () => {
    draft = null;
    window.location.href = "index.html";
  });
  $("#admin-preview")?.addEventListener("click", () => {
    admin.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    window.toast?.("Preview mode — click the profile icon to return.");
  });
  $("#admin-logout")?.addEventListener("click", closeAdmin);
  $("#admin-restore")?.addEventListener("click", () => {
    if (!confirm("Restore original sample portfolio? Your edits will be lost.")) return;
    window.Store.restore();
    draft = JSON.parse(JSON.stringify(window.Store.get()));
    show(active); window.toast?.("Restored default data.");
  });
  $("#admin-export")?.addEventListener("click", () => window.Store.exportJSON());
  $("#admin-import")?.addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    window.Store.importJSON(f).then(() => {
      draft = JSON.parse(JSON.stringify(window.Store.get()));
      show(active); window.toast?.("Imported successfully.");
    }).catch(() => window.toast?.("Invalid JSON file."));
  });

  /* ---------- search fields and sections ---------- */
  $("#admin-search")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      $$("#admin-nav button").forEach((button) => { button.hidden = false; });
      show(active);
      return;
    }
    const matches = [];
    SECTIONS.forEach((section) => {
      const view = renderView(section.id);
      if (view.toLowerCase().includes(q)) matches.push(section.id);
    });
    $$("#admin-nav button").forEach((button) => {
      button.hidden = !matches.includes(button.dataset.nav);
    });
    const next = matches.includes(active) ? active : matches[0];
    if (!next) { body.innerHTML = '<p class="muted admin-no-results">No matching fields found.</p>'; return; }
    show(next);
    $$("#admin-body .field").forEach((fieldEl) => {
      fieldEl.hidden = !fieldEl.textContent.toLowerCase().includes(q) && !(fieldEl.querySelector("input, textarea")?.value || "").toLowerCase().includes(q);
    });
  });
})();
