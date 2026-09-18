/* ==========================================================================
   Genartml.com — Main JavaScript
   ==========================================================================
   Contains:
     - CONFIG:               Web3Forms API key + tools list (edit here)
     - Nav scroll state
     - Smooth-scroll for logo click
     - Reveal-on-scroll animations
     - Contact form handler (Web3Forms)
     - Tools marquee builder
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     CONFIG — Edit these values as your business grows
     ========================================================================== */
  const CONFIG = {
    // Web3Forms access key — submissions are forwarded to team@genartml.com
    WEB3FORMS_KEY: '653ea76b-fbc1-4ebb-a13b-58712e49ccd9',

    // Fallback email address to show users if form fails
    FALLBACK_EMAIL: 'team@genartml.com',

    // Supabase — used for newsletter subscribers and pageview analytics
    SUPABASE_URL: 'https://czvibozmuzmlpxdafxch.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV',

    // Tools list for the marquee (order matters — displayed left to right)
    TOOLS: [
      'WhatsApp Business', 'OpenAI', 'Zapier', 'Make', 'n8n', 'Razorpay',
      'Shopify', 'Notion', 'Airtable', 'Google Workspace', 'Slack', 'HubSpot',
      'Zoho', 'Tally', 'Meta Ads', 'Stripe', 'WordPress', 'Salesforce'
    ]
  };



  /* ==========================================================================
     1. Nav scroll state
     ========================================================================== */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ==========================================================================
     2. Smooth scroll for logo click
     ========================================================================== */
  function initLogoScroll() {
    const brand = document.querySelector('a.brand');
    if (!brand) return;

    brand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ==========================================================================
     3. Reveal-on-scroll animations
     ========================================================================== */
  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Guard for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    items.forEach((el) => observer.observe(el));
  }


  /* ==========================================================================
     4. Tools marquee (seamless infinite scroll)
     ========================================================================== */
  function initMarquee() {
    const track = document.getElementById('marquee');
    if (!track) return;

    const buildItems = () =>
      CONFIG.TOOLS.map((tool, i) => {
        const dot = i < CONFIG.TOOLS.length - 1
          ? '<span class="dot">•</span>'
          : '';
        return `<span class="marquee-item">${escapeHtml(tool)}${dot}</span>`;
      }).join('');

    // Duplicate the set to create a seamless loop
    const separator = '<span class="marquee-item"><span class="dot">•</span></span>';
    track.innerHTML = buildItems() + separator + buildItems();
  }


  /* ==========================================================================
     5. Contact form handler (Web3Forms)
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const successBox = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !successBox || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Read values
      const name = document.getElementById('f-name').value.trim();
      const email = document.getElementById('f-email').value.trim();
      const company = document.getElementById('f-company').value.trim();
      const service = document.getElementById('f-service').value;
      const message = document.getElementById('f-message').value.trim();

      // Validation
      if (!name || !email || !service || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending<span class="arrow">…</span>';

      // Build payload for Web3Forms
      const payload = {
        access_key: CONFIG.WEB3FORMS_KEY,
        subject: `New Contact from ${name} — Genartml.com`,
        name: name,
        email: email,
        message: `Company: ${company || '—'}\nService: ${service}\n\n${message}`
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success — swap form for confirmation
          form.style.display = 'none';
          successBox.classList.add('show');
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        alert(
          `Something went wrong sending your message. Please email ${CONFIG.FALLBACK_EMAIL} directly.`
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        console.error('Contact form error:', err);
      }
    });
  }


  /* ==========================================================================
     6. Blog category filter
     ========================================================================== */
  function initBlogFilters() {
    const filterContainer = document.getElementById('blogFilters');
    const grid = document.getElementById('blogGrid');
    const emptyState = document.getElementById('blogEmpty');
    if (!filterContainer || !grid) return;

    const filters = filterContainer.querySelectorAll('.blog-filter');
    const cards = grid.querySelectorAll('.blog-card');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active state
        filters.forEach((f) => f.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        let visibleCount = 0;

        cards.forEach((card) => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });

        // Show empty state if no cards visible
        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    });
  }


  /* ==========================================================================
     7. Copy link button (blog post page)
     ========================================================================== */
  function initCopyLink() {
    const btn = document.getElementById('copyLinkBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = btn.querySelector('svg').outerHTML + ' Copied!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      });
    });
  }


  /* ==========================================================================
     8. Newsletter form (blog pages)
     ========================================================================== */
  function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const successBox = document.getElementById('newsletterSuccess');
    const submitBtn = document.getElementById('newsletterBtn');
    if (!form || !successBox || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Subscribing<span class="arrow">…</span>';

      try {
        const payload = {
          email: email,
          status: 'active'
        };

        const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/subscribers`, {
          method: 'POST',
          headers: {
            'apikey': CONFIG.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          form.style.display = 'none';
          successBox.classList.add('show');
        } else {
          // Check if already subscribed (unique constraint error)
          const errorData = await response.json().catch(() => ({}));
          if (errorData.code === '23505') {
            form.style.display = 'none';
            successBox.innerHTML = '<div class="check" aria-hidden="true">✓</div><h4>You\'re already in!</h4><p>Thanks for subscribing again.</p>';
            successBox.classList.add('show');
          } else {
            throw new Error('Submission failed');
          }
        }
      } catch (err) {
        alert(
          `Something went wrong. Please try again or email ${CONFIG.FALLBACK_EMAIL} directly.`
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        console.error('Newsletter form error:', err);
      }
    });
  }


  /* ==========================================================================
     Utility functions
     ========================================================================== */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ==========================================================================
     9. Pageview Analytics Tracker
     ========================================================================== */
  async function logPageview() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;
    
    let sessionId = sessionStorage.getItem('ga_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('ga_session_id', sessionId);
    }
    
    try {
      await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/pageviews`, {
        method: 'POST',
        headers: {
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          path: window.location.pathname + window.location.search,
          user_agent: navigator.userAgent,
          session_id: sessionId
        })
      });
    } catch (e) {
      // Silent fail
    }
  }


  /* ==========================================================================
     Initialize everything on DOM ready
     ========================================================================== */
  function init() {
    initNavScroll();
    initLogoScroll();
    initReveals();
    initMarquee();
    initContactForm();
    initBlogFilters();
    initCopyLink();
    initNewsletterForm();
    logPageview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose functions globally for dynamic content (like blog cards)
  window.initReveals = initReveals;
  window.initBlogFilters = initBlogFilters;
})();
