// C:/Users/prita/PycharmProjects/SweetShop/sweet-shop-manager/backend/src/__tests__/sweets.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Sweet = require('../models/Sweet');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

/* Top-level Test Setup */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // Clean the User collection ONCE before all tests in this file
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

/* Main Test Suite */
describe('Sweets API', () => {
  // Clean sweets after each individual test to ensure isolation
  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  // --- Public GET Routes ---
  describe('Public GET Endpoints', () => {
    it('GET /api/sweets --> should return an array of sweets', async () => {
      await Sweet.create([
        { name: 'Gummy Bear', category: 'Gummy', price: 1.50, quantity: 100 },
        { name: 'Lollipop', category: 'Hard Candy', price: 0.75, quantity: 200 },
      ]);

      const response = await request(app).get('/api/sweets');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
    // ... your search tests can go here ...
  });

  // --- Admin-Only PUT Route ---
  describe('PUT /api/sweets/:id', () => {
    let adminToken;

    beforeAll(async () => {
      // Use a unique email for this test suite
      const adminUser = { name: 'PutAdmin', email: 'put-admin@example.com', password: 'password123', role: 'Admin' };
      await request(app).post('/api/auth/register').send(adminUser);
      const loginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
      adminToken = loginRes.body.token;
    });

    it('should update an existing sweet', async () => {
      const sweetToUpdate = await Sweet.create({ name: 'Original', category: 'Test', price: 1.00, quantity: 10 });
      const updatedData = { name: 'Updated Sweet', price: 1.25 };

      const response = await request(app)
        .put(`/api/sweets/${sweetToUpdate._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
    });

    it('should return 404 if sweet is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Wont work' });

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for an invalid ID', async () => {
        const response = await request(app)
          .put('/api/sweets/invalid-id')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 'Wont work' });

        expect(response.statusCode).toBe(400);
      });
  });

  // --- Admin-Only DELETE Route ---
  describe('DELETE /api/sweets/:id', () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
      // Use unique emails for this test suite
      const adminUser = { name: 'DeleteAdmin', email: 'delete-admin@example.com', password: 'password123', role: 'Admin' };
      const regularUser = { name: 'DeleteUser', email: 'delete-user@example.com', password: 'password123' };
      await request(app).post('/api/auth/register').send(adminUser);
      await request(app).post('/api/auth/register').send(regularUser);
      const adminLoginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
      const userLoginRes = await request(app).post('/api/auth/login').send({ email: regularUser.email, password: regularUser.password });
      adminToken = adminLoginRes.body.token;
      userToken = userLoginRes.body.token;
    });

    it('should allow an admin to delete a sweet', async () => {
      const sweetToDelete = await Sweet.create({ name: 'Deletable', category: 'Test', price: 1.00, quantity: 10 });
      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      const foundSweet = await Sweet.findById(sweetToDelete._id);
      expect(foundSweet).toBeNull();
    });

    it('should forbid a non-admin user from deleting', async () => {
      const sweetToDelete = await Sweet.create({ name: 'Protected', category: 'Test', price: 1.00, quantity: 10 });
      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(403);
    });

    it('should prevent an unauthenticated user from deleting', async () => {
        const sweetToDelete = await Sweet.create({ name: 'Protected', category: 'Test', price: 1.00, quantity: 10 });
        const response = await request(app)
          .delete(`/api/sweets/${sweetToDelete._id}`);

        expect(response.statusCode).toBe(401);
      });
  });
});