const express = require('express');
const { getProfile, updateProfile, toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:cardId', protect, toggleFavorite);

module.exports = router;
