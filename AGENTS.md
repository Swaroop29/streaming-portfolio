# Instructions for AI assistants

You have been given this repository so you can build a personal portfolio website for a person from their resume, LinkedIn or other material. The site is a streaming-style ("pick a profile, browse rows of cards") portfolio. **All of the person's content lives in one file: `profile.js`.** You normally edit only that file.

The person may be in **any job**: engineer, teacher, nurse, designer, lawyer, sales, chef, researcher, student. Build the page around what *they* have done. Do not make everyone look like a software engineer.

## What you need from the person

Ask for (or read from what they attached) any of: resume/CV, LinkedIn export or pasted profile, GitHub username, portfolio or project write-ups, links (LinkedIn, GitHub, resume PDF, live work), where the site will be hosted. If something is missing, **do not make it up**.

## Hard rules (never break these)

1. **Never invent facts.** No employers, job titles, dates, degrees, numbers, percentages, awards, links, publications or tools that the person did not provide. If a metric is not in their material, describe the work without a number.
2. **Unknown means empty.** Use `""`, `[]` or `null`, or delete the item. Never leave sample text from "Alex Rivera" in the result.
3. **Keep titles honest.** Use the role title the person actually had. Do not inflate internships or seniority.
4. **Phone numbers are off by default** (`phones: []`) unless the person asks to show them. Never include a home address.
5. **Plain text only** in `profile.js`: no HTML tags or entities. Use `·` as a separator.
6. **No trackers.** `analytics.goatcounter` stays `""` unless the person gives you their own GoatCounter code.
7. Do not edit `build.js`, `script.js`, `style.css` or the tests to make a problem go away. If `npm run check` complains, fix the content.

## Decide the sections first (this is the important part)

Every section is optional. **A list you leave empty (`[]`) removes that section and its menu link from the page.** Never leave a section on the page with nothing in it, and never pad a section with filler to make it look full.

Before writing anything, read what the person gave you and decide which sections they actually have material for:

| Section id | Built from | Show it when |
| --- | --- | --- |
| `episodes` | `experience` | They have jobs, placements or volunteering to describe |
| `projects` | `projects` | They have distinct pieces of work worth a popup: projects, case studies, campaigns, cases, studies, portfolios |
| `skills` | `skills` | They have 4 or more skills, tools or strengths worth ranking |
| `github` | `repos` | They have a GitHub account with real public repositories (engineers and data people) |
| `beyond` | `beyond` | They shared hobbies or interests |
| `about` | `site.about`, `education` | They have a bio, facts or education |
| your own | `extraSections` | They have something the standard sections do not fit (see below) |

Then adapt the page to their field:

- **Rename sections** with `site.sections`, for example `episodes: { title: "Teaching history", nav: "Career" }`, `projects: { title: "Case studies" }`, `skills: { title: "Core strengths", small: "" }`, `beyond: { title: "Outside work" }`.
- **Reorder** with `site.sectionOrder`, putting what matters most for the role first (a designer leads with case studies, a teacher with experience and courses).
- **Add sections** with `extraSections` for anything the person has that the standard ones do not hold. Examples: publications, talks, certifications, licences, courses taught, awards, exhibitions, clinical placements, campaigns, volunteering, press, testimonials, patents, languages. Each item needs a `title`; add `text`, `meta` (a short label such as a year), `tag`, `color` and a `link` only if the person provided them. Give each section a lowercase `id`.
- **Relabel the project popup and experience cards** with `site.labels` so the words fit the job. A designer: `stack: "Tools"`, `arch: "Process"`, `result: "Outcome"`, `role: "My part"`. A researcher: `stack: "Methods"`. Leave a field empty (`""`) and its label disappears.
- **Rename the "Who's watching?" profiles** with `site.profileNames` if "Engineer" does not fit (for example `engineer: "Colleague"`).
- Hide the hero numbers and the "by the numbers" box by setting `heroStats: []` and `recap: []` when there are no honest, sourced numbers. Never invent numbers to fill them.
- Leave `ticker: []` to build the opening animation from the person's own projects, skills and employers.

Examples of what to produce:

- *Software engineer:* episodes, projects, skills, github, about. The default layout.
- *Teacher:* episodes ("Teaching history"), extra sections "Courses taught" and "Publications", about. No projects, no GitHub, no skills row.
- *Designer:* projects renamed "Case studies" with labels `stack: "Tools"`, `arch: "Process"`, skills renamed "Toolkit", an extra "Clients" or "Exhibitions" section.
- *Nurse or clinician:* episodes (placements), extra sections "Certifications" and "Specialist training", about. No projects.
- *New graduate:* projects (coursework, thesis, internships), skills, education in about, short experience. No GitHub row if they have no real repositories.

## Fetching the data

- Use what the person attached or pasted. If you can browse and they gave you a public GitHub username, you may read their public repositories to fill `repos` (name, description, language, stars, URL from the actual repo pages). Use real values only, and skip forks or empty repositories.
- Do not scrape a private profile, and do not guess content from a name alone.
- If the person pasted a LinkedIn profile, use its job titles and dates exactly as written.

## Steps

