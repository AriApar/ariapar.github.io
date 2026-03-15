# Jekyll + Chirpy Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gatsby blog at ariapar.github.io with Jekyll + Chirpy theme, migrating 4 blog posts, adding the Pulse landing page, and deploying via GitHub Actions.

**Architecture:** Gem-based Chirpy theme (chirpy-starter approach) with GitHub Actions for deployment. Static `/pulse/` directory passed through by Jekyll. Posts in `_posts/`, tab pages in `_tabs/`.

**Tech Stack:** Jekyll, jekyll-theme-chirpy ~> 7.4, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-03-14-jekyll-chirpy-migration-design.md`

---

## Chunk 1: Scaffold and Configuration

### Task 1: Remove Gatsby files

**Files:**
- Delete: `gatsby-browser.js`, `gatsby-config.js`, `gatsby-node.js`, `gatsby-ssr.js`
- Delete: `config.js`, `postcss-config.js`
- Delete: `package.json`, `package-lock.json`, `yarn.lock`
- Delete: `Dockerfile.development`, `Dockerfile.production`, `docker-compose.development.yml`, `docker-compose.production.yml`
- Delete: `netlify.toml`, `renovate.json`, `ariapar.github.io.iml`
- Delete: `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`
- Delete directories: `src/`, `flow/`, `flow-typed/`, `jest/`, `scripts/`, `gatsby/`, `public/`, `node_modules/`
- Delete: `index.html` (Gatsby's static fallback)

Note: `content/` and `static/` are deleted in Task 4 after migrating their contents.

- [ ] **Step 1: Delete Gatsby files and directories**

```bash
cd /Users/ariaparikyan/Development/ariapar.github.io

# Files
rm -f gatsby-browser.js gatsby-config.js gatsby-node.js gatsby-ssr.js \
  config.js postcss-config.js \
  package.json package-lock.json yarn.lock \
  Dockerfile.development Dockerfile.production \
  docker-compose.development.yml docker-compose.production.yml \
  netlify.toml renovate.json ariapar.github.io.iml \
  CHANGELOG.md CODE_OF_CONDUCT.md CONTRIBUTING.md \
  index.html

# Directories
rm -rf src/ flow/ flow-typed/ jest/ scripts/ gatsby/ public/ node_modules/
```

- [ ] **Step 2: Verify only desired files remain**

```bash
ls
```

Expected: `content/`, `static/`, `pulse/`, `docs/`, `LICENSE`, `README.md` (and maybe `.git`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove all Gatsby files and dependencies"
```

---

### Task 2: Create Jekyll scaffold (Gemfile, .gitignore, _config.yml)

**Files:**
- Create: `Gemfile`
- Create: `.gitignore`
- Create: `_config.yml`

- [ ] **Step 1: Create Gemfile**

```ruby
# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.0"

group :jekyll_plugins do
  gem "jekyll-archives"
end

gem "html-proofer", "~> 5.0", group: :test

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
```

- [ ] **Step 2: Create .gitignore**

```
# Bundler cache
.bundle
vendor
Gemfile.lock

# Jekyll cache
.jekyll-cache
.jekyll-metadata
_site

# RubyGems
*.gem

# NPM dependencies
node_modules
package-lock.json

# IDE configurations
.idea
.vscode

# Misc
_sass/vendors
assets/js/dist
```

- [ ] **Step 3: Create _config.yml**

```yaml
# The Site Configuration
theme: jekyll-theme-chirpy

lang: en
timezone: Europe/London

# jekyll-seo-tag settings
title: "Everything is fine."
tagline: "On building software and other things."

description: >-
  On building software and other things. A blog by Ari.

url: "https://ariapar.github.io"

github:
  username: ariapar

twitter:
  username: hayd_ari

social:
  name: Ari
  email: isemailfine@gmail.com
  links:
    - https://twitter.com/hayd_ari
    - https://github.com/ariapar
    - https://www.linkedin.com/in/ariapar

theme_mode:

avatar:

toc: true

comments:
  provider:

paginate: 10

baseurl: ""

# ------------ Do not modify below ------------------

kramdown:
  footnote_backlink: "&#8617;&#xfe0e;"
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: highlight
    span:
      line_numbers: false
    block:
      line_numbers: true
      start_line: 1

collections:
  tabs:
    output: true
    sort_by: order

defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
      comments: true
      toc: true
      permalink: /posts/:title/
  - scope:
      path: _drafts
    values:
      comments: false
  - scope:
      path: ""
      type: tabs
    values:
      layout: page
      permalink: /:title/

sass:
  style: compressed

compress_html:
  clippings: all
  comments: all
  endings: all
  profile: false
  blanklines: false
  ignore:
    envs: [development]

exclude:
  - "*.gem"
  - "*.gemspec"
  - docs
  - tools
  - README.md
  - LICENSE
  - purgecss.js
  - "*.config.js"
  - "package*.json"

jekyll-archives:
  enabled: [categories, tags]
  layouts:
    category: category
    tag: tag
  permalinks:
    tag: /tags/:name/
    category: /categories/:name/
```

