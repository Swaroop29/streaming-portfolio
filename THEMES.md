# Making a new design (theme)

A theme is a folder in `themes/` that turns the person's content (`profile.js`) into one web page. Content and design are separate, so a new design never changes anyone's data, and anyone's data works in every design.

**If a person asks for a look that does not exist yet ("a Prime-style one", "something like a terminal", "like an app store"), build it. Do not tell them it is unavailable.** This file is the recipe.

## 1. Understand the look
Ask for, or infer, four things: the **feel** (calm, bold, playful, serious), the **layout idea** (rows of cards, left sidebar, one column, desktop with windows, terminal, magazine, dashboard), the **colours and fonts**, and the **one interaction that makes it memorable** (a profile picker, a shelf you scroll sideways, windows you open, commands you type). Write them down in `theme.json` (`mood`, `description`).

## 2. Be inspired, never copy
Take the *idea* of a look ("dark video store with a hero banner and shelves"), not the brand. Do not use another company's logo, wordmark, name, icons, fonts that are licensed to them, screenshots, or trademarked phrases. Name the theme by what it is (`shelves`, `terminal`, `desktop`, `playlist`, `magazine`), never by the brand (`prime`, `spotify`). Say "inspired by" nowhere on the page. Use your own colours, shapes and words.

## 3. Start from a working theme
Copy `themes/editorial/` (simple, no JavaScript) or `themes/netflix/` (interactive) to `themes/<new-id>/`, then change the look. Keep these files:

- `theme.json`: `id` (same as the folder), `name`, `description` (one clear sentence or more), `mood` (list), `bestFor` (list of kinds of people), `features` (list), `files` (the extra files to publish next to `index.html`).
- `theme.js`: `module.exports = { id, files, render(data) }`. `render` returns the finished page as one HTML string.
- `style.css` (and `script.js` only if the look needs it).

`render(data)` receives the normalised profile from `core/core.js`: `site, experience, education, beyond, projects, repos, skills, extraSections, LABELS, gradient`. Use the helpers in `core`: `esc` (always escape text), `headMeta`, `jsonLd`, `textVersion`, `analyticsTags`, `fixTop`.

## 4. Rules every theme must follow (the tests enforce them)
1. **All content appears in the static HTML**, readable with JavaScript off: the name, every job, project, custom section item and the contact email. Interactivity may enhance it, never replace it.
2. **Keep the machine-readable parts:** `core.headMeta(d, …)` (share-card tags), `core.jsonLd(d)`, and the `<details id="text-version">` from `core.textVersion(...)`.
3. **Sections are optional.** A list that is empty means that section, its menu link and its tab do not exist. Honour `site.sections` (rename), `site.sectionOrder` (reorder), `extraSections` (custom sections) and `site.labels`. Fix a "Top N" title with `core.fixTop`.
4. **Never pad.** No placeholder text, no empty cards, no dropdown arrow without content.
5. **Works on every screen:** no sideways scrolling from 320 px wide up, touch targets you can hit with a thumb, text that stays readable.
6. **Accessible:** real headings in order, keyboard reachable controls, visible focus, contrast of at least 4.5:1 for body text, `alt` on images, a `lang` on `<html>`, and respect `prefers-reduced-motion` for any animation.
7. **Prints clearly:** add `@media print` rules (dark text on white, hide controls).
8. **Light:** a single-file build (`npm run single`) must stay under 1 MB. Do not load scripts or fonts from other sites unless they are optional.
9. **No tracking, no hidden requests.** Analytics only through `core.analyticsTags`.
10. **No personal data in the theme folder.** Only the design.

## 5. Prove it
```
npm run themes                     # your theme is listed with its description
PORTFOLIO_THEME=<new-id> npm run build
npm test                           # contract tests run on every theme automatically, for three different profiles
npx playwright test e2e/themes.spec.js   # phones, tablets, laptops: no errors, no sideways scroll, readable, prints
```
Look at it yourself on a narrow and a wide screen before you hand it over. Then set `site.theme: "<new-id>"` in the person's `profile.js`.

## 6. Styles worth building
The tests make it safe to add any of these, and each can be built in one sitting:

| id | Idea | Best for |
|---|---|---|
| `shelves` | A dark video-store look: a hero banner for the featured project and shelves you scroll sideways | engineers, designers, anyone who wants to stand out |
| `desktop` | An operating-system desktop: icons that open draggable windows for projects, experience and about | front-end engineers, creative technologists |
| `terminal` | A command line that answers `projects`, `experience`, `contact`, with a plain list for people who do not type | developers, security, DevOps |
| `playlist` | A music-player layout: projects as tracks, experience as albums | creatives, marketers, founders |
| `magazine` | Large type, pull quotes, long-form case studies | writers, designers, consultants |
| `dashboard` | Cards with numbers first, charts of outcomes | finance, analytics, operations |
| `ledger` | A formal, restrained page with matters, credentials and publications | legal, finance, compliance |
| `clinic` | A calm, reassuring page with credentials, specialties and patient-friendly wording | healthcare, therapy, coaching |
| `storefront` | App-store style cards with a screenshot, a one-line promise and a button | product people, mobile developers |

Whatever the look, a fancy interface needs a plain fallback: the same content as a simple readable list, so crawlers, screen readers and people in a hurry still get everything.
