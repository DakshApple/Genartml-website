// Genartml Admin JS

const SUPABASE_URL = 'https://czvibozmuzmlpxdafxch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV';

let currentBlogs = [];
let base64Image = '';

// DOM Elements
const authOverlay = document.getElementById('authOverlay');
const loginBtn = document.getElementById('loginBtn');
const authError = document.getElementById('authError');

const blogList = document.getElementById('blogList');
const blogForm = document.getElementById('blogForm');
const formStatus = document.getElementById('formStatus');
const editorTitle = document.getElementById('editorTitle');
const deleteBtn = document.getElementById('deleteBtn');

// New Dashboard DOM Elements
const subscribersTable = document.querySelector('#subscribersTable tbody');
const messagesTable = document.querySelector('#messagesTable tbody');
const statPageviews = document.getElementById('statPageviews');
const statSubscribers = document.getElementById('statSubscribers');
const statArticles = document.getElementById('statArticles');
let trafficChart = null;

// Auth Logic
const ADMIN_PASSWORD = 'GenArtML_Admin_2026!';
const secretKeyInput = document.getElementById('passwordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');

togglePasswordBtn.addEventListener('click', () => {
  if (secretKeyInput.type === 'password') {
    secretKeyInput.type = 'text';
    togglePasswordBtn.textContent = 'Hide';
  } else {
    secretKeyInput.type = 'password';
    togglePasswordBtn.textContent = 'Show';
  }
});

const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});

loginBtn.addEventListener('click', async () => {
  const password = secretKeyInput.value.trim();
  if (!password) return;

  if (password !== ADMIN_PASSWORD) {
    authError.textContent = 'Incorrect password.';
    authError.style.display = 'block';
    return;
  }

  loginBtn.textContent = 'Checking...';
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?select=id&limit=1`, {
      headers: getHeaders()
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status} - ${errText}`);
    }
    
    // Success
    authOverlay.style.display = 'none';
    
    // Initialize Dashboard Data
    initDashboard();
  } catch (error) {
    authError.textContent = 'Authentication failed: ' + error.message;
    authError.style.display = 'block';
    loginBtn.textContent = 'Authenticate';
  }
});

// --- Tab Navigation ---
const menuItems = document.querySelectorAll('.admin-menu-item');
const panels = document.querySelectorAll('.admin-panel');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(m => m.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    
    item.classList.add('active');
    document.getElementById(item.dataset.tab).classList.add('active');
  });
});

// --- Dashboard Data Loading ---
async function initDashboard() {
  await Promise.all([
    loadBlogs(),
    loadSubscribers(),
    loadMessages(),
    loadPageviews()
  ]);
}

document.getElementById('refreshStatsBtn')?.addEventListener('click', () => {
  initDashboard();
});

async function loadSubscribers() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    
    statSubscribers.textContent = data.length;
    
    if (data.length === 0) {
      subscribersTable.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--muted);">No subscribers yet.</td></tr>';
      return;
    }
    
    let html = '';
    data.forEach(sub => {
      const date = new Date(sub.created_at).toLocaleDateString();
      const statusClass = sub.status === 'active' ? 'active' : '';
      html += `
        <tr>
          <td style="font-weight: 500;">${sub.email}</td>
          <td><span class="badge ${statusClass}">${sub.status}</span></td>
          <td style="color: var(--muted);">${date}</td>
        </tr>
      `;
    });
    subscribersTable.innerHTML = html;
  } catch (e) {
    console.error(e);
    statSubscribers.textContent = '-';
  }
}

async function loadMessages() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages?select=*&order=created_at.desc`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    
    if (data.length === 0) {
      messagesTable.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--muted);">No messages yet.</td></tr>';
      return;
    }
    
    let html = '';
    data.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString();
      html += `
        <tr>
          <td style="font-weight: 500;">${escapeHtml(msg.name)}</td>
          <td><a href="mailto:${escapeHtml(msg.email)}" style="color: var(--ink);">${escapeHtml(msg.email)}</a></td>
          <td><div style="max-width: 400px; white-space: pre-wrap; font-size: 13px; line-height: 1.5; color: var(--muted);">${escapeHtml(msg.message)}</div></td>
          <td style="color: var(--muted);">${date}</td>
        </tr>
      `;
    });
    messagesTable.innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

const statUniqueVisitors = document.getElementById('statUniqueVisitors');
const topPagesList = document.getElementById('topPagesList');

async function loadPageviews() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pageviews?select=created_at,path,session_id`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    
    statPageviews.textContent = data.length;
    
    // Unique Visitors
    const uniqueSessions = new Set(data.map(pv => pv.session_id).filter(Boolean));
    if (statUniqueVisitors) statUniqueVisitors.textContent = uniqueSessions.size;
    
    // Group by date for chart (last 7 days)
    const countsByDate = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      countsByDate[d.toISOString().split('T')[0]] = 0;
    }
    
    // Top Pages
    const pathCounts = {};
    
    data.forEach(pv => {
      const dateStr = pv.created_at.split('T')[0];
      if (countsByDate[dateStr] !== undefined) {
        countsByDate[dateStr]++;
      }
      
      const p = pv.path || '/';
      pathCounts[p] = (pathCounts[p] || 0) + 1;
    });

    renderChart(Object.keys(countsByDate), Object.values(countsByDate));
    
    // Render Top Pages
    if (topPagesList) {
      const sorted = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      topPagesList.innerHTML = sorted.map(([path, count]) => `
        <div style="display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--border-light);">
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;" title="${escapeHtml(path)}">${escapeHtml(path)}</span>
          <span style="font-weight: 500;">${count}</span>
        </div>
      `).join('');
    }
    
  } catch (e) {
    console.error(e);
    statPageviews.textContent = '-';
    if (statUniqueVisitors) statUniqueVisitors.textContent = '-';
  }
}

