#!/usr/bin/env python3
"""Build the Genartml website.

Usage: python3 build.py            -> writes the static site to ../dist and the preview bundle to ../preview.html
The site is plain HTML, CSS and JS. Company details live in assets/js/config.js (edit without rebuilding).
"""
import json, os, re, shutil, base64, html as H
from data import *
from blog import ARTICLES

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "..", "dist")
STATIC = os.path.join(HERE, "static")
ASSET_V = "20261019"

def e(s): return H.escape(s, quote=True)

# ---------------------------------------------------------------- icons
ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
CHEV = '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'
SHIELD = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 1.8l6 2.4v4.5c0 3.7-2.6 6.4-6 7.5-3.4-1.1-6-3.8-6-7.5V4.2z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6.2 9l2 1.9 3.6-3.8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
INFO = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v4.2M8 4.6v.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
CLOSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5"/></svg>'
WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-8.5 14.7L2.2 21.8l5-1.3A9.8 9.8 0 1 0 12 2.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.6 7.4c.3-.3.7-.3.9 0l1.1 1.7c.2.3.1.6-.1.9l-.6.6c.6 1.3 1.6 2.4 3 3l.6-.6c.3-.3.6-.3.9-.1l1.7 1.1c.3.2.3.6 0 .9l-.8.8c-.6.6-1.6.7-2.4.3-2.3-1.1-4.1-2.9-5.2-5.2-.4-.8-.3-1.8.3-2.4z" fill="currentColor"/></svg>'
MAIL = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 5.5l7 5.5 7-5.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
PHONE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 2.8l2.3.4 1 3.3-1.6 1.2a9 9 0 0 0 5.1 5.1l1.2-1.6 3.3 1 .4 2.3c-.2 1.3-1.3 2.2-2.6 2.1C8 16.1 3.9 12 3.4 5.4c-.1-1.3.8-2.4 2.1-2.6z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'
PIN = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 0 0-11 0C4.5 12.8 10 18 10 18z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="8.5" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
CLOCK = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 5.5V10l3 2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
LINK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
EXT = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3.5v9.5H13V10M9 3h4v4M13 3L7.5 8.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
SOC = {
 "linkedin": '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 6h2.1v7H3.2zM4.25 2.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM6.9 6h2v1c.4-.7 1.2-1.2 2.3-1.2 2 0 2.6 1.3 2.6 3.1V13h-2.1V9.4c0-.9-.2-1.7-1.2-1.7s-1.4.7-1.4 1.7V13H6.9z" fill="currentColor"/></svg>',
 "x": '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 2.5h3.2l7.8 11h-3.2zM13.2 2.5L8.9 7.4M2.8 13.5l4.3-4.9" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
 "instagram": '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.4" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2.7" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="11.6" cy="4.4" r=".8" fill="currentColor"/></svg>',
 "youtube": '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.8" y="3.6" width="12.4" height="8.8" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.8 6v4l3.4-2z" fill="currentColor"/></svg>',
}

def btn(label, href, kind="primary", extra="", arrow=True, cls=""):
    return f'<a class="btn btn-{kind} {cls}" href="{href}" {extra}>{e(label)}{ARROW if arrow else ""}</a>'
def book_btn(label="Book a free call", kind="primary", cls="", track="book_call"):
    return f'<a class="btn btn-{kind} {cls}" href="/contact/" data-book data-track="{track}">{e(label)}{ARROW}</a>'
def wa_btn(label="Chat on WhatsApp", kind="ghost", cls=""):
    return f'<a class="btn btn-{kind} {cls}" href="#" data-wa hidden data-track="whatsapp_click">{WA.replace("<svg", "<svg style=&quot;width:18px;height:18px&quot;")}{e(label)}</a>'.replace("&quot;", '"')

def eyebrow(code, label, extra=""):
    return f'<div class="eyebrow"><span class="code">{e(code)}</span><span class="label">{e(label)}</span>{extra}<span class="tick" aria-hidden="true"></span></div>'

# ---------------------------------------------------------------- art
ART = {
"ai-workflows": '''<svg viewBox="0 0 220 110" aria-hidden="true"><g class="a-soft"><path d="M30 25 C70 25 70 55 100 55"/><path d="M30 55 H100"/><path d="M30 85 C70 85 70 55 100 55"/></g><g class="a-stroke"><path d="M130 55 C160 55 160 25 190 25"/><path d="M130 55 H190"/><path d="M130 55 C160 55 160 85 190 85"/><circle cx="24" cy="25" r="7"/><circle cx="24" cy="55" r="7"/><circle cx="24" cy="85" r="7"/><circle cx="196" cy="25" r="7"/><circle cx="196" cy="55" r="7"/><circle cx="196" cy="85" r="7"/></g><g class="mv"><rect x="100" y="40" width="30" height="30" rx="6" class="a-fill"/><path d="M109 55h12M115 49v12" stroke="#fff" stroke-width="1.6"/></g></svg>''',
"voice-ai-agents": '<svg viewBox="0 0 220 110" aria-hidden="true"><g class="a-fill">' + "".join(f'<rect x="{8+i*9}" y="{55-h/2}" width="4" height="{h}" rx="2"/>' for i, h in enumerate([8,14,24,38,56,70,52,34,60,84,62,40,26,46,66,48,30,18,28,12,8,6,4])) + '</g></svg>',
"websites": '''<svg viewBox="0 0 220 110" aria-hidden="true"><rect x="20" y="8" width="180" height="96" rx="8" class="a-stroke"/><path d="M20 24h180" class="a-stroke"/><circle cx="31" cy="16" r="2.5" class="a-fill"/><circle cx="40" cy="16" r="2.5" class="a-fill"/><rect x="34" y="36" width="78" height="9" rx="3" class="a-fill"/><rect x="34" y="51" width="60" height="5" rx="2.5" class="a-soft"/><rect x="34" y="62" width="66" height="5" rx="2.5" class="a-soft"/><rect x="34" y="78" width="40" height="14" rx="7" class="a-fill"/><g class="mv"><rect x="128" y="36" width="58" height="56" rx="6" class="a-stroke"/><path d="M138 50h38M138 60h30M138 70h34" class="a-soft"/><rect x="138" y="78" width="22" height="7" rx="3.5" class="a-fill"/></g></svg>''',
"software-development": '''<svg viewBox="0 0 220 110" aria-hidden="true"><rect x="22" y="10" width="120" height="82" rx="8" class="a-stroke"/><path d="M22 26h120" class="a-stroke"/><rect x="32" y="36" width="26" height="46" rx="4" class="a-soft"/><rect x="66" y="36" width="66" height="20" rx="4" class="a-fill"/><rect x="66" y="62" width="30" height="20" rx="4" class="a-soft"/><rect x="102" y="62" width="30" height="20" rx="4" class="a-soft"/><g class="mv"><ellipse cx="178" cy="34" rx="22" ry="7" class="a-stroke"/><path d="M156 34v44c0 4 10 7 22 7s22-3 22-7V34M156 56c0 4 10 7 22 7s22-3 22-7" class="a-stroke"/></g><path d="M142 51h14" class="a-stroke" stroke-dasharray="2 3"/></svg>''',
"care-plans": '<svg viewBox="0 0 220 110" aria-hidden="true"><g class="a-fill">' + "".join(f'<rect x="{10+i*7}" y="{70 if i != 17 else 82}" width="4" height="{26 if i != 17 else 14}" rx="2" {"opacity=.25" if i == 17 else ""}/>' for i in range(29)) + '</g><path d="M10 44h60l8-22 12 40 10-28 6 10h104" class="a-stroke"/></svg>',
}

def hero_canvas():
    return '''<svg viewBox="0 0 640 380" role="img" aria-label="Illustration of an enquiry workflow: a new enquiry passes through an AI step to WhatsApp, the CRM and a team alert" data-smil>
<g>
<path id="w1" class="wire" d="M170 190 H240"/>
<path id="w2" class="wire" d="M390 190 C430 190 430 80 470 80"/>
<path id="w3" class="wire" d="M390 190 H470"/>
<path id="w4" class="wire" d="M390 190 C430 190 430 300 470 300"/>
<path class="wire wire-dash" d="M545 109 V161" opacity=".5"/>
</g>
<g class="node"><rect x="20" y="160" width="150" height="60" rx="10"/><text class="k" x="36" y="183">TRIGGER</text><text x="36" y="204">New enquiry</text></g>
<g class="node hot"><rect x="240" y="160" width="150" height="60" rx="10"/><text class="k" x="256" y="183">AI STEP</text><text x="256" y="204">Read intent</text></g>
<g class="node"><rect x="470" y="50" width="150" height="60" rx="10"/><text class="k" x="486" y="73">WHATSAPP</text><text x="486" y="94">Reply sent</text></g>
<g class="node"><rect x="470" y="160" width="150" height="60" rx="10"/><text class="k" x="486" y="183">CRM</text><text x="486" y="204">Lead created</text></g>
<g class="node"><rect x="470" y="270" width="150" height="60" rx="10"/><text class="k" x="486" y="293">ALERT</text><text x="486" y="314">Sales notified</text></g>
<circle class="pulse" r="3.5"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#w1"/></animateMotion></circle>
<circle class="pulse" r="3.5"><animateMotion dur="2.6s" begin=".9s" repeatCount="indefinite"><mpath href="#w2"/></animateMotion></circle>
<circle class="pulse" r="3.5"><animateMotion dur="2.6s" begin="1.2s" repeatCount="indefinite"><mpath href="#w3"/></animateMotion></circle>
<circle class="pulse" r="3.5"><animateMotion dur="2.6s" begin="1.5s" repeatCount="indefinite"><mpath href="#w4"/></animateMotion></circle>
</svg>'''

def hero_stage():
    log = [("09:41:02", "New enquiry", "Website form, 3 fields"), ("09:41:03", "Intent read", "Site visit, budget noted"),
           ("09:41:04", "WhatsApp reply sent", "Template approved"), ("09:41:04", "Lead created in CRM", "Owner assigned"),
           ("09:41:05", "Sales team alerted", "With call summary")]
    rows = "".join(f'<div class="row"><time>{t}</time><span>{a}<small>{b}</small></span></div>' for t, a, b in log)
    bars = "".join(f'<i style="animation-delay:{(i*0.07)%1.2:.2f}s;height:{h}%"></i>' for i, h in enumerate([30,55,80,45,95,60,35,70,100,65,40,85,50,30,60,90,45,25,55,35,20,40,28,18]))
    return f'''<div class="stage reveal">
<div class="console" aria-label="Product illustration">
  <div class="console-bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="path">genartml / client systems / enquiry workflow</span><span class="status"><span class="dot dot-live"></span>Running</span></div>
  <div class="console-body">
    <div class="c-side"><span class="label">Systems</span>
      <a class="on" tabindex="-1"><i></i>Enquiry workflow</a><a tabindex="-1"><i></i>Voice agent, inbound</a><a tabindex="-1"><i></i>Invoice reader</a><a tabindex="-1"><i></i>Morning report</a><a tabindex="-1"><i></i>Client portal</a>
      <span class="spacer"></span><div class="owner"><b>Accounts in your name</b>Code, data and logins handed over on final payment.</div>
    </div>
    <div class="c-canvas"><span class="ctitle">Live run</span>{hero_canvas()}</div>
    <div class="c-log"><span class="label">Event log</span>{rows}</div>
  </div>
</div>
<div class="float-card fc-ship" aria-hidden="true">
  <div class="label">Delivery tracker</div>
  <ul><li class="done"><i></i>Scope signed</li><li class="done"><i></i>Friday test link</li><li class="now"><i></i>Founder review</li><li><i></i>Go-live and handover</li></ul>
  <div class="bar"><span></span></div>
</div>
<div class="float-card fc-call" aria-hidden="true">
  <div class="head"><span class="label">Voice agent, inbound call</span><span class="pill pill-solid" style="padding:3px 10px;font-size:11px"><span class="dot"></span>Live</span></div>
  <div class="wave">{bars}</div>
  <div class="say"><p><b>Caller</b>Kal subah ka slot milega?</p><p><b>Agent</b>Yes, tomorrow at ten thirty is free. Shall I book it?</p></div>
</div>
</div>'''

