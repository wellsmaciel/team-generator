// Serve only application assets on loopback; never expose registrations or project files.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', '..');
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/script.js', ['script.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/vendor/bootstrap-5.3.3/bootstrap.min.css', ['vendor/bootstrap-5.3.3/bootstrap.min.css', 'text/css; charset=utf-8']],
  ['/Dark_court.jpg', ['Dark_court.jpg', 'image/jpeg']],
  ['/clipboard-editor', ['tests/browser/clipboard-editor.html', 'text/html; charset=utf-8']],
]);

module.exports = async function startTestServer() {
  const server = http.createServer((request, response) => {
  const asset = assets.get(new URL(request.url, 'http://127.0.0.1').pathname);
  if (!asset) { response.writeHead(404); response.end(); return; }
  response.setHeader('Content-Type', asset[1]);
  fs.createReadStream(path.join(root, asset[0])).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(51806, '127.0.0.1', resolve);
  });
  return async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  };
};
