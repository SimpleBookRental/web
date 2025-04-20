/**
 * SimpleBookRental - Main JavaScript file
 * This file handles all application logic including authentication, 
 * API communication, data management, and UI rendering.
 */

// API and Application State
const API_BASE = "http://localhost:3000/api/v1";
let accessToken = null;
let refreshToken = null;
let currentUser = null;
let books = [];

// --- API Communication ---
/**
 * Performs an authenticated API request with automatic token refresh
 */
async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  if (accessToken) headers["Authorization"] = "Bearer " + accessToken;
  if (!(options.body instanceof FormData) && options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (res.status === 401 && refreshToken) {
    // Try refresh token
    const ok = await tryRefreshToken();
    if (ok) return apiRequest(path, options);
    else logout();
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Auth ---
async function register(name, email, password) {
  return apiRequest("/register", {
    method: "POST",
    body: { name, email, password }
  });
}

async function login(email, password) {
  const data = await apiRequest("/login", {
    method: "POST",
    body: { email, password }
  });
  accessToken = data.access_token;
  refreshToken = data.refresh_token;
  currentUser = data.user;
  saveAuth();
  return data.user;
}

async function logout() {
  if (refreshToken) {
    try {
      await apiRequest("/logout", {
        method: "POST",
        body: { refresh_token: refreshToken }
      });
    } catch {}
  }
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  books = [];
  saveAuth();
  renderUI();
}

async function tryRefreshToken() {
  if (!refreshToken) return false;
  try {
    const data = await apiRequest("/refresh-token", {
      method: "POST",
      body: { refresh_token: refreshToken }
    });
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    saveAuth();
    return true;
  } catch {
    return false;
  }
}

function saveAuth() {
  if (accessToken && refreshToken && currentUser) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
  }
}

function loadAuth() {
  accessToken = localStorage.getItem("accessToken");
  refreshToken = localStorage.getItem("refreshToken");
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    currentUser = null;
  }
}

// --- User profile ---
async function getUserProfile() {
  if (!currentUser) throw new Error("Not logged in");
  return apiRequest(`/users/${currentUser.id}`);
}

async function updateUserProfile({ name, email, password }) {
  if (!currentUser) throw new Error("Not logged in");
  return apiRequest(`/users/${currentUser.id}`, {
    method: "PUT",
    body: { name, email, password }
  });
}

// --- Book CRUD ---
async function fetchBooks() {
  return apiRequest("/books");
}

/**
 * Loads books from the API and updates the books table
 * @returns {Array} The loaded books or empty array on error
 */
async function loadBooks() {
  try {
    const result = await fetchBooks();
    books = result || [];
    renderBooksTable();
    return books;
  } catch (err) {
    showMessage("Failed to load books: " + err.message);
    books = [];
    renderBooksTable();
    return [];
  }
}

async function createBook({ title, author, isbn, description }) {
  const result = await apiRequest("/books", {
    method: "POST",
    body: { title, author, isbn, description, user_id: currentUser.id }
  });
  await loadBooks();
  return result;
}

async function updateBook(id, { title, author, isbn, description }) {
  const result = await apiRequest(`/books/${id}`, {
    method: "PUT",
    body: { title, author, isbn, description }
  });
  await loadBooks();
  return result;
}

async function deleteBook(id) {
  const result = await apiRequest(`/books/${id}`, { method: "DELETE" });
  await loadBooks();
  return result;
}

// --- UI rendering ---
function showSection(sectionId) {
  ["home-section", "profile-section", "login-section", "register-section"].forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? "block" : "none";
  });
}

/**
 * Updates the UI based on authentication state
 */
function renderUI() {
  // Navbar visibility
  document.getElementById("nav-home").style.display = currentUser ? "" : "none";
  document.getElementById("nav-profile").style.display = currentUser ? "" : "none";
  document.getElementById("nav-logout").style.display = currentUser ? "" : "none";
  document.getElementById("nav-login").style.display = currentUser ? "none": "";
  document.getElementById("nav-register").style.display = currentUser ? "none" : "";

  // Show appropriate section
  if (currentUser) {
    showSection("home-section");
    loadBooks(); // loadBooks already calls renderBooksTable
  } else {
    showSection("login-section");
  }
}