function renderChart(labels, data) {
  const ctx = document.getElementById('trafficChart').getContext('2d');
  
  if (trafficChart) {
    trafficChart.destroy();
  }
  
  trafficChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pageviews',
        data: data,
        borderColor: '#0a0a0a',
        backgroundColor: 'rgba(10, 10, 10, 0.05)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#0a0a0a',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { borderDash: [4, 4] }, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });
}

// --- Blog Manager Logic ---
document.getElementById('blogTitle').addEventListener('input', (e) => {
  if (!document.getElementById('blogId').value) {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    document.getElementById('blogSlug').value = slug;
  }
});

async function loadBlogs() {
  blogList.innerHTML = '<div style="color: var(--muted); font-size: 14px;">Loading...</div>';
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?select=*&order=created_at.desc`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    currentBlogs = data || [];
    statArticles.textContent = currentBlogs.filter(b => b.is_published).length;
    renderBlogList();
  } catch (error) {
    blogList.innerHTML = `<div class="status-msg error">Error loading blogs</div>`;
  }
}

function renderBlogList() {
  if (currentBlogs.length === 0) {
    blogList.innerHTML = '<div style="color: var(--muted); font-size: 14px;">No posts found.</div>';
    return;
  }
  let html = '';
  currentBlogs.forEach(blog => {
    const date = new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const status = blog.is_published ? '<span style="color:#2d8a4e">Published</span>' : '<span style="color:#d93838">Draft</span>';
    const featured = blog.is_featured ? ' 🌟' : '';
    html += `
      <div class="admin-blog-item" data-id="${blog.id}">
        <div class="blog-item-title">${escapeHtml(blog.title)}</div>
        <div class="blog-item-meta">${date} · ${status}${featured}</div>
      </div>
    `;
  });
  blogList.innerHTML = html;
  document.querySelectorAll('.admin-blog-item').forEach(el => {
    el.addEventListener('click', () => editPost(el.dataset.id));
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Handle Image Upload UI
const radioUrl = document.querySelector('input[value="url"]');
const radioUpload = document.querySelector('input[value="upload"]');
const blogCoverUrlInput = document.getElementById('blogCover');
const blogCoverFileInput = document.getElementById('blogCoverFile');
const uploadPreview = document.getElementById('uploadPreview');
const uploadPreviewImg = document.getElementById('uploadPreviewImg');

radioUrl.addEventListener('change', () => {
  blogCoverUrlInput.style.display = 'block';
  blogCoverFileInput.style.display = 'none';
  uploadPreview.style.display = 'none';
  blogCoverUrlInput.required = true;
  blogCoverFileInput.required = false;
  base64Image = '';
});

radioUpload.addEventListener('change', () => {
  blogCoverUrlInput.style.display = 'none';
  blogCoverFileInput.style.display = 'block';
  blogCoverUrlInput.required = false;
  // File is required only for new post if upload is selected
  blogCoverFileInput.required = !document.getElementById('blogId').value; 
});

blogCoverFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Please select an image under 5MB.");
      blogCoverFileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality
        base64Image = canvas.toDataURL('image/jpeg', 0.8);
        uploadPreviewImg.src = base64Image;
        uploadPreview.style.display = 'block';
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Editor actions
document.getElementById('newPostBtn').addEventListener('click', resetForm);
document.getElementById('cancelBtn').addEventListener('click', resetForm);

function resetForm() {
  document.querySelectorAll('.admin-blog-item').forEach(el => el.classList.remove('active'));
  blogForm.reset();
  document.getElementById('blogId').value = '';
  editorTitle.textContent = 'Create New Post';
  deleteBtn.style.display = 'none';
  formStatus.style.display = 'none';
  radioUrl.click();
  base64Image = '';
  blogCoverFileInput.required = false; // reset
}

function editPost(id) {
  const blog = currentBlogs.find(b => b.id === id);
  if (!blog) return;
  document.querySelectorAll('.admin-blog-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  
  document.getElementById('blogId').value = blog.id;
  document.getElementById('blogTitle').value = blog.title;
  document.getElementById('blogSlug').value = blog.slug;
  document.getElementById('blogCategory').value = blog.category;
  document.getElementById('blogReadTime').value = blog.read_time;
  document.getElementById('blogExcerpt').value = blog.excerpt;
  document.getElementById('blogContent').value = blog.content;
  document.getElementById('blogPublished').checked = blog.is_published;
  
  // Safe check if column exists
  document.getElementById('blogFeatured').checked = blog.is_featured === true;

  editorTitle.textContent = 'Edit Post';
  deleteBtn.style.display = 'inline-flex';
  formStatus.style.display = 'none';

  // Handle Cover Image state
  if (blog.cover_image && blog.cover_image.startsWith('data:image')) {
    radioUpload.click();
    base64Image = blog.cover_image;
    uploadPreviewImg.src = base64Image;
    uploadPreview.style.display = 'block';
    blogCoverFileInput.required = false; // Already have image
  } else {
    radioUrl.click();
    document.getElementById('blogCover').value = blog.cover_image;
  }
}

async function uploadImageToSupabase(base64Data) {
  const arr = base64Data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mime });
  
  const fileName = `cover-${Date.now()}.jpg`;
  
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/blog-images/${fileName}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': mime
    },
    body: blob
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Storage upload failed: ${errText}`);
  }
  
  return `${SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;
}

blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('saveBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  formStatus.style.display = 'none';
  
  const id = document.getElementById('blogId').value;
  let finalCoverImage = '';
  
  try {
    if (radioUrl.checked) {
      finalCoverImage = document.getElementById('blogCover').value;
    } else {
      if (base64Image) {
        // If it is a full base64 image and not a previously uploaded URL
        if (base64Image.startsWith('data:image')) {
          submitBtn.textContent = 'Uploading Image...';
          finalCoverImage = await uploadImageToSupabase(base64Image);
          submitBtn.textContent = 'Saving Post...';
        } else {
          finalCoverImage = base64Image;
        }
      } else {
        // Keep existing image if editing and no new file selected
        const existing = currentBlogs.find(b => b.id === id);
        if (existing) {
          finalCoverImage = existing.cover_image;
        }
      }
    }

  const blogData = {
    title: document.getElementById('blogTitle').value,
    slug: document.getElementById('blogSlug').value || document.getElementById('blogTitle').value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: document.getElementById('blogCategory').value,
    read_time: document.getElementById('blogReadTime').value,
    cover_image: finalCoverImage,
    excerpt: document.getElementById('blogExcerpt').value,
    content: document.getElementById('blogContent').value,
    is_published: document.getElementById('blogPublished').checked,
    is_featured: document.getElementById('blogFeatured').checked
  };
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${SUPABASE_URL}/rest/v1/blogs?id=eq.${id}` : `${SUPABASE_URL}/rest/v1/blogs`;
    
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }
    
    formStatus.textContent = 'Post saved successfully!';
    formStatus.className = 'status-msg success';
    await initDashboard(); // Reload all data
    
    if (!id) resetForm(); // Clear if it was new
  } catch (error) {
    formStatus.textContent = 'Error: ' + error.message;
    formStatus.className = 'status-msg error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Post';
  }
});

deleteBtn.addEventListener('click', async () => {
  const id = document.getElementById('blogId').value;
  if (!id) return;
  
  if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
  
  const origText = deleteBtn.textContent;
  deleteBtn.disabled = true;
  deleteBtn.textContent = 'Deleting...';
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!res.ok) throw new Error('Delete failed');
    
    formStatus.textContent = 'Post deleted successfully.';
    formStatus.className = 'status-msg success';
    resetForm();
    await initDashboard();
  } catch (error) {
    formStatus.textContent = 'Error: ' + error.message;
    formStatus.className = 'status-msg error';
  } finally {
    deleteBtn.disabled = false;
    deleteBtn.textContent = origText;
  }
});

document.getElementById('exportSubscribersBtn')?.addEventListener('click', () => {
  fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=email,status,created_at`, { headers: getHeaders() })
    .then(res => res.json())
    .then(data => {
      let csv = 'Email,Status,Date\n';
      data.forEach(sub => {
        csv += `${sub.email},${sub.status},${new Date(sub.created_at).toLocaleDateString()}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'genartml-subscribers.csv';
      a.click();
    });
});
