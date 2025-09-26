const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Sweet = require('../models/Sweet');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

/* Top-level Test Setup */
beforeAll(async () => {
  // 1. Connect to the database first.
  await mongoose.connect(process.env.MONGO_URI);
  // 2. Then, clean the User collection to ensure a fresh start.
  await User.deleteMany({});
});

/* Disconnect from the database after all tests in this file are done. */
afterAll(async () => {
  await mongoose.connection.close();
});

/* Main Test Suite */
describe('Sweets API', () => {
  // Clean sweets after each individual test to ensure isolation
  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  // --- Public Routes ---
  describe('Public Endpoints', () => {
    it('GET /api/sweets --> should return an array of sweets', async () => {
      await Sweet.create([{ name: 'Gummy Bear', quantity: 100, price: 1.5, category: 'Gummy' }]);
      const response = await request(app).get('/api/sweets');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it('PATCH /api/sweets/:id/purchase --> should decrease the quantity', async () => {
      const sweet = await Sweet.create({ name: 'Purchasable', quantity: 20, price: 1, category: 'Test' });
      const response = await request(app)
        .patch(`/api/sweets/${sweet._id}/purchase`)
        .send({ quantity: 5 });

      expect(response.statusCode).toBe(200);
      expect(response.body.quantity).toBe(15);
    });

    it('PATCH /api/sweets/:id/purchase --> should return 400 for insufficient stock', async () => {
      const sweet = await Sweet.create({ name: 'Limited Stock', quantity: 2, price: 1, category: 'Test' });
      const response = await request(app)
        .patch(`/api/sweets/${sweet._id}/purchase`)
        .send({ quantity: 5 });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe('Not enough stock available for this purchase.');
    });
  });

  // --- Admin & Protected Routes ---
  describe('Admin & Protected Endpoints', () => {
    let adminToken;
    let userToken;

    // Runs ONCE before all tests in this describe block
    beforeAll(async () => {
      // Create all users needed for the protected tests
      const adminUser = { name: 'MainAdmin', email: 'main-admin@example.com', password: 'password123', role: 'Admin' };
      const regularUser = { name: 'MainUser', email: 'main-user@example.com', password: 'password123' };

      await request(app).post('/api/auth/register').send(adminUser);
      await request(app).post('/api/auth/register').send(regularUser);

      const adminLoginRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
      const userLoginRes = await request(app).post('/api/auth/login').send({ email: regularUser.email, password: regularUser.password });

      adminToken = adminLoginRes.body.token;
      userToken = userLoginRes.body.token;
    });

    it('POST /api/sweets --> should allow an admin to create a sweet', async () => {
      const newSweet = { name: 'Admin Chocolate', category: 'Chocolate', price: 2.99, quantity: 50 };
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSweet);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(newSweet.name);
    });

    it('PUT /api/sweets/:id --> should allow an admin to update a sweet', async () => {
      const sweetToUpdate = await Sweet.create({ name: 'Original', category: 'Test', price: 1.00, quantity: 10 });
      const updatedData = { name: 'Updated Sweet', price: 1.25 };

      const response = await request(app)
        .put(`/api/sweets/${sweetToUpdate._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Updated Sweet');
    });

    it('DELETE /api/sweets/:id --> should allow an admin to delete a sweet', async () => {
      const sweetToDelete = await Sweet.create({ name: 'Deletable', category: 'Test', price: 1.00, quantity: 10 });
      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      const foundSweet = await Sweet.findById(sweetToDelete._id);
      expect(foundSweet).toBeNull();
    });

    it('PATCH /api/sweets/:id/restock --> should allow an admin to restock a sweet', async () => {
      const sweetToRestock = await Sweet.create({ name: 'Restockable', quantity: 10, price: 1, category: 'Test' });
      const response = await request(app)
        .patch(`/api/sweets/${sweetToRestock._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.statusCode).toBe(200);
      expect(response.body.quantity).toBe(60);
    });

    it('DELETE /api/sweets/:id --> should forbid a non-admin user from deleting', async () => {
      const sweetToDelete = await Sweet.create({ name: 'Protected', category: 'Test', price: 1.00, quantity: 10 });
      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(403);
    });
  });
});