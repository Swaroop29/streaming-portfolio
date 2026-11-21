/* ============================================================================
   YOUR CONTENT LIVES IN THIS FILE. Edit the values between the two banners.
   Everything shown here is FICTIONAL SAMPLE DATA for "Alex Rivera". Replace all of it.

   Rules (also in AGENTS.md):
   - Plain text only. No HTML, no &middot; entities. Use "·" if you want a dot separator.
   - Never invent employers, dates, numbers, links or awards. Use only what the person provided.
     If something is missing, leave "" (or remove the item). Do not guess.
   - "color" can be: red, blue, green, purple, gold, pink, lime, teal, indigo, orange, dark.
   - Every section is optional. A list left empty ([]) removes that section from the page, including its menu link.
     Nothing here is required except the basics at the top of `site` and a contact email.
   - Build the page around the person's job, not around software. Rename sections (site.sections), reorder them
     (site.sectionOrder), relabel the project popup (site.labels) and add your own sections (extraSections).
   - After editing run:  npm run build   then   npm run check   then   npm test
   ========================================================================== */

/* ===================== START OF CONTENT (edit below) ===================== */

const site = {
  url: "https://alex-rivera.pages.dev",      // where the site will live (used for share cards, sitemap)
  name: "Alex Rivera",
  firstName: "Alex",
  lastName: "Rivera",
  role: "Software Engineer",
  description: "Software engineer focused on backend systems and developer tooling. Projects, write-ups and live demos in a streaming-style portfolio.",
  year: 2026,                                // shown in the hero row
  badges: ["Ex-Northwind", "Software Engineer", "Open to work"],   // small tags in the hero row, max 4
  tagline: "Software engineer who built and ran production services at Northwind Labs. Backend first, comfortable across the stack.",
  profileTaglines: {                         // text shown after each "Who's watching?" profile is picked
    recruiter: "Ex-Northwind engineer, ready to interview. Strong in Go, Python and cloud infrastructure.",
    manager: "I ship, I own what I ship, and I learn quickly. Here is the work, with the problem, the decision and the result for each.",
    engineer: "Skip the pitch. Open a project for the architecture, the trade-offs and what I would change.",
    guest: "Software engineer who built and ran production services at Northwind Labs. Backend first, comfortable across the stack."
  },
  resume: { view: "https://example.com/alex-rivera-resume", download: "https://example.com/alex-rivera-resume.pdf" },   // links to the resume (view page and direct download). Use "" to hide the buttons.
  heroStats: [                               // exactly 3 short facts under the hero text
    { value: "3 yrs", label: "In industry" },
    { value: "Northwind", label: "Former SWE" },
    { value: "4", label: "Featured projects" }
  ],
  recapTitle: "By the numbers",              // the "Season recap" box next to Experience
  recap: [                                   // up to 5 numbers, each must be true and sourced from the person's data
    { value: "~30%", label: "faster API response after a caching rewrite" },
    { value: "99.95%", label: "uptime for the billing service" },
    { value: "12", label: "services migrated to a new platform" }
  ],
  status: "Open to roles · London, UK",      // the green "now" line under the recap. "" hides it
  about: {
    eyebrow: "ORIGINAL ENGINEER",
    heading: "About Alex",
    paragraphs: [
      "I am a software engineer with a BSc in Computer Science. At Northwind Labs I built and ran backend services for a payments platform.",
      "Away from the keyboard I cook, cycle and take far too many photos.",
      "Next I want a team building real products, where I can keep shipping and mentor others."
    ],
    facts: [                                 // rows of the "Cast and crew" table. url is optional.
      { label: "Starring", value: "Alex Rivera" },
      { label: "Genres", value: "Backend, Cloud, Developer tooling" },
      { label: "Based in", value: "London, UK" },
      { label: "Off screen", value: "Cooking · Cycling · Photography" },
      { label: "Awards", value: "Winner, Example Hackathon 2024" }
    ]
  },
  educationTitle: "Education",
  contact: {
    heading: "You, hiring me.",
    text: "I'm interviewing for software engineering roles. If your team is hiring, I'd like to hear about it.",
    email: "alex@example.com",
    phones: [ { label: "UK", number: "+44 7000 000000" } ],   // [] to hide phone numbers (recommended unless the person asked)
    links: [                                 // buttons. The first link with "github.com" is also used for the GitHub row.
      { label: "LinkedIn", url: "https://www.linkedin.com/in/example" },
      { label: "GitHub", url: "https://github.com/example" }
    ]
  },
  githubUser: "example",                     // "On GitHub" row title
  ticker: [                                  // words that scroll on the opening wall, [name, category]
    ["Go", "LANGUAGE"], ["Python", "LANGUAGE"], ["AWS", "CLOUD"], ["PostgreSQL", "DATA"], ["Kubernetes", "PLATFORM"],
    ["React", "FRONTEND"], ["Northwind", "EXPERIENCE"], ["Billing Service", "FEATURED"], ["Terraform", "INFRA"], ["TypeScript", "LANGUAGE"]
  ],
  analytics: { goatcounter: "" },            // optional: your GoatCounter code, e.g. "alex" for alex.goatcounter.com. "" disables analytics
  footerNote: "Handmade. Updated November 2026.",

  // ----- OPTIONAL: fit the page to the person's job. Delete any line you do not need. -----
  theme: "netflix",                          // the design. See the themes/ folder for what is available.
  // Rename a section: any of projects, github, episodes, skills, beyond, about, or the id of an extra section.
  //   title = heading, small = grey text beside it, nav = menu label.
  sections: {
    projects: { title: "Featured projects", nav: "Projects" },
    episodes: { title: "Continue watching", small: "Season 1", nav: "Experience" },
    skills: { title: "Top 10 in my toolkit", small: "Today" },
    beyond: { title: "Beyond code", small: "Extras" }
  },
  // Order of sections on the page. Ids you leave out follow in the default order.
  sectionOrder: ["projects", "episodes", "talks", "skills", "github", "beyond", "about"],
  // Words inside the project popup and experience cards. Change them to suit the role, for example a designer
  // might use stack: "Tools", arch: "Process", result: "Outcome", role: "My part".
  labels: { stack: "Built with", arch: "Architecture", result: "Result", role: "My role", diff: "What I'd do differently" },
  // Names on the "Who's watching?" screen. Use these if "Engineer" does not fit the person's field.
  // profileNames: { recruiter: "Recruiter", manager: "Hiring Manager", engineer: "Colleague", guest: "Just Browsing" },
  // heroCta: "Watch my work"        // text of the first hero button
};

