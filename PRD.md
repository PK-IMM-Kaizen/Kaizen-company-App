# PRD (Product Requirements Document)

## 1. Ringkasan Produk
Aplikasi web Next.js untuk PK IMM Kaizen yang mencakup:
- website publik organisasi,
- dashboard admin berbasis role,
- API internal terbatas untuk manajemen user,
- integrasi Supabase (Auth, Database, Storage),
- halaman unit bisnis `Kaizen Company`.

## 2. Tujuan Produk
1. Menyediakan kanal informasi resmi organisasi.
2. Mempermudah pengelolaan konten organisasi oleh pengurus.
3. Menyediakan kanal partisipasi publik (DAD & aspirasi).
4. Mendukung promosi dan pemesanan produk unit usaha.

## 3. Scope

### 3.1 In Scope (terimplementasi)
- Halaman publik: beranda, profil, berita list/detail, kepengurusan, bidang, alumni, kontak, daftar DAD, aspirasi.
- Halaman admin: dashboard overview + modul CRUD/operasional.
- Login admin via Supabase Auth.
- API route internal: `/api/users` (GET/POST/PATCH/DELETE).
- Integrasi storage Supabase untuk upload aset (foto/logo).

### 3.2 Out of Scope / Tidak ditemukan di repository
- Integrasi payment gateway.
- API publik non-Supabase selain `/api/users`.
- Test automation (unit/integration/e2e) khusus fitur.
- Skema migrasi database SQL resmi.

## 4. Functional Requirements

| ID | Requirement | Prioritas | Traceability |
|---|---|---|---|
| FR-01 | Pengguna dapat melihat konten beranda (agenda, berita, BPH) | High | `src/app/(public)/page.tsx` |
| FR-02 | Pengguna dapat melihat berita publik & detail berita | High | `src/app/(public)/berita/page.tsx`, `src/app/(public)/berita/[id]/page.tsx` |
| FR-03 | Pengguna dapat mengirim aspirasi | High | `src/app/(public)/aspirasi/page.tsx` |
| FR-04 | Pengguna dapat mengirim pendaftaran DAD saat pendaftaran dibuka | High | `src/app/(public)/daftar-dad/page.tsx` |
| FR-05 | Admin dapat login ke dashboard | High | `src/app/login/page.tsx`, `src/app/(admin)/dashboard/layout.tsx` |
| FR-06 | Admin dapat CRUD data berita | High | `src/app/(admin)/dashboard/berita/page.tsx` |
| FR-07 | Admin dapat CRUD data pengurus | High | `src/app/(admin)/dashboard/kepengurusan/page.tsx` |
| FR-08 | Admin dapat CRUD data alumni | High | `src/app/(admin)/dashboard/alumni/page.tsx` |
| FR-09 | Admin dapat CRUD produk Ekowir | High | `src/app/(admin)/dashboard/ekowir/page.tsx`, `src/app/kaizen-company/page.tsx` |
| FR-10 | Admin dapat kelola profil organisasi | Medium | `src/app/(admin)/dashboard/organisasi/page.tsx` |
| FR-11 | Admin dapat kelola profil bidang | Medium | `src/app/(admin)/dashboard/bidang/page.tsx` |
| FR-12 | Admin dapat verifikasi & ekspor pendaftar DAD | High | `src/app/(admin)/dashboard/daftar-dad/page.tsx` |
| FR-13 | Admin dapat triase status aspirasi + catatan admin | High | `src/app/(admin)/dashboard/aspirasi/page.tsx` |
| FR-14 | Superadmin dapat kelola akun pengurus via API internal | High | `src/app/(admin)/dashboard/users/page.tsx`, `src/app/api/users/route.ts` |

## 5. Non-Functional Requirements
- **NFR-01 Performance**: render web responsif dengan Next.js App Router.
- **NFR-02 UX**: desain mobile-first dan komponen interaktif.
- **NFR-03 Security Baseline**: penggunaan env variable Supabase; namun beberapa kontrol otorisasi server-side belum terlihat eksplisit.
- **NFR-04 SEO**: metadata, `robots.ts`, `sitemap.ts` tersedia.
- **NFR-05 Maintainability**: struktur route per domain fitur (public/admin/api).

## 6. User Story / Use Case
- Sebagai mahasiswa, saya ingin mengirim aspirasi agar suara saya diterima pengurus.
- Sebagai calon peserta, saya ingin mendaftar DAD secara online.
- Sebagai admin, saya ingin memverifikasi pendaftar DAD dan mengubah statusnya.
- Sebagai admin, saya ingin mengelola berita agar publikasi selalu update.
- Sebagai pengunjung, saya ingin melihat produk Kaizen Company lalu menghubungi admin via WhatsApp.

## 7. Acceptance Criteria (contoh terukur)
1. **Aspirasi publik**
   - Form wajib kategori dan pesan.
   - Data berhasil tersimpan ke tabel `aspirations`.
2. **Pendaftaran DAD**
   - Jika setting `is_dad_open` false, form tidak bisa dioperasikan normal (overlay “Coming Soon”).
   - Submit sukses menyimpan data ke `dad_registrations`.
3. **Dashboard berita**
   - Admin bisa tambah/edit/hapus berita.
   - List berita menampilkan status draft/published.
4. **Manajemen user**
   - `/api/users` dapat create/update/delete user Auth dan update role di `profiles`.

## 8. Aturan Bisnis yang Terlihat
- Pendaftaran DAD bergantung pada `site_settings.key = is_dad_open`.
- Role dashboard disimpan dan dicek via `localStorage` (`userRole`, `isAuthenticated`).
- Produk preorder memiliki atribut tambahan (`is_preorder`, `po_duration`, `dp_amount`).
- Berita publik hanya menampilkan `status = published`.

## 9. Prioritas
- **Must Have**: login admin, CRUD konten inti, aspirasi, DAD, publikasi berita.
- **Should Have**: pengelolaan organisasi & bidang, dashboard statistik.
- **Could Have**: penguatan observability, validasi role/authorization server-side lebih ketat.

## 10. Edge Cases
- Data kosong dari Supabase (ditangani dengan state empty/loading di banyak halaman).
- Upload gambar gagal (ditangani alert/error console).
- Status aspirasi tidak konsisten (`unread` dari publik vs asumsi admin). **Perlu konfirmasi skema final**.
- Pemanggilan `/api/users/status` dari UI tapi route tidak ditemukan. **Perlu konfirmasi implementasi yang hilang**.

## 11. Traceability Tambahan per Modul
- Public routes: `src/app/(public)/*`
- Admin routes: `src/app/(admin)/dashboard/*`
- Internal API: `src/app/api/users/route.ts`
- Supabase clients: `src/lib/supabase/*`, penggunaan langsung `createBrowserClient/createClient` di banyak halaman.
- SEO/runtime metadata: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`.
