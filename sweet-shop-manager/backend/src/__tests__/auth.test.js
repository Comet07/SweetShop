const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User'); // Import the User model
const dotenv = require('dotenv');

dotenv.config();

/* Connect to the database before running any tests. */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

/* Clear the User collection after every test to ensure isolation. */
afterEach(async () => {
  await User.deleteMany({});
});

/* Disconnect from the database after all tests are done. */
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');

      // Verify user was actually created in the DB (without the password)
      const userInDb = await User.findOne({ email: newUser.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb.name).toBe(newUser.name);
    });
  });



  describe('POST /api/auth/login', () => {
    // Create a user before each login test
    beforeEach(async () => {
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should log in a registered user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials (wrong password)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe('Invalid credentials');
    });

    it('should return 401 for invalid credentials (user not found)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nouser@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe('Invalid credentials');
    });
  });


});