1. Read `profile.js` fully. It is commented and shows every field and option with sample data.
2. Decide the sections (above), then replace the sample content with the person's real content. Remove sample sections they do not need (set the list to `[]`).
   - `experience`: newest first. 1 to 5 "episodes" (achievements) per company. `title`, `blurb`, `label`, `color`, `tag` are required. `situation`, `did` and `stack` are optional.
   - `projects`: 3 to 7 is ideal. Required: `t`, `color`, `sub`, `built`, `blurb`. The rest (`problem`, `result`, `stack`, `role`, `arch`, `diff`, `live`, `src`, `blog`) are optional.
   - `color` values: red, blue, green, purple, gold, pink, lime, teal, indigo, orange, dark.
   - `site.url` is the address where it will be hosted, for example `https://name.pages.dev`. If unknown, ask.
3. Run `npm install`, then:
   - `npm run build` to generate `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml`
   - `npm run check` to validate the content. **Fix every error. Read every warning** and either fix it or tell the person why it remains.
   - `npm test` to run the tests. All must pass.
   - Optional: `npm run og` (needs Chromium) to regenerate the share image `assets/og-image.png`.
4. Tell the person plainly: which sections you included and why, which you left out because they had no material, what you left blank, and anything you were unsure about, so they can confirm facts before publishing.

## Publishing (ask the person, then guide or do it)

When the portfolio is built and checked, **ask how they want to publish**. Offer these options and say which one you recommend. Never create accounts, enter passwords or complete a sign-in for them: give the link, say what to do, and wait until they tell you it is done.

> How would you like to publish your portfolio?
> **A. Vercel (recommended).** Easiest. Drag one file onto a web page and you get a live link in seconds. The link is temporary until you click "Claim Project" and sign in (a free account, "Sign in with Google" works). After that it is permanent.
> **B. Netlify.** The same idea: drag and drop, live link at once, free account needed to keep it.
> **C. GitHub Pages or Cloudflare Pages.** Best if you want your site tied to a code repository and updated automatically. Needs a GitHub or Cloudflare account and a few more steps.

If they have no preference, go with A.

### A. Vercel (default)
1. Run `npm run single`. It builds the site as ONE self-contained `index.html` (styles, scripts and images inside it) in `publish/`, plus `publish.zip`. Give the person that zip, and if your chat can preview an HTML file, show them the preview first so they can approve it before publishing. If you cannot hand over files, tell them exactly how to get it. (`npm run package` makes the multi-file version instead.)
2. Send them to **https://vercel.com/drop** and tell them to drag `publish.zip` (or the `publish` folder) onto the page. No Git, no commands, no build settings. A static site works without an account.
3. They get a live link at once. **Tell them clearly:** the link is temporary and shows a countdown. To keep it, click **Claim Project** and create a free Vercel account before the countdown ends. If it expires, they can sign up and drop the zip again.
4. Ask them to open the link, check the site, and send you the final address. Then set `site.url` in `profile.js` to that address, run `npm run build` and `npm run check`, run `npm run single` again, and have them drop the new zip onto their project in the Vercel dashboard so the share cards and sitemap use the real address.
5. To update the site later: edit `profile.js`, run `npm run single`, and drop the new zip onto the project in the Vercel dashboard.

### B. Netlify
Same files, but use **https://app.netlify.com/drop**. A site can go live without an account, but unclaimed sites are deleted after a short time, so they should sign up to claim it right away.

### C. GitHub Pages or Cloudflare Pages
Needs an account. Give the sign-up link, say "tell me when this is done", then continue. Build command `npm run build`, output directory `.` (the repository root). Commit the generated `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml`.

### If you can control a browser
If you have a browser tool and the person is already signed in, you may perform the drop and the claim steps in their browser after they agree. Stop and hand over for passwords, verification codes, payment details or terms they must accept themselves. If you cannot use a browser, give click-by-click instructions instead.

### If you cannot run commands
Building needs Node.js. If you cannot run commands or create files, tell the person you need an AI with a code or file tool (for example Claude with file creation, Claude Code, or Codex) to finish the build, and give them the finished `profile.js` so nothing is lost.

## Repository layout and themes

- `profile.js` is the person's content. It is the only file you normally edit.
- `core/` is shared by every design: it loads and checks the profile and writes the share-card tags, structured data, the plain-text version for crawlers, `llms.txt`, `robots.txt` and `sitemap.xml`. Do not edit it to change how the page looks.
- `themes/<id>/` is one design. Today there is `themes/netflix/` (a streaming-service look). A theme has `theme.json` (name, mood, who it suits), `theme.js` (turns the profile into a page) and its own `style.css`, `print.css` and `script.js`.
- `npm run build` renders the theme named in `site.theme` (default `netflix`) and writes `index.html` and the theme's files to the repository root. **Those root copies (`index.html`, `style.css`, `print.css`, `script.js`) are generated. Never edit them; edit the theme folder instead.**
- To use another theme, set `site.theme` in `profile.js` (for example `theme: "netflix"`). `npm run check` lists the available ones if the name is wrong. If the person has not chosen, use the default and say which design you used.
- To make a new theme, copy `themes/netflix/`, change `theme.json` and the files, and make sure `npm test` passes: every theme is tested against an engineer, a teacher and a minimal profile.

## How it works (only if you must change code)

- `build.js` loads the profile, picks the theme, and writes the page. `check.js` validates `profile.js`.
- A theme keeps only the sections that have content, in the chosen order, with their renamed headings, and writes static, crawlable HTML so bots and AI agents can read everything without JavaScript.
- `themes/netflix/script.js` renders projects, repos, skills and the profile picker in the browser.
- `core/single.js` inlines everything into one `index.html` for `npm run single`.
- `tests/` are unit tests; `e2e/` are Playwright browser tests run in CI.
