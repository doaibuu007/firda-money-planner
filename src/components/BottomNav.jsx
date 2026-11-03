import React from 'react';
import { Home, PieChart, Plus, SlidersHorizontal, Smartphone } from 'lucide-react';

export default function BottomNav({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenBackupModal,
  inFrame = false
}) {
  return (
    <nav
      className={`${
        inFrame
          ? 'shrink-0 relative z-40 bg-white/95 dark:bg-[#221220]/95 backdrop-blur-xl border-t border-pink-100 dark:border-pink-900/60 pt-1.5 pb-3 px-2'
          : 'md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#221220]/95 backdrop-blur-xl border-t border-pink-100 dark:border-pink-900/60 pb-safe shadow-[0_-4px_20px_rgba(244,114,182,0.12)]'
      }`}
    >
      <div className={`grid grid-cols-5 items-center ${inFrame ? '' : 'max-w-md mx-auto px-2 pt-1.5 pb-2'}`}>
        {/* 1. Beranda */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition active:scale-90 cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-rose-600 dark:text-pink-300 font-bold'
              : 'text-rose-400/70 dark:text-pink-400/50 font-medium'
          }`}
        >
          <Home size={20} className={currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        {/* 2. Statistik */}
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition active:scale-90 cursor-pointer ${
            currentTab === 'analytics'
              ? 'text-rose-600 dark:text-pink-300 font-bold'
              : 'text-rose-400/70 dark:text-pink-400/50 font-medium'
          }`}
        >
          <PieChart size={20} className={currentTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Statistik</span>
        </button>

        {/* 3. Center Floating "+ Catat" Button */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            onClick={onOpenAddModal}
            aria-label="Catat transaksi baru"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white shadow-lg shadow-pink-400/50 dark:shadow-pink-950/60 border-4 border-white dark:border-[#1a0f18] flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            title="Catat Transaksi"
          >
            <Plus size={22} className="stroke-[3]" />
          </button>
          <span className="text-[10px] font-bold text-rose-600 dark:text-pink-300 mt-0.5">
            Catat
          </span>
        </div>

        {/* 4. Budget */}
        <button
          onClick={onOpenBudgetModal}
          className="flex flex-col items-center justify-center py-1 rounded-2xl text-rose-400/70 dark:text-pink-400/50 hover:text-rose-600 dark:hover:text-pink-300 font-medium transition active:scale-90 cursor-pointer"
        >
          <SlidersHorizontal size={20} className="stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">Budget</span>
        </button>

        {/* 5. Menu & Data */}
        <button
          onClick={onOpenBackupModal}
          className="flex flex-col items-center justify-center py-1 rounded-2xl text-rose-400/70 dark:text-pink-400/50 hover:text-rose-600 dark:hover:text-pink-300 font-medium transition active:scale-90 cursor-pointer"
        >
          <Smartphone size={20} className="stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">Menu & HP</span>
        </button>
      </div>

      {/* iOS Home Indicator Bar when rendered inside simulator frame */}
      {inFrame && (
        <div className="w-32 h-1 bg-rose-950/25 dark:bg-pink-200/30 rounded-full mx-auto mt-2" />
      )}
    </nav>
  );
}
