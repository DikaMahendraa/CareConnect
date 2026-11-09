# CareConnect – Frontend Admin: Panduan Integrasi

Dokumen ini untuk anggota backend. Frontend Admin hanya berisi **view EJS, CSS, dan JS**.
Tidak ada route, controller, model, koneksi database, maupun perubahan `app.js`.

## 1. Isi paket dan tempat file

| File di paket | Salin ke project utama | Keterangan |
|---|---|---|
| `views/admin/*.ejs` (8 halaman) | `views/admin/` | Halaman Admin |
| `views/admin/partials/*.ejs` | `views/admin/partials/` | Layout bersama: head, sidebar, topbar, foot, ikon, avatar, flash, modal hapus, csrf |
| `public/css/careconnect-base.css` | `public/css/` | Token warna + komponen bersama (`cc-*`). **Boleh dipakai halaman Caregiver** |
| `public/css/admin.css` | `public/css/` | Layout dan komponen khusus Admin (`adm-*`) |
| `public/js/admin.js` | `public/js/` | Interaksi: sidebar mobile, cari/filter tabel, dialog hapus, validasi form |
| `preview/`, `screenshots/`, `docs/` | **Jangan disalin** | Hanya untuk melihat tampilan tanpa backend dan dokumentasi |

Halaman Caregiver cukup memuat `careconnect-base.css` lalu CSS miliknya sendiri. Semua warna ada di variabel `:root` (`--cc-primary`, `--cc-sidebar`, dst.), jadi tema tetap konsisten.

## 2. Prasyarat di project utama (sudah lazim, tidak perlu ubah kode)

1. `view engine` = `ejs`, folder views = `views/`.
2. Folder `public/` disajikan statis (`express.static`) sehingga `/css/...` dan `/js/...` terbaca.
3. Body form dibaca dengan `express.urlencoded({ extended: true })` (semua form memakai `method="post"`).
4. Render dengan path tanpa ekstensi, contoh: `res.render('admin/dashboard', data)`.

Opsional: jika ada proteksi CSRF, kirim `csrfToken` ke view. Setiap form otomatis menambahkan `<input name="_csrf">` bila variabel itu ada.

## 3. Variabel yang dipakai di SEMUA halaman (opsional, ada nilai bawaan)

| Variabel | Tipe | Keterangan |
|---|---|---|
| `admin` | `{ name, role }` | Nama di navbar. Bawaan: "Admin" / "Administrator" |
| `alertCount` | number | Angka merah di ikon lonceng. Bawaan 0 |
| `flash` | `{ type: 'success'\|'error', message }` | Pesan setelah simpan/hapus. Pesan sukses hilang otomatis |
| `adminBasePath` | string | Awalan URL Admin. Bawaan `/admin` |
| `logoutUrl` | string | Tujuan form logout (POST). Bawaan `/logout` |
| `csrfToken` | string | Opsional |
| `unassignedCount` | number | Lencana kuning di menu Penugasan (halaman selain dashboard dan penugasan) |

Tanggal dikirim sebagai string ISO (`'1946-03-12'`) atau objek `Date`; view yang memformatnya ke bahasa Indonesia.

## 4. Variabel per halaman

Bentuk objek yang dipakai berulang:

```js
// Lansia (resident)
{ id, fullName, birthDate, age, gender: 'L'|'P', address, phone,
  familyContactName, familyContactPhone,
  caregiver: { id, fullName, phone } | null }      // null = belum punya caregiver

// Caregiver
{ id, fullName, email, phone, address, status: 'active'|'inactive', residentCount }
```

### `admin/dashboard.ejs`
| Variabel | Isi |
|---|---|
| `stats` | `{ totalResidents, totalCaregivers, assignedResidents, unassignedResidents }` |
| `recentActivities` | array `{ type: 'medication'\|'meal'\|'vital'\|'other', title, residentName, caregiverName, createdAt }` (5 terbaru) |
| `recentAlerts` | array `{ level: 'high'\|'medium'\|'low', message, residentName, createdAt, status }` (3–5 terbaru) |

### `admin/residents.ejs`
| Variabel | Isi |
|---|---|
| `residents` | array Lansia (lengkap dengan `caregiver` atau `null`). Pencarian dan filter berjalan di sisi klien |

### `admin/resident-form.ejs` (tambah dan edit)
| Variabel | Isi |
|---|---|
| `mode` | `'create'` atau `'edit'` |
| `resident` | `null` saat tambah; objek Lansia saat edit. Saat validasi gagal, kirim ulang isian pengguna di sini agar form tidak kosong |
| `errors` | opsional, `{ fullName: 'pesan', birthDate: '...', gender, address, phone, familyContactName, familyContactPhone }` |

Nama field form: `fullName`, `birthDate` (YYYY-MM-DD), `gender` (`L`/`P`), `address`, `phone`, `familyContactName`, `familyContactPhone`.

### `admin/resident-detail.ejs`
| Variabel | Isi |
|---|---|
| `resident` | objek Lansia (dengan `caregiver` atau `null`) |

### `admin/caregivers.ejs`
| Variabel | Isi |
|---|---|
| `caregivers` | array Caregiver (termasuk `residentCount`) |

