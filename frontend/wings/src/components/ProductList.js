import React from "react";

export default function ProductList({ products, deleteProduct, editProduct }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Category</th><th>Price</th><th>Quantity</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr><td colSpan="5" style={{ textAlign: "center" }}>No products</td></tr>
        ) : (
          products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
