# Jekyll + Chirpy Migration Design

## Goal

Replace the outdated Gatsby blog at ariapar.github.io with a Jekyll site using the Chirpy theme. The new site must support blogging, hosting static app pages (starting with Pulse), and deploying via GitHub Pages.

## Site Configuration

- **Title:** Everything is fine.
- **Tagline:** On building software and other things.
- **Author:** Ari
- **Email:** isemailfine@gmail.com
- **Social links:** GitHub (ariapar), LinkedIn (ariapar), Twitter (hayd_ari)
- **Base URL:** https://ariapar.github.io
- **Theme:** jekyll-theme-chirpy (via gem)

## Structure

```
/
├── _config.yml              # Jekyll + Chirpy config
├── _posts/                  # Blog posts in Chirpy-compatible format
│   ├── 2019-03-27-autonomous-teams-part-1.md
│   ├── 2019-08-30-learnings-from-migrating-legacy-to-microservices.md
│   ├── 2019-11-26-learnings-from-running-spotify-healthcheck-retros.md
│   └── 2020-07-26-information-fraud-why-paying-for-twitter-makes-sense.md
├── _tabs/
│   ├── about.md             # About page
│   ├── archives.md          # Archives page
│   ├── categories.md        # Categories page
│   └── tags.md              # Tags page
├── assets/img/posts/        # Post images (migrated from static/media/)
├── pulse/                   # Static Pulse landing page (passed through as-is)
│   ├── index.html
│   ├── privacy.html
│   ├── contact.html
│   ├── loop-alternative.html
│   └── (images, icons)
├── .github/workflows/
│   └── pages-deploy.yml     # GitHub Actions workflow for Chirpy build
├── Gemfile                  # Ruby dependencies
├── Gemfile.lock
└── .gitignore
```

## Blog Post Migration

4 posts migrated (the Typography draft is dropped as it was Gatsby starter content).

Frontmatter conversion from Gatsby to Chirpy format:

```yaml
# Gatsby format
---
template: post
title: "Post Title"
slug: "post-slug"
draft: false
date: "2019-03-27T18:40:32.169Z"
category: "Software Engineering"
tags:
  - "Software Engineering"
socialImage: "/media/image.jpg"
description: "Description"
---

# Chirpy format
---
layout: post
title: "Post Title"
date: 2019-03-27 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering]
description: "Description"
image: /assets/img/posts/image.jpg
---
```

Image paths in post body updated from `/media/filename` to `/assets/img/posts/filename`. This applies to both markdown image syntax (`![](...)`) and inline HTML `<figure><img src="...">` tags used in several posts.

## About Page

Uses Chirpy's tab layout with required frontmatter:

```yaml
---
layout: page
icon: fas fa-circle-info
order: 4
---
```

Body:

> Hi! I'm Ari — engineer, builder, and occasional writer. I spend my days building products and my evenings building apps like [Pulse](https://pulsehabit.app/).
>
> Get in touch at [isemailfine@gmail.com](mailto:isemailfine@gmail.com).

## Pulse Landing Page

The static HTML/CSS/JS landing page at `/pulse/` is served as-is. Jekyll does not process plain HTML files in root directories unless they contain frontmatter. All asset references in the Pulse files use relative paths, so they work correctly under `/pulse/`.

## Files Removed

All Gatsby-era files are deleted:

- `gatsby-*.js`, `config.js`, `postcss-config.js`
- `src/`, `flow/`, `flow-typed/`, `jest/`, `scripts/`, `gatsby/`
- `node_modules/`, `package.json`, `package-lock.json`, `yarn.lock`
- `Dockerfile.*`, `docker-compose.*`
- `netlify.toml`, `renovate.json`
- `content/` directory (posts migrated to `_posts/`, about page to `_tabs/`)
- `static/` directory (images migrated to `assets/img/posts/`)
- `public/`, `*.iml`
- `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`

Preserved: `LICENSE`, `README.md`, git history.

## Deployment

Chirpy uses plugins (`jekyll-archives`) that are not on the GitHub Pages whitelist, so a GitHub Actions workflow is required. The workflow (`.github/workflows/pages-deploy.yml`) builds the Jekyll site and deploys the output. GitHub Pages repository settings must be set to deploy from "GitHub Actions" (not "Deploy from branch").

The site will be built and deployed from the `master` branch (the repo's main branch). Work is done on the `jekyll` branch and merged to `master` when ready.

## Gemfile

Minimum required gems:

```ruby
source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.0"

group :jekyll_plugins do
  gem "jekyll-archives"
end
```

## Out of Scope

- Custom domain setup (currently uses ariapar.github.io)
- Analytics (old UA- ID is deprecated; can add later)
- Comments system
- Additional app pages beyond Pulse
