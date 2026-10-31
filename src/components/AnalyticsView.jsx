import React, { useState } from 'react';
import { PieChart, TrendingDown, Sparkles, Award, DollarSign, Calendar } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function AnalyticsView({ transactions, expenseCategories }) {
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Filter expenses only
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  // Calculate totals by category
  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  const totalExpenseAmount = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalIncomeAmount = incomes.reduce((sum, t) => sum + Number(t.amount), 0);

  // Array of category data sorted descending
  const sortedCategories = Object.keys(categoryTotals)
    .map(catName => {
      const catConfig = expenseCategories.find(c => c.name === catName) || {
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

  // SVG Donut Chart helper calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSlices = sortedCategories.map(cat => {
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner Highlight */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 dark:from-pink-950/60 dark:to-pink-900/40 border border-pink-200 dark:border-pink-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-pink-900/80 shadow-xs flex items-center justify-center text-2xl">
            📊
          </div>
          <div>
            <h3 className="font-bold text-rose-900 dark:text-pink-100 text-base sm:text-lg flex items-center gap-2">
              Analisis Keuangan Pintar <Sparkles size={16} className="text-pink-500" />
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-pink-300">
              {topCategory 
                ? `Pengeluaran paling besar kamu ada di "${topCategory.name}" (${topCategory.percentage}% dari total jajan).`
                : 'Belum ada data pengeluaran yang dicatat. Yuk mulai catat jajan kamu hari ini! 💕'}
            </p>
          </div>
        </div>

        {topCategory && (
          <div className="bg-white/80 dark:bg-pink-900/70 px-4 py-2 rounded-2xl border border-pink-200 dark:border-pink-800 flex items-center gap-2 self-stretch sm:self-auto justify-center">
            <span className="text-xl">{topCategory.icon}</span>
            <div className="text-left">
              <span className="text-2xs uppercase tracking-wider text-rose-500 font-bold block">Top Spending</span>
              <span className="text-xs font-bold text-rose-900 dark:text-pink-100">{formatRupiah(topCategory.amount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Donut Chart */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-pink-950/40 p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200 mb-6 flex items-center gap-2 self-start">
            <PieChart size={16} className="text-pink-500" /> Proporsi Pengeluaran Kategori
          </h4>

          {totalExpenseAmount > 0 ? (
            <div className="relative flex items-center justify-center my-3">
              <svg width="220" height="220" viewBox="0 0 180 180" className="transform -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#fce7f3"
                  strokeWidth="24"
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
                  />
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xs text-rose-500 dark:text-pink-300 font-semibold uppercase">Total Jajan</span>
                <span className="text-sm sm:text-base font-extrabold text-rose-900 dark:text-pink-100 mt-0.5">
                  {formatRupiah(totalExpenseAmount)}
                </span>
                <span className="text-2xs text-gray-400 dark:text-pink-400">
                  {expenses.length} transaksi
                </span>
              </div>
            </div>
          ) : (
            <div className="py-14 text-center text-gray-400 dark:text-pink-400 text-xs">
              <p>Belum ada data pengeluaran untuk ditampilkan grafik</p>
            </div>
          )}

          {/* Quick Stats: Income vs Expense bar */}
          <div className="w-full mt-6 pt-4 border-t border-pink-100 dark:border-pink-900/50 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                🟢 Pemasukan: {formatRupiah(totalIncomeAmount)}
              </span>
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                🔴 Pengeluaran: {formatRupiah(totalExpenseAmount)}
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
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-pink-950/40 p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-bold text-rose-900 dark:text-pink-200 flex items-center gap-2">
              <span>📋</span> Rincian per Kategori
            </h4>
            <span className="text-xs text-rose-500 font-medium">
              Diurutkan dari terbesar
            </span>
          </div>

          {sortedCategories.length > 0 ? (
            <div className="space-y-4">
              {sortedCategories.map((cat, index) => (
                <div key={index} className="space-y-1.5 p-2 rounded-2xl hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-semibold text-rose-950 dark:text-pink-100">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-900 dark:text-pink-100">{formatRupiah(cat.amount)}</span>
                      <span className="text-gray-400 dark:text-pink-400 ml-1.5 font-medium">({cat.percentage}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
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
            <div className="py-12 text-center text-gray-400 dark:text-pink-400 text-xs">
              <p>Tidak ada rincian transaksi untuk ditampilkan.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
