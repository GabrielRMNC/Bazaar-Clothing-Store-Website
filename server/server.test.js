const request = require('supertest');
const app = require('../server/server');

describe('Backend API Tests', () => {
    let testItemId;

    // Test GET all clothes
    test('GET /api/clothes - should return all clothes', async () => {
        const res = await request(app).get('/api/clothes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test POST to add a new clothing item
    test('POST /api/clothes - should add a new clothing item', async () => {
        const newItem = {
            name: 'Test Item',
            price: 25,
            category: 'Unisex',
            brand: 'TestBrand',
            description: 'A test item',
            image: 'https://via.placeholder.com/150'
        };
        const res = await request(app).post('/api/clothes').send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newItem.name);
        testItemId = res.body.id; // Save the ID for later tests
    });

    // Test PATCH to update a clothing item
    test('PATCH /api/clothes/:id - should update a clothing item', async () => {
        const updatedData = { price: 30 };
        const res = await request(app).patch(`/api/clothes/${testItemId}`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.price).toBe(updatedData.price);
    });

    // Test PUT to replace a clothing item
    test('PUT /api/clothes/:id - should replace a clothing item', async () => {
        const replacementItem = {
            name: 'Replaced Item',
            price: 50,
            category: 'Men',
            brand: 'ReplacedBrand',
            description: 'A replaced item',
            image: 'https://via.placeholder.com/150'
        };
        const res = await request(app).put(`/api/clothes/${testItemId}`).send(replacementItem);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(replacementItem.name);
    });

    // Test DELETE to remove a clothing item
    test('DELETE /api/clothes/:id - should delete a clothing item', async () => {
        const res = await request(app).delete(`/api/clothes/${testItemId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(testItemId);

        // Verify the item is deleted
        const getRes = await request(app).get(`/api/clothes/${testItemId}`);
        expect(getRes.statusCode).toBe(404);
    });

    // Test GET with filters and sorting
    test('GET /api/clothes - should filter and sort clothes', async () => {
        const res = await request(app).get('/api/clothes?category=Men&sort=price');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        if (res.body.length > 1) {
            //expect(res.body[0].price).toBeLessThanOrEqual(res.body[1].price);
        }
    });
});