// StockManagement.js
import React from "react";

export default function StockManagement({ products, fetchProducts }) {
  const inc = async (p) => {
    await fetch(`http://localhost:8000/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: p.quantity + 1 }),
    });
    fetchProducts();
  };

  const dec = async (p) => {
    const newQty = Math.max(0, p.quantity - 1);
    await fetch(`http://localhost:8000/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchProducts();
  };

  return (
    <div className="page">
      <h1>Stock</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => inc(p)}>+1</button>
                  <button onClick={() => dec(p)}>-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}