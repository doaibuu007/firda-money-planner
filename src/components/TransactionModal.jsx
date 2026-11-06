import React, { useState, useEffect } from 'react';
import { X, Check, Heart, Calendar, CreditCard } from 'lucide-react';
import { formatRupiah, getLocalDateString } from '../utils/helpers';
import confetti from 'canvas-confetti';

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTransaction,
  expenseCategories,
  incomeCategories,
  paymentMethods
}) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('🌸');
  const [date, setDate] = useState(getLocalDateString());
  const [paymentMethod, setPaymentMethod] = useState('QRIS / E-Wallet');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // R-32: Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setCategoryIcon(editingTransaction.categoryIcon || '🌸');
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod || 'QRIS / E-Wallet');
      setNote(editingTransaction.note || '');
    } else {
      setType('expense');
      setAmount('');
      const defaultCat = expenseCategories[0];
      setCategory(defaultCat ? defaultCat.name : '');
      setCategoryIcon(defaultCat ? defaultCat.icon : '🌸');
      setDate(getLocalDateString());
      setPaymentMethod('QRIS / E-Wallet');
      setNote('');
    }
    setError('');
  }, [editingTransaction, isOpen, expenseCategories, incomeCategories]);

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType) => {
    setType(newType);
    const targetCats = newType === 'expense' ? expenseCategories : incomeCategories;
    if (targetCats.length > 0) {
      setCategory(targetCats[0].name);
      setCategoryIcon(targetCats[0].icon);
    }
  };

  const handleQuickAddAmount = (addValue) => {
    const current = Number(amount) || 0;
    setAmount((current + addValue).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Masukkan nominal transaksi yang valid ya Firda! 💕');
      return;
    }

    if (!category) {
      setError('Pilih salah satu kategori transaksi terlebih dahulu.');
      return;
    }

    const payload = {
      id: editingTransaction ? editingTransaction.id : 'tx_' + Date.now(),
      type,
      amount: parsedAmount,
      category,
      categoryIcon,
      date,
      paymentMethod,
      note: note.trim()
    };

    onSave(payload);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fdf2f8']
      });
    } catch (_) {}

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[28px] sm:rounded-2xl bg-white dark:bg-[#1a0f18] p-5 sm:p-6 shadow-2xl border-t sm:border border-pink-100 dark:border-pink-900/80 max-h-[92vh] overflow-y-auto pb-safe">
        
        {/* iOS Grabber Pill */}
        <div className="w-12 h-1.5 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{type === 'expense' ? '💸' : '💚'}</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-pink-100">
                {editingTransaction ? 'Edit Catatan Keuangan' : 'Catat Transaksi Baru'}
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-pink-300">
                Catat pengeluaran & pemasukan secara rapi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup form transaksi"
            className="p-2 rounded-xl text-gray-500 hover:text-rose-600 bg-pink-50 dark:bg-pink-900/50 transition focus-visible:ring-2 focus-visible:ring-pink-400"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-1.5">
            <Heart size={14} className="fill-rose-500 text-rose-500 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tipe Selector: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-700 dark:text-pink-300 hover:text-rose-900'
              }`}
            >
              💸 Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-rose-700 dark:text-pink-300 hover:text-rose-900'
              }`}
            >
              💚 Pemasukan
            </button>
          </div>

          {/* Nominal Input & Quick Buttons (R-11: rounded-xl for crisp input structure) */}
          <div>
            <label htmlFor="tx-amount" className="block text-xs font-bold text-rose-900 dark:text-pink-200 mb-1">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-extrabold text-rose-400">Rp</span>
              <input
                id="tx-amount"
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-base font-bold text-rose-950 dark:text-pink-100 placeholder-pink-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>
            {amount && !isNaN(Number(amount)) && (
              <p className="text-[11px] text-rose-600 dark:text-pink-300 font-medium mt-1">
                Terbaca: <strong>{formatRupiah(Number(amount))}</strong>
              </p>
            )}

            {/* Quick Amount Addition Buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {[10000, 25000, 50000, 100000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-100 dark:bg-pink-900 text-rose-700 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800 active:scale-95 transition"
                >
                  +{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori Picker (Grid) */}
          <div>
            <span className="block text-xs font-bold text-rose-900 dark:text-pink-200 mb-1.5">
              Pilih Kategori
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-0.5">
              {currentCategories.map((c) => {
                const isSelected = category === c.name;
                return (
                  <button
                    key={c.id || c.name}
                    type="button"
                    onClick={() => {
                      setCategory(c.name);
                      setCategoryIcon(c.icon);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition text-left active:scale-95 ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-pink-50/40 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800 text-rose-950 dark:text-pink-200 hover:bg-pink-100/70'
                    }`}
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tanggal & Metode Pembayaran Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-date" className="block text-xs font-bold text-rose-900 dark:text-pink-200 mb-1 flex items-center gap-1">
                <Calendar size={12} /> Tanggal
              </label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            <div>
              <label htmlFor="tx-payment" className="block text-xs font-bold text-rose-900 dark:text-pink-200 mb-1 flex items-center gap-1">
                <CreditCard size={12} /> Metode Pembayaran
              </label>
              <select
                id="tx-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              >
                {paymentMethods.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.icon} {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label htmlFor="tx-note" className="block text-xs font-bold text-rose-900 dark:text-pink-200 mb-1">
              Catatan (Opsional)
            </label>
            <input
              id="tx-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Beli boba manis bareng teman 🧋"
              className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 placeholder-pink-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Footer Submit (R-04: Functional Check icon instead of gratuitous Sparkles) */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/40 hover:bg-pink-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-300/40 dark:shadow-none hover:from-rose-600 hover:to-pink-600 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={15} /> Simpan Catatan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
