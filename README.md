# CHAT - WhatsApp Benzeri Mesajlaşma Uygulaması

Gerçek zamanlı, güvenli ve özellik açısından zengin bir mesajlaşma platformu.

## 🚀 Özellikler

### Temel Mesajlaşma
- ✅ Gerçek zamanlı metin mesajları
- ✅ Görüntü, video, ses dosyası gönderi
- ✅ Dosya paylaşımı
- ✅ Emoji desteği
- ✅ Mesaj silme, düzenleme

### Sohbet Özellikleri
- ✅ Bireysel sohbetler
- ✅ Grup sohbetleri
- ✅ Grup yönetimi (oluştur, sil, üye ekle/çıkar)
- ✅ Grup açıklaması ve profil fotoğrafı
- ✅ Sohbet arama

### Kullanıcı Profili
- ✅ Profil fotoğrafı
- ✅ Durum mesajı (story)
- ✅ Çevrimiçi/çevrimdışı durumu
- ✅ Son görülüş zamanı
- ✅ Blok/engelleme

### İleri Özellikler
- ✅ Yazıyor... göstergesi
- ✅ Okundu/gönderildi durumu
- ✅ Görüntü bileşeni
- ✅ Ses mesajı kaydı
- ✅ Konumlandırma paylaşımı
- ✅ İletiler arşivleme
- ✅ Sesli ve video arama
- ✅ Şifreleme

### Güvenlik
- ✅ JWT kimlik doğrulama
- ✅ End-to-end şifreleme
- ✅ Güvenli veri taşınımı (HTTPS/WSS)
- ✅ Sıfırlanma kodları

## 📋 Proje Yapısı

```
CHAT/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Veritabanı ve ortam ayarları
│   │   ├── models/        # Veri modelleri
│   │   ├── routes/        # API rotaları
│   │   ├── controllers/   # Kontrol mantığı
│   │   ├── middleware/    # Doğrulama ve hata yönetimi
│   │   ├── services/      # İş mantığı
│   │   ├── sockets/       # WebSocket olayları
│   │   └── utils/         # Yardımcı fonksiyonlar
│   ├── .env.example
│   └── package.json
│
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/         # Sayfalar
│   │   ├── services/      # API çağrıları
│   │   ├── context/       # Global durum
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Yardımcı fonksiyonlar
│   │   ├── styles/        # CSS/Tailwind
│   │   └── App.jsx
│   └── package.json
│
└── docs/                   # Dokümantasyon

## 🛠️ Teknoloji Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, TailwindCSS
- **Gerçek Zamanlı İletişim**: Socket.IO (WebSocket)
- **Veritabanı**: MongoDB
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)
- **Şifreleme**: bcryptjs, crypto
- **Depolama**: Cloudinary (görseller) / Local (dosyalar)

## ⚙️ Kurulum

### Ön Koşullar
- Node.js 16+
- MongoDB
- npm veya yarn

### Backend Kurulumu

```bash
cd server
npm install
cp .env.example .env
# .env dosyasını düzenle
npm start
```

### Frontend Kurulumu

```bash
cd client
npm install
npm start
```

Uygulama şu adresle açılacak: `http://localhost:3000`

## 📱 Kullanım

1. Uygulamayı aç
2. Kayıt ol veya giriş yap
3. Yeni bir sohbet başlat veya grup oluştur
4. Mesaj gönder, dosya paylaş, ses/video ara

## 🔐 Güvenlik Notları

- Tüm parolalar bcryptjs ile şifrelenir
- WebSocket bağlantıları kimlik doğrulamadan geçer
- JWT tokenları 24 saat sonra süresi dolar
- Hassas veriler encrypted olarak depolanır

## 📄 Lisans

MIT

## 👨‍💻 Katkı

Katkılar hoşgeldiniz! Lütfen bir branch oluştur ve pull request gönder.