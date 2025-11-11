import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [payment, setPayment] = useState("Transfer");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/cart`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCart(res.data || []);
        } catch (err) {
            console.error("Gagal memuat cart:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus item ini dari keranjang?")) return;
        try {
            await axios.delete(`${baseURL}/cart/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchCart();
        } catch (err) {
            console.error("Gagal menghapus item:", err.message);
        }
    };

    const handleQuantityChange = async (id, quantity) => {
        if (quantity <= 0) return;
        const token = localStorage.getItem("token");
        await axios.put(
            `${baseURL}/cart/${id}`,
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCart();
    };

    const handleCheckout = async () => {
        if (!address) return alert("Alamat wajib diisi!");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${baseURL}/cart/checkout`,
                { payment_method: payment, shipping_address: address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newOrder = res.data.order;
            alert("Checkout berhasil!");
            navigate(`/orders/${newOrder.id}`);
        } catch (err) {
            alert(err.response?.data?.message || "Checkout gagal");
        }
    };

    return (
        <CContainer className="mt-4">
            <h3 className="mb-3">🛒 Keranjang Belanja</h3>

            {loading ? (
                <div className="text-center text-muted">Memuat data...</div>
            ) : cart.length === 0 ? (
                <div className="text-center text-muted">Keranjang kamu kosong.</div>
            ) : (
                <CRow>
                    {cart.map((item) => (
                        <CCol xs="12" md="6" lg="4" key={item.id} className="mb-3">
                            <CCard>
                                <CCardBody>
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={`${baseURL}/uploads/${item.product.image}`}
                                            alt={item.product.name}
                                            className="me-3 rounded"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <div>
                                            <h6 className="mb-1">{item.product.name}</h6>
                                            <div className="fw-bold text-primary">
                                                Rp {item.product.price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control mb-2"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, e.target.value)
                                        }
                                    />

                                    <CButton
                                        color="danger"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash className="me-1" /> Hapus
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))}
                </CRow>
            )}

            {cart.length > 0 && (
                <div className="mt-4">
                    <label className="form-label">Alamat Pengiriman</label>
                    <textarea
                        className="form-control mb-3"
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>

                    <label className="form-label">Metode Pembayaran</label>
                    <div className="d-flex gap-3 mb-3">
                        {["Transfer", "COD", "E-Wallet"].map((m) => (
                            <div key={m}>
                                <input
                                    type="radio"
                                    id={m}
                                    name="payment"
                                    value={m}
                                    checked={payment === m}
                                    onChange={() => setPayment(m)}
                                />
                                <label htmlFor={m} className="ms-1">
                                    {m}
                                </label>
                            </div>
                        ))}
                    </div>

                    <CButton color="success" onClick={handleCheckout}>
                        Checkout Sekarang
                    </CButton>
                </div>
            )}
        </CContainer>
    );
};

export default Cart;