/**
 * Displays a toast message to the user
 * @param {string} msg - Message to display
 * @param {number} timeout - Time in ms to show the message
 */
function showMessage(msg, timeout = 2500) {
  const el = document.getElementById("message");
  const body = document.getElementById("message-body");
  body.textContent = msg;
  
  // Display toast using Bootstrap
  el.style.display = "block";
  const toast = new bootstrap.Toast(el, { delay: timeout });
  toast.show();
}

// --- Book Table Rendering ---
/**
 * Renders the books table with current data
 */
function renderBooksTable() {
  const tbody = document.querySelector("#books-table tbody");
  tbody.innerHTML = "";
  if (!books.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No books found.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  books.forEach(book => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.description || ""}</td>
      <td>
        ${book.user_id === currentUser.id
          ? '<button class="btn btn-info btn-sm me-1 view-book-btn" data-id="'+book.id+'">View</button><button class="btn btn-primary btn-sm me-1 edit-book-btn" data-id="'+book.id+'">Edit</button><button class="btn btn-warning btn-sm me-1 transfer-book-btn" data-id="'+book.id+'">Transfer</button><button class="btn btn-danger btn-sm delete-book-btn" data-id="'+book.id+'">Delete</button>'
          : '<button class="btn btn-info btn-sm view-book-btn" data-id="'+book.id+'">View</button>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Modal Management ---
/**
 * Modal instances and related state
 */
let bsBookModal = null;
let bsTransferModal = null;
let transferBookId = null;

function openBookModal(book = null) {
  if (!bsBookModal) {
    bsBookModal = new bootstrap.Modal(document.getElementById("book-modal"));
  }
  document.getElementById("book-modal-title").textContent = book ? "Edit Book" : "Add Book";
  document.getElementById("book-title").value = book ? book.title : "";
  document.getElementById("book-author").value = book ? book.author : "";
  document.getElementById("book-isbn").value = book ? book.isbn : "";
  document.getElementById("book-description").value = book ? book.description || "" : "";
  document.getElementById("book-form-submit").textContent = book ? "Update" : "Create";
  document.getElementById("book-form").dataset.editId = book ? book.id : "";
  // Enable inputs and show submit button
  document.querySelectorAll('#book-form input, #book-form textarea').forEach(el => el.disabled = false);
  document.getElementById("book-form-submit").style.display = "inline-block";
  bsBookModal.show();
}

function closeBookModal() {
  if (bsBookModal) {
    bsBookModal.hide();
  }
}

function openTransferModal(bookId) {
  transferBookId = bookId;
  if (!bsTransferModal) {
    bsTransferModal = new bootstrap.Modal(document.getElementById("transfer-modal"));
  }
  document.getElementById("transfer-user-id").value = "";
  bsTransferModal.show();
}

function closeTransferModal() {
  if (bsTransferModal) {
    bsTransferModal.hide();
  }
}

function setupEventListeners() {
  // Navbar
  document.getElementById("nav-home").onclick = () => {
    showSection("home-section");
    loadBooks();
  };
  document.getElementById("nav-profile").onclick = async () => {
    showSection("profile-section");
    if (currentUser) {
      try {
        const user = await getUserProfile();
        document.getElementById("profile-name").value = user.name;
        document.getElementById("profile-email").value = user.email;
        document.getElementById("profile-password").value = "";
      } catch (e) {
        showMessage("Failed to load profile: " + e.message);
      }
    }
  };
  document.getElementById("nav-logout").onclick = () => logout();
  document.getElementById("nav-login").onclick = () => showSection("login-section");
  document.getElementById("nav-register").onclick = () => showSection("register-section");

  // Login form
  document.getElementById("login-form").onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      await login(email, password);
      showMessage("Login successful!");
      // Reset form fields after successful login
      document.getElementById("login-form").reset();
      renderUI();
    } catch (err) {
      showMessage("Login failed: " + err.message);
    }
  };

  // Register form
  document.getElementById("register-form").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    try {
      await register(name, email, password);
      showMessage("Register successful! Please login.");
      // Reset form fields after successful registration
      document.getElementById("register-form").reset();
      showSection("login-section");
    } catch (err) {
      showMessage("Register failed: " + err.message);
    }
  };

  // Profile form
  document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const password = document.getElementById("profile-password").value;
    try {
      const updated = await updateUserProfile({ name, email, password: password || undefined });
      currentUser = updated;
      saveAuth();
      // Reset password field after successful update
      document.getElementById("profile-password").value = "";
      showMessage("Profile updated!");
    } catch (err) {
      showMessage("Update failed: " + err.message);
    }
  };

  // Add book
  document.getElementById("btn-add-book").onclick = () => openBookModal();

  // Book modal close
  document.getElementById("close-book-modal").onclick = closeBookModal;

  // Transfer modal close
  document.getElementById("close-transfer-modal").onclick = closeTransferModal;

  // Transfer form submit
  document.getElementById("transfer-form").onsubmit = async (e) => {
    e.preventDefault();
    const toUserId = document.getElementById("transfer-user-id").value.trim();
    if (!toUserId) {
      showMessage("Please enter a user ID to transfer to.");
      return;
    }
    try {
      await apiRequest(`/books/${transferBookId}/transfer`, {
        method: "POST",
        body: { from_user_id: currentUser.id, to_user_id: toUserId }
      });
      await loadBooks();
      // Reset form fields after successful transfer
      document.getElementById("transfer-form").reset();
      closeTransferModal();
      showMessage("Book transferred!");
    } catch (err) {
      showMessage("Transfer failed: " + err.message);
    }
  };

  // Book form (add/edit)
  document.getElementById("book-form").onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const isbn = document.getElementById("book-isbn").value.trim();
    const description = document.getElementById("book-description").value.trim();
    const editId = document.getElementById("book-form").dataset.editId;
    try {
      if (editId) {
        await updateBook(editId, { title, author, isbn, description });
        await loadBooks();
        closeBookModal();
        showMessage("Book updated!");
      } else {
        await createBook({ title, author, isbn, description });
        await loadBooks();
        closeBookModal();
        showMessage("Book created!");
      }
    } catch (err) {
      showMessage("Save failed: " + err.message);
    }
  };

  // Book table actions (edit/delete)
  document.querySelector("#books-table tbody").onclick = (e) => {
    if (e.target.classList.contains("edit-book-btn")) {
      const id = e.target.dataset.id;
      const book = books.find(b => b.id === id);
      if (book) openBookModal(book);
    }
      if (e.target.classList.contains("delete-book-btn")) {
        const id = e.target.dataset.id;
        if (confirm("Delete this book?")) {
          deleteBook(id).then(async () => {
            await loadBooks();
            showMessage("Book deleted!");
          }).catch(err => showMessage("Delete failed: " + err.message));
        }
      }
      if (e.target.classList.contains("transfer-book-btn")) {
        const id = e.target.dataset.id;
        openTransferModal(id);
      }
      if (e.target.classList.contains("view-book-btn")) {
        const id = e.target.dataset.id;
        // Check if book exists in memory
        const existingBook = books.find(b => b.id === id);
        if (existingBook) {
          openBookModal(existingBook);
          // Disable inputs and hide submit button
          document.querySelectorAll('#book-form input, #book-form textarea').forEach(el => el.disabled = true);
          document.getElementById("book-form-submit").style.display = "none";
        } else {
          // If not in memory, fetch from API
          apiRequest(`/books/${id}`).then(book => {
            // Add to books array for future use
            if (!books.some(b => b.id === book.id)) {
              books.push(book);
            }
            openBookModal(book);
            // Disable inputs and hide submit button
            document.querySelectorAll('#book-form input, #book-form textarea').forEach(el => el.disabled = true);
            document.getElementById("book-form-submit").style.display = "none";
          }).catch(err => showMessage("View failed: " + err.message));
        }
      }
    };

  // Modal click outside to close
  document.getElementById("book-modal").onclick = (e) => {
    if (e.target === document.getElementById("book-modal")) closeBookModal();
  };
}

// --- Application Initialization ---
/**
 * Initialize the application when the page loads
 */
window.onload = function() {
  loadAuth();
  setupEventListeners();
  renderUI();
};
