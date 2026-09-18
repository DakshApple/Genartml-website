// Fetch blogs and render in blog.html

function getCoverImageUrl(url) {
  if (!url) return '/assets/blog-cover-1.jpg';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
}

const SUPABASE_URL = 'https://czvibozmuzmlpxdafxch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return; // Only run on blog listing page

  try {
    const { data: blogs, error } = await supabaseClient
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!blogs || blogs.length === 0) {
      blogGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--muted);">No articles found. Check back later.</div>';
      return;
    }

    let featuredBlog = null;
    const featuredIndex = blogs.findIndex(b => b.is_featured);
    
    if (featuredIndex !== -1) {
      featuredBlog = blogs[featuredIndex];
      blogs.splice(featuredIndex, 1);
    } else if (blogs.length > 0) {
      // Fallback if no post is explicitly featured
      featuredBlog = blogs[0];
      blogs.shift();
    }

    // Render Featured
    if (featuredBlog) {
      const featuredContainer = document.getElementById('featuredContainer');
      if (featuredContainer) {
        const catSlug = featuredBlog.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const dateStr = new Date(featuredBlog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        featuredContainer.innerHTML = `
          <a href="/blog/post.html?slug=${featuredBlog.slug}" class="blog-featured reveal" id="featured-title">
            <div class="blog-featured-img">
              <img src="${getCoverImageUrl(featuredBlog.cover_image)}" alt="${escapeHtml(featuredBlog.title)}" loading="lazy" decoding="async" onerror="this.src='/assets/blog-cover-1.jpg'" />
            </div>
            <div class="blog-featured-content">
              <div class="blog-card-meta">
                <span class="blog-card-tag">${escapeHtml(featuredBlog.category)}</span>
                <span class="blog-card-dot">·</span>
                <span>Featured</span>
              </div>
              <h2 class="blog-featured-title">${escapeHtml(featuredBlog.title)}</h2>
              <p class="blog-featured-excerpt">${escapeHtml(featuredBlog.excerpt)}</p>
              <div class="blog-card-footer">
                <span class="blog-card-date">${dateStr}</span>
                <span class="blog-card-dot">·</span>
                <span class="blog-card-read">${escapeHtml(featuredBlog.read_time)}</span>
              </div>
            </div>
          </a>
        `;
      }
    }

    // Render Grid
    let html = '';
    blogs.forEach((blog, index) => {
      // Add staggered reveal classes
      const revealClass = index % 3 === 0 ? '' : (index % 3 === 1 ? 'd1' : 'd2');
      const dateStr = new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // Convert category to slug for filtering
      const catSlug = blog.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      html += `
        <a href="/blog/post.html?slug=${blog.slug}" class="blog-card reveal ${revealClass}" data-category="${catSlug}">
          <div class="blog-card-image">
            <img src="${getCoverImageUrl(blog.cover_image)}" alt="${escapeHtml(blog.title)}" loading="lazy" onerror="this.src='/assets/blog-cover-1.jpg'" />
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span class="blog-card-tag">${escapeHtml(blog.category)}</span>
              <span class="blog-card-dot">·</span>
              <span class="blog-card-read">${escapeHtml(blog.read_time)}</span>
            </div>
            <h3>${escapeHtml(blog.title)}</h3>
            <p>${escapeHtml(blog.excerpt)}</p>
            <div class="blog-card-footer">
              <span class="blog-card-date">${dateStr}</span>
              <span class="blog-card-arrow">→</span>
            </div>
          </div>
        </a>
      `;
    });

    blogGrid.innerHTML = html;

    // Trigger observer again for newly added elements
    if (typeof window.initReveals === 'function') {
      setTimeout(() => window.initReveals(), 100);
    }
    
    // Re-bind filters
    if (typeof window.initBlogFilters === 'function') {
      window.initBlogFilters();
    }

  } catch (err) {
    console.error('Error fetching blogs:', err);
    blogGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--muted);">Failed to load articles.</div>';
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const postBody = document.getElementById('postBodyContent');
  if (!postBody) return; // Only run on blog post page

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    postBody.innerHTML = '<p>Post not found.</p>';
    return;
  }

  try {
    const { data: blog, error } = await supabaseClient
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !blog) {
      postBody.innerHTML = '<p>Post not found.</p>';
      document.getElementById('postTitle').textContent = 'Not Found';
      const noindex = document.createElement('meta');
      noindex.name = 'robots';
      noindex.content = 'noindex';
      document.head.appendChild(noindex);
      return;
    }

    // Populate data
    document.title = `${blog.title} — Genartml`;
    document.getElementById('postTitle').innerHTML = escapeHtml(blog.title).replace(/([^ ]+)$/, '<span class="italic">$1</span>'); // Italicize last word as a nice touch
    document.getElementById('postCategory').textContent = blog.category;
    document.getElementById('postReadTime').textContent = blog.read_time;
    document.getElementById('postDate').textContent = new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('postCover').src = getCoverImageUrl(blog.cover_image);
    document.getElementById('postCover').alt = blog.title;

    // ── Dynamic SEO Meta Tags ──
    const postUrl = `https://genartml.com/blog/post.html?slug=${blog.slug}`;
    const coverUrl = blog.cover_image.startsWith('data:') 
      ? 'https://genartml.com/assets/og-image.png' 
      : (blog.cover_image.startsWith('http') ? blog.cover_image : `https://genartml.com/${blog.cover_image.startsWith('/') ? blog.cover_image.slice(1) : blog.cover_image}`);

    updateMeta('description', blog.excerpt);
    updateMeta('author', 'Daksh Suthar');
    updateMetaProperty('og:title', blog.title + ' — Genartml');
    updateMetaProperty('og:description', blog.excerpt);
    updateMetaProperty('og:url', postUrl);
    updateMetaProperty('og:image', coverUrl);
    updateMetaProperty('og:type', 'article');
    updateMetaProperty('article:published_time', blog.created_at);
    updateMetaProperty('article:author', 'Daksh Suthar');
    updateMeta('twitter:card', 'summary_large_image');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = postUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = postUrl;
      document.head.appendChild(canonical);
    }

    // ── JSON-LD Structured Data (BlogPosting schema) ──
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'description': blog.excerpt,
      'image': coverUrl,
      'datePublished': blog.created_at,
      'author': {
        '@type': 'Person',
        'name': 'Daksh Suthar',
        'url': 'https://genartml.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Genartml Private Limited',
        'url': 'https://genartml.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://genartml.com/assets/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': postUrl
      },
      'url': postUrl
    };
    const scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(scriptEl);

    // Parse markdown into HTML
    postBody.innerHTML = parseMarkdown(blog.content);

    // ── Dynamic Share Links (CRIT-2 fix) ──
    const shareTwitter = document.getElementById('shareTwitter');
    const shareLinkedIn = document.getElementById('shareLinkedIn');
    if (shareTwitter) {
      shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(postUrl)}`;
    }
    if (shareLinkedIn) {
      shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    }

    // ── Dynamic Table of Contents (CRIT-3 fix) ──
    const tocNav = document.getElementById('postToc');
    if (tocNav) {
      const headings = postBody.querySelectorAll('h2, h3');
      if (headings.length > 0) {
        let tocHtml = '';
        headings.forEach((heading, idx) => {
          const id = 'section-' + idx;
          heading.id = id;
          const indent = heading.tagName === 'H3' ? ' style="padding-left: 12px; font-size: 13px;"' : '';
          tocHtml += `<a href="#${id}" class="post-toc-link"${indent}>${heading.textContent}</a>`;
        });
        tocNav.innerHTML = tocHtml;
      } else {
        // Hide TOC card if no headings found
        tocNav.closest('.post-sidebar-card').style.display = 'none';
      }
    }

    // Fetch and render Related Posts (limit 3, exclude current)
    try {
      const { data: relatedBlogs, error: relatedError } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .neq('id', blog.id)
        .order('created_at', { ascending: false })
        .limit(3);

      const relatedGrid = document.getElementById('relatedBlogsGrid');
      if (relatedGrid && !relatedError && relatedBlogs) {
        let relatedHtml = '';
        relatedBlogs.forEach((relBlog, index) => {
          const dateStr = new Date(relBlog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          const delayClass = index === 0 ? '' : (index === 1 ? 'd1' : 'd2');
          
          relatedHtml += `
            <a href="/blog/post.html?slug=${relBlog.slug}" class="blog-card reveal ${delayClass}">
              <div class="blog-card-image">
                <img src="${getCoverImageUrl(relBlog.cover_image)}" alt="${escapeHtml(relBlog.title)}" loading="lazy" onerror="this.src='/assets/blog-cover-1.jpg'" />
              </div>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span class="blog-card-tag">${escapeHtml(relBlog.category)}</span>
                  <span class="blog-card-dot">·</span>
                  <span class="blog-card-read">${escapeHtml(relBlog.read_time)}</span>
                </div>
                <h3>${escapeHtml(relBlog.title)}</h3>
                <p>${escapeHtml(relBlog.excerpt)}</p>
                <div class="blog-card-footer">
                  <span class="blog-card-date">${dateStr}</span>
                  <span class="blog-card-arrow">→</span>
                </div>
              </div>
            </a>
          `;
        });
        relatedGrid.innerHTML = relatedHtml;
        
        // Trigger observer again for newly added related posts
        if (typeof window.initReveals === 'function') {
          setTimeout(() => window.initReveals(), 100);
        }
      }
    } catch (e) {
      console.error('Failed to load related blogs:', e);
    }

  } catch (err) {
    console.error('Error fetching post:', err);
    postBody.innerHTML = '<p>Error loading post.</p>';
  }
});

// Reuse escape logic
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── SEO Helper Functions ──
function updateMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (el) {
    el.setAttribute('content', content);
  } else {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }
}

function updateMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (el) {
    el.setAttribute('content', content);
  } else {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }
}

// ── Smart Content Parser ──
// Handles both explicit Markdown AND raw pasted plain text.
// The algorithm:
//  1. Split content on double newlines → blocks
//  2. For each block, detect its type:
//     - Explicit Markdown (## heading, - list, > quote, etc.) → use Markdown rules
//     - Short standalone line (< 80 chars, no period) → auto-detect as heading
//     - Consecutive lines starting with numbers → ordered list
//     - Everything else → paragraph
//  3. The very first block is rendered as a lead paragraph (<p class="post-lead">)

function parseMarkdown(text) {
  if (!text) return '';
  
  // If content already contains HTML tags, pass it through with minimal processing
  if (/<[a-z][\s\S]*>/i.test(text) && (text.includes('<p>') || text.includes('<h2>') || text.includes('<div>'))) {
    return text.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, p1, src, p2) => {
      return `<img ${p1}src="${getCoverImageUrl(src)}" ${p2}>`;
    });
  }

  // Normalize line endings
  let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into blocks on double newlines
  const blocks = normalized.split(/\n\s*\n/).filter(b => b.trim());
  
  let isFirstParagraph = true;
  const parsedBlocks = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    const result = parseBlock(block, isFirstParagraph);
    if (result) {
      parsedBlocks.push(result);
      // Only the first actual paragraph gets the lead class
      if (isFirstParagraph && result.startsWith('<p')) {
        isFirstParagraph = false;
      }
    }
  }

  return parsedBlocks.join('\n');
}

function parseBlock(block, isFirstParagraph) {
  const trimmed = block.trim();
  if (!trimmed) return '';
  const lines = trimmed.split('\n');

  // ── Explicit Markdown headings ──
  if (trimmed.startsWith('### ')) {
    return `<h3>${parseInline(trimmed.substring(4))}</h3>`;
  }
  if (trimmed.startsWith('## ')) {
    return `<h2>${parseInline(trimmed.substring(3))}</h2>`;
  }
  if (trimmed.startsWith('# ')) {
    return `<h2>${parseInline(trimmed.substring(2))}</h2>`;
  }

  // ── Explicit Markdown unordered list ──
  if (lines.every(line => /^\s*[-*]\s/.test(line))) {
    const items = lines.map(line => `<li>${parseInline(line.replace(/^\s*[-*]\s/, ''))}</li>`).join('');
    return `<ul>${items}</ul>`;
  }

  // ── Explicit Markdown ordered list ──
  if (lines.every(line => /^\s*\d+[.)]\s/.test(line))) {
    const items = lines.map(line => `<li>${parseInline(line.replace(/^\s*\d+[.)]\s/, ''))}</li>`).join('');
    return `<ol>${items}</ol>`;
  }

  // ── Explicit Markdown blockquote ──
  if (trimmed.startsWith('> ')) {
    const quote = lines.map(line => line.replace(/^>\s?/, '')).join('<br>');
    return `<blockquote><p>${parseInline(quote)}</p></blockquote>`;
  }

  // ── Quoted text (single line in double quotes) ──
  if (/^[""\u201C].*[""\u201D]$/.test(trimmed) && lines.length === 1) {
    const inner = trimmed.replace(/^[""\u201C]/, '').replace(/[""\u201D]$/, '');
    return `<blockquote><p>${parseInline(inner)}</p></blockquote>`;
  }

  // ── Smart heading detection (plain text) ──
  // A heading is a short standalone line that:
  //   - Has only 1 line in the block
  //   - Is under 100 characters
  //   - Does NOT end with a period, comma, or colon (those are sentences)
  //   - Does NOT start with common sentence starters like "The", "A ", "In ", "For ", "It ", "This ", "That "
  //   - Contains at least 2 words (single words are too ambiguous)
  if (lines.length === 1) {
    const len = trimmed.length;
    const endsWithPunctuation = /[.,;:]$/.test(trimmed);
    const looksLikeSentence = /^(The |A |An |In |For |It |This |That |These |Those |When |While |If |But |And |Or |As |By |With |From |To |We |Our |You |Your |I )/.test(trimmed);
    const wordCount = trimmed.split(/\s+/).length;
    
    if (len < 100 && !endsWithPunctuation && !looksLikeSentence && wordCount >= 2) {
      // Longer "headings" become h3, shorter ones become h2
      if (len > 60 || wordCount > 8) {
        return `<h3>${parseInline(trimmed)}</h3>`;
      }
      return `<h2>${parseInline(trimmed)}</h2>`;
    }
  }

  // ── Multi-line block with numbered lines mixed with text ──
  // Detect a pattern like: "1. Efficiency\nEmployees spend less time..."
  // This is a numbered point followed by its explanation
  if (lines.length > 1 && /^\d+[.)]\s/.test(lines[0])) {
    const items = [];
    let currentItem = null;

    for (const line of lines) {
      if (/^\d+[.)]\s/.test(line)) {
        if (currentItem) items.push(currentItem);
        currentItem = line.replace(/^\d+[.)]\s/, '');
      } else if (currentItem !== null) {
        currentItem += ' ' + line;
      }
    }
    if (currentItem) items.push(currentItem);

    if (items.length > 0) {
      const listHtml = items.map(item => `<li><strong>${parseInline(item.split(/[.!]\s/)[0])}</strong> ${parseInline(item.substring(item.indexOf('.') + 1) || '')}</li>`).join('');
      return `<ol>${listHtml}</ol>`;
    }
  }

  // ── Default: Paragraph ──
  const content = lines.join(' ');
  
  if (isFirstParagraph) {
    return `<p class="post-lead">${parseInline(content)}</p>`;
  }
  
  return `<p>${parseInline(content)}</p>`;
}

function parseInline(text) {
  if (!text) return '';
  let html = text;
  
  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic (*text* or _text_)  — but not inside URLs or words_with_underscores
  html = html.replace(/(?<!\w)\*(.*?)\*(?!\w)/g, '<em>$1</em>');
  
  // Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Em dash
  html = html.replace(/\s*---\s*/g, ' — ');
  html = html.replace(/\s*--\s*/g, ' — ');

  return html;
}