### `admin/caregiver-form.ejs`
| Variabel | Isi |
|---|---|
| `mode` | `'create'` atau `'edit'` |
| `caregiver` | `null` saat tambah; objek Caregiver saat edit |
| `errors` | opsional, kunci: `fullName, email, phone, address, password` |

Nama field form: `fullName`, `email`, `phone`, `address`, `status` (`active`/`inactive`), dan `password` (hanya saat tambah). Hapus blok `password` di view bila backend membuat sandi otomatis.

### `admin/caregiver-detail.ejs`
| Variabel | Isi |
|---|---|
| `caregiver` | objek Caregiver ditambah `residents`: array `{ id, fullName, age }` lansia yang ditangani |

### `admin/assignments.ejs`
| Variabel | Isi |
|---|---|
| `assignments` | array `{ id, residentId, residentName, caregiverId, caregiverName, assignedAt }` |
| `unassignedResidents` | array Lansia yang belum punya caregiver (`id, fullName, age`) |
| `caregivers` | array Caregiver (view hanya menampilkan yang `status === 'active'`) |
| `selectedResidentId` | opsional; memilih lansia otomatis di form (dari `?residentId=`) |
| `errors` | opsional, kunci: `residentId, caregiverId` |

Satu lansia hanya punya satu caregiver. Saat penugasan diubah, kirim `caregiverId` baru ke endpoint update.

## 5. Route yang direkomendasikan untuk backend

Form HTML hanya mendukung GET dan POST, jadi update dan hapus memakai **POST** dengan akhiran `/update` dan `/delete`. Bila tim memilih `method-override`, cukup ubah atribut `action` di view.

| Method | Path | Render / aksi | Halaman |
|---|---|---|---|
| GET | `/admin/dashboard` | render `admin/dashboard` | Dashboard |
| GET | `/admin/residents` | render `admin/residents` | Daftar lansia |
| GET | `/admin/residents/new` | render `admin/resident-form` (`mode:'create'`) | Form tambah |
| POST | `/admin/residents` | simpan lansia baru, redirect ke daftar | |
| GET | `/admin/residents/:id` | render `admin/resident-detail` | Detail lansia |
| GET | `/admin/residents/:id/edit` | render `admin/resident-form` (`mode:'edit'`) | Form edit |
| POST | `/admin/residents/:id/update` | simpan perubahan | |
| POST | `/admin/residents/:id/delete` | hapus lansia (dan penugasannya) | |
| GET | `/admin/caregivers` | render `admin/caregivers` | Daftar caregiver |
| GET | `/admin/caregivers/new` | render `admin/caregiver-form` (`mode:'create'`) | Form tambah |
| POST | `/admin/caregivers` | simpan caregiver baru | |
| GET | `/admin/caregivers/:id` | render `admin/caregiver-detail` | Detail caregiver |
| GET | `/admin/caregivers/:id/edit` | render `admin/caregiver-form` (`mode:'edit'`) | Form edit |
| POST | `/admin/caregivers/:id/update` | simpan perubahan | |
| POST | `/admin/caregivers/:id/delete` | hapus caregiver | |
| GET | `/admin/assignments` | render `admin/assignments` (baca `?residentId=`) | Penugasan |
| POST | `/admin/assignments` | body `residentId`, `caregiverId`; buat penugasan | |
| POST | `/admin/assignments/:id/update` | body `caregiverId`; ganti caregiver | |
| POST | `/admin/assignments/:id/delete` | hapus penugasan | |
| POST | `/logout` | logout (atau isi `logoutUrl`) | Tombol Keluar |

Saran perilaku: setelah POST sukses, `redirect` ke halaman daftar dengan `flash`; saat validasi gagal, render ulang form dengan `errors` dan isian pengguna.

## 6. Cara melihat tampilan tanpa backend (opsional, hanya lokal)

```bash
npm install ejs          # sekali saja, di mesin lokal
node preview/server.js   # buka http://localhost:4000/admin/dashboard
node preview/screenshot.js   # ambil ulang screenshot (butuh playwright)
```

Server preview memakai data dummy di `preview/dummy-data.js`; bentuk datanya sama dengan yang dijelaskan di atas, jadi bisa dijadikan contoh bentuk `res.render`. Folder `preview/` tidak ikut dimasukkan ke project utama.

## 7. Catatan teknis

- Ikon berupa SVG inline lewat `partials/icon.ejs`; tidak ada dependensi ikon eksternal.
- Satu-satunya sumber eksternal adalah Google Fonts (Plus Jakarta Sans) di `partials/head.ejs`. Jika offline, tampilan memakai font sistem. Hapus tiga baris `<link>` itu bila tidak diinginkan.
- Tombol hapus memakai atribut `data-delete-url`, `data-delete-name`, `data-delete-text`; dialog konfirmasi ada di `partials/delete-modal.ejs`.
- Responsif: sidebar menjadi menu geser di bawah 960px, tabel berubah menjadi kartu di bawah 760px.
- Validasi di sisi klien hanya pelengkap; backend tetap harus memvalidasi.
