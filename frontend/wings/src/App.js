// App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import CustomerManagement from "./components/CustomerManagement";
import SalesManagement from "./components/SalesManagement";
import StockManagement from "./components/StockManagement";

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("fetchProducts error", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("fetchCustomers error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Wings Cafe Logo" className="logo-img" />
          <div className="logo-text">Wings Cafe</div>
        </div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/sales">Sales</Link>
          <Link to="/customers">Customers</Link>
        </div>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/products"
            element={
              <ProductManagement
                products={products}
                fetchProducts={fetchProducts}
              />
            }
          />
          <Route
            path="/stock"
            element={
              <StockManagement products={products} fetchProducts={fetchProducts} />
            }
          />
          <Route
            path="/sales"
            element={
              <SalesManagement
                products={products}
                customers={customers}
                fetchProducts={fetchProducts}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <CustomerManagement
                customers={customers}
                fetchCustomers={fetchCustomers}
              />
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div>© {new Date().getFullYear()} Wings Cafe — Fresh & Tasty</div>
        <div className="footer-sub">Contact: info@wingscafe.com | Phone: +266 58847088</div>
      </footer>
    </div>
  );
}

export default App;