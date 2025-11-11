import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow
} from '@coreui/react';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
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
        setLoading(true);

        const result = await login(form);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || "Login failed");
        }
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            {/* Kartu Form Login */}
                            <CCard className="p-4 shadow-sm">
                                <CCardBody>
                                    <CForm onSubmit={onSubmit}>
                                        <h1>Login</h1>
                                        <p className="text-body-secondary">Sign In to your account</p>

                                        {error && <CAlert color="danger">{error}</CAlert>}

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
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

                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                value={form.password}
                                                onChange={onChange}
                                                required
                                            />
                                        </CInputGroup>

                                        <CRow>
                                            <CCol xs={6}>
                                                <CButton color="primary" type="submit" className="px-4" disabled={loading}>
                                                    {loading ? "Logging in..." : "Login"}
                                                </CButton>
                                            </CCol>
                                            <CCol xs={6} className="text-end">
                                                <CButton color="link" className="px-0">
                                                    Forgot password?
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>

                            {/* Kartu Info Kanan */}
                            <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                                <CCardBody className="text-center">
                                    <div>
                                        <h2>Sign up</h2>
                                        <p>
                                            Create your account and start managing your pets with ease.
                                        </p>
                                        <Link to="/register">
                                            <CButton color="dark" className="mt-3" active tabIndex={-1}>
                                                Register Now!
                                            </CButton>
                                        </Link>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default Login;
