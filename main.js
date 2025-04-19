const API_BASE = "http://localhost:3000/api/v1";
let accessToken = null;
let refreshToken = null;
let currentUser = null;
let books = [];

// --- Helper: HTTP request with auth ---
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
  const allBooks = await apiRequest("/books");
  // Lọc sách của user hiện tại
  return allBooks.filter(b => b.user_id === currentUser.id);
}

async function createBook({ title, author, isbn, description }) {
  return apiRequest("/books", {
    method: "POST",
    body: { title, author, isbn, description, user_id: currentUser.id }
  });
}

async function updateBook(id, { title, author, isbn, description }) {
  return apiRequest(`/books/${id}`, {
    method: "PUT",
    body: { title, author, isbn, description, user_id: currentUser.id }
  });
}

async function deleteBook(id) {
  return apiRequest(`/books/${id}`, { method: "DELETE" });
}

// --- UI rendering ---
function showSection(sectionId) {
  ["home-section", "profile-section", "login-section", "register-section"].forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? "block" : "none";
  });
}

function renderUI() {
  // Navbar
  document.getElementById("nav-home").style.display = currentUser ? "" : "none";
  document.getElementById("nav-profile").style.display = currentUser ? "" : "none";
  document.getElementById("nav-logout").style.display = currentUser ? "" : "none";
  document.getElementById("nav-login").style.display = currentUser ? "": "none";
  document.getElementById("nav-register").style.display = currentUser ? "none" : "";

  // Section
  if (currentUser) {
    showSection("home-section");
    loadBooks();
  } else {
    showSection("login-section");
  }
}

function showMessage(msg, timeout = 2500) {
  const el = document.getElementById("message");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, timeout);
}

// --- Book Table ---
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
        <button class="edit-book-btn" data-id="${book.id}">Edit</button>
        <button class="delete-book-btn" data-id="${book.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Book Modal ---
function openBookModal(book = null) {
  document.getElementById("book-modal-title").textContent = book ? "Edit Book" : "Add Book";
  document.getElementById("book-title").value = book ? book.title : "";
  document.getElementById("book-author").value = book ? book.author : "";
  document.getElementById("book-isbn").value = book ? book.isbn : "";
  document.getElementById("book-description").value = book ? book.description || "" : "";
  document.getElementById("book-form-submit").textContent = book ? "Update" : "Create";
  document.getElementById("book-form").dataset.editId = book ? book.id : "";
  document.getElementById("book-modal").style.display = "flex";
}

function closeBookModal() {
  document.getElementById("book-modal").style.display = "none";
}

// --- Load books ---
async function loadBooks() {
  try {
    books = await fetchBooks();
    renderBooksTable();
  } catch (e) {
    showMessage("Failed to load books: " + e.message);
  }
}

// --- Event listeners ---
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
      showMessage("Profile updated!");
    } catch (err) {
      showMessage("Update failed: " + err.message);
    }
  };

  // Add book
  document.getElementById("btn-add-book").onclick = () => openBookModal();

  // Book modal close
  document.getElementById("close-book-modal").onclick = closeBookModal;

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
  };

  // Modal click outside to close
  document.getElementById("book-modal").onclick = (e) => {
    if (e.target === document.getElementById("book-modal")) closeBookModal();
  };
}

// --- Init ---
window.onload = function() {
  loadAuth();
  setupEventListeners();
  renderUI();
};
