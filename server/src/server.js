import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısı
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Chat Server API' });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Yeni kullanıcı bağlandı: ${socket.id}`);

  // Kullanıcı katılımı
  socket.on('user_connected', (userId) => {
    socket.userId = userId;
    socket.join(`user_${userId}`);
    io.emit('user_online', { userId, status: 'online' });
    console.log(`Kullanıcı ${userId} çevrimiçi oldu`);
  });

  // Sohbete katılım
  socket.on('join_chat', (chatId) => {
    socket.join(`chat_${chatId}`);
    io.to(`chat_${chatId}`).emit('user_joined', { userId: socket.userId });
  });

  // Mesaj gönderme
  socket.on('send_message', (messageData) => {
    io.to(`chat_${messageData.chatId}`).emit('receive_message', messageData);
    console.log(`Mesaj gönderildi: ${messageData.chatId}`);
  });

  // Yazıyor göstergesi
  socket.on('typing', (data) => {
    io.to(`chat_${data.chatId}`).emit('user_typing', {
      userId: socket.userId,
      chatId: data.chatId
    });
  });

  // Yazıyor bitti
  socket.on('stop_typing', (data) => {
    io.to(`chat_${data.chatId}`).emit('user_stop_typing', {
      userId: socket.userId,
      chatId: data.chatId
    });
  });

  // Mesaj okundu
  socket.on('message_read', (data) => {
    io.to(`chat_${data.chatId}`).emit('message_read_by', {
      messageId: data.messageId,
      userId: socket.userId
    });
  });

  // Çevrimdışı olma
  socket.on('disconnect', () => {
    io.emit('user_offline', { userId: socket.userId, status: 'offline' });
    console.log(`Kullanıcı ${socket.userId} çevrimdışı oldu`);
  });

  // Sesli arama
  socket.on('call_user', (data) => {
    io.to(`user_${data.recipientId}`).emit('incoming_call', {
      caller: socket.userId,
      callerName: data.callerName,
      callType: data.callType // 'audio' or 'video'
    });
  });

  // Aramaya cevap
  socket.on('answer_call', (data) => {
    io.to(`user_${data.callerId}`).emit('call_answered', {
      answerer: socket.userId
    });
  });

  // Aramayı reddet
  socket.on('reject_call', (data) => {
    io.to(`user_${data.callerId}`).emit('call_rejected', {
      rejector: socket.userId
    });
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});