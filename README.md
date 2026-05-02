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

## 🌐 Hosting ke Vercel (Gratis)

### Cara 1: Deploy Otomatis (Recommended)

1. Push ke GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/smart-expense-tracker.git
git push -u origin main
```

2. Buka https://vercel.com
3. Klik "Add New..." → Project
4. Import dari GitHub
5. Klik "Deploy"!

### Cara 2: CLI (Yang sudah dilakukan)

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔧 Setup Environment Variables

### Supabase (Gratis 500MB)

1. Daftar di https://supabase.com
2. Buat New Project
3. Project Settings → API
4. Copy URL dan anon key ke .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. SQL Editor → Run supabase-schema.sql

### OpenAI (Gratis $5 Credit)

1. Daftar di https://platform.openai.com
2. API Keys → Create new key
3. Copy ke .env.local:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

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

## 🆓 Gratis Tanpa Bayar!

| Service  | Plan        | Limit          |
| -------- | ----------- | -------------- |
| Supabase | Free        | 500MB DB, Auth |
| OpenAI   | Paid & Free | $5 credit      |
| Vercel   | Hobby       | Unlimited      |

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── api/
│   │   └── parse-transaction/
│   │       └── route.ts      ← AI API endpoint
│   ├── globals.css          ← Styles + Fonts
│   └── page.tsx            ← Main page
├── components/
│   ├── forms/
│   │   ├── transaction-input.tsx
│   │   └── transaction-list.tsx
│   └── ui/                 ← Shadcn components
├── lib/
│   ├── openai.ts          ← OpenAI client
│   ├── supabase.ts         ← Supabase client
│   └── utils.ts            ← Utilities
├── services/
│   └── transaction.service.ts
└── types/
    └── transaction.ts
```

---

## 🌎 Live Demo

**Production URL:** https://smart-expense-tracker-sigma-silk.vercel.app

---

## 📄 License

MIT - Gratis untuk portofolio danbelajar!

---

**Dibuat dengan ❤️ • Cocok untuk Portofolio! 🚀**
