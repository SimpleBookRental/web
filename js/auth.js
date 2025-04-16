/**
 * Authentication module for Simple Book Rental
 * Handles user authentication and authorization
 */

import { UserAPI } from './api.js';

/**
 * Check if user is logged in
 * @returns {boolean} - Whether the user is logged in
 */
function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}

/**
 * Get the current user
 * @returns {Object|null} - Current user or null if not logged in
 */
function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Require authentication for a page
 * Redirects to login page if user is not logged in
 */
function requireAuth() {
  if (!isLoggedIn()) {
    const isSubpage = window.location.pathname.includes('/pages/');
    const loginPath = isSubpage ? 'login.html' : 'pages/login.html';
    window.location.href = loginPath + '?redirect=' + encodeURIComponent(window.location.pathname);
  }
}

/**
 * Redirect if user is already authenticated
 * Redirects to home page if user is logged in
 */
function redirectIfAuthenticated() {
  if (isLoggedIn()) {
    const isSubpage = window.location.pathname.includes('/pages/');
    const homePath = isSubpage ? '../index.html' : 'index.html';
    window.location.href = homePath;
  }
}

/**
 * Update UI based on authentication status
 */
function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  const navLinks = document.querySelector('.nav-links');

  if (!authButtons) return;

  // Check if we're in a subpage
  const isSubpage = window.location.pathname.includes('/pages/');
  const profilePath = isSubpage ? 'profile.html' : 'pages/profile.html';
  const manageBooksPath = isSubpage ? 'manage-books.html' : 'pages/manage-books.html';
  const loginPath = isSubpage ? 'login.html' : 'pages/login.html';
  const registerPath = isSubpage ? 'register.html' : 'pages/register.html';
  const adminPath = isSubpage ? 'admin.html' : 'pages/admin.html';
  const homePath = isSubpage ? '../index.html' : 'index.html';

  if (isLoggedIn()) {
    const user = getCurrentUser();

    // Update auth buttons
    authButtons.innerHTML = `
      <a href="${profilePath}" class="btn btn-outline">Hồ sơ</a>
      <a href="${manageBooksPath}" class="btn btn-outline">Quản lý sách</a>
      <button id="logout-btn" class="btn btn-primary">Đăng xuất</button>
    `;

    // Add event listener to logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
      try {
        await UserAPI.logout();
        window.location.href = homePath;
      } catch (error) {
        console.error('Logout Error:', error);
      }
    });

    // Update nav links if user is admin
    if (user && user.role === 'admin') {
      navLinks.innerHTML += `
        <li><a href="${adminPath}">Quản trị</a></li>
      `;
    }
  } else {
    // Show login and register buttons
    authButtons.innerHTML = `
      <a href="${loginPath}" class="btn btn-outline">Đăng nhập</a>
      <a href="${registerPath}" class="btn btn-primary">Đăng ký</a>
    `;
  }
}

/**
 * Initialize authentication
 * Sets up event listeners and updates UI
 */
function initAuth() {
  // Update UI based on authentication status
  updateAuthUI();

  // Check for token expiration
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    // Token has expired, try to refresh
    import('./api.js').then(({ refreshToken }) => {
      refreshToken().catch(() => {
        // Clear tokens if refresh failed
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        updateAuthUI();
      });
    });
  }
}

// Export authentication functions
export {
  isLoggedIn,
  getCurrentUser,
  requireAuth,
  redirectIfAuthenticated,
  updateAuthUI,
  initAuth
};
