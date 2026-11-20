const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

// Run profile.js in an isolated context and return its content.
function loadData() {
  const ctx = vm.createContext({});
  vm.runInContext(read('profile.js') + ';this.site=site;this.experience=experience;this.education=education;this.beyond=beyond;this.projects=projects;this.repos=repos;this.skills=skills;', ctx, { filename: 'profile.js' });
  return { site: ctx.site, experience: ctx.experience, education: ctx.education, beyond: ctx.beyond, projects: ctx.projects, repos: ctx.repos, skills: ctx.skills };
}

const isHttps = (u) => { try { return new URL(u).protocol === 'https:'; } catch { return false; } };

module.exports = { root, read, loadData, isHttps, exists: (f) => fs.existsSync(path.join(root, f)) };
