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

## Ask once before you build (a resume is never the whole story)

A resume is trimmed to one page, so it leaves out most of what makes a portfolio good. After reading it, and before you write `profile.js`, send **one short message** asking only for what is missing. Offer these and let them skip any:

1. Anything real that the resume left out: an earlier internship or job, a side project, a hackathon, a talk, an article or video. (Their own live site or LinkedIn often has these.)
2. For their top 2 or 3 projects: the problem it solved, and one thing they would do differently. These make the project popup worth opening.
3. Interests and hobbies, if they want a "Beyond work" section.
4. Other links to show: LinkedIn, GitHub, blog, LeetCode, Instagram, YouTube, a hosted resume PDF.
5. Whether to show a phone number, and whether to mention work authorisation or visa status (off by default).

If they are not around to answer, build from the resume and the links, say what you left out, and ask again at the end. Never fill the gaps with guesses.

## Fetching the data (do this, do not skip it)

A resume is a starting point. **Collect every link and profile the person has, open each one, and use what is there.** Say at the start which file you read ("I used `Resume.pdf`, dated 18 Nov 2026") so they can correct you if it is the wrong version.

### 1. Collect the links
Read the pasted text, and for a PDF also read its hyperlinks (annotations), because words like "demo", "code" and "paper" hide the real addresses. For example: `python3 -c "import pypdf,sys; r=pypdf.PdfReader(sys.argv[1]); [print(a.get_object()['/A']['/URI']) for p in r.pages for a in (p.get('/Annots') or []) if '/A' in a.get_object() and '/URI' in a.get_object()['/A']]" resume.pdf`. Also take links the person pasted in chat.

### 2. Open every link, by type
- **LinkedIn (their own profile).** It holds more than the resume: every job, internships left off the resume, projects, skills, honors, publications, certifications and courses. Read it if you have a browser tool and the person's browser is signed in: open each page, **wait about 3 seconds for it to load**, then read the text.
  `/in/<name>/details/experience/`, `/details/education/`, `/details/projects/`, `/details/skills/`, `/details/honors/`, `/details/publications/`, `/details/certifications/`, `/details/courses/`, `/details/volunteering/`, `/details/languages/`.
  Read only. Never message, connect, post, edit or sign in for them. If it asks for a login or you have no browser, ask the person to paste the sections or export their profile, and carry on.
- **GitHub profile:** list their public repositories, for example `https://api.github.com/users/<name>/repos?per_page=100&sort=pushed` (or the repo pages). Keep real, non-fork repositories that have content. Fill `repos` with the real name, description, language, stars and URL. Language colours: JavaScript `#f1e05a`, Python `#3572A5`, Java `#b07219`, TypeScript `#3178c6`, Go `#00ADD8`, C++ `#f34b7d`, PHP `#4F5D95`, HTML `#e34c26`, CSS `#563d7c`, Shell `#89e051`. If a repository has no description, read its README and write one plain sentence from it, or skip that repository.
- **YouTube channel, videos, talks, podcasts, demos, screen recordings:** open the channel or video. Take the real title, what it covers and the date. Add each worthwhile one: as a project's `extra` link (`{ l: "Watch the demo", u: "..." }`), or as items in an `extraSections` section such as "Videos and talks" (`title`, `text`, `meta` = year, `tag` = "Talk", `link`). For a video-editor, filmmaker or creator, the channel or reel is the main content: build the page around it (a "Work" section with one card per video or edit, `labels` such as `stack: "Tools"`, `arch: "Process"`, `result: "Views or outcome"` only if real).
- **Articles and blogs** (DEV, Medium, Substack, their own site): open them; add each as a `blog` link on the matching project, or as `extraSections` items "Writing", and mention it in `site.about.facts` (use its `url`).
- **Papers and DOIs** (Zenodo, arXiv, Google Scholar, ORCID): open them for the exact title, year and co-authors. Add as `blog`/`extra` links or "Publications" items.
- **Live demos, apps, sites, Behance, Dribbble, Figma, portfolios, app-store pages:** open them. Use them to confirm names and dates and to fill project fields (`problem`, `built`, `result`, `stack`, `live`, `src`, `blog`).
- **LeetCode, Kaggle, Instagram, X, Chess.com, Stack Overflow, Medium profile and similar:** add them as `contact.links` buttons (label = the site name) when the person gave the link. Do not guess handles.
- **Anything else:** open it and decide what it is. A link you cannot classify still gets mentioned to the person.

### 3. Go one level deeper
A README, a DOI page, a blog post or a channel "About" page often links to the demo, a video, a write-up or a second paper. Follow those once, and add what they give you. Stop there; do not crawl the whole web.

### 4. When sources disagree, do not pick silently
Resume, LinkedIn and GitHub often disagree (an end date, a title, "winner" versus "presented"). Use the value the person confirms. If you cannot ask, use the **more cautious** one (the shorter span, the lower claim) and list every conflict in your final message so they can fix the source.

### 5. If a link will not open
Say so in your final message and carry on. Do not guess what was behind it. Do not scrape private pages or get around a sign-in. If the person gave only a GitHub username or portfolio link and no resume, start from those, and use only what you read.

