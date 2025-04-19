# Simple Book Rental (Frontend)

A simple web application for managing your personal book collection, built with **Vanilla JavaScript**, HTML, and CSS. This project connects to a RESTful backend API (see `swagger.yaml`) and allows users to register, log in, manage their profile, and perform full CRUD operations on their books.

## Features

- **User Authentication**: Register, login, and logout with JWT-based authentication.
- **Book Management**: Add, edit, delete, and view your own books in a user-friendly table.
- **User Profile**: View and update your profile information (name, email, password).
- **Responsive UI**: Clean, simple interface with no frameworks required.
- **Instant Updates**: Book table updates automatically after any CRUD operation.

## Project Structure

```
.
├── index.html      # Main HTML file
├── style.css       # App styling
├── main.js         # All frontend logic (API calls, UI, state)
├── swagger.yaml    # Backend API specification
└── LICENSE
```

## Getting Started

1. **Start the Backend API**  
   Make sure your backend server is running at `http://localhost:3000` and supports CORS for your frontend.

2. **Open the Frontend**  
   Simply open `index.html` in your browser.  
   > No build step or server required!

3. **Usage**  
   - Register a new account or login with existing credentials.
   - Manage your books from the Home page.
   - Update your profile from the Profile page.
   - All changes are synced with the backend API.

## Backend API

- The frontend communicates with the backend at:  
  `http://localhost:3000/api/v1`
- API endpoints and data models are defined in [`swagger.yaml`](./swagger.yaml).

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (no frameworks)
- **Backend**: Any server compatible with the provided Swagger API (Go, Gin, GORM, etc.)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
