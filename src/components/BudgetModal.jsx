import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function BudgetModal({ 
  isOpen, 
  onClose, 
  budgets, 
  onSaveBudgets, 
  expenseCategories 
}) {
  const [localBudgets, setLocalBudgets] = useState({ ...budgets });

  // Sync localBudgets whenever modal opens or budgets prop changes
  useEffect(() => {
    if (isOpen) {
      setLocalBudgets({ ...budgets });
    }
  }, [budgets, isOpen]);

  if (!isOpen) return null;

  const handleChange = (catName, val) => {
    const num = Math.max(0, Number(val) || 0);
    setLocalBudgets((prev) => ({
      ...prev,
      [catName]: num
    }));
  };

  // Only sum budgets of active expenseCategories
  const totalCalculatedBudget = expenseCategories.reduce(
    (sum, c) => sum + (Number(localBudgets[c.name]) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {};
    expenseCategories.forEach((c) => {
      cleaned[c.name] = Number(localBudgets[c.name]) || 0;
    });
    onSaveBudgets(cleaned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-pink-950 p-5 sm:p-6 shadow-2xl border-t sm:border border-pink-100 dark:border-pink-900/80 max-h-[92vh] overflow-y-auto pb-safe">
        
        {/* iOS Sheet Grabber */}
        <div className="w-12 h-1.5 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-pink-100">
                Atur Budget Bulanan
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-pink-300">
                Tentukan batas maksimal jajan per kategori per bulan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal budget"
            className="p-2 rounded-full text-gray-400 hover:text-rose-500 bg-pink-50 dark:bg-pink-900/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Total Budget Banner */}
        <div className="p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/30 border border-pink-200 dark:border-pink-800 flex items-center justify-between">
          <span className="text-xs font-bold text-rose-900 dark:text-pink-200 flex items-center gap-1.5">
            <Sparkles size={14} className="text-pink-500" /> Total Anggaran:
          </span>
          <span className="text-sm font-extrabold text-rose-700 dark:text-pink-300">
            {formatRupiah(totalCalculatedBudget)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {expenseCategories.map((c) => (
              <div 
                key={c.id || c.name}
                className="p-3 rounded-2xl bg-pink-50/40 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{c.icon}</span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-rose-950 dark:text-pink-100 truncate">{c.name}</h5>
                    <span className="text-[10px] text-gray-400 dark:text-pink-400 block truncate">
                      {formatRupiah(localBudgets[c.name] || 0)}
                    </span>
                  </div>
                </div>

                <div className="w-36 relative shrink-0">
                  <span className="absolute left-2.5 top-2.5 text-[11px] font-bold text-rose-400">Rp</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={localBudgets[c.name] ?? ''}
                    onChange={(e) => handleChange(c.name, e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-white dark:bg-pink-900/60 border border-pink-200 dark:border-pink-800 text-xs font-bold text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-pink-100 dark:border-pink-900/50 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/40 hover:bg-pink-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-pink-300/50 dark:shadow-none hover:from-rose-600 hover:to-pink-600 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={15} /> Simpan Target Budget
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
