// ============================================================
// Genartml — Shared Content Utilities
// Used by the public blog renderer AND the admin rich-text editor.
//
//   GenartContent.renderPostContent(raw, opts)  → safe HTML for the public page
//   GenartContent.contentToHtml(raw)            → HTML from stored HTML / Markdown / plain text
//   GenartContent.parseMarkdown(text, opts)     → smart Markdown + plain-text → HTML
//   GenartContent.sanitizeHtml(html, opts)      → strict allow-list sanitizer
// ============================================================
(function (global) {
  'use strict';

  // ──────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────
  function resolveAssetUrl(url) {
    if (!url) return '';
    if (/^(https?:|data:|\/)/i.test(url)) return url;
    return '/' + url;
  }

  // Stored content is "HTML" when it contains real block-level tags.
  // (Markdown posts with a stray inline <strong> are NOT treated as HTML.)
  var BLOCK_HTML_RE = /<(p|h[1-6]|ul|ol|div|blockquote|table|figure|pre|section)(\s[^>]*)?>/i;

  function looksLikeHtml(raw) {
    return BLOCK_HTML_RE.test(raw || '');
  }

  function escapeHtmlText(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ──────────────────────────────────────────────────────────
  // Smart Markdown / plain-text parser
  // Handles explicit Markdown AND raw pasted plain text:
  //   - "## Heading", "- item", "1. item", "> quote", "---", ``` code ```
  //   - Short standalone lines are auto-detected as headings
  //   - "• item" / "– item" bullets from Word, Docs, Notion, etc.
  //   - The first paragraph becomes a lead paragraph (opts.lead)
  // ──────────────────────────────────────────────────────────
  function parseMarkdown(text, opts) {
    if (!text) return '';
    opts = opts || {};
    var useLead = opts.lead !== false;

    var normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Pull fenced code blocks out so blank lines inside them survive.
    var codeBlocks = [];
    normalized = normalized.replace(/```[^\n]*\n([\s\S]*?)```/g, function (m, code) {
      codeBlocks.push('<pre><code>' + escapeHtmlText(code.replace(/\n$/, '')) + '</code></pre>');
      return '\n\n@@CODEBLOCK' + (codeBlocks.length - 1) + '@@\n\n';
    });

    // Normalise fancy bullets coming from Word / Docs / Notion.
    normalized = normalized
      .replace(/^[ \t]*[•●▪◦‣▸►]\s*/gm, '- ')
      .replace(/^[ \t]*[–—]\s+/gm, '- ');

    var blocks = normalized.split(/\n\s*\n/).filter(function (b) { return b.trim(); });
    var out = [];
    var first = useLead;

    for (var i = 0; i < blocks.length; i++) {
      var html = parseBlock(blocks[i].trim(), first);
      if (!html) continue;
      out.push(html);
      if (first && html.indexOf('<p') === 0) first = false;
    }

    return out.join('\n').replace(/@@CODEBLOCK(\d+)@@/g, function (m, n) {
      return codeBlocks[Number(n)] || '';
    });
  }

  function parseBlock(block, isFirstParagraph) {
    var trimmed = block.trim();
    if (!trimmed) return '';
    var lines = trimmed.split('\n');

    // Code block placeholder
    if (/^@@CODEBLOCK\d+@@$/.test(trimmed)) return trimmed;

    // Horizontal rule
    if (/^([-*_])\1{2,}$/.test(trimmed)) return '<hr>';

    // Markdown image on its own line
    var img = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      return '<p><img src="' + img[2] + '" alt="' + img[1].replace(/"/g, '&quot;') + '"></p>';
    }

    // Markdown headings
    if (trimmed.indexOf('#### ') === 0) return '<h4>' + parseInline(trimmed.substring(5)) + '</h4>';
    if (trimmed.indexOf('### ') === 0) return '<h3>' + parseInline(trimmed.substring(4)) + '</h3>';
    if (trimmed.indexOf('## ') === 0) return '<h2>' + parseInline(trimmed.substring(3)) + '</h2>';
    if (trimmed.indexOf('# ') === 0) return '<h2>' + parseInline(trimmed.substring(2)) + '</h2>';

    // Unordered list
    if (lines.every(function (l) { return /^\s*[-*]\s/.test(l); })) {
      return '<ul>' + lines.map(function (l) {
        return '<li>' + parseInline(l.replace(/^\s*[-*]\s/, '')) + '</li>';
      }).join('') + '</ul>';
    }

    // Ordered list
    if (lines.every(function (l) { return /^\s*\d+[.)]\s/.test(l); })) {
      return '<ol>' + lines.map(function (l) {
        return '<li>' + parseInline(l.replace(/^\s*\d+[.)]\s/, '')) + '</li>';
      }).join('') + '</ol>';
    }

    // Blockquote
    if (trimmed.indexOf('> ') === 0) {
      var quote = lines.map(function (l) { return l.replace(/^>\s?/, ''); }).join('<br>');
      return '<blockquote><p>' + parseInline(quote) + '</p></blockquote>';
    }

    // Single quoted line → pull quote
    if (lines.length === 1 && /^["\u201C].*["\u201D]$/.test(trimmed)) {
      var inner = trimmed.replace(/^["\u201C]/, '').replace(/["\u201D]$/, '');
      return '<blockquote><p>' + parseInline(inner) + '</p></blockquote>';
    }

    // Smart heading detection for plain text:
    // a short, standalone, non-sentence line with at least 2 words.
    if (lines.length === 1) {
      var len = trimmed.length;
      var endsWithPunctuation = /[.,;:!?]$/.test(trimmed);
      var looksLikeSentence = /^(The |A |An |In |For |It |This |That |These |Those |When |While |If |But |And |Or |As |By |With |From |To |We |Our |You |Your |I )/.test(trimmed);
      var wordCount = trimmed.split(/\s+/).length;

      if (len < 100 && !endsWithPunctuation && !looksLikeSentence && wordCount >= 2) {
        if (len > 60 || wordCount > 8) return '<h3>' + parseInline(trimmed) + '</h3>';
        return '<h2>' + parseInline(trimmed) + '</h2>';
      }
    }

    // "1. Efficiency\nEmployees spend less time..." style numbered points
    if (lines.length > 1 && /^\d+[.)]\s/.test(lines[0])) {
      var items = [];
      var current = null;
      lines.forEach(function (line) {
        if (/^\d+[.)]\s/.test(line)) {
          if (current) items.push(current);
          current = line.replace(/^\d+[.)]\s/, '');
        } else if (current !== null) {
          current += ' ' + line;
        }
      });
      if (current) items.push(current);

      if (items.length) {
        return '<ol>' + items.map(function (item) {
          var head = item.split(/[.!]\s/)[0];
          var rest = item.substring(item.indexOf('.') + 1) || '';
          return '<li><strong>' + parseInline(head) + '</strong> ' + parseInline(rest) + '</li>';
        }).join('') + '</ol>';
      }
    }

    // Default: paragraph
    var content = lines.join(' ');
    if (isFirstParagraph) return '<p class="post-lead">' + parseInline(content) + '</p>';
    return '<p>' + parseInline(content) + '</p>';
  }

  function parseInline(text) {
    if (!text) return '';
    var html = text;

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>');

    // Images, then links
    html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Em dashes
    html = html.replace(/\s*---\s*/g, ' — ');
    html = html.replace(/\s*--\s*/g, ' — ');

    return html;
  }

  // Stored content (HTML or Markdown/plain text) → HTML string.
  function contentToHtml(raw) {
    if (!raw) return '';
    return looksLikeHtml(raw) ? String(raw) : parseMarkdown(raw, { lead: false });
  }

  // ──────────────────────────────────────────────────────────
  // Strict allow-list HTML sanitizer
  // ──────────────────────────────────────────────────────────
  var ALLOWED_TAGS = {};
  ('A B BLOCKQUOTE BR CAPTION CITE CODE COL COLGROUP DEL DETAILS DIV EM FIGCAPTION FIGURE ' +
   'H2 H3 H4 H5 H6 HR I IFRAME IMG INS KBD LI MARK OL P PRE S SMALL SPAN STRIKE STRONG SUB ' +
   'SUMMARY SUP TABLE TBODY TD TFOOT TH THEAD TR U UL ABBR')
    .split(' ').forEach(function (t) { ALLOWED_TAGS[t] = true; });

  var DROP_TAGS = {};
  ('SCRIPT STYLE NOSCRIPT TEMPLATE OBJECT EMBED LINK META FORM INPUT BUTTON TEXTAREA SELECT ' +
   'OPTION SVG MATH AUDIO VIDEO CANVAS APPLET BASE FRAME FRAMESET HEAD TITLE')
    .split(' ').forEach(function (t) { DROP_TAGS[t] = true; });

  var STYLE_PROPS = {};
  ('color background-color font-size font-family font-weight font-style text-align text-decoration ' +
   'text-indent text-transform line-height letter-spacing margin margin-top margin-bottom margin-left ' +
   'margin-right padding padding-top padding-bottom padding-left padding-right width max-width ' +
   'min-width height border border-top border-bottom border-left border-right border-radius ' +
   'border-collapse float')
    .split(' ').forEach(function (p) { STYLE_PROPS[p] = true; });

  var CLASS_RE = /^(ql-[\w-]+|post-[\w-]+)$/;
  var YOUTUBE_RE = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]+(\?[\w=&%.\-]*)?$/i;
  var VIMEO_RE = /^https:\/\/player\.vimeo\.com\/video\/\d+(\?[\w=&%.\-]*)?$/i;

  function isSafeUrl(url, isImage) {
    var u = String(url || '').replace(/[\u0000-\u001F\u007F\s]+/g, '');
    if (!u) return false;
    if (/^(https?:|mailto:|tel:)/i.test(u)) return isImage ? /^https?:/i.test(u) : true;
    if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(u)) return !!isImage;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(u)) return false; // any other scheme (javascript:, vbscript:, …)
    return true; // relative URL / #anchor
  }

  function cleanStyle(value) {
    var kept = [];
    String(value || '').split(';').forEach(function (decl) {
      var idx = decl.indexOf(':');
      if (idx < 1) return;
      var prop = decl.slice(0, idx).trim().toLowerCase();
      var val = decl.slice(idx + 1).trim();
      if (!STYLE_PROPS[prop] || !val) return;
      if (/url\s*\(|expression|javascript|@import|[<>\\]|\/\*/i.test(val)) return;
      if (prop === 'font-family' && !/^[\w\s,'"\-]+$/.test(val)) return;
      kept.push(prop + ': ' + val);
    });
    return kept.join('; ');
  }

  function cleanIframe(el) {
    var src = el.getAttribute('src') || '';
    if (!YOUTUBE_RE.test(src) && !VIMEO_RE.test(src)) return false;
    Array.prototype.slice.call(el.attributes).forEach(function (a) {
      el.removeAttribute(a.name);
    });
    el.setAttribute('src', src);
    el.setAttribute('class', 'ql-video');
    el.setAttribute('title', 'Embedded video');
    el.setAttribute('loading', 'lazy');
    el.setAttribute('allowfullscreen', 'true');
    el.setAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
    el.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    return true;
  }

  function cleanAttributes(el) {
    var tag = el.tagName;
    Array.prototype.slice.call(el.attributes).forEach(function (attr) {
      var name = attr.name.toLowerCase();
      var value = attr.value;
      var keep = false;

      switch (name) {
        case 'style': {
          var s = cleanStyle(value);
          if (s) el.setAttribute('style', s); else el.removeAttribute('style');
          return;
        }
        case 'class': {
          var c = value.split(/\s+/).filter(function (t) { return CLASS_RE.test(t); }).join(' ');
          if (c) el.setAttribute('class', c); else el.removeAttribute('class');
          return;
        }
        case 'href': keep = tag === 'A' && isSafeUrl(value, false); break;
        case 'src': keep = tag === 'IMG' && isSafeUrl(value, true); break;
        case 'alt': keep = tag === 'IMG'; break;
        case 'title': keep = tag === 'IMG' || tag === 'A' || tag === 'ABBR'; break;
        case 'width':
        case 'height':
          keep = (tag === 'IMG' || tag === 'TD' || tag === 'TH' || tag === 'COL') &&
                 /^\d+(\.\d+)?(%|px)?$/.test(value);
          break;
        case 'colspan':
        case 'rowspan': keep = (tag === 'TD' || tag === 'TH') && /^\d{1,2}$/.test(value); break;
        case 'target': keep = tag === 'A' && (value === '_blank' || value === '_self'); break;
        case 'rel': keep = tag === 'A'; break;
        case 'start': keep = tag === 'OL' && /^\d+$/.test(value); break;
        case 'loading':
        case 'decoding': keep = tag === 'IMG'; break;
        default: keep = false;
      }
      if (!keep) el.removeAttribute(attr.name);
    });
  }

  function unwrap(el) {
    var parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function cleanChildren(parent, doc) {
    Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
      if (child.nodeType === 3) return;                       // text
      if (child.nodeType !== 1) { parent.removeChild(child); return; } // comments etc.

      var tag = child.tagName;

      if (DROP_TAGS[tag]) { parent.removeChild(child); return; }

      if (child.classList && (child.classList.contains('ql-ui') || child.classList.contains('ql-cursor'))) {
        parent.removeChild(child);
        return;
      }

      if (tag === 'IFRAME') {
        if (!cleanIframe(child)) parent.removeChild(child);
        return;
      }

      // Only one <h1> per page (the post title) — demote any h1 to h2.
      if (tag === 'H1') {
        var h2 = doc.createElement('h2');
        while (child.firstChild) h2.appendChild(child.firstChild);
        parent.replaceChild(h2, child);
        child = h2;
        tag = 'H2';
      }

      if (!ALLOWED_TAGS[tag]) {
        cleanChildren(child, doc);
        unwrap(child);
        return;
      }

      cleanAttributes(child);
      cleanChildren(child, doc);
    });
  }

  function isEmptyParagraph(p) {
    if (p.tagName !== 'P') return false;
    if (p.querySelector('img, iframe, hr')) return false;
    return p.textContent.replace(/[\u00A0\s]+/g, '') === '';
  }

  function isExternalHref(href) {
    if (!/^https?:\/\//i.test(href)) return false;
    try {
      var host = new URL(href).hostname.replace(/^www\./, '');
      return host !== 'genartml.com';
    } catch (e) {
      return true;
    }
  }

  // opts:
  //   publicMode  — resolve asset URLs, lazy-load images, wrap tables, add lead paragraph
  //   fallbackAlt — alt text for images that have none (publicMode only)
  //   stripEmpty  — remove empty paragraphs (default true)
  function sanitizeHtml(html, opts) {
    opts = opts || {};
    if (!html) return '';

    var doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
    var body = doc.body;

    cleanChildren(body, doc);

    // Unwrap attribute-less <span>s
    Array.prototype.slice.call(body.querySelectorAll('span')).forEach(function (span) {
      if (!span.attributes.length) unwrap(span);
    });

    // Empty paragraphs
    if (opts.stripEmpty !== false) {
      Array.prototype.slice.call(body.querySelectorAll('p')).forEach(function (p) {
        if (isEmptyParagraph(p)) p.parentNode.removeChild(p);
      });
    }

    // Links
    Array.prototype.slice.call(body.querySelectorAll('a[href]')).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (isExternalHref(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else {
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });

    // Images
    Array.prototype.slice.call(body.querySelectorAll('img')).forEach(function (img) {
      if (!img.getAttribute('src')) { img.parentNode.removeChild(img); return; }
      if (opts.publicMode) {
        img.setAttribute('src', resolveAssetUrl(img.getAttribute('src')));
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        if (!img.hasAttribute('alt') && opts.fallbackAlt) img.setAttribute('alt', opts.fallbackAlt);
      }
    });

    if (opts.publicMode) {
      // Responsive tables
      Array.prototype.slice.call(body.querySelectorAll('table')).forEach(function (table) {
        var wrap = doc.createElement('div');
        wrap.setAttribute('class', 'post-table-wrap');
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      });

      // Lead paragraph (first paragraph, unless the post already has one)
      if (!body.querySelector('.post-lead')) {
        var firstEl = body.firstElementChild;
        if (firstEl && firstEl.tagName === 'P' && !firstEl.className &&
            firstEl.textContent.trim().length >= 40) {
          firstEl.setAttribute('class', 'post-lead');
        }
      }
    }

    return body.innerHTML.trim();
  }

  // Convenience for the public blog page.
  function renderPostContent(raw, opts) {
    var html = contentToHtml(raw);
    // Markdown posts keep their auto-detected lead paragraph.
    if (!looksLikeHtml(raw) && raw) html = parseMarkdown(raw, { lead: true });
    return sanitizeHtml(html, Object.assign({ publicMode: true }, opts || {}));
  }

  global.GenartContent = {
    resolveAssetUrl: resolveAssetUrl,
    looksLikeHtml: looksLikeHtml,
    parseMarkdown: parseMarkdown,
    contentToHtml: contentToHtml,
    sanitizeHtml: sanitizeHtml,
    renderPostContent: renderPostContent
  };
})(window);
