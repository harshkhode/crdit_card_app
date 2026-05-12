export const formatCurrency = (amount) => {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

// Bank colors for badges / chips (dark-theme palette)
export const BANK_COLORS = {
  'HDFC Bank':        { bg: 'bg-blue-900/30',   border: 'border-blue-700/40',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  'ICICI Bank':       { bg: 'bg-red-900/30',    border: 'border-red-700/40',    text: 'text-red-300',    dot: 'bg-red-400' },
  'Axis Bank':        { bg: 'bg-purple-900/30', border: 'border-purple-700/40', text: 'text-purple-300', dot: 'bg-purple-400' },
  'IDFC First Bank':  { bg: 'bg-green-900/30',  border: 'border-green-700/40',  text: 'text-green-300',  dot: 'bg-green-400' },
  'HSBC Bank':        { bg: 'bg-gray-800/40',   border: 'border-gray-600/40',   text: 'text-gray-300',   dot: 'bg-gray-400' },
  'SBI Card':         { bg: 'bg-indigo-900/30', border: 'border-indigo-700/40', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  'American Express': { bg: 'bg-zinc-800/40',   border: 'border-zinc-600/40',   text: 'text-zinc-300',   dot: 'bg-zinc-400' },
  'Citi Bank':        { bg: 'bg-sky-900/30',    border: 'border-sky-700/40',    text: 'text-sky-300',    dot: 'bg-sky-400' },
};

export const CARD_TYPE_LABELS = {
  rewards:   'Rewards',
  cashback:  'Cashback',
  travel:    'Travel',
  lifestyle: 'Lifestyle',
  fuel:      'Fuel',
  business:  'Business',
  premium:   'Premium',
};

export const CARD_TYPE_COLORS = {
  rewards:   'bg-indigo-900/40 text-indigo-300',
  cashback:  'bg-green-900/40 text-green-300',
  travel:    'bg-sky-900/40 text-sky-300',
  lifestyle: 'bg-pink-900/40 text-pink-300',
  fuel:      'bg-yellow-900/40 text-yellow-300',
  business:  'bg-gray-800/40 text-gray-300',
  premium:   'bg-yellow-900/30 text-yellow-300',
};

// Full CSS gradient strings for inline styles (luxury dark finishes)
export const getBankGradient = (bank) => {
  const g = {
    'HDFC Bank':
      'linear-gradient(145deg, #020b24 0%, #071a52 35%, #0c2880 65%, #071a52 100%)',
    'ICICI Bank':
      'linear-gradient(145deg, #1a0505 0%, #3d0c0c 35%, #5e1010 65%, #3d0c0c 100%)',
    'Axis Bank':
      'linear-gradient(145deg, #0d0520 0%, #22094a 35%, #360e72 65%, #22094a 100%)',
    'IDFC First Bank':
      'linear-gradient(145deg, #021a0a 0%, #073d1a 35%, #0b6030 65%, #073d1a 100%)',
    'HSBC Bank':
      'linear-gradient(145deg, #0d0d0d 0%, #1a0606 35%, #280a0a 65%, #1a0606 100%)',
    'SBI Card':
      'linear-gradient(145deg, #04081e 0%, #09183d 35%, #0e2460 65%, #09183d 100%)',
    'American Express':
      'linear-gradient(145deg, #0a0a0a 0%, #161616 35%, #222222 65%, #161616 100%)',
    'Citi Bank':
      'linear-gradient(145deg, #020c1f 0%, #081c3e 35%, #0e2b60 65%, #081c3e 100%)',
  };
  return g[bank] || 'linear-gradient(145deg, #0f0f1e 0%, #1a1a32 50%, #0f0f1e 100%)';
};

// Accent color for bank (used for glow/border effects)
export const getBankAccent = (bank) => {
  const a = {
    'HDFC Bank':        'rgba(59,130,246,0.4)',
    'ICICI Bank':       'rgba(239,68,68,0.4)',
    'Axis Bank':        'rgba(139,92,246,0.4)',
    'IDFC First Bank':  'rgba(16,185,129,0.4)',
    'HSBC Bank':        'rgba(156,163,175,0.35)',
    'SBI Card':         'rgba(99,102,241,0.4)',
    'American Express': 'rgba(161,161,170,0.35)',
    'Citi Bank':        'rgba(14,165,233,0.4)',
  };
  return a[bank] || 'rgba(201,168,64,0.3)';
};

export const truncate = (str, n = 80) => (str && str.length > n ? str.slice(0, n) + '…' : str);
