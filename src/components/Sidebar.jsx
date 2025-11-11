import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

import {
    CNavItem,
    CNavTitle,
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
} from "@coreui/react";

const Sidebar = () => {
    const SIDEBAR_WIDTH = 260;
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { visible } = useSidebar();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <CSidebar
            unfoldable={false}
            visible={visible}
            className={`transition-all duration-300 ${visible ? "translate-x-0" : "-translate-x-full"}`}
            style={{
                width: SIDEBAR_WIDTH,
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1050,
                backgroundColor: "#778899",
                color: "white",
                overflowY: "auto",
                transition: "transform 0.3s ease-in-out",
            }}
        >
            <CSidebarBrand
                className="d-flex align-items-center justify-content-center"
                style={{
                    height: 56,
                    color: "white",
                    fontFamily: "'Story Script', cursive",
                    fontSize: "1.4rem",
                }}
            >
                <strong>Petshop Zaman Now</strong>
            </CSidebarBrand>

            <CSidebarNav
                style={{
                    height: "calc(100vh - 56px)",
                    overflowY: "auto",
                    paddingTop: 8,
                }}
            >
                {/* Menu Umum */}
                <CNavItem>
                    <NavLink
                        to="/"
                        className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                    >
                        Home
                    </NavLink>
                </CNavItem>

                {/* Jika belum login */}
                {!user && (
                    <>
                        <CNavTitle>Guest</CNavTitle>
                        <CNavItem>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Register
                            </NavLink>
                        </CNavItem>
                        <CNavItem>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                Login
                            </NavLink>
                        </CNavItem>
                    </>
                )}

                {/* Jika sudah login */}
                {user && (
                    <>
                        <CNavTitle><strong>Menu</strong></CNavTitle>

                        {/* === ADMIN === */}
                        {user.role === "Admin" && (
                            <>
                                <CNavItem>
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/categories"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Categories
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/products"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Products
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/orders"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Orders
                                    </NavLink>
                                </CNavItem>
                            </>
                        )}

                        {/* === STAFF === */}
                        {user.role === "Staff" && (
                            <>
                                <CNavItem>
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/products"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Products
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/orders"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Orders
                                    </NavLink>
                                </CNavItem>
                            </>
                        )}

                        {/* === CUSTOMER === */}
                        {user.role === "Customer" && (
                            <>
                                <CNavItem>
                                    <NavLink
                                        to="/products"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Products
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/cart"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Cart
                                    </NavLink>
                                </CNavItem>
                                <CNavItem>
                                    <NavLink
                                        to="/orders"
                                        className={({ isActive }) =>
                                            "nav-link" + (isActive ? " active" : "")
                                        }
                                    >
                                        Orders
                                    </NavLink>
                                </CNavItem>
                            </>
                        )}

                        {/* === Logout === */}
                        <CNavTitle ><strong>Akun</strong></CNavTitle>
                        <CNavItem>
                            <button
                                className="btn btn-link nav-link text-start"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </CNavItem>
                    </>
                )}
            </CSidebarNav>
        </CSidebar>
    );
};

export default Sidebar;
