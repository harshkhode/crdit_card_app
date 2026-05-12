const User = require('../models/User');
const Card = require('../models/Card');

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(profile && { profile }) },
      { new: true, runValidators: true }
    ).populate('favorites');

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/users/favorites/:cardId - toggle favorite
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cardId = req.params.cardId;

    const cardExists = await Card.findById(cardId);
    if (!cardExists) return res.status(404).json({ success: false, message: 'Card not found' });

    const isFavorited = user.favorites.includes(cardId);

    if (isFavorited) {
      user.favorites = user.favorites.filter((id) => id.toString() !== cardId);
    } else {
      user.favorites.push(cardId);
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited,
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile, toggleFavorite, getFavorites };
