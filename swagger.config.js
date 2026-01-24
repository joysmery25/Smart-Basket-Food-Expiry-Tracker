const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBasket Food Saver API',
      version: '1.0.0',
      description: 'API documentation for SmartBasket application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token directly. Do NOT prefix with "Bearer ".'
        },
      },
    },
  },
  apis: ['./server.js', './server/controllers/*.js'], // files containing annotations as above
};

module.exports = options;
