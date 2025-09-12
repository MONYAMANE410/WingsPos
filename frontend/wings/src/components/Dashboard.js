import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [salesCount, setSalesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, salesRes, customersRes] = await Promise.all([
        fetch("http://localhost:8000/api/products"),
        fetch("http://localhost:8000/api/sales"),
        fetch("http://localhost:8000/api/customers"),
      ]);

      const productsData = await productsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);

      const salesData = await salesRes.json();
      setSalesCount(Array.isArray(salesData) ? salesData.length : 0);

      const customersData = await customersRes.json();
      setCustomersCount(Array.isArray(customersData) ? customersData.length : 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Example function to post a new product
  const addProduct = async (product) => {
    try {
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const newProduct = await res.json();
      // Refresh products list after adding
      fetchData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (Number(p.quantity) || 0), 0);
  const lowStock = products.filter(p => p.quantity < 5);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card"><h2>{totalProducts}</h2><p>Total Products</p></div>
        <div className="card"><h2>{totalStock}</h2><p>Total Stock</p></div>
        <div className="card"><h2>{customersCount}</h2><p>Total Customers</p></div>
        <div className="card"><h2>{salesCount}</h2><p>Total Sales</p></div>
      </div>

      {lowStock.length > 0 && (
        <div className="warning">
          ⚠️ {lowStock.length} product(s) running low on stock!
        </div>
      )}

      {/* Example: Add a button to add a test product (optional) */}
      {/* <button
        onClick={() =>
          addProduct({
            name: "New Product",
            description: "Sample description",
            category: "Sample Category",
            price: 10.99,
            quantity: 10,
          })
        }
      >
        Add Sample Product
      </button> */}
    </div>
  );
}