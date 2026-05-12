const Card = require('../models/Card');

// GET /api/cards - list with search, filter, sort, pagination
const getCards = async (req, res) => {
  try {
    const {
      search, bank, cardType, minFee, maxFee, minIncome, maxIncome,
      sortBy = 'popularity', order = 'desc', page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bank: { $regex: search, $options: 'i' } },
      ];
    }
    if (bank) filter.bank = bank;
    if (cardType) filter.cardType = cardType;
    if (minFee || maxFee) {
      filter['fees.annualFee'] = {};
      if (minFee) filter['fees.annualFee'].$gte = Number(minFee);
      if (maxFee) filter['fees.annualFee'].$lte = Number(maxFee);
    }
    if (minIncome || maxIncome) {
      filter['eligibility.minIncome'] = {};
      if (minIncome) filter['eligibility.minIncome'].$gte = Number(minIncome);
      if (maxIncome) filter['eligibility.minIncome'].$lte = Number(maxIncome);
    }

    const sortMap = {
      popularity: 'popularity',
      annualFee: 'fees.annualFee',
      joiningFee: 'fees.joiningFee',
      rating: 'rating',
      name: 'name',
    };
    const sortField = sortMap[sortBy] || 'popularity';
    const sortOrder = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [cards, total] = await Promise.all([
      Card.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(Number(limit)),
      Card.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: cards,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cards/:id
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cards/compare?ids=id1,id2,id3
const compareCards = async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (ids.length < 2 || ids.length > 4) {
      return res.status(400).json({ success: false, message: 'Select 2 to 4 cards to compare' });
    }
    const cards = await Card.find({ _id: { $in: ids }, isActive: true });
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cards/recommended - based on user profile
const getRecommended = async (req, res) => {
  try {
    const user = req.user;
    const { annualIncome = 0, creditScore = 0 } = user.profile || {};

    const filter = {
      isActive: true,
      'eligibility.minIncome': { $lte: annualIncome || 500000 },
      'eligibility.minCreditScore': { $lte: creditScore || 750 },
    };

    const cards = await Card.find(filter).sort({ popularity: -1 }).limit(6);
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cards (admin)
const createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({ success: true, message: 'Card created', data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/cards/:id (admin)
const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, message: 'Card updated', data: card });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/cards/:id (admin)
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, message: 'Card deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cards/banks - distinct banks list
const getBanks = async (req, res) => {
  try {
    const banks = await Card.distinct('bank', { isActive: true });
    res.json({ success: true, data: banks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCards, getCardById, compareCards, getRecommended, createCard, updateCard, deleteCard, getBanks };
