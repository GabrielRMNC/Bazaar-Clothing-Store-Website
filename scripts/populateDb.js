// scripts/populateDb.js
const { ClothingItem, Category, Brand } = require('../models/associations');
const sequelize = require('../config/database');

const initialData = [
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

async function populateDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        await sequelize.sync({ force: true }); // This will drop existing tables
        console.log('Database synchronized.');

        // Create unique categories and brands
        const categories = [...new Set(initialData.map(item => item.category))];
        const brands = [...new Set(initialData.map(item => item.brand))];

        // Insert categories
        const categoryInstances = await Promise.all(
            categories.map(name => Category.create({ name }))
        );
        console.log(`Created ${categories.length} categories.`);

        // Insert brands
        const brandInstances = await Promise.all(
            brands.map(name => Brand.create({ name }))
        );
        console.log(`Created ${brands.length} brands.`);

        // Create category and brand lookup maps
        const categoryMap = Object.fromEntries(
            categoryInstances.map(cat => [cat.name, cat.id])
        );
        const brandMap = Object.fromEntries(
            brandInstances.map(brand => [brand.name, brand.id])
        );

        // Insert clothing items
        const clothingItems = await Promise.all(
            initialData.map(item =>
                ClothingItem.create({
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    image: item.image,
                    CategoryId: categoryMap[item.category],
                    BrandId: brandMap[item.brand]
                })
            )
        );
        console.log(`Created ${clothingItems.length} clothing items.`);

        console.log('Database population completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error populating database:', error);
        process.exit(1);
    }
}

populateDatabase();