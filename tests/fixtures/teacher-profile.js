// A non-engineering profile: no projects, no skills row, no GitHub, no recap numbers, no hero stats.
// It uses custom sections instead. If the template handles this, it is flexible enough for any job role.
const base = require('../../profile.js');
module.exports = {
  PALETTE: base.PALETTE, gradient: base.gradient,
  site: {
    url: 'https://maria-lopez.example.org', name: 'Maria Lopez', firstName: 'Maria', lastName: 'Lopez', role: 'Secondary School Teacher',
    description: 'Secondary school mathematics teacher with ten years of classroom experience. Courses, publications and results in one place.',
    year: 2026, badges: [],
    tagline: 'Maths teacher who makes difficult ideas feel simple.',
    profileTaglines: { recruiter: 'Experienced maths teacher, available from September.', manager: 'Strong results, calm classrooms and clear planning.', engineer: 'Curious how I teach? Open the courses.', guest: 'Maths teacher who makes difficult ideas feel simple.' },
    profileNames: { recruiter: 'Recruiter', manager: 'Head Teacher', engineer: 'Colleague', guest: 'Visitor' },
    resume: { view: '', download: '' },
    heroStats: [], recap: [], status: '', ticker: [],
    labels: { stack: 'Resources used', result: 'Outcome' },
    sections: { episodes: { title: 'Teaching history', small: '', nav: 'Career' } },
    sectionOrder: ['episodes', 'courses', 'publications', 'about'],
    about: { eyebrow: 'TEACHER', heading: 'About Maria', paragraphs: ['I teach mathematics to students aged 11 to 18.'], facts: [{ label: 'Subjects', value: 'Mathematics, Statistics' }] },
    contact: { heading: 'Get in touch.', text: 'I am open to a new teaching post.', email: 'maria@lopez-teaching.org', phones: [], links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/marialopez-teacher' }] },
    githubUser: '', analytics: { goatcounter: '' }, footerNote: ''
  },
  experience: [{ company: 'Riverside Academy', role: 'Mathematics Teacher', period: 'Sep 2018 to Present', place: 'Leeds', episodes: [
    { label: 'LEAD', color: 'blue', title: 'Led the Year 10 catch-up programme', blurb: 'Small-group sessions for students who had fallen behind.', tag: 'Teaching', situation: '', did: ['Planned weekly sessions for three groups.', 'Tracked progress with short quizzes.'], stack: '' }
  ] }],
  education: [{ level: 'Postgraduate', title: 'PGCE, Secondary Mathematics', school: 'University of Leeds', period: '2017 to 2018', extra: '', chips: [], details: [] }],
  beyond: [], repos: [], projects: [], skills: [],
  extraSections: [
    { id: 'courses', title: 'Courses I teach', small: 'This year', items: [
      { title: 'GCSE Mathematics', text: 'Higher tier preparation for Years 10 and 11.', meta: 'Years 10-11', tag: 'Exam course', color: 'blue' },
      { title: 'A-level Statistics', text: 'Probability, distributions and hypothesis testing.', meta: 'Years 12-13', tag: 'Exam course', color: 'green', link: { url: 'https://example.org/statistics', label: 'Syllabus' } }
    ] },
    { id: 'publications', title: 'Publications', items: [{ title: 'Teaching fractions with area models', text: 'Article in a teachers journal.', meta: '2023', tag: 'Article' }] }
  ]
};
