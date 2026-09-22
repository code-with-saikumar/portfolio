/* =========================================================
   storage.js — master data + localStorage
   Global: window.Store
   ========================================================= */
(function () {
  "use strict";

  const KEY = "portfolio:data:v1";
  const PIN_KEY = "portfolio:pin";

  const DEFAULT = {
    site: {
      name: "Sai Kumar",
      tagline: "Building responsive web apps and continuously learning modern technologies.",
    },
    homepage: {
      availability: "Available for work", greeting: "Hi, I'm", projectsButton: "View Projects", contactButton: "Hire Me",
      aboutKicker: "About", aboutTitle: "Final-year CSE student building real-world full-stack products.", mission: "Mission: build software that creates value, enhances user experiences, and solves real-world problems through clean, scalable, and maintainable code.",
      skillsKicker: "Skills", skillsTitle: "Tools I use to ship.", projectsKicker: "Work", projectsTitle: "Selected projects.", experienceKicker: "Experience", experienceTitle: "Where I've built.", educationKicker: "Education", educationTitle: "Where I learned.", certificatesKicker: "Certificates", certificatesTitle: "Verified learning.", achievementsKicker: "Achievements", achievementsTitle: "By the numbers.", blogKicker: "Blog", blogTitle: "Notes & essays.", contactKicker: "Contact", contactTitle: "Let's build something great.", copyright: "All rights reserved."
      ,resumeButton: "Download Resume", terminalTitle: "~/sai-kumar/portfolio", aboutHighlights: ["Final Yr|B.Tech CSE", "10+|Projects", "8+|Certifications", "300+|DSA Problems"], heroStats: ["10|Projects", "8|Certifications", "300|DSA Solved", "Final Yr|B.Tech CSE"], technologyChips: ["React", "Next.js", "Python", "AWS", "AI", "Docker"], terminalContent: "sai · full-stack · ai enthusiast\n\nfrontend: React, Next.js, TS\nbackend: Node, Python, Go\ncloud: AWS, GCP, Docker\nai: OpenAI, LangChain, RAG"
    },
    hero: {
      name: "Sai Kumar",
      location: "Hyderabad, India",
      roles: [
        "Full Stack Developer",
        "Computer Science Student",
        "Software Engineer Aspirant",
        "Problem Solver",
        "Frontend Enthusiast",
        "Backend Developer",
        "Continuous Learner",
      ],
      tagline:
        "I'm a passionate B.Tech Computer Science student and Full Stack Developer who enjoys building modern, responsive, and user-focused web applications. I love solving real-world problems through clean code, continuously learning new technologies, and transforming ideas into meaningful digital experiences.",
    },
    about: {
      bio:
        "I'm a final-year B.Tech Computer Science student with a strong passion for Full Stack Web Development and Software Engineering. I enjoy designing responsive user interfaces, developing scalable web applications, and exploring modern technologies that solve real-world challenges. Through academic projects, self-learning, and hands-on development, I have built practical experience in Java, JavaScript, HTML, CSS, React, Node.js, databases, and modern development tools. My goal is to begin my career as a Software Engineer where I can contribute to impactful projects, collaborate with talented teams, and continue growing as a developer.",
    },
    theme: {
      accent: "#22E9FF",
      accent2: "#FF3DCB",
      accent3: "#7C5CFF",
    },
    contact: {
      email: "hello@saikumar.dev",
      phone: "+91 00000 00000",
      location: "Hyderabad, India",
    },
    resume: "", // data URL
    pin: null, // sha256 hex

    skills: [
      { category: "Frontend", icon: "⚛", items: [
        { name: "React / Next.js", icon: "https://cdn.simpleicons.org/react/61DAFB", pct: 92 },
        { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6", pct: 88 },
        { name: "HTML / CSS", icon: "", pct: 95 },
      ]},
      { category: "Backend", icon: "🧩", items: [
        { name: "Node.js / Express", icon: "https://cdn.simpleicons.org/nodedotjs/339933", pct: 90 },
        { name: "Python / FastAPI", icon: "https://cdn.simpleicons.org/python/3776AB", pct: 82 },
        { name: "Go", icon: "https://cdn.simpleicons.org/go/00ADD8", pct: 65 },
      ]},
      { category: "Database", icon: "🗄", items: [
        { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1", pct: 85 },
        { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248", pct: 80 },
        { name: "Redis", icon: "https://cdn.simpleicons.org/redis/DC382D", pct: 78 },
      ]},
      { category: "Languages", icon: "💻", items: [
        { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E", pct: 94 },
        { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB", pct: 88 },
        { name: "Java", icon: "https://cdn.simpleicons.org/openjdk/FFFFFF", pct: 78 },
      ]},
      { category: "Cloud", icon: "☁", items: [
        { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/FF9900", pct: 82 },
        { name: "GCP", icon: "https://cdn.simpleicons.org/googlecloud/4285F4", pct: 72 },
        { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF", pct: 90 },
      ]},
      { category: "Tools", icon: "🛠", items: [
        { name: "Git / GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF", pct: 95 },
        { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E", pct: 80 },
        { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37", pct: 88 },
      ]},
      { category: "DevOps", icon: "🐳", items: [
        { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED", pct: 82 },
        { name: "CI / CD", icon: "", pct: 78 },
        { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326CE5", pct: 62 },
      ]},
      { category: "AI", icon: "🤖", items: [
        { name: "OpenAI / LLMs", icon: "https://cdn.simpleicons.org/openai/FFFFFF", pct: 88 },
        { name: "LangChain", icon: "", pct: 80 },
        { name: "RAG / Vector DB", icon: "", pct: 78 },
      ]},
      { category: "Soft Skills", icon: "✨", items: [
        { name: "Communication", pct: 92 },
        { name: "Problem Solving", pct: 95 },
        { name: "Leadership", pct: 85 },
      ]},
    ],

    projects: [
      { title: "AI Career Guidance Platform", desc: "Personalized career roadmaps, mock interviews and resume scoring powered by LLMs.", fullDescription: "An end-to-end platform for personalized career planning, interview practice, and resume feedback.", tech: ["Next.js","Node","OpenAI","Postgres"], github: "#", live: "#", image: "", duration: "3 months", caseStudy: { overview: "An AI-powered career guidance platform that helps job seekers identify suitable career paths, understand skill gaps, and prepare for interviews.", features: ["Personalized career recommendations", "Resume analysis and scoring", "Skill-gap assessment", "AI mock interviews"], role: "Full Stack Developer", challenges: "Designing a useful recommendation flow while keeping the experience simple and responsive.", solution: "Built a responsive frontend with API-driven services and AI-assisted recommendations, keeping the core workflow modular and easy to extend.", results: "Delivered an end-to-end career guidance experience with personalized recommendations and preparation workflows." } },
      { title: "Restaurant Management Dashboard", desc: "Realtime orders, kitchen displays, inventory and analytics.", tech: ["React","Express","Socket.io","Mongo"], github: "#", live: "#", image: "" },
      { title: "Banking Preparation Portal", desc: "Adaptive quizzes, mock tests and analytics for banking exam aspirants.", tech: ["Next.js","Postgres","Redis"], github: "#", live: "#", image: "" },
      { title: "Portfolio Website", desc: "This site — vanilla HTML/CSS/JS with a fully editable admin CMS.", tech: ["HTML","CSS","JavaScript"], github: "#", live: "#", image: "" },
      { title: "Weather Dashboard", desc: "Beautiful weather app with maps, forecasts and animated backgrounds.", tech: ["React","Tailwind","OpenWeather"], github: "#", live: "#", image: "" },
      { title: "E-Commerce Platform", desc: "Headless store with Stripe payments, search and blazing-fast pages.", tech: ["Next.js","Stripe","Postgres"], github: "#", live: "#", image: "" },
    ],

    featured: {
      title: "AI Career Guidance Platform",
      description:
        "An AI-powered platform helping students discover career paths with personalized roadmaps, mock interviews and resume scoring.",
    },

    experience: [
      { role: "Full Stack Developer Intern", org: "TechNova Labs", date: "2024 — Present", desc: "Shipping features across the stack for a SaaS analytics product." },
      { role: "Open Source Contributor", org: "Various", date: "2023 — Present", desc: "Contributed to component libraries, dev tools and AI SDKs." },
      { role: "Hackathon Winner", org: "Smart India Hackathon", date: "2023", desc: "Built an AI moderation tool that placed in the top 5 nationally." },
      { role: "Freelance Developer", org: "Independent", date: "2022 — 2024", desc: "Delivered websites and dashboards for small businesses and startups." },
    ],

    education: [
      { role: "B.Tech, Computer Science", org: "ABC Institute of Technology", date: "2021 — 2025", desc: "CGPA: 8.9 / 10 · Focus: full-stack engineering & AI." },
      { role: "Intermediate (MPC)", org: "XYZ Junior College", date: "2019 — 2021", desc: "Score: 94% · Mathematics, Physics, Chemistry." },
      { role: "SSC", org: "ABC High School", date: "2019", desc: "GPA: 10 / 10." },
    ],

    certificates: [
      { title: "AWS Certified Cloud Practitioner", issuer: "Amazon", url: "", image: "" },
      { title: "Meta Front-End Developer", issuer: "Meta / Coursera", url: "", image: "" },
      { title: "Google Data Analytics", issuer: "Google", url: "", image: "" },
      { title: "Deep Learning Specialization", issuer: "DeepLearning.AI", url: "", image: "" },
      { title: "MongoDB Developer Associate", issuer: "MongoDB", url: "", image: "" },
      { title: "Postman API Fundamentals", issuer: "Postman", url: "", image: "" },
    ],

    achievements: [
      { label: "Academic & Personal Projects", value: 10 },
      { label: "Certifications", value: 8 },
      { label: "DSA Problems Solved", value: 300 },
      { label: "Final Year B.Tech CSE", value: 1 },
    ],

    blog: [
      { title: "Designing Interfaces That Feel Fast", category: "Design", read: "6 min", date: "2025-04-12", cover: "", excerpt: "Perceived performance is a design discipline. Here's how I approach it." },
      { title: "Building RAG Apps That Don't Hallucinate", category: "AI", read: "9 min", date: "2025-03-02", cover: "", excerpt: "A pragmatic guide to retrieval, ranking and grounding." },
      { title: "The Edge is the New Origin", category: "Web", read: "5 min", date: "2025-01-20", cover: "", excerpt: "Why I'm moving more logic to the edge in 2025." },
      { title: "TypeScript Patterns I Reach For", category: "Code", read: "7 min", date: "2024-12-05", cover: "", excerpt: "A short list of patterns that pay for themselves." },
      { title: "From Junior to Full Stack", category: "Career", read: "8 min", date: "2024-10-14", cover: "", excerpt: "What I learned in my first year building products." },
      { title: "CSS Layouts Without a Framework", category: "Design", read: "6 min", date: "2024-08-30", cover: "", excerpt: "Grid + Flex + container queries = enough." },
    ],

    socials: [
      { name: "GitHub", url: "https://github.com" },
      { name: "LinkedIn", url: "https://linkedin.com" },
      { name: "Instagram", url: "https://instagram.com" },
      { name: "Twitter", url: "https://twitter.com" },
      { name: "LeetCode", url: "https://leetcode.com" },
      { name: "GeeksforGeeks", url: "https://geeksforgeeks.org" },
      { name: "CodeChef", url: "https://codechef.com" },
      { name: "HackerRank", url: "https://hackerrank.com" },
    ],
  };

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  let data = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return deepClone(DEFAULT);
      const parsed = JSON.parse(raw);
      const merged = Object.assign({}, deepClone(DEFAULT), parsed);
      merged.homepage = Object.assign({}, deepClone(DEFAULT.homepage), parsed.homepage || {});
      merged.skills = Array.isArray(merged.skills) ? merged.skills.map((g) => ({
        category: g.category || "Skills", icon: g.icon || "◆",
        items: Array.isArray(g.items) ? g.items.map((it) => ({ name: it.name || "Tool", icon: it.icon || "", pct: it.pct ?? 70 })) : []
      })) : deepClone(DEFAULT.skills);
      merged.projects = Array.isArray(merged.projects) ? merged.projects.map((p) => ({
        title: p.title || "Project", desc: p.desc || "", fullDescription: p.fullDescription || p.desc || "", tech: Array.isArray(p.tech) ? p.tech : [], github: p.github || "", live: p.live || "", image: p.image || "",
        duration: p.duration || "", caseStudy: Object.assign({ overview: "", features: [], role: "", challenges: "", solution: "", results: "" }, p.caseStudy || {})
      })) : deepClone(DEFAULT.projects);
      merged.certificates = Array.isArray(merged.certificates) ? merged.certificates.map((c) => ({ title: c.title || "Certificate", issuer: c.issuer || "", url: c.url || "", image: c.image || "" })) : deepClone(DEFAULT.certificates);
      return merged;
    } catch {
      return deepClone(DEFAULT);
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { console.warn("Storage save failed", e); }
  }

  function set(next) {
    data = next;
    save();
    emit();
  }

  function patch(partial) {
    data = Object.assign({}, data, partial);
    save();
    emit();
  }

  function restore() {
    data = deepClone(DEFAULT);
    save();
    emit();
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portfolio-data.json";
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        try {
          const parsed = JSON.parse(r.result);
          data = Object.assign({}, deepClone(DEFAULT), parsed);
          save(); emit(); resolve(data);
        } catch (e) { reject(e); }
      };
      r.onerror = () => reject(r.error);
      r.readAsText(file);
    });
  }

  function emit() {
    window.dispatchEvent(new CustomEvent("portfolio:update", { detail: data }));
  }

  async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function checkPin(pin) {
    const stored = localStorage.getItem(PIN_KEY);
    const expected = stored || (await sha256("1234"));
    return (await sha256(String(pin))) === expected;
  }

  async function setPin(pin) {
    localStorage.setItem(PIN_KEY, await sha256(String(pin)));
  }

  window.Store = {
    get: () => data,
    set, patch, restore, exportJSON, importJSON,
    checkPin, setPin,
    DEFAULT: () => deepClone(DEFAULT),
  };
})();
