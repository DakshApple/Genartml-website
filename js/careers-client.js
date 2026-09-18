// ============================================================
// Genartml — Careers Client JS
// Handles both listing page and individual job page
// ============================================================

const SUPABASE_URL = 'https://czvibozmuzmlpxdafxch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escapeHtml(unsafe) {
  return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ============================================================
// Content Block Renderer
// Converts JSON content_blocks array into HTML
// ============================================================
function renderContentBlocks(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return '';
  
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `<h2>${escapeHtml(block.content)}</h2>`;
      case 'text':
        return `<p>${block.content}</p>`;
      case 'bullet_list':
        const bullets = (block.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
        return `<ul>${bullets}</ul>`;
      case 'numbered_list':
        const numbers = (block.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
        return `<ol>${numbers}</ol>`;
      case 'callout':
        return `<div class="callout">${escapeHtml(block.content)}</div>`;
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid var(--line); margin: 32px 0;" />`;
      case 'custom_section':
        let html = `<h2>${escapeHtml(block.title || 'Section')}</h2>`;
        html += `<p>${block.content || ''}</p>`;
        return html;
      default:
        return block.content ? `<p>${block.content}</p>` : '';
    }
  }).join('\n');
}

// ============================================================
// LISTING PAGE — /careers/index.html
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  const jobsGrid = document.getElementById('jobsGrid');
  const filterPills = document.getElementById('filterPills');
  const jobSearch = document.getElementById('jobSearch');
  
  // If we're on the job detail page, run that logic instead
  if (document.getElementById('jobBody')) {
    loadJobDetail();
    return;
  }

  if (!jobsGrid) return;

  let allJobs = [];
  let activeFilter = 'all';

  try {
    const { data: jobs, error } = await supabaseClient
      .from('jobs')
      .select('*')
      .in('status', ['published', 'paused'])
      .order('is_featured', { ascending: false })
      .order('priority', { ascending: false })
      .order('published_at', { ascending: false });

    if (error) throw error;
    allJobs = jobs || [];

    if (allJobs.length === 0) {
      renderEmptyState();
      return;
    }

    // Build filter pills
    buildFilters(allJobs);
    renderJobs(allJobs);

    // Search
    if (jobSearch) {
      jobSearch.addEventListener('input', () => {
        const query = jobSearch.value.toLowerCase().trim();
        const filtered = allJobs.filter(j => {
          const matchesSearch = !query || 
            j.title.toLowerCase().includes(query) || 
            (j.department || '').toLowerCase().includes(query) ||
            (j.location || '').toLowerCase().includes(query);
          const matchesFilter = activeFilter === 'all' || j.department === activeFilter;
          return matchesSearch && matchesFilter;
        });
        renderJobs(filtered);
      });
    }

  } catch (e) {
    console.error('Failed to load jobs:', e);
    jobsGrid.innerHTML = '<div style="text-align: center; padding: 60px 0; color: var(--muted);">Unable to load positions. Please try again later.</div>';
  }

  function buildFilters(jobs) {
    if (!filterPills) return;
    const departments = [...new Set(jobs.map(j => j.department).filter(Boolean))];
    
    let html = '<button class="filter-pill active" data-filter="all">All Positions</button>';
    departments.forEach(dept => {
      html += `<button class="filter-pill" data-filter="${escapeHtml(dept)}">${escapeHtml(dept)}</button>`;
    });
    filterPills.innerHTML = html;

    filterPills.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.dataset.filter;
        
        const query = jobSearch ? jobSearch.value.toLowerCase().trim() : '';
        const filtered = allJobs.filter(j => {
          const matchesSearch = !query || 
            j.title.toLowerCase().includes(query) || 
            (j.department || '').toLowerCase().includes(query);
          const matchesFilter = activeFilter === 'all' || j.department === activeFilter;
          return matchesSearch && matchesFilter;
        });
        renderJobs(filtered);
      });
    });
  }

  function renderJobs(jobs) {
    if (jobs.length === 0) {
      jobsGrid.innerHTML = `
        <div class="careers-empty">
          <div class="careers-empty-icon">🔍</div>
          <h3>No matching positions</h3>
          <p>Try adjusting your search or filters. New roles are added frequently.</p>
        </div>
      `;
      return;
    }

    let html = '';
    jobs.forEach(job => {
      const isFeatured = job.is_featured;
      const isPaused = job.status === 'paused';
      const dateStr = job.published_at 
        ? new Date(job.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';
      
      html += `
        <a href="/careers/job.html?slug=${encodeURIComponent(job.slug)}" class="job-card ${isFeatured ? 'job-card-featured' : ''} reveal">
          <div class="job-card-info">
            <div class="job-card-title">${escapeHtml(job.title)}</div>
            <div class="job-card-meta">
              <span class="job-card-badge">${escapeHtml(job.department || 'General')}</span>
              <span class="dot"></span>
              <span>${escapeHtml(job.location || 'Remote')}</span>
              <span class="dot"></span>
              <span>${escapeHtml(job.work_mode || 'On-site')}</span>
              <span class="dot"></span>
              <span>${escapeHtml(job.employment_type || 'Full-time')}</span>
              ${dateStr ? `<span class="dot"></span><span>${dateStr}</span>` : ''}
              ${isPaused ? '<span style="color: #f59e0b; font-weight: 500;">· Paused</span>' : ''}
            </div>
          </div>
          <span class="job-card-arrow" aria-hidden="true">→</span>
        </a>
      `;
    });
    jobsGrid.innerHTML = html;

    // Trigger reveal animations
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  function renderEmptyState() {
    jobsGrid.innerHTML = `
      <div class="careers-empty">
        <div class="careers-empty-icon">🚀</div>
        <h3>No open positions right now</h3>
        <p>We're always looking for exceptional people. Drop us your profile and we'll reach out when something opens up.</p>
        <a href="mailto:team@genartml.com" class="btn btn-primary">Send Your Profile →</a>
      </div>
    `;
    // Hide filters when no jobs
    const filtersEl = document.getElementById('careersFilters');
    if (filtersEl) filtersEl.style.display = 'none';
  }
});