def evoluter_ui():
    return '''<div class="browser"><div class="browser-bar"><span class="lights"><i></i><i></i><i></i></span><span class="url">evoluter.in</span></div>
<div class="browser-body"><div class="ui-row"><div class="ui-side"><i class="on"></i><i></i><i></i><i></i><i></i><i></i></div>
<div class="ui-col"><div class="ui-row"><div class="ui-card dark" style="flex:1.3"><span class="ui-k">Answer writing</span><div class="ui-line" style="width:90%"></div><div class="ui-line" style="width:70%"></div><div class="ui-line" style="width:80%"></div></div>
<div class="ui-card" style="flex:1"><span class="ui-k">This week</span><div class="ui-bars"><i style="height:40%"></i><i style="height:65%"></i><i class="l" style="height:30%"></i><i style="height:80%"></i><i style="height:55%"></i><i class="l" style="height:20%"></i><i style="height:90%"></i></div></div></div>
<div class="ui-card"><span class="ui-k">Practice question</span><div class="ui-line" style="width:95%"></div><div class="ui-line" style="width:60%"></div><div class="ui-opts"><div class="ui-opt"><i></i><div class="ui-line"></div></div><div class="ui-opt sel"><i></i><div class="ui-line" style="background:var(--ink-20)"></div></div><div class="ui-opt"><i></i><div class="ui-line"></div></div></div></div>
</div></div></div></div>'''

def extuter_ui():
    return '''<div class="browser"><div class="browser-bar"><span class="lights"><i></i><i></i><i></i></span><span class="url">extuter.com</span></div>
<div class="browser-body"><div class="ui-bubble me"><span class="ui-k" style="color:rgba(255,255,255,.6)">Doubt</span><div class="ui-line" style="width:180px"></div><div class="ui-line" style="width:120px"></div></div>
<div class="ui-bubble ai"><span class="ui-k">Step by step</span><div class="ui-steps"><div><span class="ui-line"></span></div><div><span class="ui-line" style="max-width:70%"></span></div><div><span class="ui-line" style="max-width:85%"></span></div></div><div class="ui-row" style="gap:6px"><span class="pill" style="padding:3px 10px;font-size:10px">Physics</span><span class="pill" style="padding:3px 10px;font-size:10px">Similar question</span></div></div>
<div class="ui-row" style="gap:8px;align-items:center;border:1px solid var(--line);border-radius:999px;padding:8px 8px 8px 14px"><div class="ui-line" style="flex:1"></div><span style="width:26px;height:26px;border-radius:50%;background:var(--ink);display:inline-block"></span></div>
</div></div>'''

def cover_svg(kind):
    if kind == "voice":
        bars = "".join(f'<rect x="{40+i*14}" y="{150-h/2}" width="6" height="{h}" rx="3" fill="#fff" opacity="{0.35 if i%5 else 0.9}"/>' for i, h in enumerate([10,20,36,60,90,120,80,50,100,160,110,70,40,90,130,80,50,30,60,20,14,10,30,50,24,12,8,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]))
        return f'<svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="640" height="300" fill="#0A0A0A"/>{bars}<path d="M0 150H640" stroke="#fff" stroke-opacity=".12"/></svg>'
    if kind == "agents":
        import math
        pts = [(320 + 120*math.cos(a), 150 + 120*math.sin(a)) for a in [i*math.pi/4 + math.pi/8 for i in range(8)]]
        g = "".join(f'<path d="M320 150 L{x:.0f} {y:.0f}" stroke="#fff" stroke-opacity=".4"/><circle cx="{x:.0f}" cy="{y:.0f}" r="12" fill="none" stroke="#fff" stroke-width="2"/>' for x, y in pts)
        return f'<svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="640" height="300" fill="#0A0A0A"/><circle cx="320" cy="150" r="200" fill="none" stroke="#fff" stroke-opacity=".08"/><circle cx="320" cy="150" r="150" fill="none" stroke="#fff" stroke-opacity=".08"/>{g}<rect x="300" y="130" width="40" height="40" rx="8" fill="#fff"/></svg>'
    rows = "".join(f'<rect x="250" y="{70+i*34}" width="16" height="16" rx="3" fill="{"#fff" if i<3 else "none"}" stroke="#fff" stroke-width="1.5"/><rect x="280" y="{75+i*34}" width="{[150,120,170,110,140][i]}" height="6" rx="3" fill="#fff" opacity="{0.8 if i<3 else 0.3}"/>' for i in range(5))
    return f'<svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="640" height="300" fill="#0A0A0A"/><rect x="220" y="40" width="240" height="240" rx="10" fill="none" stroke="#fff" stroke-opacity=".5"/>{rows}</svg>'

def post_cover_media(a):
    img = a.get("cover_image")
    if img:
        src = img if img.startswith("http") or img.startswith("/") else "/" + img
        return f'<img src="{e(src)}" alt="{e(a["title"])}" loading="lazy">'
    return cover_svg(a.get("cover", "agents"))

# ---------------------------------------------------------------- chrome
def svc(slug): return next(s for s in SERVICES if s["slug"] == slug)

def header():
    items = "".join(f'<li><a class="mega-item" href="/services/{s["slug"]}/"><span class="code">{s["code"]}</span><span><b>{e(s["name"])}</b><span class="d">{e(s["short"])}</span></span></a></li>' for s in SERVICES)
    mm_svc = "".join(f'<a href="/services/{s["slug"]}/"><span class="code">{s["code"]}</span>{e(s["name"])}</a>' for s in SERVICES)
    mm_ind = "".join(f'<a href="/industries/{i["slug"]}/"><span class="code">I/0{n+1}</span>{e(i["name"])}</a>' for n, i in enumerate(INDUSTRIES))
    return f'''<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span class="tb-note">Fixed price. Fixed timeline. Written before we start.</span><a href="/contact/" data-book data-track="book_call_topbar">Book a free call {ARROW}</a><a class="tb-wa" href="#" data-wa hidden data-track="whatsapp_topbar">WhatsApp us</a></div></div>
<header class="site-header"><div class="wrap">
  <a class="brand" href="/" aria-label="Genartml home"><img src="/assets/img/genartml-lockup-black.png" width="175" height="26" alt="Genartml"></a>
  <nav aria-label="Main"><ul class="nav">
    <li><button class="nav-link" data-dropdown="services" aria-expanded="false" aria-controls="mega-services">Services {CHEV}</button>
      <div class="mega mega-services" id="mega-services"><ul class="mega-list">{items}</ul>
        <div class="mega-aside"><span class="label">Scope and packages</span><p class="big">Every package has a written scope, a delivery date and a list of what is included.</p><p>Fixed before kickoff. No hourly billing.</p><a class="btn btn-invert btn-sm" href="/packages/">See all packages{ARROW}</a></div>
      </div></li>
    <li><button class="nav-link" data-dropdown="industries" aria-expanded="false" aria-controls="mega-industries">Industries {CHEV}</button>
      <div class="mega mega-small" id="mega-industries"><ul class="mega-list">{"".join(f'<li><a class="mega-item" href="/industries/{i["slug"]}/"><span class="code">I/0{n+1}</span><span><b>{e(i["name"])}</b><span class="d">{e(i["short"])}</span></span></a></li>' for n, i in enumerate(INDUSTRIES))}</ul><p class="mega-note">More industries are listed here as we deliver in them.</p></div></li>
    <li><a class="nav-link" href="/work/">Work</a></li>
    <li><a class="nav-link" href="/packages/">Packages</a></li>
    <li><a class="nav-link" href="/about/">About</a></li>
    <li><a class="nav-link" href="/blog/">Blog</a></li>
    <li><a class="nav-link" href="/contact/">Contact</a></li>
  </ul></nav>
  <div class="header-cta">{book_btn(cls="btn-sm btn-book", track="book_call_header")}<button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span></button></div>
</div></header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog" aria-label="Menu">
  <div class="mm-top"><a class="brand" href="/" aria-label="Genartml home"><img src="/assets/img/genartml-lockup-black.png" width="162" height="24" alt="Genartml"></a><button class="mm-close" aria-label="Close menu">{CLOSE}</button></div>
  <div class="mm-body">
    <div class="mm-group"><button aria-expanded="true" aria-controls="mm-services">Services {CHEV}</button><div class="mm-sub" id="mm-services">{mm_svc}</div></div>
    <div class="mm-group"><button aria-expanded="false" aria-controls="mm-industries">Industries {CHEV}</button><div class="mm-sub" id="mm-industries" hidden>{mm_ind}</div></div>
    <div class="mm-group"><a href="/work/">Work</a></div>
    <div class="mm-group"><a href="/packages/">Packages</a></div>
    <div class="mm-group"><a href="/about/">About</a></div>
    <div class="mm-group"><a href="/blog/">Blog</a></div>
    <div class="mm-group"><a href="/contact/">Contact</a></div>
  </div>
  <div class="mm-foot">{book_btn(cls="btn-block", track="book_call_mobile_menu")}{wa_btn(cls="btn-block")}</div>
</div>'''

