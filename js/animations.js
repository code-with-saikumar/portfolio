/* =========================================================
   animations.js — particles canvas + tilt + ripples
   ========================================================= */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



  /* ---------------- Tilt ---------------- */
  function bindTilt() {
    if (reduced) return;
    document.querySelectorAll(".tilt").forEach((el) => {
      if (el._tilt) return; el._tilt = true;
      let rect = null;
      const onMove = (e) => {
        rect = rect || el.getBoundingClientRect();
        const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
        const rx = ((cy / rect.height) - .5) * -6;
        const ry = ((cx / rect.width) - .5) * 8;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      };
      const onLeave = () => { el.style.transform = ""; rect = null; };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointerdown", onLeave);
    });
  }
  window.addEventListener("portfolio:rendered", bindTilt);
  document.addEventListener("DOMContentLoaded", bindTilt);

  /* ---------------- Ripple on buttons ---------------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const r = document.createElement("span");
    r.className = "ripple";
    r.style.left = (e.clientX - rect.left) + "px";
    r.style.top = (e.clientY - rect.top) + "px";
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
    // also update radial hover center
    btn.style.setProperty("--rx", (e.clientX - rect.left) + "px");
    btn.style.setProperty("--ry", (e.clientY - rect.top) + "px");
  });
})();
