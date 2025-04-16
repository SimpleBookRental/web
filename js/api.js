/**
 * API module for Simple Book Rental
 * Handles all API requests to the backend
 */

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Handles API requests with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  try {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('accessToken');

    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh the token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request with the new token
          return apiRequest(endpoint, options);
        } else {
          // Redirect to login if refresh failed
          const isSubpage = window.location.pathname.includes('/pages/');
          const loginPath = isSubpage ? 'login.html' : 'pages/login.html';
          window.location.href = loginPath;
        }
      }

      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Refreshes the access token using the refresh token
 * @returns {Promise<boolean>} - Whether the token was successfully refreshed
 */
async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      // Clear tokens if refresh failed
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return false;
    }

    const data = await response.json();

    // Save new tokens
    localStorage.setItem('accessToken', data.data.access_token);
    localStorage.setItem('refreshToken', data.data.refresh_token);

    return true;
  } catch (error) {
    console.error('Token Refresh Error:', error);
    return false;
  }
}

/**
 * User API functions
 */
const UserAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Response data
   */
  register: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Login a user
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} - Response data
   */
  login: async (credentials) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    // Save tokens and user data
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response;
  },

  /**
   * Logout a user
   * @returns {Promise<Object>} - Response data
   */
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return { success: true };
    }

    const response = await apiRequest('/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return response;
  },

  /**
   * Get all users
   * @returns {Promise<Object>} - Response data
   */
  getAllUsers: async () => {
    return apiRequest('/users');
  },

  /**
   * Get a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Response data
   */
  getUserById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Response data
   */
  updateUser: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Response data
   */
  deleteUser: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Book API functions
 */
const BookAPI = {
  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise<Object>} - Response data
   */
  createBook: async (bookData) => {
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },

  /**
   * Get all books
   * @returns {Promise<Object>} - Response data
   */
  getAllBooks: async () => {
    return apiRequest('/books');
  },

  /**
   * Get a book by ID
   * @param {string} id - Book ID
   * @returns {Promise<Object>} - Response data
   */
  getBookById: async (id) => {
    return apiRequest(`/books/${id}`);
  },

  /**
   * Update a book
   * @param {string} id - Book ID
   * @param {Object} bookData - Book data
   * @returns {Promise<Object>} - Response data
   */
  updateBook: async (id, bookData) => {
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  },

  /**
   * Delete a book
   * @param {string} id - Book ID
   * @returns {Promise<Object>} - Response data
   */
  deleteBook: async (id) => {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get books by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Response data
   */
  getBooksByUserId: async (userId) => {
    return apiRequest(`/user-books/${userId}`);
  }
};

// Export the API modules
export { UserAPI, BookAPI };
