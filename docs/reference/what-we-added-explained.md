# What We Added — Quick Explainer

A plain-English guide to the security and SEO features added to the Stroyka landing site.

---

## Security Features (Prompt A)

### Rate Limiting (Upstash Redis)
**What it does:** Limits how many times someone can submit the demo form — 3 requests per IP address per hour.

**Why it matters:** Without rate limiting, a bot or angry person could submit your demo form thousands of times in a minute, flooding your inbox and Telegram with fake requests. Rate limiting is like a bouncer at the door — only lets a reasonable number of people through.

**How it works:** We use Upstash Redis (a cloud key-value store) to remember each visitor's IP address and count their submissions. When they hit the limit, the API returns a "429 Too Many Requests" error instead of processing the form. Upstash has a free tier that's more than enough for a landing page.

---

### Zod Validation Schema
**What it does:** Validates every form submission on the server before processing it — checks that the name is real, the email is valid, the crew size is one of the allowed values, etc.

**Why it matters:** Client-side form validation (the `required` attribute in HTML) can be bypassed by anyone with browser dev tools or a script. Server-side validation is the real security boundary. Without it, someone could send garbage data, inject scripts, or crash your API. Zod is a TypeScript library that makes this validation type-safe and declarative — you define the "shape" of valid data once, and it rejects anything that doesn't match.

---

### Honeypot Field
**What it does:** Adds a hidden form field that real users never see (it's positioned off-screen). Bots, which auto-fill every field, will fill it in — and the server rejects any submission where this field isn't empty.

**Why it matters:** It's a simple, invisible spam filter. No CAPTCHA puzzle for your users, no friction — bots get caught, humans don't even know it's there. It's the lowest-effort anti-spam technique and works surprisingly well.

---

### Security Headers (next.config.ts)
**What they do:** These are HTTP headers sent with every page response that tell browsers how to behave:

- **X-Frame-Options: DENY** — Prevents your site from being embedded in an iframe on someone else's site (prevents "clickjacking" attacks where someone overlays invisible buttons on your page).
- **X-Content-Type-Options: nosniff** — Tells browsers not to guess the file type of resources. Prevents an attacker from tricking the browser into executing a malicious file as JavaScript.
- **Referrer-Policy** — Controls what URL info is sent when someone clicks a link away from your site. "strict-origin-when-cross-origin" means external sites only see your domain, not the full page URL.
- **Permissions-Policy** — Blocks your site from accessing camera, microphone, or geolocation. You don't need them, so disabling them prevents any injected script from using them.
- **Content-Security-Policy (CSP)** — The big one. This is a whitelist of where your page is allowed to load scripts, styles, fonts, images, and make network requests from. If someone manages to inject a script tag, the browser will refuse to run it unless it comes from an approved source. This is the single strongest defense against XSS (cross-site scripting) attacks.

---

## SEO Features (Prompt B)

### Enhanced Metadata (Title Template, Keywords, Authors, Robots)
**What it does:** Sets up proper HTML `<meta>` tags that search engines and social platforms read.

- **Title template** (`"%s | Stroyka"`) — Every page automatically gets " | Stroyka" appended. So the demo page becomes "Request a Demo | Stroyka" in search results without you writing it each time.
- **Keywords** — Tells search engines what topics your site covers. Less impactful than it used to be, but still a signal for some engines.
- **Authors/Creator** — Establishes brand attribution in search results.
- **Robots: index, follow** — Explicitly tells Google "yes, please index this site and follow all links." The default, but being explicit prevents issues.
- **OpenGraph + Twitter cards** — When someone shares your URL on LinkedIn, Twitter, Slack, iMessage, etc., these tags control the preview card (title, description, image). Without them, platforms guess — and they guess badly.

---

### JSON-LD Structured Data (SoftwareApplication Schema)
**What it does:** Adds machine-readable data to your page that tells Google exactly what Stroyka is — a software application, in the "Business" category, for iOS and Android, priced between $149–$299/month.

**Why it matters:** Google uses this to create "rich results" — those enhanced search listings with star ratings, prices, and extra info. Without structured data, Google has to guess what your product is from your page text. With it, you're speaking Google's language directly. The `SoftwareApplication` schema type is specifically designed for app listings.

---

### Sitemap (`/sitemap.xml`)
**What it does:** A file that lists every page on your site with metadata (when it was last updated, how often it changes, how important it is relative to other pages).

**Why it matters:** Search engine crawlers use this as a map of your site. Instead of hoping Google discovers all your pages by following links, you hand them a complete list. Critical for new sites that don't have many inbound links yet.

---

### Robots.txt (`/robots.txt`)
**What it does:** A file that tells search engine crawlers which parts of your site to index and which to skip.

**Why it matters:** We tell crawlers to index everything (`allow: /`) except the API routes (`disallow: /api/`). There's no reason for Google to index your API endpoints — they'd just show up as error pages in search results. It also points crawlers to your sitemap so they find it automatically.

---

## Video Note

Your hero video already has the correct attributes: `autoPlay`, `muted`, `loop`, `playsInline`. These are required for mobile autoplay to work (browsers block autoplay unless the video is muted). The video is 6.4MB MP4 which is reasonable for a hero background. For further optimization, you could convert to WebM format using ffmpeg (WebM is typically 30–50% smaller) — but that requires installing ffmpeg locally. The current setup won't hurt your Lighthouse score significantly since the video loads behind an overlay and isn't render-blocking.
