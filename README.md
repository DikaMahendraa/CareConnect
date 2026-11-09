# CareConnect
### Sistem Koordinasi dan Pemantauan Perawatan Lansia

<p align="center">
  Platform berbasis web untuk mengelola data lansia, mengoordinasikan caregiver,
  dan melakukan simulasi pemantauan aktivitas.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Web%20Framework-000000?logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/EJS-Template%20Engine-B4CA65" alt="EJS">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Arsitektur-MVC-blue" alt="MVC">
</p>

---

## 1. Tentang CareConnect

**CareConnect** adalah aplikasi web yang dikembangkan untuk membantu pengelolaan dan koordinasi perawatan lansia. Aplikasi ini memungkinkan administrator mengelola data lansia, akun caregiver, serta penugasan caregiver kepada lansia. Caregiver dapat melihat lansia yang menjadi tanggung jawabnya, memantau catatan aktivitas, dan menindaklanjuti alert yang muncul.

CareConnect menyediakan alur kerja terpusat antara administrator dan caregiver. Aplikasi ini dibangun menggunakan **Node.js, Express.js, EJS, dan MySQL** dengan menerapkan pola arsitektur **Model-View-Controller (MVC)**.

> **Ruang lingkup proyek:** Aktivitas dan alert pemantauan pada versi saat ini dihasilkan melalui fitur simulasi yang dijalankan oleh administrator. CareConnect belum terhubung dengan perangkat IoT fisik, sensor radar mmWave, perangkat GPS, maupun sistem deteksi jatuh otomatis.

## 2. Identitas Kelompok

**Nama Kelompok: CareConnect**

| No. | Nama Anggota | NIM | Tanggung Jawab |
|---|---|---|---|
| 1 | Akan dilengkapi | Akan dilengkapi | Backend, database, dan integrasi sistem |
| 2 | Akan dilengkapi | Akan dilengkapi | Antarmuka administrator |
| 3 | Akan dilengkapi | Akan dilengkapi | Dashboard caregiver dan pemantauan lansia |
| 4 | Akan dilengkapi | Akan dilengkapi | Alur alert, simulasi, pengujian, dan dokumentasi |

*Lengkapi tabel ini dengan nama, NIM, dan pembagian tugas resmi seluruh anggota kelompok.*

## 3. Latar Belakang

Lansia, khususnya yang menjalani aktivitas sehari-hari secara mandiri, dapat mengalami kondisi yang membutuhkan perhatian, seperti tidak adanya pergerakan dalam waktu tertentu, kemungkinan terjatuh, atau aktivitas di luar rumah.

Tanpa sistem koordinasi yang terorganisasi, caregiver dapat mengalami kesulitan dalam memantau aktivitas lansia dan mengelola tindak lanjut ketika terjadi kondisi tertentu.

CareConnect dikembangkan sebagai solusi berbasis web untuk membantu proses tersebut melalui pengelolaan data yang terpusat, pembagian tugas caregiver, pencatatan aktivitas, dan pengelolaan alert.

## 4. Tujuan Pengembangan

1. Mempermudah pengelolaan data lansia secara terpusat.
2. Mengelola akun caregiver dan informasi yang berkaitan.
3. Mengatur penugasan caregiver kepada lansia.
4. Menyediakan informasi lansia yang menjadi tanggung jawab caregiver.
5. Mencatat aktivitas dan menampilkan alert berdasarkan aktivitas tertentu.
6. Menyediakan fitur tindak lanjut alert oleh caregiver.
7. Mendemonstrasikan alur pemantauan melalui skenario simulasi.

## 5. Fitur Aplikasi

### 5.1 Fitur Administrator

| Fitur | Deskripsi |
|---|---|
| Dashboard | Menampilkan ringkasan informasi lansia, caregiver, dan penugasan. |
| Manajemen Data Lansia | Menambah, melihat, mengubah, dan menghapus data lansia. |
| Manajemen Caregiver | Mengelola akun dan informasi caregiver. |
| Penugasan Caregiver | Menghubungkan caregiver dengan lansia yang menjadi tanggung jawabnya. |
| Simulasi Aktivitas | Membuat simulasi aktivitas lansia dan alert untuk pengujian alur pemantauan. |

