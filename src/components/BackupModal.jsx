import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Trash2, FileSpreadsheet, FileJson, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { exportToCSV, exportToJSON, validateBackupPayload } from '../utils/helpers';

export default function BackupModal({ 
  isOpen, 
  onClose, 
  transactions, 
  budgets, 
  expenseCategories,
  incomeCategories,
  onRestoreData,
  onLoadSampleData,
  onClearAllData,
  onOpenIosModal
}) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState({ message: '', isError: false });

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    exportToCSV(transactions);
  };

  const handleDownloadJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      transactions,
      budgets,
      expenseCategories,
      incomeCategories
    };
    exportToJSON(backupData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (validateBackupPayload(parsed)) {
          onRestoreData(parsed);
          setImportStatus({ message: 'Data berhasil di-restore! ✨', isError: false });
          setTimeout(() => {
            setImportStatus({ message: '', isError: false });
            onClose();
          }, 1200);
        } else {
          setImportStatus({ message: 'Format file backup tidak lengkap atau tidak valid.', isError: true });
        }
      } catch (err) {
        setImportStatus({ message: 'Gagal membaca file JSON.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-pink-950 p-5 sm:p-6 shadow-2xl border-t sm:border border-pink-100 dark:border-pink-900/80 max-h-[92vh] overflow-y-auto pb-safe">
        
        {/* iOS Sheet Grabber */}
        <div className="w-12 h-1.5 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-pink-100">
                Menu Data & Akses iPhone
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-pink-300">
                Backup data atau buka aplikasi di iPhone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup menu data"
            className="p-2 rounded-full text-gray-400 hover:text-rose-500 bg-pink-50 dark:bg-pink-900/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {importStatus.message && (
          <div className={`p-3 mb-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            importStatus.isError
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
          }`}>
            {importStatus.isError ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="space-y-3">
          
          {/* 0. Shortcut Akses iPhone & QR */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-pink-900/40 dark:to-rose-900/30 border border-pink-200 dark:border-pink-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <Smartphone size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-rose-950 dark:text-pink-100">Buka di iPhone & QR Code</h4>
                <p className="text-[11px] text-rose-600/80 dark:text-pink-300/70 truncate">Scan QR atau pasang ke Home Screen iPhone</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenIosModal) onOpenIosModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 active:scale-95 transition shrink-0 cursor-pointer"
            >
              Buka QR
            </button>
          </div>

          {/* 1. Ekspor CSV (Excel) */}
          <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-rose-950 dark:text-pink-100">Ekspor ke Excel / CSV</h4>
                <p className="text-[11px] text-gray-500 dark:text-pink-300/70 truncate">Buka di Microsoft Excel / Sheets</p>
              </div>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-pink-900 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-50 active:scale-95 transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Download size={13} /> CSV
            </button>
          </div>

          {/* 2. Backup File JSON */}
          <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                <FileJson size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-rose-950 dark:text-pink-100">Backup Seluruh Data (JSON)</h4>
                <p className="text-[11px] text-gray-500 dark:text-pink-300/70 truncate">Simpan transaksi, budget & kategori</p>
              </div>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-pink-900 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-50 active:scale-95 transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Download size={13} /> JSON
            </button>
          </div>

          {/* 3. Impor File JSON */}
          <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center shrink-0">
                <Upload size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-rose-950 dark:text-pink-100">Restore dari Backup JSON</h4>
                <p className="text-[11px] text-gray-500 dark:text-pink-300/70 truncate">Muat kembali data cadangan</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-pink-900 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-50 active:scale-95 transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Upload size={13} /> Pilih
            </button>
          </div>

          {/* 4. Contoh Data Sample */}
          <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 flex items-center justify-center shrink-0">
                <RefreshCw size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-rose-950 dark:text-pink-100">Isi Data Contoh (Demo)</h4>
                <p className="text-[11px] text-gray-500 dark:text-pink-300/70 truncate">Coba tampilan dengan data simulasi</p>
              </div>
            </div>
            <button
              onClick={() => {
                onLoadSampleData();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-pink-900 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-bold hover:bg-pink-50 active:scale-95 transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              🌸 Demo
            </button>
          </div>

          {/* 5. Danger Zone: Reset Data */}
          <div className="pt-3 border-t border-pink-100 dark:border-pink-900/50 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Hapus semua transaksi tersimpan</span>
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus seluruh data transaksi?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} /> Hapus Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
