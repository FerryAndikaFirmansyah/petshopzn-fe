import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCategories, getProducts } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function ProductsCustomer() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [quantities, setQuantities] = useState({});
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    async function load() {
        setLoading(true);
        try {
            const data = await getProducts();
            const list = Array.isArray(data) ? data : data.data || [];
            setItems(list);
            setFilteredItems(list);
        } catch (err) {
            console.error("Gagal memuat produk:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error("Gagal memuat kategori:", err.message);
        }
    }

    useEffect(() => {
        load();
        loadCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId === "all") {
            setFilteredItems(items);
        } else {
            const filtered = items.filter(
                (p) =>
                    p.categoriesId === categoryId ||
                    p.categoryId === categoryId ||
                    p.category?.id === categoryId
            );
            setFilteredItems(filtered);
        }
    };

    const handleQtyChange = (productId, value) => {
        setQuantities({ ...quantities, [productId]: Number(value) });
    };

    const handleAddToCart = async (productId) => {
        const qty = quantities[productId] || 1;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${baseURL}/cart`,
                { productId, quantity: qty },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Produk ditambahkan ke keranjang!");
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
        }
    };

    return (
        <div>
            <h3>Daftar Produk</h3>
            <p>
                Anda login sebagai: <strong>{user?.name || user?.email}</strong>
            </p>

            {/* === FILTER BY CATEGORY === */}
            <div className="mb-3">
                <button
                    className={`btn btn-sm me-2 ${selectedCategory === "all" ? "btn-primary" : "btn-outline-primary"
                        }`}
                    onClick={() => handleCategoryClick("all")}
                >
                    Semua
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`btn btn-sm me-2 ${selectedCategory === cat.id ? "btn-primary" : "btn-outline-primary"
                            }`}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* === PRODUCT LIST === */}
            {loading ? (
                <div>Loading...</div>
            ) : filteredItems.length === 0 ? (
                <div className="text-muted">Tidak ada produk di kategori ini.</div>
            ) : (
                <div className="row">
                    {filteredItems.map((p) => (
                        <div className="col-md-3 mb-3" key={p.id}>
                            <div className="card h-100">
                                <img
                                    src={`${baseURL}/uploads/${p.image}`}
                                    alt={p.name}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h6 className="card-title">{p.name}</h6>
                                    <p className="text-muted small">
                                        {p.category?.name || "-"}
                                    </p>
                                    <p className="fw-bold">Rp {p.price.toLocaleString()}</p>

                                    <div className="input-group mb-2">
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={quantities[p.id] || 1}
                                            onChange={(e) => handleQtyChange(p.id, e.target.value)}
                                        />
                                        <span className="input-group-text">qty</span>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-success w-100"
                                        onClick={() => handleAddToCart(p.id)}
                                    >
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
