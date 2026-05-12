const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Card = require('../models/Card');
const User = require('../models/User');

// ─── PREMIUM CARDS ONLY ───────────────────────────────────────────────────────
const cards = [

  // ═══════════════════════════════════════
  //  HDFC Bank
  // ═══════════════════════════════════════
  {
    name: 'HDFC Infinia Metal Edition',
    bank: 'HDFC Bank',
    cardType: 'premium',
    fees: { joiningFee: 12500, annualFee: 12500, annualFeeWaiver: 'Waived on spending ₹10L/year' },
    welcomeBenefits: [
      '12,500 reward points (worth ₹12,500)',
      'Complimentary Club Marriott membership',
      'Complimentary Forbes Digital subscription',
    ],
    rewards: {
      baseRate: '5 RP per ₹150 spent',
      acceleratedRate: '10X RP on SmartBuy & Diners portals',
      rewardType: 'Reward Points',
      redemptionOptions: ['1:1 airmile transfer (Air India, Vistara, Singapore Airlines)', 'Luxury hotel stays', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic & international (Priority Pass) + guest passes' },
    eligibility: { minIncome: 3500000, minAge: 21, maxAge: 65, minCreditScore: 800, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Metal card (stainless steel)', '1:1 airline mile transfers', 'Unlimited golf privileges', '24/7 lifestyle concierge', 'Travel insurance ₹3.5 Cr', 'Zero forex markup'],
    pros: ['Best-in-class rewards', 'Unlimited global lounge', 'Prestige metal card', 'Excellent airmile transfers'],
    cons: ['Very high annual fee', 'Very high income requirement', 'Invite-only for some variants'],
    applyUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card',
    popularity: 92,
    rating: 4.8,
  },
  {
    name: 'HDFC Regalia Gold',
    bank: 'HDFC Bank',
    cardType: 'premium',
    fees: { joiningFee: 2500, annualFee: 2500, annualFeeWaiver: 'Waived on spending ₹4L/year' },
    welcomeBenefits: [
      '2,500 reward points on first transaction',
      'Complimentary Swiggy One membership (3 months)',
    ],
    rewards: {
      baseRate: '4 RP per ₹150 spent',
      acceleratedRate: '20 RP per ₹150 on travel & dining',
      rewardType: 'Reward Points',
      redemptionOptions: ['Flight bookings', 'Hotel bookings', 'Cash credit', 'Airmiles transfer'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 12, international: 6, details: '12 domestic + 6 international via Priority Pass/year' },
    eligibility: { minIncome: 1200000, minAge: 21, maxAge: 60, minCreditScore: 750, employmentType: ['salaried', 'self-employed'] },
    keyFeatures: ['Golf privileges (4 rounds/year)', 'Concierge services', 'Travel insurance ₹1 Cr', 'Zero fuel surcharge'],
    pros: ['High reward rate on travel', 'Premium lounge access', 'Comprehensive travel insurance'],
    cons: ['High annual fee', 'High income requirement', 'Reward redemption can be complex'],
    applyUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card',
    popularity: 95,
    rating: 4.5,
  },
  {
    name: 'HDFC Diners Club Black',
    bank: 'HDFC Bank',
    cardType: 'premium',
    fees: { joiningFee: 10000, annualFee: 10000, annualFeeWaiver: 'Waived on spending ₹8L/year' },
    welcomeBenefits: [
      '10,000 welcome reward points',
      'Club Marriott, Forbes, Zomato Pro memberships complimentary',
    ],
    rewards: {
      baseRate: '5 RP per ₹150 spent',
      acceleratedRate: '10x RP on SmartBuy portal',
      rewardType: 'Reward Points',
      redemptionOptions: ['Airmiles (1:1 with most airlines)', 'Luxury hotel stays', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic & international via Diners & Priority Pass' },
    eligibility: { minIncome: 2500000, minAge: 21, maxAge: 65, minCreditScore: 800, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Unlimited lounge access', '1:1 airmile transfer', 'Golf privileges (6 rounds/year)', '24/7 Concierge', 'Travel insurance ₹2 Cr'],
    pros: ['Best-in-class lounge access', 'Excellent airmile transfers', 'Premium lifestyle benefits'],
    cons: ['Very high annual fee', 'Diners acceptance limited in India', 'Very high income requirement'],
    applyUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black',
    popularity: 78,
    rating: 4.7,
  },

  // ═══════════════════════════════════════
  //  ICICI Bank
  // ═══════════════════════════════════════
  {
    name: 'ICICI Emeralde Private Metal',
    bank: 'ICICI Bank',
    cardType: 'premium',
    fees: { joiningFee: 0, annualFee: 12000, annualFeeWaiver: 'Waived on spending ₹10L/year' },
    welcomeBenefits: [
      '12,000 reward points (worth ~₹9,000)',
      'Complimentary Trident Privilege Red Tier membership',
    ],
    rewards: {
      baseRate: '6 PAYBACK points per ₹100 spent',
      acceleratedRate: '12 points on international, travel & dining',
      rewardType: 'PAYBACK Points',
      redemptionOptions: ['InterMiles', 'Singapore Airlines KrisFlyer', 'Luxury hotels', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic (DreamFolks) + unlimited intl (Priority Pass) + 2 guest passes/quarter' },
    eligibility: { minIncome: 3000000, minAge: 21, maxAge: 65, minCreditScore: 800, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Metal card (stainless steel)', 'Unlimited lounge + guests', 'Golf privileges worldwide', '24/7 premium concierge', 'Travel insurance ₹3 Cr', 'Zero forex markup'],
    pros: ['Unlimited global lounge access', 'Excellent reward rate', 'Prestigious metal card'],
    cons: ['High income requirement', 'Annual fee is significant', 'PAYBACK redemption can be complex'],
    applyUrl: 'https://www.icicibank.com/card/emeralde-private-metal-credit-card',
    popularity: 80,
    rating: 4.6,
  },
  {
    name: 'ICICI Sapphiro Credit Card',
    bank: 'ICICI Bank',
    cardType: 'premium',
    fees: { joiningFee: 6500, annualFee: 3500, annualFeeWaiver: 'Waived on spending ₹6L/year' },
    welcomeBenefits: [
      'Gift voucher worth ₹9,000',
      '2 complimentary domestic lounge visits on joining',
    ],
    rewards: {
      baseRate: '2 PAYBACK points per ₹100 spent',
      acceleratedRate: '4 PAYBACK points on international spends',
      rewardType: 'PAYBACK Points',
      redemptionOptions: ['Products & vouchers', 'InterMiles airmiles', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 4, international: 4, details: '4 domestic + 4 international via Dreamfolks/year' },
    eligibility: { minIncome: 1500000, minAge: 23, maxAge: 60, minCreditScore: 750, employmentType: ['salaried', 'self-employed'] },
    keyFeatures: ['Golf privileges', 'Travel insurance', 'Concierge services', '1% fuel surcharge waiver', 'Movie offers'],
    pros: ['Good welcome benefits', 'Solid travel perks', 'Golf privileges included'],
    cons: ['High joining fee', 'Lower reward rate vs HDFC', 'PAYBACK redemption complex'],
    applyUrl: 'https://www.icicibank.com/card/sapphiro-credit-card',
    popularity: 72,
    rating: 4.1,
  },

  // ═══════════════════════════════════════
  //  Axis Bank
  // ═══════════════════════════════════════
  {
    name: 'Axis Bank Reserve',
    bank: 'Axis Bank',
    cardType: 'premium',
    fees: { joiningFee: 50000, annualFee: 50000, annualFeeWaiver: 'Waived on spending ₹35L/year' },
    welcomeBenefits: [
      '50,000 EDGE Reward Points',
      'Complimentary ITC One membership',
      'Complimentary domestic business class ticket',
    ],
    rewards: {
      baseRate: '15 EDGE Reward Points per ₹200 spent',
      acceleratedRate: '30X RP on travel via Axis TravelEdge',
      rewardType: 'EDGE Reward Points',
      redemptionOptions: ['1:1 airline transfers (Air India, Vistara, Etihad, Emirates)', 'Ultra-luxury hotel stays', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic + unlimited international Priority Pass + unlimited guest passes' },
    eligibility: { minIncome: 7500000, minAge: 25, maxAge: 65, minCreditScore: 820, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Titanium metal card', 'Unlimited lounge + guests', 'Private jet booking assistance', 'Golf worldwide', '24/7 lifestyle concierge', 'Travel insurance ₹5 Cr'],
    pros: ["India's most premium offering", 'Unlimited global lounge + guests', 'Titanium metal card', 'Exceptional travel benefits'],
    cons: ['Extremely high annual fee', 'Only for ultra-HNI', 'Very high spend for waiver'],
    applyUrl: 'https://www.axisbank.com/retail/cards/credit-card/reserve-credit-card',
    popularity: 58,
    rating: 4.9,
  },
  {
    name: 'Axis Bank Magnus Credit Card',
    bank: 'Axis Bank',
    cardType: 'premium',
    fees: { joiningFee: 12500, annualFee: 12500, annualFeeWaiver: 'Waived on spending ₹15L/year' },
    welcomeBenefits: [
      '12,500 EDGE Reward Points',
      'Complimentary domestic flight ticket',
    ],
    rewards: {
      baseRate: '12 EDGE Reward Points per ₹200 spent',
      acceleratedRate: '35 EDGE RP per ₹200 on travel via TravelEdge',
      rewardType: 'EDGE Reward Points',
      redemptionOptions: ['Flight & hotel bookings (1:1 transfers)', 'Airmiles', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 8, details: 'Unlimited domestic + 8 international (Priority Pass)/year' },
    eligibility: { minIncome: 1800000, minAge: 21, maxAge: 70, minCreditScore: 750, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Buy 1 Get 1 on PVR', 'Unlimited domestic lounge', '24/7 concierge', 'Golf privileges', 'Low forex markup 2%'],
    pros: ['Unlimited domestic lounge', 'High reward rate', 'Strong travel benefits'],
    cons: ['Very high annual fee', 'Limited intl lounge visits (8/year)', 'High income bar'],
    applyUrl: 'https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card',
    popularity: 82,
    rating: 4.4,
  },

  // ═══════════════════════════════════════
  //  IDFC First Bank
  // ═══════════════════════════════════════
  {
    name: 'IDFC FIRST Wealth Credit Card',
    bank: 'IDFC First Bank',
    cardType: 'premium',
    fees: { joiningFee: 0, annualFee: 0, annualFeeWaiver: 'Lifetime free' },
    welcomeBenefits: [
      '500 welcome reward points',
      'Complimentary domestic lounge access on activation',
    ],
    rewards: {
      baseRate: '10X reward points on online spending',
      acceleratedRate: '10X on weekends at partner restaurants',
      rewardType: 'Reward Points',
      redemptionOptions: ['Products', 'Vouchers', 'Statement credit', 'Travel'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 4, international: 2, details: '4 domestic + 2 international lounge visits/quarter (16+8/year)' },
    eligibility: { minIncome: 600000, minAge: 21, maxAge: 65, minCreditScore: 730, employmentType: ['salaried', 'self-employed'] },
    keyFeatures: ['Zero forex markup', 'Lifetime free card', 'Personal accident cover ₹1 Cr', 'Road side assistance'],
    pros: ['Lifetime free with premium perks', '0% forex markup', 'High lounge access for free card'],
    cons: ['Moderate-high income requirement', 'Limited merchant offers vs big banks'],
    applyUrl: 'https://www.idfcfirstbank.com/personal-banking/cards/credit-card/wealth-credit-card',
    popularity: 80,
    rating: 4.5,
  },

  // ═══════════════════════════════════════
  //  HSBC Bank
  // ═══════════════════════════════════════
  {
    name: 'HSBC Premier Mastercard',
    bank: 'HSBC Bank',
    cardType: 'premium',
    fees: { joiningFee: 0, annualFee: 0, annualFeeWaiver: 'Lifetime free for Premier customers' },
    welcomeBenefits: [
      '5,000 reward points on first spend',
      'Complimentary ITC membership (1 year)',
    ],
    rewards: {
      baseRate: '2 reward points per ₹100 spent',
      acceleratedRate: '5X on travel & dining worldwide',
      rewardType: 'Reward Points',
      redemptionOptions: ['Airmiles (KrisFlyer, Club Miles)', 'Hotel stays', 'Luxury shopping', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic & international Priority Pass for Premier customers' },
    eligibility: { minIncome: 3000000, minAge: 21, maxAge: 65, minCreditScore: 780, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Unlimited lounge access', 'Global concierge', 'ITC hotel benefits', 'Golf privileges worldwide', 'Zero forex for Premier'],
    pros: ['Unlimited global lounge', 'Strong global benefits', 'Best for international travelers'],
    cons: ['Only for HSBC Premier customers (very high threshold)', 'HSBC India network limited'],
    applyUrl: 'https://www.hsbc.co.in/credit-cards/products/premier-mastercard/',
    popularity: 55,
    rating: 4.3,
  },

  // ═══════════════════════════════════════
  //  SBI Card
  // ═══════════════════════════════════════
  {
    name: 'SBI Card ELITE',
    bank: 'SBI Card',
    cardType: 'premium',
    fees: { joiningFee: 4999, annualFee: 4999, annualFeeWaiver: 'Waived on spending ₹10L/year' },
    welcomeBenefits: [
      '5,000 reward points (worth ₹1,250)',
      'Complimentary e-gift voucher worth ₹5,000 (Brand Factory, Hush Puppies)',
    ],
    rewards: {
      baseRate: '2 reward points per ₹100 spent',
      acceleratedRate: '10X on dining, movies & groceries',
      rewardType: 'Reward Points',
      redemptionOptions: ['Flying Returns (Air India)', 'KrisFlyer (Singapore Airlines)', 'E-vouchers', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 6, international: 6, details: '6 domestic + 6 international via Priority Pass/year' },
    eligibility: { minIncome: 600000, minAge: 21, maxAge: 65, minCreditScore: 700, employmentType: ['salaried', 'self-employed'] },
    keyFeatures: ['BOGO movie tickets', 'Golf privileges (6 sessions/year)', 'Travel insurance', '1% fuel surcharge waiver', 'Complimentary memberships'],
    pros: ['Good welcome benefits', '10X reward rate on dining/movies', 'Broad merchant network', 'Easy waiver target'],
    cons: ['Annual fee significant', 'Reward redemption can be complex', 'Base rate is low'],
    applyUrl: 'https://www.sbicard.com/en/personal/credit-cards/travel-and-lifestyle/sbi-card-elite.page',
    popularity: 75,
    rating: 4.2,
  },

  // ═══════════════════════════════════════
  //  American Express
  // ═══════════════════════════════════════
  {
    name: 'Amex Platinum Travel',
    bank: 'American Express',
    cardType: 'premium',
    fees: { joiningFee: 5000, annualFee: 5000, annualFeeWaiver: 'Waived on spending ₹4L/year' },
    welcomeBenefits: [
      '5,000 Membership Rewards points',
      'Complimentary Taj Epicure membership (1 year)',
    ],
    rewards: {
      baseRate: '1 Membership Reward point per ₹50 spent',
      acceleratedRate: '5X points on IndiGo & Air India bookings',
      rewardType: 'Membership Rewards',
      redemptionOptions: ['Gold Collection (Taj, Marriott, Hilton)', 'Airmiles (Club Vistara, Air India)', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 8, international: 4, details: '8 domestic + 4 international lounge visits/year' },
    eligibility: { minIncome: 600000, minAge: 21, maxAge: 70, minCreditScore: 700, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['Amex Global network', 'Taj Epicure dining privileges', 'Exclusive hotel benefits', '24/7 customer service', 'Comprehensive insurance'],
    pros: ['Strong hotel & dining benefits', 'Taj Epicure membership', 'Good airport lounge access', 'Global Amex prestige'],
    cons: ['Limited merchant acceptance vs Visa/Mastercard', 'Complex points valuation', 'Fee not waived on low spend'],
    applyUrl: 'https://www.americanexpress.com/in/credit-cards/platinum-travel-credit-card/',
    popularity: 70,
    rating: 4.3,
  },

  // ═══════════════════════════════════════
  //  Citi Bank
  // ═══════════════════════════════════════
  {
    name: 'Citi Prestige Credit Card',
    bank: 'Citi Bank',
    cardType: 'premium',
    fees: { joiningFee: 20000, annualFee: 20000, annualFeeWaiver: 'No waiver — premium tier' },
    welcomeBenefits: [
      '10,000 ThankYou points on first spend',
      'Complimentary IHG One Rewards Platinum status',
    ],
    rewards: {
      baseRate: '1 ThankYou point per ₹1 spent',
      acceleratedRate: '5X on air travel & hotels worldwide',
      rewardType: 'ThankYou Points',
      redemptionOptions: ['15+ airline transfer partners', 'Luxury hotel bookings', 'Statement credit'],
    },
    cashback: { baseRate: '', categories: [], maxCashback: '' },
    loungeAccess: { domestic: 999, international: 999, details: 'Unlimited domestic & international via Priority Pass (Prestige Access)' },
    eligibility: { minIncome: 2500000, minAge: 21, maxAge: 65, minCreditScore: 800, employmentType: ['salaried', 'self-employed', 'business'] },
    keyFeatures: ['4th Night Hotel Free benefit', 'No foreign transaction fee', 'Unlimited lounge + guests', 'Global hotel elite status', 'Travel insurance'],
    pros: ['Best-in-class travel benefits', '4th night hotel perk', 'Extensive airline transfer partners', 'Unlimited global lounge'],
    cons: ['Very high annual fee', 'No fee waiver option', 'Citi India winding down operations'],
    applyUrl: 'https://www.citibank.co.in/credit-card/citi-prestige',
    popularity: 65,
    rating: 4.5,
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@cardcompare.com',
  password: 'Admin@123',
  role: 'admin',
};

const sampleUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'User@123',
  role: 'user',
  profile: { annualIncome: 3000000, age: 32, creditScore: 810, employmentType: 'salaried' },
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/creditcarddb');
    console.log('✅ Connected to MongoDB');

    await Card.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const inserted = await Card.insertMany(cards);
    console.log(`✅ Inserted ${inserted.length} premium credit cards`);

    await User.create(adminUser);
    await User.create(sampleUser);
    console.log('✅ Created admin and sample user');
    console.log('\n📧 Admin: admin@cardcompare.com | 🔑 Password: Admin@123');
    console.log('📧 User:  john@example.com      | 🔑 Password: User@123');

    await mongoose.disconnect();
    console.log('\n🎉 Premium card database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
