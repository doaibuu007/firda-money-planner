export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'cat_food', name: 'Makanan & Jajan', icon: '🍰', color: '#f43f5e' },
  { id: 'cat_beauty', name: 'Skincare & Makeup', icon: '💄', color: '#ec4899' },
  { id: 'cat_shopping', name: 'Fashion & Belanja', icon: '🛍️', color: '#d946ef' },
  { id: 'cat_cafe', name: 'Nongkrong & Kopi', icon: '☕', color: '#a855f7' },
  { id: 'cat_transport', name: 'Transport & Bensin', icon: '🛵', color: '#8b5cf6' },
  { id: 'cat_bills', name: 'Pulsa & Tagihan', icon: '📱', color: '#6366f1' },
  { id: 'cat_entertainment', name: 'Self Care & Hiburan', icon: '✨', color: '#f59e0b' },
  { id: 'cat_other', name: 'Lain-lain', icon: '🌸', color: '#fb7185' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'cat_salary', name: 'Gaji Bulanan', icon: '💼', color: '#10b981' },
  { id: 'cat_allowance', name: 'Uang Saku / Ortu', icon: '💌', color: '#14b8a6' },
  { id: 'cat_freelance', name: 'Side Hustle / Usaha', icon: '🎀', color: '#06b6d4' },
  { id: 'cat_gift', name: 'Hadiah / Bonus', icon: '🎁', color: '#3b82f6' },
  { id: 'cat_inc_other', name: 'Pemasukan Lain', icon: '🌟', color: '#84cc16' },
];

export const PAYMENT_METHODS = [
  { id: 'qris', name: 'QRIS / E-Wallet', icon: '📱' },
  { id: 'bca', name: 'Transfer Bank', icon: '💳' },
  { id: 'shopeepay', name: 'ShopeePay / GoPay', icon: '🛍️' },
  { id: 'cash', name: 'Uang Tunai (Cash)', icon: '💵' },
];

export const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 5000000,
    category: 'Gaji Bulanan',
    categoryIcon: '💼',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    note: 'Gaji pokok bulan ini ✨',
    paymentMethod: 'Transfer Bank'
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 45000,
    category: 'Nongkrong & Kopi',
    categoryIcon: '☕',
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    note: 'Iced Caramel Macchiato with friends',
    paymentMethod: 'QRIS / E-Wallet'
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 185000,
    category: 'Skincare & Makeup',
    categoryIcon: '💄',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    note: 'Sunscreen & Cushion refill',
    paymentMethod: 'ShopeePay / GoPay'
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 75000,
    category: 'Makanan & Jajan',
    categoryIcon: '🍰',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    note: 'Seblak komplit + boba manis',
    paymentMethod: 'Uang Tunai (Cash)'
  },
  {
    id: 'tx-5',
    type: 'income',
    amount: 350000,
    category: 'Side Hustle / Usaha',
    categoryIcon: '🎀',
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    note: 'Hasil jualan jepit & gelang handmade',
    paymentMethod: 'QRIS / E-Wallet'
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 120000,
    category: 'Fashion & Belanja',
    categoryIcon: '🛍️',
    date: new Date().toISOString().split('T')[0],
    note: 'Cardigan rajut warna soft pink 🌸',
    paymentMethod: 'ShopeePay / GoPay'
  }
];

export const DEFAULT_BUDGETS = {
  'Makanan & Jajan': 1500000,
  'Skincare & Makeup': 600000,
  'Fashion & Belanja': 800000,
  'Nongkrong & Kopi': 400000,
  'Transport & Bensin': 300000,
  'Pulsa & Tagihan': 250000,
  'Self Care & Hiburan': 350000,
};
