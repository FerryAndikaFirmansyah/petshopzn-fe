import React, { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Categories() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            // assume API returns array or { data: [...] }
            setItems(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal memuat kategori");
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function startEdit(item) {
        setEditingId(item.id || item._id || item.uuid || item.name);
        setForm({ name: item.name || "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm({ name: "" });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateCategory(editingId, form);
            } else {
                await createCategory(form);
            }
            await load();
            cancelEdit();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal menyimpan kategori");
        }
        setSaving(false);
    }

    async function handleDelete(id) {
        if (!window.confirm("Hapus kategori ini?")) return;
        try {
            await deleteCategory(id);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal menghapus kategori");
        }
    }


    return (
        <div>
            <h3>Categories</h3>
            <p>Anda login sebagai: <strong>{user?.name || user?.email}</strong></p>

            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{editingId ? "Edit Category" : "Create Category"}</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={onSubmit} className="row g-2 align-items-end">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input name="name" className="form-control" value={form.name} onChange={onChange} required />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : (editingId ? 'Update' : 'Create')}</button>
                        </div>
                        {editingId && (
                            <div className="col-auto">
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">List Categories</h5>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center">No categories found</td>
                                        </tr>
                                    )}
                                    {items.map((it, idx) => (
                                        <tr key={it.id || it._id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>{it.name}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(it)}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(it.id || it._id || it.uuid || it.name)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}