### 5.2 Fitur Caregiver

| Fitur | Deskripsi |
|---|---|
| Dashboard Caregiver | Menampilkan ringkasan lansia yang ditugaskan dan informasi pemantauan. |
| Daftar Lansia | Menampilkan data lansia yang menjadi tanggung jawab caregiver. |
| Pemantauan Lansia | Melihat catatan aktivitas dan informasi pemantauan lansia. |
| Pusat Alert | Menampilkan alert yang berkaitan dengan lansia yang ditugaskan. |
| Detail Alert | Menampilkan informasi lebih lanjut mengenai alert. |
| Tindak Lanjut Alert | Memungkinkan caregiver memberikan tindakan, catatan, dan memperbarui status alert. |
| Riwayat Aktivitas | Menampilkan catatan aktivitas yang telah tersimpan. |

## 6. Simulasi Aktivitas

CareConnect menyediakan fitur simulasi untuk menggambarkan bagaimana alur pemantauan aktivitas dan pembuatan alert bekerja.

Administrator dapat membuat beberapa jenis simulasi berikut:

| Jenis Aktivitas | Keterangan | Membuat Alert |
|---|---|---|
| Normal Activity | Lansia tercatat melakukan aktivitas normal. | Tidak |
| Outside | Lansia tercatat sedang berada di luar rumah. | Tidak |
| Returned | Lansia tercatat telah kembali ke rumah. | Tidak |
| No Movement | Simulasi kondisi tidak adanya pergerakan lansia. | Ya |
| Possible Fall | Simulasi kemungkinan lansia terjatuh. | Ya |
| Sensor Offline | Simulasi kondisi sensor tidak aktif. | Ya |

Setiap simulasi disimpan sebagai catatan aktivitas. Untuk jenis aktivitas tertentu, sistem juga membuat alert yang dapat dilihat dan ditindaklanjuti oleh caregiver yang ditugaskan.

**Catatan:** Seluruh skenario tersebut merupakan data simulasi yang dibuat oleh aplikasi. Hasil simulasi bukan pembacaan sensor secara langsung dan bukan hasil diagnosis atau deteksi medis.

## 7. Alur Kerja Sistem

1. Administrator masuk ke aplikasi menggunakan akun yang tersedia.
2. Administrator menambahkan data lansia dan akun caregiver.
3. Administrator menghubungkan caregiver dengan lansia melalui fitur penugasan.
4. Administrator membuat simulasi aktivitas untuk menguji alur pemantauan.
5. Sistem menyimpan catatan aktivitas dan membuat alert apabila jenis aktivitas memerlukannya.
6. Caregiver masuk ke aplikasi dan melihat lansia yang menjadi tanggung jawabnya.
7. Caregiver memeriksa aktivitas serta alert yang muncul.
8. Caregiver melakukan tindak lanjut dan memperbarui informasi penanganan alert.

## 8. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Node.js | Menjalankan JavaScript pada sisi server. |
| Express.js | Mengelola server, routing, dan request aplikasi. |
| EJS | Menampilkan halaman web menggunakan template engine. |
| MySQL | Menyimpan dan mengelola data aplikasi. |
| mysql2 | Menghubungkan aplikasi dengan database MySQL. |
| express-session | Mengelola sesi pengguna. |
| bcrypt | Melakukan hashing dan pemeriksaan password. |
| dotenv | Mengelola konfigurasi melalui environment variable. |
| Nodemon | Memulai ulang server secara otomatis saat pengembangan. |
| HTML, CSS, JavaScript | Membangun tampilan dan interaksi pada sisi pengguna. |

## 9. Arsitektur Sistem

CareConnect menerapkan pola arsitektur **Model-View-Controller (MVC)** untuk memisahkan pengelolaan data, tampilan, dan alur logika aplikasi.

