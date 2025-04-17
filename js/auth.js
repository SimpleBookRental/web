/**
 * Book Rental - Auth Module
 * Handles authentication logic: login, register, logout, token refresh.
 * Author: Cline (auto-generated)
 * All code is commented in English for maintainability.
 */

// Auth logic is separated for SOLID compliance

/**
 * Handle user login.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<void>}
 */
async function handleLogin(email, password) {
  try {
    const res = await window.BookRentalAPI.login(email, password);
    // Save tokens and user info to localStorage (from res.data)
    if (res && res.data) {
      window.localStorage.setItem('access_token', res.data.access_token);
      window.localStorage.setItem('refresh_token', res.data.refresh_token);
      window.localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '../index.html';
    } else {
      showError('Login response invalid');
    }
  } catch (err) {
    showError(err.message || 'Login failed');
  }
}

/**
 * Handle user registration.
 * @param {Object} user { email, name, password }
 * @returns {Promise<void>}
 */
async function handleRegister(user) {
  try {
    await window.BookRentalAPI.registerUser(user);
    // After registration, redirect to login
    window.location.href = 'login.html?registered=1';
  } catch (err) {
    showError(err.message || 'Registration failed');
  }
}

/**
 * Handle user logout.
 * @returns {Promise<void>}
 */
async function handleLogout() {
  try {
    const refreshToken = window.localStorage.getItem('refresh_token');
    if (refreshToken) {
      await window.BookRentalAPI.logout(refreshToken);
    }
  } catch (err) {
    // Ignore logout error, just clear localStorage
  } finally {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
    window.localStorage.removeItem('user');
    window.location.href = '../index.html';
  }
}

/**
 * Handle token refresh.
 * @returns {Promise<void>}
 */
async function handleRefreshToken() {
  try {
    const refreshToken = window.localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const res = await window.BookRentalAPI.refreshToken(refreshToken);
    window.localStorage.setItem('access_token', res.access_token);
    window.localStorage.setItem('refresh_token', res.refresh_token);
  } catch (err) {
    showError('Session expired. Please login again.');
    await handleLogout();
  }
}

/**
 * Show error message to user.
 * @param {string} message 
 */
function showError(message) {
  // Simple error display, can be improved for UI/UX
  alert(message);
}

// Export to global scope
window.BookRentalAuth = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefreshToken
};
