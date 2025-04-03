import React, { useState, useEffect } from "react";
import "./App.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker'; // Import Faker

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const initialClothes = [
    { id: 1, name: "T-Shirt", price: 20, category: "Men", brand: "Nike", description: "A comfortable cotton t-shirt.", image: "/images/M+NSW+TEE+CLUB+SSNL+HBR.png" },
    { id: 2, name: "Jeans", price: 50, category: "Women", brand: "Levi's", description: "Classic blue denim jeans.", image: "/images/STRAIGHT JEANS-1.jpeg" },
    { id: 3, name: "Jacket", price: 100, category: "Unisex", brand: "Adidas", description: "Warm winter jacket.", image: "/images/5e30194d5749450cacac3a4a6d4e6ea0.png" },
    { id: 8, name: "Sneakers", price: 120, category: "Unisex", brand: "Nike", description: "Sporty and stylish sneakers.", image:"/images/custom-nike-dunk-high-by-you-shoes.png" },
    { id: 18, name: "Raincoat", price: 70, category: "Unisex", brand: "North Face", description: "Waterproof and windproof coat.", image: "/images/Mens-Antora-Jacket.png" },
    { id: 9, name: "Cap", price: 15, category: "Men", brand: "New Era", description: "Classic baseball cap.", image: "/images/60624964_02254964_3_1000x.png" },
    { id: 10, name: "Socks", price: 10, category: "Unisex", brand: "Adidas", description: "Pack of 3 cotton socks.", image: "/images/aa6160142bc941b88cab8335dfc8017a.png" },
    { id: 15, name: "Gloves", price: 18, category: "Unisex", brand: "Columbia", description: "Winter gloves with insulation.", image:"/images/2010421_414_f_pu_presetPresentation_JPEG_72DPI_800x.png"},
    { id: 16, name: "Tank Top", price: 20, category: "Men", brand: "Reebok", description: "Light and breathable tank top.", image: "/images/reebok-reebok-graphic-series-vector-tank-top_19727733_45209773_2048.png" },
    { id: 17, name: "Boots", price: 140, category: "Women", brand: "Timberland", description: "Durable and stylish boots.", image:"/images/fcf1ca07a865497594169256b08225b2.png" }
];