| Komponen | Tanggung Jawab |
|---|---|
| Model | Menangani query database dan pengelolaan data. |
| View | Menampilkan antarmuka aplikasi menggunakan template EJS. |
| Controller | Memproses request, mengatur alur aplikasi, dan menentukan response. |
| Routes | Menghubungkan URL dan metode HTTP dengan controller. |
| Middleware | Menangani autentikasi, otorisasi role, dan proses request lainnya. |
| Config | Menyimpan konfigurasi aplikasi dan koneksi database. |

### Diagram Alur MVC

```text
Pengguna / Browser
        |
        v
   Express Routes
        |
        v
    Middleware
 (Autentikasi / Role)
        |
        v
    Controller
        |
        v
      Model
        |
        v
   MySQL Database

    Controller
        |
        v
      EJS View
        |
        v
   HTML Response
```

## 10. Struktur Database

Database utama aplikasi bernama **CareConnect**, dengan tabel-tabel inti berikut:

| Nama Tabel | Kegunaan |
|---|---|
| `users` | Menyimpan informasi akun administrator dan caregiver. |
| `residents` | Menyimpan profil serta informasi kontak lansia. |
| `care_assignments` | Menyimpan hubungan penugasan caregiver dengan lansia. |
| `activity_events` | Menyimpan catatan aktivitas lansia, termasuk aktivitas simulasi. |
| `alerts` | Menyimpan alert yang dihasilkan dari jenis aktivitas tertentu. |
| `alert_actions` | Menyimpan tindakan dan catatan tindak lanjut caregiver terhadap alert. |

### Relasi Utama

- Akun caregiver terhubung dengan lansia melalui tabel `care_assignments`.
- Satu lansia dapat memiliki beberapa catatan aktivitas.
- Catatan aktivitas tertentu dapat memiliki alert.
- Satu alert dapat memiliki beberapa catatan tindak lanjut pada tabel `alert_actions`.

## 11. Struktur Folder Proyek

Berikut gambaran struktur direktori aplikasi berdasarkan pola MVC. Struktur dapat berkembang mengikuti proses pengembangan.

```text
CareConnect/
├── config/              # Konfigurasi aplikasi dan database
├── controllers/         # Pengolahan request dan logika aplikasi
├── middleware/          # Autentikasi dan otorisasi
├── models/              # Query database dan pengelolaan data
├── routes/              # Definisi route Express
├── views/
│   ├── admin/           # Halaman dan partial administrator
│   └── caregiver/       # Halaman caregiver
├── public/
│   ├── css/             # File stylesheet
│   ├── js/              # JavaScript sisi browser
│   └── assets/          # Gambar dan aset statis
├── .env.example         # Contoh konfigurasi environment
├── app.js               # File utama aplikasi Express
└── package.json         # Informasi proyek dan dependensi
```

## 12. Instalasi dan Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan CareConnect pada komputer lokal.

### 12.1 Persiapan

Pastikan perangkat telah memiliki:

