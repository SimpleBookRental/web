/**
 * Book Rental - Main App JS
 * Handles navigation, UI events, and app-wide logic.
 * Author: Cline (auto-generated)
 * All code is commented in English for maintainability.
 */

// Import utility and API modules (Vanilla JS: loaded via <script> tags)
document.addEventListener('DOMContentLoaded', function () {
  // Responsive navbar toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
  }

  // Auth navigation (login/logout/profile)
  updateNavAuth();

  // Add more global event listeners if needed
});

/**
 * Update the navigation bar with auth links based on login state.
 */
function updateNavAuth() {
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;
  const user = window.localStorage.getItem('user');
  if (user) {
    navAuth.innerHTML = `
      <a href="/pages/profile.html">Profile</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.location.href = 'index.html';
      });
    }
  } else {
    navAuth.innerHTML = `
      <a href="/pages/login.html">Login</a>
      <a href="/pages/register.html">Register</a>
    `;
  }
}
