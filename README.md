# SimpleBookRental

A web-based application for managing your book collection, with features for lending, transferring, and tracking books.

## Features

- **User Authentication**: Register, login, and manage your profile
- **Book Management**: Add, edit, view, and delete books in your collection
- **Book Transfer**: Transfer book ownership to other users
- **Responsive Design**: Works well on desktop and mobile devices

## Technologies Used

- **Frontend**:
  - HTML5
  - Vanilla JavaScript
  - Bootstrap 5.3.5 for styling
  - RESTful API integration

- **Backend**:
  - RESTful API (running on http://localhost:3000/api/v1)
  - JWT-based authentication

## Project Structure

- `index.html` - Main HTML structure and UI components
- `main.js` - Core JavaScript code handling all application logic
- `swagger.yaml` - API documentation

## How to Run

1. Clone the repository
2. Ensure the backend API is running at http://localhost:3000/api/v1
3. Install `Live Server` extension to your VSCode
4. Access the application at http://localhost:5500

## API Endpoints

The application interacts with the following API endpoints:

- **Authentication**:
  - POST `/register` - Create a new user account
  - POST `/login` - Authenticate and receive access tokens
  - POST `/logout` - End user session
  - POST `/refresh-token` - Refresh authentication tokens

- **User Management**:
  - GET `/users/:id` - Get user details
  - PUT `/users/:id` - Update user information

- **Book Management**:
  - GET `/books` - Get list of books
  - GET `/books/:id` - Get specific book details
  - POST `/books` - Add a new book
  - PUT `/books/:id` - Update book details
  - DELETE `/books/:id` - Remove a book
  - POST `/books/:id/transfer` - Transfer book ownership

## Authentication Flow

The application uses a JWT-based authentication system:

1. User logs in with email and password
2. Server provides access token and refresh token
3. Access token is used for authenticated requests
4. When access token expires, refresh token is used to obtain a new one
5. Tokens are stored in browser's localStorage

## Development

To modify the application:

1. Edit `index.html` for UI/structure changes
2. Modify `main.js` for JavaScript functionality
3. Test changes with the API running

## License

See the LICENSE file for details.
