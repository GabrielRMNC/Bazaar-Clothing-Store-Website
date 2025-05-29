// src/App.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import "./App.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { clothingApi } from './services/api';

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
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [serverDown, setServerDown] = useState(false);
    const observer = useRef();



    const [chartData, setChartData] = useState({
        priceDistribution: { labels: [], datasets: [] },
        categoryCount: { labels: [], datasets: [] },
        brandDistribution: { labels: [], datasets: [] }
    });

    // Check server status periodically
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const response = await clothingApi.getAllClothes(1, 1);
                setServerDown(false);
            } catch (err) {
                setServerDown(true);
            }
        };
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch clothes with infinite scroll
    const fetchClothes = async () => {
        if (!hasMore || isLoading || serverDown) return;
        try {
            setIsLoading(true);
            const data = await clothingApi.getAllClothes(
                currentPage,
                8,
                categoryFilter,
                brandFilter,
                sortBy
            );
            setClothes(prevClothes => [...prevClothes, ...data.items]);
            setHasMore(data.currentPage < data.totalPages);
            setCurrentPage(prev => prev + 1);
        } catch (error) {
            console.error('Failed to fetch clothes:', error);
            setServerDown(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset when filters change
    useEffect(() => {
        setCurrentPage(1);
        setClothes([]);
        setHasMore(true);
    }, [categoryFilter, brandFilter, sortBy]);

    // Load more when page changes
    useEffect(() => {
        if (hasMore && !isLoading) {
            fetchClothes();
        }
    }, [currentPage, categoryFilter, brandFilter, sortBy]);

    const handleAdd = async (clothing) => {
        if (serverDown) return;
        try {
            const newItem = await clothingApi.createClothing(clothing);
            setClothes(prev => [...prev, newItem]);
            updateCharts([...clothes, newItem]);
        } catch (error) {
            console.error("Error adding clothing:", error);
            setServerDown(true);
        }
    };

    const handleUpdate = async (updatedClothing) => {
        if (serverDown) return;
        try {
            const updated = await clothingApi.updateClothing(updatedClothing.id, updatedClothing);
            setClothes(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSelectedClothing(null);
            updateCharts(clothes.map(c => c.id === updated.id ? updated : c));
        } catch (error) {
            console.error("Error updating clothing:", error);
            setServerDown(true);
        }
    };

    const handleDelete = async (id) => {
        if (serverDown) return;
        try {
            await clothingApi.deleteClothing(id);
            setClothes(prev => prev.filter(c => c.id !== id));
            updateCharts(clothes.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting clothing:", error);
            setServerDown(true);
        }
    };

    const generateRandomClothing = () => {
        const categories = ["Men", "Women", "Unisex"];
        const brands = ["Nike", "Levi's", "Adidas", "North Face", "New Era"];
        const clothingTypes = ["Shirt", "Pants", "Jacket", "Shoes", "Hat"];
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
        if (serverDown) return;
        const numberOfItems = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numberOfItems; i++) {
            await handleAdd(generateRandomClothing());
        }
    };

    const lastClothingElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchClothes();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    const updateCharts = (data) => {
        const prices = data.map(c => c.price);
        const categories = data.reduce((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {});
        const brands = data.reduce((acc, c) => {
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
    };

    const stats = {
        maxPrice: clothes.length ? Math.max(...clothes.map(c => c.price)) : 0,
        minPrice: clothes.length ? Math.min(...clothes.map(c => c.price)) : 0,
        avgPrice: clothes.length ? clothes.reduce((sum, c) => sum + c.price, 0) / clothes.length : 0
    };

    // Rest of the component remains the same
    return (
        <Router>
            <div>
                <div className="header">
                    <Link to="/" className="home-link">🛍 Bazaar</Link>
                    <Link to="/about" className="about-button">About Us</Link>
                    <span className={`server-status ${serverDown ? 'down' : 'up'}`}>
                        Server: {serverDown ? 'Down' : 'Up'}
                    </span>
                </div>
                <Routes>
                    <Route path="/" element={
                        <div className="container">
                            {serverDown && (
                                <div className="server-down-message">
                                    The server is currently down. Please try again later.
                                </div>
                            )}
                            <div className="controls">
                                <input type="text" placeholder="Filter by category..." value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} disabled={serverDown} />
                                <input type="text" placeholder="Filter by brand..." value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} disabled={serverDown} />
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} disabled={serverDown}>
                                    <option value="name">Sort by Name</option>
                                    <option value="price">Sort by Price</option>
                                </select>
                            </div>
                            <div className="controls">
                                <button onClick={handleGenerateRandom} className="generate-random" disabled={serverDown}>Generate Item</button>
                            </div>
                            <ClothingList
                                clothes={clothes}
                                onEdit={setSelectedClothing}
                                onDelete={handleDelete}
                                stats={stats}
                                lastClothingElementRef={lastClothingElementRef}
                                serverDown={serverDown}
                            />
                            {isLoading && !serverDown && <div>Loading more items...</div>}
                            {!hasMore && clothes.length > 0 && !serverDown && <div>No more items to load.</div>}
                            <ClothingForm onAdd={handleAdd} onUpdate={handleUpdate} selectedClothing={selectedClothing} disabled={serverDown} />
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
                        </div>
                    } />
                    <Route path="/about" element={<AboutUs />} />
                </Routes>
                <div className="footer">© 2025 Bazaar</div>
            </div>
        </Router>
    );
}

function ClothingList({ clothes, onEdit, onDelete, stats, lastClothingElementRef, serverDown }) {
    return (
        <ul className="clothing-list">
            {clothes.map((c, index) => {
                const isLastElement = clothes.length === index + 1;
                return (
                    <li
                        key={c.id}
                        className="clothing-item"
                        ref={isLastElement ? lastClothingElementRef : null}
                    >
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
                            <button className="edit" onClick={() => onEdit(c)} disabled={serverDown}>✏️ Edit</button>
                            <button className="delete" onClick={() => onDelete(c.id)} disabled={serverDown}>🗑️ Delete</button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function ClothingForm({ onAdd, onUpdate, selectedClothing, disabled }) {
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
            <input name="name" placeholder="Clothing Name" value={form.name} onChange={handleChange} required disabled={disabled} />
            <input name="price" type="number" placeholder="Price ($)" value={form.price} onChange={handleChange} required disabled={disabled} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required disabled={disabled} />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required disabled={disabled} />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required disabled={disabled} />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} disabled={disabled} />
            <button className="submit" type="submit" disabled={disabled}>{form.id ? "Update" : "Add"}</button>
        </form>
    );
}

export default App;