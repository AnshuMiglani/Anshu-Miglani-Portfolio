/* ========================================================================
   ANSHU MIGLANI — PORTFOLIO INTERACTIONS
   Recruiter-Ready Dynamic Engine
   ======================================================================== */

(function () {
  "use strict";

  // ── Cursor Glow ───────────────────────────────────────────────────────
  const cursor = document.querySelector(".cursor-glow");
  let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
  let actualX = cursorX, actualY = cursorY;

  window.addEventListener("pointermove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    if (cursor) {
      actualX += (cursorX - actualX) * 0.12;
      actualY += (cursorY - actualY) * 0.12;
      cursor.style.left = actualX + "px";
      cursor.style.top = actualY + "px";
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── Scroll Progress Bar ───────────────────────────────────────────────
  const scrollProgress = document.querySelector(".scroll-progress");
  window.addEventListener("scroll", () => {
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + "%";
    }
  }, { passive: true });

  // ── Scroll Reveal (staggered) ─────────────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const staggerChildren = entry.target.querySelectorAll(".stagger-child");
          staggerChildren.forEach((child, i) => {
            child.style.animationDelay = i * 70 + "ms";
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ── Active Nav Highlighting ───────────────────────────────────────────
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollY = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ── Animated Counters ─────────────────────────────────────────────────
  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const isFloat = match[2].includes(".");
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (target * eased).toFixed(1)
        : Math.floor(target * eased);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(
    ".quick-stats strong, .metric strong, .achievement strong"
  ).forEach((el) => counterObserver.observe(el));

  // ── Parallax on Hero Orbital ──────────────────────────────────────────
  const orbital = document.querySelector(".orbital");
  if (orbital) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      orbital.style.transform = `translate(${x}px, ${y}px)`;
      orbital.style.transition = "transform 0.3s ease-out";
    });
  }

  // ── Project Card 3D Tilt ──────────────────────────────────────────────
  document.querySelectorAll(".project-visual").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
      card.style.transition = "transform 0.1s ease-out";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
      card.style.transition = "transform 0.5s ease-out";
    });
  });

  // ── Project Category Filter Tabs ──────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const categories = card.dataset.category || "";
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 30);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ── Copy to Clipboard & Toast Notification ────────────────────────────
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(
        () => {
          showToast(`Copied "${text}" to clipboard!`);
          const originalText = btn.textContent;
          btn.textContent = "✓ Copied!";
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        },
        () => {
          showToast(`Error copying to clipboard`);
        }
      );
    });
  });

  // ── Mobile Hamburger Menu ─────────────────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav-overlay");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open");
      document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ── Magnetic Buttons ──────────────────────────────────────────────────
  document.querySelectorAll(".button, .nav-cta, .btn-action, .dock-btn").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.4s ease-out";
    });

    el.addEventListener("mouseenter", () => {
      el.style.transition = "transform 0.15s ease-out";
    });
  });

  // ── Year in Footer ────────────────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Smooth Page Load ──────────────────────────────────────────────────
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    const heroReveal = document.querySelector(".hero-copy.reveal");
    const heroVisual = document.querySelector(".hero-visual.reveal");

    if (heroReveal) {
      setTimeout(() => heroReveal.classList.add("visible"), 150);
    }
    if (heroVisual) {
      setTimeout(() => heroVisual.classList.add("visible"), 400);
    }
  });

  // ── Header Scroll Border ──────────────────────────────────────────────
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.style.borderBottomColor = "rgba(64, 91, 255, 0.2)";
      } else {
        header.style.borderBottomColor = "rgba(255, 255, 255, 0.06)";
      }
    }, { passive: true });
  }

  // ── Stagger Helpers ───────────────────────────────────────────────────
  document.querySelectorAll(".skill-group").forEach((group) => {
    group.classList.add("stagger-child");
  });
  document.querySelectorAll(".achievement").forEach((ach) => {
    ach.classList.add("stagger-child");
  });
  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.classList.add("stagger-child");
  });
})();
