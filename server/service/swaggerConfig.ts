import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Computer Shop API',
      version: '1.0.0',
      description: 'API documentation for all services in the computer shop backend.',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Development server',
      },
    ],
    tags: [
        { name: 'Address', description: 'Customer address management' },
        { name: 'Brand', description: 'Product brand management' },
        { name: 'Cart', description: 'Shopping cart operations' },
        { name: 'Category', description: 'Product category management' },
        { name: 'Checkout', description: 'Order and payment processing' },
        { name: 'Customer', description: 'Customer registration, login, and 2FA' },
        { name: 'Product', description: 'Product catalog management' },
        { name: 'Service', description: 'General services like file uploads' },
        { name: 'TypeProduct', description: 'Product type management' },
        { name: 'User Management', description: 'API for managing raw database users and roles' },
        { name: 'Recovery', description: 'Database backup and recovery operations' },
    ]
  },
  apis: ['../controller/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
