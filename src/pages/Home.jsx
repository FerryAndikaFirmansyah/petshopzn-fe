import axios from "axios"; // 🔹 langsung pakai axios untuk endpoint publik
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        setError(null);
        try {
            // 🔹 ambil dari endpoint publik, tanpa token
            const res = await axios.get(`${baseURL}/products/public`);
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            setProducts(data.slice(0, 4)); // tampilkan 4 produk terbaru
        } catch (err) {
            console.error("Gagal memuat produk:", err.message);
            setError("Tidak dapat memuat produk. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home-page">
            {/* === HERO SECTION === */}
            <section
                className="hero-section text-center text-white d-flex flex-column justify-content-center align-items-center"
                style={{
                    background:
                        "linear-gradient(135deg, #B0C4DE 0%, #778899 100%)",
                    minHeight: "60vh",
                    padding: "60px 20px",
                }}
            >
                <h1 className="fw-bold mb-3">
                    Selamat Datang di Pet Shop Zaman Now
                </h1>
                <p className="lead mb-4" style={{ maxWidth: "600px" }}>
                    Belanja kebutuhan Anda dengan mudah dan cepat. Kelola
                    produk, pesanan, dan pelanggan dalam satu sistem yang
                    efisien.
                </p>
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <Link
                        to="/login"
                        className="btn btn-light px-4 fw-semibold"
                    >
                        Masuk
                    </Link>
                    <Link
                        to="/register"
                        className="btn btn-outline-light px-4 fw-semibold"
                    >
                        Daftar
                    </Link>
                    <Link
                        to="/products"
                        className="btn btn-warning px-4 fw-semibold text-dark"
                    >
                        Lihat Produk
                    </Link>
                </div>
            </section>

            {/* === FITUR UNGGULAN === */}
            <section className="container text-center mt-5 mb-5">
                <h3 className="fw-bold mb-4">Fitur Unggulan Kami</h3>
                <div className="row g-4">
                    {[
                        {
                            icon: "bi-box-seam",
                            title: "Manajemen Produk",
                            desc: "Kelola stok, kategori, dan harga produk dengan mudah.",
                        },
                        {
                            icon: "bi-cart-check",
                            title: "Pemesanan Otomatis",
                            desc: "Pesanan pelanggan langsung tersimpan dan bisa dilacak.",
                        },
                        {
                            icon: "bi-people",
                            title: "Kelola Pengguna",
                            desc: "Hubungkan Admin dan Customer dalam satu platform.",
                        },
                        {
                            icon: "bi-credit-card",
                            title: "Pembayaran Mudah",
                            desc: "Mendukung transfer, COD, dan e-wallet populer.",
                        },
                    ].map((f, i) => (
                        <div className="col-md-3 col-sm-6" key={i}>
                            <div
                                className="card border-0 shadow-sm h-100 p-3 feature-card"
                                style={{
                                    transition: "all 0.3s ease",
                                    borderRadius: "15px",
                                }}
                            >
                                <div className="card-body">
                                    <i
                                        className={`${f.icon} display-5 text-primary mb-3`}
                                        style={{ fontSize: "3rem" }}
                                    ></i>
                                    <h5 className="fw-semibold">{f.title}</h5>
                                    <p className="text-muted small mt-2">
                                        {f.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* === PRODUK TERBARU === */}
            <section className="container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fw-bold">Produk Terbaru</h3>
                    <Link
                        to="/products"
                        className="text-decoration-none text-primary fw-semibold"
                    >
                        Lihat Semua →
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-muted">Memuat produk...</p>
                ) : error ? (
                    <p className="text-center text-danger">{error}</p>
                ) : (
                    <div className="row g-4">
                        {products.length === 0 ? (
                            <p className="text-muted text-center">
                                Belum ada produk.
                            </p>
                        ) : (
                            products.map((p) => (
                                <div
                                    className="col-md-3 col-sm-6"
                                    key={p.id}
                                >
                                    <div
                                        className="card shadow-sm border-0 h-100"
                                        style={{
                                            borderRadius: "15px",
                                            transition:
                                                "transform 0.3s ease, box-shadow 0.3s ease",
                                        }}
                                    >
                                        <div className="position-relative">
                                            <img
                                                src={
                                                    p.image
                                                        ? `${baseURL}/uploads/${p.image}`
                                                        : "/no-image.png"
                                                }
                                                alt={p.name}
                                                className="card-img-top"
                                                style={{
                                                    height: "180px",
                                                    objectFit: "cover",
                                                    borderTopLeftRadius:
                                                        "15px",
                                                    borderTopRightRadius:
                                                        "15px",
                                                }}
                                            />
                                        </div>
                                        <div className="card-body text-center">
                                            <h6 className="fw-semibold">
                                                {p.name}
                                            </h6>
                                            <p className="text-muted mb-0">
                                                Rp{" "}
                                                {Number(
                                                    p.price
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* === FOOTER === */}
            <footer
                className="text-center text-muted py-4"
                style={{
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <p className="mb-0 small">
                    &copy; {new Date().getFullYear()} Pet Shop Zaman Now — Get
                    All Yours Pets Needed.
                </p>
            </footer>
        </div>
    );
}
