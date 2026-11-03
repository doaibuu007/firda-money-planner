import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles
} from 'lucide-react';
import { formatRupiah, formatDateIndo, getLocalDateString, parseLocalDate } from '../utils/helpers';

export default function TransactionList({ 
  transactions, 
  onEditTransaction, 
  onDeleteTransaction,
  onOpenAddModal,
  onLoadSampleData,
  categories 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, expense, income
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all'); // all, today, 7days, thisMonth, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedType !== 'all' && t.type !== selectedType) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const noteMatch = (t.note || '').toLowerCase().includes(query);
        const catMatch = (t.category || '').toLowerCase().includes(query);
        const methodMatch = (t.paymentMethod || '').toLowerCase().includes(query);
        const amountMatch = t.amount.toString().includes(query);
        if (!noteMatch && !catMatch && !methodMatch && !amountMatch) return false;
      }

      if (selectedTimeRange !== 'all') {
        const txDate = parseLocalDate(t.date);
        const now = new Date();
        const todayStr = getLocalDateString(now);

        if (selectedTimeRange === 'today') {
          if (t.date !== todayStr) return false;
        } else if (selectedTimeRange === '7days') {
          const diffDays = Math.floor((now - txDate) / 86400000);
          if (diffDays < 0 || diffDays > 7) return false;
        } else if (selectedTimeRange === 'thisMonth') {
          if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (selectedTimeRange === 'custom') {
          if (customStartDate && t.date < customStartDate) return false;
          if (customEndDate && t.date > customEndDate) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return parseLocalDate(b.date) - parseLocalDate(a.date);
      if (sortBy === 'date-asc') return parseLocalDate(a.date) - parseLocalDate(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, selectedType, selectedCategory, selectedTimeRange, customStartDate, customEndDate, sortBy]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedTimeRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-pink-950/40 p-4 sm:p-6 border border-pink-100 dark:border-pink-900/50 shadow-xs">
      
      {/* Title & Segmented iOS Type Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-rose-900 dark:text-pink-100 flex items-center gap-1.5">
            Riwayat Transaksi 🌸
          </h3>
          <p className="text-[11px] text-rose-500/80 dark:text-pink-300/70">
            Menampilkan {filteredTransactions.length} dari {transactions.length} catatan
          </p>
        </div>

        {/* iOS Segmented Control for Type */}
        <div className="grid grid-cols-3 gap-1 bg-pink-50 dark:bg-pink-900/40 p-1 rounded-2xl border border-pink-100 dark:border-pink-800 w-full sm:w-auto">
          <button
            onClick={() => { setSelectedType('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              selectedType === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 dark:text-pink-300'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => { setSelectedType('expense'); setCurrentPage(1); }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
              selectedType === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 dark:text-pink-300'
            }`}
          >
            💸 Keluar
          </button>
          <button
            onClick={() => { setSelectedType('income'); setCurrentPage(1); }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
              selectedType === 'income'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-rose-700 dark:text-pink-300'
            }`}
          >
            💚 Masuk
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
        {/* 1. Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-pink-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Cari catatan / nominal..."
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 placeholder-pink-400 focus:outline-hidden focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        {/* Compact 3-column filter row on mobile */}
        <div className="grid grid-cols-3 sm:contents gap-1.5">
          {/* 2. Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-2.5 py-2 rounded-2xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400 transition truncate"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c, i) => (
              <option key={i} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          {/* 3. Time Range */}
          <select
            value={selectedTimeRange}
            onChange={(e) => { setSelectedTimeRange(e.target.value); setCurrentPage(1); }}
            className="w-full px-2.5 py-2 rounded-2xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400 transition truncate"
          >
            <option value="all">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="7days">7 Hari</option>
            <option value="thisMonth">Bulan Ini</option>
            <option value="custom">Pilih Tanggal...</option>
          </select>

          {/* 4. Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-2.5 py-2 rounded-2xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400 transition truncate"
          >
            <option value="date-desc">Terbaru</option>
            <option value="date-asc">Terlama</option>
            <option value="amount-desc">Terbesar</option>
            <option value="amount-asc">Terkecil</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {selectedTimeRange === 'custom' && (
        <div className="grid grid-cols-2 gap-2.5 p-3 mb-4 rounded-2xl bg-pink-50/60 dark:bg-pink-900/25 border border-pink-100 dark:border-pink-800">
          <div>
            <label className="block text-[10px] font-bold text-rose-700 dark:text-pink-300 mb-1">
              Dari Tanggal:
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => { setCustomStartDate(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-pink-950 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-rose-700 dark:text-pink-300 mb-1">
              Sampai Tanggal:
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => { setCustomEndDate(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-pink-950 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100"
            />
          </div>
        </div>
      )}

      {/* Transaction Items */}
      {paginatedList.length > 0 ? (
        <div className="space-y-2.5">
          {paginatedList.map((item) => {
            const isExpense = item.type === 'expense';
            return (
              <div
                key={item.id}
                className="p-3 sm:p-4 rounded-2xl bg-pink-50/35 dark:bg-pink-900/20 hover:bg-pink-50/80 dark:hover:bg-pink-900/40 border border-pink-100/80 dark:border-pink-900/40 transition flex items-center justify-between gap-2.5"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs ${
                    isExpense 
                      ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600' 
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600'
                  }`}>
                    {item.categoryIcon || (isExpense ? '💸' : '💚')}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-rose-950 dark:text-pink-100 truncate">
                        {item.category}
                      </span>
                      {item.paymentMethod && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-pink-900/70 text-rose-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 font-medium flex items-center gap-0.5">
                          <CreditCard size={9} /> {item.paymentMethod}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-pink-300/80 truncate mt-0.5">
                      {item.note || 'Tanpa catatan'}
                    </p>

                    <span className="text-[10px] text-gray-400 dark:text-pink-400/60 flex items-center gap-1 mt-0.5">
                      <Calendar size={10} /> {formatDateIndo(item.date)}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Touch-friendly Action Buttons */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <div className={`text-xs sm:text-sm font-extrabold flex items-center justify-end gap-0.5 ${
                      isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isExpense ? '- ' : '+ '}
                      {formatRupiah(item.amount)}
                    </div>
                  </div>

                  {/* Action Buttons (Always visible on iPhone/Mobile!) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTransaction(item)}
                      aria-label={`Edit transaksi ${item.category}`}
                      className="p-1.5 rounded-xl text-rose-600 dark:text-pink-300 bg-white/80 dark:bg-pink-900/50 hover:bg-pink-100 border border-pink-100 dark:border-pink-800 active:scale-90 transition"
                      title="Edit Transaksi"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(item.id)}
                      aria-label={`Hapus transaksi ${item.category}`}
                      className="p-1.5 rounded-xl text-red-500 bg-white/80 dark:bg-pink-900/50 hover:bg-red-50 border border-pink-100 dark:border-pink-800 active:scale-90 transition"
                      title="Hapus Transaksi"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : transactions.length === 0 ? (
        /* Clean Welcome Empty State for First-Time Users */
        <div className="py-10 px-4 text-center">
          <div className="text-4xl mb-2">🌸</div>
          <p className="text-sm sm:text-base font-bold text-rose-900 dark:text-pink-100">
            Dompetmu Masih Bersih & Kosong
          </p>
          <p className="text-xs text-rose-500/80 dark:text-pink-300/80 mt-1 mb-4 max-w-sm mx-auto">
            Yuk mulai catat pengeluaran atau pemasukan pertamamu hari ini, atau coba muat data simulasi contoh! 💕
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-sm hover:from-rose-600 hover:to-pink-600 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Catat Transaksi Pertama
              </button>
            )}
            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-4 py-2 rounded-2xl bg-pink-100 dark:bg-pink-900 text-rose-700 dark:text-pink-200 text-xs font-bold hover:bg-pink-200 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} /> Coba Data Contoh (Demo)
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-10 text-center">
          <div className="text-4xl mb-2">🌸</div>
          <p className="text-sm font-bold text-rose-900 dark:text-pink-100">
            Tidak ada transaksi yang cocok
          </p>
          <p className="text-xs text-rose-500/70 dark:text-pink-300/70 mt-1 mb-3">
            Coba ganti filter atau kata kunci pencarian kamu.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-900 text-rose-700 dark:text-pink-200 text-xs font-semibold hover:bg-pink-200 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-pink-100 dark:border-pink-900/50 pt-4 mt-4 text-xs text-rose-600 dark:text-pink-300">
          <span>
            Hal {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className="p-1.5 rounded-xl border border-pink-200 dark:border-pink-800 disabled:opacity-30 hover:bg-pink-100 active:scale-90 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
              className="p-1.5 rounded-xl border border-pink-200 dark:border-pink-800 disabled:opacity-30 hover:bg-pink-100 active:scale-90 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
