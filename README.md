# Simple Book Rental - Frontend

This is the frontend part of the Simple Book Rental system, an online book rental application built with Vanilla JavaScript, HTML, and CSS.

## Features

- User registration and login
- View book listings
- Search and filter books
- View book details
- Rent and return books
- Manage user profile

## Installation

### Requirements

- Web server (Apache, Nginx, or any other web server)
- Running Backend API (see swagger.yaml file for API details)

### Manual Installation

1. Clone this repository
2. Configure your web server to serve the static files
3. Open your browser and access the web server address

### Using Docker

```bash
# Build the image
docker build -t simple-book-rental-frontend .

# Run the container
docker run -p 8080:80 simple-book-rental-frontend
```

Or use Docker Compose:

```bash
docker-compose up -d
```

## Project Structure

```
.
├── css/              # CSS files
├── js/               # JavaScript files
│   ├── api.js        # API handling module
│   ├── auth.js       # Authentication module
│   ├── app.js        # Main JavaScript file
│   └── utils.js      # Utility functions
├── pages/            # HTML pages
├── index.html        # Home page
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── README.md         # Documentation
```

## Backend API

This application uses the RESTful API described in the `swagger.yaml` file. Make sure that the backend API is running and accessible from the frontend.

## Development

### Editing the API URL

By default, the application connects to the API at `http://localhost:3000/api/v1`. To change this URL, edit the `API_BASE_URL` variable in the `js/api.js` file.

```javascript
const API_BASE_URL = 'http://your-api-url/api/v1';
```