function App() {
    const [clothes, setClothes] = useState(initialClothes);
    const [selectedClothing, setSelectedClothing] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    const [chartData, setChartData] = useState({
        priceDistribution: { labels: [], datasets: [] },
        categoryCount: { labels: [], datasets: [] },
        brandDistribution: { labels: [], datasets: [] }
    });

    // Function to generate a random clothing item
    const generateRandomClothing = () => {
        const categories = ["Men", "Women", "Unisex"];
        const brands = ["Nike", "Levi's", "Adidas", "North Face", "New Era", "Columbia", "Reebok", "Timberland"];
        const clothingTypes = ["Shirt", "Pants", "Jacket", "Shoes", "Hat", "Socks", "Gloves", "Top", "Boots"];

        return {
            id: Date.now() + Math.random(), // Ensure unique ID
            name: `${faker.word.adjective()} ${clothingTypes[Math.floor(Math.random() * clothingTypes.length)]}`,
            price: faker.number.int({ min: 10, max: 200 }),
            category: categories[Math.floor(Math.random() * categories.length)],
            brand: brands[Math.floor(Math.random() * brands.length)],
            description: faker.lorem.sentence(),
            image: `https://via.placeholder.com/360?text=${encodeURIComponent(faker.commerce.productName())}`
        };
    };

    // Function to add multiple random items
    const handleGenerateRandom = () => {
        const numberOfItems = faker.number.int({ min: 1, max: 3 }); // Generate 1-5 items
        const newItems = Array.from({ length: numberOfItems }, generateRandomClothing);
        setClothes(prevClothes => [...prevClothes, ...newItems]);
    };

    const handleAdd = (clothing) => {
        const newClothes = [...clothes, { ...clothing, id: Date.now(), image: clothing.image || "https://via.placeholder.com/80?text=New+Item" }];
        setClothes(newClothes);
    };

    const handleUpdate = (updatedClothing) => {
        const newClothes = clothes.map((c) => (c.id === updatedClothing.id ? updatedClothing : c));
        setClothes(newClothes);
        setSelectedClothing(null);
    };

    const handleDelete = (id) => {
        const newClothes = clothes.filter((c) => c.id !== id);
        setClothes(newClothes);
    };

    const sortedClothes = [...clothes]
        .filter((c) => c.category.toLowerCase().includes(categoryFilter.toLowerCase()))
        .filter((c) => c.brand.toLowerCase().includes(brandFilter.toLowerCase()))
        .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClothes = sortedClothes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedClothes.length / itemsPerPage);

    useEffect(() => {
        const updateCharts = async () => {
            try {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 100));

                const prices = sortedClothes.map(c => c.price);
                const categories = sortedClothes.reduce((acc, c) => {
                    acc[c.category] = (acc[c.category] || 0) + 1;
                    return acc;
                }, {});
                const brands = sortedClothes.reduce((acc, c) => {
                    acc[c.brand] = (acc[c.brand] || 0) + 1;
                    return acc;
                }, {});

                setChartData({
                    priceDistribution: {
                        labels: ['0-50', '51-100', '100+'],
                        datasets: [{
                            label: 'Price Distribution',
                            data: [
                                prices.filter(price => price <= 50).length,
                                prices.filter(price => price > 50 && price <= 100).length,
                                prices.filter(price => price > 100).length
                            ],
                            backgroundColor: ['#000000', '#3c3a3a', '#7e7878']
                        }]
                    },
                    categoryCount: {
                        labels: Object.keys(categories),
                        datasets: [{
                            data: Object.values(categories),
                            backgroundColor: ['#000000', '#3c3a3a', '#7e7878', '#4BC0C0', '#9966FF']
                        }]
                    },
                    brandDistribution: {
                        labels: Object.keys(brands),
                        datasets: [{
                            label: 'Items by Brand',
                            data: Object.values(brands),
                            backgroundColor: '#3c3a3a'
                        }]
                    }
                });
            } catch (error) {
                console.error('Error updating charts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        updateCharts();
    }, [clothes, categoryFilter, brandFilter]);

    const stats = {
        maxPrice: sortedClothes.length ? Math.max(...sortedClothes.map(c => c.price)) : 0,
        minPrice: sortedClothes.length ? Math.min(...sortedClothes.map(c => c.price)) : 0,
        avgPrice: sortedClothes.length ? sortedClothes.reduce((a, b) => a + b.price, 0) / sortedClothes.length : 0
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="header">🛍 Bazaar</div>
            <div className="container">
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Filter by category..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by brand..."
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                    />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                    </select>
                </div>

                {/* Add the Generate Random button here */}
                <div className="controls">
                    <button onClick={handleGenerateRandom} className="generate-random">
                        Generate Item
                    </button>
                </div>

                <ClothingList
                    clothes={currentClothes}
                    onEdit={setSelectedClothing}
                    onDelete={handleDelete}
                    stats={stats}
                />

                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <ClothingForm
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    selectedClothing={selectedClothing}
                />

                {isLoading ? (
                    <div>Loading charts...</div>
                ) : (
                    <div className="charts-container">
                        <div className="chart">
                            <h3>Price Distribution</h3>
                            <Bar data={chartData.priceDistribution} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                        <div className="chart">
                            <h3>Items by Category</h3>
                            <Pie data={chartData.categoryCount} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                        <div className="chart">
                            <h3>Brand Distribution</h3>
                            <Bar data={chartData.brandDistribution} options={{ maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </div>
                )}
            </div>
            <div className="footer">© 2025 Bazaar</div>
        </div>
    );
}

function ClothingList({ clothes, onEdit, onDelete, stats }) {
    return (
        <ul className="clothing-list">
            {clothes.map((c) => {
                const diffFromAvg = Math.abs(c.price - stats.avgPrice);
                return (
                    <li key={c.id} className="clothing-item">
                        <img src={c.image} alt={c.name} />
                        <div className="clothing-details">
                            <span>
                                {c.name} - <strong>${c.price}</strong> ({c.category})
                                {c.price === stats.maxPrice && <span className="price-label most-expensive"> (Most Expensive)</span>}
                                {c.price === stats.minPrice && <span className="price-label least-expensive"> (Least Expensive)</span>}
                                {Math.abs(c.price - stats.avgPrice) < 10 && c.price !== stats.maxPrice && c.price !== stats.minPrice && (
                                    <span className="price-label average-priced"> (Near Average)</span>
                                )}
                            </span>
                            <br /><small>Brand: {c.brand} | {c.description}</small>
                        </div>
                        <div className="buttons">
                            <button className="edit" onClick={() => onEdit(c)}>✏️ Edit</button>
                            <button className="delete" onClick={() => onDelete(c.id)}>🗑️ Delete</button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function ClothingForm({ onAdd, onUpdate, selectedClothing }) {
    const [form, setForm] = useState(selectedClothing || { name: "", price: "", category: "", brand: "", description: "", image: "" });

    React.useEffect(() => {
        setForm(selectedClothing || { name: "", price: "", category: "", brand: "", description: "", image: "" });
    }, [selectedClothing]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.category || !form.brand || !form.description) return;
        const clothingData = { ...form, price: Number(form.price) };
        form.id ? onUpdate(clothingData) : onAdd(clothingData);
        setForm({ name: "", price: "", category: "", brand: "", description: "", image: "" });
    };

    return (
        <form className="clothing-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Clothing Name" value={form.name} onChange={handleChange} required />
            <input name="price" type="number" placeholder="Price ($)" value={form.price} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <button className="submit" type="submit">{form.id ? "Update" : "Add"}</button>
        </form>
    );
}

export default App;