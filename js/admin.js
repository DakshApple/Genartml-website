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


// ============================================================
// CAREERS / JOBS ADMIN
// ============================================================

let currentJobs = [];
let jobContentBlocks = [];

const jobsTableBody = document.getElementById('jobsTableBody');
const careersListView = document.getElementById('careersListView');
const careersEditorView = document.getElementById('careersEditorView');
const jobForm = document.getElementById('jobForm');
const jobFormStatus = document.getElementById('jobFormStatus');
const contentBlocksContainer = document.getElementById('contentBlocksContainer');

// Auto-generate slug from title
document.getElementById('jobTitleInput')?.addEventListener('input', (e) => {
  if (!document.getElementById('jobId').value) {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    document.getElementById('jobSlugInput').value = slug;
  }
});

// Load jobs on careers tab
async function loadJobs() {
  if (!jobsTableBody) return;
  jobsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Loading...</td></tr>';
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&order=created_at.desc`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load jobs');
    currentJobs = await res.json();
    renderJobsTable(currentJobs);
  } catch (e) {
    console.error(e);
    jobsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Failed to load jobs. Make sure the jobs table exists in Supabase.</td></tr>';
  }
}

function renderJobsTable(jobs) {
  if (jobs.length === 0) {
    jobsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No jobs yet. Create your first job posting.</td></tr>';
    return;
  }

  let html = '';
  jobs.forEach(job => {
    const statusColors = {
      draft: 'background: #f3f4f6; color: #6b7280;',
      published: 'background: #d1fae5; color: #059669;',
      paused: 'background: #fef3c7; color: #d97706;',
      closed: 'background: #fee2e2; color: #dc2626;',
      archived: 'background: #f3f4f6; color: #9ca3af;'
    };
    const pubDate = job.published_at ? new Date(job.published_at).toLocaleDateString() : '—';
    
    html += `
      <tr>
        <td>
          <div style="font-weight: 600;">${escapeHtml(job.title)}</div>
          <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">/${job.slug}</div>
        </td>
        <td>${escapeHtml(job.department || '—')}</td>
        <td><span class="badge" style="${statusColors[job.status] || ''}">${job.status}</span></td>
        <td>${job.views || 0}</td>
        <td>${job.apply_clicks || 0}</td>
        <td style="color: var(--text-muted);">${pubDate}</td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <button class="admin-btn secondary small" onclick="editJob('${job.id}')" style="padding: 4px 8px; font-size: 12px;">Edit</button>
            <button class="admin-btn secondary small" onclick="duplicateJob('${job.id}')" style="padding: 4px 8px; font-size: 12px;">Dup</button>
            <button class="admin-btn danger small" onclick="deleteJob('${job.id}')" style="padding: 4px 8px; font-size: 12px;">Del</button>
          </div>
        </td>
      </tr>
    `;
  });
  jobsTableBody.innerHTML = html;
}

// Search jobs in admin
document.getElementById('jobAdminSearch')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = currentJobs.filter(j => 
    j.title.toLowerCase().includes(q) || 
    (j.department || '').toLowerCase().includes(q) ||
    (j.status || '').toLowerCase().includes(q)
  );
  renderJobsTable(filtered);
});

// New Job
document.getElementById('newJobBtn')?.addEventListener('click', () => {
  resetJobForm();
  showJobEditor('Create New Job');
});

// Back to list
document.getElementById('jobBackBtn')?.addEventListener('click', () => {
  careersEditorView.style.display = 'none';
  careersListView.style.display = 'block';
  loadJobs();
});

function showJobEditor(title) {
  careersListView.style.display = 'none';
  careersEditorView.style.display = 'block';
  document.getElementById('jobEditorTitle').textContent = title;
}

function resetJobForm() {
  document.getElementById('jobId').value = '';
  document.getElementById('jobCurrentStatus').value = 'draft';
  document.getElementById('jobTitleInput').value = '';
  document.getElementById('jobSlugInput').value = '';
  document.getElementById('jobDeptInput').value = '';
  document.getElementById('jobTeamInput').value = '';
  document.getElementById('jobLocationInput').value = 'Ahmedabad, India';
  document.getElementById('jobWorkModeInput').value = 'On-site';
  document.getElementById('jobTypeInput').value = 'Full-time';
  document.getElementById('jobExpLevelInput').value = '';
  document.getElementById('jobMinExpInput').value = '';
  document.getElementById('jobMaxExpInput').value = '';
  document.getElementById('jobSalaryInput').value = '';
  document.getElementById('jobSalaryVisibleInput').checked = false;
  document.getElementById('jobOpeningsInput').value = '1';
  document.getElementById('jobRefIdInput').value = '';
  document.getElementById('jobFeaturedInput').checked = false;
  document.getElementById('jobPriorityInput').value = '0';
  document.getElementById('jobApplyUrlInput').value = '';
  document.getElementById('jobApplyBtnTextInput').value = '';
  document.getElementById('jobDeadlineInput').value = '';
  document.getElementById('jobNewTabInput').checked = true;
  document.getElementById('jobNotesInput').value = '';
  document.getElementById('jobSeoTitleInput').value = '';
  document.getElementById('jobSeoDescInput').value = '';
  document.getElementById('jobShowClosedInput').checked = false;
  document.getElementById('jobShortDescInput').value = '';
  jobContentBlocks = [];
  renderBlocks();
  jobFormStatus.style.display = 'none';
}

// Edit Job
function editJob(id) {
  const job = currentJobs.find(j => j.id === id);
  if (!job) return;

  document.getElementById('jobId').value = job.id;
  document.getElementById('jobCurrentStatus').value = job.status;
  document.getElementById('jobTitleInput').value = job.title || '';
  document.getElementById('jobSlugInput').value = job.slug || '';
  document.getElementById('jobDeptInput').value = job.department || '';
  document.getElementById('jobTeamInput').value = job.team || '';
  document.getElementById('jobLocationInput').value = job.location || '';
  document.getElementById('jobWorkModeInput').value = job.work_mode || 'On-site';
  document.getElementById('jobTypeInput').value = job.employment_type || 'Full-time';
  document.getElementById('jobExpLevelInput').value = job.experience_level || '';
  document.getElementById('jobMinExpInput').value = job.min_experience || '';
  document.getElementById('jobMaxExpInput').value = job.max_experience || '';
  document.getElementById('jobSalaryInput').value = job.salary_range || '';
  document.getElementById('jobSalaryVisibleInput').checked = job.salary_visible || false;
  document.getElementById('jobOpeningsInput').value = job.openings || 1;
  document.getElementById('jobRefIdInput').value = job.reference_id || '';
  document.getElementById('jobFeaturedInput').checked = job.is_featured || false;
  document.getElementById('jobPriorityInput').value = job.priority || 0;
  document.getElementById('jobApplyUrlInput').value = job.apply_url || '';
  document.getElementById('jobApplyBtnTextInput').value = job.apply_button_text || '';
  document.getElementById('jobDeadlineInput').value = job.application_deadline ? job.application_deadline.split('T')[0] : '';
  document.getElementById('jobNewTabInput').checked = job.open_in_new_tab !== false;
  document.getElementById('jobNotesInput').value = job.internal_notes || '';
  document.getElementById('jobSeoTitleInput').value = job.seo_title || '';
  document.getElementById('jobSeoDescInput').value = job.seo_description || '';
  document.getElementById('jobShowClosedInput').checked = job.show_when_closed || false;
  document.getElementById('jobShortDescInput').value = job.short_description || '';
  
  jobContentBlocks = Array.isArray(job.content_blocks) ? [...job.content_blocks] : [];
  renderBlocks();
  showJobEditor('Edit Job');
}

// Duplicate Job
async function duplicateJob(id) {
  const job = currentJobs.find(j => j.id === id);
  if (!job) return;
  
  const newJob = { ...job };
  delete newJob.id;
  delete newJob.created_at;
  delete newJob.updated_at;
  delete newJob.published_at;
  newJob.title = job.title + ' (Copy)';
  newJob.slug = job.slug + '-copy-' + Date.now().toString(36);
  newJob.status = 'draft';
  newJob.views = 0;
  newJob.apply_clicks = 0;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newJob)
    });
    if (!res.ok) throw new Error(await res.text());
    loadJobs();
  } catch (e) {
    alert('Failed to duplicate: ' + e.message);
  }
}

// Delete Job
async function deleteJob(id) {
  if (!confirm('Delete this job permanently?')) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    loadJobs();
  } catch (e) {
    alert('Failed to delete: ' + e.message);
  }
}

// Collect form data
function collectJobData() {
  return {
    title: document.getElementById('jobTitleInput').value,
    slug: document.getElementById('jobSlugInput').value || document.getElementById('jobTitleInput').value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    department: document.getElementById('jobDeptInput').value || 'Engineering',
    team: document.getElementById('jobTeamInput').value || null,
    location: document.getElementById('jobLocationInput').value || 'Ahmedabad, India',
    work_mode: document.getElementById('jobWorkModeInput').value,
    employment_type: document.getElementById('jobTypeInput').value,
    experience_level: document.getElementById('jobExpLevelInput').value || null,
    min_experience: document.getElementById('jobMinExpInput').value ? parseInt(document.getElementById('jobMinExpInput').value) : null,
    max_experience: document.getElementById('jobMaxExpInput').value ? parseInt(document.getElementById('jobMaxExpInput').value) : null,
    salary_range: document.getElementById('jobSalaryInput').value || null,
    salary_visible: document.getElementById('jobSalaryVisibleInput').checked,
    openings: parseInt(document.getElementById('jobOpeningsInput').value) || 1,
    reference_id: document.getElementById('jobRefIdInput').value || null,
    is_featured: document.getElementById('jobFeaturedInput').checked,
    priority: parseInt(document.getElementById('jobPriorityInput').value) || 0,
    apply_url: document.getElementById('jobApplyUrlInput').value || null,
    apply_button_text: document.getElementById('jobApplyBtnTextInput').value || 'Apply Now',
    application_deadline: document.getElementById('jobDeadlineInput').value ? new Date(document.getElementById('jobDeadlineInput').value).toISOString() : null,
    open_in_new_tab: document.getElementById('jobNewTabInput').checked,
    internal_notes: document.getElementById('jobNotesInput').value || null,
    seo_title: document.getElementById('jobSeoTitleInput').value || null,
    seo_description: document.getElementById('jobSeoDescInput').value || null,
    show_when_closed: document.getElementById('jobShowClosedInput').checked,
    short_description: document.getElementById('jobShortDescInput').value || null,
    content_blocks: jobContentBlocks,
    updated_at: new Date().toISOString()
  };
}

// Save Job (Draft)
document.getElementById('jobSaveBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await saveJob('draft');
});

// Publish Job
document.getElementById('jobPublishBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Validate apply URL for publishing
  const applyUrl = document.getElementById('jobApplyUrlInput').value;
  if (!applyUrl) {
    alert('Please add an Application URL before publishing.');
    return;
  }
  
  await saveJob('published');
});

async function saveJob(status) {
  const saveBtn = document.getElementById('jobSaveBtn');
  const pubBtn = document.getElementById('jobPublishBtn');
  saveBtn.disabled = true;
  pubBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  
  const id = document.getElementById('jobId').value;
  const data = collectJobData();
  data.status = status || document.getElementById('jobCurrentStatus').value || 'draft';
  
  if (status === 'published' && !data.published_at) {
    data.published_at = new Date().toISOString();
  }

  try {
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}` : `${SUPABASE_URL}/rest/v1/jobs`;
    
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }
    
    const result = await res.json();
    if (!id && result && result[0]) {
      document.getElementById('jobId').value = result[0].id;
    }
    
    document.getElementById('jobCurrentStatus').value = data.status;
    
    jobFormStatus.textContent = status === 'published' ? 'Job published successfully!' : 'Job saved as draft.';
    jobFormStatus.className = 'status-msg success';
    
    const saveStatus = document.getElementById('jobSaveStatus');
    if (saveStatus) saveStatus.textContent = `Saved ${new Date().toLocaleTimeString()}`;
    
  } catch (error) {
    jobFormStatus.textContent = 'Error: ' + error.message;
    jobFormStatus.className = 'status-msg error';
  } finally {
    saveBtn.disabled = false;
    pubBtn.disabled = false;
    saveBtn.textContent = 'Save Draft';
  }
}

