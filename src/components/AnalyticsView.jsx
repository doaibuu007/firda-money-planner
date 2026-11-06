import React, { useState, useMemo } from 'react';
import { PieChart, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { formatRupiah, getLocalDateString, parseLocalDate } from '../utils/helpers';

export default function AnalyticsView({ transactions, expenseCategories }) {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth'); // 'thisMonth' | '7days' | 'lastMonth' | 'all'

  // Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    if (selectedPeriod === 'all') return transactions;

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    return transactions.filter((t) => {
      const txDate = parseLocalDate(t.date);
      if (selectedPeriod === 'thisMonth') {
        return txDate.getMonth() === curMonth && txDate.getFullYear() === curYear;
      }
      if (selectedPeriod === 'lastMonth') {
        const lastMonthDate = new Date(curYear, curMonth - 1, 1);
        return (
          txDate.getMonth() === lastMonthDate.getMonth() &&
          txDate.getFullYear() === lastMonthDate.getFullYear()
        );
      }
      if (selectedPeriod === '7days') {
        const diffDays = Math.floor((now - txDate) / 86400000);
        return diffDays >= 0 && diffDays < 7;
      }
      return true;
    });
  }, [transactions, selectedPeriod]);

  // Filter expenses and incomes in the period
  const expenses = filteredTransactions.filter((t) => t.type === 'expense');
  const incomes = filteredTransactions.filter((t) => t.type === 'income');

  // Calculate totals by category
  const categoryTotals = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  const totalExpenseAmount = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalIncomeAmount = incomes.reduce((sum, t) => sum + Number(t.amount), 0);

  // Array of category data sorted descending
  const sortedCategories = Object.keys(categoryTotals)
    .map((catName) => {
      const catConfig = expenseCategories.find((c) => c.name === catName) || {
        icon: '🌸',
        color: '#fb7185'
      };
      const amount = categoryTotals[catName];
      const percentage = totalExpenseAmount > 0 ? ((amount / totalExpenseAmount) * 100).toFixed(1) : 0;
      return {
        name: catName,
        amount,
        percentage,
        icon: catConfig.icon,
        color: catConfig.color
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Last 7 days daily trend data
  const dailyTrend = useMemo(() => {
    const days = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = getLocalDateString(d);
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.date === dateStr)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      days.push({
        dateStr,
        label: i === 0 ? 'Hari Ini' : dayNames[d.getDay()],
        shortDate: `${d.getDate()}/${d.getMonth() + 1}`,
        spent
      });
    }
    const maxSpent = Math.max(...days.map((d) => d.spent), 1);
    return days.map((d) => ({
      ...d,
      heightPercent: Math.round((d.spent / maxSpent) * 100)
    }));
  }, [transactions]);

  // SVG Donut Chart helper calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSlices = sortedCategories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += Number(cat.percentage);
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const topCategory = sortedCategories[0];

  const periodLabels = {
    thisMonth: 'Bulan Ini',
    '7days': '7 Hari Terakhir',
    lastMonth: 'Bulan Lalu',
    all: 'Semua Waktu'
  };

  return (
    <div className="space-y-5">
      
      {/* Period Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1a0f18] p-3.5 rounded-2xl border border-pink-100 dark:border-pink-900/50 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-pink-100">
          <Calendar size={15} className="text-rose-500 dark:text-pink-400" />
          <span>Periode Analisis:</span>
        </div>
        <div className="flex items-center gap-1 bg-pink-50 dark:bg-pink-900/40 p-1 rounded-xl border border-pink-100 dark:border-pink-800 overflow-x-auto no-scrollbar">
          {Object.entries(periodLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedPeriod === key
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-700 dark:text-pink-300 hover:text-rose-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Highlight (R-04: TrendingUp icon instead of generic Sparkles) */}
      <div className="p-5 rounded-2xl bg-pink-100/60 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-pink-900/80 shadow-xs flex items-center justify-center text-rose-500 dark:text-pink-300 shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 dark:text-pink-100 text-sm sm:text-base flex items-center gap-1.5">
              Insight Keuangan ({periodLabels[selectedPeriod]})
            </h3>
            <p className="text-xs text-rose-700/90 dark:text-pink-300 mt-0.5">
              {topCategory 
                ? `Pengeluaran terbesar ada di "${topCategory.name}" (${topCategory.percentage}% dari total pengeluaran periode ini).`
                : 'Belum ada data pengeluaran pada periode ini. Yuk mulai catat pengeluaran kamu!'}
            </p>
          </div>
        </div>

        {topCategory && (
          <div className="bg-white/90 dark:bg-pink-900/70 px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-800 flex items-center gap-2 self-stretch sm:self-auto justify-center shrink-0">
            <span className="text-xl">{topCategory.icon}</span>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-rose-500 font-bold block">Top Spending</span>
              <span className="text-xs font-extrabold text-rose-900 dark:text-pink-100">{formatRupiah(topCategory.amount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Daily Expense Trend Bar Chart */}
      <div className="rounded-2xl bg-white dark:bg-[#1a0f18] p-5 sm:p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200 flex items-center gap-2">
            <BarChart3 size={16} className="text-rose-500 dark:text-pink-400" /> Tren Pengeluaran 7 Hari Terakhir
          </h4>
          <span className="text-[11px] text-rose-700 dark:text-pink-300 font-medium">
            Harian
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-36 pt-6 px-1">
          {dailyTrend.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[9px] font-bold text-rose-600 dark:text-pink-300 mb-1 opacity-85 truncate max-w-full">
                {day.spent > 0 ? `${Math.round(day.spent / 1000)}k` : '-'}
              </span>
              <div className="w-full max-w-[34px] bg-pink-100/70 dark:bg-pink-900/40 rounded-t-lg h-20 flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    day.spent > 0
                      ? 'bg-gradient-to-t from-rose-500 to-pink-400'
                      : 'bg-pink-200/40 dark:bg-pink-800/30'
                  }`}
                  style={{ height: `${day.spent > 0 ? Math.max(day.heightPercent, 12) : 6}%` }}
                  title={`${day.label} (${day.shortDate}): ${formatRupiah(day.spent)}`}
                />
              </div>
              <span className="text-[10px] font-bold text-rose-900 dark:text-pink-200 mt-1.5">
                {day.label}
              </span>
              <span className="text-[9px] text-rose-700/70 dark:text-pink-400">
                {day.shortDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SVG Donut Chart (R-11: Dark mode track background adaptation) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#1a0f18] p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200 mb-4 flex items-center gap-2 self-start">
            <PieChart size={16} className="text-rose-500 dark:text-pink-400" /> Proporsi Kategori
          </h4>

          {totalExpenseAmount > 0 ? (
            <div className="relative flex items-center justify-center my-2">
              <svg width="210" height="210" viewBox="0 0 180 180" className="transform -rotate-90">
                {/* R-34: Adaptive background circle in dark mode */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  strokeWidth="24"
                  className="stroke-[#fce7f3] dark:stroke-[#2e1324]"
                />
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="24"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                  >
                    <title>{`${slice.name}: ${formatRupiah(slice.amount)} (${slice.percentage}%)`}</title>
                  </circle>
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-rose-600 dark:text-pink-300 font-semibold uppercase">Total Keluar</span>
                <span className="text-sm font-extrabold text-rose-900 dark:text-pink-100 mt-0.5">
                  {formatRupiah(totalExpenseAmount)}
                </span>
                <span className="text-[10px] text-rose-700/80 dark:text-pink-300/80">
                  {expenses.length} transaksi
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-rose-700/70 dark:text-pink-400 text-xs">
              <p>Belum ada pengeluaran di periode ini</p>
            </div>
          )}

          {/* Quick Stats: Income vs Expense bar */}
          <div className="w-full mt-5 pt-4 border-t border-pink-100 dark:border-pink-900/50 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                🟢 Masuk: {formatRupiah(totalIncomeAmount)}
              </span>
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                🔴 Keluar: {formatRupiah(totalExpenseAmount)}
              </span>
            </div>
            <div className="h-3 w-full bg-pink-100 dark:bg-pink-900/60 rounded-full flex overflow-hidden">
              <div 
                className="bg-emerald-400 transition-all duration-500"
                style={{ 
                  width: totalIncomeAmount + totalExpenseAmount > 0 
                    ? `${(totalIncomeAmount / (totalIncomeAmount + totalExpenseAmount)) * 100}%` 
                    : '50%' 
                }}
                title="Pemasukan"
              />
              <div 
                className="bg-rose-500 transition-all duration-500"
                style={{ 
                  width: totalIncomeAmount + totalExpenseAmount > 0 
                    ? `${(totalExpenseAmount / (totalIncomeAmount + totalExpenseAmount)) * 100}%` 
                    : '50%' 
                }}
                title="Pengeluaran"
              />
            </div>
          </div>
        </div>

        {/* Detailed Category Breakdown Bars */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#1a0f18] p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200 flex items-center gap-2">
              <span>📋</span> Rincian Kategori ({periodLabels[selectedPeriod]})
            </h4>
            <span className="text-xs text-rose-700/80 dark:text-pink-300/80 font-medium">
              Terbesar ke terkecil
            </span>
          </div>

          {sortedCategories.length > 0 ? (
            <div className="space-y-3.5">
              {sortedCategories.map((cat, index) => (
                <div key={index} className="space-y-1.5 p-2 rounded-xl hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-semibold text-rose-950 dark:text-pink-100">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-900 dark:text-pink-100">{formatRupiah(cat.amount)}</span>
                      {/* R-25: High contrast text on percentage */}
                      <span className="text-rose-700/70 dark:text-pink-300/80 ml-1.5 font-medium">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-pink-100/70 dark:bg-pink-900/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-rose-700/70 dark:text-pink-400 text-xs">
              <p>Tidak ada rincian pengeluaran pada periode ini.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
