import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket bağlantısı kuruldu');
    });

    socket.on('disconnect', () => {
      console.log('Socket bağlantısı kesildi');
    });

    socket.on('error', (error) => {
      console.error('Socket hatası:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// Socket Event Emitters
export const socketEvents = {
  userConnected: (userId) => socket?.emit('user_connected', userId),
  joinChat: (chatId) => socket?.emit('join_chat', chatId),
  sendMessage: (messageData) => socket?.emit('send_message', messageData),
  typing: (chatId) => socket?.emit('typing', { chatId }),
  stopTyping: (chatId) => socket?.emit('stop_typing', { chatId }),
  messageRead: (chatId, messageId) => socket?.emit('message_read', { chatId, messageId }),
  callUser: (recipientId, callerName, callType) => 
    socket?.emit('call_user', { recipientId, callerName, callType }),
  answerCall: (callerId) => socket?.emit('answer_call', { callerId }),
  rejectCall: (callerId) => socket?.emit('reject_call', { callerId })
};

// Socket Event Listeners Setup
export const setupSocketListeners = (callbacks) => {
  if (!socket) return;

  socket.on('receive_message', callbacks.onReceiveMessage);
  socket.on('user_typing', callbacks.onUserTyping);
  socket.on('user_stop_typing', callbacks.onUserStopTyping);
  socket.on('message_read_by', callbacks.onMessageReadBy);
  socket.on('user_online', callbacks.onUserOnline);
  socket.on('user_offline', callbacks.onUserOffline);
  socket.on('incoming_call', callbacks.onIncomingCall);
  socket.on('call_answered', callbacks.onCallAnswered);
  socket.on('call_rejected', callbacks.onCallRejected);
};

export default socket;