// A deliberately different, minimal profile used by the tests: no repos, no "beyond code", no education,
// no phone numbers, no resume links and no analytics. If the template handles this, it handles real people.
const base = require('../../profile.js');
module.exports = {
  PALETTE: base.PALETTE, gradient: base.gradient,
  site: {
    url: 'https://sam-okafor.dev', name: 'Sam Okafor', firstName: 'Sam', lastName: 'Okafor', role: 'Data Engineer',
    description: 'Data engineer who builds reliable pipelines and clear dashboards. Projects and write-ups in a streaming-style portfolio.',
    year: 2026, badges: ['Data Engineer', 'Open to work'],
    tagline: 'Data engineer who turns messy sources into trusted tables.',
    profileTaglines: { recruiter: 'Available now. Strong in SQL, Python and Airflow.', manager: 'Reliable pipelines, clear ownership.', engineer: 'Open a project for the schema and the trade-offs.', guest: 'Data engineer who turns messy sources into trusted tables.' },
    resume: { view: '', download: '' },
    heroStats: [{ value: '2 yrs', label: 'In industry' }, { value: 'SQL', label: 'Daily driver' }, { value: '3', label: 'Featured projects' }],
    recap: [{ value: '4 hrs', label: 'saved per week by automating a report' }],
    status: '',
    about: { eyebrow: 'DATA ENGINEER', heading: 'About Sam', paragraphs: ['I build data pipelines for analytics teams.'], facts: [{ label: 'Starring', value: 'Sam Okafor' }] },
    contact: { heading: 'Let us talk.', text: 'I am looking for a data engineering role.', email: 'sam@okafor.dev', phones: [], links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/samokafor' }] },
    githubUser: '', ticker: [['SQL', 'LANGUAGE'], ['Python', 'LANGUAGE'], ['Airflow', 'ORCHESTRATION'], ['dbt', 'MODELLING'], ['Snowflake', 'WAREHOUSE'], ['Spark', 'COMPUTE']],
    analytics: { goatcounter: '' }, footerNote: ''
  },
  experience: [{ company: 'Brightlane Analytics', role: 'Data Engineer', period: 'Sep 2024 to Present', place: 'Remote', episodes: [{ label: 'BUILD', color: 'teal', title: 'Automated the weekly sales report', blurb: 'Replaced a spreadsheet routine with a scheduled pipeline.', tag: 'Automation', situation: 'The report took half a day to prepare by hand.', did: ['Built an Airflow DAG that loads, checks and publishes the data.'], stack: 'Airflow, SQL, Python' }] }],
  education: [], beyond: [], repos: [],
  projects: [
    { t: 'Sales Pipeline', color: 'teal', badge: 'AT BRIGHTLANE', sub: 'Airflow · SQL', problem: 'Reports were prepared by hand.', built: 'A scheduled pipeline that loads, checks and publishes sales data.', result: 'Saved about four hours a week', stack: 'Airflow, SQL, Python', role: 'Built it', blurb: 'A scheduled sales pipeline.', tags: ['Airflow', 'SQL'], arch: ['Source', 'Airflow', 'Warehouse', 'Report'], diff: '', live: '', src: '', blog: '' },
    { t: 'Churn Model', color: 'orange', badge: 'SIDE PROJECT', sub: 'Python · scikit-learn', problem: 'Which customers are likely to leave?', built: 'A simple model that ranks customers by churn risk.', result: 'Beat the baseline on held-out data', stack: 'Python, scikit-learn', role: 'Built it', blurb: 'Ranks customers by churn risk.', tags: ['Python'], arch: ['Data', 'Model', 'Ranking'], diff: '', live: '', src: '', blog: '' },
    { t: 'Open Data Map', color: 'indigo', badge: 'SIDE PROJECT', sub: 'JavaScript · Maps', problem: 'City data is hard to browse.', built: 'A map that shows open city data by neighbourhood.', result: 'Shared with a local civic group', stack: 'JavaScript, Leaflet', role: 'Built it', blurb: 'City data on a map.', tags: ['JavaScript'], arch: ['CSV', 'Map'], diff: '', live: '', src: '', blog: '' }
  ].map(p => Object.assign(p, { g: base.gradient(p.color, 135) })),
  skills: [['SQL', 'Data', 'teal'], ['Python', 'Languages', 'blue'], ['Airflow', 'Orchestration', 'green'], ['dbt', 'Modelling', 'orange'], ['Snowflake', 'Warehouse', 'indigo'], ['Spark', 'Compute', 'red']].map(([n, s, color]) => ({ n, s, color, g: base.gradient(color, 160) }))
};
