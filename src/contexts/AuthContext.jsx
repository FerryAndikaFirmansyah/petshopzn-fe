import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user')
        return raw ? JSON.parse(raw) : null;
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    }, [user])

    async function login(credentials) {
        setLoading(true)
        try {
            const data = await apiLogin(credentials);
            const token = data.token;
            const userData = data.user;
            if (token) {
                localStorage.setItem('token', token);
            }
            setUser(userData);
            console.log(userData);

            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            return { success: false, message: err.response?.data?.message || err.message }
        }
    }

    async function performLogout() {
        setLoading(true);
        try {
            await apiLogout();
        } catch (err) {
            console.error('Logout failed', err);
        }
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout: performLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}