- [ ] **Step 4: Run bundle install to verify Gemfile works**

```bash
bundle install
```

Expected: Successful install, `Gemfile.lock` generated (gitignored).

- [ ] **Step 5: Commit**

```bash
git add Gemfile .gitignore _config.yml
git commit -m "feat: add Jekyll + Chirpy scaffold"
```

---

### Task 3: Create tab pages and GitHub Actions workflow

**Files:**
- Create: `_tabs/about.md`
- Create: `_tabs/archives.md`
- Create: `_tabs/categories.md`
- Create: `_tabs/tags.md`
- Create: `.github/workflows/pages-deploy.yml`

- [ ] **Step 1: Create _tabs/about.md**

```markdown
---
layout: page
icon: fas fa-circle-info
order: 4
---

Hi! I'm Ari — engineer, builder, and occasional writer. I spend my days building products and my evenings building apps like [Pulse](https://pulsehabit.app/).

Get in touch at [isemailfine@gmail.com](mailto:isemailfine@gmail.com).
```

- [ ] **Step 2: Create _tabs/archives.md**

```markdown
---
layout: archives
icon: fas fa-archive
order: 3
---
```

- [ ] **Step 3: Create _tabs/categories.md**

```markdown
---
layout: categories
icon: fas fa-stream
order: 1
---
```

- [ ] **Step 4: Create _tabs/tags.md**

```markdown
---
layout: tags
icon: fas fa-tags
order: 2
---
```

- [ ] **Step 5: Create .github/workflows/pages-deploy.yml**

```yaml
name: "Build and Deploy"
on:
  push:
    branches:
      - main
      - master
    paths-ignore:
      - .gitignore
      - README.md
      - LICENSE

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.3
          bundler-cache: true

      - name: Build site
        run: bundle exec jekyll b -d "_site${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: "production"

      - name: Test site
        run: |
          bundle exec htmlproofer _site \
            \-\-disable-external \
            \-\-ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"

      - name: Upload site artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "_site${{ steps.pages.outputs.base_path }}"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 6: Commit**

```bash
git add _tabs/ .github/
git commit -m "feat: add Chirpy tab pages and GitHub Actions deploy workflow"
```

---

## Chunk 2: Content Migration

### Task 4: Migrate post images

**Files:**
- Create: `assets/img/posts/` directory
- Copy from `static/media/`: `ravioli.jpg`, `spaghetti.jpg`, `strangler.jpg`, `squad-health-check-model-overview.png`, `happy-faces.jpg`, `moran-8cMPxOqkLE8-unsplash.jpg`
- Delete: `static/` directory (after copying)
- Delete: `content/` directory (posts migrated in Task 5)

Images needed by posts:
- `2019-03-27` Autonomous Teams: `ravioli.jpg`, `spaghetti.jpg`
- `2019-08-30` Microservices: `strangler.jpg`
- `2019-11-26` Healthcheck: `squad-health-check-model-overview.png`, `happy-faces.jpg`
- `2020-07-26` Information Fraud: `moran-8cMPxOqkLE8-unsplash.jpg`

- [ ] **Step 1: Create image directory and copy post images**

```bash
mkdir -p assets/img/posts
cp static/media/ravioli.jpg \
   static/media/spaghetti.jpg \
   static/media/strangler.jpg \
   static/media/squad-health-check-model-overview.png \
   static/media/happy-faces.jpg \
   static/media/moran-8cMPxOqkLE8-unsplash.jpg \
   assets/img/posts/
