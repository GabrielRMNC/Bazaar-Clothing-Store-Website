import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./App.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { io } from "socket.io-client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AboutUs() {
    const navigate = useNavigate();
    return (
        <div className="container about-us">
            <h1>About Bazaar</h1>
            <p>Welcome to Bazaar, your one-stop shop for stylish and affordable clothing!</p>
            <h2>Our Story</h2>
            <p>2025 MPP Project - Romanica Gabriel</p>
            <h2>Contact Us</h2>
            <p>Email: romanicagabrielmail@gmail.com</p>
            <p>Phone: 0741 051 301</p>
            <p>Address: Cluj-Napoca</p>
            <button onClick={() => navigate('/')} className="back-home">Back to Home</button>
        </div>
    );
}

function App() {
    const [clothes, setClothes] = useState([]);
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

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("connect", () => {
            console.log("Connected to server via socket:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/clothes');
                setClothes(res.data);
            } catch (err) {
                console.error("Error loading clothes:", err);
            }
        };
        fetchClothes();
    }, []);

    const handleAdd = async (clothing) => {
        try {
            const res = await axios.post('http://localhost:3001/api/clothes', clothing);
            setClothes(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Error adding clothing:", err);
        }
    };

    const handleUpdate = async (updatedClothing) => {
        try {
            await axios.put(`http://localhost:3001/api/clothes/${updatedClothing.id}`, updatedClothing);
            setClothes(prev => prev.map(c => (c.id === updatedClothing.id ? updatedClothing : c)));
            setSelectedClothing(null);
        } catch (err) {
            console.error("Error updating clothing:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/clothes/${id}`);
            setClothes(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("Error deleting clothing:", err);
        }
    };

    const generateRandomClothing = () => {
        const categories = ["Men", "Women", "Unisex"];
        const brands = ["Nike", "Levi's", "Adidas", "North Face", "New Era", "Columbia", "Reebok", "Timberland"];
        const clothingTypes = ["Shirt", "Pants", "Jacket", "Shoes", "Hat", "Socks", "Gloves", "Top", "Boots"];
        return {
            name: `${faker.word.adjective()} ${clothingTypes[Math.floor(Math.random() * clothingTypes.length)]}`,
            price: faker.number.int({ min: 10, max: 200 }),
            category: categories[Math.floor(Math.random() * categories.length)],
            brand: brands[Math.floor(Math.random() * brands.length)],
            description: faker.lorem.sentence(),
            image: `https://via.placeholder.com/360?text=${encodeURIComponent(faker.commerce.productName())}`
        };
    };

    const handleGenerateRandom = async () => {
        const numberOfItems = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numberOfItems; i++) {
            await handleAdd(generateRandomClothing());
        }
    };

    const filteredSortedClothes = clothes
        .filter(c => c.category.toLowerCase().includes(categoryFilter.toLowerCase()))
        .filter(c => c.brand.toLowerCase().includes(brandFilter.toLowerCase()))
        .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClothes = filteredSortedClothes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSortedClothes.length / itemsPerPage);

    useEffect(() => {
        const updateCharts = async () => {
            try {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 100));
                const prices = filteredSortedClothes.map(c => c.price);
                const categories = filteredSortedClothes.reduce((acc, c) => {
                    acc[c.category] = (acc[c.category] || 0) + 1;
                    return acc;
                }, {});
                const brands = filteredSortedClothes.reduce((acc, c) => {
                    acc[c.brand] = (acc[c.brand] || 0) + 1;
                    return acc;
                }, {});
                setChartData({
                    priceDistribution: {
                        labels: ['0-50', '51-100', '100+'],
                        datasets: [{
                            label: 'Price Distribution',
                            data: [
                                prices.filter(p => p <= 50).length,
                                prices.filter(p => p > 50 && p <= 100).length,
                                prices.filter(p => p > 100).length
                            ],
                            backgroundColor: ['#000', '#555', '#999']
                        }]
                    },
                    categoryCount: {
                        labels: Object.keys(categories),
                        datasets: [{
                            data: Object.values(categories),
                            backgroundColor: ['#000', '#555', '#999', '#4BC0C0', '#9966FF']
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
            } catch (err) {
                console.error("Error updating charts:", err);
            } finally {
                setIsLoading(false);
            }
        };
        updateCharts();
    }, [clothes, categoryFilter, brandFilter]);

    const stats = {
        maxPrice: filteredSortedClothes.length ? Math.max(...filteredSortedClothes.map(c => c.price)) : 0,
        minPrice: filteredSortedClothes.length ? Math.min(...filteredSortedClothes.map(c => c.price)) : 0,
        avgPrice: filteredSortedClothes.length
            ? filteredSortedClothes.reduce((sum, c) => sum + c.price, 0) / filteredSortedClothes.length
            : 0
    };

    return (
        <Router>
            <div>
                <div className="header">
                    <Link to="/" className="home-link">🛍 Bazaar</Link>
                    <Link to="/about" className="about-button">About Us</Link>
                </div>
                <Routes>
                    <Route path="/" element={
                        <div className="container">
                            <div className="controls">
                                <input type="text" placeholder="Filter by category..." value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
                                <input type="text" placeholder="Filter by brand..." value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} />
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="name">Sort by Name</option>
                                    <option value="price">Sort by Price</option>
                                </select>
                            </div>
                            <div className="controls">
                                <button onClick={handleGenerateRandom} className="generate-random">Generate Item</button>
                            </div>
                            <ClothingList clothes={currentClothes} onEdit={setSelectedClothing} onDelete={handleDelete} stats={stats} />
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>{i + 1}</button>
                                ))}
                            </div>
                            <ClothingForm onAdd={handleAdd} onUpdate={handleUpdate} selectedClothing={selectedClothing} />
                            {isLoading ? <div>Loading charts...</div> : (
                                <div className="charts-container">
                                    <div className="chart">
                                        <h3>Price Distribution</h3>
                                        <Bar data={chartData.priceDistribution} options={{ responsive: true }} />
                                    </div>
                                    <div className="chart">
                                        <h3>Items by Category</h3>
                                        <Pie data={chartData.categoryCount} options={{ responsive: true }} />
                                    </div>
                                    <div className="chart">
                                        <h3>Brand Distribution</h3>
                                        <Bar data={chartData.brandDistribution} options={{ responsive: true }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    } />
                    <Route path="/about" element={<AboutUs />} />
                </Routes>
                <div className="footer">© 2025 Bazaar</div>
            </div>
        </Router>
    );
}

function ClothingList({ clothes, onEdit, onDelete, stats }) {
    return (
        <ul className="clothing-list">
            {clothes.map(c => (
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
            ))}
        </ul>
    );
}

function ClothingForm({ onAdd, onUpdate, selectedClothing }) {
    const [form, setForm] = useState({ name: "", price: "", category: "", brand: "", description: "", image: "" });

    useEffect(() => {
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
