import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const endpoint =
                    user?.role === "Admin" || user?.role === "Staff"
                        ? `${baseURL}/orders/${id}`
                        : `${baseURL}/orders/my-orders/${id}`;

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOrder(res.data.data || res.data);
            } catch (err) {
                console.error("Error fetching order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token]);

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" />
            </div>
        );

    if (!order)
        return (
            <div className="text-center mt-5">
                <p className="text-muted">Order tidak ditemukan.</p>
                <Link to="/orders" className="btn btn-outline-primary">
                    Kembali
                </Link>
            </div>
        );

    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                        <h4 className="mb-2">Detail Pesanan</h4>
                        <Link to="/orders" className="btn btn-sm btn-outline-secondary">
                            Kembali
                        </Link>
                    </div>

                    <div className="mb-3">
                        <p> <strong>Invoice:</strong> {order.invoice} </p>
                        <p> <strong>Pelanggan:</strong>{" "} {order.user?.name || "Tidak diketahui"} </p>
                        <p> <strong>Tanggal:</strong>{" "} {new Date(order.createdAt).toLocaleString("id-ID")} </p>
                        <p> <strong>Metode Pembayaran:</strong> {order.payment_method} </p>
                        <p> <strong>Alamat Pengiriman:</strong> {order.shipping_address} </p>
                        <p> <strong>Total Item:</strong> {order.total_qty} </p>
                        <p> <strong>Total Harga:</strong>{" "} Rp {Number(order.total_price).toLocaleString("id-ID")} </p>
                    </div>

                    <h5 className="mt-4 mb-2">Daftar Item</h5>
                    <Table bordered hover responsive className="align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.product?.name || "-"}</td>
                                        <td>
                                            Rp{" "}
                                            {item.product?.price
                                                ? Number(item.product.price).toLocaleString("id-ID")
                                                : 0}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            Rp{" "}
                                            {item.subtotal
                                                ? Number(item.subtotal).toLocaleString("id-ID")
                                                : 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        Tidak ada item untuk pesanan ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default OrderDetail;
