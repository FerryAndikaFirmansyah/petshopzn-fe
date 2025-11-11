import { cilLockLocked, cilPhone, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { register } from "../api/api";
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        roleIds: [3] // default role user
    });

    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        // Validasi sederhana
        if (form.password !== form.password_confirmation) {
            setError('Password do not match');
            return;
        }

        if (!/^[0-9]{10,15}$/.test(form.phone)) {
            setError('Please enter a valid phone number (10-15 digits)');
            return;
        }

        setLoading(true);
        try {
            const data = await register(form);
            const token = data.token;
            const userData = data.user;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
            }

            // login otomatis setelah register
            await login({ email: form.email, password: form.password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="mx-4 shadow-sm">
                            <CCardBody className="p-4">
                                <CForm onSubmit={onSubmit}>
                                    <h1>Register</h1>
                                    <p className="text-body-secondary">Create your account</p>

                                    {error && <CAlert color="danger">{error}</CAlert>}

                                    {/* Full Name */}
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                                        <CFormInput
                                            name="name"
                                            placeholder="Full Name"
                                            autoComplete="name"
                                            value={form.name}
                                            onChange={onChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Email */}
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>@</CInputGroupText>
                                        <CFormInput
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={onChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Phone */}
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                                        <CFormInput
                                            name="phone"
                                            type="tel"
                                            placeholder="Phone Number"
                                            autoComplete="tel"
                                            value={form.phone}
                                            onChange={onChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Password */}
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                                        <CFormInput
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            value={form.password}
                                            onChange={onChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Confirm Password */}
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                                        <CFormInput
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Confirm Password"
                                            autoComplete="new-password"
                                            value={form.password_confirmation}
                                            onChange={onChange}
                                            required
                                        />
                                    </CInputGroup>

                                    <div className="d-grid">
                                        <CButton color="primary" type="submit" disabled={loading}>
                                            {loading ? "Registering..." : "Create Account"}
                                        </CButton>
                                    </div>
                                </CForm>

                                <div className="text-center mt-3">
                                    Already have an account?{' '}
                                    <a href="/login">Login</a>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
}