const experience = [                         // newest first. Each company has "episodes" (3 to 5 is ideal)
  {
    company: "Northwind Labs",
    role: "Software Engineer",
    period: "Jun 2023 to Aug 2025",
    place: "Payments Platform, London",
    episodes: [
      {
        label: "PILOT", color: "red",
        title: "Rebuilt the invoice API caching layer",
        blurb: "Moved hot invoice lookups to a read-through cache. Median response time dropped by about 30%.",
        tag: "Performance",
        situation: "Invoice lookups hit the database on every request and slowed down at month end.",
        did: ["Designed a read-through cache with explicit invalidation rules.", "Rolled it out behind a flag and compared latency before and after."],
        stack: "Go, Redis, PostgreSQL"
      },
      {
        label: "OWNER", color: "blue",
        title: "Led a service migration with no downtime",
        blurb: "Moved 12 services to a new deployment platform in stages, with automated checks at every step.",
        tag: "Migration",
        situation: "Services ran on an ageing platform that was costly to maintain.",
        did: ["Wrote the migration runbook and rollback plan.", "Automated smoke tests that gated each service cutover."],
        stack: "Terraform, Kubernetes, GitHub Actions"
      }
    ]
  },
  {
    company: "Example Studio",
    role: "Software Engineer (Intern)",
    period: "Jun 2022 to Sep 2022",
    place: "Remote",
    episodes: [
      {
        label: "BUILD", color: "green",
        title: "Built an internal release dashboard",
        blurb: "React and Node.js dashboard that showed build and release status for every team.",
        tag: "Full stack",
        situation: "Teams checked release status by asking each other in chat.",
        did: ["Built the dashboard front end and its API.", "Added alerts for failed releases."],
        stack: "React, Node.js, PostgreSQL"
      }
    ]
  }
];

