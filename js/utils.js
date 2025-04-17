/**
 * Book Rental - Utility Module
 * Common utility functions for the frontend.
 * Author: Cline (auto-generated)
 * All code is commented in English for maintainability.
 */

/**
 * Format ISO date string to readable format.
 * @param {string} isoString 
 * @returns {string}
 */
function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Validate email format.
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show a loading spinner overlay.
 */
function showLoading() {
  let el = document.getElementById('loadingOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loadingOverlay';
    el.style.position = 'fixed';
    el.style.top = 0;
    el.style.left = 0;
    el.style.width = '100vw';
    el.style.height = '100vh';
    el.style.background = 'rgba(0,0,0,0.2)';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.zIndex = 9999;
    el.innerHTML = '<div style="padding:2rem;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0002;font-size:1.2rem;">Loading...</div>';
    document.body.appendChild(el);
  } else {
    el.style.display = 'flex';
  }
}

/**
 * Hide the loading spinner overlay.
 */
function hideLoading() {
  const el = document.getElementById('loadingOverlay');
  if (el) el.style.display = 'none';
}

/**
 * Show a toast message.
 * @param {string} message 
 * @param {string} type 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.minWidth = '200px';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '1rem';
    toast.style.color = '#fff';
    toast.style.zIndex = 10000;
    toast.style.boxShadow = '0 2px 12px #0002';
    document.body.appendChild(toast);
  }
  toast.style.background = type === 'success' ? '#4caf50' : (type === 'error' ? '#e74c3c' : '#2d3e50');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Export to global scope
window.BookRentalUtils = {
  formatDate,
  isValidEmail,
  showLoading,
  hideLoading,
  showToast
};
