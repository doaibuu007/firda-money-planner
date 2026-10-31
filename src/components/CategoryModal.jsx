import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const PRESET_EMOJIS = ['🌸', '💅', '🎀', '🛍️', '🧁', '🥤', '🐱', '📚', '🎨', '✈️', '💊', '🪴', '🍿', '🎧', '💍', '🚗'];
const PRESET_COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#fb7185'];

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  expenseCategories, 
  incomeCategories,
  onAddCategory,
  onDeleteCategory 
}) {
  const [activeTab, setActiveTab] = useState('expense');
  const [newName, setNewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');
  const [selectedColor, setSelectedColor] = useState('#ec4899');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentList = activeTab === 'expense' ? expenseCategories : incomeCategories;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Nama kategori tidak boleh kosong ya! ✨');
      return;
    }

    if (currentList.some(c => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      setError('Kategori dengan nama ini sudah ada.');
      return;
    }

    const newCat = {
      id: 'cat_custom_' + Date.now(),
      name: newName.trim(),
      icon: selectedEmoji,
      color: selectedColor
    };

    onAddCategory(activeTab, newCat);
    setNewName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-pink-950 p-5 sm:p-6 shadow-2xl border-t sm:border border-pink-100 dark:border-pink-900/80 max-h-[92vh] overflow-y-auto pb-safe">
        
        {/* iOS Sheet Grabber */}
        <div className="w-12 h-1.5 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-pink-100">
                Kelola Kategori Custom
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-pink-300">
                Buat kategori jajan & pemasukan sesuai gayamu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-rose-500 bg-pink-50 dark:bg-pink-900/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab: Pengeluaran vs Pemasukan */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800 mb-4">
          <button
            type="button"
            onClick={() => { setActiveTab('expense'); setError(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              activeTab === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 dark:text-pink-300'
            }`}
          >
            Pengeluaran ({expenseCategories.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('income'); setError(''); }}
            className={`py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
              activeTab === 'income'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-rose-700 dark:text-pink-300'
            }`}
          >
            Pemasukan ({incomeCategories.length})
          </button>
        </div>

        {/* Form Tambah Kategori Baru */}
        <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 mb-4 space-y-3">
          <div className="text-xs font-bold text-rose-900 dark:text-pink-100 flex items-center gap-1.5">
            <Plus size={14} /> Tambah Kategori Baru
          </div>

          {error && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Contoh: Nail Art / Salon"
              className="grow px-3 py-2 rounded-xl bg-white dark:bg-pink-900/60 border border-pink-200 dark:border-pink-800 text-xs text-rose-950 dark:text-pink-100 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition shrink-0"
            >
              Tambah
            </button>
          </div>

          {/* Emoji Picker */}
          <div>
            <span className="block text-[11px] font-semibold text-rose-700 dark:text-pink-300 mb-1">
              Pilih Ikon:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition active:scale-90 ${
                    selectedEmoji === em ? 'bg-rose-500 text-white scale-110 shadow-xs' : 'bg-white dark:bg-pink-900/60 hover:bg-pink-100'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <span className="block text-[11px] font-semibold text-rose-700 dark:text-pink-300 mb-1">
              Pilih Warna Aksen:
            </span>
            <div className="flex gap-2.5 items-center flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-rose-400' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-gray-500 dark:text-pink-400 uppercase tracking-wider block mb-1">
            Daftar Kategori Aktif
          </span>
          {currentList.map(c => (
            <div
              key={c.id || c.name}
              className="p-2.5 rounded-xl bg-pink-50/30 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{c.icon}</span>
                <span className="text-xs font-bold text-rose-950 dark:text-pink-100">{c.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onDeleteCategory(activeTab, c.name)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 active:scale-90 transition"
                title="Hapus Kategori"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
