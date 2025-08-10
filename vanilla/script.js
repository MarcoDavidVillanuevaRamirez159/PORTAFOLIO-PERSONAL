// GSAP basic split and reveal animations without React
// Split text into chars or words
function splitText(element) {
  const type = element.dataset.splitType || "chars";
  const text = element.textContent;
  element.textContent = "";
  if (type === "words") {
    text.split(" ").forEach((word, i, arr) => {
      const span = document.createElement("span");
      span.className = "split-word";
      span.style.display = "inline-block";
      span.textContent = word;
      if (i < arr.length - 1) span.style.marginRight = "0.25em";
      element.appendChild(span);
    });
  } else {
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "split-char";
      span.style.display = "inline-block";
      span.textContent = char === " " ? "\u00A0" : char;
      element.appendChild(span);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Split elements
    document.querySelectorAll("[data-split]").forEach((el) => {
      el.classList.add("split-parent");
      splitText(el);
      const targets = el.querySelectorAll(".split-char, .split-word");
      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.025,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });

    // Reveal sections/cards
    document.querySelectorAll("[data-reveal], .card").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    // Blur-on-scroll for highlighted sections
    document.querySelectorAll("[data-blur]").forEach((el) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0, y: 16 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    // Shine on project hover (accent animate)
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.fromTo(
          card,
          { boxShadow: "0 0 0 rgba(0,0,0,0)" },
          { duration: 0.6, ease: "power2.out" }
        );
      });
    });

    // Subtle parallax on project cards
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: y * 4,
          rotateY: x * 6,
          transformPerspective: 600,
          transformOrigin: "center",
          duration: 0.3,
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    });

    // Hero avatar subtle float + glow pulse
    const avatar = document.querySelector(".hex-avatar");
    if (avatar) {
      gsap.fromTo(
        avatar,
        { opacity: 0, y: 20, filter: "drop-shadow(0 0 0 rgba(0,255,213,0))" },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.to(avatar, {
        y: -5,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Lightweight particles on canvas
  const canvas = document.getElementById("bg-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    const isSmall = Math.min(window.innerWidth, window.innerHeight) < 520;
    const particles = Array.from({ length: isSmall ? 40 : 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.00055,
      vy: (Math.random() - 0.5) * 0.00055,
      c: Math.random() > 0.5 ? "#00ffd5" : "#7c5cff",
    }));
    const resize = () => {
      canvas.width = innerWidth * DPR;
      canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
    };
    window.addEventListener("resize", resize);
    resize();
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.55;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.shadowBlur = 14 * DPR;
        ctx.shadowColor = p.c;
        ctx.arc(
          p.x * canvas.width,
          p.y * canvas.height,
          p.r * DPR,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  // Lightbox behavior
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox ? lightbox.querySelector("img") : null;
  document.querySelectorAll(".open-lightbox").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (!lightbox || !lbImg) return;
      const src = link.getAttribute("data-img");
      lbImg.src = src || "";
      lightbox.classList.add("open");
    });
  });
  if (lightbox) {
    const close = lightbox.querySelector(".lightbox-close");
    close.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }

  // Simple carousel scroll controls
  document.querySelectorAll(".carousel-block").forEach((block) => {
    const track = block.querySelector(".carousel-track");
    const prev = block.querySelector(".carousel-btn.prev");
    const next = block.querySelector(".carousel-btn.next");
    if (!track || !prev || !next) return;
    const step = () => Math.min(track.clientWidth * 0.85, 600);
    prev.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" })
    );
    next.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" })
    );
  });

  // Coverflow básico: alterna clases prev/current/next
  document.querySelectorAll(".coverflow").forEach((cf) => {
    const track = cf.querySelector(".cf-track");
    const items = Array.from(track.querySelectorAll(".cf-item"));
    const prevBtn = cf.querySelector(".cf-btn.prev");
    const nextBtn = cf.querySelector(".cf-btn.next");
    let index = items.findIndex((i) => i.classList.contains("current"));
    const apply = () => {
      items.forEach((el, i) => {
        el.classList.remove("prev", "current", "next");
      });
      const prev = (index - 1 + items.length) % items.length;
      const next = (index + 1) % items.length;
      items[prev].classList.add("prev");
      items[index].classList.add("current");
      items[next].classList.add("next");
    };
    apply();
    prevBtn?.addEventListener("click", () => {
      index = (index - 1 + items.length) % items.length;
      apply();
    });
    nextBtn?.addEventListener("click", () => {
      index = (index + 1) % items.length;
      apply();
    });

    // ScrollTrigger reveal animation
    if (window.gsap) {
      gsap.fromTo(
        cf,
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cf,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }

    // Soporte táctil para deslizar
    let startX = 0;
    let deltaX = 0;
    let dragging = false;
    const onStart = (x) => {
      dragging = true;
      startX = x;
      cf.querySelector(".cf-viewport").style.cursor = "grabbing";
    };
    const onMove = (x) => {
      if (!dragging) return;
      deltaX = x - startX;
    };
    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      cf.querySelector(".cf-viewport").style.cursor = "grab";
      if (Math.abs(deltaX) > 36) {
        index = (index + (deltaX < 0 ? 1 : -1) + items.length) % items.length;
        apply();
      }
      deltaX = 0;
    };
    const vp = cf.querySelector(".cf-viewport");
    vp.addEventListener("pointerdown", (e) => onStart(e.clientX));
    window.addEventListener("pointermove", (e) => onMove(e.clientX));
    window.addEventListener("pointerup", onEnd);
  });
});

// Hide loader once everything is loaded
window.addEventListener("load", () => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.classList.add("hidden");
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 600);
  }
});
