/**
 * Main JavaScript file for Simple Book Rental
 */

import { initAuth } from './auth.js';
import { BookAPI } from './api.js';
import { showLoading, createBookCard, showAlert } from './utils.js';

/**
 * Initialize the application
 */
function initApp() {
  // Initialize authentication
  initAuth();

  // Initialize page-specific functionality
  const currentPage = window.location.pathname;

  // Always initialize home page for index.html
  initHomePage();
}

/**
 * Initialize the home page
 */
async function initHomePage() {
  const booksContainer = document.querySelector('.books-container');

  if (!booksContainer) return;

  try {
    // Show loading spinner
    showLoading(booksContainer);

    // Fetch featured books
    const response = await BookAPI.getAllBooks();
    const books = response.data;

    // Clear loading spinner
    booksContainer.innerHTML = '';

    // Display books or show message if no books
    if (books.length === 0) {
      booksContainer.innerHTML = '<p class="text-center">Không có sách nào.</p>';
      return;
    }

    // Create and append book cards
    books.forEach(book => {
      const bookCard = createBookCard(book);
      booksContainer.appendChild(bookCard);
    });
  } catch (error) {
    console.error('Error loading books:', error);
    booksContainer.innerHTML = `
      <div class="alert alert-danger">
        Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
      </div>
    `;
  }
}

/**
 * Initialize the search functionality
 */
function initSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    // Redirect to search results page
    window.location.href = `pages/search.html?q=${encodeURIComponent(searchTerm)}`;
  });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initSearch();
});
