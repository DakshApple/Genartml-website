import json
import urllib.request
import datetime as dt

# Supabase Config
SUPABASE_URL = "https://czvibozmuzmlpxdafxch.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV"

def fetch_blogs():
    url = f"{SUPABASE_URL}/rest/v1/blogs?select=slug,created_at&is_published=eq.true&order=created_at.desc"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    })
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Failed to fetch blogs from Supabase: {e}")
        return []

def fetch_jobs():
    url = f"{SUPABASE_URL}/rest/v1/jobs?select=slug,published_at,status&status=eq.published&order=published_at.desc"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    })
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Failed to fetch jobs from Supabase: {e}")
        return []

def generate_sitemap(blogs, jobs):
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    
    pages = [
        ("https://genartml.com/", "1.0", "weekly"),
        ("https://genartml.com/services/", "0.9", "weekly"),
        ("https://genartml.com/services/ai-workflows/", "0.9", "monthly"),
        ("https://genartml.com/services/voice-ai-agents/", "0.9", "monthly"),
        ("https://genartml.com/services/websites/", "0.9", "monthly"),
        ("https://genartml.com/services/software-development/", "0.9", "monthly"),
        ("https://genartml.com/services/care-plans/", "0.9", "monthly"),
        ("https://genartml.com/packages/", "0.9", "weekly"),
        ("https://genartml.com/work/", "0.8", "weekly"),
        ("https://genartml.com/about/", "0.8", "monthly"),
        ("https://genartml.com/contact/", "0.9", "monthly"),
        ("https://genartml.com/careers/", "0.8", "daily"),
        ("https://genartml.com/blog/", "0.9", "weekly"),
        ("https://genartml.com/industries/real-estate/", "0.8", "monthly"),
        ("https://genartml.com/privacy/", "0.3", "yearly"),
        ("https://genartml.com/terms/", "0.3", "yearly"),
    ]
    
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <!-- Core Pages -->'
    ]
    for url, pri, freq in pages:
        xml.append('  <url>')
        xml.append(f'    <loc>{url}</loc>')
        xml.append(f'    <lastmod>{today}</lastmod>')
        xml.append(f'    <changefreq>{freq}</changefreq>')
        xml.append(f'    <priority>{pri}</priority>')
        xml.append('  </url>')
    
    if blogs:
        xml.append('  <!-- Blog Posts -->')
        for blog in blogs:
            slug = blog.get('slug')
            created_at = blog.get('created_at', today)[:10] 
            if slug:
                xml.append('  <url>')
                xml.append(f'    <loc>https://genartml.com/blog/{slug}/</loc>')
                xml.append(f'    <lastmod>{created_at}</lastmod>')
                xml.append('    <changefreq>monthly</changefreq>')
                xml.append('    <priority>0.7</priority>')
                xml.append('  </url>')

    if jobs:
        xml.append('  <!-- Job Posts -->')
        for job in jobs:
            slug = job.get('slug')
            published_at = job.get('published_at') or today
            published_at = published_at[:10]
            if slug:
                xml.append('  <url>')
                xml.append(f'    <loc>https://genartml.com/careers/job.html?slug={slug}</loc>')
                xml.append(f'    <lastmod>{published_at}</lastmod>')
                xml.append('    <changefreq>weekly</changefreq>')
                xml.append('    <priority>0.8</priority>')
                xml.append('  </url>')
                
    xml.append('</urlset>')
    return "\n".join(xml)

if __name__ == "__main__":
    print("Fetching published blogs from Supabase...")
    blogs = fetch_blogs()
    print(f"Found {len(blogs)} published blogs.")
    
    print("Fetching published jobs from Supabase...")
    jobs = fetch_jobs()
    print(f"Found {len(jobs)} published jobs.")
    
    sitemap_content = generate_sitemap(blogs, jobs)
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    
    print("Successfully generated sitemap.xml")
