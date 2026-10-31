# 🌸 Firda Money Planner — Aplikasi Pencatat Keuangan Harian (Web & iOS)

Aplikasi web modern dan *Progressive Web App (PWA)* untuk mencatat pengeluaran dan pemasukan sehari-hari dengan tampilan **Feminin Pink Pastel (*Sakura Aesthetic*)** yang dioptimalkan untuk layar **iPhone (iOS)** maupun **Desktop**.

---

## ✨ Fitur Utama

- 📱 **Tampilan Khusus iPhone (iOS Ready & PWA)**:
  - Navigasi bawah *Translucent Bottom Tab Bar* khas iOS dengan tombol tengah melayang **"+ Catat"**.
  - Kartu ringkasan dompet bergaya *Apple Wallet* dan *Bottom Sheet Modals* dengan *grabber bar*.
  - Dapat dipasang langsung ke layar utama iPhone (**Safari → Share → Add to Home Screen**) dan berjalan *full-screen* tanpa bar browser.
  - Dilengkapi **Mode Simulator iPhone 16 Pro** saat dibuka di layar laptop/PC.
- 💸 **Pencatatan Cashflow Lengkap**:
  - Catat **Pengeluaran** & **Pemasukan** beserta kategori, tanggal, metode pembayaran (QRIS, Transfer Bank, ShopeePay/GoPay, Tunai), dan catatan.
  - Tombol nominal cepat (`+10k`, `+25k`, `+50k`, `+100k`, `+500k`).
- 🎯 **Target & Monitoring Budget Bulanan**:
  - Atur batas anggaran per kategori dengan indikator warna otomatis (🟢 Aman, 🟡 Waspada ≥80%, 🔴 Overbudget >100%).
- 📊 **Grafik & Statistik Visual**:
  - *Donut Chart* interaktif proporsi pengeluaran, *Top Spending* bulanan, dan rasio Pemasukan vs Pengeluaran.
- 🏷️ **Kategori Custom**:
  - Tambah kategori sendiri lengkap dengan pilihan ikon emoji dan warna aksen.
- 💾 **Ekspor Excel (CSV) & Backup JSON (LocalStorage)**:
  - Seluruh data tersimpan aman di perangkat browser pengguna (*LocalStorage*).
  - Unduh laporan ke **CSV/Excel** atau cadangkan/pulihkan lewat file **JSON**.
- 🌙 **Sakura Day & Sakura Night (Dark Mode)**:
  - Dukungan mode terang (*Pastel Pink*) dan mode gelap (*Deep Berry Plum*).

---

## 🚀 Cara Menjalankan secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development (otomatis terbuka di jaringan Wi-Fi lokal)
npm run dev

# 3. Build untuk production
npm run build
```

---

## 🌐 Cara Deploy Otomatis ke GitHub Pages (Agar Bisa Dibuka di iPhone dari Mana Saja)

Repository ini sudah dilengkapi GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push kode ini ke repository GitHub Anda (branch `main`).
2. Buka menu **Settings** → **Pages** di repository GitHub Anda.
3. Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. Tunggu ~1 menit hingga workflow selesai, lalu buka link `https://<username-github>.github.io/<nama-repo>/` langsung di **Safari iPhone** Anda!
