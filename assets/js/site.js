/* Genartml site behaviour. Works on the static site and inside the single-file preview (window.__GENARTML_BUNDLE__). */
(function () {
  "use strict";
  var C = window.GENARTML_CONFIG || {};
  var PK = window.GENARTML_PACKAGES || { services: [] };
  var BUNDLE = !!window.__GENARTML_BUNDLE__;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function sess(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; }
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Navigation helpers (real URLs, or the in-memory router in the preview) ---------- */
  var Router = null;
  function params() { return new URLSearchParams(BUNDLE && Router ? Router.query : location.search); }
  function go(url) { if (BUNDLE && Router) Router.go(url); else location.href = url; }
  function currentPath() { return BUNDLE && Router ? Router.path : location.pathname.replace(/index\.html$/, ""); }

  /* ---------- Config-driven content ---------- */
  function waNumber() {
    var d = String(C.whatsapp || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length === 10) d = "91" + d;
    return d;
  }
  function waLink(msg) {
    var n = waNumber();
    return n ? "https://wa.me/" + n + "?text=" + encodeURIComponent(msg || C.whatsappMessage || "") : "";
  }
  function has(key) {
    if (key === "whatsapp") return !!waNumber();
    if (key === "founderMessage") return !!(C.founder && C.founder.message);
    var v = C[key];
    if (Array.isArray(v)) return v.length > 0;
    return !!(v && String(v).trim());
  }
  function applyConfig(root) {
    $$("[data-show-if]", root).forEach(function (el) {
      var keys = el.getAttribute("data-show-if").split(",");
      el.hidden = !keys.some(function (k) { return has(k.trim()); });
    });
    $$("[data-hide-if]", root).forEach(function (el) { el.hidden = has(el.getAttribute("data-hide-if")); });
    $$("[data-fill]", root).forEach(function (el) {
      var k = el.getAttribute("data-fill");
      if (has(k)) el.textContent = C[k];
    });
    $$("[data-wa]", root).forEach(function (el) {
      var l = waLink(el.getAttribute("data-wa-msg"));
      if (l) { el.href = l; el.target = "_blank"; el.rel = "noopener"; el.hidden = false; } else el.hidden = true;
    });
    $$("[data-tel]", root).forEach(function (el) { if (has("phone")) el.href = "tel:" + String(C.phone).replace(/[^\d+]/g, ""); });
    $$("[data-book]", root).forEach(function (el) {
      if (has("calendarUrl")) { el.href = C.calendarUrl; el.target = "_blank"; el.rel = "noopener"; }
    });
    $$("[data-social]", root).forEach(function (el) {
      var u = C.social && C.social[el.getAttribute("data-social")];
      if (u) { el.href = u; el.hidden = false; } else el.hidden = true;
    });
    var soc = $("[data-social-row]", root);
    if (soc) soc.hidden = !$$("[data-social]", soc).some(function (a) { return !a.hidden; });
    $$("[data-year]", root).forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var F = C.founder || {};
    $$("[data-founder-photo]", root).forEach(function (img) { if (F.photo) { img.src = F.photo; img.hidden = false; } });
    $$("[data-founder-empty]", root).forEach(function (el) { el.hidden = !!F.photo; });
    $$("[data-founder-linkedin]", root).forEach(function (a) { if (F.linkedin) { a.href = F.linkedin; a.hidden = false; } else a.hidden = true; });
    $$("[data-fill-founder]", root).forEach(function (el) { var v = F[el.getAttribute("data-fill-founder")]; if (v) el.textContent = v; });
    renderTeam(root);
    renderCases(root);
  }
  function renderTeam(root) {
    var host = $("[data-team]", root);
    if (!host || !has("team")) return;
    host.innerHTML = C.team.map(function (m) {
      return '<div class="member"><div class="ph">' + (m.photo ? '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy">' :
        '<span class="ini" aria-hidden="true">' + esc(m.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase()) + "</span>") +
        '</div><b>' + esc(m.name) + "</b><span>" + esc(m.role) + "</span>" + (m.specialty ? "<span>" + esc(m.specialty) + "</span>" : "") +
        (m.linkedin ? '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' : "") + "</div>";
    }).join("");
  }
  function renderCases(root) {
    $$("[data-cases]", root).forEach(function (host) {
      if (!has("caseStudies")) return;
      var limit = +host.getAttribute("data-cases") || 99;
      host.innerHTML = C.caseStudies.slice(0, limit).map(function (c) {
        return '<article class="case">' +
          '<div><span class="label">Client industry</span>' + esc(c.industry) + (c.client ? "<br><b>" + esc(c.client) + "</b>" : "") + "</div>" +
          '<div><span class="label">The bottleneck</span>' + esc(c.bottleneck) + "</div>" +
          '<div><span class="label">What we built</span>' + esc(c.built) + "</div>" +
          '<div><span class="label">Measured outcome</span><b>' + esc(c.outcome) + "</b></div>" +
          (c.quote ? "<blockquote>" + esc(c.quote) + (c.quoteBy ? "<cite>" + esc(c.quoteBy) + "</cite>" : "") + "</blockquote>" : "") +
          "</article>";
      }).join("");
    });
  }

  /* ---------- Header: dropdowns, scroll state, mobile menu ---------- */
  function initHeader() {
    var header = $(".site-header");
    function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggles = $$(".nav [data-dropdown]");
    function closeAll(except) {
      toggles.forEach(function (b) {
        if (b === except) return;
        b.setAttribute("aria-expanded", "false");
        var m = document.getElementById(b.getAttribute("aria-controls"));
        if (m) m.classList.remove("open");
      });
    }
    toggles.forEach(function (btn) {
      var menu = document.getElementById(btn.getAttribute("aria-controls"));
      var li = btn.parentElement, t;
      function open() { clearTimeout(t); closeAll(btn); btn.setAttribute("aria-expanded", "true"); menu.classList.add("open"); }
      function close() { btn.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); }
      btn.addEventListener("click", function (e) { e.stopPropagation(); btn.getAttribute("aria-expanded") === "true" ? close() : open(); });
      li.addEventListener("mouseenter", function (e) { if (window.matchMedia("(hover: hover)").matches) open(); });
      li.addEventListener("mouseleave", function () { if (window.matchMedia("(hover: hover)").matches) t = setTimeout(close, 120); });
      li.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); btn.focus(); } });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".nav")) closeAll(); });

    var mm = $(".mobile-menu"), mbtn = $(".menu-btn");
    function setMM(open) {
      if (!mm) return;
      mm.classList.toggle("open", open);
      mm.setAttribute("aria-hidden", open ? "false" : "true");
      if (mbtn) mbtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) { var c = $(".mm-close", mm); if (c) c.focus(); }
    }
    if (mbtn) mbtn.addEventListener("click", function () { setMM(true); });
    if (mm) {
      $(".mm-close", mm).addEventListener("click", function () { setMM(false); mbtn && mbtn.focus(); });
      mm.addEventListener("click", function (e) { if (e.target.closest("a")) setMM(false); });
      mm.addEventListener("keydown", function (e) { if (e.key === "Escape") setMM(false); });
      $$(".mm-group > button", mm).forEach(function (b) {
        b.addEventListener("click", function () {
          var sub = document.getElementById(b.getAttribute("aria-controls"));
          var o = b.getAttribute("aria-expanded") === "true";
          b.setAttribute("aria-expanded", o ? "false" : "true");
          sub.hidden = o;
        });
      });
    }
    window.__closeMenus = function () { closeAll(); setMM(false); };
  }
  function markActive() {
    var p = currentPath();
    $$(".nav-link[href], .mm-group > a").forEach(function (a) {
      var h = a.getAttribute("href");
      if (h && h !== "/" && p.indexOf(h) === 0) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    $$(".nav [data-dropdown]").forEach(function (b) {
      var sect = b.getAttribute("data-dropdown");
      if (p.indexOf("/" + sect + "/") === 0) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
  }

  /* ---------- Reveal on scroll (content is visible at rest; only below-the-fold items animate in) ---------- */
  var io = null;
  function initReveal(root) {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    $$(".reveal", root).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) el.classList.add("in"); else io.observe(el);
    });
  }
  function initAnim(root) {
    if (!reduceMotion) document.documentElement.classList.add("js-anim");
    $$("svg[data-smil]", root).forEach(function (s) { if (reduceMotion && s.pauseAnimations) s.pauseAnimations(); });
  }

  /* ---------- Currency ---------- */
  function setCurrency(cur, root) {
    $$("[data-inr]", document).forEach(function (el) { el.textContent = cur === "usd" ? el.getAttribute("data-usd") : el.getAttribute("data-inr"); });
    $$("[data-tax]", document).forEach(function (el) { el.textContent = cur === "usd" ? "No Indian GST for international clients" : "Plus 18% GST for clients in India"; });
    $$(".cur-toggle button", document).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cur") === cur ? "true" : "false"); });
    store("gm_cur", cur);
  }
  function initCurrency(root) {
    var btns = $$(".cur-toggle button", root);
    btns.forEach(function (b) { b.addEventListener("click", function () { setCurrency(b.getAttribute("data-cur"), root); }); });
    var saved = store("gm_cur");
    if ($$("[data-inr]", root).length) setCurrency(saved === "usd" ? "usd" : "inr", root);
  }

  /* ---------- Packages filter tabs ---------- */
  function initFilter(root) {
    var tabs = $(".tabs[data-filter]", root);
    if (!tabs) return;
    var btns = $$("button", tabs);
    function apply(cat, push) {
      if (!btns.some(function (b) { return b.getAttribute("data-cat") === cat; })) cat = "all";
      btns.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-cat") === cat ? "true" : "false"); });
      $$("[data-group]", root).forEach(function (g) { g.hidden = !(cat === "all" || g.getAttribute("data-group") === cat); });
      var ent = $("[data-enterprise]", root);
      if (push) {
        var url = cat === "all" ? currentPath() : currentPath() + "?category=" + cat;
        if (BUNDLE && Router) Router.query = cat === "all" ? "" : "?category=" + cat;
        else try { history.replaceState(null, "", url); } catch (e) {}
      }
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-cat"), true);
        var top = $("#matrix", root);
        if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
    apply(params().get("category") || "all", false);
  }

  /* ---------- Blog category filter & dynamic Supabase integration ---------- */
  function initBlogFilter(root) {
    var row = $(".filter-row[data-blog]", root);
    if (!row) return;
    function bindButtons() {
      $$("button", row).forEach(function (b) {
        b.onclick = function () {
          var c = b.getAttribute("data-cat");
          $$("button", row).forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
          $$("[data-post-cat]", root).forEach(function (p) { p.hidden = !(c === "all" || p.getAttribute("data-post-cat") === c); });
        };
      });
    }
    bindButtons();

    // Fetch latest blogs from Supabase to ensure newly published articles show immediately
    if (C.supabase && C.supabase.url) {
      fetch(C.supabase.url + "/rest/v1/blogs?select=*&is_published=eq.true&order=created_at.desc", {
        headers: { "apikey": C.supabase.anonKey, "Authorization": "Bearer " + C.supabase.anonKey }
      })
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        if (!posts || !posts.length) return;
        var grid = $(".blog-grid", root);
        if (!grid) return;
        var existingSlugs = {};
        $$("a[href*='/blog/']", grid).forEach(function (a) {
          var m = a.getAttribute("href").match(/\/blog\/([^\/]+)\/?/);
          if (m && m[1]) existingSlugs[m[1]] = true;
        });

        // Filter for new posts and reverse so prepending keeps chronological descending order
        var newPosts = posts.filter(function (p) { return !existingSlugs[p.slug]; });
        newPosts.reverse().forEach(function (p) {
          var cat = p.category || "AI Systems";
          // Check if category button exists
          if (!row.querySelector("button[data-cat='" + cat.replace(/'/g, "\\'") + "']")) {
            var btn = document.createElement("button");
            btn.setAttribute("data-cat", cat);
            btn.setAttribute("aria-selected", "false");
            btn.textContent = cat;
            row.appendChild(btn);
            bindButtons();
          }

          var card = document.createElement("article");
          card.className = "post-card reveal in";
          card.setAttribute("data-post-cat", cat);
          var dt = p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
          var rt = p.read_time || "7 min read";
          var link = "/blog/" + p.slug + "/";
          var excerpt = p.excerpt || "";

          var coverHtml = p.cover_image
            ? '<img src="' + esc(p.cover_image) + '" alt="' + esc(p.title || "") + '" loading="lazy">'
            : '<svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="640" height="300" fill="#0A0A0A"/><path d="M0 150H640" stroke="#fff" stroke-opacity=".12"/></svg>';

          card.innerHTML = '<a class="post-cover" href="' + link + '" tabindex="-1" aria-hidden="true">' +
            coverHtml +
            '<span class="cat"><span class="cat-pill">' + esc(cat) + '</span></span></a>' +
            '<div class="post-body"><div class="post-meta"><time>' + dt + '</time><span>' + esc(rt) + '</span></div>' +
            '<h3><a href="' + link + '">' + esc(p.title || "") + '</a></h3>' +
            '<p>' + esc(excerpt) + '</p>' +
            '<a class="link-arrow" href="' + link + '">Read the article <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a></div>';

          // Prepend so latest post appears at the top
          grid.insertBefore(card, grid.firstChild);
        });

        // Respect active filter if not 'all'
        var activeBtn = row.querySelector("button[aria-selected='true']");
        var activeCat = activeBtn ? activeBtn.getAttribute("data-cat") : "all";
        if (activeCat && activeCat !== "all") {
          $$("[data-post-cat]", root).forEach(function (p) {
            p.hidden = !(p.getAttribute("data-post-cat") === activeCat);
          });
        }
      })
      .catch(function (err) { console.warn("Supabase blog load error:", err); });
    }
  }

  /* ---------- Contact form ---------- */
  function findPackage(svc, tier) {
    var s = (PK.services || []).filter(function (x) { return x.slug === svc; })[0];
    if (!s) return null;
    var t = (s.tiers || []).filter(function (x) { return x.id === tier; })[0];
    return { s: s, t: t || null };
  }
  function initContact(root) {
    var form = $("form#enquiry", root);
    if (!form) return;
    var p = params();
    var svc = p.get("service"), tier = p.get("tier");
    var sel = $("#f-service", form), brief = $("#f-brief", form), chosen = $(".chosen", form);
    var map = { "ai-workflows": "ai-workflows", "voice-ai-agents": "voice-ai-agents", "websites": "websites", "software-development": "software-development", "care-plans": "care-plans", "custom": "software-development", "not-sure": "not-sure" };
    if (svc && map[svc] && sel) sel.value = map[svc];
    var pk = svc ? findPackage(svc, tier) : null;
    if (pk && chosen) {
      var desc = pk.t ? pk.s.name + ", " + pk.t.name + " package" : pk.s.name;
      var meta = (pk.t && pk.t.deliveryShort ? pk.t.deliveryShort + " · " : "") + "Fixed price in your proposal";
      $(".chosen b", form).textContent = desc;
      $(".chosen .meta", form).textContent = meta;
      chosen.hidden = false;
      var hid = $("#f-package", form); if (hid) hid.value = desc + " (" + meta + ")";
      if (brief && !brief.value) brief.placeholder = "Interested in the " + desc + ". Describe the work your team does by hand today, the tools you use, and when you need it live.";
      $(".chosen button", form).addEventListener("click", function () {
        chosen.hidden = true; if (hid) hid.value = "";
      });
    }
    if (p.get("source") === "brief" && brief) setTimeout(function () { brief.focus(); }, 300);

    function setErr(field, on) { var f = field.closest(".field, .check"); if (f) f.classList.toggle("invalid", on); field.setAttribute("aria-invalid", on ? "true" : "false"); }
    function validate() {
      var ok = true, first = null;
      $$("[required]", form).forEach(function (el) {
        var bad = el.type === "checkbox" ? !el.checked : !el.value.trim();
        if (!bad && el.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
        setErr(el, bad);
        if (bad) { ok = false; first = first || el; }
      });
      if (first) first.focus();
      return ok;
    }
    $$("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") setErr(el, false); });
      el.addEventListener("change", function () { if (el.getAttribute("aria-invalid") === "true") setErr(el, false); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($("#f-hp", form).value) return; // spam trap
      if (!validate()) return;
      var data = {};
      $$("input, select, textarea", form).forEach(function (el) { if (el.name && el.name !== "company_website") data[el.name] = el.type === "checkbox" ? (el.checked ? "yes" : "no") : el.value.trim(); });
      var sOpt = sel && sel.options[sel.selectedIndex];
      data.service_label = sOpt ? sOpt.text : "";
      sess("gm_enquiry", JSON.stringify({ name: data.name, service: data.service_label, pkg: data.package || "" }));
      track("generate_lead", { service: data.service || "" });
      var btn = $("button[type=submit]", form), status = $(".form-status", form);
      function done() { go("/contact/thank-you/"); }
      if (BUNDLE) { btn.disabled = true; btn.textContent = "Sending"; setTimeout(done, 500); return; }

      btn.disabled = true;
      if (btn.firstChild) btn.firstChild.textContent = "Sending ";

      // 1. Post to Supabase contact_messages if configured
      var supabaseDone = false;
      if (C.supabase && C.supabase.url) {
        var supabaseMsg = "Company: " + (data.company || "-") +
          "\nPhone/WhatsApp: " + (data.phone || "-") +
          "\nService: " + (data.service_label || "-") +
          (data.package ? "\nPackage: " + data.package : "") +
          "\n\nProject brief:\n" + (data.brief || "-");

        fetch(C.supabase.url + "/rest/v1/contact_messages", {
          method: "POST",
          headers: {
            "apikey": C.supabase.anonKey,
            "Authorization": "Bearer " + C.supabase.anonKey,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: supabaseMsg,
            status: "unread"
          })
        }).then(function (r) {
          if (r.ok) supabaseDone = true;
        }).catch(function (err) {
          console.warn("Supabase save error:", err);
        });
      }

      // 2. Also forward to formEndpoint if provided, else use Supabase success or mailto fallback
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
          .catch(function () {
            if (supabaseDone) { done(); return; }
            btn.disabled = false; btn.firstChild.textContent = "Send message ";
            status.hidden = false;
            status.textContent = "Your message did not go through. Please try again, or email " + (C.email || "team@genartml.com") + " directly.";
          });
      } else if (C.supabase && C.supabase.url) {
        // Wait briefly for Supabase to resolve
        setTimeout(function () {
          done();
        }, 600);
      } else {
        var body = "Name: " + data.name + "\nWork email: " + data.email + "\nPhone or WhatsApp: " + (data.phone || "-") + "\nCompany: " + (data.company || "-") +
          "\nService: " + data.service_label + (data.package ? "\nPackage: " + data.package : "") + "\n\nProject brief:\n" + (data.brief || "-");
        location.href = "mailto:" + (C.email || "team@genartml.com") + "?subject=" + encodeURIComponent("Project enquiry from " + data.name) + "&body=" + encodeURIComponent(body);
        setTimeout(done, 600);
      }
    });
  }
  function initThanks(root) {
    var el = $("[data-thanks]", root);
    if (!el) return;
    var d = null; try { d = JSON.parse(sess("gm_enquiry") || "null"); } catch (e) {}
    if (d && d.name) {
      $("[data-thanks-name]", root).textContent = "Thank you, " + d.name.split(" ")[0] + ".";
      var s = $("[data-thanks-service]", root);
      if (s && (d.pkg || d.service)) { s.textContent = "Your enquiry: " + (d.pkg || d.service) + "."; s.hidden = false; }
    }
  }

  /* ---------- Share and copy ---------- */
  function initShare(root) {
    $$("[data-share]", root).forEach(function (a) {
      var url = a.getAttribute("data-url"), title = a.getAttribute("data-title");
      var k = a.getAttribute("data-share");
      if (k === "linkedin") a.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
      if (k === "x") a.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title);
    });
    $$("[data-copy]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = b.getAttribute("data-copy"), lab = $("span", b), old = lab.textContent;
        function ok() { lab.textContent = "Link copied"; setTimeout(function () { lab.textContent = old; }, 1800); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, function () { window.prompt ? 0 : 0; lab.textContent = txt; });
        else lab.textContent = txt;
      });
    });
  }
  function initToc(root) {
    var links = $$(".toc a", root);
    if (!links.length || !("IntersectionObserver" in window)) return;
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    $$(".prose h2[id]", root).forEach(function (h) { o.observe(h); });
  }

  /* ---------- Cookies and analytics ---------- */
  function track(name, p) { if (window.gtag) window.gtag("event", name, p || {}); }
  function loadGA() {
    if (!C.ga4Id || window.gtag || BUNDLE) return;
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.ga4Id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", C.ga4Id, { anonymize_ip: true });
  }
  function initCookies() {
    var bar = $(".cookie");
    if (!bar) return;
    var v = store("gm_consent");
    if (v === "accepted") { loadGA(); return; }
    if (v === "declined") return;
    bar.hidden = false; document.body.classList.add("has-cookie");
    $$("[data-consent]", bar).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-consent");
        store("gm_consent", a);
        bar.hidden = true; document.body.classList.remove("has-cookie");
        if (a === "accepted") loadGA();
      });
    });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-track], button[data-track]");
    if (a) track(a.getAttribute("data-track"), { label: (a.textContent || "").trim().slice(0, 60) });
  });

  /* ---------- 🪔 Diwali Offer Engine (Scheduled / Single-Switch) ---------- */
  function isDiwaliActive() {
    var O = C.diwaliOffer;
    if (!O || !O.enabled) return false;

    // Local / Session override switch
    var sessOverride = sess("gm_diwali_toggle");
    if (sessOverride === "0") return false;
    if (sessOverride === "1") return true;

    // URL preview parameter check (?offer=preview, ?diwali=1, etc.)
    var q = location.search;
    if (BUNDLE && Router && Router.query) q = Router.query;
    if (/[?&](offer=preview|diwali=1|previewOffer=true)/i.test(q)) return true;

    // Local forcePreview config
    if (O.forcePreview) return true;

    // Automatic Schedule: checks if current date/time is between start & end
    if (O.autoSchedule && O.startDate && O.endDate) {
      var now = new Date();
      var start = new Date(O.startDate);
      var end = new Date(O.endDate);
      return now >= start && now <= end;
    }
    return !!O.enabled;
  }

  function renderPreviewSwitch(isActive) {
    var isDevOrPreview = BUNDLE || location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
    if (!isDevOrPreview) return;

    var existingSwitch = $("#diwali-preview-switch");
    if (!existingSwitch) {
      existingSwitch = document.createElement("button");
      existingSwitch.id = "diwali-preview-switch";
      existingSwitch.type = "button";
      document.body.appendChild(existingSwitch);
      existingSwitch.addEventListener("click", function () {
        var nowActive = isDiwaliActive();
        sess("gm_diwali_toggle", nowActive ? "0" : "1");
        initDiwaliOffer(document);
      });
    }

    var diyaIconSvg = '<svg style="width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:4px" viewBox="0 0 24 24"><path fill="#FFA500" d="M12 2C11 5 9 7 9 9.5a3 3 0 0 0 6 0C15 7 13 5 12 2z"/><path fill="#CA9D35" d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7H4z"/></svg>';

    if (isActive) {
      existingSwitch.className = "diwali-preview-switch";
      existingSwitch.innerHTML = '<span class="dot"></span><b>' + diyaIconSvg + 'Diwali Offer: ACTIVE</b> <span style="opacity:0.7">(Click to preview OFF)</span>';
      existingSwitch.title = "Click to preview website without Diwali offer";
    } else {
      existingSwitch.className = "diwali-preview-switch is-off";
      existingSwitch.innerHTML = '<span class="dot"></span><b>' + diyaIconSvg + 'Diwali Offer: OFF</b> <span style="opacity:0.7">(Click to preview ON)</span>';
      existingSwitch.title = "Click to preview website with Diwali offer";
    }
  }

  function initDiwaliOffer(root) {
    var active = isDiwaliActive();
    var O = C.diwaliOffer || {};
    var diyaIconSvg = '<svg style="width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:4px" viewBox="0 0 24 24"><path fill="#FFA500" d="M12 2C11 5 9 7 9 9.5a3 3 0 0 0 6 0C15 7 13 5 12 2z"/><path fill="#CA9D35" d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7H4z"/></svg>';

    // 1. Cleanup old offer elements if not active (or if toggled off)
    var existingBanner = $("#diwali-banner");
    if (!active) {
      if (existingBanner) existingBanner.remove();
      $$(".diwali-badge, .diwali-offer-note, .tier-diwali-header, .svc-diwali-header", document).forEach(function (el) { el.remove(); });
      $$(".diwali-card-highlight", document).forEach(function (el) { el.classList.remove("diwali-card-highlight"); });
      renderPreviewSwitch(false);
      return;
    }

    // 2. Inject or Update Top Festive Banner
    if (existingBanner) existingBanner.remove();
    var banner = document.createElement("div");
      banner.id = "diwali-banner";
      banner.className = "diwali-banner";
      banner.innerHTML = '<div class="wrap diwali-wrap">' +
        '<div class="diwali-left">' +
          '<span class="diwali-diya" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24">' +
              '<path class="diya-flame" d="M12 2C11 5 9 7 9 9.5a3 3 0 0 0 6 0C15 7 13 5 12 2z"/>' +
              '<path class="diya-base" d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7H4z"/>' +
              '<ellipse class="diya-rim" cx="12" cy="14" rx="8" ry="2"/>' +
            '</svg>' +
          '</span>' +
          '<span class="diwali-pill">' + diyaIconSvg + esc(O.bannerTag || "DIWALI SPECIAL") + '</span>' +
          '<span class="diwali-text"><b>Flat ' + (O.discountPercent || 20) + '% OFF</b> on all Website & Custom Software packages</span>' +
          (O.urgencyText ? '<span class="diwali-urgency">' + esc(O.urgencyText) + '</span>' : '') +
        '</div>' +
        '<div class="diwali-right">' +
          '<a class="diwali-cta" href="/packages/#matrix" data-track="diwali_topbar_cta">' +
            'Claim ' + (O.discountPercent || 20) + '% Festive Offer' +
            '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' +
          '</a>' +
        '</div>' +
      '</div>';

      var topbar = $(".topbar");
      if (topbar && topbar.parentNode) {
        topbar.parentNode.insertBefore(banner, topbar);
      } else {
        document.body.insertBefore(banner, document.body.firstChild);
      }

    // 3. Highlight Eligible Service Cards & Packages
    var eligible = O.services || ["websites", "software-development"];

    // A) On Packages Page (matrix-groups)
    eligible.forEach(function (cat) {
      var group = $('[data-group="' + cat + '"]', root || document);
      if (group) {
        $$(".tier", group).forEach(function (tier) {
          if (!tier.classList.contains("diwali-card-highlight")) {
            tier.classList.add("diwali-card-highlight");

            // Add dedicated festive header row at the very top of the card
            if (!$(".tier-diwali-header", tier)) {
              var dHead = document.createElement("div");
              dHead.className = "tier-diwali-header";
              dHead.innerHTML = '<span class="diwali-badge">' + diyaIconSvg + (O.discountPercent || 20) + '% OFF · DIWALI SPECIAL</span>' +
                '<span class="diwali-code-tag">Code: ' + esc(O.couponCode || "DIWALI20") + '</span>';
              tier.insertBefore(dHead, tier.firstChild);
            }

            // Add Offer Note above CTA button
            var btn = $(".btn", tier);
            if (btn && !$(".diwali-offer-note", tier)) {
              var note = document.createElement("div");
              note.className = "diwali-offer-note";
              note.innerHTML = '<span style="color:#D4AF37">✦</span><span><b>' + (O.discountPercent || 20) + '% Festive Savings</b> applied with code <code>' + esc(O.couponCode || "DIWALI20") + '</code></span>';
              btn.parentNode.insertBefore(note, btn);

              // Attach offer param to CTA URL
              var href = btn.getAttribute("href");
              if (href && href.indexOf("offer=") === -1) {
                var sep = href.indexOf("?") === -1 ? "?" : "&";
                btn.setAttribute("href", href + sep + "offer=" + encodeURIComponent(O.couponCode || "DIWALI20"));
              }
            }
          }
        });
      }
    });

    // B) On Home / Services Page (svc-cards)
    $$(".svc-card", root || document).forEach(function (card) {
      var link = $("a.stretched", card);
      if (link) {
        var href = link.getAttribute("href") || "";
        var isMatch = eligible.some(function (cat) { return href.indexOf(cat) !== -1; });
        if (isMatch && !$(".svc-diwali-header", card)) {
          card.classList.add("diwali-card-highlight");
          var sHead = document.createElement("div");
          sHead.className = "svc-diwali-header";
          sHead.innerHTML = '<span class="diwali-badge">' + diyaIconSvg + (O.discountPercent || 20) + '% OFF · DIWALI SPECIAL</span>';
          card.insertBefore(sHead, card.firstChild);
        }
      }
    });

    // 4. Render interactive toggle switch
    renderPreviewSwitch(true);
  }

  /* ---------- Page init (runs on load, and after each preview navigation) ---------- */
  function initPage(root) {
    applyConfig(root);
    initAnim(root);
    initReveal(root);
    initCurrency(root);
    initFilter(root);
    initBlogFilter(root);
    initContact(root);
    initThanks(root);
    initShare(root);
    initToc(root);
    initDiwaliOffer(root);
    markActive();
  }
  window.GENARTML = { initPage: initPage, setRouter: function (r) { Router = r; }, applyConfig: applyConfig, initDiwaliOffer: initDiwaliOffer };

  function boot() {
    applyConfig(document);
    initHeader();
    initCookies();
    initDiwaliOffer(document);
    if (!BUNDLE) initPage($("main") || document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
