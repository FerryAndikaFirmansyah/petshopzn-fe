import React from "react";
import { FaBars } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { visible, toggleSidebar } = useSidebar(); // ambil status sidebar

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top"
            style={{
                backgroundColor: "#778899",
                color: "white",
                transition: "all 0.3s ease",
                left: visible ? "260px" : "0",
                width: visible ? "calc(100% - 260px)" : "100%",
                zIndex: 1000,
            }}
        >
            <div className="container-fluid d-flex align-items-center justify-content-between px-4">
                <div className="d-flex align-items-center">
                    {/* Tombol toggle sidebar */}
                    <button
                        className="btn btn-outline-secondary me-3"
                        onClick={toggleSidebar}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#333",
                        }}
                    >
                        <FaBars size={22} />
                    </button>

                    <Link className="navbar-brand fw-bold brand-logo" to="/">
                        PetShop Zaman Now
                    </Link>
                </div>

                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">
                                        Register
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard">
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link">Hello, <strong>{user.name}</strong></span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
