/**
 * ============================================================================
 * VYGA.EXE — INTERACTIVE APPLICATION ENGINE
 * ============================================================================
 */
(() => {
  "use strict";

  const CFG = window.VYGA_CONFIG;
  if (!CFG) {
    console.error("VYGA_CONFIG missing. Ensure js/config.js is loaded before js/app.js.");
    return;
  }

  const STORAGE_KEYS = {
    MUSEUM: "vyga_exe_museum_v1",
    PLAYLIST_NAME: "vyga_exe_playlist_name_v1",
    PLAYLIST_SONGS: "vyga_exe_playlist_songs_v1",
    CAKE_BEST: "vyga_exe_cake_best_v1",
    BIRTHDAY_DATE: "vyga_exe_birthday_date_v1",
    LETTER_CUSTOM: "vyga_exe_letter_custom_v1",
    MUSIC_LINK: "vyga_exe_custom_music_link_v1"
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const escapeHtml = (str) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeHttpUrl = (url) => {
    try {
      const parsed = new URL(String(url).trim());
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.href;
      }
    } catch {
      return null;
    }
    return null;
  };

  /* ==========================================================================
     1. CONFETTI & FLOATING PARTICLES ENGINE
     ========================================================================== */
  const ConfettiEngine = (() => {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let particles = [];
    let rafId = null;

    const PALETTES = {
      birthday: ["#FF4F91", "#FFD6E7", "#8B5CF6", "#DCCBFF", "#FBBF24", "#FFF9F5"],
      purple: ["#8B5CF6", "#A855F7", "#C084FC", "#513477", "#E9D5FF", "#FFFFFF"],
      finale: ["#FF4F91", "#FFD6E7", "#8B5CF6", "#A855F7", "#FBBF24", "#FFF9F5"]
    };

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const drawHeart = (c, size) => {
      c.beginPath();
      const s = size * 0.65;
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(s * 0.5, -s * 0.4, s * 1.2, s * 0.35, 0, s * 1.15);
      c.bezierCurveTo(-s * 1.2, s * 0.35, -s * 0.5, -s * 0.4, 0, s * 0.3);
      c.fill();
    };

    const step = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 60);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rot += p.vRot;
        p.life -= 1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, p.life / 35);
        ctx.fillStyle = p.color;

        if (p.shape === "heart") {
          drawHeart(ctx, p.size);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.62);
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const burst = (theme = "birthday", count = 90, originY = 0.35) => {
      if (!ctx || !canvas) return;
      const palette = PALETTES[theme] || PALETTES.birthday;
      const actualCount = prefersReducedMotion() ? Math.min(20, count) : count;

      for (let i = 0; i < actualCount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3.5 + Math.random() * 9.5;
        const shapes = theme === "purple" ? ["heart", "circle", "rect"] : ["rect", "circle", "heart"];
        particles.push({
          x: canvas.width * (0.2 + Math.random() * 0.6),
          y: canvas.height * originY + (Math.random() - 0.5) * 90,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4.5,
          gravity: 0.22 + Math.random() * 0.08,
          size: 7 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          life: 110 + Math.random() * 65,
          color: palette[Math.floor(Math.random() * palette.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }

      if (!rafId) {
        rafId = requestAnimationFrame(step);
      }
    };

    const spawnFloatingParticles = (emojis = ["💗", "🎀", "✨"], count = 14) => {
      const layer = document.getElementById("floating-particles");
      if (!layer || prefersReducedMotion()) return;
      for (let i = 0; i < count; i += 1) {
        const el = document.createElement("span");
        el.className = "float-particle";
        el.textContent = emojis[i % emojis.length];
        el.style.left = `${5 + Math.random() * 90}%`;
        el.style.setProperty("--dur", `${3.2 + Math.random() * 2.4}s`);
        el.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
        el.style.setProperty("--rot", `${(Math.random() - 0.5) * 45}deg`);
        el.style.animationDelay = `${Math.random() * 0.45}s`;
        layer.appendChild(el);
        setTimeout(() => el.remove(), 6200);
      }
    };

    return { burst, spawnFloatingParticles };
  })();

  /* ==========================================================================
     2. WEB AUDIO ENGINE (USER-ACTIVATED MUSIC & CELEBRATION SFX)
     ========================================================================== */
  const AudioEngine = (() => {
    let ctx = null;
    let masterGain = null;
    let isPlaying = false;
    let sfxEnabled = true;
    let loopTimer = null;
    let stepIdx = 0;
    let volume = 0.55;

    // Gentle music-box celebration notes (C5 major / dreamy intervals)
    const MELODY_NOTES = [
      523.25, 659.25, 783.99, 1046.5, 987.77, 783.99,
      659.25, 587.33, 698.46, 880.0, 783.99, 659.25,
      523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25
    ];

    const ensureContext = () => {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.value = volume * 0.35;
        masterGain.connect(ctx.destination);
      }
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return ctx;
    };

    const playTone = (freq, duration = 0.25, type = "sine", volScale = 0.35, delay = 0) => {
      const audio = ensureContext();
      if (!audio || !masterGain) return;
      const now = audio.currentTime + delay;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volScale), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    };

    const playSfx = (kind = "pop") => {
      if (!sfxEnabled) return;
      if (kind === "pop") {
        playTone(660, 0.09, "triangle", 0.35, 0);
        playTone(990, 0.14, "sine", 0.3, 0.04);
      } else if (kind === "fanfare") {
        playTone(523.25, 0.16, "triangle", 0.32, 0);
        playTone(659.25, 0.16, "triangle", 0.32, 0.09);
        playTone(783.99, 0.28, "triangle", 0.38, 0.18);
        playTone(1046.5, 0.4, "sine", 0.32, 0.28);
      } else if (kind === "borahae") {
        playTone(440, 0.32, "sine", 0.3, 0);
        playTone(554.37, 0.36, "sine", 0.3, 0.09);
        playTone(659.25, 0.42, "sine", 0.32, 0.18);
        playTone(880, 0.55, "triangle", 0.28, 0.28);
      } else if (kind === "error") {
        playTone(220, 0.14, "sawtooth", 0.18, 0);
        playTone(185, 0.2, "sawtooth", 0.18, 0.12);
      } else if (kind === "catch") {
        playTone(784, 0.08, "sine", 0.32, 0);
        playTone(1174.66, 0.12, "triangle", 0.28, 0.04);
      }
    };

    const toggleMusic = () => {
      const toggleBtn = document.getElementById("music-toggle-btn");
      const disc = document.getElementById("music-disc");
      const statusText = document.getElementById("music-status-text");

      if (isPlaying) {
        isPlaying = false;
        clearInterval(loopTimer);
        loopTimer = null;
        if (toggleBtn) toggleBtn.textContent = "▶ Play";
        if (disc) disc.classList.remove("spinning");
        if (statusText) statusText.textContent = "Paused • Click play anytime";
        return;
      }

      ensureContext();
      isPlaying = true;
      if (toggleBtn) toggleBtn.textContent = "⏸ Pause";
      if (disc) disc.classList.add("spinning");
      if (statusText) statusText.textContent = "Playing Birthday Music Box ♪";

      const tick = () => {
        if (!isPlaying) return;
        const note = MELODY_NOTES[stepIdx % MELODY_NOTES.length];
        playTone(note, 0.42, "sine", 0.28, 0);
        if (stepIdx % 4 === 0) {
          playTone(note * 0.5, 0.55, "triangle", 0.14, 0);
        }
        stepIdx += 1;
      };

      tick();
      loopTimer = setInterval(tick, 440);
    };

    const setVolume = (val0to100) => {
      volume = Math.max(0, Math.min(1, Number(val0to100) / 100));
      if (masterGain && ctx) {
        masterGain.gain.setTargetAtTime(volume * 0.35, ctx.currentTime, 0.03);
      }
    };

    const toggleSfx = () => {
      sfxEnabled = !sfxEnabled;
      const btn = document.getElementById("sfx-toggle-btn");
      if (btn) {
        btn.textContent = sfxEnabled ? "SFX: ON" : "SFX: OFF";
        btn.setAttribute("aria-pressed", String(sfxEnabled));
      }
      if (sfxEnabled) playSfx("pop");
    };

    return { toggleMusic, setVolume, toggleSfx, playSfx };
  })();

  /* ==========================================================================
     3. ACCESSIBLE MODAL CONTROLLER
     ========================================================================== */
  const ModalManager = (() => {
    const backdrop = document.getElementById("generic-modal");
    const titleEl = document.getElementById("generic-modal-title");
    const bodyEl = document.getElementById("generic-modal-body");
    const closeBtn = document.getElementById("generic-modal-close");
    let lastFocused = null;

    const open = (title, htmlContent) => {
      if (!backdrop || !titleEl || !bodyEl) return;
      lastFocused = document.activeElement;
      titleEl.textContent = title;
      bodyEl.innerHTML = htmlContent;
      backdrop.classList.add("open");
      if (closeBtn) closeBtn.focus();
    };

    const close = () => {
      if (!backdrop) return;
      backdrop.classList.remove("open");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    };

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close();
      });
    }

    return { open, close, bodyEl };
  })();

  /* ==========================================================================
     4. NAVIGATION, SCROLL SPY & 3D CARD TILT
     ========================================================================== */
  const initNavigation = () => {
    const navToggle = document.getElementById("nav-toggle");
    const navList = document.getElementById("primary-nav");
    const links = Array.from(document.querySelectorAll(".nav-link"));

    if (navToggle && navList) {
      navToggle.addEventListener("click", () => {
        const open = navList.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      links.forEach((link) => {
        link.addEventListener("click", () => {
          navList.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const id = `#${entry.target.id}`;
              links.forEach((l) => {
                l.classList.toggle("active", l.getAttribute("href") === id);
              });
            }
          }
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
      );
      sections.forEach((sec) => observer.observe(sec));
    }
  };

  const initTiltCards = () => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia && !window.matchMedia("(hover: hover)").matches) return;

    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".tilt-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    });

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.classList && e.target.classList.contains("tilt-card")) {
          e.target.style.transform = "";
        }
      },
      true
    );

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  };

  /* ==========================================================================
     5. HERO SECTION INTERACTIONS
     ========================================================================== */
  const initHero = () => {
    document.getElementById("hero-tagline").textContent = CFG.site.tagline;
    document.getElementById("hero-badge").querySelector("span:last-child").textContent =
      CFG.hero.warningBadge;
    document.getElementById("hero-heading").textContent = CFG.hero.heading;
    document.getElementById("hero-subtitle").textContent = CFG.hero.subtitle;
    document.getElementById("hero-authority").textContent = CFG.hero.authorityNotice;
    document.getElementById("footer-tagline").textContent = CFG.site.footerTagline;

    const enterBtn = document.getElementById("enter-experience-btn");
    const surpriseBtn = document.getElementById("surprise-me-btn");
    const toast = document.getElementById("hero-surprise-toast");
    const cakeBtn = document.getElementById("hero-cake-btn");
    const cakeEl = document.getElementById("hero-cake");
    const cakeCaption = document.getElementById("cake-caption");

    let surpriseIdx = 0;
    let wishesMade = 0;

    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        AudioEngine.playSfx("pop");
        ConfettiEngine.burst("birthday", 55, 0.3);
      });
    }

    if (surpriseBtn && toast) {
      surpriseBtn.addEventListener("click", () => {
        const msg = CFG.hero.surprisePopups[surpriseIdx % CFG.hero.surprisePopups.length];
        surpriseIdx += 1;
        toast.textContent = msg;
        toast.classList.add("visible");
        AudioEngine.playSfx("fanfare");
        ConfettiEngine.burst("birthday", 100, 0.4);
        ConfettiEngine.spawnFloatingParticles(["🎀", "💗", "✨", "🎂"], 12);
      });
    }

    if (cakeBtn && cakeEl && cakeCaption) {
      cakeBtn.addEventListener("click", () => {
        const candlesOut = cakeEl.classList.toggle("candles-out");
        cakeEl.classList.remove("bounce-once");
        void cakeEl.offsetWidth;
        cakeEl.classList.add("bounce-once");
        if (candlesOut) {
          wishesMade += 1;
          cakeCaption.textContent = `Wish #${wishesMade} locked in! Tap again to relight candles 🕯️`;
          AudioEngine.playSfx("fanfare");
          ConfettiEngine.burst("birthday", 85, 0.35);
          ConfettiEngine.spawnFloatingParticles(["✨", "🎂", "💗"], 10);
        } else {
          cakeCaption.textContent = "Candles relit! Tap the 3D cake to make another wish ✨";
          AudioEngine.playSfx("pop");
        }
      });
    }
  };

  /* ==========================================================================
     6. FAKE BREAKING NEWS DESK
     ========================================================================== */
  const NEWS_SVGS = {
    mood: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <circle cx="52" cy="45" r="24" fill="#FFD6E7" stroke="#38243A" stroke-width="2.5"/>
      <path d="M44 48 Q52 56 60 48" stroke="#38243A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="44" cy="40" r="2.5" fill="#38243A"/><circle cx="60" cy="40" r="2.5" fill="#38243A"/>
      <path d="M84 45 L100 45" stroke="#FF4F91" stroke-width="3" stroke-dasharray="4 4"/>
      <circle cx="114" cy="45" r="24" fill="#DCCBFF" stroke="#38243A" stroke-width="2.5"/>
      <path d="M105 53 Q114 44 123 53" stroke="#38243A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M102 36 L110 39 M126 36 L118 39" stroke="#38243A" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    drama: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <rect x="26" y="18" width="52" height="54" rx="14" fill="#FF4F91" opacity="0.88" stroke="#38243A" stroke-width="2.5"/>
      <rect x="82" y="22" width="52" height="54" rx="14" fill="#8B5CF6" opacity="0.88" stroke="#38243A" stroke-width="2.5"/>
      <circle cx="44" cy="39" r="3" fill="#FFF9F5"/><circle cx="60" cy="39" r="3" fill="#FFF9F5"/>
      <path d="M42 53 Q52 62 62 53" stroke="#FFF9F5" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="43" r="3" fill="#FFF9F5"/><circle cx="116" cy="43" r="3" fill="#FFF9F5"/>
      <circle cx="108" cy="57" r="5" fill="#FFF9F5"/>
    </svg>`,
    reply: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <rect x="22" y="20" width="116" height="44" rx="18" fill="#FFF9F5" stroke="#38243A" stroke-width="2.5"/>
      <circle cx="58" cy="42" r="5" fill="#8B5CF6"/><circle cx="80" cy="42" r="5" fill="#FF4F91"/><circle cx="102" cy="42" r="5" fill="#8B5CF6"/>
      <text x="80" y="80" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#513477">SEEN 3 DAYS AGO</text>
    </svg>`,
    cake: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <rect x="44" y="42" width="72" height="32" rx="10" fill="#FFD6E7" stroke="#38243A" stroke-width="2.5"/>
      <path d="M44 50 Q56 58 68 50 Q80 58 92 50 Q104 58 116 50" fill="none" stroke="#FF4F91" stroke-width="4" stroke-linecap="round"/>
      <rect x="76" y="22" width="8" height="20" rx="3" fill="#8B5CF6"/>
      <ellipse cx="80" cy="15" rx="5" ry="7" fill="#FBBF24"/>
    </svg>`,
    spotlight: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <polygon points="80,10 34,80 126,80" fill="#FFD6E7" opacity="0.65"/>
      <polygon points="80,22 86,38 103,38 89,48 94,65 80,55 66,65 71,48 57,38 74,38" fill="#FF4F91" stroke="#38243A" stroke-width="2"/>
    </svg>`,
    brain: `<svg viewBox="0 0 160 90" width="140" height="80" aria-hidden="true">
      <rect x="30" y="22" width="100" height="46" rx="14" fill="#FFF9F5" stroke="#38243A" stroke-width="2.5"/>
      <text x="80" y="44" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#FF4F91">REBOOTING...</text>
      <rect x="44" y="52" width="72" height="8" rx="4" fill="#DCCBFF"/>
      <rect x="44" y="52" width="46" height="8" rx="4" fill="#8B5CF6"/>
    </svg>`
  };

  const initBreakingNews = () => {
    const news = CFG.breakingNews;
    document.getElementById("news-channel-tag").textContent = news.network;
    document.getElementById("news-main-headline").textContent = news.mainHeadline;
    document.getElementById("news-sub-banner").textContent = news.subBanner;

    const tickerTrack = document.getElementById("news-ticker-track");
    if (tickerTrack) {
      const itemsHtml = news.tickerItems
        .map((t) => `<span>• ${escapeHtml(t)}</span>`)
        .join("");
      tickerTrack.innerHTML = itemsHtml + itemsHtml;
    }

    let repIdx = 0;
    const renderReporter = () => {
      const r = news.reporters[repIdx % news.reporters.length];
      document.getElementById("reporter-avatar").textContent = r.name.charAt(0);
      document.getElementById("reporter-name").textContent = r.name;
      document.getElementById("reporter-location").textContent = r.location;
      document.getElementById("reporter-quote").textContent = r.quote;
    };
    renderReporter();

    document.getElementById("next-reporter-btn")?.addEventListener("click", () => {
      repIdx += 1;
      renderReporter();
      AudioEngine.playSfx("pop");
    });

    const grid = document.getElementById("news-grid");
    if (grid) {
      grid.innerHTML = news.cards
        .map(
          (c, i) => `
          <article class="glass-card news-card tilt-card">
            <div class="news-card-top">
              <span class="news-cat-pill">${escapeHtml(c.category)}</span>
              <span>${escapeHtml(c.timestamp)}</span>
            </div>
            <div class="news-illustration">${NEWS_SVGS[c.illustration] || NEWS_SVGS.mood}</div>
            <h3>${escapeHtml(c.title)}</h3>
            <p>${escapeHtml(c.subtitle)}</p>
            <button type="button" class="btn btn-secondary btn-sm read-report-btn" data-news-index="${i}">
              Read Full Report 📰
            </button>
          </article>
        `
        )
        .join("");

      grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".read-report-btn");
        if (!btn) return;
        const item = news.cards[Number(btn.dataset.newsIndex)];
        if (!item) return;
        AudioEngine.playSfx("pop");
        ModalManager.open(
          item.title,
          `
            <p style="font-family:var(--font-mono); font-size:0.8rem; color:var(--cherry-pink); font-weight:700; margin-top:0;">
              ${escapeHtml(item.category)} • FILED AT ${escapeHtml(item.timestamp)}
            </p>
            <div class="news-illustration" style="margin-bottom:16px;">${NEWS_SVGS[item.illustration] || ""}</div>
            <p style="font-weight:700; color:var(--deep-purple);">${escapeHtml(item.subtitle)}</p>
            <p>${escapeHtml(item.fullReport)}</p>
          `
        );
      });
    }
  };

  /* ==========================================================================
     7. THE VYGA ROAST AWARDS
     ========================================================================== */
  const TROPHY_SVGS = {
    crown: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><path d="M3 18h18l-2-10-4.5 4L12 5l-2.5 7L5 8l-2 10z" fill="#FFD6E7"/></svg>`,
    hourglass: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><path d="M6 3h12M6 21h12M8 3c0 5 4 6 4 9s-4 4-4 9M16 3c0 5-4 6-4 9s4 4 4 9"/></svg>`,
    bubble: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.2-3.8A8 8 0 1 1 21 12z" fill="#DCCBFF"/><circle cx="9" cy="12" r="1" fill="#38243A"/><circle cx="12" cy="12" r="1" fill="#38243A"/><circle cx="15" cy="12" r="1" fill="#38243A"/></svg>`,
    star: `<svg width="36" height="36" viewBox="0 0 24 24" fill="#FF4F91" stroke="#38243A" stroke-width="1.8"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.7 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/></svg>`,
    brain: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .4.07.8.2 1.15A3.5 3.5 0 0 0 5 14a3.5 3.5 0 0 0 2 3.16A3 3 0 0 0 12 19V4.5A2.5 2.5 0 0 0 9.5 4z" fill="#FFD6E7"/><path d="M14.5 4A3.5 3.5 0 0 1 18 7.5c0 .4-.07.8-.2 1.15A3.5 3.5 0 0 1 19 14a3.5 3.5 0 0 1-2 3.16A3 3 0 0 1 12 19V4.5A2.5 2.5 0 0 1 14.5 4z" fill="#DCCBFF"/></svg>`,
    spotlight: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><circle cx="12" cy="12" r="5" fill="#FF4F91"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
    purpleheart: `<svg width="36" height="36" viewBox="0 0 24 24" fill="#8B5CF6" stroke="#38243A" stroke-width="1.8"><path d="M12 21s-7-4.5-9.3-8.6C1 9.2 2.9 5 6.8 5c2.2 0 3.9 1.2 5.2 2.9C13.3 6.2 15 5 17.2 5c3.9 0 5.8 4.2 4.1 7.4C19 16.5 12 21 12 21z"/></svg>`,
    cup: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#513477" stroke-width="2"><path d="M7 4h10v6a5 5 0 0 1-10 0V4z" fill="#FFD6E7"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v5M8 20h8"/></svg>`
  };

  const initRoastAwards = () => {
    const awards = CFG.roastAwards;
    const grid = document.getElementById("awards-grid");
    const progressLabel = document.getElementById("awards-progress-label");
    const progressFill = document.getElementById("awards-progress-fill");
    const revealAllBtn = document.getElementById("reveal-all-awards-btn");
    const revealedSet = new Set();

    const updateProgress = () => {
      const count = revealedSet.size;
      if (progressLabel) progressLabel.textContent = `${count} / ${awards.length} Awards Revealed`;
      if (progressFill) progressFill.style.width = `${(count / awards.length) * 100}%`;
    };

    if (!grid) return;
    grid.innerHTML = awards
      .map(
        (a, i) => `
        <article class="glass-card award-card tilt-card" data-award-idx="${i}">
          <span class="award-number">#${escapeHtml(a.number)}</span>
          <div class="award-trophy" aria-hidden="true">${TROPHY_SVGS[a.trophyStyle] || TROPHY_SVGS.cup}</div>
          <span class="award-badge">${escapeHtml(a.badge)}</span>
          <h3 class="award-title">${escapeHtml(a.title)}</h3>
          <p class="award-locked-hint">Tap below to unseal the official roast citation.</p>
          <div class="award-reveal-box">
            <p class="award-desc">${escapeHtml(a.description)}</p>
            <div class="award-speech">Acceptance Speech: ${escapeHtml(a.speech)}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm reveal-award-btn" data-award-idx="${i}">
            Reveal Award 🏆
          </button>
        </article>
      `
      )
      .join("");

    const revealOne = (idx, silent = false) => {
      const card = grid.querySelector(`.award-card[data-award-idx="${idx}"]`);
      if (!card || revealedSet.has(idx)) return;
      revealedSet.add(idx);
      card.classList.add("revealed");
      const btn = card.querySelector(".reveal-award-btn");
      if (btn) {
        btn.textContent = "Awarded ✓";
        btn.disabled = true;
      }
      updateProgress();
      if (!silent) {
        AudioEngine.playSfx("fanfare");
        if (revealedSet.size === awards.length) {
          ConfettiEngine.burst("birthday", 110, 0.35);
        }
      }
    };

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".reveal-award-btn");
      if (!btn) return;
      revealOne(Number(btn.dataset.awardIdx));
    });

    revealAllBtn?.addEventListener("click", () => {
      awards.forEach((_, idx) => revealOne(idx, true));
      AudioEngine.playSfx("fanfare");
      ConfettiEngine.burst("birthday", 120, 0.35);
    });

    updateProgress();
  };

  /* ==========================================================================
     8. THE MUSEUM OF VYGA (SCRAPBOOK UPLOAD, CAPTIONS, LIGHTBOX, DELETE)
     ========================================================================== */
  const ILLUSTRATION_DATA = {
    normal: { bg1: "#FFD6E7", bg2: "#FFF9F5", label: "OCCASIONALLY NORMAL", emoji: "😇🎀" },
    mainchar: { bg1: "#DCCBFF", bg2: "#FFD6E7", label: "MAIN CHARACTER ENERGY", emoji: "✨🎬" },
    innocent: { bg1: "#FFF9F5", bg2: "#DCCBFF", label: "RARE INNOCENCE", emoji: "🌸🦋" },
    assignment: { bg1: "#FFD6E7", bg2: "#DCCBFF", label: "ASSIGNMENT FACE", emoji: "📚👀" },
    army: { bg1: "#8B5CF6", bg2: "#DCCBFF", label: "ARMY IN DISGUISE", emoji: "💜🎧" },
    placeholder: { bg1: "#FF4F91", bg2: "#FFD6E7", label: "DROP REAL PHOTO HERE", emoji: "📸💗" }
  };

  const makeScrapbookSvg = (type, tag) => {
    const meta = ILLUSTRATION_DATA[type] || ILLUSTRATION_DATA.placeholder;
    return `
      <svg viewBox="0 0 400 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(meta.label)} placeholder frame">
        <defs>
          <linearGradient id="g-${escapeHtml(tag)}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${meta.bg1}" />
            <stop offset="100%" stop-color="${meta.bg2}" />
          </linearGradient>
        </defs>
        <rect width="400" height="290" fill="url(#g-${escapeHtml(tag)})" />
        <circle cx="330" cy="60" r="48" fill="#FFFFFF" fill-opacity="0.28" />
        <circle cx="66" cy="240" r="38" fill="#FFFFFF" fill-opacity="0.24" />
        <rect x="34" y="34" width="332" height="222" rx="22" fill="#FFF9F5" fill-opacity="0.72" stroke="#513477" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="6 6" />
        <text x="200" y="132" text-anchor="middle" font-size="52">${meta.emoji}</text>
        <text x="200" y="182" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="16" fill="#38243A">${escapeHtml(meta.label)}</text>
        <text x="200" y="210" text-anchor="middle" font-family="monospace" font-size="12" fill="#513477">Click Upload or Replace Photo</text>
      </svg>
    `;
  };

  const initPhotoMuseum = () => {
    const grid = document.getElementById("scrapbook-grid");
    const dropzone = document.getElementById("upload-dropzone");
    const fileInput = document.getElementById("photo-upload-input");
    const resetBtn = document.getElementById("reset-museum-btn");

    // Hidden single-item replacement input
    const replaceInput = document.createElement("input");
    replaceInput.type = "file";
    replaceInput.accept = "image/*";
    replaceInput.className = "sr-only";
    document.body.appendChild(replaceInput);
    let replaceTargetId = null;

    const loadItems = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.MUSEUM);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore storage read error
      }
      return CFG.photoMuseum.map((item) => ({ ...item }));
    };

    let items = loadItems();

    const persistItems = () => {
      try {
        localStorage.setItem(STORAGE_KEYS.MUSEUM, JSON.stringify(items));
      } catch {
        // Quota exceeded with huge images; keep active in memory without breaking UX
      }
    };

    const readImageFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Lightly downscale very large images so localStorage & rendering stay fast
          const img = new Image();
          img.onload = () => {
            const maxW = 1100;
            if (img.width <= maxW) {
              resolve(reader.result);
              return;
            }
            const scale = maxW / img.width;
            const c = document.createElement("canvas");
            c.width = maxW;
            c.height = Math.round(img.height * scale);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/jpeg", 0.85));
          };
          img.onerror = () => resolve(reader.result);
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const openLightbox = (index) => {
      const item = items[index];
      if (!item) return;
      const visual = item.imageUrl
        ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.caption)}" style="border-radius:16px; width:100%; max-height:60vh; object-fit:contain; background:#f8eef9;" />`
        : makeScrapbookSvg(item.illustrationType, `${item.id}-modal`);

      ModalManager.open(
        item.tag || "VYGA EXHIBIT",
        `
          ${visual}
          <p style="font-family:var(--font-hand); font-size:1.7rem; margin:16px 0 12px; color:var(--dark-plum);">
            ${escapeHtml(item.caption)}
          </p>
          <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-secondary btn-sm" id="lb-prev" ${items.length < 2 ? "disabled" : ""}>← Prev</button>
              <button type="button" class="btn btn-secondary btn-sm" id="lb-next" ${items.length < 2 ? "disabled" : ""}>Next →</button>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="lb-delete">Delete Exhibit 🗑️</button>
          </div>
        `
      );

      document.getElementById("lb-prev")?.addEventListener("click", () => {
        openLightbox((index - 1 + items.length) % items.length);
      });
      document.getElementById("lb-next")?.addEventListener("click", () => {
        openLightbox((index + 1) % items.length);
      });
      document.getElementById("lb-delete")?.addEventListener("click", () => {
        items.splice(index, 1);
        persistItems();
        render();
        ModalManager.close();
      });
    };

    const render = () => {
      if (!grid) return;
      if (items.length === 0) {
        grid.innerHTML = `<div class="glass-card" style="padding:30px; text-align:center;">
          <p style="margin:0 0 12px; font-weight:700;">Museum is empty! Upload photos of Vyga or restore the default exhibits.</p>
        </div>`;
        return;
      }

      grid.innerHTML = items
        .map(
          (item, i) => `
          <figure class="scrapbook-card" style="--tilt:${Number(item.rotation || 0)}deg;" data-id="${escapeHtml(item.id)}">
            <span class="washi-tape" aria-hidden="true"></span>
            <div class="scrapbook-photo-wrap" tabindex="0" role="button" aria-label="Preview ${escapeHtml(item.caption)}" data-preview-idx="${i}">
              ${
                item.imageUrl
                  ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.caption)}" loading="lazy" />`
                  : makeScrapbookSvg(item.illustrationType, item.id)
              }
            </div>
            <span class="scrapbook-tag">${escapeHtml(item.tag || `EXHIBIT #${i + 1}`)}</span>
            <figcaption
              class="scrapbook-caption"
              contenteditable="true"
              aria-label="Editable photo caption"
              data-caption-idx="${i}"
            >${escapeHtml(item.caption)}</figcaption>
            <div class="scrapbook-controls">
              <button type="button" class="btn-mini" data-replace-id="${escapeHtml(item.id)}">Replace Photo</button>
              <button type="button" class="btn-mini danger" data-delete-idx="${i}">Delete ✕</button>
            </div>
          </figure>
        `
        )
        .join("");
    };

    const handleFiles = async (fileList) => {
      const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
      if (!files.length) return;
      for (const file of files) {
        const dataUrl = await readImageFile(file);
        items.unshift({
          id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          tag: "UPLOADED MEMORY",
          caption: file.name.replace(/\.[^.]+$/, "") || "Another iconic Vyga moment.",
          imageUrl: dataUrl,
          rotation: Number(((Math.random() - 0.5) * 4).toFixed(1))
        });
      }
      persistItems();
      render();
      AudioEngine.playSfx("pop");
      ConfettiEngine.burst("birthday", 45, 0.5);
    };

    fileInput?.addEventListener("change", (e) => {
      handleFiles(e.target.files);
      e.target.value = "";
    });

    replaceInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file || !replaceTargetId) return;
      const dataUrl = await readImageFile(file);
      const target = items.find((it) => it.id === replaceTargetId);
      if (target) {
        target.imageUrl = dataUrl;
        target.tag = "REAL VYGA EXHIBIT";
        persistItems();
        render();
        AudioEngine.playSfx("pop");
      }
      replaceInput.value = "";
      replaceTargetId = null;
    });

    if (dropzone) {
      ["dragenter", "dragover"].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.add("drag-active");
        });
      });
      ["dragleave", "drop"].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.remove("drag-active");
        });
      });
      dropzone.addEventListener("drop", (e) => {
        handleFiles(e.dataTransfer?.files);
      });
    }

    grid?.addEventListener("click", (e) => {
      const preview = e.target.closest("[data-preview-idx]");
      if (preview) {
        openLightbox(Number(preview.dataset.previewIdx));
        return;
      }
      const del = e.target.closest("[data-delete-idx]");
      if (del) {
        items.splice(Number(del.dataset.deleteIdx), 1);
        persistItems();
        render();
        AudioEngine.playSfx("pop");
        return;
      }
      const rep = e.target.closest("[data-replace-id]");
      if (rep) {
        replaceTargetId = rep.dataset.replaceId;
        replaceInput.click();
      }
    });

    grid?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches("[data-preview-idx]")) {
        e.preventDefault();
        openLightbox(Number(e.target.dataset.previewIdx));
      }
      if (e.key === "Enter" && e.target.matches("[data-caption-idx]")) {
        e.preventDefault();
        e.target.blur();
      }
    });

    grid?.addEventListener(
      "blur",
      (e) => {
        if (!e.target.matches("[data-caption-idx]")) return;
        const idx = Number(e.target.dataset.captionIdx);
        if (items[idx]) {
          items[idx].caption = e.target.textContent.trim() || "Iconic Vyga exhibit.";
          persistItems();
        }
      },
      true
    );

    resetBtn?.addEventListener("click", () => {
      items = CFG.photoMuseum.map((item) => ({ ...item }));
      persistItems();
      render();
      AudioEngine.playSfx("pop");
    });

    render();
  };

  /* ==========================================================================
     9. INTERACTIVE MINI GAMES (QUIZ, 7s CAKE CATCH, MYSTERY SOLVER)
     ========================================================================== */
  const initMiniGames = () => {
    // Tabs
    const tabBtns = document.querySelectorAll(".game-tab-btn");
    const panels = document.querySelectorAll(".game-panel");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.gameTab;
        tabBtns.forEach((b) => {
          const active = b.dataset.gameTab === target;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        panels.forEach((p) => p.classList.toggle("active", p.id === `game-panel-${target}`));
        AudioEngine.playSfx("pop");
      });
    });

    /* --- GAME 1: HOW WELL DO YOU KNOW VYGA? --- */
    const quizEl = document.getElementById("quiz-container");
    const questions = CFG.miniGames.quizQuestions;
    let qIdx = 0;
    let score = 0;
    let answered = false;

    const renderQuiz = () => {
      if (!quizEl) return;
      if (qIdx >= questions.length) {
        const maxScore = questions.length * 20;
        const pct = Math.round((score / maxScore) * 100);
        let verdict = "Acquaintance Level — Did you ignore her group chat essays? 👀";
        if (pct >= 85) verdict = "Certified Bestie & Official Classroom Chaos Co-Star! 💜🎀";
        else if (pct >= 60) verdict = "Solid Friend! You survive Vyga's drama with grace. ✨";

        quizEl.innerHTML = `
          <div class="quiz-results">
            <div class="quiz-score-circle">${pct}%</div>
            <h3 style="font-family:var(--font-display); margin:0 0 8px;">Quiz Complete! Score: ${score} / ${maxScore}</h3>
            <p style="font-weight:700; color:var(--deep-purple); margin:0 0 22px;">${verdict}</p>
            <button type="button" class="btn btn-primary" id="quiz-restart-btn">Play Quiz Again 🔄</button>
          </div>
        `;
        ConfettiEngine.burst("birthday", 90, 0.4);
        AudioEngine.playSfx("fanfare");
        document.getElementById("quiz-restart-btn")?.addEventListener("click", () => {
          qIdx = 0;
          score = 0;
          answered = false;
          renderQuiz();
        });
        return;
      }

      const q = questions[qIdx];
      answered = false;
      quizEl.innerHTML = `
        <div class="quiz-progress-row">
          <span>QUESTION ${qIdx + 1} OF ${questions.length}</span>
          <span>SCORE: ${score}</span>
        </div>
        <h3 class="quiz-question">${escapeHtml(q.question)}</h3>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, idx) => `
              <button type="button" class="quiz-option-btn" data-opt-idx="${idx}">
                ${escapeHtml(opt.text)}
              </button>
            `
            )
            .join("")}
        </div>
        <div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>
        <div style="margin-top:18px; display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-primary btn-sm" id="quiz-next-btn" style="display:none;">
            ${qIdx === questions.length - 1 ? "See Final Results 🎉" : "Next Question →"}
          </button>
        </div>
      `;

      quizEl.querySelectorAll(".quiz-option-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const opt = q.options[Number(btn.dataset.optIdx)];
          score += opt.points;
          btn.classList.add("selected");
          quizEl.querySelectorAll(".quiz-option-btn").forEach((b) => (b.disabled = true));
          const fb = document.getElementById("quiz-feedback");
          const nextBtn = document.getElementById("quiz-next-btn");
          if (fb) {
            fb.textContent = `${opt.feedback} (+${opt.points} pts)`;
            fb.style.display = "block";
          }
          if (nextBtn) nextBtn.style.display = "inline-flex";
          AudioEngine.playSfx(opt.points >= 15 ? "catch" : "pop");
        });
      });

      document.getElementById("quiz-next-btn")?.addEventListener("click", () => {
        qIdx += 1;
        renderQuiz();
      });
    };
    renderQuiz();

    /* --- GAME 2: CATCH THE BIRTHDAY CAKE (7 SECONDS) --- */
    const arena = document.getElementById("cake-arena");
    const target = document.getElementById("cake-target");
    const overlay = document.getElementById("cake-overlay");
    const startCakeBtn = document.getElementById("start-cake-game-btn");
    const timerEl = document.getElementById("cake-timer");
    const scoreEl = document.getElementById("cake-score");
    const bestEl = document.getElementById("cake-best");
    const resultMsg = document.getElementById("cake-result-msg");

    let cakeScore = 0;
    let cakeBest = Number(localStorage.getItem(STORAGE_KEYS.CAKE_BEST) || 0);
    if (bestEl) bestEl.textContent = String(cakeBest);
    let cakeInterval = null;
    let dodgeInterval = null;
    let timeLeftMs = 7000;

    const moveCake = () => {
      if (!arena || !target) return;
      const maxX = Math.max(20, arena.clientWidth - 80);
      const maxY = Math.max(20, arena.clientHeight - 80);
      target.style.left = `${10 + Math.random() * maxX}px`;
      target.style.top = `${10 + Math.random() * maxY}px`;
    };

    const scheduleAutoDodge = () => {
      clearInterval(dodgeInterval);
      // Gets faster as score increases!
      const speedMs = Math.max(480, 1250 - cakeScore * 70);
      dodgeInterval = setInterval(moveCake, speedMs);
    };

    const endCakeGame = () => {
      clearInterval(cakeInterval);
      clearInterval(dodgeInterval);
      if (target) target.style.display = "none";
      if (overlay) overlay.style.display = "flex";
      if (timerEl) timerEl.textContent = "0.0";

      if (cakeScore > cakeBest) {
        cakeBest = cakeScore;
        localStorage.setItem(STORAGE_KEYS.CAKE_BEST, String(cakeBest));
        if (bestEl) bestEl.textContent = String(cakeBest);
      }

      let funnyVerdict = `You caught ${cakeScore} cakes! `;
      if (cakeScore >= 14) funnyVerdict += "Unstoppable pastry predator. Vyga approves! 🎂🔥";
      else if (cakeScore >= 8) funnyVerdict += "Respectable sugar reflexes! Almost fast enough to steal Vyga's slice.";
      else funnyVerdict += "The cake outran you! Clearly you need five more minutes.";

      if (resultMsg) resultMsg.textContent = funnyVerdict;
      if (startCakeBtn) startCakeBtn.textContent = "Play Again 🎂";
      if (cakeScore > 0) {
        ConfettiEngine.burst("birthday", 65, 0.45);
        AudioEngine.playSfx("fanfare");
      }
    };

    const startCakeGame = () => {
      cakeScore = 0;
      timeLeftMs = 7000;
      if (scoreEl) scoreEl.textContent = "0";
      if (timerEl) timerEl.textContent = "7.0";
      if (overlay) overlay.style.display = "none";
      if (target) {
        target.style.display = "grid";
        moveCake();
      }
      scheduleAutoDodge();

      clearInterval(cakeInterval);
      cakeInterval = setInterval(() => {
        timeLeftMs -= 50;
        if (timeLeftMs <= 0) {
          endCakeGame();
        } else if (timerEl) {
          timerEl.textContent = (timeLeftMs / 1000).toFixed(1);
        }
      }, 50);
    };

    startCakeBtn?.addEventListener("click", startCakeGame);

    target?.addEventListener("click", (e) => {
      if (timeLeftMs <= 0) return;
      cakeScore += 1;
      if (scoreEl) scoreEl.textContent = String(cakeScore);
      AudioEngine.playSfx("catch");

      if (arena) {
        const pop = document.createElement("span");
        pop.className = "plus-one-pop";
        pop.textContent = "+1 🎂";
        pop.style.left = target.style.left;
        pop.style.top = target.style.top;
        arena.appendChild(pop);
        setTimeout(() => pop.remove(), 650);
      }

      moveCake();
      scheduleAutoDodge();
      e.stopPropagation();
    });

    /* --- GAME 3: GUESS THE MYSTERY --- */
    const mysteryEl = document.getElementById("mystery-container");
    const riddles = CFG.miniGames.mysteryRiddles;
    let rIdx = 0;
    let cluesShown = 1;
    let solvedCount = 0;

    const renderMystery = () => {
      if (!mysteryEl) return;
      if (rIdx >= riddles.length) {
        mysteryEl.innerHTML = `
          <div class="quiz-results">
            <div style="font-size:3.2rem; margin-bottom:10px;">🕵️‍♀️💜</div>
            <h3 style="font-family:var(--font-display); margin:0 0 12px;">All ${riddles.length} Mysteries Solved!</h3>
            <p style="font-weight:700; color:var(--deep-purple); max-width:560px; margin:0 auto 20px;">
              ${escapeHtml(CFG.miniGames.mysteryReward)}
            </p>
            <button type="button" class="btn btn-primary" id="mystery-restart-btn">Play Mystery Game Again 🔄</button>
          </div>
        `;
        ConfettiEngine.burst("purple", 95, 0.4);
        AudioEngine.playSfx("borahae");
        document.getElementById("mystery-restart-btn")?.addEventListener("click", () => {
          rIdx = 0;
          cluesShown = 1;
          solvedCount = 0;
          renderMystery();
        });
        return;
      }

      const current = riddles[rIdx];
      const visibleClues = current.clues.slice(0, cluesShown);

      mysteryEl.innerHTML = `
        <div class="quiz-progress-row">
          <span>${escapeHtml(current.title)} (${rIdx + 1}/${riddles.length})</span>
          <span>SOLVED: ${solvedCount}</span>
        </div>
        <div class="mystery-clues">
          ${visibleClues.map((c) => `<div class="clue-item">${escapeHtml(c)}</div>`).join("")}
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
          <button type="button" class="btn btn-ghost btn-sm" id="next-clue-btn" ${
            cluesShown >= current.clues.length ? "disabled" : ""
          }>
            ${cluesShown >= current.clues.length ? "All Clues Shown" : "Reveal Another Clue 🔍"}
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="reveal-mystery-btn">
            Reveal Answer 💡
          </button>
        </div>

        <form class="mystery-input-row" id="mystery-form">
          <label for="mystery-guess-input" class="sr-only">Your mystery guess</label>
          <input type="text" id="mystery-guess-input" class="text-input" placeholder="Type your guess..." autocomplete="off" />
          <button type="submit" class="btn btn-primary btn-sm">Check Guess</button>
        </form>

        <div class="quick-chips" aria-label="Quick answer options">
          ${current.quickChoices
            .map(
              (ch) => `<button type="button" class="chip-btn" data-chip="${escapeHtml(ch)}">${escapeHtml(ch)}</button>`
            )
            .join("")}
        </div>

        <div id="mystery-feedback" class="quiz-feedback" style="display:none;"></div>
        <div style="margin-top:16px; display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-purple btn-sm" id="next-mystery-btn" style="display:none;">
            ${rIdx === riddles.length - 1 ? "Claim Secret Reward 🎁" : "Next Mystery →"}
          </button>
        </div>
      `;

      const fb = document.getElementById("mystery-feedback");
      const nextBtn = document.getElementById("next-mystery-btn");
      let caseClosed = false;

      const checkAnswer = (raw) => {
        if (caseClosed) return;
        const guess = String(raw || "").trim().toLowerCase();
        if (!guess) return;
        const matched = current.acceptedAnswers.some(
          (ans) => guess === ans || guess.includes(ans)
        );

        if (matched) {
          caseClosed = true;
          solvedCount += 1;
          if (fb) {
            fb.textContent = `🎉 Correct! ${current.displayAnswer} — ${current.solvedNote}`;
            fb.style.display = "block";
          }
          if (nextBtn) nextBtn.style.display = "inline-flex";
          AudioEngine.playSfx("fanfare");
        } else {
          const msg =
            current.wrongMessages[Math.floor(Math.random() * current.wrongMessages.length)];
          if (fb) {
            fb.textContent = `❌ ${msg}`;
            fb.style.display = "block";
          }
          AudioEngine.playSfx("error");
        }
      };

      document.getElementById("next-clue-btn")?.addEventListener("click", () => {
        if (cluesShown < current.clues.length) {
          cluesShown += 1;
          renderMystery();
        }
      });

      document.getElementById("reveal-mystery-btn")?.addEventListener("click", () => {
        caseClosed = true;
        if (fb) {
          fb.textContent = `💡 Answer Revealed: ${current.displayAnswer} — ${current.solvedNote}`;
          fb.style.display = "block";
        }
        if (nextBtn) nextBtn.style.display = "inline-flex";
        AudioEngine.playSfx("pop");
      });

      document.getElementById("mystery-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        checkAnswer(document.getElementById("mystery-guess-input")?.value);
      });

      mysteryEl.querySelectorAll("[data-chip]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const input = document.getElementById("mystery-guess-input");
          if (input) input.value = chip.dataset.chip;
          checkAnswer(chip.dataset.chip);
        });
      });

      nextBtn?.addEventListener("click", () => {
        rIdx += 1;
        cluesShown = 1;
        renderMystery();
      });
    };
    renderMystery();
  };

  /* ==========================================================================
     10. VYGA'S PURPLE UNIVERSE (BTS / ARMY ZONE)
     ========================================================================== */
  const initPurpleUniverse = () => {
    const bts = CFG.btsZone;
    const section = document.getElementById("purple-universe");
    const starfield = document.getElementById("purple-starfield");
    const borahaeBtn = document.getElementById("borahae-btn");
    const borahaeMsg = document.getElementById("borahae-msg");
    const purpleConfettiBtn = document.getElementById("purple-confetti-btn");
    const verifyArmyBtn = document.getElementById("verify-army-btn");
    const verifyNote = document.getElementById("army-verified-note");

    document.getElementById("purple-title").textContent = bts.title;
    document.getElementById("purple-subtitle").textContent = bts.subtitle;
    document.getElementById("army-award-badge").textContent = bts.armyAward.badge;
    document.getElementById("army-award-title").textContent = bts.armyAward.title;
    document.getElementById("army-award-desc").textContent = bts.armyAward.description;

    // Generate twinkling background stars
    if (starfield) {
      for (let i = 0; i < 48; i += 1) {
        const star = document.createElement("span");
        star.className = "cosmos-star";
        const size = 2 + Math.random() * 4;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty("--twinkle-dur", `${2 + Math.random() * 3.5}s`);
        starfield.appendChild(star);
      }
    }

    // A. Borahae Button
    borahaeBtn?.addEventListener("click", () => {
      section?.classList.add("galaxy-supercharged");
      if (borahaeMsg) {
        borahaeMsg.textContent = bts.borahaeDisplayMessage;
        borahaeMsg.classList.add("visible");
      }
      AudioEngine.playSfx("borahae");
      ConfettiEngine.burst("purple", 120, 0.4);
      ConfettiEngine.spawnFloatingParticles(["💜", "✨", "🌙", "💜"], 20);
    });

    // E. Purple Confetti
    purpleConfettiBtn?.addEventListener("click", () => {
      AudioEngine.playSfx("borahae");
      ConfettiEngine.burst("purple", 130, 0.35);
      ConfettiEngine.spawnFloatingParticles(["💜", "⭐", "🎆"], 15);
    });

    // B. ARMY Award Stamp
    verifyArmyBtn?.addEventListener("click", () => {
      if (verifyNote) {
        verifyNote.textContent = "✓ VERIFIED: Lifetime OT7 ARMY Status Confirmed for Vyga! 💜";
      }
      verifyArmyBtn.textContent = "ARMY Verified ✓";
      AudioEngine.playSfx("borahae");
      ConfettiEngine.burst("purple", 70, 0.5);
    });

    // C. BTS Playlist
    const playlistNameInput = document.getElementById("playlist-name-input");
    const playlistEl = document.getElementById("bts-playlist-list");
    const openAddSongBtn = document.getElementById("open-add-song-btn");

    const loadPlaylistName = () =>
      localStorage.getItem(STORAGE_KEYS.PLAYLIST_NAME) || bts.playlistName;

    const loadSongs = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYLIST_SONGS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length) return parsed;
        }
      } catch {
        // fallback
      }
      return bts.songs.map((s) => ({ ...s }));
    };

    let songs = loadSongs();

    if (playlistNameInput) {
      playlistNameInput.value = loadPlaylistName();
      playlistNameInput.addEventListener("input", () => {
        localStorage.setItem(STORAGE_KEYS.PLAYLIST_NAME, playlistNameInput.value);
      });
    }

    const renderSongs = () => {
      if (!playlistEl) return;
      playlistEl.innerHTML = songs
        .map((s, idx) => {
          const yt = safeHttpUrl(s.youtubeUrl) || `https://www.youtube.com/results?search_query=${encodeURIComponent(`BTS ${s.title}`)}`;
          const sp = safeHttpUrl(s.spotifyUrl) || `https://open.spotify.com/search/${encodeURIComponent(`BTS ${s.title}`)}`;
          return `
            <div class="song-row">
              <div class="song-info">
                <strong>💜 ${escapeHtml(s.title)}</strong>
                <span>${escapeHtml(s.album || "BTS")} • ${escapeHtml(s.vibe || "ARMY Favourite")}</span>
              </div>
              <div class="song-links">
                <a class="platform-link yt" href="${escapeHtml(yt)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
                <a class="platform-link sp" href="${escapeHtml(sp)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a>
                ${
                  s.custom
                    ? `<button type="button" class="platform-link" style="background:rgba(255,255,255,0.12); cursor:pointer;" data-del-song="${idx}" aria-label="Remove ${escapeHtml(s.title)}">✕</button>`
                    : ""
                }
              </div>
            </div>
          `;
        })
        .join("");
    };

    playlistEl?.addEventListener("click", (e) => {
      const del = e.target.closest("[data-del-song]");
      if (!del) return;
      songs.splice(Number(del.dataset.delSong), 1);
      localStorage.setItem(STORAGE_KEYS.PLAYLIST_SONGS, JSON.stringify(songs));
      renderSongs();
    });

    openAddSongBtn?.addEventListener("click", () => {
      ModalManager.open(
        "Add a BTS Track to Vyga's Playlist 💜",
        `
          <form id="add-song-form" style="display:grid; gap:12px;">
            <div>
              <label for="new-song-title" style="display:block; font-weight:700; margin-bottom:4px;">Song Title *</label>
              <input id="new-song-title" class="text-input" style="width:100%;" placeholder="e.g. Euphoria / Run BTS" required />
            </div>
            <div>
              <label for="new-song-vibe" style="display:block; font-weight:700; margin-bottom:4px;">Album or Birthday Vibe</label>
              <input id="new-song-vibe" class="text-input" style="width:100%;" placeholder="e.g. Proof • Pure serotonin" />
            </div>
            <div>
              <label for="new-song-yt" style="display:block; font-weight:700; margin-bottom:4px;">Official YouTube URL (optional)</label>
              <input id="new-song-yt" class="text-input" style="width:100%;" placeholder="https://www.youtube.com/..." />
            </div>
            <div>
              <label for="new-song-sp" style="display:block; font-weight:700; margin-bottom:4px;">Official Spotify URL (optional)</label>
              <input id="new-song-sp" class="text-input" style="width:100%;" placeholder="https://open.spotify.com/..." />
            </div>
            <button type="submit" class="btn btn-purple">Save Song to Playlist 💜</button>
          </form>
        `
      );

      document.getElementById("add-song-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("new-song-title").value.trim();
        if (!title) return;
        const vibe = document.getElementById("new-song-vibe").value.trim() || "Custom ARMY Pick";
        const ytRaw = document.getElementById("new-song-yt").value.trim();
        const spRaw = document.getElementById("new-song-sp").value.trim();
        songs.unshift({
          title,
          album: "BTS",
          vibe,
          youtubeUrl:
            safeHttpUrl(ytRaw) ||
            `https://www.youtube.com/results?search_query=${encodeURIComponent(`BTS ${title}`)}`,
          spotifyUrl:
            safeHttpUrl(spRaw) ||
            `https://open.spotify.com/search/${encodeURIComponent(`BTS ${title}`)}`,
          custom: true
        });
        localStorage.setItem(STORAGE_KEYS.PLAYLIST_SONGS, JSON.stringify(songs));
        renderSongs();
        ModalManager.close();
        AudioEngine.playSfx("borahae");
      });
    });

    renderSongs();

    // D. Secret BTS Surprise (7 OT7 Stars)
    const starsContainer = document.getElementById("ot7-stars");
    const secretMsgEl = document.getElementById("ot7-secret-msg");
    const litStars = new Set();

    if (starsContainer) {
      starsContainer.innerHTML = Array.from({ length: 7 }, (_, i) => i + 1)
        .map(
          (n) => `<button type="button" class="ot7-star-btn" data-star="${n}" aria-label="Purple star ${n} of 7">★</button>`
        )
        .join("");

      starsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".ot7-star-btn");
        if (!btn) return;
        const num = btn.dataset.star;
        if (!litStars.has(num)) {
          litStars.add(num);
          btn.classList.add("lit");
          AudioEngine.playSfx("pop");
        }
        if (litStars.size === 7 && secretMsgEl && !secretMsgEl.classList.contains("visible")) {
          secretMsgEl.textContent = bts.secretSurprise.message;
          secretMsgEl.classList.add("visible");
          AudioEngine.playSfx("borahae");
          ConfettiEngine.burst("purple", 110, 0.5);
          ConfettiEngine.spawnFloatingParticles(["💜", "✨", "🌟"], 16);
        }
      });
    }
  };

  /* ==========================================================================
     11. SECRET BIRTHDAY VAULT
     ========================================================================== */
  const initSecretVault = () => {
    const vault = CFG.secretVault;
    const form = document.getElementById("vault-form");
    const input = document.getElementById("vault-password-input");
    const lockIcon = document.getElementById("vault-lock-icon");
    const shackle = document.getElementById("vault-shackle");
    const feedback = document.getElementById("vault-feedback");
    const hintBtn = document.getElementById("vault-hint-btn");
    const panel = document.getElementById("vault-unlocked-panel");

    document.getElementById("vault-unlock-heading").textContent = vault.unlockHeading;
    document.getElementById("vault-unlock-message").textContent = vault.unlockMessage;
    document.getElementById("vault-unlock-reward").textContent = vault.unlockReward;
    document.getElementById("vault-vip-coupon").textContent = vault.vipCoupon;

    let wrongCount = 0;

    hintBtn?.addEventListener("click", () => {
      if (feedback) {
        feedback.style.color = "var(--deep-purple)";
        feedback.textContent = vault.hint;
      }
      AudioEngine.playSfx("pop");
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const attempt = (input?.value || "").trim().toLowerCase();
      const target = String(vault.correctAnswer || "birthday").trim().toLowerCase();

      if (attempt === target) {
        lockIcon?.classList.remove("shake");
        lockIcon?.classList.add("unlocked");
        if (shackle) {
          shackle.setAttribute("d", "M7 11V7a5 5 0 0 1 9.8-1.5");
        }
        if (feedback) {
          feedback.style.color = "var(--bts-purple)";
          feedback.textContent = "Identity verified! Welcome to VIP Birthday Mode. ✨";
        }
        panel?.classList.add("visible");
        AudioEngine.playSfx("fanfare");
        ConfettiEngine.burst("birthday", 125, 0.45);
        ConfettiEngine.spawnFloatingParticles(["💗", "🎁", "✨"], 14);
      } else {
        lockIcon?.classList.remove("shake");
        void lockIcon?.offsetWidth;
        lockIcon?.classList.add("shake");
        if (feedback) {
          feedback.style.color = "var(--cherry-pink)";
          feedback.textContent = vault.wrongResponses[wrongCount % vault.wrongResponses.length];
        }
        wrongCount += 1;
        AudioEngine.playSfx("error");
      }
    });
  };

  /* ==========================================================================
     12. SHARED COUNTDOWN HELPERS, FIRST-PAGE GATE & COUNTDOWN SECTION
     ========================================================================== */
  const padTime = (n) => String(Math.max(0, n)).padStart(2, "0");

  const getConfiguredDate = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.BIRTHDAY_DATE);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) {
      const [y, m, d] = saved.split("-").map(Number);
      return { year: y, month: m, day: d, source: "custom", raw: saved };
    }
    if (CFG.birthdayDate.month && CFG.birthdayDate.day) {
      const y = CFG.birthdayDate.year ? Number(CFG.birthdayDate.year) : null;
      const m = Number(CFG.birthdayDate.month);
      const d = Number(CFG.birthdayDate.day);
      const raw =
        CFG.birthdayDate.isoDate ||
        (y ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null);
      return { year: y, month: m, day: d, source: "config", raw };
    }
    return null;
  };

  const computeNextTarget = () => {
    const now = new Date();
    const cfgDate = getConfiguredDate();

    if (!cfgDate) {
      const demoTarget = new Date(now);
      demoTarget.setDate(demoTarget.getDate() + (CFG.birthdayDate.demoDaysAhead || 7));
      demoTarget.setHours(0, 0, 0, 0);
      return { target: demoTarget, isToday: false, isDemo: true };
    }

    if (cfgDate.year) {
      const exactTarget = new Date(cfgDate.year, cfgDate.month - 1, cfgDate.day, 0, 0, 0, 0);
      const isSameYearToday =
        now.getFullYear() === cfgDate.year &&
        now.getMonth() + 1 === cfgDate.month &&
        now.getDate() === cfgDate.day;
      if (isSameYearToday) {
        return { target: exactTarget, isToday: true, isDemo: false, cfgDate };
      }
      if (exactTarget > now) {
        return { target: exactTarget, isToday: false, isDemo: false, cfgDate };
      }
    }

    const isToday = now.getMonth() + 1 === cfgDate.month && now.getDate() === cfgDate.day;
    let target = new Date(now.getFullYear(), cfgDate.month - 1, cfgDate.day, 0, 0, 0, 0);
    if (!isToday && target <= now) {
      target = new Date(now.getFullYear() + 1, cfgDate.month - 1, cfgDate.day, 0, 0, 0, 0);
    }
    return { target, isToday, isDemo: false, cfgDate };
  };

  const splitRemainingMs = (diffMs) => {
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
    return {
      d: Math.floor(totalSecs / 86400),
      h: Math.floor((totalSecs % 86400) / 3600),
      m: Math.floor((totalSecs % 3600) / 60),
      s: totalSecs % 60
    };
  };

  const initCountdownGate = () => {
    const gateCfg = CFG.countdownGate;
    if (!gateCfg?.enabled) {
      document.body.classList.remove("gate-locked");
      return;
    }

    const gateCard = document.getElementById("gate-card");
    const badgeEl = document.getElementById("gate-badge")?.querySelector("span:last-child");
    const titleEl = document.getElementById("gate-title");
    const subtitleEl = document.getElementById("gate-subtitle");
    const daysEl = document.getElementById("gate-days");
    const hoursEl = document.getElementById("gate-hours");
    const minsEl = document.getElementById("gate-minutes");
    const secsEl = document.getElementById("gate-seconds");
    const targetNoteEl = document.getElementById("gate-target-note");
    const enterBtn = document.getElementById("gate-enter-btn");
    const feedbackEl = document.getElementById("gate-feedback");

    let gateUnlocked = false;
    let attemptCount = 0;
    let unlockCelebrated = false;

    const enterSite = () => {
      document.body.classList.remove("gate-locked");
      window.scrollTo({ top: 0, behavior: "auto" });
      AudioEngine.playSfx("fanfare");
      ConfettiEngine.burst("birthday", 105, 0.35);
      ConfettiEngine.spawnFloatingParticles(["🎀", "💗", "💜", "🎂"], 14);
    };

    const setGateVisualState = (unlocked) => {
      gateUnlocked = unlocked;
      gateCard?.classList.toggle("gate-unlocked", unlocked);
      if (enterBtn) {
        enterBtn.setAttribute("aria-disabled", String(!unlocked));
        enterBtn.textContent = unlocked ? gateCfg.unlockedButtonLabel : gateCfg.lockedButtonLabel;
      }
      if (unlocked) {
        if (badgeEl) badgeEl.textContent = gateCfg.unlockedBadge;
        if (titleEl) titleEl.textContent = gateCfg.unlockedTitle;
        if (subtitleEl) subtitleEl.textContent = gateCfg.unlockedSubtitle;
        if (feedbackEl) {
          feedbackEl.style.color = "var(--bts-purple)";
          feedbackEl.textContent = "Countdown complete! Tap the button above to enter Vyga's Birthday World! 💜";
        }
        if (!unlockCelebrated) {
          unlockCelebrated = true;
          AudioEngine.playSfx("fanfare");
          ConfettiEngine.burst("finale", 120, 0.35);
          ConfettiEngine.spawnFloatingParticles(["🎉", "💜", "💗", "🎂"], 16);
        }
      } else {
        unlockCelebrated = false;
        if (badgeEl) badgeEl.textContent = gateCfg.badge;
        if (titleEl) titleEl.textContent = gateCfg.lockedTitle;
        if (subtitleEl) subtitleEl.textContent = gateCfg.lockedSubtitle;
      }
    };

    const tickGate = () => {
      if (!document.body.classList.contains("gate-locked")) return;

      const state = computeNextTarget();
      if (CFG.birthdayDate.forceBirthdayToday || state.isToday) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        if (targetNoteEl) targetNoteEl.textContent = "Today is Vyga Day (17/11/2026)! 🎉";
        setGateVisualState(true);
        return;
      }

      const diffMs = state.target.getTime() - Date.now();
      const { d, h, m, s } = splitRemainingMs(diffMs);
      if (daysEl) daysEl.textContent = padTime(d);
      if (hoursEl) hoursEl.textContent = padTime(h);
      if (minsEl) minsEl.textContent = padTime(m);
      if (secsEl) secsEl.textContent = padTime(s);
      if (targetNoteEl) {
        const dd = padTime(state.target.getDate());
        const mm = padTime(state.target.getMonth() + 1);
        const yyyy = state.target.getFullYear();
        targetNoteEl.textContent = `Unlock Date: ${state.target.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric"
        })} (${dd}/${mm}/${yyyy}) 🎀`;
      }
      setGateVisualState(false);
    };

    enterBtn?.addEventListener("click", () => {
      if (!gateUnlocked) {
        gateCard?.classList.remove("shake");
        void gateCard?.offsetWidth;
        gateCard?.classList.add("shake");
        if (feedbackEl) {
          feedbackEl.style.color = "var(--cherry-pink)";
          feedbackEl.textContent =
            gateCfg.lockedAttemptMessages[attemptCount % gateCfg.lockedAttemptMessages.length];
        }
        attemptCount += 1;
        AudioEngine.playSfx("error");
        return;
      }
      enterSite();
    });

    document.getElementById("reopen-gate-btn")?.addEventListener("click", () => {
      if (feedbackEl) feedbackEl.textContent = "";
      document.body.classList.add("gate-locked");
      window.scrollTo({ top: 0, behavior: "auto" });
      tickGate();
    });

    tickGate();
    setInterval(tickGate, 250);
  };

  const initCountdown = () => {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-minutes");
    const secsEl = document.getElementById("cd-seconds");
    const bannerEl = document.getElementById("birthday-day-banner");
    const statusEl = document.getElementById("countdown-status-note");
    const datePicker = document.getElementById("birthday-date-picker");
    const previewBtn = document.getElementById("toggle-bday-preview-btn");

    let previewBirthdayDay = Boolean(CFG.birthdayDate.forceBirthdayToday);
    let birthdayConfettiFired = false;

    const existing = getConfiguredDate();
    if (existing?.raw && datePicker) {
      datePicker.value = existing.raw;
    }

    const tick = () => {
      const state = computeNextTarget();
      const celebrateNow = previewBirthdayDay || state.isToday;

      if (celebrateNow) {
        bannerEl?.classList.add("visible");
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        if (statusEl) {
          statusEl.textContent = previewBirthdayDay
            ? "Birthday Day Preview Mode Active — Party Protocols Engaged!"
            : "Automatic Birthday Detection Triggered — HAPPY BIRTHDAY VYGA! 🎂";
        }
        if (!birthdayConfettiFired) {
          birthdayConfettiFired = true;
          ConfettiEngine.burst("finale", 110, 0.35);
        }
        return;
      }

      birthdayConfettiFired = false;
      bannerEl?.classList.remove("visible");
      const { d, h, m, s } = splitRemainingMs(state.target.getTime() - Date.now());

      if (daysEl) daysEl.textContent = padTime(d);
      if (hoursEl) hoursEl.textContent = padTime(h);
      if (minsEl) minsEl.textContent = padTime(m);
      if (secsEl) secsEl.textContent = padTime(s);

      if (statusEl) {
        statusEl.textContent = state.isDemo
          ? "No real birthday set yet (showing 7-day placeholder). Pick Vyga's birthday date below or configure js/config.js!"
          : `Counting down to ${state.target.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} 🎀`;
      }
    };

    datePicker?.addEventListener("change", () => {
      if (datePicker.value) {
        localStorage.setItem(STORAGE_KEYS.BIRTHDAY_DATE, datePicker.value);
      } else {
        localStorage.removeItem(STORAGE_KEYS.BIRTHDAY_DATE);
      }
      previewBirthdayDay = false;
      if (previewBtn) previewBtn.textContent = "Preview Birthday Day 🎉";
      tick();
      AudioEngine.playSfx("pop");
    });

    previewBtn?.addEventListener("click", () => {
      previewBirthdayDay = !previewBirthdayDay;
      previewBtn.textContent = previewBirthdayDay ? "Back to Countdown ⏳" : "Preview Birthday Day 🎉";
      tick();
      if (previewBirthdayDay) AudioEngine.playSfx("fanfare");
    });

    tick();
    setInterval(tick, 1000);
  };

  /* ==========================================================================
     13. FINAL BIRTHDAY LETTER & EDITABLE CUSTOMIZATION
     ========================================================================== */
  const initBirthdayLetter = () => {
    const displayEl = document.getElementById("letter-display");
    const editToggleBtn = document.getElementById("toggle-letter-edit-btn");
    const resetBtn = document.getElementById("reset-letter-btn");
    const editorWrap = document.getElementById("letter-editor");
    const textarea = document.getElementById("letter-textarea");
    const saveBtn = document.getElementById("save-letter-btn");

    const buildDefaultPlainText = () => {
      const l = CFG.birthdayLetter;
      return [
        l.salutation,
        "",
        l.opening,
        "",
        ...l.paragraphs,
        "",
        l.listHeading,
        ...l.listItems.map((item) => `- ${item}`),
        "",
        ...l.closingParagraphs,
        "",
        l.signOff,
        l.signature
      ].join("\n");
    };

    const renderDefaultHtml = () => {
      const l = CFG.birthdayLetter;
      return `
        <p class="letter-salutation">${escapeHtml(l.salutation)}</p>
        <p style="font-weight:700; font-size:1.15rem; margin-top:0;">${escapeHtml(l.opening)}</p>
        ${l.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <p style="font-weight:700; margin-bottom:6px;">${escapeHtml(l.listHeading)}</p>
        <ul class="letter-list">
          ${l.listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        ${l.closingParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <p class="letter-signature">
          ${escapeHtml(l.signOff)}<br />
          ${escapeHtml(l.signature)}
        </p>
      `;
    };

    const renderLetter = () => {
      if (!displayEl) return;
      const custom = localStorage.getItem(STORAGE_KEYS.LETTER_CUSTOM);
      if (custom) {
        const lines = custom.split("\n");
        displayEl.innerHTML = lines
          .map((line, i) => {
            if (!line.trim()) return "";
            if (i === 0) return `<p class="letter-salutation">${escapeHtml(line)}</p>`;
            return `<p>${escapeHtml(line)}</p>`;
          })
          .join("");
      } else {
        displayEl.innerHTML = renderDefaultHtml();
      }
    };

    editToggleBtn?.addEventListener("click", () => {
      if (!editorWrap || !textarea) return;
      const isOpen = editorWrap.classList.toggle("open");
      if (isOpen) {
        textarea.value = localStorage.getItem(STORAGE_KEYS.LETTER_CUSTOM) || buildDefaultPlainText();
        textarea.focus();
      }
    });

    saveBtn?.addEventListener("click", () => {
      if (!textarea) return;
      localStorage.setItem(STORAGE_KEYS.LETTER_CUSTOM, textarea.value);
      editorWrap?.classList.remove("open");
      renderLetter();
      AudioEngine.playSfx("pop");
    });

    resetBtn?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.LETTER_CUSTOM);
      editorWrap?.classList.remove("open");
      renderLetter();
      AudioEngine.playSfx("pop");
    });

    renderLetter();
  };

  /* ==========================================================================
     14. MUSIC & CELEBRATION DOCK + FINAL SURPRISE TAKEOVER
     ========================================================================== */
  const initMusicAndFinale = () => {
    const dock = document.getElementById("music-dock");
    const collapseBtn = document.getElementById("dock-collapse-btn");
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const volumeSlider = document.getElementById("volume-slider");
    const sfxBtn = document.getElementById("sfx-toggle-btn");
    const extLink = document.getElementById("external-music-link");
    const setCustomBtn = document.getElementById("set-custom-music-btn");

    const savedLink = safeHttpUrl(localStorage.getItem(STORAGE_KEYS.MUSIC_LINK));
    if (extLink) {
      extLink.href = savedLink || CFG.music.defaultExternalUrl;
    }

    collapseBtn?.addEventListener("click", () => {
      const collapsed = dock?.classList.toggle("collapsed");
      collapseBtn.textContent = collapsed ? "+" : "−";
      collapseBtn.setAttribute("aria-expanded", String(!collapsed));
    });

    musicToggleBtn?.addEventListener("click", () => AudioEngine.toggleMusic());
    volumeSlider?.addEventListener("input", () => AudioEngine.setVolume(volumeSlider.value));
    sfxBtn?.addEventListener("click", () => AudioEngine.toggleSfx());

    document.getElementById("trigger-confetti-btn")?.addEventListener("click", () => {
      AudioEngine.playSfx("fanfare");
      ConfettiEngine.burst("birthday", 100, 0.35);
    });

    document.getElementById("trigger-hearts-btn")?.addEventListener("click", () => {
      AudioEngine.playSfx("borahae");
      ConfettiEngine.spawnFloatingParticles(["💜", "💗", "🎀"], 18);
    });

    document.getElementById("trigger-cake-btn")?.addEventListener("click", () => {
      const cake = document.getElementById("hero-cake");
      if (cake) {
        cake.classList.remove("bounce-once");
        void cake.offsetWidth;
        cake.classList.add("bounce-once");
      }
      AudioEngine.playSfx("pop");
      ConfettiEngine.spawnFloatingParticles(["🎂", "✨", "🕯️"], 10);
    });

    setCustomBtn?.addEventListener("click", () => {
      const current = localStorage.getItem(STORAGE_KEYS.MUSIC_LINK) || CFG.music.defaultExternalUrl;
      ModalManager.open(
        "Customize Party Music Link 🎧",
        `
          <p style="margin-top:0;">${escapeHtml(CFG.music.customPersonalAudioHint)}</p>
          <form id="custom-music-form" style="display:grid; gap:12px;">
            <label for="custom-music-input" class="sr-only">Custom Spotify or YouTube Link</label>
            <input id="custom-music-input" class="text-input" value="${escapeHtml(current)}" placeholder="https://open.spotify.com/..." required />
            <div style="display:flex; gap:10px; justify-content:flex-end;">
              <button type="submit" class="btn btn-primary btn-sm">Save Link</button>
            </div>
          </form>
        `
      );
      document.getElementById("custom-music-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = safeHttpUrl(document.getElementById("custom-music-input")?.value);
        if (url && extLink) {
          localStorage.setItem(STORAGE_KEYS.MUSIC_LINK, url);
          extLink.href = url;
          extLink.textContent = "🎧 Open Custom Link";
          ModalManager.close();
          AudioEngine.playSfx("pop");
        }
      });
    });

    // Final Surprise Experience
    const finaleBtn = document.getElementById("final-surprise-btn");
    const finaleModal = document.getElementById("finale-modal");
    const finaleHeading = document.getElementById("finale-modal-heading");
    const finaleBody = document.getElementById("finale-modal-body");
    const finaleCloseBtn = document.getElementById("finale-modal-close");
    const finaleDoneBtn = document.getElementById("finale-done-btn");
    const finaleMoreBtn = document.getElementById("finale-more-confetti-btn");
    let lastFocusFinale = null;

    if (finaleBtn) finaleBtn.textContent = CFG.finalSurprise.buttonLabel;
    if (finaleHeading) finaleHeading.textContent = CFG.finalSurprise.heading;
    if (finaleBody) {
      finaleBody.innerHTML = `
        ${CFG.finalSurprise.lines.map((line) => `<p style="margin:0 0 12px;">${escapeHtml(line)}</p>`).join("")}
        <p style="font-family:var(--font-display); font-size:1.55rem; font-weight:800; color:#FFD6E7; margin:18px 0 0;">
          ${escapeHtml(CFG.finalSurprise.signOff)}
        </p>
      `;
    }

    const triggerFinaleBurst = () => {
      ConfettiEngine.burst("finale", 140, 0.3);
      setTimeout(() => ConfettiEngine.burst("purple", 90, 0.55), 320);
      ConfettiEngine.spawnFloatingParticles(["💜", "💗", "⭐", "🎀", "🎂"], 24);
      AudioEngine.playSfx("fanfare");
    };

    const closeFinale = () => {
      finaleModal?.classList.remove("open");
      if (lastFocusFinale && typeof lastFocusFinale.focus === "function") {
        lastFocusFinale.focus();
      }
    };

    finaleBtn?.addEventListener("click", () => {
      lastFocusFinale = document.activeElement;
      finaleModal?.classList.add("open");
      triggerFinaleBurst();
      finaleCloseBtn?.focus();
    });

    finaleMoreBtn?.addEventListener("click", triggerFinaleBurst);
    finaleCloseBtn?.addEventListener("click", closeFinale);
    finaleDoneBtn?.addEventListener("click", closeFinale);
    finaleModal?.addEventListener("click", (e) => {
      if (e.target === finaleModal) closeFinale();
    });

    // Global Escape Key for both modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        ModalManager.close();
        closeFinale();
      }
    });
  };

  /* ==========================================================================
     BOOTSTRAP ALL MODULES
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initCountdownGate();
    initNavigation();
    initTiltCards();
    initHero();
    initBreakingNews();
    initRoastAwards();
    initPhotoMuseum();
    initMiniGames();
    initPurpleUniverse();
    initSecretVault();
    initCountdown();
    initBirthdayLetter();
    initMusicAndFinale();
  });
})();