const education = [                          // newest first
  {
    level: "Undergraduate · UK",
    title: "BSc, Computer Science",
    school: "Example University",
    period: "2019 to 2023",
    extra: "First class honours",
    chips: ["Dean's list 2022", "Example Hackathon winner, 2024"],
    details: [
      { label: "Built", text: "a distributed task scheduler in Go for the final year project." },
      { label: "Result", text: "awarded the department prize for best project." }
    ]
  }
];

const beyond = [                             // the "Beyond code" flip cards. icon: chess, racket, game, mountain, book, music, camera, star
  {
    icon: "camera", color: "dark", category: "PHOTOGRAPHY", title: "Photography",
    blurb: "Street photos, mostly in black and white.",
    backTitle: "Want to see more?", backText: "A few of my favourite frames are on my gallery page.",
    link: { label: "My gallery", url: "https://example.com/gallery" }
  },
  {
    icon: "mountain", color: "blue", category: "OUTDOORS", title: "Cycling",
    blurb: "Long weekend rides, usually with a hill at the end.",
    backTitle: "Ride along?", backText: "I am always up for a new route.",
    link: null
  }
];

const projects = [                           // 3 to 7 projects. The first one is the featured one.
  {
    t: "Billing Service", color: "red", badge: "AT NORTHWIND", sub: "Go · PostgreSQL · Kafka",
    problem: "Invoices were created by several services, and totals sometimes disagreed.",
    built: "A single billing service that owns invoice creation, with idempotent writes and an audit trail.",
    result: "No invoice disagreements reported after launch",
    stack: "Go, PostgreSQL, Kafka",
    role: "Designed and built it with one other engineer",
    blurb: "One service that owns invoices, with an audit trail.",
    tags: ["Go", "PostgreSQL", "Kafka"],
    arch: ["API", "Billing service", "Kafka", "Ledger"],
    diff: "I would add contract tests between services earlier.",
    live: "", src: "", blog: ""
  },
  {
    t: "Release Dashboard", color: "blue", badge: "INTERN PROJECT", sub: "React · Node.js",
    problem: "Teams could not see release status without asking each other.",
    built: "A dashboard that shows build and release state for every team and alerts on failures.",
    result: "Used by all engineering teams during my internship",
    stack: "React, Node.js, PostgreSQL",
    role: "Built it as an intern",
    blurb: "Release status for every team in one place.",
    tags: ["React", "Node.js"],
    arch: ["CI events", "API", "Dashboard"],
    diff: "",
    live: "", src: "", blog: ""
  },
  {
    t: "Task Scheduler", color: "green", badge: "FINAL YEAR PROJECT", sub: "Go · Distributed systems",
    problem: "Running scheduled jobs reliably across several machines is harder than it looks.",
    built: "A distributed task scheduler in Go that elects a leader and reassigns work when a node fails.",
    result: "Awarded the department prize for best project, 2023",
    stack: "Go, etcd, Docker",
    role: "Built it as my final year project",
    blurb: "A scheduler that keeps running when nodes fail.",
    tags: ["Go", "etcd"],
    arch: ["Client", "Leader", "Workers"],
    diff: "",
    live: "", src: "https://github.com/example/task-scheduler", blog: ""
  },
  {
    t: "This Portfolio", color: "purple", badge: "THIS SITE", sub: "HTML · CSS · JS",
    problem: "A CV is a flat list. I wanted a recruiter, a manager and an engineer to each find what they need quickly.",
    built: "A streaming-style portfolio built from one content file, with a build step and automated tests.",
    result: "Every change is tested on desktop, tablet and phone before it goes live",
    stack: "HTML, CSS, JavaScript",
    role: "Designed and built it",
    blurb: "A portfolio built like a streaming service.",
    tags: ["HTML", "CSS", "JavaScript"],
    arch: ["profile.js", "build", "index.html"],
    diff: "",
    live: "", src: "", blog: ""
  }
];

