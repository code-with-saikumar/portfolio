/* =========================================================
   typing.js — hero role typewriter
   ========================================================= */
(function () {
  "use strict";
  const el = () => document.getElementById("typing");

  let i = 0, j = 0, del = false, t = null;

  function tick(roles) {
    const node = el(); if (!node) return;
    const word = roles[i % roles.length];
    j += del ? -1 : 1;
    node.textContent = word.slice(0, j);
    let delay = del ? 40 : 90;
    if (!del && j === word.length) { delay = 1400; del = true; }
    else if (del && j === 0) { del = false; i++; delay = 260; }
    t = setTimeout(() => tick(roles), delay);
  }

  function start() {
    clearTimeout(t); i = 0; j = 0; del = false;
    const roles = (window.Store?.get().hero.roles) || ["Developer"];
    tick(roles);
  }

  document.addEventListener("DOMContentLoaded", start);
  window.addEventListener("portfolio:update", start);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(t);
    else start();
  });
})();
