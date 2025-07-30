export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}; 