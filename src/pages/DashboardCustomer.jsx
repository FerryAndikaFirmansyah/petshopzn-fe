import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardCustomer() {
    const { user } = useAuth();
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${baseURL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }

    const totalSpent = orders
        .filter((o) => o.status === "Selesai")
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

    const pending = orders.filter((o) => o.status === "Pending").length;

    return (
        <div className="container mt-4">
            <h3>Dashboard Customer</h3>
            <p>
                Halo, <strong>{user?.name}</strong> 👋 <br />
                Berikut ringkasan akun kamu.
            </p>

            {/* === Summary Cards === */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-success shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Total Belanja</h6>
                            <h5 className="text-success fw-bold">
                                Rp {totalSpent.toLocaleString()}
                            </h5>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-primary shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Jumlah Pesanan</h6>
                            <h5 className="text-primary fw-bold">{orders.length}</h5>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-warning shadow-sm text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Menunggu Konfirmasi</h6>
                            <h5 className="text-warning fw-bold">{pending}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* === Order List === */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5>Pesanan Terbaru</h5>
                    {loading ? (
                        <p>Memuat data...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-muted">Belum ada pesanan.</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {orders.slice(0, 5).map((o) => (
                                <li
                                    key={o.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{o.invoice}</strong> <br />
                                        <small>{new Date(o.createdAt).toLocaleString("id-ID")}</small>
                                    </div>
                                    <div className="text-end">
                                        <span
                                            className={`badge ${o.status === "Selesai"
                                                    ? "bg-success"
                                                    : o.status === "Diproses"
                                                        ? "bg-info text-dark"
                                                        : "bg-warning text-dark"
                                                }`}
                                        >
                                            {o.status}
                                        </span>
                                        <br />
                                        <Link to={`/orders/${o.id}`} className="small text-primary">
                                            Lihat detail
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
