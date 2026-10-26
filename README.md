# PK IMM Kaizen — Company App

Portal digital PK IMM Kaizen yang menggabungkan website publik organisasi, dashboard pengelolaan konten, kanal aspirasi, pendaftaran DAD, serta etalase unit bisnis Kaizen Company/Ekowir.

Aplikasi ini dibangun dengan Next.js App Router dan menggunakan Supabase sebagai backend utama untuk authentication, database, dan storage.

## Fitur Utama

### Website publik

- Beranda dengan agenda, berita terbaru, dan struktur BPH.
- Profil organisasi.
- Daftar dan detail berita dengan filter kategori serta pencarian.
- Informasi kepengurusan berdasarkan bidang/divisi.
- Profil bidang organisasi.
- Alumni inspiratif.
- Halaman kontak dengan Instagram, WhatsApp, email, alamat, dan Google Maps.
- Form aspirasi mahasiswa.
- Form pendaftaran DAD yang dikendalikan oleh setting `is_dad_open`.
- Katalog produk Kaizen Company/Ekowir dengan kontak atau checkout melalui WhatsApp.

### Dashboard admin

Dashboard tersedia pada route `/dashboard` setelah login melalui `/login`.

- Ringkasan statistik berita, produk, pengurus, dan alumni.
- Kelola pendaftar DAD.
- Kelola aspirasi.
- Kelola alumni.
- Kelola berita.
- Kelola agenda kegiatan.
- Kelola kepengurusan.
- Kelola profil bidang.
- Kelola produk Ekowir.
- Kelola profil organisasi.
- Kelola pengguna dan akses untuk role `superadmin`.

Akses menu dashboard dibedakan berdasarkan role `admin` dan `superadmin`. Implementasi guard dashboard saat ini menggunakan nilai `isAuthenticated` dan `userRole` pada `localStorage`, kemudian melakukan login/logout melalui Supabase Auth.

## Tech Stack

| Area | Teknologi |
|---|---|
| Framework | Next.js `16.3.5` dengan App Router |
| UI | React `19.2.8`, TypeScript |
| Styling | Tailwind CSS `4.3.3`, PostCSS |
| Backend service | Supabase |
| Authentication | Supabase Auth |
| Database | Supabase Postgres melalui `@supabase/supabase-js` |
| Storage | Supabase Storage |
| Icons | Lucide React dan React Icons |
| Code quality | ESLint `9` dan `eslint-config-next` |

## Struktur Repository

```text
.
├── public/                         # aset statis gambar dan video
├── src/
│   ├── app/
│   │   ├── (public)/               # halaman website publik
│   │   ├── (admin)/dashboard/      # dashboard dan modul admin
│   │   ├── api/users/              # API internal manajemen pengguna
│   │   ├── kaizen-company/         # halaman unit bisnis/katalog produk
│   │   ├── login/                  # halaman login admin
│   │   ├── layout.tsx              # root layout dan metadata
│   │   ├── robots.ts               # konfigurasi robots
│   │   └── sitemap.ts              # sitemap
│   ├── components/common/          # komponen bersama seperti Navbar, Footer, Logo
│   ├── lib/supabase/               # Supabase browser/server client
│   ├── types/                      # tipe TypeScript
│   └── utils/supabase/             # helper Supabase tambahan
├── Product Discovery.md            # dokumentasi product discovery
├── PRD.md                          # product requirements document
├── API Spesification.md            # spesifikasi API yang ditemukan di code
├── Database Design.md               # dokumentasi tabel dan storage Supabase
├── Design.md                       # arsitektur dan desain sistem
├── next.config.ts                  # konfigurasi Next.js dan remote images
├── package.json                    # dependency dan scripts
└── eslint.config.mjs               # konfigurasi ESLint
```

## Prasyarat

- Node.js dengan npm.
- Project Supabase yang aktif.
- Akses ke Supabase URL, anon key, dan service role key untuk operasi server admin.

Versi Node.js minimum tidak didefinisikan secara eksplisit di repository. Gunakan versi Node.js yang kompatibel dengan Next.js `16.3.5`.

## Instalasi

```bash
git clone https://github.com/PK-IMM-Kaizen/Kaizen-company-App.git
cd Kaizen-company-App
npm install
```

