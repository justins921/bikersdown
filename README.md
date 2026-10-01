# Bikers Down — bikersdownwi.org

Static rebuild of the Bikers Down site (Scott Perzentka, Oshkosh, WI). Plain HTML/CSS/JS, no build step.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/about` | `about.html` |
| `/memorials` | `memorials.html` |
| `/contact` | `contact.html` (also accepts `?topic=Memorial` etc. to preselect the topic) |
| 404 | `404.html` |

Shared styles live in `css/site.css`; the contact form script is `js/contact.js`. The nav and footer are repeated in every page, so change all five files together.

## Run locally

```sh
npx serve .
```

`serve` honors the same clean URLs (`/about` → `about.html`) that `vercel.json` turns on.

## Deploy

Import the repo into Vercel as a static project (framework preset: Other, no build command, output directory `.`). `vercel.json` sets clean URLs and security headers. The CSP only allows scripts/styles/images from this site and form posts to formsubmit.co; loosen it if you add analytics, fonts, or embeds.

## Content source

Copy, logo, sponsor logos, the before/after photos and the site icon come from the live Webflow site (home, /about, /memorials — the only pages it has). The header photo is a CC0 replacement for the old site's Shutterstock image. See `IMAGE-CREDITS.md` for every image's source and rights. The display email was corrected from `info@bikerdownwi.org` (a domain that doesn't exist) to `info@bikersdownwi.org`.

## Contact form

Posts to FormSubmit (`https://formsubmit.co/ajax/dockperz@gmail.com`) via AJAX, with a plain POST fallback when JavaScript is off. FormSubmit sends a one-time activation email to that inbox the first time the form is used from a new domain; it must be confirmed before messages arrive.
