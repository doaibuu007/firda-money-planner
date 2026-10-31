import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function SummaryCards({ 
  totalBalance, 
  monthlyIncome, 
  monthlyExpense, 
  totalMonthlyBudget,
  remainingBudget,
  isIphonePreview = false
}) {
  const budgetUsagePercent = totalMonthlyBudget > 0 
    ? Math.min(Math.round((monthlyExpense / totalMonthlyBudget) * 100), 100) 
    : 0;

  const isOverBudget = monthlyExpense > totalMonthlyBudget && totalMonthlyBudget > 0;
  const isBudgetWarning = budgetUsagePercent >= 80 && !isOverBudget;

  return (
    <div className="mb-5">
      {/* 1. MOBILE / IPHONE COMPACT APPLE-WALLET STYLE CARD */}
      <div className={`${isIphonePreview ? 'block' : 'block lg:hidden'} space-y-3`}>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 p-5 text-white shadow-xl shadow-pink-300/40 dark:shadow-none border border-pink-400/40">
          {/* Decorative glow circles */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-pink-300/20 rounded-full blur-xl pointer-events-none" />

          {/* Header row */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-100 flex items-center gap-1.5">
              <Wallet size={13} /> Total Saldo Dompet
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
              🌸 Firda Wallet
            </span>
          </div>

          {/* Main Balance */}
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            {formatRupiah(totalBalance)}
          </div>

          {/* Glass Pill: Pemasukan & Pengeluaran side-by-side */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/25 border border-emerald-300/40 flex items-center justify-center shrink-0">
                <ArrowUpRight size={16} className="text-emerald-200" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-pink-100 block">Pemasukan</span>
                <span className="text-xs font-extrabold text-white truncate block">
                  {formatRupiah(monthlyIncome)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0 border-l border-white/20 pl-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-200/25 border border-rose-200/40 flex items-center justify-center shrink-0">
                <ArrowDownRight size={16} className="text-pink-100" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-pink-100 block">Pengeluaran</span>
                <span className="text-xs font-extrabold text-white truncate block">
                  {formatRupiah(monthlyExpense)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Sisa Budget Pill for iPhone */}
        <div className="rounded-2xl bg-white dark:bg-pink-950/50 p-3.5 border border-pink-100 dark:border-pink-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-900 dark:text-pink-100 flex items-center gap-1.5">
              <span>🎯</span> Sisa Budget Bulanan
            </span>
            <span className={`text-xs font-extrabold ${
              isOverBudget ? 'text-red-500' : isBudgetWarning ? 'text-amber-500' : 'text-rose-600 dark:text-pink-300'
            }`}>
              {formatRupiah(remainingBudget)}
            </span>
          </div>
          <div className="w-full bg-pink-100 dark:bg-pink-900/60 rounded-full h-2 mb-1 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : isBudgetWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-pink-400 to-rose-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-pink-300/70 font-medium">
            <span>Terpakai {budgetUsagePercent}%</span>
            <span>Limit: {formatRupiah(totalMonthlyBudget)}</span>
          </div>
        </div>
      </div>

      {/* 2. DESKTOP 4-COLUMN GRID */}
      {!isIphonePreview && (
        <div className="hidden lg:grid grid-cols-4 gap-4">
          {/* 1. Saldo Utama */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 p-5 text-white shadow-lg shadow-pink-200/50 dark:shadow-none border border-pink-400/30">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-100 flex items-center gap-1.5">
                <Wallet size={14} /> Total Saldo Tabungan
              </span>
              <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-xs font-bold">
                ✨ Cashflow
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {formatRupiah(totalBalance)}
            </div>
            <div className="text-xs text-pink-100/90 flex items-center gap-1 font-medium">
              <HeartHandshake size={13} />
              <span>{totalBalance >= 0 ? 'Kondisi dompet aman & rapi' : 'Perlu hemat dulu ya Firda 💕'}</span>
            </div>
          </div>

          {/* 2. Pemasukan Bulan Ini */}
          <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-5 border border-pink-100 dark:border-pink-900/50 shadow-xs hover:border-pink-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-pink-300 flex items-center gap-1.5">
                <ArrowUpRight size={14} className="text-emerald-500" /> Pemasukan Bulan Ini
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                💚
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              {formatRupiah(monthlyIncome)}
            </div>
            <p className="text-xs text-gray-500 dark:text-pink-300/60">
              Uang masuk & gaji terdata
            </p>
          </div>

          {/* 3. Pengeluaran Bulan Ini */}
          <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-5 border border-pink-100 dark:border-pink-900/50 shadow-xs hover:border-pink-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-pink-300 flex items-center gap-1.5">
                <ArrowDownRight size={14} className="text-rose-500" /> Pengeluaran Bulan Ini
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">
                💸
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mb-1">
              {formatRupiah(monthlyExpense)}
            </div>
            <p className="text-xs text-gray-500 dark:text-pink-300/60">
              Total jajan & belanja bulanan
            </p>
          </div>

          {/* 4. Sisa Budget Bulanan */}
          <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-5 border border-pink-100 dark:border-pink-900/50 shadow-xs hover:border-pink-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-pink-300 flex items-center gap-1.5">
                <Sparkles size={14} /> Sisa Budget
              </span>
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-bold">
                🎯
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1.5 ${
              isOverBudget ? 'text-red-500' : isBudgetWarning ? 'text-amber-500' : 'text-pink-600 dark:text-pink-300'
            }`}>
              {formatRupiah(remainingBudget)}
            </div>
            
            <div className="w-full bg-pink-100 dark:bg-pink-900/60 rounded-full h-2 mb-1.5 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-red-500' : isBudgetWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-pink-400 to-rose-500'
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-2xs text-gray-500 dark:text-pink-300/70 font-medium">
              <span>Terpakai {budgetUsagePercent}%</span>
              <span>Target: {formatRupiah(totalMonthlyBudget)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
