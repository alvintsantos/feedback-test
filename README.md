# Feedback Application

A full-stack application for collecting and managing user feedback with rating and happiness metrics.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

## Requirements

### Backend
- PHP 8.0 or higher
- Composer
- MySQL or SQLite
- Laravel requirements

### Frontend
- Node.js 16 or higher
- npm or yarn

### Note
- The application includes pre-configured .env files for both frontend and backend. You only need to adjust the database connection settings if needed.

## Installation


Clone the repository to your local machine:

```bash
git clone <repository-url>
cd feedback-test
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies using Composer:
```bash
composer install
```

4. Configure your database connection in the `.env` file:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=feedback
DB_USERNAME=root
DB_PASSWORD=
```

5. Create the database:
```bash
php artisan create:database
```

6. Run migrations to create tables:
```bash
php artisan migrate
```

7. Seed the database with initial data:
```bash
php artisan db:seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```
or if you're using yarn:
```bash
yarn install
```


3. Configure the API URL in the `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Configuration

### Backend Configuration

Additional backend configuration options can be set in the `.env` file:

- `APP_DEBUG`: Set to `true` for development, `false` for production
- `LOG_LEVEL`: Log level (debug, info, warning, error)
- `CORS_ALLOWED_ORIGINS`: Configure CORS if needed

### Frontend Configuration

The frontend configuration is primarily controlled through environment variables in the `.env` file.

## Running the Application

### Start the Backend Server

```bash
cd backend
php artisan serve --port=8080
```

This will start the Laravel development server, typically at http://localhost:8080.

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```


This will start the Vite development server, typically at http://localhost:5173.

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/feedback`: List all feedback with pagination support
  - Query parameters:
    - `page`: Page number
    - `per_page`: Items per page
    - `rating`: Filter by rating (1-5)
    - `happiness_level`: Filter by happiness level (1-5)
    - `sort`: Sort field (e.g., 'rating')
    - `order`: Sort order ('asc' or 'desc')

- `POST /api/feedback`: Create new feedback

- `GET /api/feedback/{id}`: Get specific feedback

- `PUT /api/feedback/{id}`: Update feedback

- `DELETE /api/feedback/{id}`: Delete feedback

## Features

- Collect user feedback with ratings and happiness levels
- Filter and sort feedback by various criteria
- Responsive frontend built with React and Bootstrap
- RESTful API built with Laravel
- Emoji-based happiness scale
- Pagination for large datasets
- Modern UI with modals and interactive components

## Troubleshooting

### Backend Issues

1. **Database Connection Errors**
   - Check your database credentials in the `.env` file
   - Ensure MySQL service is running

2. **Permission Issues**
   - Ensure the `storage` and `bootstrap/cache` directories are writable

### Frontend Issues

1. **API Connection Errors**
   - Verify the backend server is running
   - Check the `VITE_API_BASE_URL` in your frontend `.env` file
   - Ensure CORS is properly configured on the backend

2. **Build Errors**
   - Clear node_modules and reinstall dependencies:
     ```bash
     rm -rf node_modules
     npm install
     ```

## License

[Your license information here]


