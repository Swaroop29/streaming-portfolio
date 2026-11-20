# Instructions for AI assistants

You have been given this repository so you can build a personal portfolio website for a person from their resume, LinkedIn or other material. The site is a streaming-style ("pick a profile, browse rows of cards") portfolio. **All of the person's content lives in one file: `profile.js`.** You normally edit only that file.

## What you need from the person

Ask for (or read from what they attached) any of: resume/CV, LinkedIn export or pasted profile, GitHub username, project write-ups, links (LinkedIn, GitHub, resume PDF, live demos), where the site will be hosted. If something is missing, **do not make it up**.

## Hard rules (never break these)

1. **Never invent facts.** No employers, job titles, dates, degrees, numbers, percentages, awards, links, publications or technologies that the person did not provide. If a metric is not in their material, describe the work without a number.
2. **Unknown means empty.** Use `""`, `[]` or `null`, or delete the item. Never leave sample text from "Alex Rivera" in the result.
3. **Keep titles honest.** Use the role title the person actually had. Do not inflate internships or seniority.
4. **Phone numbers are off by default** (`phones: []`) unless the person asks to show them. Same for home address: never include one.
5. **Plain text only** in `profile.js`: no HTML tags or entities. Use `·` as a separator.
6. **No personal data is sent anywhere.** Do not add trackers. `analytics.goatcounter` stays `""` unless the person gives you their own GoatCounter code.
7. Do not edit `build.js`, `script.js`, `style.css` or the tests to make a problem go away. If `npm run check` complains, fix the content.

## Steps

1. Read `profile.js` fully. It is commented and shows every field with sample data.
2. Replace the sample content with the person's real content, section by section: `site`, `experience`, `education`, `beyond`, `projects`, `repos` and the rest of the file.
   - `experience`: newest first. 1 to 5 "episodes" (achievements) per company, each with a short title, blurb, situation, bullet list and stack.
   - `projects`: 3 to 7. The first is featured. Fields `problem`, `built`, `result`, `stack`, `role` should come from what the person said.
   - `beyond`: hobbies and interests. Skip the section if the person gave none (empty array).
   - `color` values: red, blue, green, purple, gold, pink, lime, teal, indigo, orange, dark.
   - `site.url` should be the address where it will be hosted, for example `https://name.pages.dev`. If unknown, ask.
3. Run `npm install`, then:
   - `npm run build` to generate `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml`
   - `npm run check` to validate the content. **Fix every error. Read every warning** and either fix it or tell the person why it remains.
   - `npm test` to run the tests. All must pass.
   - Optional: `npm run og` (needs Chromium) to regenerate the share image `assets/og-image.png`.
4. Tell the person plainly what you filled in, what you left blank because they did not provide it, and anything you were unsure about, so they can confirm facts before publishing.

## Deploying

Build command `npm run build`, output directory `.` (the repository root). Works on Cloudflare Pages, GitHub Pages (commit the generated files) or Netlify. Commit the generated `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml` too, so that hosts without a build step still work.

## How it works (only if you must change code)

- `index.template.html` is the page shell. `build.js` fills it from `profile.js` and writes the static, crawlable HTML (experience, education, contact, plain-text version) so bots and AI agents can read everything without JavaScript.
- `script.js` renders projects, repos, skills and the profile picker in the browser.
- `check.js` validates `profile.js`. `tests/` are unit tests; `e2e/` are Playwright browser tests run in CI.
