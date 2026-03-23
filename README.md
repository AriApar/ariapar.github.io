# ariapar.me

Personal blog and app pages. Built with [Jekyll](https://jekyllrb.com/) and the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) theme, deployed via GitHub Pages.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000

## Writing posts

Add a markdown file to `_posts/` with the format `YYYY-MM-DD-title.md`. Use `_drafts/` for unpublished posts (preview with `bundle exec jekyll serve --drafts`).

## Structure

- `_posts/` — Blog posts
- `_drafts/` — Unpublished drafts
- `_tabs/` — Sidebar pages (about, archives, categories, tags)
- `pulse/` — Pulse app landing page
- `assets/img/` — Images
