import React, { useState } from 'react';
import { X, Smartphone, QrCode, Share, PlusSquare, Check, Copy, Sparkles, Monitor, Globe } from 'lucide-react';

export default function IosGuideModal({
  isOpen,
  onClose,
  isIphonePreview,
  setIsIphonePreview,
  lanIp,
  setLanIp
}) {
  const [copied, setCopied] = useState(false);
  const [qrMode, setQrMode] = useState('github'); // 'github' | 'wifi'

  if (!isOpen) return null;

  const githubPagesUrl = 'https://doaibuu007.github.io/firda-money-planner/';
  const port = window.location.port || '5173';
  const wifiUrl = `http://${lanIp}:${port}`;

  const activeUrl = qrMode === 'github' ? githubPagesUrl : wifiUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=be185d&bgcolor=fdf2f8&margin=10&data=${encodeURIComponent(activeUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-pink-950 p-5 sm:p-6 shadow-2xl border-t sm:border border-pink-100 dark:border-pink-900/80 max-h-[92vh] overflow-y-auto pb-safe">
        
        {/* iOS Sheet Grabber Handle (Mobile) */}
        <div className="w-12 h-1.5 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/50 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-sm">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-pink-100">
                Buka & Pasang di iPhone 🌸
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-pink-300">
                Akses via Link Online GitHub Pages atau Wi-Fi Lokal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup panduan iPhone"
            className="p-2 rounded-full text-gray-400 hover:text-rose-500 bg-pink-50 dark:bg-pink-900/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggle Mode Preview Layar iPhone di Laptop */}
        <div className="p-4 mb-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white shadow-md shadow-pink-200/50 dark:shadow-none flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-pink-100 flex items-center gap-1">
              <Sparkles size={11} /> Mode Tampilan Layar
            </span>
            <h4 className="text-sm font-extrabold mt-0.5">
              {isIphonePreview ? 'Mode Simulator iPhone Aktif 📱' : 'Lihat Tampilan Ukuran iPhone di Sini'}
            </h4>
            <p className="text-[11px] text-pink-100/90 mt-0.5">
              Ubah tampilan layar ini menjadi bingkai iPhone 16 Pro Pink lengkap dengan Dynamic Island!
            </p>
          </div>
          <button
            onClick={() => {
              setIsIphonePreview(!isIphonePreview);
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-white text-rose-600 font-extrabold text-xs shrink-0 shadow-sm hover:bg-pink-50 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          >
            {isIphonePreview ? (
              <>
                <Monitor size={14} /> Layar Penuh
              </>
            ) : (
              <>
                <Smartphone size={14} /> Mode iPhone
              </>
            )}
          </button>
        </div>

        {/* QR Code Section for Real iPhone */}
        <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/70 flex flex-col items-center text-center mb-4">
          
          {/* Switcher: GitHub Pages Online vs Local Wi-Fi */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white dark:bg-pink-900/50 border border-pink-200 dark:border-pink-800 w-full max-w-xs mb-3">
            <button
              type="button"
              onClick={() => setQrMode('github')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                qrMode === 'github'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-700 dark:text-pink-300'
              }`}
            >
              <Globe size={12} /> Link Online GitHub
            </button>
            <button
              type="button"
              onClick={() => setQrMode('wifi')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                qrMode === 'wifi'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-700 dark:text-pink-300'
              }`}
            >
              <QrCode size={12} /> Wi-Fi Lokal
            </button>
          </div>

          {qrMode === 'wifi' && setLanIp && (
            <div className="flex items-center gap-2 mb-2.5 w-full max-w-xs">
              <span className="text-[11px] font-bold text-rose-700 dark:text-pink-300 shrink-0">IP Laptop:</span>
              <input
                type="text"
                value={lanIp}
                onChange={(e) => setLanIp(e.target.value)}
                placeholder="192.168.x.x"
                className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-pink-950 border border-pink-200 dark:border-pink-800 text-xs font-bold text-rose-900 dark:text-pink-100"
              />
            </div>
          )}

          <span className="text-xs font-bold text-rose-900 dark:text-pink-100 mb-1 flex items-center gap-1.5">
            <QrCode size={15} className="text-pink-500" /> Scan dengan Kamera iPhone Kamu
          </span>
          <p className="text-[11px] text-rose-600/80 dark:text-pink-300/80 mb-3 max-w-xs">
            {qrMode === 'github'
              ? 'Bisa dibuka dari mana saja (Kuota Data / Wi-Fi apa saja) melalui GitHub Pages:'
              : 'Pastikan iPhone terhubung ke Wi-Fi yang sama dengan laptop ini:'}
          </p>

          <div className="p-3 bg-white rounded-3xl shadow-md border-2 border-pink-200 mb-3">
            <img
              src={qrImageUrl}
              alt="QR Code Akses iPhone"
              className="w-40 h-40 rounded-xl"
            />
          </div>

          {/* Link Copy */}
          <div className="flex items-center gap-2 w-full max-w-sm bg-white dark:bg-pink-900/60 px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-800">
            <span className="text-xs font-bold text-rose-700 dark:text-pink-200 truncate grow text-left">
              {activeUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-pink-100 dark:bg-pink-800 text-rose-700 dark:text-pink-200 text-[11px] font-bold flex items-center gap-1 hover:bg-pink-200 transition shrink-0 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Step by step Add to Home Screen iOS */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-rose-900 dark:text-pink-200 flex items-center gap-1.5">
            <span>🍎</span> Cara Pasang Jadi Aplikasi di Home Screen iPhone:
          </h4>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-pink-50/40 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <p className="text-rose-950 dark:text-pink-100 text-[11px] sm:text-xs">
                Buka tautan di atas menggunakan aplikasi <strong>Safari</strong> di iPhone.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/40 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <p className="text-rose-950 dark:text-pink-100 text-[11px] sm:text-xs flex items-center gap-1 flex-wrap">
                Ketuk tombol <strong>Bagikan (Share)</strong> <Share size={13} className="inline text-blue-500" /> di bagian bawah layar Safari.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/40 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <p className="text-rose-950 dark:text-pink-100 text-[11px] sm:text-xs flex items-center gap-1 flex-wrap">
                Pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong> <PlusSquare size={13} className="inline text-rose-500" /> lalu ketuk <strong>Tambah</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
