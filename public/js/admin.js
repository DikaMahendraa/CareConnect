/* CareConnect - admin.js
   JavaScript frontend halaman Admin. Tidak ada dependensi, tidak memanggil API.
   Semua perilaku aktif lewat atribut data-* di EJS. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Tanggal hari ini di navbar */
  var today = $('[data-today]');
  if (today) today.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* Sidebar mobile */
  var body = document.body;
  var toggle = $('[data-nav-toggle]');
  function setNav(open) {
    body.classList.toggle('adm-nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!body.classList.contains('adm-nav-open')); });
  $$('[data-nav-close]').forEach(function (el) { el.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* Flash message */
  var flash = $('[data-flash]');
  if (flash) {
    var close = $('[data-flash-close]', flash);
    if (close) close.addEventListener('click', function () { flash.remove(); });
    if (flash.className.indexOf('--success') > -1) setTimeout(function () { flash.remove(); }, 6000);
  }

  /* Pencarian + filter tabel (sisi klien) */
  $$('[data-table-search]').forEach(function (input) {
    var table = $(input.getAttribute('data-table-search'));
    if (!table) return;
    var card = table.closest('.cc-card');
    var filter = card ? $('[data-table-filter]', card) : null;
    var empty = card ? $('[data-empty]', card) : null;
    function apply() {
      var q = input.value.trim().toLowerCase();
      var st = filter ? filter.value : '';
      var shown = 0;
      $$('tbody tr', table).forEach(function (tr) {
        var ok = (!q || tr.textContent.toLowerCase().indexOf(q) > -1) && (!st || tr.getAttribute('data-status') === st);
        tr.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }
    input.addEventListener('input', apply);
    if (filter) filter.addEventListener('change', apply);
  });

  /* Dialog */
  function openDialog(d) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
  $$('dialog').forEach(function (d) {
    $$('[data-dialog-close]', d).forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  /* Konfirmasi hapus: tombol dengan data-delete-url + data-delete-name */
  var del = $('#deleteDialog');
  if (del) {
    var delForm = $('[data-delete-form]', del);
    $$('[data-delete-url]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        delForm.setAttribute('action', btn.getAttribute('data-delete-url'));
        $('[data-delete-title]', del).textContent = 'Hapus ' + btn.getAttribute('data-delete-name') + '?';
        $('[data-delete-text]', del).textContent = btn.getAttribute('data-delete-text') || 'Data yang dihapus tidak dapat dikembalikan.';
        openDialog(del);
      });
    });
  }

  /* Validasi form sederhana (pesan Bahasa Indonesia) */
  $$('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var firstBad = null;
      $$('.cc-input, .cc-select, .cc-textarea', form).forEach(function (el) {
        var field = el.closest('.cc-field');
        var old = field && $('.cc-error[data-client]', field);
        if (old) old.remove();
        el.classList.remove('is-invalid');
        if (el.validity && !el.validity.valid) {
          el.classList.add('is-invalid');
          var msg = el.validity.valueMissing ? 'Kolom ini wajib diisi.'
            : el.validity.typeMismatch ? 'Format tidak valid.'
            : el.validity.patternMismatch ? 'Gunakan 8-16 digit angka (boleh diawali +).'
            : el.validity.tooShort ? 'Minimal ' + el.minLength + ' karakter.' : 'Isian tidak valid.';
          var span = document.createElement('span');
          span.className = 'cc-error'; span.setAttribute('data-client', ''); span.textContent = msg;
          if (field) field.appendChild(span);
          if (!firstBad) firstBad = el;
        }
      });
      var gender = $('input[name="gender"]', form);
      if (gender && !$('input[name="gender"]:checked', form)) { e.preventDefault(); gender.focus(); return; }
      if (firstBad) { e.preventDefault(); firstBad.focus(); }
    });
  });

  /* Halaman penugasan */
  var af = $('[data-assign-form]');
  if (af) {
    var rSel = $('#residentId', af), cSel = $('#caregiverId', af);
    var submit = $('[data-assign-submit]', af), prev = $('[data-assign-preview]', af);
    function update() {
      var ok = !!(rSel.value && cSel.value);
      submit.disabled = !ok;
      prev.classList.toggle('is-on', ok);
      if (ok) {
        var rn = rSel.options[rSel.selectedIndex].text.replace(/\s*\(\d+ th\)$/, '');
        prev.textContent = rn + ' akan dipantau oleh ' + cSel.options[cSel.selectedIndex].getAttribute('data-name') + '.';
      }
    }
    rSel.addEventListener('change', update); cSel.addEventListener('change', update);
    $$('[data-pick-resident]').forEach(function (b) {
      b.addEventListener('click', function () {
        rSel.value = b.getAttribute('data-pick-resident'); update();
        $$('.adm-queue li').forEach(function (li) { li.classList.remove('is-selected'); });
        b.closest('li').classList.add('is-selected');
        cSel.focus();
      });
    });
    update();
  }
  var ed = $('#editAssignDialog');
  if (ed) {
    var edForm = $('[data-edit-assign-form]', ed);
    $$('[data-edit-assignment]').forEach(function (b) {
      b.addEventListener('click', function () {
        edForm.setAttribute('action', b.getAttribute('data-action'));
        $('[data-edit-resident]', ed).textContent = b.getAttribute('data-resident');
        $('#editCaregiverId', ed).value = b.getAttribute('data-caregiver-id');
        openDialog(ed);
      });
    });
  }
})();