## The hero numbers and work experience

If the person has paid work, **the first of the three `heroStats` is how long they have worked**, worked out from the dates in `experience`: for example `{ value: "9 mo", label: "SDE at Amazon" }` or `{ value: "4 yrs", label: "In industry" }`. Rules: use the exact span, never round up, and if you add an internship to a job say so in the label ("incl. internship"). Also put the employer or role in the badges. Fill the other two stats and the `recap` box with other true numbers from their material. A student or career changer with no paid work uses honest alternatives (projects shipped, years of study) instead. Never invent a number.

## Keep rows and cards flexible

- **Skills:** show what is real, 4 or more. Do not pad the row to reach a number. A title that says "Top N" is corrected automatically to the real count. With fewer than 4 skills, set `skills: []` and let the row disappear.
- **Education `details`:** fill them from the person's own facts whenever the dates line up, for example a degree whose years match a thesis, a final-year project, a poster or a hackathon win (`{ label: "Built", text: "..." }`, `{ label: "Result", text: "..." }`). Leave `details: []` only when there is genuinely nothing real to add. A stop with no details gets no dropdown arrow.
- Any list that is empty removes its section. Do not add placeholder text to fill a card.

## Choose the design (a theme)

Run `npm run themes` to list the designs in `themes/` with their mood and who they suit. Pick with the person, not for them:

1. Ask in one line what role they have and what feel they want ("bold and playful", "calm and serious", and so on).
2. Recommend the one or two themes whose `bestFor` and `mood` fit, and say why in a sentence.
3. If they want to compare, build each candidate (set `site.theme`, run `npm run build`) and show them the page, then keep their choice in `site.theme`.
4. If they have no preference, use `netflix` for engineers, designers and product people, and `editorial` for researchers, writers, lawyers, consultants and teachers. Every theme shows the same content, so switching later costs nothing.

### If the design they want does not exist
If the person asks for a look that is not in `themes/` ("a Prime-style one", "like a terminal", "an app-store look"), **build it**. Read `THEMES.md`, copy a working theme, give the new theme a descriptive id (not a brand name), and run the tests until they pass. Be inspired by the look, never copy a brand's logo, name or assets. Then show the person the result and set `site.theme`.

## Steps

1. Read `profile.js` fully. It is commented and shows every field and option with sample data.
2. Decide the sections (above), then replace the sample content with the person's real content. Remove sample sections they do not need (set the list to `[]`).
   - `experience`: newest first. 1 to 5 "episodes" (achievements) per company. `title`, `blurb`, `label`, `color`, `tag` are required. `situation`, `did` and `stack` are optional.
   - `projects`: 3 to 7 is ideal. Required: `t`, `color`, `sub`, `built`, `blurb`. The rest (`problem`, `result`, `stack`, `role`, `arch`, `diff`, `live`, `src`, `blog`) are optional.
   - `color` values: red, blue, green, purple, gold, pink, lime, teal, indigo, orange, dark.
   - `heroStats`: first stat is time at work (see "The hero numbers"). `repos`: from their GitHub link (see "Fetching the data").
   - `site.url` is the address where it will be hosted, for example `https://name.pages.dev`. If unknown, ask.
3. Run `npm install`, then:
   - `npm run build` to generate `index.html`, `llms.txt`, `robots.txt` and `sitemap.xml`
   - `npm run check` to validate the content. **Fix every error. Read every warning** and either fix it or tell the person why it remains.
   - `npm test` to run the tests. All must pass.
   - Optional: `npm run og` (needs Chromium) to regenerate the share image `assets/og-image.png`.
4. Tell the person plainly: which sections you included and why, which you left out because they had no material, what you left blank, and anything you were unsure about, so they can confirm facts before publishing.

## Final checklist (run it before you hand over)

- [ ] I said which resume file I used and its date.
- [ ] I opened every link in the resume and every link the person gave me, including LinkedIn, GitHub, YouTube, articles, papers and demos, and followed the useful ones one level deeper.
- [ ] I chose the design with the person (`npm run themes`) and set `site.theme`. If they wanted a look that did not exist, I built it from `THEMES.md` and the tests pass.
- [ ] I asked the one short question about what is missing, or said what I left out.
- [ ] Jobs, internships, projects, awards and publications from LinkedIn and GitHub that the resume omits are included when the person's own pages show them.
- [ ] Every date, title and award matches between sources, or the conflict is listed for the person.
- [ ] The first hero stat is how long they have worked, from exact dates, never rounded up.
- [ ] Sections with nothing real are empty (so they disappear). No placeholder text, no padded skill row, no education dropdown without details.
- [ ] Education details are filled from real facts whose dates line up (thesis, final-year project, poster, hackathon, society).
- [ ] Phone numbers and visa or work-authorisation text only appear if the person asked.
- [ ] `npm run build`, `npm run check` and `npm test` pass, and I read every warning.
- [ ] My final message lists: the sections included and left out, what I left blank, every conflict between sources, and links that would not open.

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
