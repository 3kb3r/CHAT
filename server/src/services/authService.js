import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendSMS } from './smsService.js';

export const validateAzerbaijanPhone = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const isValid = /^994\d{9}$/.test(cleanPhone);
  return isValid;
};

export const formatAzerbaijanPhone = (phoneNumber) => {
  let clean = phoneNumber.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '994' + clean.substring(1);
  }
  if (!clean.startsWith('994')) {
    clean = '994' + clean;
  }
  return '+' + clean;
};

export const registerPhoneStep1 = async (phoneNumber) => {
  try {
    if (!validateAzerbaijanPhone(phoneNumber)) {
      return {
        success: false,
        message: 'Lütfen geçerli bir Azerbaycan numarası girin (994XXXXXXXXX)'
      };
    }

    const formattedPhone = formatAzerbaijanPhone(phoneNumber);
    const existingUser = await User.findOne({ phoneNumber: formattedPhone });
    if (existingUser) {
      return {
        success: false,
        message: 'Bu numaradaki kullanıcı zaten kayıtlı'
      };
    }

    const tempUser = new User({
      phoneNumber: formattedPhone,
      username: `user_${Date.now()}`
    });

    const code = tempUser.generateVerificationCode();
    await tempUser.save();
    await sendSMS(formattedPhone, `CHAT Doğrulama Kodu: ${code}`);

    return {
      success: true,
      message: 'Doğrulama kodu SMS olarak gönderildi',
      phoneNumber: formattedPhone,
      userId: tempUser._id
    };
  } catch (error) {
    console.error('Register Step 1 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const registerPhoneStep2 = async (userId, code, username, password) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı'
      };
    }

    if (!user.verifyCode(code)) {
      return {
        success: false,
        message: 'Doğrulama kodu geçersiz veya süresi dolmuş'
      };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        success: false,
        message: 'Bu kullanıcı adı zaten alınmış'
      };
    }

    user.username = username;
    user.password = password;
    user.phoneVerified = true;
    await user.save();

    const token = generateToken(user._id);

    return {
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        phoneVerified: user.phoneVerified
      }
    };
  } catch (error) {
    console.error('Register Step 2 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const loginPhoneStep1 = async (phoneNumber) => {
  try {
    if (!validateAzerbaijanPhone(phoneNumber)) {
      return {
        success: false,
        message: 'Lütfen geçerli bir Azerbaycan numarası girin'
      };
    }

    const formattedPhone = formatAzerbaijanPhone(phoneNumber);
    const user = await User.findOne({ phoneNumber: formattedPhone });
    
    if (!user) {
      return {
        success: false,
        message: 'Bu numarada kayıtlı kullanıcı yok'
      };
    }

    const code = user.generateVerificationCode();
    await user.save();
    await sendSMS(formattedPhone, `CHAT Giriş Kodu: ${code}. Kimseyle paylaşmayın!`);

    return {
      success: true,
      message: 'Doğrulama kodu SMS olarak gönderildi',
      userId: user._id
    };
  } catch (error) {
    console.error('Login Step 1 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const loginPhoneStep2 = async (userId, code) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı'
      };
    }

    if (!user.verifyCode(code)) {
      return {
        success: false,
        message: 'Doğrulama kodu geçersiz veya süresi dolmuş'
      };
    }

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    return {
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        statusMessage: user.statusMessage
      }
    };
  } catch (error) {
    console.error('Login Step 2 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const loginWithPassword = async (phoneNumber, password) => {
  try {
    if (!validateAzerbaijanPhone(phoneNumber)) {
      return {
        success: false,
        message: 'Lütfen geçerli bir Azerbaycan numarası girin'
      };
    }

    const formattedPhone = formatAzerbaijanPhone(phoneNumber);
    const user = await User.findOne({ phoneNumber: formattedPhone }).select('+password');
    
    if (!user) {
      return {
        success: false,
        message: 'Numarası veya şifresi yanlış'
      };
    }

    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Numarası veya şifresi yanlış'
      };
    }

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    return {
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        statusMessage: user.statusMessage
      }
    };
  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const resetPasswordStep1 = async (phoneNumber) => {
  try {
    if (!validateAzerbaijanPhone(phoneNumber)) {
      return {
        success: false,
        message: 'Lütfen geçerli bir Azerbaycan numarası girin'
      };
    }

    const formattedPhone = formatAzerbaijanPhone(phoneNumber);
    const user = await User.findOne({ phoneNumber: formattedPhone });
    
    if (!user) {
      return {
        success: false,
        message: 'Bu numarada kayıtlı kullanıcı yok'
      };
    }

    const code = user.generateVerificationCode();
    await user.save();
    await sendSMS(formattedPhone, `Şifre Sıfırlama Kodu: ${code}`);

    return {
      success: true,
      message: 'Doğrulama kodu SMS olarak gönderildi',
      userId: user._id
    };
  } catch (error) {
    console.error('Reset Password Step 1 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};

export const resetPasswordStep2 = async (userId, code, newPassword) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        success: false,
        message: 'Kullanıcı bulunamadı'
      };
    }

    if (!user.verifyCode(code)) {
      return {
        success: false,
        message: 'Doğrulama kodu geçersiz veya süresi dolmuş'
      };
    }

    user.password = newPassword;
    await user.save();

    return {
      success: true,
      message: 'Şifre başarıyla sıfırlandı'
    };
  } catch (error) {
    console.error('Reset Password Step 2 Error:', error);
    return {
      success: false,
      message: 'Hata oluştu: ' + error.message
    };
  }
};