// Preview
document.getElementById('jobPreviewBtn')?.addEventListener('click', () => {
  const slug = document.getElementById('jobSlugInput').value || document.getElementById('jobTitleInput').value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (slug) {
    window.open(`/careers/job.html?slug=${slug}`, '_blank');
  } else {
    alert('Save the job first to preview it.');
  }
});

// ── Content Blocks Builder ──

document.getElementById('addBlockBtn')?.addEventListener('click', () => {
  const type = document.getElementById('blockTypeSelect').value;
  const newBlock = { type, id: 'b_' + Date.now() };

  switch (type) {
    case 'heading': newBlock.content = 'Section Title'; break;
    case 'text': newBlock.content = 'Enter text here...'; break;
    case 'bullet_list': newBlock.items = ['Item 1', 'Item 2', 'Item 3']; break;
    case 'numbered_list': newBlock.items = ['Step 1', 'Step 2', 'Step 3']; break;
    case 'callout': newBlock.content = 'Important information here...'; break;
    case 'divider': break;
    case 'custom_section': newBlock.title = 'Custom Section'; newBlock.content = 'Content here...'; break;
  }

  jobContentBlocks.push(newBlock);
  renderBlocks();
});

function renderBlocks() {
  if (!contentBlocksContainer) return;
  
  if (jobContentBlocks.length === 0) {
    contentBlocksContainer.innerHTML = '<div style="text-align: center; padding: 40px; border: 2px dashed var(--border-light); border-radius: 8px; color: var(--text-muted); font-size: 13px;">No content blocks yet. Add blocks above to build the job description.</div>';
    return;
  }

  let html = '';
  jobContentBlocks.forEach((block, index) => {
    const typeLabels = {
      heading: '📌 Heading',
      text: '📝 Text',
      bullet_list: '• Bullet List',
      numbered_list: '1. Numbered List',
      callout: '💡 Callout',
      divider: '── Divider',
      custom_section: '📦 Custom Section'
    };

    html += `<div class="card" style="padding: 16px; border: 1px solid var(--border-light);" draggable="true" data-block-index="${index}">`;
    html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">`;
    html += `<span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">${typeLabels[block.type] || block.type}</span>`;
    html += `<div style="display: flex; gap: 4px;">`;
    if (index > 0) html += `<button type="button" class="admin-btn secondary small" onclick="moveBlock(${index}, -1)" style="padding: 2px 6px; font-size: 11px;">↑</button>`;
    if (index < jobContentBlocks.length - 1) html += `<button type="button" class="admin-btn secondary small" onclick="moveBlock(${index}, 1)" style="padding: 2px 6px; font-size: 11px;">↓</button>`;
    html += `<button type="button" class="admin-btn secondary small" onclick="duplicateBlock(${index})" style="padding: 2px 6px; font-size: 11px;">Dup</button>`;
    html += `<button type="button" class="admin-btn danger small" onclick="removeBlock(${index})" style="padding: 2px 6px; font-size: 11px;">✕</button>`;
    html += `</div></div>`;

    if (block.type === 'heading') {
      html += `<input type="text" class="form-input" value="${escapeHtml(block.content || '')}" onchange="updateBlockContent(${index}, 'content', this.value)" style="font-weight: 600;" />`;
    } else if (block.type === 'text' || block.type === 'callout') {
      html += `<textarea class="form-input" rows="3" onchange="updateBlockContent(${index}, 'content', this.value)" style="font-family: var(--font-sans); min-height: 80px;">${escapeHtml(block.content || '')}</textarea>`;
    } else if (block.type === 'bullet_list' || block.type === 'numbered_list') {
      html += `<textarea class="form-input" rows="4" onchange="updateBlockItems(${index}, this.value)" style="font-family: var(--font-sans); min-height: 80px;" placeholder="One item per line">${(block.items || []).join('\n')}</textarea>`;
    } else if (block.type === 'custom_section') {
      html += `<input type="text" class="form-input" value="${escapeHtml(block.title || '')}" onchange="updateBlockContent(${index}, 'title', this.value)" placeholder="Section Title" style="margin-bottom: 8px; font-weight: 600;" />`;
      html += `<textarea class="form-input" rows="3" onchange="updateBlockContent(${index}, 'content', this.value)" style="font-family: var(--font-sans); min-height: 80px;">${escapeHtml(block.content || '')}</textarea>`;
    } else if (block.type === 'divider') {
      html += `<hr style="border: none; border-top: 1px solid var(--border-light);" />`;
    }

    html += `</div>`;
  });

  contentBlocksContainer.innerHTML = html;
}

function updateBlockContent(index, key, value) {
  if (jobContentBlocks[index]) jobContentBlocks[index][key] = value;
}

function updateBlockItems(index, value) {
  if (jobContentBlocks[index]) {
    jobContentBlocks[index].items = value.split('\n').filter(line => line.trim());
  }
}

function moveBlock(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= jobContentBlocks.length) return;
  [jobContentBlocks[index], jobContentBlocks[newIndex]] = [jobContentBlocks[newIndex], jobContentBlocks[index]];
  renderBlocks();
}

function duplicateBlock(index) {
  const copy = JSON.parse(JSON.stringify(jobContentBlocks[index]));
  copy.id = 'b_' + Date.now();
  jobContentBlocks.splice(index + 1, 0, copy);
  renderBlocks();
}

function removeBlock(index) {
  jobContentBlocks.splice(index, 1);
  renderBlocks();
}

// Load jobs when Careers tab is first opened
const careersTab = document.querySelector('[data-tab="tab-careers"]');
if (careersTab) {
  careersTab.addEventListener('click', () => {
    loadJobs();
  });
}

// Also load on dashboard init
const origInitDashboard = initDashboard;
initDashboard = async function() {
  await origInitDashboard();
};

