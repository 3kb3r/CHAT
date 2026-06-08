# Azerbaycan Telefon Numarası ile Giriş Kılavuzu

## 🇦🇿 Azerbaycan Telefon Numaraları

### Desteklenen Formatlar
- `+994XXXXXXXXX` (Uluslararası format)
- `0XXXXXXXXXX` (Yerel format)
- `994XXXXXXXXX` (Başında + olmayan)

### Azerbaycan Operatörleri

| Operatör | Ön Ek | Örnek |
|----------|-------|--------|
| Bakcell | 50, 51, 55, 70, 77 | +994501234567 |
| Azercell | 10, 40, 41, 50, 60, 70 | +994701234567 |
| Veon | 70, 71 | +994701234567 |
| Nar | 40, 41 | +994401234567 |
| Sabit Hat | 1-6, 8, 9 | +994212345678 |

## 📱 Kayıt Adımları (SMS Doğrulama)

### 1. Adım: Telefon Numarası Gir

```bash
POST /api/auth/register/phone/step1
Content-Type: application/json

{
  "phoneNumber": "+994501234567"
}
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Doğrulama kodu SMS olarak gönderildi",
  "phoneNumber": "+994501234567",
  "userId": "USER_ID_HERE"
}
```

### 2. Adım: Doğrulama Kodunu Gir

Kullanıcı SMS'te aldığı 6 haneli kodu girer.

```bash
POST /api/auth/register/phone/step2
Content-Type: application/json

{
  "userId": "USER_ID_HERE",
  "code": "123456",
  "username": "aynurdz",
  "password": "Secure@Pass123"
}
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Kayıt başarılı",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USER_ID",
    "username": "aynurdz",
    "phoneNumber": "+994501234567",
    "phoneVerified": true
  }
}
```

## 🔐 Giriş Yapma

### Seçenek 1: SMS Doğrulama ile Giriş

#### Adım 1: Telefon Numarası Gir

```bash
POST /api/auth/login/phone/step1
Content-Type: application/json

{
  "phoneNumber": "+994501234567"
}
```

#### Adım 2: SMS Kodu ile Giriş Yap

```bash
POST /api/auth/login/phone/step2
Content-Type: application/json

{
  "userId": "USER_ID_HERE",
  "code": "123456"
}
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USER_ID",
    "username": "aynurdz",
    "phoneNumber": "+994501234567",
    "profileImage": null,
    "statusMessage": "Salam!"
  }
}
```

### Seçenek 2: Şifre ile Giriş

```bash
POST /api/auth/login/password
Content-Type: application/json

{
  "phoneNumber": "+994501234567",
  "password": "Secure@Pass123"
}
```

## 🔄 Şifre Sıfırlama

### Adım 1: Telefon Numarası Gir

```bash
POST /api/auth/reset-password/step1
Content-Type: application/json

{
  "phoneNumber": "+994501234567"
}
```

### Adım 2: Yeni Şifre Belirle

```bash
POST /api/auth/reset-password/step2
Content-Type: application/json

{
  "userId": "USER_ID_HERE",
  "code": "123456",
  "newPassword": "NewSecure@Pass456"
}
```

## 👤 Profil İşlemleri

### Profil Bilgilerini Güncelle

```bash
PUT /api/users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "aynurdz",
  "statusMessage": "Salam Azərbaycan! 🇦🇿",
  "profileImage": "https://example.com/image.jpg",
  "language": "az"
}
```

### Başka Kullanıcıyı Engelle

```bash
POST /api/users/:userId/block
Authorization: Bearer YOUR_TOKEN
```

### Engellemeyi Kaldır

```bash
POST /api/users/:userId/unblock
Authorization: Bearer YOUR_TOKEN
```

### Engellenen Kullanıcıları Listele

```bash
GET /api/users/blocked
Authorization: Bearer YOUR_TOKEN
```

## 🔍 Kullanıcı Arama

```bash
GET /api/users/search?query=aynurdz
Authorization: Bearer YOUR_TOKEN
```

## 📝 Desteklenen Diller

Frontend'de aşağıdaki dilleri destekliyoruz:

- `az` - Azərbaycanca
- `en` - English
- `tr` - Türkçe

## ⚠️ Hata Kodları

| Durum | Mesaj | Çözüm |
|-------|-------|--------|
| 400 | Geçersiz Azerbaycan numarası | Numarayı `+994XXXXXXXXX` formatında girin |
| 400 | Bu numarada kullanıcı zaten kayıtlı | Başka bir numaraya kayıt olun |
| 400 | Doğrulama kodu geçersiz | Doğru kodu girin veya yeni istek yapın |
| 401 | Kimlik doğrulama gerekli | Token ile istek gönderin |
| 404 | Kullanıcı bulunamadı | Doğru numarayı kullanın |
| 500 | Sunucu hatası | Daha sonra tekrar deneyin |

## 🧪 Test Numaraları (Development)

Development modu'nda aşağıdaki numaraları test edebilirsiniz:

```
+994501234567  (Bakcell)
+994701234567  (Azercell)
+994701111111  (Veon)
+994401234567  (Nar)
+994212345678  (Sabit Hat)
```

## 🔔 Bildirim Ayarları

```json
{
  "pushNotifications": true,
  "soundEnabled": true,
  "messagePreview": true
}
```

## 💡 İpuçları

1. **SMS Bekleme**: Doğrulama kodu 10 dakika içinde geçerlidir
2. **Şifre Süresi Dolma**: JWT tokenları 24 saat sonra süresi dolar
3. **Engelleme**: Engellenen kullanıcılar size mesaj gönderemez
4. **Dil Ayarı**: Uygulamayı Azərbaycanca olarak kullanmak için `az` seçin

## 🆘 Sorun Giderme

### SMS Almıyorum?
- Telefon numarasını kontrol edin
- İnternet bağlantısını kontrol edin
- Operatörün SMS limitini kontrol edin

### Giriş Başarısız?
- Doğru numarayı kullanın
- Şifreyi kontrol edin
- Token'ı yenileyin

### Hesap Kilitlendi?
- Şifra sıfırla sayfasını kullanın
- SMS doğrulama ile giriş yapın
