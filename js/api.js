/**
 * Book Rental - API Module
 * Handles all HTTP requests to the backend API.
 * Author: Cline (auto-generated)
 * All code is commented in English for maintainability.
 * 
 * Usage: All API functions return a Promise.
 */

const API_BASE = 'http://localhost:3000/api/v1';

/**
 * Helper to get Authorization header if token exists.
 * @returns {Object} Headers object with Authorization if available.
 */
function getAuthHeaders() {
  const token = window.localStorage.getItem('access_token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

/**
 * Generic API request handler.
 * @param {string} url - API endpoint (relative to API_BASE)
 * @param {Object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Response data or throws error with message.
 */
async function apiRequest(url, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {})
    };
    const response = await fetch(API_BASE + url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Error handling with descriptive message
      const msg = data.message || data.error || 'Unknown error';
      if (response.status === 401) {
        // Redirect to login if unauthorized
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('user');
        window.location.href = '/pages/login.html';
        throw new Error('Unauthorized. Redirecting to login.');
      }
      throw new Error(`[${response.status}] ${msg}`);
    }
    return data;
  } catch (err) {
    // Log and rethrow for UI to handle
    console.error('API Error:', err);
    throw err;
  }
}

/* ===================== AUTH ===================== */

/**
 * Login user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} LoginResponse
 */
function login(email, password) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/**
 * Logout user.
 * @param {string} refreshToken 
 * @returns {Promise<Object>} SuccessResponse
 */
function logout(refreshToken) {
  return apiRequest('/logout', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken })
  });
}

/**
 * Refresh JWT token.
 * @param {string} refreshToken 
 * @returns {Promise<Object>} RefreshTokenResponse
 */
function refreshToken(refreshToken) {
  return apiRequest('/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken })
  });
}

/* ===================== USERS ===================== */

/**
 * Register a new user.
 * @param {Object} user { email, name, password }
 * @returns {Promise<Object>} User
 */
function registerUser(user) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

/**
 * Get all users.
 * @returns {Promise<Array>} List of users
 */
function getAllUsers() {
  return apiRequest('/users', { method: 'GET' });
}

/**
 * Get user by ID.
 * @param {string} id 
 * @returns {Promise<Object>} User
 */
function getUserById(id) {
  return apiRequest(`/users/${id}`, { method: 'GET' });
}

/**
 * Update user by ID.
 * @param {string} id 
 * @param {Object} userUpdate 
 * @returns {Promise<Object>} User
 */
function updateUser(id, userUpdate) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userUpdate)
  });
}

/**
 * Delete user by ID.
 * @param {string} id 
 * @returns {Promise<Object>} SuccessResponse
 */
function deleteUser(id) {
  return apiRequest(`/users/${id}`, { method: 'DELETE' });
}

/* ===================== BOOKS ===================== */

/**
 * Get all books.
 * @returns {Promise<Array>} List of books
 */
function getAllBooks() {
  return apiRequest('/books', { method: 'GET' });
}

/**
 * Get book by ID.
 * @param {string} id 
 * @returns {Promise<Object>} Book
 */
function getBookById(id) {
  return apiRequest(`/books/${id}`, { method: 'GET' });
}

/**
 * Create a new book.
 * @param {Object} book 
 * @returns {Promise<Object>} Book
 */
function createBook(book) {
  return apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(book)
  });
}

/**
 * Update a book by ID.
 * @param {string} id 
 * @param {Object} bookUpdate 
 * @returns {Promise<Object>} Book
 */
function updateBook(id, bookUpdate) {
  return apiRequest(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookUpdate)
  });
}

/**
 * Delete a book by ID.
 * @param {string} id 
 * @returns {Promise<Object>} SuccessResponse
 */
function deleteBook(id) {
  return apiRequest(`/books/${id}`, { method: 'DELETE' });
}

/* ===================== BOOK-USER OPERATIONS ===================== */

/**
 * Create a book and associate it with a user.
 * @param {Object} bookUserRequest 
 * @returns {Promise<Object>} Book
 */
function createBookWithUser(bookUserRequest) {
  return apiRequest('/book-users', {
    method: 'POST',
    body: JSON.stringify(bookUserRequest)
  });
}

/**
 * Transfer a book from one user to another.
 * @param {string} bookId 
 * @param {Object} transferRequest { from_user_id, to_user_id }
 * @returns {Promise<Object>} SuccessResponse
 */
function transferBook(bookId, transferRequest) {
  return apiRequest(`/books/${bookId}/transfer`, {
    method: 'POST',
    body: JSON.stringify(transferRequest)
  });
}

// Export functions to global scope for use in other scripts
window.BookRentalAPI = {
  login,
  logout,
  refreshToken,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookWithUser,
  transferBook
};
