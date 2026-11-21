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

## Deploying

Build command `npm run build`, output directory `.` (the repository root). Works on Cloudflare Pages, GitHub Pages (commit the generated files) or Netlify. Commit the generated `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml` too, so that hosts without a build step still work.

## How it works (only if you must change code)

- `index.template.html` is the page shell. `build.js` fills it from `profile.js`, keeps only sections that have content, orders and renames them, and writes static, crawlable HTML (so bots and AI agents can read everything without JavaScript) plus `llms.txt`.
- `script.js` renders projects, repos, skills and the profile picker in the browser.
- `check.js` validates `profile.js`. `tests/` are unit tests; `e2e/` are Playwright browser tests run in CI.
