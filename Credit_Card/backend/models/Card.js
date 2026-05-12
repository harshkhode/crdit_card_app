const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bank: {
      type: String,
      required: true,
      enum: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'IDFC First Bank', 'HSBC Bank', 'SBI Card', 'American Express', 'Citi Bank'],
    },
    cardType: {
      type: String,
      enum: ['rewards', 'cashback', 'travel', 'lifestyle', 'fuel', 'business', 'premium'],
      required: true,
    },
    image: { type: String, default: '' },
    fees: {
      joiningFee: { type: Number, default: 0 },
      annualFee: { type: Number, default: 0 },
      annualFeeWaiver: { type: String, default: '' },
    },
    welcomeBenefits: [{ type: String }],
    rewards: {
      baseRate: { type: String, default: '' },
      acceleratedRate: { type: String, default: '' },
      rewardType: { type: String, default: '' },
      redemptionOptions: [{ type: String }],
    },
    cashback: {
      baseRate: { type: String, default: '' },
      categories: [{ type: String }],
      maxCashback: { type: String, default: '' },
    },
    loungeAccess: {
      domestic: { type: Number, default: 0 },
      international: { type: Number, default: 0 },
      details: { type: String, default: '' },
    },
    eligibility: {
      minIncome: { type: Number, default: 0 },
      minAge: { type: Number, default: 21 },
      maxAge: { type: Number, default: 60 },
      minCreditScore: { type: Number, default: 700 },
      employmentType: [{ type: String }],
    },
    keyFeatures: [{ type: String }],
    pros: [{ type: String }],
    cons: [{ type: String }],
    applyUrl: { type: String, default: '#' },
    popularity: { type: Number, default: 0 },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

cardSchema.index({ bank: 1, cardType: 1 });
cardSchema.index({ 'fees.annualFee': 1 });
cardSchema.index({ popularity: -1 });

module.exports = mongoose.model('Card', cardSchema);
