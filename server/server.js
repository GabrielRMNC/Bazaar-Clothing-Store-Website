// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { body, validationResult, check } = require('express-validator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let clothes = [
    { id: 1, name: "T-Shirt", price: 20, category: "Men", brand: "Nike", description: "A comfortable cotton t-shirt.", image: "/images/M+NSW+TEE+CLUB+SSNL+HBR.png" },
    { id: 2, name: "Jeans", price: 50, category: "Women", brand: "Levi's", description: "Classic blue denim jeans.", image: "/images/STRAIGHT JEANS-1.jpeg" },
    { id: 3, name: "Jacket", price: 100, category: "Unisex", brand: "Adidas", description: "Warm winter jacket.", image: "/images/5e30194d5749450cacac3a4a6d4e6ea0.png" },
    { id: 8, name: "Sneakers", price: 120, category: "Unisex", brand: "Nike", description: "Sporty and stylish sneakers.", image: "/images/custom-nike-dunk-high-by-you-shoes.png" },
    { id: 18, name: "Raincoat", price: 70, category: "Unisex", brand: "North Face", description: "Waterproof and windproof coat.", image: "/images/Mens-Antora-Jacket.png" },
    { id: 9, name: "Cap", price: 15, category: "Men", brand: "New Era", description: "Classic baseball cap.", image: "/images/60624964_02254964_3_1000x.png" },
    { id: 10, name: "Socks", price: 10, category: "Unisex", brand: "Adidas", description: "Pack of 3 cotton socks.", image: "/images/aa6160142bc941b88cab8335dfc8017a.png" },
    { id: 15, name: "Gloves", price: 18, category: "Unisex", brand: "Columbia", description: "Winter gloves with insulation.", image: "/images/2010421_414_f_pu_presetPresentation_JPEG_72DPI_800x.png" },
    { id: 16, name: "Tank Top", price: 20, category: "Men", brand: "Reebok", description: "Light and breathable tank top.", image: "/images/reebok-reebok-graphic-series-vector-tank-top_19727733_45209773_2048.png" },
    { id: 17, name: "Boots", price: 140, category: "Women", brand: "Timberland", description: "Durable and stylish boots.", image: "/images/fcf1ca07a865497594169256b08225b2.png" },
    { id: 19, name: "Hoodie", price: 45, category: "Men", brand: "Puma", description: "Cozy fleece-lined hoodie.", image: "/images/19814214_1200_A.png" },
    { id: 20, name: "Leggings", price: 35, category: "Women", brand: "Lululemon", description: "Stretchy and comfortable leggings.", image: "/images/LW5CTCS_026956_1.png" },
    { id: 21, name: "Windbreaker", price: 60, category: "Unisex", brand: "Columbia", description: "Lightweight windbreaker jacket.", image: "/images/b9048cf43ec74acba4ec71085268db0c.png" },
    { id: 22, name: "Sweatpants", price: 40, category: "Men", brand: "Under Armour", description: "Relaxed fit jogger-style pants.", image: "/images/SSS2_UA1357128_001_194512218661_1.png" },
    { id: 23, name: "Skirt", price: 30, category: "Women", brand: "Zara", description: "Flowy mid-length skirt.", image: "/images/02402701809-e2.jpg" },
    { id: 24, name: "Blazer", price: 90, category: "Women", brand: "H&M", description: "Formal wear blazer.", image: "/images/0adf01fec03ce7a257b78c1d6b267a84ee164ae8.png" },
    { id: 25, name: "Cargo Pants", price: 55, category: "Men", brand: "Carhartt", description: "Durable utility cargo pants.", image: "/images/showimage_860c6fae-ec4a-46c9-b753-86e9f02c6961.png" },
    { id: 26, name: "Denim Jacket", price: 80, category: "Unisex", brand: "Levi's", description: "Classic blue denim jacket.", image: "/images/163650044-front-pdp.png" },
    { id: 27, name: "Puffer Vest", price: 65, category: "Unisex", brand: "Uniqlo", description: "Ultra-light down puffer vest.", image: "/images/goods_461275_sub14_3x4.png" },
    { id: 28, name: "Graphic Tee", price: 25, category: "Unisex", brand: "H&M", description: "Printed cotton graphic t-shirt.", image: "/images/d2d8e0ed702fb2b8b5899a7a58c6912629349954.png" },
    { id: 29, name: "Dress", price: 75, category: "Women", brand: "Mango", description: "Elegant evening dress.", image: "/images/77040361_05.png" },
    { id: 30, name: "Overalls", price: 60, category: "Women", brand: "Urban Outfitters", description: "Casual denim overalls.", image: "/images/77127256_040_b1.png" },
    { id: 31, name: "Running Shorts", price: 25, category: "Men", brand: "Nike", description: "Lightweight running shorts.", image: "/images/M+NK+DF+CHALLENGER+7BF+SHORT.png" },
    { id: 32, name: "Sports Bra", price: 35, category: "Women", brand: "Adidas", description: "Supportive sports bra for workouts.", image: "/images/Adidas-TLRDRCT-HIGH-SUPPORT-BRA-WHITE-IT6682-0002.png" },
    { id: 33, name: "Long Sleeve Shirt", price: 28, category: "Men", brand: "Gap", description: "Soft cotton long sleeve tee.", image: "/images/cn55593764.png" },
    { id: 34, name: "Pajama Set", price: 38, category: "Unisex", brand: "Uniqlo", description: "Comfortable two-piece sleepwear.", image: "/images/goods_458966_sub14_3x4.png" },
    { id: 35, name: "Cardigan", price: 55, category: "Women", brand: "Banana Republic", description: "Knit button-down cardigan.", image: "/images/cn56660999.png" },
    { id: 36, name: "Tracksuit", price: 100, category: "Men", brand: "Adidas", description: "Matching jacket and pants set.", image: "/images/jd_719804_a.png" },
    { id: 37, name: "Sandals", price: 45, category: "Unisex", brand: "Birkenstock", description: "Comfortable slip-on sandals.", image: "/images/15814764_29518984_600.png" },
    { id: 38, name: "Scarf", price: 22, category: "Women", brand: "Zara", description: "Warm woven winter scarf.", image: "/images/03920001707-p.png" }
];

