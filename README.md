# Belajar LinkedIn Class API

Project ini adalah **REST API sederhana** menggunakan **Node.js, Express, dan PostgreSQL** untuk simulasi sistem kelas online.  
Mendukung **User Management, Class Management, dan Enrollments** dengan role `user` dan `admin`.

---

## 🚀 Cara Install & Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/RayyanHermanto/Belajar-LinkedIn-API.git
cd Belajar-LinkedIn-API
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
- Pastikan PostgreSQL sudah terinstall dan service berjalan.
- Jika belum ada database dengan nama **belajar_linkedin_class**, maka akan dibuat database baru secara otomatis.
- User hanya perlu menjalankan project ketika PostgreSQL aktif, tanpa perlu membuat database manual.

### 4. Konfigurasi Environment
File `.env` sudah tersedia di root project.  
Cukup ubah bagian `password` agar sesuai dengan password PostgreSQL di komputer masing-masing

### 5. Jalankan Server
```bash
npm run dev
```
atau
```bash
node index.js
```

Server akan berjalan di:
```
http://localhost:3000
```

---

## 📬 Testing API dengan Postman
Untuk mencoba semua **request & response JSON**, gunakan **Postman**.  
File collection tersedia dengan nama:

```
Belajar_LinkedIn_Class.postman_collection.json
```

Import file tersebut ke Postman agar bisa langsung mencoba endpoint.

---

## 📌 List Fitur

### User
- Registrasi user
- Registrasi Admin
- Login
- Mendapatkan data user (id, nama, email, role, tanggal pembuatan)

### Class
- Menambahkan Kelas (**Khusus Admin**)
- List semua kelas
- Detail Kelas (berdasarkan id kelas)
- Edit Detail kelas (**Khusus Admin**)
- Menghapus kelas (**Khusus Admin**)

### Enrollment
- Enroll user ke kelas (user sekarang)
- Enroll user ke kelas (Admin menambahkan User ke kelas)
- Enrollments user sekarang
- Semua Enrollments
- Unenroll dari kelas (user sekarang)
- Unenroll user dari kelas (**Khusus Admin**)

---

## 📑 Endpoint List

### 🧑 User
| Method | Endpoint              | Deskripsi |
|--------|-----------------------|-----------|
| POST   | `/api/users/register` | Registrasi user |
| POST   | `/api/users/login`    | Login user/admin |
| GET    | `/api/users/me`       | Mendapatkan data user login |

### 📚 Classes
| Method | Endpoint                        | Deskripsi |
|--------|---------------------------------|-----------|
| GET    | `/api/classes`                  | List semua kelas |
| POST   | `/api/classes/admin`            | Tambah kelas (Admin) |
| GET    | `/api/classes/{Class_id}`       | Detail kelas |
| PUT    | `/api/classes/admin/{Class_id}` | Edit kelas (Admin) |
| DELETE | `/api/classes/admin/{Class_id}` | Hapus kelas (Admin) |

### 🎓 Enrollments
| Method | Endpoint                                 | Deskripsi |
|--------|------------------------------------------|-----------|
| POST   | `/api/enrollments/{Class_id}`            | Enroll user ke kelas (self) |
| POST   | `/api/enrollments/admin/{Class_id}`      | Enroll user lain ke kelas (Admin) |
| GET    | `/api/enrollments/me`                    | Lihat enrollments user login |
| GET    | `/api/enrollments/class/{Class_id}`      | Lihat semua user dalam kelas |
| DELETE | `/api/enrollments/{Class_id}`            | Unenroll dari kelas (self) |
| DELETE | `/api/enrollments/{Class_id}/{User_id}`  | Hapus user dari kelas (Admin) |

---

## 🛠️ Tech Stack
- **Node.js** + **Express**
- **PostgreSQL**
- **JWT Authentication**
- **pg library** untuk koneksi database

---

## ✨ Author
Developed by [Rayyan Hermanto](https://github.com/RayyanHermanto)
