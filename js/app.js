/* ==========================================================================
   Agora — etkileşim katmanı
   Tüm sayfalarda ortak çalışır; ilgili öğeler yoksa sessizce atlar.
   ========================================================================== */
(function () {
  "use strict";

  /* ----- Tema (açık / koyu) ------------------------------------------------ */
  const root = document.documentElement;
  const STORAGE_KEY = "agora-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
      const sun = btn.querySelector(".i-sun");
      const moon = btn.querySelector(".i-moon");
      if (sun && moon) {
        sun.classList.toggle("hidden", theme !== "dark");
        moon.classList.toggle("hidden", theme === "dark");
      }
    });
  }

  // Tema değişiminde renk/arka plan geçişlerini kısa süre yumuşatır.
  // Sadece kullanıcı tıklamasında çalışır → ilk yüklemede sıçrama olmaz.
  let themeAnimTimer = null;
  function enableThemeTransition() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("theme-anim");
    clearTimeout(themeAnimTimer);
    themeAnimTimer = setTimeout(() => root.classList.remove("theme-anim"), 480);
  }

  function initTheme() {
    // Varsayılan: AÇIK (light) tema. Kullanıcı düğmeyle geçiş yaparsa tercihi hatırlanır.
    const theme = localStorage.getItem(STORAGE_KEY) || "light";
    applyTheme(theme);

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      // initTheme hem erken hem de DOMContentLoaded'da çağrıldığı için
      // tıklama olayının iki kez bağlanmasını (ve birbirini iptal etmesini) engelle.
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = "1";
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, next);
        enableThemeTransition();
        applyTheme(next);
      });
    });
  }

  /* ----- Mobil kenar çubuğu ------------------------------------------------ */
  function initMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const sidebar = document.querySelector(".sidebar");
    if (!toggle || !sidebar) return;

    let scrim = document.querySelector(".scrim");
    if (!scrim) {
      scrim = document.createElement("div");
      scrim.className = "scrim";
      document.body.appendChild(scrim);
    }

    const open = () => { sidebar.classList.add("open"); scrim.classList.add("show"); };
    const close = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };

    toggle.addEventListener("click", () =>
      sidebar.classList.contains("open") ? close() : open()
    );
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ----- Sekmeler ---------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      group.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          group.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          // demo amaçlı: seçilen sekmeyi konsola yaz
          const list = document.querySelector("[data-topic-list]");
          if (list) list.dataset.activeTab = tab.dataset.tab || "";
        });
      });
    });
  }

  /* ----- Arama / filtreleme ------------------------------------------------ */
  function initSearch() {
    const input = document.querySelector("[data-search-input]");
    const list = document.querySelector("[data-topic-list]");
    if (!input || !list) return;

    const items = Array.from(list.querySelectorAll(".topic"));
    let emptyState = list.querySelector(".empty");
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "empty hidden";
      emptyState.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<p><strong>Sonuç bulunamadı.</strong><br>Farklı bir anahtar kelime deneyin.</p>';
      list.appendChild(emptyState);
    }

    const filter = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const match = text.includes(q);
        item.classList.toggle("hidden", !match);
        if (match) visible++;
      });
      emptyState.classList.toggle("hidden", visible !== 0);
    };

    input.addEventListener("input", filter);
  }

  /* ----- Üst arama kutusu odak kısayolu ("/" tuşu) ------------------------- */
  function initSearchShortcut() {
    const header = document.querySelector(".search input");
    if (!header) return;
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== header &&
          !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        header.focus();
      }
    });
  }

  /* ----- Beğeni düğmeleri --------------------------------------------------- */
  function initLikes() {
    document.querySelectorAll("[data-like]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const countEl = btn.querySelector(".like-count");
        let n = parseInt(countEl ? countEl.textContent : "0", 10) || 0;
        const liked = btn.classList.toggle("liked");
        n += liked ? 1 : -1;
        if (countEl) countEl.textContent = n;
      });
    });
  }

  /* ----- Cevap gönderme (demo) --------------------------------------------- */
  function initComposer() {
    const form = document.querySelector("[data-reply-form]");
    if (!form) return;
    const textarea = form.querySelector("textarea");
    const thread = document.querySelector("[data-thread]");
    const counter = document.querySelector("[data-reply-count]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }

      const post = document.createElement("article");
      post.className = "post fresh";
      const safe = text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .split(/\n{2,}/).map((p) => "<p>" + p.replace(/\n/g, "<br>") + "</p>").join("");

      post.innerHTML =
        '<div class="post-side">' +
          '<div class="avatar lg" style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">SİZ</div>' +
          '<div class="pname">Sen</div>' +
          '<span class="prole member">Üye</span>' +
          '<div class="pstats">Henüz yeni<br><b>Az önce</b> katıldın</div>' +
        '</div>' +
        '<div class="post-body">' +
          '<div class="post-top"><span class="when">şimdi</span></div>' +
          '<div class="prose">' + safe + '</div>' +
          '<div class="post-actions">' +
            '<button class="action-btn" data-like><svg class="i-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg> Beğen <span class="like-count">0</span></button>' +
            '<button class="action-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20l1-4.1A8.4 8.4 0 1 1 21 11.5z"/></svg> Alıntı</button>' +
          '</div>' +
        '</div>';

      thread.appendChild(post);
      textarea.value = "";
      post.querySelectorAll("[data-like]").forEach(bindLike);

      if (counter) counter.textContent = (parseInt(counter.textContent, 10) || 0) + 1;
      post.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function bindLike(btn) {
    btn.addEventListener("click", () => {
      const countEl = btn.querySelector(".like-count");
      let n = parseInt(countEl ? countEl.textContent : "0", 10) || 0;
      const liked = btn.classList.toggle("liked");
      n += liked ? 1 : -1;
      if (countEl) countEl.textContent = n;
    });
  }

  /* ----- Liquid Glass: imleci takip eden ışık yansıması -------------------- */
  function initGlassSheen() {
    const sel = ".card, .cat-card, .stat, .post, .hero, .cat-hero, .reply-box, .sidebar";
    const panels = document.querySelectorAll(sel);
    if (!panels.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // dokunmatik cihazlarda atla
    if (window.matchMedia("(hover: none)").matches) return;

    let ticking = false;
    let pending = null;

    const move = (el, e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      pending = { el, x, y };
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (pending) {
            pending.el.style.setProperty("--mx", pending.x.toFixed(1) + "%");
            pending.el.style.setProperty("--my", pending.y.toFixed(1) + "%");
          }
          ticking = false;
        });
      }
    };

    panels.forEach((el) => {
      el.addEventListener("pointermove", (e) => move(el, e));
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--mx", "30%");
        el.style.setProperty("--my", "0%");
      });
    });
  }

  /* ----- Yıl güncelleme ---------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----- Başlat ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    initTabs();
    initSearch();
    initSearchShortcut();
    initLikes();
    initComposer();
    initGlassSheen();
    initYear();
  });

  // tema kırpışmasını önlemek için olabildiğince erken uygula
  initTheme();
})();