// Server-side validation
const validateClothing = [
    body('name').isString().notEmpty(),
    body('price').isNumeric().isFloat({ min: 0 }),
    body('category').isString().notEmpty(),
    body('brand').isString().notEmpty(),
    body('description').isString().notEmpty(),

];

// GET: All clothes with optional filter and sort
app.get('/api/clothes', (req, res) => {
    let result = [...clothes];

    if (req.query.category) {
        result = result.filter(c => c.category.toLowerCase().includes(req.query.category.toLowerCase()));
    }

    if (req.query.brand) {
        result = result.filter(c => c.brand.toLowerCase().includes(req.query.brand.toLowerCase()));
    }

    if (req.query.sort) {
        const sortKey = req.query.sort;
        result.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            return typeof valA === 'string'
                ? valA.localeCompare(valB)
                : valA - valB;
        });
    }

    res.json(result);
});

// POST: Add new clothing item
app.post('/api/clothes', validateClothing, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const newItem = { ...req.body, id: Date.now() };
    clothes.push(newItem);
    io.emit('clothingAdded', newItem);
    res.status(201).json(newItem);
});

// PATCH: Update clothing item partially
app.patch('/api/clothes/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = clothes.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    clothes[index] = { ...clothes[index], ...req.body };
    io.emit('clothingUpdated', clothes[index]);
    res.json(clothes[index]);
});

// PUT: Replace clothing item (with validation)
app.put('/api/clothes/:id', validateClothing, (req, res) => {
    const id = Number(req.params.id);
    const index = clothes.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    clothes[index] = { ...req.body, id };
    io.emit('clothingUpdated', clothes[index]);
    res.json(clothes[index]);
});

// DELETE: Remove clothing item
app.delete('/api/clothes/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = clothes.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    const deleted = clothes.splice(index, 1)[0];
    io.emit('clothingDeleted', id);
    res.json(deleted);
});

// Socket.IO connection logging
io.on('connection', (socket) => {
    console.log('- New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log(' Client disconnected:', socket.id);
    });
});

//  Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = 3001;
    server.listen(PORT, () => {
        console.log(` Server listening on port ${PORT}`);
    });
}

//  Export app for unit testing
module.exports = app;
