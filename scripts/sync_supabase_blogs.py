#!/usr/bin/env python3
"""Sync blogs from Supabase into Frontend/src/blog.py and trigger build."""
import urllib.request, json, os, re

SUPABASE_URL = "https://czvibozmuzmlpxdafxch.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_DTa0uYY3Xa_kYY52eFwY4Q_ETGHgdqV"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BLOG_PY = os.path.join(ROOT, "Frontend", "src", "blog.py")

def fetch_supabase_blogs():
    url = f"{SUPABASE_URL}/rest/v1/blogs?select=*&is_published=eq.true&order=created_at.desc"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    })
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def format_date(iso_str):
    if not iso_str: return "2026-10-19", "19 October 2026"
    date_part = iso_str.split("T")[0]
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    try:
        y, m, d = date_part.split("-")
        month_name = months[int(m)-1]
        return date_part, f"{int(d)} {month_name} {y}"
    except Exception:
        return date_part, date_part

def clean_cover(cat):
    c = (cat or "").lower()
    if "voice" in c: return "voice"
    if "process" in c or "software" in c: return "proposal"
    return "agents"

def parse_read_time(rt):
    if not rt: return 7
    m = re.search(r'\d+', str(rt))
    return int(m.group(0)) if m else 7

def main():
    print("Fetching blogs from Supabase...")
    blogs = fetch_supabase_blogs()
    print(f"Found {len(blogs)} published articles.")

    articles_code = '# Blog articles synced with Supabase. Author: Team Genartml.\n\nARTICLES = [\n'
    
    for b in blogs:
        slug = b.get("slug") or "article"
        title = b.get("title") or "Article"
        cat = b.get("category") or "AI Systems"
        dek = b.get("excerpt") or ""
        date_iso, date_h = format_date(b.get("created_at"))
        read_time = parse_read_time(b.get("read_time"))
        cover = clean_cover(cat)
        
        # Format body content safely
        raw_body = b.get("content") or ""
        # If it looks like plain text / markdown, convert newlines to paragraphs
        if not re.search(r'<(p|h[1-6]|ul|ol|div)', raw_body):
            paras = [p.strip() for p in raw_body.split("\n\n") if p.strip()]
            formatted_paras = []
            for p in paras:
                if len(p) < 80 and not p.endswith(".") and not p.endswith("?"):
                    formatted_paras.append(f'<h2>{p}</h2>')
                else:
                    formatted_paras.append(f'<p>{p}</p>')
            html_body = "\n".join(formatted_paras)
        else:
            html_body = raw_body

        # Escape triple quotes if any
        safe_body = html_body.replace('"""', '\\"\\"\\"')
        safe_title = title.replace('"', '\\"')
        safe_dek = dek.replace('"', '\\"')

        articles_code += f'''dict(
slug="{slug}",
cat="{cat}",
title="{safe_title}",
dek="{safe_dek}",
date="{date_iso}", date_h="{date_h}", read={read_time}, cover="{cover}",
body="""
{safe_body}
"""),
'''

    articles_code += ']\n'

    with open(BLOG_PY, "w", encoding="utf-8") as f:
        f.write(articles_code)
    print(f"Successfully updated {BLOG_PY}")

if __name__ == "__main__":
    main()
