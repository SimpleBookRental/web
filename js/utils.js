/**
 * Utility functions for Simple Book Rental
 */

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
function truncateString(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Show an alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, warning)
 * @param {HTMLElement} container - Container to append the alert to
 * @param {number} timeout - Time in milliseconds before the alert disappears
 */
function showAlert(message, type = 'success', container, timeout = 5000) {
  // Create alert element
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;

  // Add alert to container
  container.prepend(alertElement);

  // Remove alert after timeout
  setTimeout(() => {
    alertElement.remove();
  }, timeout);
}

/**
 * Get URL parameters
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Create a book card element
 * @param {Object} book - Book data
 * @returns {HTMLElement} - Book card element
 */
function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';

  card.innerHTML = `
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">Tác giả: ${book.author}</p>
      <p class="book-description">${truncateString(book.description, 150)}</p>
      <a href="pages/book-detail.html?id=${book.id}" class="btn btn-primary">Xem chi tiết</a>
    </div>
  `;

  return card;
}

/**
 * Show loading spinner
 * @param {HTMLElement} container - Container to append the spinner to
 */
function showLoading(container) {
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `;
}

/**
 * Validate form inputs
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result
 */
function validateForm(formData, requiredFields) {
  const errors = {};

  // Check required fields
  for (const field of requiredFields) {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  }

  // Validate email format if email is present
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password length if password is present
  if (formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Export utility functions
export {
  formatDate,
  truncateString,
  showAlert,
  getUrlParam,
  createBookCard,
  showLoading,
  validateForm,
  debounce
};