// ============================================================
// JOB DETAIL PAGE — /careers/job.html
// ============================================================
async function loadJobDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const jobBody = document.getElementById('jobBody');

  if (!slug) {
    jobBody.innerHTML = '<p style="text-align:center; padding: 60px 0;">Job not found.</p>';
    return;
  }

  try {
    const { data: job, error } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !job) {
      document.getElementById('jobTitle').textContent = 'Position Not Found';
      jobBody.innerHTML = '<p style="text-align:center; padding: 60px 0; color: var(--muted);">This position may have been removed or is no longer available.</p>';
      return;
    }

    // Check visibility
    const isVisible = job.status === 'published' || job.status === 'paused' || (job.status === 'closed' && job.show_when_closed);
    if (!isVisible) {
      document.getElementById('jobTitle').textContent = 'Position Not Available';
      jobBody.innerHTML = '<p style="text-align:center; padding: 60px 0; color: var(--muted);">This position is not currently available.</p>';
      return;
    }

    // Increment views (fire and forget)
    supabaseClient.from('jobs').update({ views: (job.views || 0) + 1 }).eq('id', job.id).then(() => {});

    // ── Populate Header ──
    document.title = (job.seo_title || `${job.title} — Genartml Careers`);
    document.getElementById('jobTitle').textContent = job.title;

    // Eyebrow badges
    const eyebrow = document.getElementById('jobEyebrow');
    eyebrow.innerHTML = `
      <span>${escapeHtml(job.department || 'General')}</span>
      <span>${escapeHtml(job.work_mode || 'On-site')}</span>
      <span>${escapeHtml(job.employment_type || 'Full-time')}</span>
      ${job.experience_level ? `<span>${escapeHtml(job.experience_level)}</span>` : ''}
    `;

    // Meta row
    const metaRow = document.getElementById('jobMetaRow');
    const publishedDate = job.published_at 
      ? new Date(job.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '';
    metaRow.innerHTML = `
      <span>📍 ${escapeHtml(job.location || 'Remote')}</span>
      ${publishedDate ? `<span>📅 Posted ${publishedDate}</span>` : ''}
      ${job.application_deadline ? `<span>⏰ Apply by ${new Date(job.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>` : ''}
    `;

    // Actions
    const actions = document.getElementById('jobActions');
    const isClosed = job.status === 'closed';
    if (isClosed) {
      actions.innerHTML = '<div class="job-closed-banner">Applications for this position are now closed.</div>';
    } else if (job.apply_url) {
      actions.innerHTML = `
        <a href="${escapeHtml(job.apply_url)}" class="btn btn-primary" id="applyTopBtn" ${job.open_in_new_tab !== false ? 'target="_blank" rel="noopener"' : ''}>
          ${escapeHtml(job.apply_button_text || 'Apply Now')}
          <span class="arrow" aria-hidden="true">→</span>
        </a>
        <a href="/careers/" class="btn btn-secondary">← All Positions</a>
      `;
    } else {
      actions.innerHTML = `
        <a href="mailto:team@genartml.com" class="btn btn-primary">Apply via Email →</a>
        <a href="/careers/" class="btn btn-secondary">← All Positions</a>
      `;
    }

    // ── Render Content Blocks ──
    let contentHtml = '';
    
    // Short description
    if (job.short_description) {
      contentHtml += `<p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 32px;">${escapeHtml(job.short_description)}</p>`;
    }

    // Content blocks
    const blocks = job.content_blocks;
    if (blocks && Array.isArray(blocks) && blocks.length > 0) {
      contentHtml += renderContentBlocks(blocks);
    }

    // Bottom CTA
    if (!isClosed && job.apply_url) {
      contentHtml += `
        <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--line);">
          <h2>Ready to Apply?</h2>
          <p>If this role sounds like you, we'd love to hear from you.</p>
          <a href="${escapeHtml(job.apply_url)}" class="btn btn-primary" id="applyBottomBtn" ${job.open_in_new_tab !== false ? 'target="_blank" rel="noopener"' : ''}>
            ${escapeHtml(job.apply_button_text || 'Apply Now')}
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      `;
    }

    jobBody.innerHTML = contentHtml || '<p style="color: var(--muted);">No additional details available for this position.</p>';

    // ── Sidebar ──
    const sidebarDetails = document.getElementById('jobSidebarDetails');
    let sidebarHtml = '';
    
    const fields = [
      { label: 'Department', value: job.department },
      { label: 'Location', value: job.location },
      { label: 'Work Mode', value: job.work_mode },
      { label: 'Type', value: job.employment_type },
      { label: 'Experience', value: job.experience_level },
    ];
    
    if (job.min_experience || job.max_experience) {
      const exp = job.min_experience && job.max_experience 
        ? `${job.min_experience}–${job.max_experience} years`
        : job.min_experience ? `${job.min_experience}+ years` : `Up to ${job.max_experience} years`;
      fields.push({ label: 'Years', value: exp });
    }
    if (job.salary_visible && job.salary_range) {
      fields.push({ label: 'Compensation', value: job.salary_range });
    }
    if (job.openings && job.openings > 1) {
      fields.push({ label: 'Openings', value: job.openings.toString() });
    }

    fields.forEach(f => {
      if (f.value) {
        sidebarHtml += `
          <div class="job-sidebar-item">
            <span class="job-sidebar-label">${escapeHtml(f.label)}</span>
            <span class="job-sidebar-value">${escapeHtml(f.value)}</span>
          </div>
        `;
      }
    });
    sidebarDetails.innerHTML = sidebarHtml;

    // Sidebar Apply
    const sidebarApply = document.getElementById('jobSidebarApply');
    if (!isClosed && job.apply_url) {
      sidebarApply.innerHTML = `
        <a href="${escapeHtml(job.apply_url)}" class="btn btn-primary" id="applySidebarBtn" ${job.open_in_new_tab !== false ? 'target="_blank" rel="noopener"' : ''}>
          ${escapeHtml(job.apply_button_text || 'Apply Now')} →
        </a>
      `;
    }

    // Share links
    const jobUrl = `https://genartml.com/careers/job.html?slug=${job.slug}`;
    const shareEl = document.getElementById('jobShare');
    shareEl.innerHTML = `
      <h4>Share this role</h4>
      <div class="job-share-links">
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}" class="job-share-link" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(job.title + ' at Genartml')}&url=${encodeURIComponent(jobUrl)}" class="job-share-link" target="_blank" rel="noopener">Twitter</a>
        <button class="job-share-link" onclick="navigator.clipboard.writeText('${jobUrl}');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy Link',2000)">Copy Link</button>
      </div>
    `;

    // Mobile sticky apply
    if (!isClosed && job.apply_url) {
      const sticky = document.getElementById('stickyApply');
      const stickyBtn = document.getElementById('stickyApplyBtn');
      if (sticky && stickyBtn) {
        stickyBtn.href = job.apply_url;
        stickyBtn.textContent = (job.apply_button_text || 'Apply Now') + ' →';
        if (job.open_in_new_tab !== false) {
          stickyBtn.target = '_blank';
          stickyBtn.rel = 'noopener';
        }
        // Show on mobile only (CSS handles display:none on desktop)
        sticky.style.display = '';
      }
    }

    // ── Track Apply Clicks ──
    document.querySelectorAll('[id^="apply"]').forEach(btn => {
      btn.addEventListener('click', () => {
        supabaseClient.from('jobs').update({ apply_clicks: (job.apply_clicks || 0) + 1 }).eq('id', job.id).then(() => {});
      });
    });

    // ── SEO Meta Injection ──
    updateMeta('description', job.seo_description || job.short_description || `${job.title} at Genartml`);
    updateMetaProperty('og:title', job.seo_title || `${job.title} — Genartml Careers`);
    updateMetaProperty('og:description', job.seo_description || job.short_description || `View this open position at Genartml.`);
    updateMetaProperty('og:url', jobUrl);
    updateMetaProperty('og:image', job.og_image || 'https://genartml.com/assets/og-image.png');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = jobUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = jobUrl;
      document.head.appendChild(canonical);
    }

    // JSON-LD JobPosting Schema
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': job.title,
      'description': job.short_description || job.title,
      'datePosted': job.published_at || job.created_at,
      'employmentType': job.employment_type === 'Full-time' ? 'FULL_TIME' : 
                        job.employment_type === 'Part-time' ? 'PART_TIME' :
                        job.employment_type === 'Internship' ? 'INTERN' : 'CONTRACTOR',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Genartml',
        'sameAs': 'https://genartml.com',
        'logo': 'https://genartml.com/assets/logo.png'
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': job.location || 'Ahmedabad',
          'addressCountry': 'IN'
        }
      }
    };
    if (job.work_mode === 'Remote') {
      jsonLd.jobLocationType = 'TELECOMMUTE';
    }
    if (job.application_deadline) {
      jsonLd.validThrough = job.application_deadline;
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // ── Related Jobs ──
    loadRelatedJobs(job);

  } catch (e) {
    console.error('Failed to load job:', e);
    jobBody.innerHTML = '<p style="text-align:center; padding: 60px 0; color: var(--muted);">Failed to load job details. Please try again.</p>';
  }
}

