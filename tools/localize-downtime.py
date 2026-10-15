#!/usr/bin/env python3
"""Regenerate German pages from English HTML and _data/downtime/de.json.

Run after changing English copy or translations. Missing visible copy fails
generation rather than silently publishing a partly translated page.
Uses only Python's standard library.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlunsplit
import hashlib
import html
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "downtime"
BASE = "https://ariapar.me/downtime/"
ROUTES = {
    "index.html": "index.html",
    "faq.html": "faq.html",
    "contact.html": "kontakt.html",
    "privacy.html": "datenschutz.html",
    "block-instagram-on-iphone.html": "instagram-auf-iphone-blockieren.html",
    "block-tiktok-on-iphone.html": "tiktok-auf-iphone-blockieren.html",
    "block-youtube-on-iphone.html": "youtube-auf-iphone-blockieren.html",
    "block-reddit-on-iphone.html": "reddit-auf-iphone-blockieren.html",
    "website-blocker-iphone.html": "websites-auf-iphone-blockieren.html",
}
TRANSLATIONS = json.loads((ROOT / "_data/downtime/de.json").read_text())
UNCHANGED = {"Downtime", "Pro", "FAQ", "App Store", "isemailfine@gmail.com", "↓", "—", "."}
MISSING = set()
SCREENSHOTS = {"blocking.webp", "selection.webp", "essentials.webp", "strict.webp", "shield.webp"}


def translated(value):
    key = value.strip()
    if not key or key in UNCHANGED or key.isdigit():
        return value
    if key not in TRANSLATIONS:
        MISSING.add(key)
        return value
    return value[:len(value) - len(value.lstrip())] + TRANSLATIONS[key] + value[len(value.rstrip()):]


def locale_url(file, german=False):
    name = ROUTES[file] if german else file
    return BASE + ("de/" if german else "") + ("" if name == "index.html" else name)


def alternates(file):
    en, de = locale_url(file), locale_url(file, True)
    return (f'  <!-- Language alternates -->\n'
            f'  <link rel="alternate" hreflang="en" href="{en}">\n'
            f'  <link rel="alternate" hreflang="de" href="{de}">\n'
            f'  <link rel="alternate" hreflang="x-default" href="{en}">\n'
            f'  <!-- /Language alternates -->\n')


def switch(file, german=False):
    target = ("../" if file == "index.html" else "../" + file) if german else ("de/" if file == "index.html" else "de/" + ROUTES[file])
    lang, label, title = ("en", "English", "Read this page in English") if german else ("de", "Deutsch", "Diese Seite auf Deutsch lesen")
    return f'<a class="language-switch" href="{target}?lang={lang}" lang="{lang}" hreflang="{lang}" aria-label="{title}">{label}</a>'


def add_switches(source, file, german=False):
    source = re.sub(r'\s*<a class="language-switch"[^>]*>.*?</a>', '', source)
    link = switch(file, german)
    source = source.replace('      </div>\n      <div class="nav-actions">', f'        {link}\n      </div>\n      <div class="nav-actions">', 1)
    source = source.replace('          </div>\n        </details>', f'            {link}\n          </div>\n        </details>', 1)
    source = source.replace('      </nav>\n    </div>\n  </footer>', f'        {link}\n      </nav>\n    </div>\n  </footer>')
    return source


def localize_url(value):
    if value.startswith(BASE):
        tail = value[len(BASE):]
        if tail.startswith("assets/"):
            return value.replace("/assets/social-card.png", "/assets/de/social-card.png")
        if tail in ("", "index.html"):
            return BASE + "de/"
        if tail in ROUTES:
            return BASE + "de/" + ROUTES[tail]
        return value
    if value.startswith("assets/"):
        name = value[7:]
        return "../assets/" + ("de/" if name in SCREENSHOTS else "") + name
    if value.startswith(("styles.css", "site.js")):
        return "../" + value
    if value.startswith("https://apps.apple.com/us/"):
        return value.replace("/us/", "/de/", 1)
    if value.startswith("https://toolbox.marketingtools.apple.com/"):
        return value.replace("/black/en-us?", "/black/de-de?")
    url = urlsplit(value)
    if not url.scheme and url.path in ROUTES:
        return urlunsplit((url.scheme, url.netloc, ROUTES[url.path], url.query, url.fragment))
    return value


def translate_schema(value):
    if isinstance(value, dict):
        return {k: translate_schema(v) for k, v in value.items()}
    if isinstance(value, list):
        return [translate_schema(v) for v in value]
    if isinstance(value, str):
        return TRANSLATIONS.get(value, localize_url(value))
    return value


class GermanPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.script = False
        self.schema = False

    def handle_decl(self, declaration):
        self.parts.append(f"<!{declaration}>")

    def handle_comment(self, comment):
        self.parts.append(f"<!--{comment}-->")

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "script":
            self.script = True
            self.schema = values.get("type") == "application/ld+json"
        result = []
        for key, value in attrs:
            if value is not None:
                if key == "lang" and tag == "html":
                    value = "de"
                elif key in ("href", "src"):
                    value = localize_url(value)
                elif key in ("alt", "aria-label") and value:
                    value = translated(value)
                elif tag == "meta" and key == "content":
                    field = values.get("name", values.get("property", ""))
                    if field in ("description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"):
                        value = translated(value)
                    elif field in ("og:url", "og:image", "twitter:image"):
                        value = localize_url(value)
                result.append(f'{key}="{html.escape(value, quote=True)}"')
            else:
                result.append(key)
        self.parts.append("<" + tag + (" " + " ".join(result) if result else "") + ">")

    def handle_endtag(self, tag):
        self.parts.append(f"</{tag}>")
        if tag == "script":
            self.script = False
            self.schema = False

    def handle_data(self, data):
        if self.schema:
            value = translate_schema(json.loads(data))
            value["inLanguage"] = "de"
            self.parts.append("\n" + json.dumps(value, ensure_ascii=False, indent=2) + "\n  ")
        elif self.script:
            self.parts.append(data)
        else:
            self.parts.append(html.escape(translated(data), quote=False))


def main():
    script_version = hashlib.sha256((SITE / "site.js").read_bytes()).hexdigest()[:10]
    css_version = hashlib.sha256((SITE / "styles.css").read_bytes()).hexdigest()[:10]
    output = {}
    for file, destination in ROUTES.items():
        source = (SITE / file).read_text()
        source = re.sub(r'  <!-- Language alternates -->.*?  <!-- /Language alternates -->\n', '', source, flags=re.S)
        source = re.sub(r'\s*<a class="language-switch"[^>]*>.*?</a>', '', source)
        source = re.sub(r'href="styles\.css(?:\?v=[^"]*)?"', f'href="styles.css?v={css_version}"', source)
        source = re.sub(r'src="site\.js(?:\?v=[^"]*)?"', f'src="site.js?v={script_version}"', source)
        parser = GermanPage()
        parser.feed(source)
        german = "".join(parser.parts).replace('</head>', alternates(file) + '</head>')
        german = german.replace('</head>', '  <meta property="og:locale" content="de_DE">\n</head>')
        output[SITE / "de" / destination] = add_switches(german, file, True)
        english = source.replace('</head>', alternates(file) + '</head>')
        output[SITE / file] = add_switches(english, file)
    if MISSING:
        raise SystemExit("Missing German translations:\n" + "\n".join(sorted(MISSING)))
    for path, value in output.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value)
    # Include only canonical URLs, never campaign query strings.
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for file in ROUTES:
        for german in (False, True):
            lines += ['  <url>', f'    <loc>{locale_url(file, german)}</loc>']
            for lang, url in (("en", locale_url(file)), ("de", locale_url(file, True)), ("x-default", locale_url(file))):
                lines.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{url}"/>')
            lines.append('  </url>')
    lines.append('</urlset>')
    (SITE / 'sitemap.xml').write_text('\n'.join(lines) + '\n')
    print(f"Generated {len(ROUTES)} German pages, reciprocal language links, and sitemap entries.")


if __name__ == "__main__":
    main()
