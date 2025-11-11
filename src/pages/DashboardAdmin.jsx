import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardAdmin() {
    const { user } = useAuth();
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [summary, setSummary] = useState({
        totalSales: 0,
        pendingOrders: 0,
        totalProducts: 0,
        lowStock: 0,
        totalCustomers: 0,
    });
    const [salesData, setSalesData] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
                axios.get(`${baseURL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const orders = ordersRes.data || [];
            const products = productsRes.data || [];
            const users = usersRes.data || [];
            const categories = categoriesRes.data || [];

            // === Hitung Summary ===
            const totalSales = orders
                .filter((o) => o.status === "Selesai")
                .reduce((sum, o) => sum + Number(o.total_price || 0), 0);
            const pendingOrders = orders.filter((o) => o.status === "Pending").length;
            const lowStock = products.filter((p) => p.stock < 5).length;
            const totalProducts = products.length;
            const totalCustomers = users.filter((u) => u.role === "Customer").length;

            setSummary({
                totalSales,
                pendingOrders,
                totalProducts,
                lowStock,
                totalCustomers,
            });

            // === Hitung Penjualan per Tanggal ===
            const salesMap = {};
            orders
                .filter((o) => o.status === "Selesai")
                .forEach((o) => {
                    const date = new Date(o.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                    });
                    salesMap[date] = (salesMap[date] || 0) + Number(o.total_price || 0);
                });
            const salesArray = Object.entries(salesMap).map(([date, total]) => ({
                date,
                total,
            }));
            setSalesData(salesArray);

            // === Hitung Kategori Terlaris ===
            const categorySales = {};
            orders.forEach((o) => {
                o.products?.forEach((p) => {
                    const catId = p.categoriesId || p.categoryId;
                    categorySales[catId] = (categorySales[catId] || 0) + Number(p.OrderItem?.quantity || 0);
                });
            });
            const categoryChart = categories
                .filter((c) => categorySales[c.id])
                .map((c) => ({
                    category: c.name,
                    sales: categorySales[c.id],
                }));
            setTopCategories(categoryChart);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4">
            <h3>Dashboard Admin</h3>
            <p>
                Selamat datang, <strong>{user?.name}</strong> 👋
            </p>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <>
                    {/* === Summary Cards === */}
                    <div className="row g-3 mb-4">
                        {[
                            { title: "Total Penjualan", value: `Rp ${summary.totalSales.toLocaleString()}`, color: "success" },
                            { title: "Pesanan Pending", value: summary.pendingOrders, color: "warning" },
                            { title: "Total Produk", value: summary.totalProducts, color: "primary" },
                            { title: "Stok Rendah", value: summary.lowStock, color: "danger" },
                            { title: "Total Customer", value: summary.totalCustomers, color: "info" },
                        ].map((card, i) => (
                            <div key={i} className="col-md-4 col-lg-2">
                                <div className={`card border-${card.color} shadow-sm`}>
                                    <div className="card-body text-center">
                                        <h6 className="text-muted">{card.title}</h6>
                                        <h5 className={`text-${card.color} fw-bold`}>{card.value}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* === Charts === */}
                    <div className="row g-4">
                        <div className="col-md-7">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6>Penjualan Harian</h6>
                                    {salesData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="total" stroke="#198754" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-muted text-center mt-3">Belum ada data penjualan.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6>Kategori Terlaris</h6>
                                    {topCategories.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={topCategories}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="category" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="sales" fill="#0d6efd" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-muted text-center mt-3">Belum ada data kategori.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
