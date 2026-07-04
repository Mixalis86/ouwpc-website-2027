document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initSlideshows();
});

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded","false");
  }));
}

function initSlideshows() {
  document.querySelectorAll("[data-slideshow]").forEach(root => {
    const track  = root.querySelector(".slideshow-track");
    const slides = root.querySelectorAll(".slideshow-slide");
    if (!track || slides.length === 0) return;

    let index = 0;
    const interval = parseInt(root.dataset.interval || "5000", 10);
    let timer = null;

    // build dots
    const dotsWrap = root.querySelector(".slideshow-dots");
    const dots = [];
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", `Slide ${i+1}`);
        if (i === 0) d.classList.add("is-active");
        d.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
    function goTo(i) { index = (i + slides.length) % slides.length; render(); restart(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      if (timer) clearInterval(timer);
      if (slides.length > 1) timer = setInterval(next, interval);
    }

    root.querySelector(".slideshow-nav.next")?.addEventListener("click", next);
    root.querySelector(".slideshow-nav.prev")?.addEventListener("click", prev);
    root.addEventListener("mouseenter", () => timer && clearInterval(timer));
    root.addEventListener("mouseleave", restart);

    render();
    restart();
  });
}
