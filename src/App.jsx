import React, { useState, useEffect, useRef } from 'react';
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
import { parseLocalDate, formatRupiah } from './utils/helpers';
import { Heart, Smartphone, Monitor, QrCode, Wifi, Signal, Battery, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  // 1. LocalStorage States (Start clean with [] if no saved transactions yet)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('firda_transactions');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (_) {
      return [];
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

  // Dynamic LAN IP detection (uses current hostname if already on LAN, or saved/default IP)
  const [lanIp, setLanIp] = useState(() => {
    const host = window.location.hostname;
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) {
      return host;
    }
    return localStorage.getItem('firda_lan_ip') || '192.168.110.171';
  });

  useEffect(() => {
    localStorage.setItem('firda_lan_ip', lanIp);
  }, [lanIp]);

  // Detect if user is on desktop
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

  // 2. UI Navigation, Toast & Modal States
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'analytics'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [sideQrMode, setSideQrMode] = useState('github'); // 'github' | 'wifi'

  // Toast Notification with Undo support
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, undoItem = null) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, undoItem });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

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

  // Calculations for current month & overall cashflow using local timezone dates
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

    const txDate = parseLocalDate(t.date);
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      if (t.type === 'income') {
        monthlyIncome += val;
      } else {
        monthlyExpense += val;
      }
    }
  });

  // Only sum budgets belonging to active expenseCategories
  const totalMonthlyBudget = expenseCategories.reduce(
    (sum, c) => sum + (Number(budgets[c.name]) || 0),
    0
  );
  const remainingBudget = totalMonthlyBudget - monthlyExpense;

  // Handlers for transactions
  const handleSaveTransaction = (tx) => {
    const isEdit = transactions.some((item) => item.id === tx.id);
    setTransactions((prev) => {
      if (isEdit) {
        return prev.map((item) => (item.id === tx.id ? tx : item));
      }
      return [tx, ...prev];
    });
    showToast(
      isEdit
        ? `Catatan "${tx.category}" berhasil diperbarui ✨`
        : `${tx.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'} ${formatRupiah(tx.amount)} dicatat! 🌸`
    );
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    const target = transactions.find((item) => item.id === id);
    if (!target) return;
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    showToast(`Transaksi "${target.category}" dihapus`, target);
  };

  const handleUndoDelete = () => {
    if (!toast || !toast.undoItem) return;
    const restored = toast.undoItem;
    setTransactions((prev) => [restored, ...prev]);
    setToast(null);
    showToast('Transaksi berhasil dikembalikan! 💕');
  };

  // Category handlers (Add, Update, Delete with clean budget & transaction sync)
  const handleAddCategory = (type, newCat) => {
    if (type === 'expense') {
      setExpenseCategories((prev) => [...prev, newCat]);
    } else {
      setIncomeCategories((prev) => [...prev, newCat]);
    }
    showToast(`Kategori "${newCat.name}" ditambahkan! 🏷️`);
  };

  const handleUpdateCategory = (type, oldName, updatedFields) => {
    const setter = type === 'expense' ? setExpenseCategories : setIncomeCategories;
    setter((prev) =>
      prev.map((c) => (c.name === oldName ? { ...c, ...updatedFields } : c))
    );

    // Update transactions referencing oldName
    setTransactions((prev) =>
      prev.map((t) =>
        t.type === type && t.category === oldName
          ? { ...t, category: updatedFields.name, categoryIcon: updatedFields.icon }
          : t
      )
    );

    // Migrate budget key if expense category was renamed
    if (type === 'expense' && oldName !== updatedFields.name) {
      setBudgets((prev) => {
        const next = { ...prev };
        if (oldName in next) {
          next[updatedFields.name] = next[oldName];
          delete next[oldName];
        }
        return next;
      });
    }

    showToast(`Kategori "${updatedFields.name}" diperbarui! ✨`);
  };

  const handleDeleteCategory = (type, catName) => {
    if (window.confirm(`Hapus kategori "${catName}"?`)) {
      if (type === 'expense') {
        setExpenseCategories((prev) => prev.filter((c) => c.name !== catName));
        setBudgets((prev) => {
          const next = { ...prev };
          delete next[catName];
          return next;
        });
      } else {
        setIncomeCategories((prev) => prev.filter((c) => c.name !== catName));
      }
      showToast(`Kategori "${catName}" dihapus.`);
    }
  };

  // Backup & sample data handlers
  const handleRestoreData = (backup) => {
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.budgets) setBudgets(backup.budgets);
    if (backup.expenseCategories) setExpenseCategories(backup.expenseCategories);
    if (backup.incomeCategories) setIncomeCategories(backup.incomeCategories);
    showToast('Data cadangan berhasil dipulihkan! ✨');
  };

  const handleLoadSampleData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setBudgets(DEFAULT_BUDGETS);
    setExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
    setIncomeCategories(DEFAULT_INCOME_CATEGORIES);
    showToast('Data simulasi contoh berhasil dimuat! 🌸');
  };

  const handleClearAllData = () => {
    setTransactions([]);
    showToast('Seluruh riwayat transaksi telah dikosongkan.');
  };

  const allCategories = [...expenseCategories, ...incomeCategories];
  const githubPagesUrl = 'https://doaibuu007.github.io/firda-money-planner/';
  const wifiUrl = `http://${lanIp}:${window.location.port || '5173'}`;
  const mobileUrl = sideQrMode === 'github' ? githubPagesUrl : wifiUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=be185d&bgcolor=fdf2f8&margin=8&data=${encodeURIComponent(mobileUrl)}`;

  // Main App Content (shared between direct mobile/desktop view and iPhone simulator frame)
  const renderAppContent = (inFrame = false) => (
    <div className={`min-h-full flex flex-col bg-pink-50/40 dark:bg-[#1a0f18] text-rose-950 dark:text-pink-100 transition-colors duration-300 ${inFrame ? 'pb-20' : 'pb-24 md:pb-0'}`}>
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
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
              onLoadSampleData={handleLoadSampleData}
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
          inFrame={false}
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

                {/* Shared BottomNav Component inside iPhone Frame */}
                <BottomNav
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  onOpenAddModal={() => {
                    setEditingTransaction(null);
                    setIsAddModalOpen(true);
                  }}
                  onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                  onOpenBackupModal={() => setIsBackupModalOpen(true)}
                  inFrame={true}
                />

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

                {sideQrMode === 'wifi' && (
                  <div className="flex items-center gap-1.5 mb-2.5 w-full">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-pink-300 shrink-0">IP:</span>
                    <input
                      type="text"
                      value={lanIp}
                      onChange={(e) => setLanIp(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-pink-950 border border-pink-200 dark:border-pink-800 text-[11px] font-bold text-rose-900 dark:text-pink-100"
                    />
                  </div>
                )}

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
                    Buka <strong>Kamera iPhone</strong> & arahkan ke QR Code di atas (atau buka link di Safari).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-[11px] leading-snug">
                    Di Safari iPhone, ketuk <strong>Share</strong> lalu pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong> agar terpasang penuh lengkap dengan ikon PNG & dukungan <em>offline</em>!
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

      {/* Non-blocking Toast Notification with Undo */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-rose-950/95 dark:bg-pink-900/95 text-white text-xs font-bold shadow-xl border border-pink-500/30 backdrop-blur-md animate-in fade-in duration-200">
          <Sparkles size={14} className="text-pink-400 shrink-0" />
          <span>{toast.message}</span>
          {toast.undoItem && (
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-[11px] font-extrabold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw size={12} /> Urungkan
            </button>
          )}
        </div>
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
        onSaveBudgets={(newBudgets) => {
          setBudgets(newBudgets);
          showToast('Target budget bulanan berhasil disimpan! 🎯');
        }}
        expenseCategories={expenseCategories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
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
        lanIp={lanIp}
        setLanIp={setLanIp}
      />
    </>
  );
}
