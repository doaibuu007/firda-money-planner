import React from 'react';
import { 
  Sparkles, 
  Plus, 
  PieChart, 
  SlidersHorizontal, 
  Database, 
  Sun, 
  Moon, 
  Heart,
  Calendar,
  Smartphone
} from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  onOpenBudgetModal, 
  onOpenCategoryModal, 
  onOpenBackupModal,
  onOpenIosModal,
  isDarkMode, 
  setIsDarkMode,
  currentTab,
  setCurrentTab,
  isIphonePreview = false
}) {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 transition-colors backdrop-blur-xl bg-white/85 dark:bg-pink-950/85 border-b border-pink-100 dark:border-pink-900/60 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-300 flex items-center justify-center shadow-md shadow-pink-200 dark:shadow-none text-xl sm:text-2xl shrink-0">
              🌸
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-pink-500 bg-clip-text text-transparent truncate">
                  Firda Planner
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/80 text-pink-700 dark:text-pink-300 font-bold border border-pink-200 dark:border-pink-800 flex items-center gap-1 shrink-0">
                  <Heart size={9} className="fill-pink-500 text-pink-500 animate-pulse" /> iOS
                </span>
              </div>
              <p className="text-[11px] text-rose-500/80 dark:text-pink-300/70 font-medium flex items-center gap-1 truncate">
                <Calendar size={11} /> {todayFormatted}
              </p>
            </div>
          </div>

          {/* Mobile / iPhone Quick Top Actions */}
          <div className={`${isIphonePreview ? 'flex' : 'flex md:hidden'} items-center gap-1.5 shrink-0`}>
            <button
              onClick={onOpenCategoryModal}
              className="p-2 rounded-xl text-rose-600 dark:text-pink-200 bg-pink-50 dark:bg-pink-900/40 border border-pink-200/70 dark:border-pink-800 active:scale-90 transition text-xs font-bold flex items-center gap-1"
              title="Kategori"
            >
              <span>🏷️</span>
            </button>
            <button
              onClick={onOpenIosModal}
              className="p-2 rounded-xl text-rose-600 dark:text-pink-200 bg-pink-50 dark:bg-pink-900/40 border border-pink-200/70 dark:border-pink-800 active:scale-90 transition"
              title="Akses iPhone / QR"
            >
              <Smartphone size={17} />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-rose-600 dark:text-pink-200 bg-pink-50 dark:bg-pink-900/40 border border-pink-200/70 dark:border-pink-800 active:scale-90 transition"
              title="Mode Terang / Gelap"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          {/* Desktop Navigation Tabs & Actions */}
          {!isIphonePreview && (
            <div className="hidden md:flex items-center justify-end gap-2">
              {/* View Switcher */}
              <div className="bg-pink-100/70 dark:bg-pink-900/50 p-1 rounded-2xl flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-white dark:bg-pink-800 text-rose-600 dark:text-pink-100 shadow-xs'
                      : 'text-rose-700/70 dark:text-pink-300 hover:text-rose-900'
                  }`}
                >
                  <Sparkles size={14} /> Ringkasan
                </button>
                <button
                  onClick={() => setCurrentTab('analytics')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'analytics'
                      ? 'bg-white dark:bg-pink-800 text-rose-600 dark:text-pink-100 shadow-xs'
                      : 'text-rose-700/70 dark:text-pink-300 hover:text-rose-900'
                  }`}
                >
                  <PieChart size={14} /> Grafik & Statistik
                </button>
              </div>

              {/* Extra Tools */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenIosModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Buka di iPhone atau Mode Simulator iPhone"
                >
                  <Smartphone size={14} />
                  <span>Mode iPhone / QR</span>
                </button>

                <button
                  onClick={onOpenBudgetModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-pink-200 bg-rose-50 dark:bg-pink-900/40 hover:bg-rose-100 border border-pink-200 dark:border-pink-800 transition flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal size={14} />
                  <span>Budget</span>
                </button>

                <button
                  onClick={onOpenCategoryModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-pink-200 bg-rose-50 dark:bg-pink-900/40 hover:bg-rose-100 border border-pink-200 dark:border-pink-800 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>🏷️</span>
                  <span>Kategori</span>
                </button>

                <button
                  onClick={onOpenBackupModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-pink-200 bg-rose-50 dark:bg-pink-900/40 hover:bg-rose-100 border border-pink-200 dark:border-pink-800 transition flex items-center gap-1 cursor-pointer"
                >
                  <Database size={14} />
                  <span>Data</span>
                </button>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-xl text-rose-600 dark:text-pink-200 bg-rose-50 dark:bg-pink-900/40 hover:bg-rose-100 border border-pink-200 dark:border-pink-800 transition flex items-center cursor-pointer"
                >
                  {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                <button
                  onClick={onOpenAddModal}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-300/50 dark:shadow-none transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={16} className="stroke-[3]" />
                  <span>Catat Transaksi</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
