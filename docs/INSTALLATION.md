# Kurulum Kılavuzu

## Sistem Gereksinimleri

- Node.js 16+ (https://nodejs.org)
- MongoDB 5.0+ (https://www.mongodb.com/try/download/community)
- npm veya yarn
- Git

## Adım 1: Repository'i Klonla

```bash
git clone https://github.com/3kb3r/CHAT.git
cd CHAT
```

## Adım 2: Backend Kurulumu

### 2.1 Bağımlılıkları Yükle
```bash
cd server
npm install
```

### 2.2 Ortam Değişkenlerini Ayarla
```bash
cp .env.example .env
```

Ardından `.env` dosyasını düzenle:

```env
PORT=5000
NODE_ENV=development

# MongoDB (Eğer yerel MongoDB yoksa MongoDB Atlas'tan URL al)
MONGODB_URI=mongodb://localhost:27017/chat-db

# JWT Secret (Güçlü bir secret oluştur)
JWT_SECRET=superSecretKey123456789!@#$%^&*()

# Frontend URL
FRONTEND_URL=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### 2.3 Sunucuyu Başlat
```bash
# Geliştirme modu (auto-reload ile)
npm run dev

# Veya üretim modu
npm start
```

Sunucu şu mesajla başlayacak: `🚀 Sunucu 5000 portunda çalışıyor`

## Adım 3: Frontend Kurulumu

### 3.1 Yeni terminal aç ve client klasörüne git
```bash
cd client
npm install
```

### 3.2 Ortam Değişkenlerini Ayarla
```bash
cp .env.example .env
```

`.env` dosyası varsayılan olarak doğru ayarlarla gelir:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3.3 Frontend'i Başlat
```bash
npm run dev
```

Tarayıcıda açıl: `http://localhost:5173`

## Adım 4: MongoDB Kurulumu (İsteğe Bağlı)

Eğer yerel MongoDB yoksa:

### MongoDB Community Yükle
- Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- macOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/
- Linux: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-linux/

### MongoDB Atlas (Bulut) Kullan
1. https://www.mongodb.com/cloud/atlas adresine git
2. Ücretsiz hesap oluştur
3. Yeni cluster oluştur
4. Connection string al
5. `.env` dosyasında `MONGODB_URI` güncelle:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-db
```

## Adım 5: Test Et

### Backend Test
```bash
# server dizininde
curl http://localhost:5000
# Sonuç: {"message": "Chat Server API"}
```

### Frontend Test
Tarayıcıda: `http://localhost:3000` (veya terminal mesajında belirtilen port)

## Sorun Giderme

### MongoDB bağlantı hatası
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Çözüm:** MongoDB'nin çalışıp çalışmadığını kontrol et:
```bash
# macOS/Linux
mongo

# Windows
mongosh
```

### Port zaten kullanılıyor
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Çözüm:** `.env` dosyasında başka bir port belirt:
```env
PORT=5001
```

### CORS hatası
```
Access to XMLHttpRequest blocked by CORS policy
```
**Çözüm:** `.env` dosyasında `FRONTEND_URL` ve `SOCKET_CORS_ORIGIN` doğru ayarla

### Dependencies eksik
```bash
npm install
npm audit fix
```

## Development Tools Kurulumu (Opsiyonel)

### VS Code Extensions
- REST Client (Thunder Client)
- MongoDB for VS Code
- Socket.IO Client Testing

### API Testing
```bash
# Postman indir: https://www.postman.com/downloads/
# veya Thunder Client uzantısını VS Code'a yükle
```

## Production Deployment

### Heroku'ya Deploy
```bash
# Heroku CLI yükle ve giriş yap
heroku login

# Backend deploy
cd server
heroku create chat-app-backend
git push heroku main

# Frontend deploy (Vercel önerilen)
cd ../client
npm run build
```

### Netlify'e Frontend Deploy
```bash
cd client
npm run build
# Netlify sitesine build klasörünü yükle
```

## İlk Kullanıcı Oluştur

1. Frontend'i açı: `http://localhost:3000`
2. "Kayıt Ol" butonuna tıkla
3. Bilgilerini doldur:
   - Kullanıcı Adı: `testuser1`
   - E-posta: `test@example.com`
   - Şifre: `Test123!@#`
   - Telefon (opsiyonel): `+90 555 000 0000`

4. Kayıt olduktan sonra otomatik login olacaksın

## Sonraki Adımlar

1. Profil fotoğrafı yükle
2. Durum mesajı ayarla
3. İkinci bir hesap oluştur
4. Aralarında mesaj gönder
5. Grup sohbeti oluştur
6. Dosya paylaş

Eğer sorun yaşarsan, GitHub Issues'da issue açabilirsin!