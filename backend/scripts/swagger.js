const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Node.js API',
    description: 'API Documentation for the Backend'
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Nhập token vào đây theo định dạng: Bearer <token>'
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './scripts/swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);