def footer():
    s_links = "".join(f'<li><a href="/services/{s["slug"]}/">{e(s["name"])}</a></li>' for s in SERVICES)
    social = "".join(f'<a href="#" data-social="{k}" target="_blank" rel="noopener" aria-label="{k.title() if k!="x" else "X"}" hidden>{v}</a>' for k, v in SOC.items())
    return f'''<footer class="site-footer"><div class="wrap">
  <div class="f-top">
    <div class="f-brand"><img src="/assets/img/genartml-lockup-white.png" width="202" height="30" alt="Genartml"><p>Software and AI systems, built in Ahmedabad for clients across India and abroad. Fixed price, fixed timeline, founder reviewed.</p><div class="f-social" data-social-row hidden>{social}</div></div>
    <div class="f-cols">
      <div class="f-col"><h4>Services</h4><ul>{s_links}</ul></div>
      <div class="f-col"><h4>Company</h4><ul><li><a href="/about/">About</a></li><li><a href="/work/">Work</a></li><li><a href="/packages/">Packages</a></li><li><a href="/blog/">Blog</a></li><li><a href="/contact/">Contact</a></li></ul></div>
      <div class="f-col"><h4>Industries</h4><ul>{"".join(f'<li><a href="/industries/{i["slug"]}/">{e(i["name"])}</a></li>' for i in INDUSTRIES)}</ul><h4 style="margin-top:28px">Legal</h4><ul><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms of service</a></li></ul></div>
      <div class="f-col"><h4>Contact</h4><ul><li><a href="mailto:{EMAIL}" data-fill="email">{EMAIL}</a></li><li data-show-if="phone" hidden><a href="#" data-tel data-fill="phone"></a></li><li><a href="#" data-wa hidden>WhatsApp</a></li><li><span data-fill="officeAddress">Ahmedabad, Gujarat, India</span></li><li data-show-if="officeHours" hidden><span data-fill="officeHours"></span></li></ul></div>
    </div>
  </div>
  <div class="f-legal"><div class="reg"><span>© <span data-year>2026</span> {LEGAL_NAME}</span><span data-show-if="cin" hidden>CIN <span data-fill="cin"></span></span><span data-show-if="gst" hidden>GST <span data-fill="gst"></span></span><span>Built in Ahmedabad, India</span></div><div class="reg"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="#main">Back to top</a></div></div>
</div></footer>
<a class="wa-float" href="#" data-wa hidden aria-label="Chat with Genartml on WhatsApp" data-track="whatsapp_float">{WA}<span class="tip">Chat on WhatsApp</span></a>
<div class="cookie" role="region" aria-label="Cookie notice" hidden><p>We use cookies for anonymous analytics, only if you agree. <a href="/privacy/">Privacy policy</a></p><div class="btn-row"><button class="btn btn-ghost" data-consent="declined">Decline</button><button class="btn btn-invert" data-consent="accepted">Accept</button></div></div>'''

def cta_band(h="Tell us what you need. Fixed scope. Fixed timeline.", p="A 20-minute call, then a written proposal with a fixed price and delivery date within 48 hours."):
    return f'''<section class="band band-black cta-band"><div class="wrap reveal">
<h2 class="h1">{e(h)}</h2><p class="lead">{e(p)}</p>
<div class="btn-row">{book_btn(track="book_call_cta")}{btn("Contact us", "/contact/", "ghost")}{wa_btn()}</div></div></section>'''

def faq_block(items, code="", title="Questions, answered.", lead="", band=""):
    det = "".join(f'<details><summary>{e(q)}<span class="pm" aria-hidden="true"></span></summary><div class="ans"><p>{e(a)}</p></div></details>' for q, a in items)
    return f'''<section class="band {band}"><div class="wrap">{eyebrow(code, "Questions")}<div class="faq-wrap"><div class="faq-head reveal"><h2 class="h2">{e(title)}</h2>{f'<p class="lead" style="margin-top:20px">{e(lead)}</p>' if lead else ''}<div class="btn-row" style="margin-top:28px">{btn("Ask us directly", "/contact/", "ghost")}</div></div><div class="faq reveal d1">{det}</div></div></div></section>'''

def faq_ld(items):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}

def crumbs_ld(pairs):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i+1, "name": n, "item": SITE_URL + u} for i, (n, u) in enumerate(pairs)]}

