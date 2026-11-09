# Integrasi CareConnect — Alert Center & Riwayat Aktivitas

## 1. Ruang Lingkup

Paket ini merupakan bagian tampilan Caregiver Alert Center pada aplikasi CareConnect.

Komponen yang disediakan:
- Halaman daftar peringatan (Alert Center).
- Halaman detail peringatan dan tindak lanjut caregiver.
- Halaman riwayat aktivitas lansia.
- Stylesheet untuk tampilan halaman.
- JavaScript untuk memperbarui jumlah alert yang belum ditangani.
- Komponen notifikasi Alert Center pada navigasi caregiver.

Paket ini **tidak membuat database, koneksi database, autentikasi, sensor, model, controller, maupun backend baru**. Seluruh data dan proses penyimpanan tetap menggunakan backend utama CareConnect.

## 2. Struktur File

```text
views/
└── caregiver/
    ├── alerts.ejs
    ├── alert-detail.ejs
    ├── activity-history.ejs
    └── partials/
        └── alert-notification.ejs

public/
├── css/
│   └── alerts.css
└── js/
    └── alerts.js
```

Salin file ke direktori yang sesuai pada project utama. Jangan mengganti atau membuat ulang struktur backend yang sudah dikerjakan anggota lain.

## 3. Kontrak Data EJS

Nama field berikut merupakan kontrak tampilan sementara. Backend perlu memetakan hasil query ke nama field ini atau menyesuaikan template dengan struktur data sebenarnya.

### A. `alerts.ejs`

Data yang dibutuhkan:
- `alerts`: array objek dengan properti:
  - `id`
  - `resident_name`
  - `alert_type`
  - `alert_type_label`
  - `description`
  - `occurred_at`
  - `priority`
  - `status`
- `unhandledCount`: jumlah alert yang belum ditangani.
- `totalAlerts`: jumlah seluruh alert.
- `highPriorityCount`: jumlah alert dengan prioritas tinggi.
- `filters`: filter yang sedang digunakan.

### B. `alert-detail.ejs`

Data yang dibutuhkan:
- `alert`: objek dengan properti:
  - `id`
  - `resident_name`
  - `alert_type`
  - `alert_type_label`
  - `description`
  - `occurred_at`
  - `priority`
  - `status`
  - `caregiver_note`
  - `acknowledged_by_name`
  - `acknowledged_at`
  - `resolved_by_name`
  - `resolved_at`
- `error`: pesan kesalahan jika ada.
- `success`: pesan keberhasilan jika ada.

### C. `activity-history.ejs`

Data yang dibutuhkan:
- `activities`: array objek dengan properti:
  - `occurred_at`
  - `resident_name`
  - `activity_type`
  - `activity_type_label`
  - `description`
  - `status`
- `residents`: array objek dengan properti `id` dan `name`.
- `filters`: objek berisi `residentId`, `from`, dan `to`.

## 4. Endpoint Integrasi

Template menggunakan endpoint berikut sebagai kontrak integrasi sementara. Sesuaikan URL apabila backend utama sudah memiliki route dengan nama berbeda.

| Metode | Endpoint | Kegunaan |
|---|---|---|
| GET | `/caregiver/alerts` | Menampilkan daftar alert |
| GET | `/caregiver/alerts/:id` | Menampilkan detail alert |
| POST | `/caregiver/alerts/:id/follow-up` | Mengirim tindak lanjut caregiver |
| GET | `/caregiver/activity-history` | Menampilkan riwayat aktivitas |
| GET | `/caregiver/alerts/summary` | Mengambil jumlah alert yang belum ditangani |

### Parameter tindak lanjut

Form tindak lanjut mengirim:
- `action`: `acknowledge` atau `resolve`.
- `note`: catatan pemeriksaan caregiver.

Backend bertanggung jawab memvalidasi perubahan status dan menyimpan catatan, identitas caregiver, serta waktu penanganan.

### Parameter filter riwayat

Halaman riwayat aktivitas menggunakan parameter query:
- `residentId`
- `from`
- `to`

Backend perlu memvalidasi parameter tersebut sebelum mengambil data.

### Format response ringkasan alert

Endpoint summary diharapkan mengembalikan JSON seperti berikut:

```json
{
  "unhandledCount": 3
}
```

Endpoint ini bersifat opsional. Jika tidak tersedia, halaman tetap dapat menampilkan jumlah alert yang dikirim melalui render server.

## 5. Integrasi Notifikasi Dashboard

Komponen notifikasi tersedia pada:

`views/caregiver/partials/alert-notification.ejs`

Untuk memasangnya, sertakan partial tersebut pada navigasi dashboard caregiver yang sudah tersedia:

```ejs
<%- include("partials/alert-notification", { unhandledCount }) %>
```

Pastikan controller dashboard mengirimkan nilai `unhandledCount`.

Jangan membuat dashboard baru hanya untuk memasang notifikasi ini.

## 6. Integrasi CSS dan JavaScript

Halaman yang menggunakan tampilan Alert Center perlu memuat stylesheet:

```html
<link rel="stylesheet" href="/css/alerts.css">
```

Halaman dashboard yang menggunakan komponen notifikasi dapat memuat JavaScript:

```html
<script src="/js/alerts.js" defer></script>
```

JavaScript melakukan pembaruan jumlah alert setiap 60 detik apabila elemen notifikasi tersedia dan endpoint summary dapat diakses.

Jika endpoint summary belum tersedia, pembaruan otomatis tidak berjalan, tetapi tampilan server tetap dapat digunakan.

## 7. Jenis Peringatan dan Status

Label jenis peringatan yang digunakan:
- `Possible Fall`
- `Outside More Than 1 Hour`
- `No Movement`
- `Sensor Offline`

Prioritas yang didukung:
- `low`
- `medium`
- `high`
- `critical`

Status alert:
- `New`
- `Acknowledged`
- `Resolved`

Jenis peringatan berbasis sensor atau simulasi tetap menjadi tanggung jawab backend atau modul terkait, bukan dibuat pada paket tampilan ini.

## 8. Keamanan dan Tanggung Jawab Integrasi

- Pertahankan penggunaan `<%= ... %>` pada EJS untuk menghasilkan output yang di-escape.
- Jangan menerima `caregiver_id` dari form sebagai identitas tepercaya.
- Identitas caregiver harus diperoleh dari sesi autentikasi yang sudah ada.
- Backend bertanggung jawab memvalidasi akses terhadap alert.
- Backend bertanggung jawab memvalidasi perubahan status.
- Backend bertanggung jawab memvalidasi filter dan parameter permintaan.
- Jangan membuat database atau koneksi MySQL kedua.
- Jangan membuat data sensor atau alert simulasi pada layer tampilan.
- Gunakan route, model, controller, dan koneksi database yang sudah disediakan oleh project utama.

## 9. Catatan

Nama endpoint, field, dan struktur response pada dokumen ini merupakan kesepakatan integrasi yang diusulkan untuk menghubungkan layer tampilan dengan backend utama.

Jika implementasi backend anggota 1 menggunakan nama atau struktur yang berbeda, lakukan penyesuaian pada pemetaan data atau template yang bersangkutan tanpa membuat infrastruktur backend baru.