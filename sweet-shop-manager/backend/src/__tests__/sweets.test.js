// C:/Users/prita/PycharmProjects/SweetShop/sweet-shop-manager/backend/src/__tests__/sweets.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Sweet = require('../models/Sweet');
const dotenv = require('dotenv');

dotenv.config();

/* Connect to the database before running any tests. */
beforeAll(async () => {
  // It's good practice to use a separate test database.
  // For now, we'll connect to the main DB and clean up.
  await mongoose.connect(process.env.MONGO_URI);
});

/* Clear all test data after every test to ensure isolation. */
afterEach(async () => {
  await Sweet.deleteMany({});
});

/* Disconnect from the database after all tests are done. */
afterAll(async () => {
  await mongoose.connection.close();
});


describe('Sweets API', () => {

  // Test for GET /api/sweets
  it('GET /api/sweets --> should return an array of sweets', async () => {
    await Sweet.create([
        { name: 'Gummy Bear', category: 'Gummy', price: 1.50, quantity: 100 },
        { name: 'Lollipop', category: 'Hard Candy', price: 0.75, quantity: 200 }
    ]);

    const response = await request(app).get('/api/sweets');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Gummy Bear');
  });

  // ... (rest of your tests for POST, GET /search)

  // --- Tests for PUT /api/sweets/:id ---
  // (Make sure you have only ONE of these describe blocks)
  describe('PUT /api/sweets/:id', () => {
    let sweetToUpdate;

    beforeEach(async () => {
      sweetToUpdate = await Sweet.create({
        name: 'Original Gummy',
        category: 'Gummy',
        price: 1.00,
        quantity: 100
      });
    });

    it('should update an existing sweet and return it', async () => {
      const updatedData = {
        name: 'Updated Gummy Bear',
        price: 1.25,
        quantity: 90
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetToUpdate._id}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.price).toBe(updatedData.price);
    });

    it('should return 404 if the sweet to update is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${nonExistentId}`)
        .send({ name: 'Wont work' });

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for an invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id')
        .send({ name: 'Wont work' });

      expect(response.statusCode).toBe(400);
    });
  });
});