ORG_LD = {"@context": "https://schema.org", "@type": "ProfessionalService", "@id": SITE_URL + "/#org", "name": "Genartml", "legalName": LEGAL_NAME,
          "url": SITE_URL + "/", "logo": SITE_URL + "/assets/img/icon-512.png", "image": SITE_URL + "/assets/img/og-default.png", "email": EMAIL, "foundingDate": "2024",
          "founder": {"@type": "Person", "name": "Daksh Suthar", "jobTitle": "Founder and CEO"},
          "address": {"@type": "PostalAddress", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat", "addressCountry": "IN"},
          "areaServed": ["IN", "Worldwide"],
          "description": "Genartml builds software and AI systems for businesses: AI workflows, voice AI agents, websites, custom software and care plans, at a fixed price and fixed timeline."}

# ---------------------------------------------------------------- tier card
def tier_card(s, t, source="service"):
    care = t["kind"] == "care"
    price_inr = t["inr"] + ("" if not care else "")
    per = '<small> / month</small>' if care else ""
    big = t["support"] if care else t["delivery"]
    bigsub = "First response time" if care else "Fixed delivery date, counted from kickoff"
    meta1 = ("Billing", "Monthly, 3-month minimum") if care else ("Support", f'{t["support"]} included')
    meta2 = ("Price", "Fixed, in writing")
    guarantee = "Fixed monthly fee agreed in writing. 30 days notice to stop after the minimum term." if care else "Scope, price and date written and signed before kickoff. They do not move unless you ask for a change."
    badge = f'<span class="support-badge">{e(t["support"])} first response</span>' if care else f'<span class="support-badge">{e(t["support"])} support</span>'
    lis = "".join(f'<li>{CHECK}<span>{e(i)}</span></li>' for i in t["items"])
    label = f'Request {t["name"]} proposal' if source == "pricing" else f'Select {t["name"]}'
    href = f'/contact/?service={s["slug"]}&amp;tier={t["id"]}'
    cls = "tier featured" if t["featured"] else "tier"
    return f'''<article class="{cls}"><div class="t-head"><span class="t-name">{e(t["name"])}</span>{badge}</div>
<div class="price">{e(big)}</div><div class="tax">{e(bigsub)}</div>
<div class="t-meta"><div><span>{meta1[0]}</span><b>{e(meta1[1])}</b></div><div><span>{meta2[0]}</span><b>{e(meta2[1])}</b></div></div>
<p class="guarantee">{SHIELD}<span>{e(guarantee)}</span></p>
<ul>{lis}</ul>
<a class="btn {"btn-primary" if t["featured"] else "btn-ghost"} btn-block" href="{href}" data-track="select_tier">{e(label)}{ARROW}</a></article>'''

def cur_toggle():
    return ""

# ---------------------------------------------------------------- pages
PAGES = []  # dicts: path, title, desc, main, ld, og

def add(path, title, desc, main, ld=None, noindex=False):
    PAGES.append(dict(path=path, title=title, desc=desc, main=main, ld=ld or [], noindex=noindex))

def home():
    proof = f'''<section class="proof" aria-label="Company facts"><div class="wrap">
<div class="proof-item"><span class="label">Legal entity</span><b>{LEGAL_NAME}</b></div>
<div class="proof-item"><span class="label">Established</span><b>2024</b></div>
<div class="proof-item"><span class="label">Based in</span><b>Ahmedabad, Gujarat</b></div>
<div class="proof-item" data-show-if="cin" hidden><span class="label">Registered CIN</span><b data-fill="cin"></b></div>
<div class="proof-item" data-show-if="gst" hidden><span class="label">GST</span><b data-fill="gst"></b></div>
<div class="proof-item"><span class="label">Sign-off</span><b>Founder review on every deploy</b></div>
</div></section>'''
    cards = ""
    for i, s in enumerate(SERVICES):
        cards += f'''<article class="svc-card reveal d{i%3+1}"><div class="top"><span class="code">{s["code"]}</span><span class="pill">Fixed timeline</span></div>
<div class="art">{ART[s["slug"]]}</div><h3><a class="stretched" href="/services/{s["slug"]}/">{e(s["name"])}</a></h3><p>{e(s["value"])}</p>
<div class="foot"><span class="from"><b>{e(s["days"])}</b></span><a class="link-arrow" href="/services/{s["slug"]}/">View deliverables &amp; scope {ARROW}</a></div></article>'''
    promises = [("Fixed scope, written before kickoff", "Every deliverable is listed and signed before work starts. No surprise bills, no hourly meter."),
                ("Fixed delivery date in working days", "The date is in the proposal. You see a milestone and a live test link every Friday."),
                ("You own all of it", "Code, designs and database pass to you on final payment, in accounts in your name."),
                ("Founder review", "Daksh Suthar personally inspects every deploy before it goes live.")]
    prom = "".join(f'<div class="promise reveal d{i+1}"><div class="n">0{i+1}</div><h3>{e(a)}</h3><p>{e(b)}</p></div>' for i, (a, b) in enumerate(promises))
    prods = "".join(f'''<article class="prod reveal d{i+1}"><div class="prod-shot">{evoluter_ui() if p["name"]=="Evoluter" else extuter_ui()}</div>
<div class="prod-body"><div class="row"><span class="label muted">{e(p["tag"])}</span><span class="pill"><span class="dot dot-live"></span>Live in production</span></div><h3>{e(p["name"])}</h3><p>{e(p["line"])}</p>
<div class="btn-row"><a class="btn btn-ghost" href="{p["url"]}" target="_blank" rel="noopener" data-track="visit_{p["name"].lower()}">Visit {e(p["domain"])}{EXT.replace("<svg", "<svg style=\'width:14px;height:14px\'")}</a><a class="link-arrow" href="/work/">How we built it {ARROW}</a></div></div></article>''' for i, p in enumerate(PRODUCTS))
    steps = "".join(f'<div class="step reveal d{min(i,4)}"><span class="n">0{i+1}</span><h3>{e(a)}</h3><p>{e(b)}</p>{"<div class=fridays aria-hidden=true><span>FRI</span><span>FRI</span><span>FRI</span><span class=l>FRI</span></div>" if i==3 else ""}</div>' for i, (a, b) in enumerate(STEPS_HOME))
    main = f'''
<section class="hero"><div class="corner-marks" aria-hidden="true"><span class="tick"></span><span class="tick"></span><span class="tick"></span><span class="tick"></span></div><div class="wrap">
<div class="hero-grid"><div class="hero-copy hero-in">
<span class="pill"><span class="dot"></span>AI Systems · Software · Ahmedabad</span>
<h1 class="display">We build the software and AI systems your business runs on.</h1>
<p class="lead">Fixed price. Fixed timeline. Built in Ahmedabad for clients across India and abroad.</p>
<div class="btn-row">{book_btn(track="book_call_hero")}{btn("See what we build", "#services", "ghost", arrow=False)}<a class="btn btn-text" href="#" data-wa hidden data-track="whatsapp_hero">Chat on WhatsApp {ARROW}</a></div>
</div>
<aside class="hero-side hero-in" aria-label="At a glance"><dl class="meta"><div><dt>Commercials</dt><dd>Fixed, before kickoff</dd></div><div><dt>Delivery</dt><dd>7 to 120 working days</dd></div><div><dt>Support included</dt><dd>30 to 90 days</dd></div><div><dt>Proposal</dt><dd>Within 48 hours</dd></div></dl></aside>
</div>
{hero_stage()}
</div></section>
{proof}
<section class="band" id="services"><div class="wrap">{eyebrow("01", "Services")}
<div class="sec-head reveal"><h2 class="h2">Five services. Each with a fixed scope, a date and a list of deliverables.</h2><p class="lead">Pick the one that matches the work your team does by hand today. Every package is fixed before kickoff.</p></div>
<div class="svc-grid">{cards}</div></div></section>
<section class="band band-black"><div class="wrap">{eyebrow("02", "Our promises")}
<div class="sec-head reveal"><h2 class="h2">Four promises, written into every proposal.</h2><p class="lead">Not values on a wall. Terms in the contract you sign.</p></div>
<div class="promises">{prom}</div></div></section>
<section class="band"><div class="wrap">{eyebrow("03", "Our own products")}
<div class="sec-head reveal"><h2 class="h2">We build and run our own products.</h2><p class="lead">The same team, process and standards that run Evoluter and Extuter go into every client project.</p></div>
<div class="prod-grid">{prods}</div></div></section>
<section class="band band-fill" data-show-if="caseStudies" hidden><div class="wrap">{eyebrow("04", "Client work")}<div class="sec-head"><h2 class="h2">Recent client work.</h2></div><div class="cases" data-cases="2"></div><div class="btn-row" style="margin-top:32px">{btn("See all work", "/work/", "ghost")}</div></div></section>
<section class="band band-black"><div class="wrap">{eyebrow("05", "How we work")}
<div class="sec-head reveal"><h2 class="h2">From first call to handover in five steps.</h2><p class="lead">You always know what happens next, what it costs and when it lands.</p></div>
<div class="steps">{steps}</div><div class="btn-row" style="margin-top:56px">{book_btn("Start with a free call", track="book_call_process")}</div></div></section>
{faq_block(HOME_FAQ, "06", "Questions, answered.", "Cost, timelines, ownership, data and working from outside India.")}
{cta_band()}'''
    add("/", "Genartml | Software and AI systems, fixed price, Ahmedabad",
        "Genartml builds AI workflows, voice AI agents, websites and custom software at a fixed price and fixed timeline. Built in Ahmedabad for clients across India and abroad.",
        main, [ORG_LD, {"@context": "https://schema.org", "@type": "WebSite", "name": "Genartml", "url": SITE_URL + "/"}, faq_ld(HOME_FAQ)])

def services_index():
    rows = "".join(f'''<a href="/services/{s["slug"]}/" class="reveal"><span class="code">{s["code"]}</span><b>{e(s["name"])}</b><span class="d">{e(s["short"])}</span></a>''' for s in SERVICES)
    cards = ""
    for i, s in enumerate(SERVICES):
        cards += f'''<article class="svc-card reveal d{i%3+1}"><div class="top"><span class="code">{s["code"]}</span><span class="pill">Fixed timeline</span></div><div class="art">{ART[s["slug"]]}</div><h3><a class="stretched" href="/services/{s["slug"]}/">{e(s["name"])}</a></h3><p>{e(s["value"])}</p><div class="foot"><span class="from"><b>{e(s["days"])}</b></span><a class="link-arrow" href="/services/{s["slug"]}/">View deliverables &amp; scope {ARROW}</a></div></article>'''
    main = f'''<section class="page-head"><div class="wrap"><span class="label muted">Services</span><h1 class="h1" style="margin-top:20px">Five services, each with a fixed scope.</h1><p class="lead">AI workflows, voice AI agents, websites, custom software and monthly care. Every package lists its price, delivery date, included support and exact deliverables.</p><div class="btn-row">{book_btn()}{btn("Compare all packages", "/packages/", "ghost")}</div></div></section>
<section class="band" style="padding-top:0"><div class="wrap"><div class="svc-grid">{cards}</div></div></section>{cta_band()}'''
    add("/services/", "Services | AI workflows, voice agents, websites, software | Genartml",
        "Five Genartml services with fixed scope: AI Workflows, Voice AI Agents, Websites, Software Development and Care Plans.", main,
        [crumbs_ld([("Home", "/"), ("Services", "/services/")])])

def service_page(s):
    tiers = "".join(tier_card(s, t) for t in s["tiers"])
    uses = "".join(f'<div class="use reveal d{i+1}"><span class="n">0{i+1}</span><h3>{e(a)}</h3><p>{e(b)}</p><div class="flow">{"".join(f"<span>{e(x)}</span>" for x in fl)}</div></div>' for i, (a, b, fl) in enumerate(s["uses"]))
    steps = ""
    for i, (a, b) in enumerate(SERVICE_STEPS):
        b = b or s["build_step"]
        steps += f'<div class="step reveal d{min(i,4)}"><span class="n">0{i+1}</span><h3>{e(a)}</h3><p>{e(b)}</p></div>'
    costs = "".join(f'<li><span>{e(a)}</span><span>{e(b)}</span></li>' for a, b in s["costs"])
    rel = "".join(f'<a href="/services/{o["slug"]}/"><span class="code">{o["code"]}</span><b>{e(o["name"])}</b><span class="d">{e(o["short"])}</span></a>' for o in SERVICES if o["slug"] != s["slug"])
    first, last = s["tiers"][0], s["tiers"][-1]
    care = s["slug"] == "care-plans"
    facts = (f'<div><dt>Commercials</dt><dd>{"Fixed monthly plan" if care else "Fixed, in writing"}</dd></div>'
             + (f'<div><dt>First response</dt><dd>4 working hours to 48 hours</dd></div><div><dt>Minimum term</dt><dd>3 months</dd></div>' if care else
                f'<div><dt>Delivery</dt><dd>{e(first["delivery"].split(" ")[0])} to {e(last["delivery"].replace(" working days", ""))} working days</dd></div><div><dt>Support included</dt><dd>30 to 90 days</dd></div>')
             + '<div><dt>Ownership</dt><dd>Yours on final payment</dd></div>')
    main = f'''<section class="page-head"><div class="wrap"><a class="crumb" href="/services/">{ARROW} All services</a>
<div class="ph-grid"><div><span class="label muted">{s["code"]} · {e(s["name"])}</span><h1 class="h1" style="margin-top:20px">{e(s["h1"])}</h1><p class="lead">{e(s["intro"])}</p><div class="btn-row"><a class="btn btn-primary" href="#tiers">See the packages{ARROW}</a>{book_btn("Book a free call", "ghost")}</div></div>
<div><dl class="keyfacts">{facts}</dl></div></div></div></section>
<section class="band band-fill" id="tiers"><div class="wrap">{eyebrow("01", "Scope tiers")}
<div class="sec-head reveal"><h2 class="h2">Three packages. Pick one, or start with a call.</h2><div class="lead" style="display:flex;flex-direction:column;gap:16px;align-items:flex-start"><p>Every package is fixed in writing before kickoff. Your price comes in the proposal, within 48 hours of the call.</p></div></div>
<div class="tiers">{tiers}</div></div></section>
<section class="band"><div class="wrap">{eyebrow("02", "What we build")}
<div class="sec-head reveal"><h2 class="h2">What this looks like in a real business.</h2><p class="lead">Four examples of what we can build, in plain words. Yours will be scoped to your tools and your team.</p></div>
<div class="uses">{uses}</div></div></section>
<section class="band band-black"><div class="wrap">{eyebrow("03", "How it works")}
<div class="sec-head reveal"><h2 class="h2">From discovery to go-live.</h2><p class="lead">Five steps, with a live test link every Friday so you see progress instead of hearing about it.</p></div>
<div class="steps">{steps}</div></div></section>
<section class="band"><div class="wrap">{eyebrow("04", "Running costs")}
<div class="costs reveal"><div><span class="zero">0%</span><h2 class="h3" style="margin-top:16px">Agency markup on platform costs.</h2><p class="lead" style="margin-top:16px;font-size:17px">{e(s["costs_intro"])}</p></div><div><span class="label muted" style="display:block;margin-bottom:12px">Billed at source, to your account</span><ul>{costs}</ul></div></div></div></section>
{faq_block(s["faqs"], "05", "Questions about " + s["name"] + ".", band="band-fill")}
<section class="band"><div class="wrap">{eyebrow("06", "Related services")}<div class="related">{rel}</div></div></section>
{cta_band()}'''
    ld = [{"@context": "https://schema.org", "@type": "Service", "name": s["name"], "serviceType": s["name"], "provider": {"@id": SITE_URL + "/#org"}, "areaServed": ["IN", "Worldwide"],
           "description": s["seo_desc"], "url": f'{SITE_URL}/services/{s["slug"]}/',
           "hasOfferCatalog": {"@type": "OfferCatalog", "name": s["name"] + " packages", "itemListElement": [
               {"@type": "Offer", "name": t["name"], "description": "; ".join(t["items"]), } for t in s["tiers"]]}},
          faq_ld(s["faqs"]), crumbs_ld([("Home", "/"), ("Services", "/services/"), (s["name"], f'/services/{s["slug"]}/')])]
    add(f'/services/{s["slug"]}/', s["seo_title"], s["seo_desc"], main, ld)

def pricing():
    tabs = '<button data-cat="all" aria-selected="true">All offerings</button>' + "".join(f'<button data-cat="{s["slug"]}" aria-selected="false">{e(s["name"])}</button>' for s in SERVICES)
    groups = ""
    for s in SERVICES:
        notes = {"ai-workflows": "Not included, paid by you to the provider at cost: workflow tool subscription, AI usage charges, WhatsApp Business fees and any paid software seats.",
                 "voice-ai-agents": "Calling minutes are paid to the calling platform at its own rate, or billed monthly at a fixed per-minute rate written into your proposal. Monthly agent care plans are available.",
                 "websites": "Included with every website: domain and hosting set up in your name, SSL, two rounds of design changes and the full source files on final payment.",
                 "software-development": "Included: a written specification and screen designs approved before coding, a weekly test link, deployment and transfer of code, designs and documentation.",
                 "care-plans": "Billed monthly in advance with a 3-month minimum and 30 days notice to stop. Pay for a year upfront and get two months free."}[s["slug"]]
        groups += f'''<div class="matrix-group" data-group="{s["slug"]}"><div class="mg-head"><div><span class="code">{s["code"]}</span><h2>{e(s["name"])}</h2><p>{e(s["value"])}</p></div><div><a class="link-arrow" href="/services/{s["slug"]}/">Scope, process and FAQ {ARROW}</a></div></div>
<div class="tiers">{"".join(tier_card(s, t, "pricing") for t in s["tiers"])}</div><p class="mg-note">{INFO}<span>{e(notes)}</span></p></div>'''
    addons = "".join(f'<tr><td>{e(a)}</td><td class="r">{e(d)}</td></tr>' for a, i, u, d in ADDONS)
    main = f'''<section class="page-head"><div class="wrap"><div class="ph-grid"><div><span class="label muted">Scope and packages</span><h1 class="h1" style="margin-top:20px">Fixed scope. Written before we start.</h1>
<p class="lead">Hourly billing rewards the builder for taking longer. With a fixed scope, the deliverables, the price and the delivery date are written into the proposal and signed before work begins. If something takes us longer than planned, that is our cost. If you want something new, you see its fixed price before it starts.</p>
<div class="btn-row">{book_btn("Get a fixed-price proposal", track="book_call_packages")}</div></div>
<div><dl class="keyfacts"><div><dt>Proposal</dt><dd>Within 48 hours of the call</dd></div><div><dt>Quote validity</dt><dd>30 days</dd></div><div><dt>Hourly billing</dt><dd>Never</dd></div><div><dt>Changes</dt><dd>Fixed-price change requests</dd></div></dl></div></div></div></section>
<div class="price-bar" id="matrix"><div class="wrap"><div class="tabs" role="tablist" aria-label="Filter packages" data-filter>{tabs}</div>{cur_toggle()}</div></div>
<section class="band" style="padding-top:0"><div class="wrap">{groups}</div></section>
<section class="band band-tight" data-enterprise><div class="wrap"><div class="enterprise reveal"><div><span class="label" style="color:var(--paper-55)">Custom architecture</span><h2 class="h2" style="margin-top:20px">A platform that does not fit a standard tier.</h2>
<p class="lead">Multi-team systems, several products talking to each other, or a roadmap measured in quarters. We start with a paid discovery, fix the architecture and the price for each phase, and build in fixed-price phases from there.</p>
<div class="btn-row">{book_btn("Book a 20-minute discovery call", track="book_call_enterprise")}<a class="btn btn-ghost" href="/contact/?service=not-sure&amp;source=brief" data-track="send_brief">Send project brief{ARROW}</a></div></div>
<div><dl><div><dt>Paid discovery</dt><dd>Adjusted against the build</dd></div><div><dt>Commercials</dt><dd>Fixed price per phase</dd></div><div><dt>Payment</dt><dd>50% to start, 50% on sign-off, per phase</dd></div><div><dt>Support</dt><dd>90 days included</dd></div></dl></div></div></div></section>
<section class="band"><div class="wrap">{eyebrow("A", "Add-ons")}<div class="sec-head reveal"><h2 class="h2">Extras at a fixed price.</h2><p class="lead">Add any of these to a package. Each has its own price and delivery time, so a change in scope never becomes an hourly charge.</p></div>
<div class="table-scroll reveal"><table class="addons"><thead><tr><th>Add-on</th><th class="r">Delivery</th></tr></thead><tbody>{addons}<tr><td>Rush delivery (timeline cut by up to 40%)</td><td class="r">As agreed</td></tr></tbody></table></div></div></section>
<section class="band band-fill"><div class="wrap">{eyebrow("B", "Commercial policies")}<div class="sec-head reveal"><h2 class="h2">Payment, tax and running costs, in plain words.</h2><p class="lead">The same terms go into every proposal.</p></div>
<div class="policies">
<div class="policy reveal d1"><span class="code">01 / PAYMENT</span><h3>Paid in milestones, never by the hour.</h3><ul><li>Smaller packages: 50% to start, 50% on go-live.</li><li>Larger projects: 40% to start, 40% when you sign off the test version, 20% on go-live.</li><li>Enterprise: fixed price per phase, 50% to start and 50% on sign-off.</li><li>International: 50% to start and 50% before go-live, in US dollars.</li></ul></div>
<div class="policy reveal d2"><span class="code">02 / TAXATION</span><h3>18% GST in India. 0% for clients abroad.</h3><p>Indian clients pay 18% GST: 9% CGST and 9% SGST in Gujarat, 18% IGST in other states. International clients are invoiced in US dollars with 0% Indian GST, as services exported from India are zero-rated under a Letter of Undertaking.</p></div>
<div class="policy reveal d3"><span class="code">03 / ZERO MARKUP</span><h3>Platforms bill you directly.</h3><p>Hosting, AI usage, WhatsApp and app store fees are connected to your own billing at the provider's price. Our fee never changes because your usage grows. For voice agents you can pay the calling platform directly, or we bill minutes at a fixed rate written into your proposal.</p></div>
</div></div></section>
{faq_block(PRICING_FAQ, "C", "Questions about packages and payment.")}
{cta_band()}'''
    add("/packages/", "Packages | Fixed scope, fixed timeline | Genartml",
        "Every Genartml package with its scope, delivery date, included support and deliverables. Fixed price in writing before kickoff, never hourly billing.",
        main, [faq_ld(PRICING_FAQ), crumbs_ld([("Home", "/"), ("Packages", "/packages/")])])

def work():
    prods = ""
    for i, p in enumerate(PRODUCTS):
        prods += f'''<article class="prod reveal d{i+1}"><div class="prod-shot">{evoluter_ui() if p["name"]=="Evoluter" else extuter_ui()}</div>
<div class="prod-body"><div class="row"><span class="label muted">Own product · {e(p["tag"])}</span><span class="pill"><span class="dot dot-live"></span>Live in production</span></div><h3>{e(p["name"])}</h3><p>{e(p["line"])}</p>
<dl class="facts"><div><dt>The problem</dt><dd>{e(p["problem"])}</dd></div><div><dt>Who it is for</dt><dd>{e(p["audience"])}</dd></div><div><dt>What we engineered</dt><dd>{e(p["built"])}</dd></div></dl>
<div class="btn-row"><a class="btn btn-primary" href="{p["url"]}" target="_blank" rel="noopener" data-track="visit_{p["name"].lower()}">Visit website{EXT.replace("<svg", "<svg style=\'width:14px;height:14px\'")}</a></div></div></article>'''
    main = f'''<section class="page-head"><div class="wrap"><span class="label muted">Work and products</span><h1 class="h1" style="margin-top:20px">Software and AI systems in production.</h1><p class="lead">We build and run our own education products, and we build systems for businesses. Client work is published here only after the client signs off on public disclosure.</p></div></section>
<section class="band" style="padding-top:0"><div class="wrap">{eyebrow("01", "Our own products")}<div class="prod-grid">{prods}</div></div></section>
<section class="band band-fill"><div class="wrap">{eyebrow("02", "Client case studies")}
<div class="sec-head reveal"><h2 class="h2">Client work, with the client's permission.</h2><p class="lead">Each case study shows the industry, the bottleneck, what we built, a measured outcome and a quote from the client.</p></div>
<div class="cases" data-cases data-show-if="caseStudies" hidden></div>
<div class="empty-note reveal" data-hide-if="caseStudies"><img src="/assets/img/genartml-icon-black.png" alt="" width="48" height="48"><div><h3 class="h4">Case studies are published once each client approves.</h3><p class="muted" style="margin-top:6px">We do not publish client names, numbers or quotes without written sign-off. Ask us on a call and we will walk you through relevant work under NDA.</p><div class="btn-row" style="margin-top:16px">{book_btn("Book a free call", "ghost", "btn-sm")}</div></div></div>
</div></section>{cta_band()}'''
    add("/work/", "Our work | Evoluter, Extuter and client systems | Genartml",
        "Software and AI systems in production: Evoluter for UPSC aspirants, Extuter for JEE and NEET students, and approved client case studies.", main,
        [crumbs_ld([("Home", "/"), ("Work", "/work/")])])

def about():
    principles = [("No agency buzzwords", "If a proposal needs an adjective to sound good, the scope is not clear yet. We describe what the system does, what it costs and when it lands, in the words your team uses."),
                  ("Proof over promises", "A price, a date and a working test link every Friday say more than a pitch deck. We would rather show you than tell you."),
                  ("One person answers for it", "Every project is personally inspected and signed off by founder Daksh Suthar before it goes live. That is an operating rule, not a tagline.")]
    pr = "".join(f'<div class="principle reveal d{i+1}"><span class="n">0{i+1}</span><h3>{e(a)}</h3><p>{e(b)}</p></div>' for i, (a, b) in enumerate(principles))
    main = f'''<section class="page-head"><div class="wrap"><div class="ph-grid"><div><span class="label muted">About Genartml</span><h1 class="h1" style="margin-top:20px">We build the systems businesses run on, and we answer for them personally.</h1>
<p class="lead">{LEGAL_NAME} is a software and AI studio in Ahmedabad, established in 2024. We build AI workflows, voice AI agents, websites and custom software for businesses in India and abroad, and we build and run our own education products, Evoluter and Extuter.</p></div>
<div><dl class="keyfacts"><div><dt>Established</dt><dd>2024</dd></div><div><dt>Based in</dt><dd>Ahmedabad, India</dd></div><div><dt>Model</dt><dd>Founder-led</dd></div><div><dt>Founder</dt><dd>Daksh Suthar</dd></div></dl></div></div></div></section>
<section class="band" style="padding-top:var(--s6)"><div class="wrap">{eyebrow("01", "Our story")}<div class="prose-cols reveal"><div><h2 class="h2">Fixed price, because that is how we would want to buy.</h2></div><div>
<p>Most businesses that have bought software have a story about a project that ran over: an estimate that doubled, an hourly bill nobody could check, a launch date that kept moving.</p>
<p>Genartml was set up in 2024 to work the other way. Every project has a written scope, a fixed price and a delivery date in working days before any work starts. You see a live test link every Friday. When it is done, the code, designs and data are yours.</p>
<p>We also build our own products. Running Evoluter and Extuter in production is how we stay honest about what AI can and cannot do, and it is where most of our engineering standards come from.</p></div></div></div></section>
<section class="band" id="founder"><div class="wrap">{eyebrow("02", "Founder")}<div class="founder reveal">
<div class="f-photo"><img data-founder-photo alt="Daksh Suthar, founder and CEO of Genartml" hidden><div class="f-ph-empty" data-founder-empty><img src="/assets/img/genartml-icon-white.png" alt="" width="72" height="72"><span>Daksh Suthar</span></div></div>
<div class="f-text"><span class="label muted">Founder and CEO</span><h2 class="h1" style="margin-top:16px">Daksh Suthar</h2>
<p class="lead" style="margin-top:24px">Daksh founded Genartml in 2024 to sell software the way he would want to buy it: a written scope, a fixed price and a delivery date in working days.</p>
<p class="f-body">He personally reviews and signs off every client project before it goes live, and works directly on Genartml's own products. When you book a discovery call, the scope you receive is one he stands behind.</p>
<blockquote class="f-quote" data-show-if="founderMessage" hidden><span data-fill-founder="message"></span></blockquote>
<dl class="keyfacts" style="margin-top:32px"><div><dt>Role</dt><dd>Founder and CEO</dd></div><div><dt>Founded Genartml</dt><dd>2024, Ahmedabad</dd></div><div><dt>Sign-off</dt><dd>Every project, before go-live</dd></div></dl>
<div class="btn-row" style="margin-top:32px">{book_btn("Book a call with the team")}<a class="btn btn-ghost" href="#" data-founder-linkedin hidden target="_blank" rel="noopener">LinkedIn{ARROW}</a></div></div>
</div></div></section>
<section class="band band-black"><div class="wrap">{eyebrow("03", "Engineering philosophy")}<div class="sec-head reveal"><h2 class="h2">How we work, in three rules.</h2><p class="lead">They shape every proposal, every build and every handover.</p></div><div class="principles">{pr}</div></div></section>
<section class="band"><div class="wrap">{eyebrow("04", "Official verification")}<div class="prose-cols"><div class="reveal"><h2 class="h2">Company details you can check.</h2><p class="lead" style="margin-top:20px">For procurement and vendor onboarding. Registration documents are shared on request.</p></div>
<div class="reveal d1"><div class="verify"><div class="verify-head"><span class="label">Company record</span><img src="/assets/img/genartml-lockup-white.png" alt="Genartml" width="148" height="22"></div><dl>
<div><dt>Legal entity name</dt><dd>{LEGAL_NAME}</dd></div><div><dt>Year founded</dt><dd>2024</dd></div><div><dt>Registered location</dt><dd data-fill="officeAddress">Ahmedabad, Gujarat, India</dd></div>
<div data-show-if="cin" hidden><dt>Registration (CIN)</dt><dd data-fill="cin"></dd></div><div data-show-if="gst" hidden><dt>GST number</dt><dd data-fill="gst"></dd></div>
<div><dt>Founder and CEO</dt><dd>Daksh Suthar</dd></div><div><dt>Chief Operating Officer</dt><dd>Parth Jadeja</dd></div><div><dt>Chief Technology Officer</dt><dd>Sandeep Bhagat</dd></div><div><dt>Official email</dt><dd><a href="mailto:{EMAIL}" data-fill="email">{EMAIL}</a></dd></div></dl></div></div></div></div></section>
<section class="band band-fill" data-show-if="team" hidden><div class="wrap">{eyebrow("05", "Leadership and team")}<div class="sec-head"><h2 class="h2">The people who build it.</h2></div><div class="team" data-team></div></div></section>
{cta_band()}'''
    add("/about/", f"About | {LEGAL_NAME}, Ahmedabad",
        "Genartml Private Limited is a founder-led software and AI studio in Ahmedabad, established 2024. Company details, engineering philosophy and team.", main,
        [ORG_LD, crumbs_ld([("Home", "/"), ("About", "/about/")])])

def contact():
    opts = [("", "Choose a service"), ("ai-workflows", "AI Workflows"), ("voice-ai-agents", "Voice AI"), ("websites", "Website"), ("software-development", "Custom Software"), ("care-plans", "Care Plan"), ("not-sure", "Not sure yet")]
    o = "".join(f'<option value="{v}"{" disabled" if not v else ""}{" selected" if not v else ""}>{e(l)}</option>' for v, l in opts)
    main = f'''<section class="page-head" style="padding-bottom:var(--s6)"><div class="wrap"><span class="label muted">Contact and discovery</span><h1 class="h1" style="margin-top:20px">Tell us about the work your team does by hand.</h1><p class="lead">We reply with a time for a 20-minute call. After the call you get a written proposal with a fixed price and delivery date.</p></div></section>
<section class="band" style="padding-top:0"><div class="wrap"><div class="contact-grid">
<div class="contact-left">
<div class="channels">
<a class="channel" href="mailto:{EMAIL}" data-track="email_click"><span class="ic">{MAIL}</span><span><span class="label">Email</span><b data-fill="email">{EMAIL}</b></span><span class="go">{ARROW}</span></a>
<a class="channel" href="#" data-wa hidden data-track="whatsapp_contact"><span class="ic">{WA}</span><span><span class="label">WhatsApp</span><b>Chat with the team</b></span><span class="go">{ARROW}</span></a>
<a class="channel" href="#" data-tel data-show-if="phone" hidden><span class="ic">{PHONE}</span><span><span class="label">Phone</span><b data-fill="phone"></b></span><span class="go">{ARROW}</span></a>
<div class="channel"><span class="ic">{PIN}</span><span><span class="label">Office</span><b data-fill="officeAddress">Ahmedabad, Gujarat, India</b></span><span></span></div>
<div class="channel" data-show-if="officeHours" hidden><span class="ic">{CLOCK}</span><span><span class="label">Office hours</span><b data-fill="officeHours"></b></span><span></span></div>
</div>
<div class="promise-box"><span class="label">Our promise</span><p>Written proposal and fixed timeline delivered within 48 hours.</p><ol><li>We read your brief and reply with a call time.</li><li>20-minute discovery call, free.</li><li>Fixed-scope proposal within 48 hours of the call.</li></ol></div>
</div>
<div class="contact-right"><form class="form-card" id="enquiry" novalidate action="/contact/thank-you/" method="post">
<h2>Project enquiry</h2><p>Fields marked optional can be left empty.</p>
<div class="chosen" hidden><span><span class="label">Selected package</span><b></b><br><span class="small muted meta"></span></span><button type="button">Remove</button></div>
<input type="hidden" name="package" id="f-package" value="">
<div class="fields">
<div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required><span class="err" id="e-name">Please enter your name.</span></div>
<div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><span class="err" id="e-email">Please enter a valid email address.</span></div>
<div class="field"><label for="f-phone">Phone or WhatsApp <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
<div class="field"><label for="f-company">Company name <span class="opt">(optional)</span></label><input id="f-company" name="company" type="text" autocomplete="organization"></div>
<div class="field full"><label for="f-service">Service</label><select id="f-service" name="service" required>{o}</select><span class="err">Please choose a service, or pick "Not sure yet".</span></div>
<div class="field full"><label for="f-brief">Project brief</label><textarea id="f-brief" name="brief" placeholder="Describe the current manual bottleneck. What does your team do by hand today, which tools do you use, and when do you need it live?"></textarea><span class="hint">A few lines is enough. We will ask the rest on the call.</span></div>
<label class="check"><input type="checkbox" id="f-consent" name="consent" required><span>I agree that Genartml may use these details to reply to my enquiry, as described in the <a href="/privacy/">privacy policy</a>.</span></label>
<div class="hp" aria-hidden="true"><label for="f-hp">Leave this empty</label><input id="f-hp" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
</div>
<div class="form-status" role="alert" hidden></div>
<div class="form-foot"><p>We never share your details. NDA available on request.</p><button class="btn btn-primary" type="submit">Send message {ARROW}</button></div>
</form></div>
</div></div></section>'''
    add("/contact/", "Contact | Book a free discovery call | Genartml",
        "Tell us about the manual work slowing your team down. Free 20-minute call, then a written fixed-scope proposal within 48 hours.", main,
        [{"@context": "https://schema.org", "@type": "ContactPage", "name": "Contact Genartml", "url": SITE_URL + "/contact/"}, crumbs_ld([("Home", "/"), ("Contact", "/contact/")])])

def thanks():
    main = f'''<section class="page-head band"><div class="wrap"><div class="ty" data-thanks>
<div class="ty-check">{CHECK}</div><span class="label muted">Message received</span>
<h1 class="h1" style="margin-top:16px" data-thanks-name>Thank you.</h1>
<p class="lead">We have your brief. Here is what happens next.</p><p class="small muted" data-thanks-service hidden style="margin-top:12px"></p>
<div class="timeline"><div><span>Next</span><span><b>We read your brief</b><p>Someone from the team reads it and replies with a time for the call.</p></span></div>
<div><span>Call</span><span><b>20-minute discovery call</b><p>Free, no obligation. We ask about the work, your tools and your date.</p></span></div>
<div><span>48 hours</span><span><b>Written proposal</b><p>A fixed price, a fixed delivery date and the exact list of deliverables.</p></span></div></div>
<div class="btn-row" style="margin-top:40px"><a class="btn btn-primary" href="#" data-book data-show-if="calendarUrl" hidden>Pick a call time now{ARROW}</a>{wa_btn("Chat on WhatsApp")}{btn("Read how we scope projects", "/blog/what-goes-into-a-fixed-scope-proposal/", "ghost")}<a class="btn btn-text" href="/">Back to home</a></div>
</div></div></section>'''
    add("/contact/thank-you/", "Thank you | Genartml", "Your enquiry reached Genartml. Here is what happens next.", main, noindex=True)

def blog_index():
    cats = '<button data-cat="all" aria-selected="true">All</button>' + "".join(f'<button data-cat="{e(c)}" aria-selected="false">{e(c)}</button>' for c in BLOG_CATS)
    cards = ""
    for i, a in enumerate(ARTICLES):
        feat = " feature" if i == 0 else ""
        cards += f'''<article class="post-card{feat} reveal" data-post-cat="{e(a["cat"])}"><a class="post-cover" href="/blog/{a["slug"]}/" tabindex="-1" aria-hidden="true">{post_cover_media(a)}<span class="cat"><span class="cat-pill">{e(a["cat"])}</span></span></a>
<div class="post-body"><div class="post-meta"><time datetime="{a["date"]}">{a["date_h"]}</time><span>{a["read"]} min read</span></div><h3><a href="/blog/{a["slug"]}/">{e(a["title"])}</a></h3><p>{e(a["dek"])}</p><a class="link-arrow" href="/blog/{a["slug"]}/">Read the article {ARROW}</a></div></article>'''
    main = f'''<section class="page-head"><div class="wrap"><span class="label muted">Blog</span><h1 class="h1" style="margin-top:20px">Engineering notes from building AI systems.</h1><p class="lead">Practical write-ups on voice agents, AI workflows and how we scope and ship software. Written by the team that builds it.</p></div></section>
<section class="band" style="padding-top:0"><div class="wrap"><div class="filter-row" role="tablist" aria-label="Filter by category" data-blog>{cats}</div><div class="blog-grid">{cards}</div></div></section>{cta_band()}'''
    add("/blog/", "Blog | Engineering notes on AI systems and software | Genartml",
        "Practical articles on voice AI agents, AI workflows and fixed-scope software delivery from the Genartml team.", main,
        [{"@context": "https://schema.org", "@type": "Blog", "name": "Genartml blog", "url": SITE_URL + "/blog/"}, crumbs_ld([("Home", "/"), ("Blog", "/blog/")])])

def article(a):
    toc = "".join(f'<li><a href="#{i}">{re.sub(r"<.*?>", "", t)}</a></li>' for i, t in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', a["body"]))
    url = f'{SITE_URL}/blog/{a["slug"]}/'
    rel_posts = [r for r in ARTICLES if r["slug"] != a["slug"]][:2]
    rel = "".join(f'''<article class="post-card reveal"><a class="post-cover" href="/blog/{r["slug"]}/" tabindex="-1" aria-hidden="true">{post_cover_media(r)}<span class="cat"><span class="cat-pill">{e(r["cat"])}</span></span></a><div class="post-body"><div class="post-meta"><span>{r["read"]} min read</span></div><h3><a href="/blog/{r["slug"]}/">{e(r["title"])}</a></h3><a class="link-arrow" href="/blog/{r["slug"]}/">Read the article {ARROW}</a></div></article>''' for r in rel_posts)
    cover_lead = ""
    if a.get("cover_image"):
        img_src = a["cover_image"] if a["cover_image"].startswith("http") or a["cover_image"].startswith("/") else "/" + a["cover_image"]
        cover_lead = f'<div style="margin:var(--s4) 0 var(--s6);border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);max-height:480px;background:var(--ink)"><img src="{e(img_src)}" alt="{e(a["title"])}" style="width:100%;height:100%;object-fit:cover;display:block"></div>'
    main = f'''<article><header class="article-head"><div class="wrap"><a class="crumb" href="/blog/">{ARROW} All articles</a><div><span class="cat-pill">{e(a["cat"])}</span></div>
<h1 class="h1">{e(a["title"])}</h1><p class="dek">{e(a["dek"])}</p>
<div class="byline"><div class="who"><span class="av"><img src="/assets/img/genartml-icon-white.png" alt=""></span><span><b>Team Genartml</b><span><time datetime="{a["date"]}">{a["date_h"]}</time> · {a["read"]} min read</span></span></div>
<div class="share" aria-label="Share"><a href="#" data-share="linkedin" data-url="{url}" data-title="{e(a["title"])}" target="_blank" rel="noopener">{SOC["linkedin"]}LinkedIn</a><a href="#" data-share="x" data-url="{url}" data-title="{e(a["title"])}" target="_blank" rel="noopener">{SOC["x"]}X</a><button type="button" data-copy="{url}">{LINK}<span>Copy link</span></button></div></div></div></header>
<div class="wrap">{cover_lead}<div class="article-layout"><nav class="toc" aria-label="In this article"><span class="label">In this article</span><ol>{toc}</ol></nav><div class="prose">{a["body"]}</div></div></div></article>
<section class="band" style="margin-top:var(--s7)"><div class="wrap">{eyebrow("", "Related articles")}<div class="blog-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">{rel}</div></div></section>
{cta_band("Want a system like this built for you?", "Tell us what your team does by hand today. Fixed scope, fixed price, fixed timeline.")}'''
    ld = [{"@context": "https://schema.org", "@type": "Article", "headline": a["title"], "description": a["dek"], "datePublished": a["date"], "dateModified": a["date"],
           "author": {"@type": "Organization", "name": "Team Genartml", "url": SITE_URL + "/about/"}, "publisher": {"@id": SITE_URL + "/#org"},
           "mainEntityOfPage": url, "image": SITE_URL + "/assets/img/og-default.png", "articleSection": a["cat"]},
          crumbs_ld([("Home", "/"), ("Blog", "/blog/"), (a["title"], f'/blog/{a["slug"]}/')])]
    add(f'/blog/{a["slug"]}/', a["title"] + " | Genartml", a["dek"], main, ld)

def industry(ind):
    steps = [("Lead lands", "An enquiry arrives from a property portal, your website, a WhatsApp ad or a missed call."),
             ("Instant response", "The buyer gets a WhatsApp reply in seconds, or a call back from a voice agent in English, Hindi or Hinglish."),
             ("Qualified and booked", "Budget, configuration, location and timeline are captured, and a site visit is booked on the right agent's calendar."),
             ("Team follows up", "The lead sits in your CRM with a summary. Reminders go out before the visit, and the owner sees the day's numbers each morning.")]
    fl = "".join(f'<div class="reveal d{i+1}"><span class="n">0{i+1}</span><h3>{e(a)}</h3><p>{e(b)}</p></div>' for i, (a, b) in enumerate(steps))
    fits = [("ai-workflows", "Lead triage and follow-up", "Sort every portal lead by budget, location and intent, assign it and remind the agent."),
            ("voice-ai-agents", "Callbacks and site-visit booking", "Call new enquiries back, qualify them and book the visit on the calendar."),
            ("websites", "Project and listing sites", "Project pages and landing pages where every enquiry lands on WhatsApp and in a sheet.")]
    ft = "".join(f'<a href="/services/{sl}/" class="reveal d{i+1}"><span class="code">{svc(sl)["code"]} · {e(svc(sl)["name"])}</span><b>{e(a)}</b><p>{e(b)}</p><span class="link-arrow" style="margin-top:auto">View packages {ARROW}</span></a>' for i, (sl, a, b) in enumerate(fits))
    faqs = [("Which portals and tools can you connect?", "Most property portals send leads by email, webhook or an export, and we connect whichever your account supports, along with WhatsApp Business, Google Sheets and common CRMs. We confirm each connection before the proposal."),
            ("Can the voice agent speak to buyers in Hindi?", "Yes. English, Hindi and Hinglish are included in every voice agent package, and the agent follows the language the buyer uses."),
            ("Will this work for a broker with a small team?", "Yes. A single workflow that replies to every lead and logs it is our smallest package, delivered in 7 working days."),
            ("Can calls be made to buyers who did not enquire?", "Outbound promotional calls must follow TRAI rules. Your scope names who owns each registration and which number is used.")]
    main = f'''<section class="page-head"><div class="wrap"><a class="crumb" href="/services/">{ARROW} All services</a><div class="ph-grid"><div><span class="label muted">Industries · Real estate</span><h1 class="h1" style="margin-top:20px">Answer every property lead before your competitor does.</h1>
<p class="lead">Builders, brokers and channel partners pay for every lead, then lose many of them to a slow first reply, a missed call or a site visit nobody confirmed. We build the workflows and voice agents that respond in seconds, qualify the buyer and put the visit on the right person's calendar.</p><div class="btn-row">{book_btn()}{btn("See packages", "/packages/", "ghost")}</div></div>
<div><dl class="keyfacts"><div><dt>Typical start</dt><dd>One lead workflow</dd></div><div><dt>Commercials</dt><dd>Fixed, in writing</dd></div><div><dt>Delivery</dt><dd>7 working days</dd></div><div><dt>Languages</dt><dd>English, Hindi, Hinglish</dd></div></dl></div></div></div></section>
<section class="band band-black"><div class="wrap">{eyebrow("01", "A sample workflow")}<div class="sec-head reveal"><h2 class="h2">From enquiry to site visit, in four steps.</h2><p class="lead">What a property lead looks like when nobody has to remember to call back.</p></div><div class="flowline">{fl}</div></div></section>
<section class="band"><div class="wrap">{eyebrow("02", "What fits")}<div class="sec-head reveal"><h2 class="h2">Where to start.</h2><p class="lead">Most real estate teams start with one of these, then add the next once the first is paying for itself.</p></div><div class="fit">{ft}</div></div></section>
{faq_block(faqs, "03", "Questions from real estate teams.", band="band-fill")}{cta_band()}'''
    add(f'/industries/{ind["slug"]}/', "AI lead response and voice agents for real estate | Genartml",
        "Workflows and voice agents for builders, brokers and channel partners: reply to every property lead in seconds, qualify buyers and book site visits. Fixed price, fixed timeline.",
        main, [faq_ld(faqs), crumbs_ld([("Home", "/"), ("Industries", "/industries/real-estate/"), ("Real estate", "/industries/real-estate/")])])

def legal():
    priv = f'''<section class="page-head"><div class="wrap legal"><span class="label muted">Legal</span><h1 class="h1" style="margin-top:20px">Privacy policy</h1><p class="muted" style="margin-top:16px">Last updated 19 October 2026</p>
<p style="margin-top:32px">This policy explains what personal data {LEGAL_NAME} ("Genartml", "we") collects through genartml.com and in the course of client projects, and how we use it. It is written to follow India's Digital Personal Data Protection Act, 2023.</p>
<h2>What we collect</h2><ul><li>Details you send through the contact form or by email or WhatsApp: name, work email, phone number, company and your project brief.</li><li>Anonymous usage data from Google Analytics, only if you accept cookies.</li><li>For clients, the data needed to deliver the project, under the terms of the signed proposal.</li></ul>
<h2>How we use it</h2><p>To reply to your enquiry, prepare a proposal, deliver and support the work you asked for, and send invoices. We do not sell personal data and we do not send marketing messages without your consent.</p>
<h2>Client data in AI work</h2><p>Data you share for a project is processed only to deliver that project. It is not used to train AI models without your written consent. Systems run in accounts in your name wherever possible, connections are encrypted, and access is limited to the people working on your project. A mutual NDA is available on request.</p>
<h2>Cookies and analytics</h2><p>We use analytics cookies only after you click Accept on the cookie notice. If you decline, no analytics script is loaded. You can change your choice by clearing this site's data in your browser.</p>
<h2>Third-party services</h2><p>We use trusted providers for email, form handling, hosting and analytics. Each processes data only to provide its service to us.</p>
<h2>Your rights</h2><p>You can ask to see, correct or delete the personal data we hold about you, or withdraw consent, by emailing <a href="mailto:{EMAIL}">{EMAIL}</a>. We reply within 30 days.</p>
<h2>Contact</h2><p>{LEGAL_NAME}, Ahmedabad, Gujarat, India. Email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p></div></section>'''
    add("/privacy/", "Privacy policy | Genartml", "How Genartml collects, uses and protects personal data, including client data in AI projects.", priv)
    terms = f'''<section class="page-head"><div class="wrap legal"><span class="label muted">Legal</span><h1 class="h1" style="margin-top:20px">Terms of service</h1><p class="muted" style="margin-top:16px">Last updated 19 October 2026</p>
<p style="margin-top:32px">These terms apply to services provided by {LEGAL_NAME}. The signed proposal for each project sets out its scope, price and delivery date, and takes priority over these terms where they differ.</p>
<h2>Scope and changes</h2><p>We deliver the deliverables listed in the signed proposal. Work outside that scope is quoted as a fixed-price change request and starts only after your written approval.</p>
<h2>Timelines</h2><p>Delivery dates are counted in working days (Monday to Saturday, excluding public holidays) from the day the first payment clears and your content and access are ready. If content, access or feedback is more than 5 working days late, the date moves by the same number of days.</p>
<h2>Payment</h2><p>Payment follows the milestones in the proposal. Indian clients pay 18% GST. International clients are invoiced in US dollars with no Indian GST. Work pauses after an invoice is 15 days overdue, and source code is handed over after full payment.</p>
<h2>Ownership</h2><p>Full ownership of the code, designs and content passes to you on final payment. Genartml keeps its reusable internal tools and gives you a permanent licence to use them inside the delivered system.</p>
<h2>Confidentiality</h2><p>Each side keeps the other's confidential information private. A mutual NDA is available on request at no charge.</p>
<h2>Support</h2><p>Each package includes free bug fixes for the period shown in the proposal, starting on go-live. Ongoing support is available through a Care plan.</p>
<h2>Liability</h2><p>Our total liability for any project is limited to the fees paid for that project. We are not liable for costs charged by third-party platforms or for losses caused by those platforms.</p>
<h2>Governing law</h2><p>These terms are governed by the laws of India, and the courts in Ahmedabad, Gujarat have jurisdiction.</p></div></section>'''
    add("/terms/", "Terms of service | Genartml", "Terms for Genartml services: scope, timelines, payment, ownership, confidentiality and governing law.", terms)

def notfound():
    main = f'''<section class="page-head band"><div class="wrap nf"><span class="code404">404</span><h1 class="h2" style="margin-top:24px">This page does not exist.</h1><p class="lead">It may have moved. These are the pages most people look for.</p><div class="btn-row" style="margin-top:32px">{btn("Home", "/", "primary")}{btn("Services", "/services/", "ghost")}{btn("Packages", "/packages/", "ghost")}{btn("Contact", "/contact/", "ghost")}</div></div></section>'''
    add("/404.html", "Page not found | Genartml", "The page you were looking for does not exist.", main, noindex=True)

# ---------------------------------------------------------------- render
def head(p, bundle=False):
    canon = SITE_URL + (p["path"] if p["path"] != "/404.html" else "/")
    ld = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in p["ld"])
    robots = '<meta name="robots" content="noindex">' if p["noindex"] else ""
    return f'''<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(p["title"])}</title><meta name="description" content="{e(p["desc"])}">{robots}
<link rel="canonical" href="{canon}"><meta name="theme-color" content="#0A0A0A">
<meta property="og:type" content="{"article" if p["path"].startswith("/blog/") and p["path"] != "/blog/" else "website"}"><meta property="og:site_name" content="Genartml"><meta property="og:title" content="{e(p["title"])}"><meta property="og:description" content="{e(p["desc"])}"><meta property="og:url" content="{canon}"><meta property="og:image" content="{SITE_URL}/assets/img/og-default.png"><meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(p["title"])}"><meta name="twitter:description" content="{e(p["desc"])}"><meta name="twitter:image" content="{SITE_URL}/assets/img/og-default.png">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/poppins-300-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v={ASSET_V}">
<script src="/assets/js/config.js?v={ASSET_V}"></script><script src="/assets/js/packages.js?v={ASSET_V}"></script><script src="/assets/js/site.js?v={ASSET_V}" defer></script>{ld}'''

def render(p):
    return f'''<!doctype html>
<html lang="en-IN"><head>{head(p)}</head>
<body>
{HEADER}
<main id="main">{p["main"]}</main>
{FOOTER}
</body></html>'''

def packages_js():
    data = {"services": [{"slug": s["slug"], "name": s["name"], "tiers": [{"id": t["id"], "name": t["name"], "deliveryShort": (t["delivery"] + " delivery" if t["kind"] != "care" else "Monthly plan, " + t["support"] + " first response")} for t in s["tiers"]]} for s in SERVICES]}
    return "window.GENARTML_PACKAGES = " + json.dumps(data, ensure_ascii=False) + ";\n"

def og_image(out):
    from PIL import Image, ImageDraw, ImageFont
    FD = os.path.join(HERE, "..", "fonts-ttf")
    W, Hh = 1200, 630
    im = Image.new("RGB", (W, Hh), (10, 10, 10)); d = ImageDraw.Draw(im)
    lk = Image.open(os.path.join(STATIC, "assets/img/genartml-lockup-white.png")); lk = lk.resize((int(lk.width * 44 / lk.height), 44))
    im.paste(lk, (80, 80), lk)
    f1 = ImageFont.truetype(os.path.join(FD, "poppins-300.ttf"), 64); f2 = ImageFont.truetype(os.path.join(FD, "poppins-400.ttf"), 26)
    y = 250
    for line in ["We build the software and AI", "systems your business runs on."]:
        d.text((80, y), line, font=f1, fill=(255, 255, 255)); y += 82
    d.text((80, 500), "Fixed price. Fixed timeline. Built in Ahmedabad.", font=f2, fill=(170, 170, 170))
    d.line((80, 470, 1120, 470), fill=(60, 60, 60), width=1)
    im.save(out)

def build():
    global HEADER, FOOTER
    HEADER, FOOTER = header(), footer()
    home(); services_index()
    for s in SERVICES: service_page(s)
    pricing(); work(); about(); contact(); thanks(); blog_index()
    for a in ARTICLES: article(a)
    for i in INDUSTRIES: industry(i)
    legal(); notfound()

    if os.path.exists(DIST): shutil.rmtree(DIST)
    shutil.copytree(STATIC, DIST)
    with open(os.path.join(DIST, "assets/js/packages.js"), "w") as f: f.write(packages_js())
    og_image(os.path.join(DIST, "assets/img/og-default.png"))
    for p in PAGES:
        fp = os.path.join(DIST, p["path"].lstrip("/"))
        if fp.endswith("/") or p["path"] == "/": fp = os.path.join(fp, "index.html")
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        with open(fp, "w") as f: f.write(render(p))
    urls = "".join(f'<url><loc>{SITE_URL}{p["path"]}</loc><lastmod>2026-10-19</lastmod></url>' for p in PAGES if not p["noindex"])
    with open(os.path.join(DIST, "sitemap.xml"), "w") as f: f.write(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
    with open(os.path.join(DIST, "robots.txt"), "w") as f: f.write(f"User-agent: *\nAllow: /\nDisallow: /contact/thank-you/\nSitemap: {SITE_URL}/sitemap.xml\n")
    with open(os.path.join(DIST, "site.webmanifest"), "w") as f: f.write(json.dumps({"name": "Genartml", "short_name": "Genartml", "icons": [{"src": "/assets/img/icon-512.png", "sizes": "512x512", "type": "image/png"}], "theme_color": "#0A0A0A", "background_color": "#FFFFFF", "display": "standalone"}))
    # Netlify / Cloudflare Pages headers and 404 handling
    with open(os.path.join(DIST, "_headers"), "w") as f: f.write("/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n")
    os.makedirs(os.path.join(DIST, "pricing"), exist_ok=True)
    with open(os.path.join(DIST, "pricing/index.html"), "w") as f: f.write('<!doctype html><meta charset="utf-8"><title>Packages | Genartml</title><meta name="robots" content="noindex"><link rel="canonical" href="' + SITE_URL + '/packages/"><meta http-equiv="refresh" content="0; url=/packages/"><a href="/packages/">Packages</a>')
    with open(os.path.join(DIST, "_redirects"), "w") as f: f.write("/pricing/ /packages/ 301\n/pricing /packages/ 301\n")
    build_bundle()
    print(len(PAGES), "pages")

def build_bundle():
    """Single-file preview: every page as a template, with in-memory navigation."""
    css = open(os.path.join(STATIC, "assets/css/site.css")).read()
    css = re.sub(r"@font-face\{[^}]*\}\n?", "", css)
    def data_uri(rel):
        b = open(os.path.join(DIST, rel.lstrip("/")), "rb").read()
        return "data:image/png;base64," + base64.b64encode(b).decode()
    imgs = {f"/assets/img/{n}": data_uri(f"/assets/img/{n}") for n in ["genartml-lockup-black.png", "genartml-lockup-white.png", "genartml-icon-white.png", "genartml-icon-black.png"]}
    def fix(h):
        for k, v in imgs.items(): h = h.replace(f'src="{k}"', f'src="{v}"')
        return h
    tpls = "".join(f'<template data-path="{p["path"]}" data-title="{e(p["title"])}">{fix(p["main"])}</template>' for p in PAGES)
    js_cfg = open(os.path.join(STATIC, "assets/js/config.js")).read()
    fp = os.path.join(DIST, "assets/img/team/daksh-suthar.jpg")
    if os.path.exists(fp): js_cfg = js_cfg.replace('"/assets/img/team/daksh-suthar.jpg"', '"data:image/jpeg;base64,' + base64.b64encode(open(fp, "rb").read()).decode() + '"')
    js_site = open(os.path.join(STATIC, "assets/js/site.js")).read()
    router = r'''
(function(){
  var main = document.getElementById("main");
  var tpls = {}; document.querySelectorAll("template[data-path]").forEach(function(t){ tpls[t.getAttribute("data-path")] = t; });
  var R = { path: "/", query: "", go: function(url){ render(url, true); } };
  var toast = document.getElementById("pv-toast"), tt;
  function say(m){ toast.textContent = m; toast.hidden = false; clearTimeout(tt); tt = setTimeout(function(){ toast.hidden = true; }, 2600); }
  function render(url, scrollTop){
    var u = url.split("#"), hash = u[1] || "", pq = u[0].split("?"), path = pq[0] || R.path, q = pq[1] ? "?" + pq[1] : "";
    if (!/\/$/.test(path) && !/\.html$/.test(path)) path += "/";
    if (!tpls[path]) { if (/\.pdf$/.test(url)) { say("This file opens on the live site."); return; } path = "/404.html"; }
    if (path === R.path && !q && hash) { var t0 = document.getElementById(hash); if (t0) t0.scrollIntoView({behavior:"smooth"}); return; }
    R.path = path; R.query = q;
    main.innerHTML = tpls[path].innerHTML;
    document.title = tpls[path].getAttribute("data-title");
    if (window.__closeMenus) window.__closeMenus();
    var t = hash && document.getElementById(hash);
    if (t) setTimeout(function(){ t.scrollIntoView(); }, 30); else window.scrollTo(0, 0);
    window.GENARTML.initPage(main);
    document.getElementById("pv-path").textContent = "genartml.com" + path.replace("/404.html","/not-found") + q;
  }
  document.addEventListener("click", function(e){
    var a = e.target.closest("a[href]"); if (!a) return;
    var h = a.getAttribute("href");
    if (h === "#" ) { e.preventDefault(); return; }
    if (h.charAt(0) === "#") { e.preventDefault(); var t = document.getElementById(h.slice(1)); if (t) t.scrollIntoView({behavior:"smooth"}); return; }
    if (h.charAt(0) === "/") { e.preventDefault(); render(h, true); }
    if (/^mailto:|^tel:/.test(h)) { say("Opens your email app on the live site."); }
  });
  window.GENARTML.setRouter(R);
  render("/", true);
})();'''
    pv_bar = '''<div id="pv-bar" style="position:fixed;left:50%;top:calc(8px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:120;display:none"></div>
<div id="pv-toast" hidden style="position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:130;background:#0A0A0A;color:#fff;border:1px solid rgba(255,255,255,.2);padding:10px 18px;border-radius:999px;font-size:13px"></div>'''
    preview_note = '<div style="background:#F4F4F4;border-bottom:1px solid #E6E6E6;font-size:12px;color:#545454;padding-block:6px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap"><span>Preview of <b id="pv-path" style="font-weight:500;color:#0A0A0A">genartml.com/</b></span><span>Every link and form works here. Form submissions are not sent in the preview.</span></div>'
    out = f'''<title>Genartml Website Preview</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap">
<style>{css}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:#FFFFFF}}</style>
{preview_note}
{fix(HEADER)}
<main id="main"></main>
{fix(FOOTER)}
{pv_bar}
{tpls}
<script>window.__GENARTML_BUNDLE__ = true;</script>
<script>{js_cfg}</script>
<script>{packages_js()}</script>
<script>{js_site}</script>
<script>{router}</script>'''
    with open(os.path.join(HERE, "..", "preview.html"), "w") as f: f.write(out)

if __name__ == "__main__":
    build()
