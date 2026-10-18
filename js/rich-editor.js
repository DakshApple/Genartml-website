// ============================================================
// Genartml — Admin Rich Text Editor
// Word-like WYSIWYG editor (Quill) + HTML source + live preview.
//
// Public API (window.RichEditor):
//   setContent(raw, postId)  load a post (HTML / Markdown / plain text)
//   getContent()             clean, sanitized HTML ready to store
//   getPlainText()           plain text (for excerpt / read-time)
//   isEmpty()                true when there is no text and no media
//   clear()                  reset for a new post
//   markSaved()              clear dirty flag + remove local draft
//   isDirty()
// ============================================================
(function () {
  'use strict';

  var Content = window.GenartContent;
  var root = document.getElementById('rte');
  if (!root || !Content) return;

  // ────────────────────────────────────────────────
  // Config
  // ────────────────────────────────────────────────
  var SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];
  var FONTS = [
    { value: 'Fraunces, Georgia, serif', label: 'Display Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Menlo, monospace', label: 'Monospace' }
  ];
  var DRAFT_PREFIX = 'genartml_blog_draft_';
  var MAX_IMAGE_MB = 10;
  var BUCKET = 'blog-images';

  // ────────────────────────────────────────────────
  // Elements
  // ────────────────────────────────────────────────
  var $ = function (sel) { return root.querySelector(sel); };
  var el = {
    tabs: root.querySelectorAll('[data-rte-tab]'),
    toolbar: $('#rteToolbar'),
    paneVisual: $('#rtePaneVisual'),
    paneSource: $('#rtePaneSource'),
    panePreview: $('#rtePanePreview'),
    editor: $('#rteEditor'),
    source: $('#rteSource'),
    previewFrame: $('#rtePreviewFrame'),
    previewWrap: $('#rtePreviewWrap'),
    stats: $('#rteStats'),
    saveState: $('#rteSaveState'),
    toast: $('#rteToast'),
    draftBar: $('#rteDraftBar'),
    imgBar: $('#rteImgBar'),
    cleanBtn: $('#rteCleanHtml'),
    textColor: $('#rteTextColor'),
    bgColor: $('#rteBgColor')
  };

  // ────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────
  var quill = null;
  var truth = 'visual';       // which pane holds the real content: 'visual' | 'source'
  var currentTab = 'visual';
  var postId = 'new';
  var baseline = '';
  var dirty = false;
  var draftTimer = null;
  var statsTimer = null;
  var toastTimer = null;
  var lastRange = null;
  var busy = false;

  // ────────────────────────────────────────────────
  // Small UI helpers
  // ────────────────────────────────────────────────
  function toast(message, kind) {
    if (!el.toast) return;
    el.toast.textContent = message;
    el.toast.className = 'rte-toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.remove('show'); }, 3800);
  }

  function modal(opts) {
    // opts: { title, message, label, placeholder, value, confirmText, input:boolean }
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'rte-modal-overlay';
      overlay.innerHTML =
        '<div class="rte-modal" role="dialog" aria-modal="true">' +
          '<h3 class="rte-modal-title"></h3>' +
          '<p class="rte-modal-msg"></p>' +
          '<input type="text" class="rte-modal-input" autocomplete="off" />' +
          '<div class="rte-modal-actions">' +
            '<button type="button" class="admin-btn secondary small" data-act="cancel">Cancel</button>' +
            '<button type="button" class="admin-btn small" data-act="ok"></button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      var titleEl = overlay.querySelector('.rte-modal-title');
      var msgEl = overlay.querySelector('.rte-modal-msg');
      var input = overlay.querySelector('.rte-modal-input');
      var okBtn = overlay.querySelector('[data-act="ok"]');

      titleEl.textContent = opts.title || '';
      msgEl.textContent = opts.message || '';
      msgEl.style.display = opts.message ? 'block' : 'none';
      okBtn.textContent = opts.confirmText || 'OK';
      if (opts.input) {
        input.placeholder = opts.placeholder || '';
        input.value = opts.value || '';
      } else {
        input.style.display = 'none';
      }

      function close(result) {
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        resolve(result);
      }
      function accept() { close(opts.input ? input.value.trim() : true); }
      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(null); }
        if (e.key === 'Enter') { e.preventDefault(); accept(); }
      }

      overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(null); });
      overlay.querySelector('[data-act="cancel"]').addEventListener('click', function () { close(null); });
      okBtn.addEventListener('click', accept);
      document.addEventListener('keydown', onKey, true);
      setTimeout(function () { (opts.input ? input : okBtn).focus(); if (opts.input) input.select(); }, 30);
    });
  }

  // ────────────────────────────────────────────────
  // Image upload (Supabase Storage)
  // ────────────────────────────────────────────────
  function readImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not read this image.')); };
      img.src = url;
    });
  }

  async function prepareImage(file) {
    if (file.type === 'image/gif') return { blob: file, ext: 'gif', mime: 'image/gif' };

    var img = await readImage(file);
    var MAX = 1600;
    var w = img.naturalWidth, h = img.naturalHeight;
    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }

    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');

    var isPng = file.type === 'image/png';
    if (!isPng) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(img, 0, 0, w, h);

    var mime = isPng ? 'image/png' : 'image/jpeg';
    var blob = await new Promise(function (res) { canvas.toBlob(res, mime, 0.86); });
    if (!blob) throw new Error('Image processing failed.');
    return { blob: blob, ext: isPng ? 'png' : 'jpg', mime: mime };
  }

  function slugifyName(name) {
    return String(name || 'image').replace(/\.[^.]+$/, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
  }

  async function uploadImageFile(file) {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      throw new Error('Only JPG, PNG, WebP or GIF images are supported.');
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      throw new Error('Image is too large (max ' + MAX_IMAGE_MB + 'MB).');
    }
    var prepared = await prepareImage(file);
    var fileName = 'post-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) +
      '-' + slugifyName(file.name) + '.' + prepared.ext;

    var res = await fetch(SUPABASE_URL + '/storage/v1/object/' + BUCKET + '/' + fileName, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': prepared.mime
      },
      body: prepared.blob
    });
    if (!res.ok) {
      var msg = '';
      try { msg = (await res.json()).message || ''; } catch (e) { /* ignore */ }
      throw new Error('Upload failed' + (msg ? ': ' + msg : '.'));
    }
    return SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + fileName;
  }

  async function insertImages(files, index) {
    if (!quill || busy) return;
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); });
    if (!list.length) return;

    busy = true;
    quill.disable();
    var at = typeof index === 'number' ? index : (quill.getSelection() || { index: quill.getLength() }).index;

    try {
      for (var i = 0; i < list.length; i++) {
        toast('Uploading image ' + (i + 1) + ' of ' + list.length + '…');
        var url = await uploadImageFile(list[i]);

        var lineInfo = quill.getLine(at);
        if (lineInfo[1] > 0) { quill.insertText(at, '\n', 'user'); at += 1; }
        quill.insertEmbed(at, 'image', url, 'user');
        quill.insertText(at + 1, '\n', 'user');
        at += 2;
      }
      toast(list.length > 1 ? 'Images added. Click an image to resize or add alt text.' : 'Image added. Click it to resize or add alt text.', 'ok');
    } catch (err) {
      toast(err.message || 'Image upload failed.', 'error');
    } finally {
      quill.enable();
      busy = false;
      quill.setSelection(Math.min(at, quill.getLength() - 1), 0, 'silent');
    }
  }

  function imageHandler() {
    var range = quill.getSelection(true);
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.multiple = true;
    input.addEventListener('change', function () {
      if (input.files && input.files.length) insertImages(input.files, range ? range.index : undefined);
    });
    input.click();
  }

  // ────────────────────────────────────────────────
  // Video embed (YouTube / Vimeo only)
  // ────────────────────────────────────────────────
  function toEmbedUrl(input) {
    var url = String(input || '').trim();
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m) return 'https://player.vimeo.com/video/' + m[1];
    return '';
  }

  async function videoHandler() {
    var range = quill.getSelection(true);
    var value = await modal({
      title: 'Embed a video',
      message: 'Paste a YouTube or Vimeo link.',
      input: true,
      placeholder: 'https://www.youtube.com/watch?v=…',
      confirmText: 'Embed'
    });
    if (!value) return;
    var embed = toEmbedUrl(value);
    if (!embed) { toast('That doesn’t look like a YouTube or Vimeo link.', 'error'); return; }

    var at = range ? range.index : quill.getLength();
    var info = quill.getLine(at);
    if (info[1] > 0) { quill.insertText(at, '\n', 'user'); at += 1; }
    quill.insertEmbed(at, 'video', embed, 'user');
    quill.insertText(at + 1, '\n', 'user');
    quill.setSelection(at + 2, 0, 'silent');
  }

  // ────────────────────────────────────────────────
  // Smart paste + Auto-format
  // ────────────────────────────────────────────────
  // Gives every line its own block unless consecutive lines form a list.
  function normalizeForParser(text) {
    var lines = String(text).replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var prevList = false;
    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, '');
      if (!line.trim()) {
        if (out.length && out[out.length - 1] !== '') out.push('');
        prevList = false;
        return;
      }
      var isList = /^\s*([-*•●▪◦‣▸►–—]|\d+[.)])\s+/.test(line);
      if (out.length && out[out.length - 1] !== '' && !(isList && prevList)) out.push('');
      out.push(line);
      prevList = isList;
    });
    return out.join('\n');
  }

  function plainTextToHtml(text) {
    var source = /\n\s*\n/.test(text) ? text : normalizeForParser(text);
    return Content.sanitizeHtml(Content.parseMarkdown(source, { lead: false }), { stripEmpty: true });
  }

  function onPaste(e) {
    if (!quill || busy || currentTab !== 'visual') return;
    var cd = e.clipboardData;
    if (!cd) return;

    var text = cd.getData('text/plain');
    var html = cd.getData('text/html');
    var files = Array.prototype.slice.call(cd.files || []).filter(function (f) { return /^image\//.test(f.type); });

    // Screenshot / copied image with no text → upload to storage (never base64)
    if (files.length && !text) {
      e.preventDefault();
      e.stopPropagation();
      insertImages(files);
      return;
    }

    // Plain multi-line text with no formatting → organise automatically
    if (!html && text && /\n/.test(text.trim())) {
      e.preventDefault();
      e.stopPropagation();
      var range = quill.getSelection(true);
      var out = plainTextToHtml(text);
      if (!out) return;
      if (range.length) quill.deleteText(range.index, range.length, 'user');
      quill.clipboard.dangerouslyPasteHTML(range.index, out, 'user');
      toast('Pasted text was auto-organised into headings, lists & paragraphs. Press Ctrl/Cmd+Z to undo.', 'ok');
    }
    // Everything else (Word, Google Docs, web pages…) is handled by Quill natively.
  }

  function onDrop(e) {
    if (!quill || busy || currentTab !== 'visual') return;
    var dt = e.dataTransfer;
    var files = dt ? Array.prototype.slice.call(dt.files || []).filter(function (f) { return /^image\//.test(f.type); }) : [];
    if (!files.length) return;
    e.preventDefault();
    e.stopPropagation();
    var pos = null;
    if (document.caretRangeFromPoint) {
      var r = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (r) {
        var blot = window.Quill.find(r.startContainer, true);
        if (blot) pos = quill.getIndex(blot) + r.startOffset;
      }
    }
    insertImages(files, pos === null ? undefined : pos);
  }

  async function autoFormat() {
    var range = quill.getSelection();
    var hasSelection = range && range.length > 0;
    var start = hasSelection ? range.index : 0;
    var length = hasSelection ? range.length : quill.getLength() - 1;

    var ops = quill.getContents(start, length).ops || [];
    var hasEmbed = ops.some(function (op) { return typeof op.insert !== 'string'; });
    if (hasEmbed) {
      toast('Auto-format works on text only. Select a text-only section (without images/videos) and try again.', 'error');
      return;
    }
    var text = quill.getText(start, length).replace(/\n$/, '');
    if (!text.trim()) { toast('Nothing to format yet — write or paste some text first.'); return; }

    var hasFormatting = ops.some(function (op) { return op.attributes && Object.keys(op.attributes).length; });
    if (hasFormatting) {
      var ok = await modal({
        title: 'Re-organise this text?',
        message: 'Headings, lists and paragraphs will be detected automatically. Existing colours, sizes and other formatting in this text will be replaced. You can undo with Ctrl/Cmd+Z.',
        confirmText: 'Auto-format'
      });
      if (!ok) return;
    }

    var out = plainTextToHtml(text);
    var delta = quill.clipboard.convert({ html: out, text: '' });
    if (hasSelection) {
      quill.deleteText(start, length, 'user');
      quill.clipboard.dangerouslyPasteHTML(start, out, 'user');
    } else {
      quill.setContents(delta, 'user');
    }
    toast('Content organised. Press Ctrl/Cmd+Z to undo.', 'ok');
  }

  // ────────────────────────────────────────────────
  // Stats (words, read time, headings, SEO checks)
  // ────────────────────────────────────────────────
  function computeStats() {
    var text, headings, imgs, noAlt;
    if (truth === 'visual' && quill) {
      text = quill.getText();
      headings = quill.root.querySelectorAll('h2, h3, h4').length;
      imgs = quill.root.querySelectorAll('img');
      noAlt = quill.root.querySelectorAll('img:not([alt]), img[alt=""]').length;
    } else {
      var doc = new DOMParser().parseFromString('<body>' + Content.contentToHtml(el.source.value) + '</body>', 'text/html');
      text = doc.body.textContent || '';
      headings = doc.querySelectorAll('h2, h3, h4').length;
      imgs = doc.querySelectorAll('img');
      noAlt = doc.querySelectorAll('img:not([alt]), img[alt=""]').length;
    }
    var words = (text.trim().match(/\S+/g) || []).length;
    return {
      words: words,
      minutes: Math.max(1, Math.ceil(words / 200)),
      headings: headings,
      images: imgs.length,
      noAlt: noAlt
    };
  }

  function renderStats() {
    if (!el.stats) return;
    var s = computeStats();
    var parts = [
      s.words.toLocaleString() + ' words',
      s.minutes + ' min read',
      s.headings + ' heading' + (s.headings === 1 ? '' : 's')
    ];
    var html = parts.join(' · ');
    if (s.noAlt) html += ' · <span class="rte-warn" title="Add alt text for SEO & accessibility: click an image in the Visual tab">' +
      s.noAlt + ' image' + (s.noAlt === 1 ? '' : 's') + ' without alt text</span>';
    el.stats.innerHTML = html;
  }

  function scheduleStats() {
    clearTimeout(statsTimer);
    statsTimer = setTimeout(renderStats, 250);
  }

  // ────────────────────────────────────────────────
  // Content get / set
  // ────────────────────────────────────────────────
  function quillIsEmpty() {
    if (!quill) return true;
    if (quill.getText().trim()) return false;
    var ops = quill.getContents().ops || [];
    return !ops.some(function (op) { return typeof op.insert !== 'string'; });
  }

  function quillHtml() {
    if (quillIsEmpty()) return '';
    var html = quill.getSemanticHTML().replace(/&nbsp;/g, ' ');
    return Content.sanitizeHtml(html, { stripEmpty: true });
  }

  function sourceHtml() {
    var v = el.source.value;
    if (!v.trim()) return '';
    return Content.sanitizeHtml(Content.contentToHtml(v), { stripEmpty: false });
  }

  function getHtml() {
    return truth === 'source' || !quill ? sourceHtml() : quillHtml();
  }

  // Quill can't represent tables, custom containers, etc.
  function hasCustomMarkup(html) {
    if (!html) return false;
    var doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
    return !!doc.body.querySelector('table, figure, div, section, details, summary, hr, h5, h6, pre code[class]');
  }

  function prettyHtml(html) {
    if (!html) return '';
    return html
      .replace(/<\/(p|h[2-6]|ul|ol|li|blockquote|pre|table|tr|figure|div)>/gi, '</$1>\n')
      .replace(/<(ul|ol|table|tbody|thead|tr)(\s[^>]*)?>/gi, '<$1$2>\n')
      .replace(/<hr\s*\/?>/gi, '<hr>\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function loadIntoQuill(html) {
    var delta = quill.clipboard.convert({ html: html || '', text: '' });
    quill.setContents(delta, 'silent');
    quill.history.clear();
  }

  function setTab(tab) {
    currentTab = tab;
    Array.prototype.forEach.call(el.tabs, function (btn) {
      var on = btn.getAttribute('data-rte-tab') === tab;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    el.paneVisual.hidden = tab !== 'visual';
    el.paneSource.hidden = tab !== 'source';
    el.panePreview.hidden = tab !== 'preview';
    el.toolbar.hidden = tab !== 'visual';
    hideImgBar();
    if (tab === 'preview') renderPreview();
    if (tab === 'source') el.source.focus({ preventScroll: true });
    renderStats();
  }

  async function switchTab(tab) {
    if (tab === currentTab) return;

    // Leaving the HTML tab for Visual: content passes through the visual editor.
    if (tab === 'visual' && truth === 'source') {
      if (!quill) { toast('The visual editor could not load. Check your internet connection.', 'error'); return; }
      var html = sourceHtml();
      if (hasCustomMarkup(html)) {
        var ok = await modal({
          title: 'Switch to Visual editor?',
          message: 'This HTML contains custom markup (tables, containers or dividers) that the visual editor can’t display. Switching may remove it. Stay in the HTML tab to keep it exactly as written.',
          confirmText: 'Switch anyway'
        });
        if (!ok) return;
      }
      loadIntoQuill(html);
      truth = 'visual';
    }

    // Entering the HTML tab from Visual: show clean generated HTML.
    if (tab === 'source' && truth === 'visual') {
      el.source.value = prettyHtml(quill ? quillHtml() : '');
      truth = 'source';
    }

    setTab(tab);
  }

  function setContent(raw, id) {
    postId = id || 'new';
    var html = raw ? Content.sanitizeHtml(Content.contentToHtml(raw), { stripEmpty: true }) : '';

    if (!quill || hasCustomMarkup(html)) {
      truth = 'source';
      el.source.value = prettyHtml(html);
      setTab('source');
      if (quill && html) toast('This post uses custom HTML, so it opened in the HTML tab to keep it intact.');
    } else {
      truth = 'visual';
      loadIntoQuill(html);
      el.source.value = '';
      setTab('visual');
    }

    baseline = getHtml();
    dirty = false;
    updateSaveState();
    checkDraft();
    renderStats();
  }

  function clear() {
    postId = 'new';
    truth = quill ? 'visual' : 'source';
    if (quill) loadIntoQuill('');
    el.source.value = '';
    setTab(quill ? 'visual' : 'source');
    baseline = '';
    dirty = false;
    updateSaveState();
    hideDraftBar();
    checkDraft();
    renderStats();
  }

  // ────────────────────────────────────────────────
  // Preview (uses the real site stylesheet)
  // ────────────────────────────────────────────────
  function renderPreview() {
    var html = Content.sanitizeHtml(getHtml(), { publicMode: true, fallbackAlt: 'Article image' });
    var css = new URL('../css/styles.css', window.location.href).href;
    var title = (document.getElementById('blogTitle') || {}).value || 'Untitled post';
    var safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    el.previewFrame.srcdoc =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="stylesheet" href="' + css + '">' +
      '<style>body{background:#FAFAF7;margin:0;padding:48px 24px 80px}' +
      '.pv{max-width:680px;margin:0 auto}.pv h1{font-size:clamp(30px,5vw,46px);line-height:1.1;letter-spacing:-.03em;font-weight:500;margin:0 0 40px}' +
      '.post-content{padding-bottom:0}</style></head><body><div class="pv">' +
      '<h1>' + safeTitle + '</h1><div class="post-content">' + (html || '<p style="color:#999">Nothing to preview yet.</p>') +
      '</div></div></body></html>';
  }

  // ────────────────────────────────────────────────
  // Drafts (localStorage) + dirty tracking
  // ────────────────────────────────────────────────
  function draftKey() { return DRAFT_PREFIX + postId; }

  function updateSaveState(text) {
    if (!el.saveState) return;
    el.saveState.textContent = text || (dirty ? 'Unsaved changes' : 'All changes saved');
    el.saveState.classList.toggle('dirty', dirty && !text);
  }

  function markDirty() {
    dirty = true;
    updateSaveState();
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 1500);
  }

  function saveDraft() {
    try {
      var html = getHtml();
      if (!html || html === baseline) { localStorage.removeItem(draftKey()); return; }
      localStorage.setItem(draftKey(), JSON.stringify({ html: html, ts: Date.now() }));
      updateSaveState('Draft auto-saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) { /* storage unavailable — ignore */ }
  }

  function hideDraftBar() { if (el.draftBar) { el.draftBar.hidden = true; el.draftBar.innerHTML = ''; } }

  function checkDraft() {
    hideDraftBar();
    if (!el.draftBar) return;
    var draft = null;
    try { draft = JSON.parse(localStorage.getItem(draftKey()) || 'null'); } catch (e) { draft = null; }
    if (!draft || !draft.html || draft.html === baseline) return;

    var when = new Date(draft.ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    el.draftBar.hidden = false;
    el.draftBar.innerHTML =
      '<span>📝 Unsaved draft from <strong>' + when + '</strong> found for this post.</span>' +
      '<span class="rte-draft-actions">' +
        '<button type="button" class="admin-btn small" data-draft="restore">Restore</button>' +
        '<button type="button" class="admin-btn secondary small" data-draft="discard">Discard</button>' +
      '</span>';

    el.draftBar.querySelector('[data-draft="restore"]').addEventListener('click', function () {
      if (quill && !hasCustomMarkup(draft.html)) {
        truth = 'visual'; loadIntoQuill(draft.html); setTab('visual');
      } else {
        truth = 'source'; el.source.value = prettyHtml(draft.html); setTab('source');
      }
      dirty = true; updateSaveState(); hideDraftBar(); renderStats();
      toast('Draft restored.', 'ok');
    });
    el.draftBar.querySelector('[data-draft="discard"]').addEventListener('click', function () {
      try { localStorage.removeItem(draftKey()); } catch (e) { /* ignore */ }
      hideDraftBar();
    });
  }

  function markSaved() {
    clearTimeout(draftTimer);
    try { localStorage.removeItem(draftKey()); } catch (e) { /* ignore */ }
    baseline = getHtml();
    dirty = false;
    updateSaveState();
    hideDraftBar();
  }

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  // ────────────────────────────────────────────────
  // Image tools (size / align / alt text / remove)
  // ────────────────────────────────────────────────
  var activeImg = null;

  function hideImgBar() {
    activeImg = null;
    if (el.imgBar) el.imgBar.hidden = true;
    var sel = el.editor && el.editor.querySelector('img.rte-img-selected');
    if (sel) sel.classList.remove('rte-img-selected');
  }

  function positionImgBar() {
    if (!activeImg || !el.imgBar) return;
    var pane = el.paneVisual.getBoundingClientRect();
    var r = activeImg.getBoundingClientRect();
    el.imgBar.hidden = false;
    var barW = el.imgBar.offsetWidth || 360;
    var left = Math.max(8, Math.min(r.left - pane.left + r.width / 2 - barW / 2, pane.width - barW - 8));
    var top = r.top - pane.top - el.imgBar.offsetHeight - 8;
    if (top < 4) top = r.bottom - pane.top + 8;
    el.imgBar.style.left = left + 'px';
    el.imgBar.style.top = top + 'px';
  }

  function imgIndex(img) {
    var blot = window.Quill.find(img);
    return blot ? quill.getIndex(blot) : -1;
  }

  function selectImage(img) {
    var prev = el.editor.querySelector('img.rte-img-selected');
    if (prev && prev !== img) prev.classList.remove('rte-img-selected');
    img.classList.add('rte-img-selected');
    activeImg = img;
    positionImgBar();
  }

  async function onImgAction(action, value) {
    if (!activeImg) return;
    var img = activeImg;
    var idx = imgIndex(img);
    if (idx < 0) return;

    if (action === 'width') {
      quill.formatText(idx, 1, 'width', value === 'auto' ? false : value, 'user');
    } else if (action === 'align') {
      quill.formatLine(idx, 1, 'align', value === 'left' ? false : value, 'user');
    } else if (action === 'alt') {
      var alt = await modal({
        title: 'Image description (alt text)',
        message: 'Describe the image in a few words. Helps Google Images and screen readers.',
        input: true,
        value: img.getAttribute('alt') || '',
        placeholder: 'e.g. WhatsApp automation dashboard showing 120 leads',
        confirmText: 'Save'
      });
      if (alt === null) return;
      quill.formatText(idx, 1, 'alt', alt || false, 'user');
    } else if (action === 'remove') {
      quill.deleteText(idx, 1, 'user');
      hideImgBar();
      return;
    }
    setTimeout(function () {
      var again = el.editor.querySelectorAll('img');
      var found = Array.prototype.find.call(again, function (n) { return imgIndex(n) === idx; });
      if (found) selectImage(found);
      renderStats();
    }, 0);
  }

  // ────────────────────────────────────────────────
  // Custom colour inputs (any colour, like Word)
  // ────────────────────────────────────────────────
  function bindColorInput(input, format) {
    if (!input) return;
    input.addEventListener('mousedown', function () {
      var r = quill && quill.getSelection();
      if (r) lastRange = r;
    });
    input.addEventListener('input', function () {
      var bar = input.parentNode && input.parentNode.querySelector('.rte-color-bar');
      if (bar) bar.style.background = input.value;
      if (!quill) return;
      if (lastRange) quill.setSelection(lastRange.index, lastRange.length, 'silent');
      quill.format(format, input.value, 'user');
    });
  }

  // ────────────────────────────────────────────────
  // Build Quill
  // ────────────────────────────────────────────────
  function normalizeUrl(url) {
    var u = String(url || '').trim();
    if (!u) return u;
    if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
    if (/^[\w.-]+@[\w.-]+\.\w+$/.test(u)) return 'mailto:' + u;
    return 'https://' + u;
  }

  function initQuill() {
    var Quill = window.Quill;
    if (!Quill) return false;

    var AlignStyle = Quill.import('attributors/style/align');
    var SizeStyle = Quill.import('attributors/style/size');
    var FontStyle = Quill.import('attributors/style/font');
    SizeStyle.whitelist = SIZES;
    FontStyle.whitelist = FONTS.map(function (f) { return f.value; });
    Quill.register(AlignStyle, true);
    Quill.register(SizeStyle, true);
    Quill.register(FontStyle, true);

    // Smarter links: "genartml.com" → https://genartml.com
    var Link = Quill.import('formats/link');
    var originalSanitize = Link.sanitize.bind(Link);
    Link.sanitize = function (url) { return originalSanitize(normalizeUrl(url)); };

    quill = new Quill(el.editor, {
      theme: 'snow',
      placeholder: 'Start writing… or paste text from anywhere — headings, lists and paragraphs are organised for you.',
      modules: {
        toolbar: {
          container: el.toolbar,
          handlers: {
            image: imageHandler,
            video: videoHandler,
            undo: function () { quill.history.undo(); },
            redo: function () { quill.history.redo(); },
            autoformat: autoFormat
          }
        },
        history: { delay: 800, maxStack: 300, userOnly: true },
        clipboard: { matchVisual: false }
      }
    });

    quill.on('text-change', function (delta, old, source) {
      if (source === 'user') markDirty();
      if (activeImg) positionImgBar();
      scheduleStats();
    });

    quill.on('selection-change', function (range) {
      if (range) lastRange = range;
      if (activeImg && range && range.length !== 1) hideImgBar();
    });

    quill.root.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'IMG') selectImage(e.target);
      else hideImgBar();
    });

    quill.container.addEventListener('paste', onPaste, true);
    quill.container.addEventListener('drop', onDrop, true);
    quill.root.setAttribute('spellcheck', 'true');

    bindColorInput(el.textColor, 'color');
    bindColorInput(el.bgColor, 'background');

    return true;
  }

  // ────────────────────────────────────────────────
  // Wire up UI
  // ────────────────────────────────────────────────
  Array.prototype.forEach.call(el.tabs, function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.getAttribute('data-rte-tab')); });
  });

  el.source.addEventListener('input', function () {
    markDirty();
    scheduleStats();
  });

  if (el.cleanBtn) {
    el.cleanBtn.addEventListener('click', function () {
      var cleaned = sourceHtml();
      el.source.value = prettyHtml(cleaned);
      markDirty();
      renderStats();
      toast('HTML cleaned: unsafe tags removed, markup tidied.', 'ok');
    });
  }

  Array.prototype.forEach.call(root.querySelectorAll('[data-rte-device]'), function (btn) {
    btn.addEventListener('click', function () {
      var device = btn.getAttribute('data-rte-device');
      Array.prototype.forEach.call(root.querySelectorAll('[data-rte-device]'), function (b) {
        b.classList.toggle('active', b === btn);
      });
      el.previewWrap.setAttribute('data-device', device);
    });
  });

  if (el.imgBar) {
    el.imgBar.addEventListener('mousedown', function (e) { e.preventDefault(); });
    el.imgBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-img-action]');
      if (!btn) return;
      onImgAction(btn.getAttribute('data-img-action'), btn.getAttribute('data-value'));
    });
  }

  window.addEventListener('resize', function () { if (activeImg) positionImgBar(); });
  window.addEventListener('scroll', function () { if (activeImg) positionImgBar(); }, { passive: true });

  var ready = initQuill();
  if (!ready) {
    // CDN unreachable: fall back to the HTML tab so the admin is never blocked.
    truth = 'source';
    var visualTab = root.querySelector('[data-rte-tab="visual"]');
    if (visualTab) { visualTab.disabled = true; visualTab.title = 'Visual editor failed to load (check your connection)'; }
    setTab('source');
    toast('The visual editor could not load. You can still write in the HTML tab.', 'error');
  } else {
    setTab('visual');
  }
  renderStats();
  updateSaveState();

  // ────────────────────────────────────────────────
  // Public API
  // ────────────────────────────────────────────────
  window.RichEditor = {
    setContent: setContent,
    getContent: getHtml,
    getPlainText: function () {
      if (truth === 'visual' && quill) return quill.getText().trim();
      var doc = new DOMParser().parseFromString('<body>' + Content.contentToHtml(el.source.value) + '</body>', 'text/html');
      return (doc.body.textContent || '').trim();
    },
    isEmpty: function () { return truth === 'visual' ? quillIsEmpty() : !el.source.value.trim(); },
    clear: clear,
    markSaved: markSaved,
    isDirty: function () { return dirty; },
    stats: computeStats
  };
})();