const repos = [                              // optional "On GitHub" row. n=name, d=description, l=language, c=language colour, s=stars, u=url
  { n: "task-scheduler", d: "A distributed task scheduler in Go.", l: "Go", c: "#00ADD8", s: 0, u: "https://github.com/example/task-scheduler" },
  { n: "dotfiles", d: "My shell and editor setup.", l: "Shell", c: "#89e051", s: 0, u: "https://github.com/example/dotfiles" }
];

const skills = [                             // the "Top 10 in my toolkit" row, 6 to 10 items
  { n: "Go", s: "Languages", color: "teal" },
  { n: "Python", s: "Languages", color: "blue" },
  { n: "AWS", s: "Cloud", color: "gold" },
  { n: "PostgreSQL", s: "Data", color: "indigo" },
  { n: "Kubernetes", s: "Platform", color: "purple" },
  { n: "React", s: "Frontend", color: "green" },
  { n: "Terraform", s: "Infrastructure", color: "pink" },
  { n: "Distributed Systems", s: "Backend", color: "red" }
];

/* ====================== END OF CONTENT (do not edit below) ====================== */

/* Helpers: turn colour names into gradients so the content above stays simple. */
// Your own sections: publications, certifications, courses taught, awards, talks, campaigns, case studies, volunteering...
// Each section is a row of cards. Remove the whole section if the person has nothing for it.
//   id: lowercase letters/numbers/dashes     title: heading     small: grey text beside the heading (optional)
//   items: title (required), text, meta (short label like a year), tag, color, link: { url, label }
const extraSections = [
  {
    id: "talks", title: "Talks & writing", small: "Selected",
    items: [
      { title: "Scaling invoice pipelines", text: "A conference talk on moving a billing system to event-driven processing.", meta: "2025", tag: "Conference talk", color: "blue", link: { url: "https://example.com/talk", label: "Watch" } },
      { title: "Notes on idempotent APIs", text: "A short write-up with the patterns the team adopted.", meta: "2024", tag: "Article", color: "green", link: { url: "https://example.com/post", label: "Read" } }
    ]
  }
];

const PALETTE = {
  red: ["#7a1410", "#e5231b"], blue: ["#14307a", "#2b6be5"], green: ["#0b4d3d", "#12a37f"], purple: ["#4a1a7a", "#9b5be5"],
  gold: ["#7a4a08", "#d9a21b"], pink: ["#5a0f2e", "#d6336c"], lime: ["#1c4a12", "#5aa832"], teal: ["#0d4a5c", "#1fa5c9"],
  indigo: ["#3a1a7a", "#6b6bf0"], orange: ["#5c3a0d", "#e0803a"], dark: ["#17171d", "#5a5a6e"]
};
function gradient(name, angle) { const c = PALETTE[name] || PALETTE.red; return "linear-gradient(" + (angle || 135) + "deg," + c[0] + "," + c[1] + ")"; }
projects.forEach(p => { p.g = p.g || gradient(p.color, 135); });
skills.forEach(k => { k.g = k.g || gradient(k.color, 160); });

if (typeof module !== "undefined") module.exports = { site, experience, education, beyond, projects, repos, skills, extraSections, PALETTE, gradient };