```

- [ ] **Step 2: Delete old content and static directories**

```bash
rm -rf content/ static/
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: migrate post images to assets/img/posts and remove old directories"
```

---

### Task 5: Migrate blog posts

**Files:**
- Create: `_posts/2019-03-27-autonomous-teams-part-1.md`
- Create: `_posts/2019-08-30-learnings-from-migrating-legacy-to-microservices.md`
- Create: `_posts/2019-11-26-learnings-from-running-spotify-healthcheck-retros.md`
- Create: `_posts/2020-07-26-information-fraud-why-paying-for-twitter-makes-sense.md`

For each post:
1. Convert frontmatter (remove `template`, `slug`, `draft`, `socialImage`; add `layout`, reformat `date`, convert `category`→`categories`, add `image`)
2. Replace all `/media/` paths with `/assets/img/posts/` in body (both markdown images and `<img>` tags)

- [ ] **Step 1: Create _posts directory**

```bash
mkdir -p _posts
```

- [ ] **Step 2: Create _posts/2019-03-27-autonomous-teams-part-1.md**

Frontmatter:
```yaml
---
layout: post
title: "Autonomous Teams, Part 1: Do They Scale?"
date: 2019-03-27 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering, agile]
description: "Verdict: They're initially fine, but they won't scale fine if you're not careful."
image: /assets/img/posts/ravioli.jpg
---
```

Body: Copy from original, replacing all `/media/` with `/assets/img/posts/`.

Paths to update:
- `src="/media/ravioli.jpg"` → `src="/assets/img/posts/ravioli.jpg"`
- `src="/media/spaghetti.jpg"` → `src="/assets/img/posts/spaghetti.jpg"`

- [ ] **Step 3: Create _posts/2019-08-30-learnings-from-migrating-legacy-to-microservices.md**

Frontmatter:
```yaml
---
layout: post
title: "Learnings from Migrating Legacy to Microservices"
date: 2019-08-30 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering]
description: "Distilling the last 2 years into one post."
image: /assets/img/posts/strangler.jpg
---
```

Body: Copy from original, replacing:
- `![](/media/strangler.jpg)` → `![](/assets/img/posts/strangler.jpg)`

- [ ] **Step 4: Create _posts/2019-11-26-learnings-from-running-spotify-healthcheck-retros.md**

Frontmatter:
```yaml
---
layout: post
title: "Learnings from Running Spotify Healthcheck Retros"
date: 2019-11-26 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering]
description: "A better way to do retrospectives."
image: /assets/img/posts/squad-health-check-model-overview.png
---
```

Body: Copy from original, replacing:
- `src="/media/squad-health-check-model-overview.png"` → `src="/assets/img/posts/squad-health-check-model-overview.png"`
- `src="/media/happy-faces.jpg"` → `src="/assets/img/posts/happy-faces.jpg"`

Note: The external image `https://miro.medium.com/proxy/0*2GDBl_Q1FdR93maj` is left as-is (external URL, may break but nothing we can do).

- [ ] **Step 5: Create _posts/2020-07-26-information-fraud-why-paying-for-twitter-makes-sense.md**

Frontmatter:
```yaml
---
layout: post
title: "Information Fraud: Why Paying for Twitter Makes Sense"
date: 2020-07-26 14:56:00 +0000
categories: [Product]
tags: [opinion, product]
description: "A subscription model for Twitter would make sense, and I would pay for it. In fact, if well-executed, it would solve the ad-revenue driven misinformation problem. Here's why."
image: /assets/img/posts/moran-8cMPxOqkLE8-unsplash.jpg
---
```

Body: Copy from original, replacing:
- `src="/media/moran-8cMPxOqkLE8-unsplash.jpg"` → `src="/assets/img/posts/moran-8cMPxOqkLE8-unsplash.jpg"`

- [ ] **Step 6: Commit**

```bash
git add _posts/
git commit -m "feat: migrate 4 blog posts with Chirpy frontmatter and updated image paths"
```

---

## Chunk 3: Verify and Finalize

### Task 6: Local build verification

- [ ] **Step 1: Run Jekyll build**

```bash
bundle exec jekyll build
```

Expected: Successful build with no errors. Output in `_site/`.

- [ ] **Step 2: Verify built output contains expected pages**

```bash
ls _site/posts/
ls _site/pulse/
ls _site/about/
ls _site/categories/
ls _site/tags/
ls _site/archives/
```

Expected: Each directory exists and contains `index.html`.

- [ ] **Step 3: Run local server and visually check**

```bash
bundle exec jekyll serve
```

Open `http://localhost:4000` and verify:
- Home page shows 4 posts
- Each post renders with images
- About page shows bio
- `/pulse/` shows the Pulse landing page
- Categories, tags, archives pages work

- [ ] **Step 4: Stop server (Ctrl+C) and commit any fixes if needed**

---

### Task 7: Final cleanup and summary commit

- [ ] **Step 1: Verify no stray files remain**

```bash
git status
```

Expected: Clean working tree (or only `Gemfile.lock` which is gitignored).

- [ ] **Step 2: Verify pulse/ directory is intact**

```bash
ls pulse/
```

Expected: All Pulse landing page files present.

- [ ] **Step 3: Final commit if any adjustments were made**

---

## Post-Implementation: Deployment

After merging `jekyll` branch to `master`:

1. Go to GitHub repo Settings → Pages
2. Under "Build and deployment", change Source from "Deploy from a branch" to "GitHub Actions"
3. Push to `master` — the workflow will build and deploy automatically
