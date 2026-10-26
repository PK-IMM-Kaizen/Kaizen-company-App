# API Spesification

Dokumen ini hanya mencatat API yang **benar-benar ditemukan** di repository.

## 1. Ringkasan

### 1.1 Internal Next.js API Route
- Base path: `/api`
- Endpoint ditemukan:
  - `GET /api/users`
  - `POST /api/users`
  - `PATCH /api/users`
  - `DELETE /api/users?id=...`

Sumber: `src/app/api/users/route.ts`.

### 1.2 Endpoint yang Dipanggil UI tetapi Tidak Ditemukan
- `PATCH /api/users/status` dipanggil dari `src/app/(admin)/dashboard/users/page.tsx`, tetapi file route terkait **tidak ditemukan di repository**.

## 2. Authentication & Authorization

### 2.1 Internal API `/api/users`
- Tidak ada pemeriksaan session/JWT/role secara eksplisit di route handler.
- Route memakai Supabase service role key pada server:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 Akses data lain
- Mayoritas halaman mengakses Supabase langsung dari browser menggunakan anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## 3. Header Umum
- Request JSON menggunakan:
  - `Content-Type: application/json`
- Tidak ditemukan requirement header custom lain.

## 4. Detail Endpoint

## 4.1 `GET /api/users`
Mengambil daftar user dari tabel `profiles`.

### Request
- Body: tidak ada
- Query: tidak ada

### Response Sukses
- `200 OK`
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "admin@domain.com",
      "role": "superadmin",
      "is_active": true
    }
  ]
}
```

### Response Error
- `500 Internal Server Error`
```json
{ "error": "<error_message>" }
```

### Sorting
- Diurutkan berdasarkan `email ASC`.

---

## 4.2 `POST /api/users`
Membuat user baru pada Supabase Auth dan mengupdate role di tabel `profiles`.

### Request Body
```json
{
  "email": "user@kaizen.id",
  "password": "minimal6char",
  "role": "admin"
}
```

### Validasi yang terlihat
- Validasi eksplisit di route: **tidak ditemukan**.
- Validasi praktis mengikuti error dari Supabase Auth.

### Response Sukses
- `200 OK`
```json
{
  "success": true,
  "message": "Akun berhasil dibuat!"
}
```

### Response Error
- `400 Bad Request`
```json
{ "error": "<error_message>" }
```

---

## 4.3 `PATCH /api/users`
Update role user dan opsional reset password.

### Request Body
```json
{
  "id": "uuid",
  "role": "superadmin",
  "password": "optional-new-password"
}
```

### Behavior
- Jika `password` ada, route memanggil `auth.admin.updateUserById`.
- Selalu update `profiles.role` berdasarkan `id`.

### Response Sukses
- `200 OK`
```json
{
  "success": true,
  "message": "Data akun berhasil diperbarui!"
}
```

### Response Error
- `400 Bad Request`
```json
{ "error": "<error_message>" }
```

---

## 4.4 `DELETE /api/users?id=<uuid>`
Menghapus user Supabase Auth berdasarkan query parameter `id`.

### Request
- Query param wajib: `id`

### Response Sukses
- `200 OK`
```json
{
  "success": true,
  "message": "Akun berhasil dihapus!"
}
```

### Response Error
- `400 Bad Request`
```json
{ "error": "<error_message>" }
```

## 5. Status Code yang Terpakai
- `200`: sukses operasi.
- `400`: error validasi/operasi (POST/PATCH/DELETE).
- `500`: error server pada GET list users.

## 6. Pagination / Filtering / Sorting
- Internal `/api/users`: hanya sorting `order('email', { ascending: true })`.
- Pagination/filtering API internal: **tidak ditemukan**.

## 7. Format Schema / OpenAPI
- File OpenAPI/Swagger/schema formal: **Tidak ditemukan di repository**.

## 8. API Eksternal yang Dipakai di Aplikasi
- Supabase Database API (query tabel melalui JS client).
- Supabase Auth API (login admin dan admin user management).
- Supabase Storage API (upload/getPublicUrl untuk foto/logo).
- WhatsApp deep link (`https://wa.me/...`) untuk kontak/checkout.
