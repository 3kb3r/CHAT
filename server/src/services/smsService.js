const smsLogs = [];

export const mockSendSMS = async (phoneNumber, message) => {
  try {
    const log = {
      id: Date.now(),
      phoneNumber,
      message,
      timestamp: new Date(),
      status: 'sent'
    };
    
    smsLogs.push(log);
    
    console.log(`\n📱 SMS Gönderildi:`);
    console.log(`   Numarası: ${phoneNumber}`);
    console.log(`   Mesaj: ${message}`);
    console.log(`   Saat: ${new Date().toLocaleString('tr-TR')}\n`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Son SMS: ${message}`);
    }
    
    return { success: true, id: log.id };
  } catch (error) {
    console.error('SMS gönderme hatası:', error);
    return { success: false, error };
  }
};

export const getSMSLogs = () => {
  return smsLogs;
};

export const getLastSMS = () => {
  return smsLogs[smsLogs.length - 1] || null;
};

export const clearSMSLogs = () => {
  smsLogs.length = 0;
};

export const sendSMSWithTwilio = async (phoneNumber, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio yapılandırması eksik, mock SMS kullanılıyor');
      return mockSendSMS(phoneNumber, message);
    }

    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber
    });

    console.log(`✅ SMS gönderildi: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('Twilio SMS hatası:', error);
    return { success: false, error };
  }
};

export const sendSMS = async (phoneNumber, message) => {
  const smsProvider = process.env.SMS_PROVIDER || 'mock';

  switch (smsProvider) {
    case 'twilio':
      return sendSMSWithTwilio(phoneNumber, message);
    case 'mock':
    default:
      return mockSendSMS(phoneNumber, message);
  }
};