// // tests/user.integration.test.ts
// import request from 'supertest';
// // import app from '../app'; // Import your configured express app
// import { Customer } from '../db/models'; // Import your DB model

// // --- MOCK THE DATABASE MODEL ---
// // We mock the database model itself to avoid hitting a real DB.
// // For a true integration test, you would connect to a TEST database.
// // But for this example, mocking the model is a good middle ground.
// jest.mock('../db/models', () => ({
//   Customer: {
//     create: jest.fn(),
//     findOne: jest.fn(),
//   },
// }));


// describe('User API (Integration Tests)', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /api/customer/register', () => {
//     it('should create a user and return 201', async () => {
//       // Arrange
//       const userData = {
//         name: 'Integration Test User',
//         phone_number: '987654321',
//         password: 'strongpassword',
//       };
      
//       // Mock the DB call to simulate successful creation
//       (Customer.create as jest.Mock).mockResolvedValue(userData);

//       // Act & Assert
//       const response = await request(app)
//         .post('/api/customer/register')
//         .send(userData);

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({ message: 'user create success ' });
      
//       // Check that the create function was called with a HASHED password, not the plain one.
//       expect(Customer.create).toHaveBeenCalledWith(expect.objectContaining({
//           name: 'Integration Test User',
//           password: expect.not.stringContaining('strongpassword') // The password should be hashed
//       }));
//     });
//   });

//   describe('POST /api/customer/login', () => {
//     it('should login the user and return a token', async () => {
//       // Arrange
//       const loginCredentials = {
//         phone_number: '987654321',
//         password: 'strongpassword',
//       };
      
//       // Mock the DB call to simulate finding a user with a correctly hashed password
//       (Customer.findOne as jest.Mock).mockResolvedValue({
//         id: 1,
//         name: 'Integration Test User',
//         phone_number: '987654321',
//         // This would be the real hash stored in your DB
//         password: '$2b$10$abcdefghijklmnopqrstuv' 
//       });

//       // Act & Assert
//       const response = await request(app)
//         .post('/api/customer/login')
//         .send(loginCredentials);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body).toHaveProperty('token'); // Check that a token is returned
//     });
//   });
// });
