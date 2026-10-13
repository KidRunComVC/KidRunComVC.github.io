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

## Add a Road Log entry

Road Log is for short stories from the road, with the photos as proof. The section index is [`road-log/index.html`](road-log/index.html). It starts empty on purpose. Do not publish a story until you mean to.

1. Put 1 to 4 photos in [`assets/roadlog/`](assets/roadlog/). Name them for the entry, for example `assets/roadlog/night-drive-1.jpg`.
2. Copy [`posts/_roadlog-template.html`](posts/_roadlog-template.html) to `posts/your-slug.html`.
3. Replace every TODO: title, description, canonical URL, date, story, and each photo's `src`, `alt`, `width`, `height`, and caption.
4. Keep it general. Leave out real names of places and other people unless you have decided that detail belongs in the story.
5. Use at least one photo and no more than four. Delete the unused slots in the gallery. Each photo needs alt text and a caption.
6. Delete the HTML comment and the banner that says "Template only."
7. On `road-log/index.html`, add a card for the entry and remove the "First entries coming soon" line once a real entry is listed.
8. Keep the footer sentence and the `noindex` meta tag until launch.

```html
<li>
  <a class="story" href="/posts/your-slug.html">
    <span class="story-index" aria-hidden="true">01</span>
    <span class="story-body">
      <span class="story-kicker">Month year</span>
      <span class="story-title">Entry title</span>
      <span class="story-deck">One sentence on the story.</span>
    </span>
  </a>
</li>
```

## Before you want to be found

Search engines are blocked on purpose, until there is more to read.

1. On every HTML page, including `posts/_template.html`, `posts/_roadlog-template.html`, and `404.html`, remove this tag:

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
- The short bio is: Dad, runner, former national tour manager, trader.
- The name breaks into Kid, Run, Com, VC. Com is the years as a national tour manager in the comedy business. That explanation already lives on the About page.
- Leave the footer as it is: `© 2026 KidRunComVC. All rights reserved. Education and entertainment only, not investment advice.`
- Fonts in `assets/fonts/` are under the SIL Open Font License. The license texts sit next to the files (Fraunces, Source Serif 4, IBM Plex Mono).
