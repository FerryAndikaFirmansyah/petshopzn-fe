import React, { useEffect, useState } from "react";
import {
    createProduct,
    deleteProduct,
    getCategories,
    getProducts,
    updateProduct,
} from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Products() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: 0,
        description: "",
        categoriesId: "",
        image: null,
    });
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // === LOAD PRODUCTS ===
    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setItems(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal memuat produk");
        } finally {
            setLoading(false);
        }
    }

    // === LOAD CATEGORIES ===
    async function loadCategories() {
        try {
            const data = await getCategories();
            const list = Array.isArray(data) ? data : data.data || [];
            setCategories(list);
        } catch (err) {
            console.warn("Failed to load categories", err);
        }
    }

    useEffect(() => {
        load();
        loadCategories();
    }, []);

    // === INPUT HANDLER ===
    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        }
    }

    // === EDIT PRODUCT ===
    function startEdit(item) {
        setEditingId(item.id);
        const categoriesId =
            item.category?.id ||
            item.categoryId ||
            item.categoriesId ||
            "";

        setForm({
            name: item.name || "",
            price: item.price ?? "",
            stock: item.stock ?? 0,
            description: item.description || "",
            categoriesId,
            image: null,
        });

        setPreview(item.image ? `${baseURL}/uploads/${item.image}` : null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm({
            name: "",
            price: "",
            stock: 0,
            description: "",
            categoriesId: "",
            image: null,
        });
        setPreview(null);
    }

    // === SUBMIT FORM (CREATE / UPDATE) ===
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!form.name?.trim()) return setError("Nama produk wajib diisi");
        if (!form.price) return setError("Harga wajib diisi");
        if (!form.categoriesId) return setError("Kategori wajib dipilih");

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("description", form.description);
        formData.append("categoriesId", form.categoriesId);
        if (form.image) formData.append("image", form.image);

        setSaving(true);
        try {
            if (editingId) {
                await updateProduct(editingId, formData, true);
            } else {
                await createProduct(formData, true);
            }
            await load();
            cancelEdit();
        } catch (err) {
            console.error("Save error:", err);
            setError(
                err.response?.data?.message || err.message || "Gagal menyimpan produk"
            );
        } finally {
            setSaving(false);
        }
    }

    // === DELETE PRODUCT ===
    async function handleDelete(id) {
        if (!window.confirm("Hapus produk ini?")) return;
        try {
            await deleteProduct(id);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal menghapus produk");
        }
    }

    // === RENDER CATEGORY NAME ===
    function renderCategoryName(it) {
        if (!it) return "-";
        if (it.category?.name) return it.category.name;
        const id = it.categoriesId || it.categoryId;
        const found = categories.find((c) => String(c.id) === String(id));
        return found ? found.name : "-";
    }

    return (
        <div>
            <h3>Products</h3>
            <p>
                Anda login sebagai: <strong>{user?.name || user?.email}</strong>
            </p>

            {/* === FORM === */}
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">
                        {editingId ? "Edit Product" : "Create Product"}
                    </h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={onSubmit} className="row g-2" noValidate>
                        <div className="col-md-3">
                            <label className="form-label">Name</label>
                            <input
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Price</label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                className="form-control"
                                value={form.price}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Stock</label>
                            <input
                                name="stock"
                                type="number"
                                min="0"
                                className="form-control"
                                value={form.stock}
                                onChange={onChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Category</label>
                            <select
                                name="categoriesId"
                                className="form-select"
                                value={form.categoriesId}
                                onChange={onChange}
                                required
                            >
                                <option value="">-- Pilih Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Description</label>
                            <input
                                name="description"
                                className="form-control"
                                value={form.description}
                                onChange={onChange}
                            />
                        </div>

                        <div className="col-md-4 mt-2">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="form-control"
                                onChange={onFileChange}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        marginTop: "8px",
                                        borderRadius: "10px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                            )}
                        </div>

                        <div className="col-12 d-flex gap-2 mt-3">
                            <button className="btn btn-primary" disabled={saving}>
                                {saving ? "Menyimpan..." : editingId ? "Update" : "Create"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* === LIST PRODUCT === */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Daftar Produk</h5>

                    {loading ? (
                        <div className="text-center py-5">Memuat data...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center text-muted py-4">Belum ada produk.</div>
                    ) : (
                        <div className="row g-3">
                            {items.map((it, idx) => (
                                <div className="col-12 col-md-6 col-lg-4" key={it.id || idx}>
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="position-relative">
                                            <img
                                                src={
                                                    it.image
                                                        ? `${baseURL}/uploads/${it.image}`
                                                        : "/no-image.png"
                                                }
                                                alt={it.name}
                                                className="card-img-top"
                                                style={{
                                                    height: "180px",
                                                    objectFit: "cover",
                                                    borderTopLeftRadius: "12px",
                                                    borderTopRightRadius: "12px",
                                                }}
                                            />
                                        </div>

                                        <div className="card-body">
                                            <h6 className="fw-bold mb-1">{it.name}</h6>
                                            <p className="text-success mb-1">
                                                Rp {Number(it.price).toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-muted small mb-1">
                                                Stok: <strong>{it.stock}</strong>
                                            </p>
                                            <p
                                                className="text-muted small"
                                                style={{
                                                    minHeight: "38px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {it.description || "-"}
                                            </p>

                                            <span className="badge bg-light text-dark border mb-2">
                                                {renderCategoryName(it)}
                                            </span>

                                            <div className="d-flex justify-content-between mt-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => startEdit(it)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(it.id)}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
