# SmartBasket – Food Saver API

This is the backend API for the SmartBasket application.

## Prerequisites
1. Node.js installed.
2. MongoDB running locally or a connection string in `.env`.

## Setup & Run (Fix applied)

1. Open a terminal in the `MindSprintbackend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server runs on port **5000**.*

## API Documentation

API documentation is available via Swagger UI.
After starting the server, visit:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- helmet
- morgan
- socket.io
- node-cron
- swagger-jsdoc
- swagger-ui-express

## Environment Variables
cp `.env.example` to `.env` and fill in your values. defaults are provided.

## API Endpoints & Usage
See `server.js` or the Postman collection for full details.
