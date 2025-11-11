import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Categories from "./components/Categories";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./contexts/AuthContext";
import { useSidebar } from "./contexts/SidebarContext";
import Cart from "./pages/Cart";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCustomer from "./pages/DashboardCustomer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrderDetail from "./pages/OrderDetail";
import OrdersAdmin from "./pages/OrdersAdmin";
import OrdersCustomer from "./pages/OrdersCustomer";
import ProductsCustomer from "./pages/ProductCustomer";
import ProductsAdmin from "./pages/Products";
import Register from "./pages/Register";
import "./styles/theme.css";

export default function App() {
  const { visible, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const SIDEBAR_WIDTH = 260;
  const isMobile = window.innerWidth <= 992;

  // deteksi halaman login atau register
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Navbar & Sidebar hanya untuk halaman yang bukan login/register */}
      {!hideLayout && user && <Navbar />}
      {!hideLayout && user && <Sidebar />}

      {/* Overlay untuk sidebar di mobile */}
      {visible && user && !hideLayout && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1020,
            transition: "opacity 0.3s ease",
          }}
        ></div>
      )}

      {/* Konten utama */}
      <main
        className="main-content"
        style={{
          marginLeft:
            user && !hideLayout && !isMobile && visible
              ? `${SIDEBAR_WIDTH}px`
              : "0",
          transition: "margin-left 0.3s ease",
          paddingTop: hideLayout ? "0" : "90px",
          minHeight: "100vh",
          backgroundColor: hideLayout ? "#ffffff" : "#f8f9fa",
          display: "flex",
          justifyContent: hideLayout ? "center" : "center",
          alignItems: hideLayout ? "center" : "flex-start",
        }}
      >
        {/* Jika halaman login/register, tampilkan fullscreen */}
        {hideLayout ? (
          <div style={{ width: "100%", height: "100%" }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        ) : (
          <div
            className="content-wrapper"
            style={{
              width: "100%",
              maxWidth: "1200px",
              transition: "all 0.3s ease",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                minHeight: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />

                {/* Private */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      {user?.role === "Customer" ? (
                        <DashboardCustomer />
                      ) : (
                        <DashboardAdmin />
                      )}
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/categories"
                  element={
                    <PrivateRoute roles={["Admin", "Staff"]}>
                      <Categories />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <PrivateRoute>
                      {user?.role === "Customer" ? (
                        <ProductsCustomer />
                      ) : (
                        <ProductsAdmin />
                      )}
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <PrivateRoute roles={["Customer"]}>
                      <Cart />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      {user?.role === "Customer" ? (
                        <OrdersCustomer />
                      ) : (
                        <OrdersAdmin />
                      )}
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/orders/:id"
                  element={
                    <PrivateRoute>
                      <OrderDetail />
                    </PrivateRoute>
                  }
                />

                {/* Fallback */}
                <Route
                  path="*"
                  element={<Navigate to={user ? "/products" : "/login"} replace />}
                />
              </Routes>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
