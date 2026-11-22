// Lists the available designs so a person (or an AI) can choose one. Usage: npm run themes
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'themes');
for (const id of fs.readdirSync(dir).sort()) {
  const f = path.join(dir, id, 'theme.json');
  if (!fs.existsSync(f)) continue;
  const m = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(`${m.id}  (${m.name})\n  ${m.description}\n  mood: ${m.mood.join(', ')}\n  best for: ${m.bestFor.join(', ')}\n`);
}
console.log('Choose one by setting  site.theme  in profile.js, then run npm run build.');
