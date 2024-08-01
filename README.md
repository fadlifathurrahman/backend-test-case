# Backend Test Case

## Data Flow Diagram
![dfd](https://github.com/user-attachments/assets/9eea311d-5c8a-4b5a-beab-d1015110f2d3)

## Use Case

- Members can borrow books with conditions
    - [ ]  Members may not borrow more than 2 books
    - [ ]  Borrowed books are not borrowed by other members
    - [ ]  Member is currently not being penalized
- Member returns the book with conditions
    - [ ]  The returned book is a book that the member has borrowed
    - [ ]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - [ ]  Shows all existing books and quantities
    - [ ]  Books that are being borrowed are not counted
- Member check
    - [ ]  Shows all existing members
    - [ ]  The number of books being borrowed by each member


# How to Start
Repository ini berisi aplikasi backend yang dikembangkan menggunakan Node.js, Express.js, dan MySQL. Aplikasi ini menyediakan berbagai endpoint untuk pengujian dan diatur menggunakan `pnpm`.

## Persyaratan Sistem

Pastikan sistem Anda memiliki perangkat lunak berikut:
- Node.js (versi terbaru)
- `pnpm` (paket manajer yang diinstal secara global)
- MySQL (versi terbaru)

## Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/fadlifathurrahman/backend-test-case.git
   cd backend-test-case
   ```

2. **Instalasi Dependencies**
   Pastikan `pnpm` telah terinstal. Jika belum, Anda bisa menginstalnya dengan:
   ```bash
   npm install -g pnpm
   ```
   Setelah `pnpm` terinstal, jalankan perintah berikut untuk menginstal dependencies:
   ```bash
   pnpm install
   ```

## Pengaturan Database

1. **Buat Database**
   Pastikan Anda memiliki server MySQL yang berjalan. Buat database baru untuk aplikasi ini.

2. **Konfigurasi Koneksi Database**
   Sesuaikan konfigurasi database di file `.env` atau file konfigurasi yang relevan dengan kredensial database Anda.

## Menjalankan Aplikasi

Setelah semua dependensi diinstal dan database diatur, jalankan aplikasi dengan perintah berikut:

```bash
pnpm start
```

Aplikasi ini akan berjalan pada port yang ditentukan di file konfigurasi (default: 3000). Anda dapat mengakses API melalui `http://localhost:3000`.

## Pengujian API

Untuk pengujian API, aplikasi ini menggunakan Swagger sebagai dokumentasi dan alat pengujian. Ikuti langkah-langkah berikut untuk mengakses Swagger:

1. Jalankan aplikasi dengan `pnpm start` seperti yang dijelaskan sebelumnya.
2. Buka browser Anda dan navigasikan ke `http://localhost:3000/api-docs` untuk mengakses antarmuka Swagger.
3. Di sini, Anda dapat melihat dokumentasi API dan menguji endpoint yang tersedia.

---
