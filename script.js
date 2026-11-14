const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

const posterLink = document.querySelector("#view-poster");
const posterDialog = document.querySelector("#poster-dialog");

if (typeof posterDialog.showModal === "function") {
  posterLink.setAttribute("aria-haspopup", "dialog");
  posterLink.addEventListener("click", (event) => {
    event.preventDefault();
    posterDialog.showModal();
  });
  document.querySelector("#close-poster").addEventListener("click", () => posterDialog.close());
  posterDialog.addEventListener("close", () => posterLink.focus({ preventScroll: true }));
}

if (motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  for (const section of document.querySelectorAll("[data-reveal]")) {
    observer.observe(section);
  }
}
