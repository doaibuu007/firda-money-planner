// Format Date object to local YYYY-MM-DD (avoids UTC offset bugs between 00:00-07:00 WIB)
export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD string safely in local timezone
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(dateStr);
};

export const formatRupiah = (number) => {
  if (isNaN(number) || number === null || number === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDateIndo = (dateStr) => {
  if (!dateStr) return '';
  const date = parseLocalDate(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Validate imported backup JSON structure
export const validateBackupPayload = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.transactions)) return false;
  return data.transactions.every(
    (t) =>
      t &&
      typeof t.id === 'string' &&
      (t.type === 'expense' || t.type === 'income') &&
      typeof Number(t.amount) === 'number' &&
      !isNaN(Number(t.amount)) &&
      typeof t.category === 'string' &&
      typeof t.date === 'string'
  );
};

// Export to CSV
export const exportToCSV = (transactions) => {
  const headers = ['ID', 'Tipe', 'Tanggal', 'Kategori', 'Nominal', 'Metode Pembayaran', 'Catatan'];
  const rows = transactions.map((t) => [
    t.id,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.date,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.paymentMethod || '-').replace(/"/g, '""')}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `firda_catatan_keuangan_${getLocalDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to JSON Backup
export const exportToJSON = (data) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `firda_backup_keuangan_${getLocalDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
