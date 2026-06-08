# Chat API Dokümantasyonu

## Authentication (Kimlik Doğrulama)

### Register (Kayıt Ol)
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "kullanıcı",
  "email": "email@example.com",
  "password": "şifre123",
  "phoneNumber": "+90XXXXXXXXXX"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "userId",
    "username": "kullanıcı",
    "email": "email@example.com"
  }
}
```

### Login (Giriş Yap)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "şifre123"
}

Response:
{
  "token": "jwt_token",
  "user": { ... }
}
```

### Get Profile (Profil Bilgisini Al)
```
GET /api/auth/profile
Authorization: Bearer jwt_token

Response:
{
  "id": "userId",
  "username": "kullanıcı",
  "email": "email@example.com",
  "profileImage": "url",
  "statusMessage": "Durum mesajı",
  "isOnline": true,
  "lastSeen": "2024-01-01T12:00:00Z"
}
```

## Chats (Sohbetler)

### Get All Chats (Tüm Sohbetleri Al)
```
GET /api/chats
Authorization: Bearer jwt_token

Response:
[
  {
    "id": "chatId",
    "name": "Sohbet Adı",
    "isGroup": false,
    "users": [user1, user2],
    "latestMessage": { ... },
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

### Create Chat (Sohbet Oluştur)
```
POST /api/chats
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "isGroup": false,
  "users": ["userId1", "userId2"]
}

Response:
{
  "id": "chatId",
  "name": null,
  "isGroup": false,
  "users": [...],
  "createdAt": "2024-01-01T12:00:00Z"
}
```

### Create Group (Grup Oluştur)
```
POST /api/chats
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "Grup Adı",
  "isGroup": true,
  "users": ["userId1", "userId2", "userId3"],
  "groupDescription": "Grup açıklaması"
}

Response:
{
  "id": "chatId",
  "name": "Grup Adı",
  "isGroup": true,
  "groupAdmin": "userId",
  "users": [...],
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Messages (Mesajlar)

### Get Messages (Mesajları Al)
```
GET /api/messages?chatId=chatId&page=1
Authorization: Bearer jwt_token

Response:
[
  {
    "id": "messageId",
    "chatId": "chatId",
    "sender": { ... },
    "content": "Mesaj içeriği",
    "messageType": "text",
    "createdAt": "2024-01-01T12:00:00Z",
    "readBy": [...]
  }
]
```

### Send Message (Mesaj Gönder)
```
POST /api/messages
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "chatId": "chatId",
  "content": "Merhaba!",
  "messageType": "text"
}

Response:
{
  "id": "messageId",
  "chatId": "chatId",
  "sender": "userId",
  "content": "Merhaba!",
  "messageType": "text",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

### Edit Message (Mesajı Düzenle)
```
PUT /api/messages/messageId
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "content": "Düzenlenen mesaj"
}

Response:
{
  "id": "messageId",
  "content": "Düzenlenen mesaj",
  "isEdited": true,
  "editedAt": "2024-01-01T12:01:00Z"
}
```

### Delete Message (Mesajı Sil)
```
DELETE /api/messages/messageId
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "message": "Mesaj silindi"
}
```

## WebSocket Events

### User Connected (Kullanıcı Bağlandı)
```javascript
socket.emit('user_connected', userId);
```

### Join Chat (Sohbete Katıl)
```javascript
socket.emit('join_chat', chatId);
```

### Send Message (Mesaj Gönder)
```javascript
socket.emit('send_message', {
  chatId: 'chatId',
  content: 'Mesaj',
  messageType: 'text'
});
```

### Typing (Yazıyor)
```javascript
socket.emit('typing', { chatId: 'chatId' });
```

### Stop Typing (Yazmayı Durdur)
```javascript
socket.emit('stop_typing', { chatId: 'chatId' });
```

### Message Read (Mesaj Okundu)
```javascript
socket.emit('message_read', {
  chatId: 'chatId',
  messageId: 'messageId'
});
```

### Call User (Aramaya Başla)
```javascript
socket.emit('call_user', {
  recipientId: 'userId',
  callerName: 'Adı Soyadı',
  callType: 'audio' // or 'video'
});
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "You don't have permission"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```