import express from 'express';
import * as authService from '../services/authService.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register/phone/step1', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Telefon numarası gerekli'
      });
    }

    const result = await authService.registerPhoneStep1(phoneNumber);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/register/phone/step2', async (req, res) => {
  try {
    const { userId, code, username, password } = req.body;

    if (!userId || !code || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar zorunlu'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalı'
      });
    }

    const result = await authService.registerPhoneStep2(userId, code, username, password);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/login/phone/step1', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Telefon numarası gerekli'
      });
    }

    const result = await authService.loginPhoneStep1(phoneNumber);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/login/phone/step2', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı ID ve doğrulama kodu gerekli'
      });
    }

    const result = await authService.loginPhoneStep2(userId, code);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/login/password', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Telefon numarası ve şifre gerekli'
      });
    }

    const result = await authService.loginWithPassword(phoneNumber, password);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/reset-password/step1', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Telefon numarası gerekli'
      });
    }

    const result = await authService.resetPasswordStep1(phoneNumber);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/reset-password/step2', async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;

    if (!userId || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar zorunlu'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalı'
      });
    }

    const result = await authService.resetPasswordStep2(userId, code, newPassword);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        statusMessage: user.statusMessage,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

router.post('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }

    res.json({
      success: true,
      message: 'Çıkış yapıldı'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

export default router;