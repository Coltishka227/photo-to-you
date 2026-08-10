document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  const updateHeader = () => {
    if (!header) return;
    if (window.scrollY > 30 || header.classList.contains("solid")) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, {passive:true});

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  // Portfolio filters
  const filters = document.querySelectorAll(".portfolio-filter");
  const items = document.querySelectorAll(".portfolio-item");
  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      filters.forEach(f => f.classList.remove("active"));
      filter.classList.add("active");
      const category = filter.dataset.filter;
      items.forEach(item => {
        item.classList.toggle("hidden", category !== "all" && item.dataset.category !== category);
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const close = document.getElementById("lightboxClose");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  const buttons = [...document.querySelectorAll(".portfolio-image-button")];
  let current = 0;

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !buttons.length) return;
    current = (index + buttons.length) % buttons.length;
    lightboxImage.src = buttons[current].dataset.image;
    lightboxImage.alt = buttons[current].querySelector("img")?.alt || "Фотография";
    lightbox.classList.add("open");
    document.body.classList.add("menu-open");
    lightbox.setAttribute("aria-hidden", "false");
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("menu-open");
    lightbox.setAttribute("aria-hidden", "true");
  };
  buttons.forEach((button, i) => button.addEventListener("click", () => openLightbox(i)));
  close?.addEventListener("click", closeLightbox);
  prev?.addEventListener("click", () => openLightbox(current - 1));
  next?.addEventListener("click", () => openLightbox(current + 1));
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(current - 1);
    if (e.key === "ArrowRight") openLightbox(current + 1);
  });

  // Touch swipe
  let startX = null;
  lightbox?.addEventListener("touchstart", e => { startX = e.changedTouches[0].clientX; }, {passive:true});
  lightbox?.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) openLightbox(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, {passive:true});

  // Booking form
  const form = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (formMessage) formMessage.textContent = "Спасибо! Заявка заполнена. Подключение отправки можно добавить позже.";
    form.reset();
  });
});
