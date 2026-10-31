import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import BudgetOverview from './components/BudgetOverview';
import TransactionList from './components/TransactionList';
import AnalyticsView from './components/AnalyticsView';
import TransactionModal from './components/TransactionModal';
import BudgetModal from './components/BudgetModal';
import CategoryModal from './components/CategoryModal';
import BackupModal from './components/BackupModal';
import BottomNav from './components/BottomNav';
import IosGuideModal from './components/IosGuideModal';

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  PAYMENT_METHODS,
  SAMPLE_TRANSACTIONS,
  DEFAULT_BUDGETS
} from './constants';
import { Heart, Smartphone, Monitor, QrCode, Wifi, Sparkles, Signal, Battery } from 'lucide-react';

export default function App() {
  // 1. LocalStorage States
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_transactions');
      if (saved) return JSON.parse(saved);
      return SAMPLE_TRANSACTIONS;
    } catch (_) {
      return SAMPLE_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_budgets');
      if (saved) return JSON.parse(saved);
      return DEFAULT_BUDGETS;
    } catch (_) {
      return DEFAULT_BUDGETS;
    }
  });

  const [expenseCategories, setExpenseCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_exp_cats');
      if (saved) return JSON.parse(saved);
      return DEFAULT_EXPENSE_CATEGORIES;
    } catch (_) {
      return DEFAULT_EXPENSE_CATEGORIES;
    }
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_inc_cats');
      if (saved) return JSON.parse(saved);
      return DEFAULT_INCOME_CATEGORIES;
    } catch (_) {
      return DEFAULT_INCOME_CATEGORIES;
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_theme');
      return saved === 'dark';
    } catch (_) {
      return false;
    }
  });

  // Detect if user is on desktop and default to iPhone Preview Mode so they can see the iPhone UI & QR code immediately
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 900);
  const [isIphonePreview, setIsIphonePreview] = useState(() => window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      const desktopNow = window.innerWidth >= 900;
      setIsDesktop(desktopNow);
      if (!desktopNow) {
        setIsIphonePreview(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. UI Navigation & Modal States
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'analytics'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [sideQrMode, setSideQrMode] = useState('github'); // 'github' | 'wifi'

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('firda_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('firda_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('firda_exp_cats', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem('firda_inc_cats', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  useEffect(() => {
    localStorage.setItem('firda_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Calculations for current month & overall cashflow
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalBalance = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  transactions.forEach((t) => {
    const val = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalBalance += val;
    } else {
      totalBalance -= val;
    }

    const txDate = new Date(t.date);
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      if (t.type === 'income') {
        monthlyIncome += val;
      } else {
        monthlyExpense += val;
      }
    }
  });

  const totalMonthlyBudget = Object.values(budgets).reduce((sum, b) => sum + (Number(b) || 0), 0);
  const remainingBudget = totalMonthlyBudget - monthlyExpense;

  // Handlers for transactions
  const handleSaveTransaction = (tx) => {
    setTransactions((prev) => {
      const exists = prev.some((item) => item.id === tx.id);
      if (exists) {
        return prev.map((item) => (item.id === tx.id ? tx : item));
      }
      return [tx, ...prev];
    });
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Hapus transaksi ini ya Firda?')) {
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Category handlers
  const handleAddCategory = (type, newCat) => {
    if (type === 'expense') {
      setExpenseCategories((prev) => [...prev, newCat]);
    } else {
      setIncomeCategories((prev) => [...prev, newCat]);
    }
  };

  const handleDeleteCategory = (type, catName) => {
    if (window.confirm(`Hapus kategori "${catName}"?`)) {
      if (type === 'expense') {
        setExpenseCategories((prev) => prev.filter((c) => c.name !== catName));
      } else {
        setIncomeCategories((prev) => prev.filter((c) => c.name !== catName));
      }
    }
  };

  // Backup & sample data handlers
  const handleRestoreData = (backup) => {
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.budgets) setBudgets(backup.budgets);
    if (backup.expenseCategories) setExpenseCategories(backup.expenseCategories);
    if (backup.incomeCategories) setIncomeCategories(backup.incomeCategories);
  };

  const handleLoadSampleData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setBudgets(DEFAULT_BUDGETS);
    setExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
    setIncomeCategories(DEFAULT_INCOME_CATEGORIES);
  };

  const handleClearAllData = () => {
    setTransactions([]);
  };

  const allCategories = [...expenseCategories, ...incomeCategories];
  const githubPagesUrl = 'https://doaibuu007.github.io/firda-money-planner/';
  const wifiUrl = `http://192.168.110.171:${window.location.port || '5173'}`;
  const mobileUrl = sideQrMode === 'github' ? githubPagesUrl : wifiUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=be185d&bgcolor=fdf2f8&margin=8&data=${encodeURIComponent(mobileUrl)}`;

  // Main App Content (shared between direct mobile/desktop view and iPhone simulator frame)
  const renderAppContent = (inFrame = false) => (
    <div className={`min-h-full flex flex-col bg-pink-50/40 dark:bg-[#1a0f18] text-rose-950 dark:text-pink-100 transition-colors duration-300 ${inFrame ? 'pb-24' : 'pb-24 md:pb-0'}`}>
      <Navbar
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenIosModal={() => setIsIosModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isIphonePreview={inFrame}
      />

      <main className={`grow mx-auto w-full ${inFrame ? 'px-3.5 py-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6'}`}>
        <SummaryCards
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          totalMonthlyBudget={totalMonthlyBudget}
          remainingBudget={remainingBudget}
          isIphonePreview={inFrame}
        />

        {currentTab === 'dashboard' && (
          <div className="space-y-5">
            <BudgetOverview
              budgets={budgets}
              transactions={transactions}
              expenseCategories={expenseCategories}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              isIphonePreview={inFrame}
            />

            <TransactionList
              transactions={transactions}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              categories={allCategories}
            />
          </div>
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            expenseCategories={expenseCategories}
          />
        )}
      </main>

      {!inFrame && (
        <footer className="hidden md:block py-6 border-t border-pink-100 dark:border-pink-900/60 bg-white/60 dark:bg-pink-950/40 backdrop-blur-xs text-center text-xs text-rose-500/80 dark:text-pink-300/70">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            Dibuat dengan cinta untuk Firda <Heart size={14} className="fill-pink-500 text-pink-500 inline" /> Pencatat Keuangan Cantik & Rapi
          </p>
        </footer>
      )}

      {/* iOS Bottom Tab Bar (for actual mobile devices when not in desktop frame) */}
      {!inFrame && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          forceMobileView={false}
        />
      )}
    </div>
  );

  return (
    <>
      {isDesktop && isIphonePreview ? (
        /* DESKTOP IPHONE 16 PRO SIMULATOR + REAL IPHONE QR CODE PANEL */
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 dark:from-[#160a14] dark:via-[#22101f] dark:to-[#120710] flex flex-col items-center justify-center p-4 lg:p-8 gap-6">
          
          {/* Top Mode Switcher Pill */}
          <div className="flex items-center gap-2 bg-white/90 dark:bg-pink-950/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-pink-200 dark:border-pink-800">
            <span className="text-xs font-bold text-rose-800 dark:text-pink-200 mr-1 flex items-center gap-1.5">
              🌸 Mode Tampilan:
            </span>
            <button
              onClick={() => setIsIphonePreview(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone size={14} /> Layar iPhone 16 Pro
            </button>
            <button
              onClick={() => setIsIphonePreview(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/60 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Monitor size={14} /> Layar Penuh Laptop
            </button>
          </div>

          {/* Main Workspace: iPhone Frame + Side QR Card */}
          <div className="flex flex-col xl:flex-row items-center justify-center gap-8 max-w-6xl w-full">
            
            {/* 1. iPhone 16 Pro Pink Titanium Frame */}
            <div className="relative w-[393px] h-[820px] rounded-[58px] bg-gradient-to-b from-pink-300 via-rose-300 to-pink-400 dark:from-pink-900 dark:to-rose-950 p-[11px] shadow-[0_25px_70px_rgba(244,63,94,0.28)] border-4 border-pink-200/80 dark:border-pink-800/60 shrink-0">
              
              {/* Inner Bezel */}
              <div className="relative w-full h-full rounded-[48px] bg-white dark:bg-[#1a0f18] overflow-hidden flex flex-col border-[3px] border-rose-950/90">
                
                {/* iOS Status Bar + Dynamic Island */}
                <div className="shrink-0 h-11 bg-white/90 dark:bg-pink-950/90 px-7 flex items-center justify-between text-[12px] font-bold text-rose-950 dark:text-pink-100 z-40 select-none">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-28 h-6 bg-black rounded-full flex items-center justify-end px-2.5 gap-1.5 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-800/60" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={14} />
                  </div>
                </div>

                {/* Scrollable iPhone Screen Viewport */}
                <div className="grow overflow-y-auto overflow-x-hidden relative no-scrollbar">
                  {renderAppContent(true)}
                </div>

                {/* Fixed iOS Bottom Tab Bar inside iPhone Frame */}
                <div className="shrink-0 relative z-40 bg-white/95 dark:bg-[#221220]/95 backdrop-blur-xl border-t border-pink-100 dark:border-pink-900/60 pt-1.5 pb-4 px-2">
                  <div className="grid grid-cols-5 items-center">
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className={`flex flex-col items-center justify-center py-1 rounded-2xl transition active:scale-90 cursor-pointer ${
                        currentTab === 'dashboard'
                          ? 'text-rose-600 dark:text-pink-300 font-bold'
                          : 'text-rose-400/70 dark:text-pink-400/50 font-medium'
                      }`}
                    >
                      <span className="text-base">🏠</span>
                      <span className="text-[10px] mt-0.5">Beranda</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('analytics')}
                      className={`flex flex-col items-center justify-center py-1 rounded-2xl transition active:scale-90 cursor-pointer ${
                        currentTab === 'analytics'
                          ? 'text-rose-600 dark:text-pink-300 font-bold'
                          : 'text-rose-400/70 dark:text-pink-400/50 font-medium'
                      }`}
                    >
                      <span className="text-base">📊</span>
                      <span className="text-[10px] mt-0.5">Statistik</span>
                    </button>

                    <div className="flex flex-col items-center justify-center -mt-6">
                      <button
                        onClick={() => {
                          setEditingTransaction(null);
                          setIsAddModalOpen(true);
                        }}
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white shadow-lg shadow-pink-400/50 border-4 border-white dark:border-[#1a0f18] flex items-center justify-center text-xl font-bold active:scale-90 transition-transform cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-pink-300 mt-0.5">
                        Catat
                      </span>
                    </div>

                    <button
                      onClick={() => setIsBudgetModalOpen(true)}
                      className="flex flex-col items-center justify-center py-1 rounded-2xl text-rose-400/70 dark:text-pink-400/50 hover:text-rose-600 font-medium transition active:scale-90 cursor-pointer"
                    >
                      <span className="text-base">🎯</span>
                      <span className="text-[10px] mt-0.5">Budget</span>
                    </button>

                    <button
                      onClick={() => setIsBackupModalOpen(true)}
                      className="flex flex-col items-center justify-center py-1 rounded-2xl text-rose-400/70 dark:text-pink-400/50 hover:text-rose-600 font-medium transition active:scale-90 cursor-pointer"
                    >
                      <span className="text-base">💾</span>
                      <span className="text-[10px] mt-0.5">Data</span>
                    </button>
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="w-32 h-1 bg-rose-950/25 dark:bg-pink-200/30 rounded-full mx-auto mt-2" />
                </div>

              </div>
            </div>

            {/* 2. Companion Card: Scan QR to Open on Real iPhone */}
            <div className="w-full max-w-sm rounded-3xl bg-white/90 dark:bg-pink-950/80 backdrop-blur-md p-6 shadow-xl border border-pink-200 dark:border-pink-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md shrink-0">
                  <QrCode size={22} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-pink-500 block">
                    Siap Dipakai di HP
                  </span>
                  <h3 className="text-base font-extrabold text-rose-950 dark:text-pink-100">
                    Buka di iPhone Asli Kamu 🌸
                  </h3>
                </div>
              </div>

              <p className="text-xs text-rose-700/80 dark:text-pink-200/80 leading-relaxed">
                Selain mencoba simulasi layar iPhone di sebelah kiri, kamu juga bisa membuka aplikasi ini langsung di <strong>iPhone fisik</strong> kamu:
              </p>

              {/* QR Code Box */}
              <div className="p-4 rounded-2xl bg-pink-50/80 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 flex flex-col items-center text-center">
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white dark:bg-pink-950 border border-pink-200 dark:border-pink-800 w-full mb-3">
                  <button
                    onClick={() => setSideQrMode('github')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                      sideQrMode === 'github' ? 'bg-rose-500 text-white' : 'text-rose-700 dark:text-pink-300'
                    }`}
                  >
                    🌐 Link Online GitHub
                  </button>
                  <button
                    onClick={() => setSideQrMode('wifi')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                      sideQrMode === 'wifi' ? 'bg-rose-500 text-white' : 'text-rose-700 dark:text-pink-300'
                    }`}
                  >
                    📶 Wi-Fi Lokal
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-pink-100 mb-2.5">
                  <img
                    src={qrImageUrl}
                    alt="Scan QR iPhone"
                    className="w-36 h-36 rounded-lg"
                  />
                </div>
                <span className="text-[11px] font-bold text-rose-900 dark:text-pink-100">
                  Scan dengan Kamera iPhone
                </span>
                <a
                  href={mobileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 px-3 py-1 rounded-lg bg-white dark:bg-pink-950 text-rose-600 dark:text-pink-300 text-[11px] font-extrabold border border-pink-200 dark:border-pink-800 hover:underline break-all"
                >
                  {mobileUrl}
                </a>
              </div>

              {/* Quick Steps */}
              <div className="space-y-2 text-xs text-rose-900 dark:text-pink-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-[11px] leading-snug">
                    Pastikan iPhone terhubung ke <strong>Wi-Fi yang sama</strong> dengan komputer ini.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-[11px] leading-snug">
                    Buka <strong>Kamera iPhone</strong> & arahkan ke QR Code di atas (atau ketik <strong>{mobileUrl}</strong> di Safari).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-[11px] leading-snug">
                    Di Safari iPhone, ketuk <strong>Share</strong> lalu pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong> agar terpasang penuh seperti aplikasi iOS asli!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* NATIVE FULL SCREEN VIEW (For Real iPhone or Full-Screen Desktop) */
        renderAppContent(false)
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        paymentMethods={PAYMENT_METHODS}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSaveBudgets={setBudgets}
        expenseCategories={expenseCategories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        transactions={transactions}
        budgets={budgets}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onRestoreData={handleRestoreData}
        onLoadSampleData={handleLoadSampleData}
        onClearAllData={handleClearAllData}
        onOpenIosModal={() => setIsIosModalOpen(true)}
      />

      <IosGuideModal
        isOpen={isIosModalOpen}
        onClose={() => setIsIosModalOpen(false)}
        isIphonePreview={isIphonePreview}
        setIsIphonePreview={setIsIphonePreview}
      />
    </>
  );
}
