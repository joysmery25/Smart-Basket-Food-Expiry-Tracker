# SmartBasket – Food Saver API

This is the backend API for the SmartBasket application.

## Base URL
`http://localhost:5000`

## Prerequisites
1. Node.js installed.
2. MongoDB running locally or a connection string in `.env`.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/google` - Google Login
- **GET** `/api/auth/me` - Get current user profile (Protected)
- **PUT** `/api/auth/profile` - Update profile (Protected)
- **GET** `/api/auth/analytics` - Get user impact stats (Protected)

### Groceries
- **GET** `/api/groceries` - Get all items (Calculates days left)
- **POST** `/api/groceries` - Add item
- **PUT** `/api/groceries/:id` - Update item
- **DELETE** `/api/groceries/:id` - Delete item

### Recipes
- **GET** `/api/recipes` - Get all recipes (supports `?category=`, `?tag=`, `?search=`)
- **GET** `/api/recipes/recommend` - Get recommendations based on expiring items
- **POST** `/api/recipes/seed` - Seed sample data
- **POST** `/api/recipes/:id/cook` - Mark as cooked & update stats

### Community
- **GET** `/api/community/food` - Get available shared food
- **POST** `/api/community/share` - Post food
- **PUT** `/api/community/food/:id/request` - Request food
- **PUT** `/api/community/food/:id/status` - Accept/Reject request

## Example Usage (Frontend)

```javascript
// Function to fetch groceries
async function fetchGroceries(token) {
  const response = await fetch('http://localhost:5000/api/groceries', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
}

// Function to login
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}
```

## Real-time Updates (Socket.io)
Connect using `socket.io-client`:
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

socket.on('new-food-posted', (food) => {
  console.log('New food available:', food);
});
```