async function loadRelatedJobs(currentJob) {
  try {
    const { data: jobs, error } = await supabaseClient
      .from('jobs')
      .select('id, title, slug, department, location, work_mode, employment_type, is_featured, published_at')
      .eq('status', 'published')
      .neq('id', currentJob.id)
      .order('is_featured', { ascending: false })
      .limit(3);

    if (error || !jobs || jobs.length === 0) return;

    const container = document.getElementById('relatedJobs');
    const grid = document.getElementById('relatedJobsGrid');
    
    let html = '';
    jobs.forEach(job => {
      html += `
        <a href="/careers/job.html?slug=${encodeURIComponent(job.slug)}" class="job-card reveal">
          <div class="job-card-info">
            <div class="job-card-title">${escapeHtml(job.title)}</div>
            <div class="job-card-meta">
              <span class="job-card-badge">${escapeHtml(job.department || 'General')}</span>
              <span class="dot"></span>
              <span>${escapeHtml(job.location || 'Remote')}</span>
              <span class="dot"></span>
              <span>${escapeHtml(job.work_mode || 'On-site')}</span>
            </div>
          </div>
          <span class="job-card-arrow" aria-hidden="true">→</span>
        </a>
      `;
    });
    grid.innerHTML = html;
    container.style.display = 'block';
  } catch (e) {
    console.error('Failed to load related jobs:', e);
  }
}

// ── Helper: Update meta tags ──
function updateMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (el) { el.content = content; }
  else {
    el = document.createElement('meta');
    el.name = name;
    el.content = content;
    document.head.appendChild(el);
  }
}

function updateMetaProperty(prop, content) {
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (el) { el.content = content; }
  else {
    el = document.createElement('meta');
    el.setAttribute('property', prop);
    el.content = content;
    document.head.appendChild(el);
  }
}
