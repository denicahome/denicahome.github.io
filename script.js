const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav ? [...nav.querySelectorAll("a")] : [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Open menu";
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.querySelector(".sr-only").textContent = open ? "Open menu" : "Close menu";
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-sticky", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5%" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Collection tabs: without JS every panel is shown stacked.
const tabs = document.querySelector("[data-tabs]");

if (tabs) {
  const tabButtons = [...tabs.querySelectorAll('[role="tab"]')];
  const panels = tabButtons.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  const selectTab = (index, focus = false) => {
    tabButtons.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) tabButtons[index].focus();
  };

  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(index));
    tab.addEventListener("keydown", (event) => {
      const last = tabButtons.length - 1;
      const next = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectTab(next, true);
    });
  });

  selectTab(0);
}

// Close-up: hovering a list item highlights its pin, and vice versa.
document.querySelectorAll("[data-hotspot]").forEach((element) => {
  const group = document.querySelectorAll(`[data-hotspot="${element.dataset.hotspot}"]`);
  const setActive = (active) => group.forEach((node) => node.classList.toggle("is-active", active));
  element.addEventListener("pointerenter", () => setActive(true));
  element.addEventListener("pointerleave", () => setActive(false));
});

document.querySelectorAll(".accordion details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".accordion details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
