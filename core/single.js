// Turns a built site folder into ONE self-contained html page: styles, scripts, content and images all inside it.
// A single file previews directly in a chat (for example a Claude artifact), opens by double-click, and can be dropped on a host as is.
// Web fonts are still loaded from Google Fonts when online and fall back to system fonts when offline.
const fs = require('fs');
const path = require('path');

const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.gif': 'image/gif' };

function inline(dir) {
  const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
  const dataUri = f => 'data:' + (MIME[path.extname(f).toLowerCase()] || 'application/octet-stream') + ';base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
  let html = read('index.html');
  html = html.replace(/<link rel="stylesheet" href="([^"]+\.css)"( media="print")?>/g, (m, f, media) => '<style' + (media || '') + '>\n' + read(f) + '\n</style>');
  html = html.replace(/<script src="([^"]+\.js)"><\/script>/g, (m, f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '\n</script>');
  // images and sounds the page points at, in markup and in the inlined scripts
  html = html.replace(/(src|href)="(assets\/[^"]+)"/g, (m, attr, f) => fs.existsSync(path.join(dir, f)) ? attr + '="' + dataUri(f) + '"' : m);
  html = html.replace(/'(assets\/[^']+)'/g, (m, f) => fs.existsSync(path.join(dir, f)) ? "'" + dataUri(f) + "'" : m);
  return html;
}

module.exports = { inline };
