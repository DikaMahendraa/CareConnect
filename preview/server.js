// SERVER PREVIEW (khusus pengembangan frontend, JANGAN dimasukkan ke project utama).
// Tujuan: melihat tampilan dengan data dummy tanpa backend.  Jalankan: node preview/server.js
const http = require('http'), fs = require('fs'), path = require('path');
const render = require('./render'), D = require('./dummy-data');
const PORT = process.env.PORT || 4000;
const types = { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const find = (list, id) => list.find(x => String(x.id) === String(id));

const routes = [
  [/^\/admin\/dashboard$/, () => ['admin/dashboard', { stats: D.stats, recentActivities: D.recentActivities, recentAlerts: D.recentAlerts }]],
  [/^\/admin\/residents$/, () => ['admin/residents', { residents: D.residents }]],
  [/^\/admin\/residents\/new$/, () => ['admin/resident-form', { mode: 'create', resident: null }]],
  [/^\/admin\/residents\/(\d+)$/, id => ['admin/resident-detail', { resident: find(D.residents, id) }]],
  [/^\/admin\/residents\/(\d+)\/edit$/, id => ['admin/resident-form', { mode: 'edit', resident: find(D.residents, id) }]],
  [/^\/admin\/caregivers$/, () => ['admin/caregivers', { caregivers: D.caregivers }]],
  [/^\/admin\/caregivers\/new$/, () => ['admin/caregiver-form', { mode: 'create', caregiver: null }]],
  [/^\/admin\/caregivers\/(\d+)$/, id => ['admin/caregiver-detail', { caregiver: Object.assign({}, find(D.caregivers, id), { residents: D.residents.filter(r => r.caregiver && String(r.caregiver.id) === id) }) }]],
  [/^\/admin\/caregivers\/(\d+)\/edit$/, id => ['admin/caregiver-form', { mode: 'edit', caregiver: find(D.caregivers, id) }]],
  [/^\/admin\/assignments$/, () => ['admin/assignments', { assignments: D.assignments, unassignedResidents: D.unassignedResidents, caregivers: D.caregivers }]]
];

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST') { res.writeHead(303, { Location: req.headers.referer || '/admin/dashboard' }); return res.end(); }
  if (url.pathname === '/') { res.writeHead(302, { Location: '/admin/dashboard' }); return res.end(); }
  const file = path.join(__dirname, '..', 'public', url.pathname);
  if (/^\/(css|js)\//.test(url.pathname) && fs.existsSync(file)) {
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' }); return res.end(fs.readFileSync(file));
  }
  for (const [re, fn] of routes) {
    const m = url.pathname.match(re); if (!m) continue;
    const [view, data] = fn(m[1]);
    const extra = url.searchParams.get('residentId') ? { selectedResidentId: url.searchParams.get('residentId') } : {};
    const flash = url.searchParams.get('flash') ? { type: 'success', message: 'Data berhasil disimpan.' } : undefined;
    try { const html = await render(view, Object.assign({}, D.common, data, extra, { flash })); res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(html); }
    catch (e) { res.writeHead(500, { 'Content-Type': 'text/plain' }); return res.end(String(e.stack)); }
  }
  res.writeHead(404); res.end('Not found');
}).listen(PORT, () => console.log('Preview: http://localhost:' + PORT + '/admin/dashboard'));
