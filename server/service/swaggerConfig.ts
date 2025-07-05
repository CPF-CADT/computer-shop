import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product API',
    version: '1.0.0',
    description: 'API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000', 
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./controller/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
