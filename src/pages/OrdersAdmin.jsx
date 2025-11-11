import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OrdersAdmin() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${baseURL}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error("Gagal memuat pesanan:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, status) {
        if (!window.confirm(`Ubah status pesanan ini menjadi "${status}"?`)) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${baseURL}/orders/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengubah status pesanan");
        }
    }

    function renderStatus(status) {
        const s = String(status || "Pending").toLowerCase();
        if (s === "pending") return <Badge bg="warning" text="dark">Pending</Badge>;
        if (s === "diproses") return <Badge bg="info" text="dark">Diproses</Badge>;
        if (s === "selesai") return <Badge bg="success">Selesai</Badge>;
        return <Badge bg="secondary">{status}</Badge>;
    }

    function openInvoice(id) {
        navigate(`/orders/${id}`);
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                <h3 className="mb-2">Kelola Pesanan</h3>
                <p className="mb-0 text-muted">
                    Login sebagai <strong>{user?.name}</strong> ({user?.role})
                </p>
            </div>

            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" />
                </div>
            ) : orders.length === 0 ? (
                <p className="text-muted text-center">Belum ada pesanan.</p>
            ) : (
                <div className="row g-3">
                    {orders.map((o) => {
                        const status = String(o.status || "Pending").toLowerCase();
                        return (
                            <div className="col-12 col-md-6 col-lg-4" key={o.id}>
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1">
                                                    <button
                                                        className="btn btn-link p-0 text-decoration-none text-primary fw-bold"
                                                        onClick={() => openInvoice(o.id)}
                                                    >
                                                        {o.invoice}
                                                    </button>
                                                </h6>
                                                <small className="text-muted">
                                                    {new Date(o.createdAt).toLocaleString("id-ID")}
                                                </small>
                                            </div>
                                            {renderStatus(o.status)}
                                        </div>

                                        <div className="mb-2">
                                            <p className="mb-1">
                                                <strong>Pelanggan:</strong> {o.user?.name || "Unknown"}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Alamat:</strong>{" "}
                                                <span className="text-muted">
                                                    {o.shipping_address?.length > 60
                                                        ? o.shipping_address.slice(0, 60) + "..."
                                                        : o.shipping_address || "-"}
                                                </span>
                                            </p>
                                            <p className="mb-1">
                                                <strong>Metode:</strong> {o.payment_method}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Total:</strong>{" "}
                                                <span className="text-success fw-bold">
                                                    Rp {Number(o.total_price).toLocaleString("id-ID")}
                                                </span>
                                            </p>
                                            <p className="mb-1">
                                                <strong>Qty:</strong> {o.total_qty}
                                            </p>
                                        </div>

                                        <div className="mt-3 d-flex gap-2 flex-wrap">
                                            {status === "pending" && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => updateStatus(o.id, "Diproses")}
                                                >
                                                    Tandai Diproses
                                                </Button>
                                            )}
                                            {status === "diproses" && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => updateStatus(o.id, "Selesai")}
                                                >
                                                    Tandai Selesai
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => openInvoice(o.id)}
                                            >
                                                Lihat Invoice
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