- [Node.js](https://nodejs.org/) (disarankan versi LTS).
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
- [Git](https://git-scm.com/).
- [Visual Studio Code](https://code.visualstudio.com/) atau editor kode lainnya.

### 12.2 Clone Repository

Buka terminal, kemudian jalankan:

```bash
git clone https://github.com/DikaMahendraa/CareConnect.git
cd CareConnect
```

### 12.3 Instal Dependensi

Jalankan perintah:

```bash
npm install
```

### 12.4 Membuat Database

Buka MySQL, kemudian buat database:

```sql
CREATE DATABASE CareConnect;
```

Selanjutnya, impor atau jalankan struktur database dan data awal proyek apabila tersedia di repository. Aplikasi membutuhkan tabel-tabel yang dijelaskan pada bagian Struktur Database.

### 12.5 Konfigurasi Environment

Buat file `.env` pada direktori utama berdasarkan file `.env.example`.

Contoh konfigurasi:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASS=password_mysql_kamu
DB_NAME=CareConnect
DB_PORT=3306

SESSION_SECRET=ganti_dengan_secret_random_yang_kuat
```

Sesuaikan nilai konfigurasi dengan pengaturan MySQL pada komputer masing-masing. Jangan mengunggah file `.env` yang berisi password atau secret asli ke repository publik.

### 12.6 Menjalankan Server

Untuk menjalankan aplikasi dalam mode pengembangan:

```bash
npm run dev
```

Jika perintah tersebut tidak tersedia, periksa script yang terdaftar di dalam `package.json`.

Setelah server berjalan, buka browser dan akses:

```text
http://localhost:3000
```

## 13. Autentikasi dan Keamanan

Aplikasi menyediakan akses berdasarkan peran pengguna, yaitu administrator dan caregiver.

Beberapa mekanisme keamanan yang digunakan atau perlu diperhatikan:

- Password pengguna diproses menggunakan bcrypt.
- Sesi pengguna dikelola menggunakan session-based authentication.
- Route tertentu dilindungi middleware autentikasi dan otorisasi role.
- Query database menggunakan driver MySQL dan parameter terikat pada bagian yang telah diterapkan.
- Konfigurasi sensitif disimpan melalui environment variable.

Untuk penggunaan pada lingkungan produksi, diperlukan penguatan keamanan tambahan seperti HTTPS, pengaturan cookie yang aman, verifikasi perlindungan CSRF, validasi input, pembatasan percobaan request, dan penyimpanan session yang sesuai untuk produksi.

## 14. Panduan Pengujian

Skenario berikut dapat digunakan untuk menguji alur utama aplikasi:

1. Masuk menggunakan akun administrator.
2. Tambahkan data lansia.
3. Buat akun caregiver.
4. Tetapkan caregiver kepada lansia.
5. Buka halaman simulasi aktivitas.
6. Buat simulasi aktivitas normal dan periksa apakah catatan aktivitas tersimpan.
7. Buat simulasi kemungkinan jatuh atau tidak ada pergerakan, kemudian periksa apakah alert berhasil dibuat.
8. Masuk menggunakan akun caregiver yang telah ditugaskan.
9. Buka pusat alert dan periksa alert yang dihasilkan.
10. Lakukan tindak lanjut dan periksa perubahan informasi atau status alert.

Gunakan akun pengujian dan data contoh yang tidak memuat informasi pribadi sebenarnya selama proses pengembangan.

## 15. Batasan Sistem Saat Ini

- Aktivitas dibuat melalui fitur simulasi secara manual.
- Aplikasi belum menerima data dari sensor fisik atau perangkat IoT.
- Alert terkait kemungkinan jatuh merupakan hasil simulasi, bukan deteksi medis yang tervalidasi.
- Pengiriman notifikasi secara real-time belum menjadi kemampuan yang dijamin pada versi ini.
- Integrasi perangkat pemantauan fisik dan penerapan produksi berada di luar cakupan implementasi saat ini.

## 16. Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dipertimbangkan pada tahap berikutnya:

- Integrasi dengan radar mmWave atau perangkat sensor non-kamera lainnya.
- Penerimaan data aktivitas secara real-time.
- Penerapan machine learning untuk klasifikasi aktivitas dan deteksi jatuh.
- Pengiriman notifikasi kepada caregiver dan keluarga.
- Penyajian riwayat pemantauan dan analisis aktivitas yang lebih lengkap.
- Peningkatan perlindungan privasi, kebijakan penyimpanan data, dan audit aktivitas.
- Pengujian otomatis serta deployment ke server produksi.

## 17. Kontribusi Tim

CareConnect dikembangkan secara kolaboratif oleh anggota kelompok dengan pembagian pekerjaan pada pengembangan backend, pengelolaan database, antarmuka administrator dan caregiver, fitur simulasi, pengujian, serta dokumentasi.

Rincian kontribusi setiap anggota dapat dilengkapi pada bagian Identitas Kelompok. Riwayat perubahan kode juga dapat dilihat melalui commit pada repository GitHub.

## 18. Lisensi

Proyek ini dikembangkan untuk keperluan akademik. Apabila belum terdapat file lisensi khusus di repository, seluruh hak atas kode dan materi proyek tetap berada pada para pengembang.

---

<p align="center">
  <strong>CareConnect — Menghubungkan Caregiver, Mendukung Kehidupan Lansia yang Mandiri.</strong>
</p>
