// Renderer preview. Memakai paket "ejs" bila terpasang; jika tidak, memakai renderer mini
// (mendukung <% %>, <%= %>, <%- %>, <%# %>, -%> dan include) hanya untuk keperluan preview.
const fs = require('fs'), path = require('path');
let ejs = null; try { ejs = require('ejs'); } catch (e) {}

function esc(v) { return v == null ? '' : String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#34;').replace(/'/g, '&#39;'); }
function mini(file, locals) {
  if (!path.extname(file)) file += '.ejs';
  const src = fs.readFileSync(file, 'utf8');
  const re = /<%([=\-#])?([\s\S]*?)(-)?%>/g;
  let code = '', last = 0, m;
  while ((m = re.exec(src))) {
    code += '__o+=' + JSON.stringify(src.slice(last, m.index)) + ';\n';
    if (m[1] === '=') code += '__o+=__esc(' + m[2].trim() + ');\n';
    else if (m[1] === '-') code += '__o+=((__v)=>__v==null?"":__v)(' + m[2].trim() + ');\n';
    else if (m[1] !== '#') code += m[2] + '\n';
    last = re.lastIndex;
    if (m[3] && src[last] === '\n') last++;
  }
  code += '__o+=' + JSON.stringify(src.slice(last)) + ';\nreturn __o;';
  const fn = new Function('locals', '__esc', 'include', 'let __o="";with(locals){' + code + '}');
  const include = (p, d) => mini(path.resolve(path.dirname(file), p), Object.assign({}, locals, d));
  return fn(locals, esc, include);
}
module.exports = function render(view, data) {
  const file = path.join(__dirname, '..', 'views', view + '.ejs');
  return ejs ? ejs.renderFile(file, data) : Promise.resolve(mini(file, data));
};
