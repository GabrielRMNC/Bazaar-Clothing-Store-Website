// Extracted functions from App.js for testing
const initialClothes = [
  { id: 1, name: "T-Shirt", price: 20, category: "Men", brand: "Nike", description: "A comfortable cotton t-shirt." },
  { id: 2, name: "Jeans", price: 50, category: "Women", brand: "Levi's", description: "Classic blue denim jeans." },
  { id: 3, name: "Jacket", price: 100, category: "Unisex", brand: "Adidas", description: "Warm winter jacket." },
];

// Filter function (already in your code)
const filterByCategory = (items, categoryFilter) => {
  return items.filter((c) => c.category.toLowerCase().includes(categoryFilter.toLowerCase()));
};

// CRUD functions extracted from App.js
const handleAdd = (clothes, clothing) => {
  return [...clothes, { ...clothing, id: Date.now(), image: clothing.image || "https://via.placeholder.com/80?text=New+Item" }];
};

const handleUpdate = (clothes, updatedClothing) => {
  return clothes.map((c) => (c.id === updatedClothing.id ? updatedClothing : c));
};

const handleDelete = (clothes, id) => {
  return clothes.filter((c) => c.id !== id);
};

// Test Suite
describe('CRUD Operations Simple Tests', () => {
  // Existing Filter Tests
  describe('Category Filter Simple Tests', () => {
    test('returns all items when filter is empty', () => {
      const filtered = filterByCategory(initialClothes, '');
      expect(filtered).toHaveLength(3);
      expect(filtered).toEqual(initialClothes);
    });

    test('filters to only Women category', () => {
      const filtered = filterByCategory(initialClothes, 'Women');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Women');
      expect(filtered[0].name).toBe('Jeans');
    });

    test('filters to only Unisex category', () => {
      const filtered = filterByCategory(initialClothes, 'Unisex');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Unisex');
      expect(filtered[0].name).toBe('Jacket');
    });
  });

  // New CRUD Tests
  describe('Create (Add) Operation', () => {
    test('adds a new clothing item to the list', () => {
      const newClothing = {
        name: "Sneakers",
        price: 120,
        category: "Unisex",
        brand: "Nike",
        description: "Sporty and stylish sneakers.",
      };
      const updatedClothes = handleAdd(initialClothes, newClothing);
      expect(updatedClothes).toHaveLength(4);
      expect(updatedClothes[3].name).toBe("Sneakers");
      expect(updatedClothes[3].id).toBeDefined(); // Check that an ID was assigned
      expect(updatedClothes[3].image).toBe("https://via.placeholder.com/80?text=New+Item"); // Default image
    });

    test('adds a new clothing item with custom image', () => {
      const newClothing = {
        name: "Hat",
        price: 25,
        category: "Men",
        brand: "Adidas",
        description: "Cool summer hat.",
        image: "/images/hat.png",
      };
      const updatedClothes = handleAdd(initialClothes, newClothing);
      expect(updatedClothes).toHaveLength(4);
      expect(updatedClothes[3].image).toBe("/images/hat.png"); // Custom image preserved
    });
  });

  describe('Read (Filter/Sort) Operation', () => {
    test('sorts clothes by price correctly', () => {
      const sortedByPrice = [...initialClothes].sort((a, b) => (a.price > b.price ? 1 : -1));
      expect(sortedByPrice[0].name).toBe("T-Shirt"); // $20
      expect(sortedByPrice[1].name).toBe("Jeans");   // $50
      expect(sortedByPrice[2].name).toBe("Jacket");  // $100
    });

    test('sorts clothes by name correctly', () => {
      const sortedByName = [...initialClothes].sort((a, b) => (a.name > b.name ? 1 : -1));
      expect(sortedByName[0].name).toBe("Jacket");
      expect(sortedByName[1].name).toBe("Jeans");
      expect(sortedByName[2].name).toBe("T-Shirt");
    });
  });

  describe('Update Operation', () => {
    test('updates an existing clothing item', () => {
      const updatedClothing = { ...initialClothes[0], name: "Updated T-Shirt", price: 25 };
      const updatedClothes = handleUpdate(initialClothes, updatedClothing);
      expect(updatedClothes).toHaveLength(3);
      expect(updatedClothes[0].name).toBe("Updated T-Shirt");
      expect(updatedClothes[0].price).toBe(25);
      expect(updatedClothes[1]).toEqual(initialClothes[1]); // Other items unchanged
    });

    test('does not change list if ID does not exist', () => {
      const updatedClothing = { id: 999, name: "Non-existent", price: 10 };
      const updatedClothes = handleUpdate(initialClothes, updatedClothing);
      expect(updatedClothes).toHaveLength(3);
      expect(updatedClothes).toEqual(initialClothes); // No changes
    });
  });

  describe('Delete Operation', () => {
    test('deletes a clothing item by ID', () => {
      const updatedClothes = handleDelete(initialClothes, 2); // Delete Jeans
      expect(updatedClothes).toHaveLength(2);
      expect(updatedClothes.some(c => c.id === 2)).toBe(false);
      expect(updatedClothes[0].name).toBe("T-Shirt");
      expect(updatedClothes[1].name).toBe("Jacket");
    });

    test('does not change list if ID does not exist', () => {
      const updatedClothes = handleDelete(initialClothes, 999); // Non-existent ID
      expect(updatedClothes).toHaveLength(3);
      expect(updatedClothes).toEqual(initialClothes); // No changes
    });
  });
});