# streaming-portfolio

A streaming-style personal portfolio: visitors pick a profile ("Recruiter", "Hiring manager", "Engineer", "Just browsing"), then browse rows of cards for your experience, projects, skills and more. You fill it in by giving this repository and your resume to any AI assistant.

- All your content lives in one file, `profile.js`.
- Fully readable by search engines and AI agents without JavaScript (static HTML, `llms.txt`, `sitemap.xml`, structured data).
- Works on phones and desktops, with automated tests for layout, accessibility and content.
- No tracking by default. MIT licensed.

## Make your own in 3 steps

1. **Use this template.** Click **Use this template** on GitHub (or fork it) to create your own copy.
2. **Give it to an AI.** Open an AI coding assistant that can edit a repository (Claude Code, Codex, Cursor, Copilot agent and similar), point it at your copy, attach your resume or LinkedIn export, and paste:

   > Read AGENTS.md in this repository and follow it. Build my portfolio from the attached resume and the links below. Do not invent anything. Leave a field empty if I did not give it to you. Run the build, check and tests, then tell me what you left blank.
   >
   > My LinkedIn: ...  My GitHub: ...  Where I will host it: ...

   No coding assistant? Open `profile.js` in any editor and replace the sample data by hand. Every field is commented.
3. **Publish it.** Create a free site on [Cloudflare Pages](https://pages.cloudflare.com) or GitHub Pages and connect your repo. Build command `npm run build`, output directory `.`. Review the result and fix anything the AI got wrong before you share the link.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install the dev tools (once) |
| `npm run build` | Generate `index.html`, `llms.txt`, `robots.txt`, `sitemap.xml` from `profile.js` |
| `npm run check` | Validate your content and flag leftover sample data |
| `npm test` | Unit and content tests |
| `npm run e2e` | Browser tests (needs `npx playwright install`) |
| `npm run og` | Regenerate the share-card image from your name and tagline |

To preview locally: `npx http-server . -p 4173`, then open http://localhost:4173.

## Tips

- Phone numbers are hidden by default. Add one in `contact.phones` only if you want it public.
- Analytics is optional: set `site.analytics.goatcounter` to your GoatCounter code to enable it.
- The sample person ("Alex Rivera") is fictional. `npm run check` fails while any sample data is left.

## License

MIT. See [LICENSE](LICENSE).
