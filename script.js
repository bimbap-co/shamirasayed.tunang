const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

const music = document.querySelector("#engagement-music");
const musicToggle = document.querySelector("#music-toggle");
music.volume = 0.15;
musicToggle.hidden = false;

const playMusic = () => {
  music.play().catch(() => {
    // Audible autoplay may require an explicit press of the music button.
  });
};

const musicTimer = window.setTimeout(playMusic, 3000);
musicToggle.addEventListener("click", () => {
  window.clearTimeout(musicTimer);
  if (music.paused) playMusic();
  else music.pause();
});
music.addEventListener("playing", () => { musicToggle.textContent = "Pause music"; });
music.addEventListener("pause", () => { musicToggle.textContent = "Play music"; });

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
