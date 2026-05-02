# 💎 Piggy - Smart Savings Tracker 🎯

Aplikasi penabungann dengan AI-powered Categorization yang buat menabung menjadi lebih menyenangkan! 🎉 Tulis saja transaksi seperti "Beli kopi di Starbuck 50rb" atau "Gaji bulan ini 10jt" dan AI akan otomatis memisahkan nominal, kategori, dan merchant-nya!

## ✨ Fitur Utama

- 🤖 **AI Categorization** -智能 Indonesian NER dengan OpenAI GPT-4o-mini
- 💰 **Savings Tracker** - Pantau progres menabung dengan persentase
- 🎨 **UI Colorful & Joyful** - Desain ceria dan tidak membosankan
- 📱 **Responsif** - Bisa digunakan di desktop dan mobile
- 🔤 **Bilingual** - Mendukung Bahasa Indonesia
- 🎯 **Poppins + Montserrat** - Font modern yang bersih
- 🗄️ **Supabase** - Database gratis PostgreSQL
- 🔍 **pgvector** - Semantic search berbasis makna

---

## 🚀 Cara Menjalankan (Local)

```bash
# Clone / download
cd smart-expense-tracker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Buka: **http://localhost:3000**

---

---

## 📝 Contoh Transaksi

### Pemasukan (Income):

```
"Gaji bulan Agustus 8jt"
"Freelance desain 500rb"
"THR 5jt"
"Bonus tahun baru 10jt"
```

### Pengeluaran (Expense):

```
"Beli kopi starbucks 45rb"
"Naik gojek kampus 25rb"
"Belanja supermarket 300rb"
"Beli snack 15rb"
"Makan siang rm 28rb"
```

---

## 🌎 Live Demo

**Production URL:** https://smart-expense-tracker-sigma-silk.vercel.app
