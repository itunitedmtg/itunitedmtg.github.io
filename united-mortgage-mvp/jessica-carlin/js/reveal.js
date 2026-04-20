(() => {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  // Si el navegador no soporta IntersectionObserver, mostramos todo.
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);

        window.setTimeout(() => {
          el.classList.add("is-visible");
        }, delay);

        obs.unobserve(el);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -12% 0px" }
  );

  els.forEach((el) => obs.observe(el));

  // Fail-safe: si algo falla, después de 1.2s mostramos todo
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      const anyVisible = document.querySelector(".reveal.is-visible");
      if (!anyVisible) els.forEach((el) => el.classList.add("is-visible"));
    }, 1200);
  });
})();