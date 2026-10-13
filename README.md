# KidRunComVC

Market history, technical analysis, and the occasional joke. Charts with stories.

A personal site for GitHub Pages. Plain HTML, CSS, and a little JavaScript. No build step. The pages are for reading: education and entertainment only, not investment advice.

Once GitHub Pages is enabled, the site is at [https://kidruncomvc.github.io](https://kidruncomvc.github.io).

## Preview locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080). Root-relative links (`/css/styles.css`) need a local server. Opening an HTML file directly from disk will not load the styles.

## Publish on GitHub Pages

The site is served from the root of `main`.

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Branch: **main**. Folder: **/ (root)**.
4. Save.

`.nojekyll` is in the root so Pages serves these files as they are and does not run Jekyll.

## Add a post

Posts live in [`posts/`](posts/). Start from [`posts/_template.html`](posts/_template.html).

1. Copy `posts/_template.html` to `posts/your-slug.html`. Use lowercase words and hyphens, for example `posts/south-sea-bubble-1720.html`.
2. Replace every TODO: the `<title>`, the meta description, the canonical URL, the date, the section link, the heading, and the essay.
3. Delete the HTML comment at the top of the article and the banner that says "Template only."
4. Keep the footer sentence and the `noindex` meta tag until launch (see below).
5. Add the post to the matching section index:
   - Market history: [`market-history/index.html`](market-history/index.html)
   - Technical analysis: [`technical-analysis/index.html`](technical-analysis/index.html)
6. Optional: add the same card to the preview lists on [`index.html`](index.html).

Use the card markup already on those pages:

```html
<li>
  <a class="story" href="/posts/your-slug.html">
    <span class="story-index" aria-hidden="true">03</span>
    <span class="story-body">
      <span class="story-kicker">Month year</span>
      <span class="story-title">Post title</span>
      <span class="story-deck">One sentence on what the piece is about.</span>
    </span>
  </a>
</li>
```

Bump the number (`03`, `04`, …) so the comic-panel index stays in order.

History pieces should keep the dates on and name a source when a figure could be argued with. Technical pieces should explain the tool in plain language. If you draw a chart, use inline SVG and label it illustrative in the picture and in the caption. A sketch is not market data.

## Before you want to be found

Search engines are blocked on purpose, until there is more to read.

1. On every HTML page, including `posts/_template.html` and `404.html`, remove this tag:

   ```html
   <meta name="robots" content="noindex, nofollow">
   ```

2. Replace [`robots.txt`](robots.txt) with:

   ```
   User-agent: *
   Allow: /
   ```

   Or delete `robots.txt`. A missing file allows crawling.

Do both. The meta tag and `robots.txt` are separate switches.

## House rules

- The byline is KidRunComVC. Do not put a real name or a location on the site.
- The name breaks into Kid, Run, Com, VC. That is the whole explanation, and it already lives on the About page.
- Leave the footer as it is: `© 2026 KidRunComVC. All rights reserved. Education and entertainment only, not investment advice.`
- Fonts in `assets/fonts/` are under the SIL Open Font License. The license texts sit next to the files (Fraunces, Source Serif 4, IBM Plex Mono).
