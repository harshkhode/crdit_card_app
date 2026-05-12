const express = require('express');
const {
  getCards, getCardById, compareCards, getRecommended,
  createCard, updateCard, deleteCard, getBanks,
} = require('../controllers/cardController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCards);
router.get('/banks', getBanks);
router.get('/compare', compareCards);
router.get('/recommended', protect, getRecommended);
router.get('/:id', getCardById);

// Admin routes
router.post('/', protect, adminOnly, createCard);
router.put('/:id', protect, adminOnly, updateCard);
router.delete('/:id', protect, adminOnly, deleteCard);

module.exports = router;
