// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

export const clothingApi = {
    async getAllClothes(page = 1, limit = 8, category, brand, sort) {
        const params = new URLSearchParams({
            page,
            limit,
            ...(category && { category }),
            ...(brand && { brand }),
            ...(sort && { sort })
        });

        const response = await fetch(`${API_BASE_URL}/clothes?${params}`);
        return response.json();
    },

    async getClothingById(id) {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`);
        return response.json();
    },

    async createClothing(clothingData) {
        const response = await fetch(`${API_BASE_URL}/clothes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clothingData),
        });
        return response.json();
    },

    async updateClothing(id, clothingData) {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clothingData),
        });
        return response.json();
    },

    async deleteClothing(id) {
        const response = await fetch(`${API_BASE_URL}/clothes/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    }
};