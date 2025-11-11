import axios from "axios";

const api = axios.create({
    baseURL: 'petshopzn-be2-production.up.railway.app',
    headers: {
        'Content-Type': 'application/json'
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//untuk auth login logout register
export async function register(payload) {
    const res = await api.post('/auth/register', payload)
    return res.data;
}

export async function login(payload) {
    const res = await api.post('/auth/login', payload)
    return res.data;
}

export async function logout(payload) {
    const res = await api.post('/auth/logout', payload)
    return res.data;
}

//crud untuk categories
export async function getCategories(params = {}) {
    const res = await api.get("/categories", { params });
    return res.data;
}

export async function getCategory(id) {
    const res = await api.get(`/categories/${id}`);
    return res.data;
}

export async function createCategory(payload) {
    const res = await api.post(`/categories`, payload);
    return res.data;
}

export async function updateCategory(id, payload) {
    const res = await api.put(`/categories/${id}`, payload);
    return res.data;
}

export async function deleteCategory(id) {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
}

//crud untuk products
// Products CRUD
export async function getProducts(params = {}) {
    const res = await api.get("/products", { params });
    return res.data;
}

export async function getProduct(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
}

export async function createProduct(formData) {
    const res = await api.post(`/products`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export async function updateProduct(id, formData) {
    const res = await api.put(`/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export async function deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
}

//cart atau keranjang
export async function getCart(params = {}) {
    const res = await api.get("/cart", { params });
    return res.data;
}

export async function getCartById(id) {
    const res = await api.get(`/cart/${id}`);
    return res.data;
}

export async function createCart(payload) {
    const res = await api.post(`/cart`, payload);
    return res.data;
}

export async function updateCart(id, payload) {
    const res = await api.put(`/cart/${id}`, payload);
    return res.data;
}

export async function deleteCart(id) {
    const res = await api.delete(`/cart/${id}`);
    return res.data;
}

//orders
export async function getOrders(params = {}) {
    const res = await api.get("/orders", { params });
    return res.data;
}

export async function getOrder(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
}

export async function createOrder(payload) {
    const res = await api.post(`/orders`, payload);
    return res.data;
}

export async function updateOrder(id, payload) {
    const res = await api.put(`/orders/${id}`, payload);
    return res.data;
}

export async function deleteOrder(id) {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
}
//order_items
export async function getOrderItem(params = {}) {
    const res = await api.get("/order_items", { params });
    return res.data;
}

export default api;
