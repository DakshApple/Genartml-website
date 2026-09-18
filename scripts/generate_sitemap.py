import json
import urllib.request
from datetime import datetime

# Supabase Config
SUPABASE_URL = "https://czvibozmuzmlpxdafxch.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV"

def fetch_blogs():
    url = f"{SUPABASE_URL}/rest/v1/blogs?select=slug,created_at&is_published=eq.true"
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

def generate_sitemap(blogs):
    import datetime as dt
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <!-- Core Pages -->',
        '  <url>',
        '    <loc>https://genartml.com/</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://genartml.com/blog/</loc>',
        f'    <lastmod>{today}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>'
    ]
    
    if blogs:
        xml.append('  <!-- Blog Posts -->')
        for blog in blogs:
            slug = blog.get('slug')
            # Extract date portion from created_at or fallback to today
            created_at = blog.get('created_at', today)[:10] 
            if slug:
                xml.append('  <url>')
                xml.append(f'    <loc>https://genartml.com/blog/post.html?slug={slug}</loc>')
                xml.append(f'    <lastmod>{created_at}</lastmod>')
                xml.append('    <changefreq>monthly</changefreq>')
                xml.append('    <priority>0.7</priority>')
                xml.append('  </url>')
                
    xml.append('</urlset>')
    
    return "\n".join(xml)

if __name__ == "__main__":
    print("Fetching published blogs from Supabase...")
    blogs = fetch_blogs()
    print(f"Found {len(blogs)} published blogs.")
    
    sitemap_content = generate_sitemap(blogs)
    
    with open("sitemap.xml", "w") as f:
        f.write(sitemap_content)
    
    print("Successfully generated sitemap.xml")
