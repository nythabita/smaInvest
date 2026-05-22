# VirtualCloset — The Clueless Experience

Sebuah *prototype* aplikasi (Vue 3) untuk alat bantu memilih pakaian yang terinspirasi dari gaya film *Clueless*. Aplikasi ini memiliki estetika "Cewek Bumi" (warna-warna tanah yang hangat), terasa premium, dan memiliki fitur andalan **Clueless Slider** untuk memadupadankan (mix-and-match) tiga lapisan pakaian.

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Bagi kamu yang baru belajar, ini adalah alat-alat yang membuat aplikasi ini berjalan:
- **Vue 3**: Kerangka kerja (*framework*) utama. Kita menggunakan `Composition API` dan `<script setup>` agar kodenya lebih rapi dan modern.
- **Vite**: Alat bantu agar saat kita "coding", perubahannya langsung muncul di browser dengan sangat cepat.
- **Tailwind CSS**: Alat untuk mendesain tampilan web tanpa harus menulis kode CSS manual yang panjang. Warna-warna kustomnya ada di file `tailwind.config.js`.
- **Lucide Vue**: Pustaka (*library*) untuk menampilkan ikon-ikon cantik (`lucide-vue-next`).
- **CSS scroll-snap murni**: Fitur bawaan browser agar saat kita geser (*scroll*) daftar pakaian, posisinya bisa otomatis pas ke tengah tanpa perlu tambahan *library* animasi yang berat.

## 🚀 Cara Menjalankan Aplikasi

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) di komputermu, lalu ikuti langkah ini di terminal aplikasi komputermu (atau terminal di VS Code):

```bash
# 1. Instal semua alat yang dibutuhkan (hanya perlu sekali di awal)
npm install

# 2. Jalankan server lokal
npm run dev
```

Setelah itu, buka link yang muncul (biasanya `http://localhost:5173`) di browsermu.

## 📁 Struktur Proyek (Project Structure)

Agar tidak bingung mencari file saat ngoding, ini panduannya:

```text
.
├── index.html                  # File HTML utama, tempat kita memasang Font (Inter & Fraunces)
├── tailwind.config.js          # Pengaturan warna kustom (cream/beige/tan/espresso)
├── vite.config.js              # Pengaturan sistem server Vite
└── src/                        # Semua kode yang akan kamu tulis/ubah ada di sini!
    ├── main.js                 # Pintu masuk utama aplikasi
    ├── style.css               # Pengaturan gaya (CSS) dasar untuk Tailwind
    ├── App.vue                 # File Bos! Seluruh halaman web ada di sini (Hero, Slider, Kamera)
    ├── components/
    │   ├── OutfitItem.vue      # Kode untuk satu kartu baju (menampilkan gambar & nama baju)
    │   └── CameraCapture.vue   # Kode sistem yang menyalakan webcam/kamera HP
    └── data/
        └── outfits.js          # Data daftar baju bawaan (lapisan & jenis baju) disimpan di sini.
```

## 🪄 Bagaimana Cara Kerja "Clueless Slider"?

Setiap lapisan baju (Kepala, Atasan, Bawahan) menggunakan fitur CSS bawaan bernama **scroll-snap**. Ini membuat setiap kartu baju yang digeser akan selalu berhenti tepat di tengah layar:

```css
/* Rahasia jepretan sempurna di CSS */
.snap-rail { scroll-snap-type: x mandatory; }
.snap-rail > * { scroll-snap-align: center; }
```

Keuntungannya? Geseran terasa mulus seperti aplikasi HP asli, 60fps, dan gratis (tanpa perlu repot menginstal *library* animasi tambahan yang bikin web jadi lambat).

**Sistem Mengingat Baju (State)**
Di dalam file `App.vue`, kita memiliki "ingatan" (variabel `state`) untuk mencatat:
- **`activeIndex`**: Mencatat nomor urut baju yang posisinya sedang di tengah layar.
- **`locked`**: Mencatat apakah lapisan ini sedang "dikunci" oleh pengguna atau tidak.
- **Fitur Acak (Shuffle)**: Saat tombol diklik, aplikasi akan memilih nomor acak untuk setiap lapisan yang *tidak terkunci*, lalu menggeser layar perlahan ke baju tersebut.

## ➕ Cara Menambah Baju Baru

Ingin menambah baju baru? Sangat mudah! Buka file `src/data/outfits.js` dan lihat bagian array `items`. Tambahkan data seperti ini:

```js
{
  id: 'baju-unik-1',
  label: 'Kemeja Hitam',
  meta: 'katun',              // Teks kecil penjelas bahan/tipe
  tint: 'rgba(0,0,0,0.1)',    // Warna bercak cahaya (glow) di belakang kartu
  svg: '<svg>...</svg>'       // Kode gambar bajunya
}
```

**Bagaimana jika saya ingin memakai foto asli (bukan gambar SVG)?**
1. Simpan foto bajumu di folder `public/` (misal: `public/foto-kemeja.jpg`).
2. Ganti kode `svg: ...` di atas menjadi: `image: '/foto-kemeja.jpg'`
3. Coba jalankan aplikasinya! (Fitur kamera di web ini juga menggunakan prinsip yang sama: mengubah jepretan kamera menjadi gambar sementara lalu memasukkannya ke daftar ini).

## 🎨 Warna Tema (Design Tokens)

Tema "Cewek Bumi" ini telah diatur secara rapi di file `tailwind.config.js`. Berikut adalah panduan warnanya jika kamu ingin mengubah tombol atau teks:

| Nama Warna | Kode Warna | Kegunaan |
| --- | --- | --- |
| `cream` | `#FDF7ED` | Warna latar belakang utama situs |
| `beige` | `#F5F5DC` | Warna dasar kartu pakaian |
| `tan` | `#C19A6B` | Warna aksen (tombol utama, *highlight*) |
| `espresso` | `#4B3621` | Warna teks utama (gelap) |
| `espresso-soft`| `#6B5240` | Warna teks pendukung (sedikit pudar) |

## ⚡ Catatan Performa (Untuk Belajar!)
- **Anti Lemot:** Animasi geser (*scroll*) tidak membebani browser karena diatur oleh sistem pengatur waktu cerdas dari Javascript bernama `requestAnimationFrame`.
- **Hanya Memuat yang Terlihat:** Animasi muncul (*fade-in*) dan efek angka berhitung hanya berjalan ketika bagian tersebut sedang muncul di layar pengguna (teknik ini disebut `IntersectionObserver`).

---
Selamat bereksperimen dan belajar ngoding! Jangan takut untuk memodifikasi kodenya! 🚀
