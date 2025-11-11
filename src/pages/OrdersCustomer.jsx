import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function OrdersCustomer() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        fetchOrders();
    }, []);

    // 🔹 Ambil pesanan milik customer login
    async function fetchOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${baseURL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error("Gagal memuat pesanan:", err.message);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Format status jadi label berwarna
    function renderStatus(status) {
        let cls = "badge bg-secondary";
        if (status === "Pending") cls = "badge bg-warning text-dark";
        else if (status === "Diproses") cls = "badge bg-info text-dark";
        else if (status === "Selesai") cls = "badge bg-success";
        return <span className={cls}>{status}</span>;
    }

    return (
        <div className="container mt-4">
            <h3>Riwayat Pesanan Saya</h3>
            <p>
                Anda login sebagai: <strong>{user?.name}</strong>
            </p>

            {loading ? (
                <p>Memuat data...</p>
            ) : orders.length === 0 ? (
                <p className="text-muted">Belum ada pesanan.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Invoice</th>
                                <th>Metode Pembayaran</th>
                                <th>Total Harga</th>
                                <th>Total Barang</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td>
                                        <Link to={`/orders/${o.id}`} className="text-decoration-none">
                                            {o.invoice}
                                        </Link>
                                    </td>
                                    <td>{o.payment_method}</td>
                                    <td>Rp {Number(o.total_price).toLocaleString()}</td>
                                    <td>{o.total_qty}</td>
                                    <td>{renderStatus(o.status)}</td>
                                    <td>
                                        {new Date(o.createdAt).toLocaleString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