## Konfigurasi Environment

Buat file `.env.local` di root repository:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
```

Variabel yang digunakan oleh source code:

- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key untuk browser/server client.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key yang digunakan oleh route `/api/users`.

> **Peringatan keamanan:** jangan commit `.env.local` atau membagikan `SUPABASE_SERVICE_ROLE_KEY`. Key tersebut memiliki hak istimewa dan hanya boleh digunakan di server.

File `.env.example` tidak ditemukan di repository; daftar variabel di atas diturunkan dari penggunaan `process.env` pada source code.

## Menjalankan Aplikasi

### Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

Script test unit, integration, atau end-to-end tidak didefinisikan pada `package.json` saat dokumentasi ini diperbarui.

## API Internal

Aplikasi memiliki route handler Next.js berikut:

| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/users` | Mengambil daftar user dari `profiles` dan mengurutkannya berdasarkan email. |
| `POST` | `/api/users` | Membuat user Supabase Auth dan mengatur role pada `profiles`. |
| `PATCH` | `/api/users` | Mengubah role dan, bila dikirim, password user. |
| `DELETE` | `/api/users?id=<uuid>` | Menghapus user dari Supabase Auth. |

Detail request, response, error, dan keterbatasan API tersedia di [`API Spesification.md`](./API%20Spesification.md).

> Catatan: UI memanggil `PATCH /api/users/status`, tetapi route tersebut tidak ditemukan di repository. Otorisasi server-side eksplisit pada `/api/users` juga belum terlihat di source code dan perlu diperkuat sebelum deployment production.

## Database dan Storage

Data aplikasi diakses dari Supabase. Tabel yang digunakan oleh source code antara lain:

- `profiles`
- `news`
- `agendas`
- `pengurus`
- `divisions`
- `alumni`
- `products`
- `aspirations`
- `dad_registrations`
- `site_settings`
- `organization_profile`
- `system_logs`

Bucket storage yang terdeteksi:

- `alumni_photos`
- `pengurus_photos`
- `ekowir_images`
- `organization-assets`

Migration SQL, constraint, foreign key, index, enum database, dan RLS policy tidak ditemukan di repository. Detail field yang diinferensikan dari source code tersedia di [`Database Design.md`](./Database%20Design.md).

## Dokumentasi Teknis

- [`Product Discovery.md`](./Product%20Discovery.md)
- [`PRD.md`](./PRD.md)
- [`API Spesification.md`](./API%20Spesification.md)
- [`Database Design.md`](./Database%20Design.md)
- [`Design.md`](./Design.md)

## Deployment

Konfigurasi CI/CD atau target deployment final tidak ditemukan di repository. `next.config.ts` hanya mengizinkan remote image dari Supabase Storage pada domain project yang dikonfigurasi.

Untuk deployment, pastikan environment variable Supabase tersedia pada runtime dan jalankan build production:

```bash
npm run build
npm run start
```

Deployment ke Vercel memungkinkan secara teknis karena aplikasi menggunakan Next.js, tetapi konfigurasi deployment khusus Vercel tidak ditemukan di repository dan perlu dikonfirmasi.

## Catatan Pengembangan

- Sebagian besar halaman publik dan dashboard melakukan query langsung ke Supabase dari browser menggunakan anon key.
- Login menggunakan `supabase.auth.signInWithPassword`.
- Logout menggunakan `supabase.auth.signOut` dan menghapus state autentikasi dari `localStorage`.
- Image remote dari Supabase Storage telah dikonfigurasi pada `next.config.ts`.
- Beberapa operasi admin mencatat aktivitas ke tabel `system_logs`.
- Status aspirasi perlu diseragamkan karena form publik menggunakan `unread`, sedangkan dashboard mengasumsikan status seperti `pending`, `process`, dan `resolved`.

## Status Proyek

Repository berisi aplikasi web organisasi yang sedang dikembangkan. README ini dan dokumen teknis terkait menjelaskan implementasi yang terdeteksi pada source code saat pembaruan dilakukan; detail infrastruktur Supabase yang berada di luar repository tetap perlu dikonfirmasi pada project Supabase terkait.
