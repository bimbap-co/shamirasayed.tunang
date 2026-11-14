const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

const musicFrame = document.querySelector("#engagement-music");
const musicDelay = new Promise((resolve) => window.setTimeout(resolve, 3000));
const musicUrl = new URL("https://www.youtube.com/embed/wNBm_8YAHrY");
musicUrl.search = new URLSearchParams({ enablejsapi: "1", playsinline: "1", origin: location.origin });

window.onYouTubeIframeAPIReady = () => {
  new YT.Player(musicFrame, {
    events: {
      onReady: ({ target }) => {
        target.setVolume(15);
        musicDelay.then(() => {
          if (target.getPlayerState() !== YT.PlayerState.UNSTARTED) return;
          const visibility = new IntersectionObserver(([entry]) => {
            if (entry.intersectionRatio <= 0.5) return;
            visibility.disconnect();
            if (target.getPlayerState() === YT.PlayerState.UNSTARTED) target.playVideo();
          }, { threshold: 0.51 });
          visibility.observe(musicFrame);
          // Keep manual playback or pause in control while the player is offscreen.
          musicFrame.addEventListener("focus", () => visibility.disconnect(), { once: true });
        });
      },
    },
  });
};

musicFrame.src = musicUrl.href;
const youtubeApi = document.createElement("script");
youtubeApi.src = "https://www.youtube.com/iframe_api";
document.head.append(youtubeApi);

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
