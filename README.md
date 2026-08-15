# Temiryo‘lchi NFC Digital Newspaper

Bosma `Temiryo‘lchi` gazetasini NFC orqali elektron nashr bilan bog‘laydigan platforma.

## Loyiha tuzilmasi

```text
nfc_gazeta/
├── backend/            # Django + DRF API, PDF/OCR, analytics
├── apps/
│   ├── admin-web/      # Nashr va maqolalarni boshqarish paneli
│   └── public-web/     # Public sayt va NFC gazeta reader
└── README.md
```

## Asosiy flow

```text
Bosma gazeta
    ↓
NFC stiker
    ↓
/n/{nfcSlug}
    ↓
Elektron gazeta viewer
```

Foydalanuvchi NFC stikerni telefon bilan tekkizganda aynan shu gazeta sonining elektron nusxasiga o‘tadi. Viewer betma-bet o‘qish, matn rejimi, audio, zoom va mobil navigatsiyani qo‘llab-quvvatlaydi.

## Backend

Stack:
- Django 5
- Django REST Framework
- Simple JWT
- PostgreSQL / SQLite
- PyMuPDF
- OCR
- S3-compatible media storage

Local ishga tushirish:

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend local manzil:

```text
http://127.0.0.1:8000
```

Environment sozlamalari uchun `backend/.env.example` dan foydalaning.

## Public web

```bash
cd apps/public-web
npm install
npm run dev
```

Tekshiruv:

```bash
npm run type-check
npm run lint
npm run build
```

## Admin web

```bash
cd apps/admin-web
npm install
npm run dev
```

Tekshiruv:

```bash
npm run type-check
npm run lint
npm run build
```

## Muhim modullar

- Nashr yaratish va PDF yuklash
- PDF betlarini qayta ishlash
- OCR fallback
- Nashrni review/publish qilish
- NFC slug orqali gazeta ochish
- Maqolalar
- Arxiv va qidiruv
- Public analytics
- Admin analytics

## Deploy

Hozirgi arxitektura:
- Public web — Vercel
- Admin web — Vercel
- Backend — Render
- Media — S3-compatible storage

## Development qoidasi

Asosiy ishlab chiqish branchi: `main`.
Katta refactor yoki xavfli o‘zgarishdan oldin backup branch yaratiladi.
