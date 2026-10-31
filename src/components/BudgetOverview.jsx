import React from 'react';
import { AlertCircle, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function BudgetOverview({ 
  budgets, 
  transactions, 
  expenseCategories,
  onOpenBudgetModal,
  isIphonePreview = false
}) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categorySpent = {};
  currentMonthExpenses.forEach(t => {
    categorySpent[t.category] = (categorySpent[t.category] || 0) + Number(t.amount);
  });

  const budgetEntries = Object.entries(budgets)
    .filter(([_, limit]) => Number(limit) > 0)
    .map(([catName, limit]) => {
      const spent = categorySpent[catName] || 0;
      const percentage = Math.round((spent / Number(limit)) * 100);
      const remaining = Number(limit) - spent;
      const catConfig = expenseCategories.find(c => c.name === catName) || {
        icon: '🌸',
        color: '#f43f5e'
      };

      return {
        name: catName,
        limit: Number(limit),
        spent,
        percentage,
        remaining,
        icon: catConfig.icon,
        color: catConfig.color
      };
    });

  if (budgetEntries.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-5 border border-pink-100 dark:border-pink-900/50 shadow-xs mb-5 text-center">
        <div className="text-3xl mb-2">🎯</div>
        <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200">Belum Ada Budget Bulanan</h4>
        <p className="text-xs text-rose-600/70 dark:text-pink-300/70 max-w-md mx-auto mt-1 mb-3">
          Atur batas pengeluaran untuk jajan, fashion, atau skincare agar keuangan kamu tetap terkontrol! 💕
        </p>
        <button
          onClick={onOpenBudgetModal}
          className="px-4 py-2 rounded-2xl bg-pink-100 dark:bg-pink-900 text-rose-700 dark:text-pink-200 text-xs font-bold hover:bg-pink-200 transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <SlidersHorizontal size={14} /> Atur Budget Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-4 sm:p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs mb-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold shrink-0">
            🎯
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-base font-bold text-rose-900 dark:text-pink-100 truncate">
              Budget Kategori Bulan Ini
            </h3>
            <p className="text-[11px] text-rose-500/80 dark:text-pink-300/70 font-medium truncate">
              Geser untuk cek sisa kuota jajan ✨
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="text-xs font-bold text-rose-600 dark:text-pink-300 hover:text-rose-800 flex items-center gap-0.5 py-1.5 px-2.5 rounded-xl bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 transition cursor-pointer shrink-0 active:scale-95"
        >
          <span>Atur</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Horizontal Swipe Carousel on iPhone / Mobile, Grid on Desktop */}
      <div className={
        isIphonePreview
          ? 'flex overflow-x-auto gap-3 pb-1 no-scrollbar snap-x snap-mandatory'
          : 'flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible gap-3 pb-1 md:pb-0 no-scrollbar snap-x snap-mandatory'
      }>
        {budgetEntries.map((item, idx) => {
          const isOver = item.percentage > 100;
          const isWarning = item.percentage >= 80 && !isOver;

          return (
            <div 
              key={idx}
              className={`snap-start shrink-0 w-[235px] ${isIphonePreview ? '' : 'md:w-auto'} p-3.5 rounded-2xl border transition-all ${
                isOver 
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/70' 
                  : isWarning 
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/70' 
                  : 'bg-pink-50/40 dark:bg-pink-900/20 border-pink-100 dark:border-pink-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold text-rose-950 dark:text-pink-100 truncate">{item.name}</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                  isOver 
                    ? 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200' 
                    : isWarning 
                    ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                }`}>
                  {item.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white dark:bg-pink-950/60 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isOver 
                      ? 'bg-rose-500' 
                      : isWarning 
                      ? 'bg-amber-400' 
                      : 'bg-gradient-to-r from-pink-400 to-rose-400'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 dark:text-pink-300/70">
                  <strong className="text-rose-900 dark:text-pink-100">{formatRupiah(item.spent)}</strong>
                </span>
                <span className="text-gray-400 dark:text-pink-400">
                  / {formatRupiah(item.limit)}
                </span>
              </div>

              {isOver && (
                <div className="mt-1.5 text-[10px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertCircle size={11} /> Lewat {formatRupiah(Math.abs(item.remaining))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
