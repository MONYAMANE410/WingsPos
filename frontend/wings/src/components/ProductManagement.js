import React, { useState, useEffect } from "react";

// Component to display all products
function ProductList({ products, deleteProduct, editProduct }) {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <table border="1" cellPadding="5" style={{ width: "100%", marginTop: 20 }}>
      <thead>
        <tr>
          <th>Name</th><th>Description</th><th>Category</th><th>Price</th><th>Quantity</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>{p.category}</td>
            <td>{p.price}</td>
            <td>{p.quantity}</td>
            <td>
              <button onClick={() => editProduct(p)}>Edit</button>
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ProductManagement({ products, fetchProducts }) {
  const [productToEdit, setProductToEdit] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setQuantity(productToEdit.quantity);
    } else {
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setQuantity("");
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name": setName(value); break;
      case "description": setDescription(value); break;
      case "category": setCategory(value); break;
      case "price": setPrice(value); break;
      case "quantity": setQuantity(value); break;
      default: break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || !quantity) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    if (productToEdit) {
      await fetch(`http://localhost:8000/api/products/${productToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setProductToEdit(null);
    fetchProducts();
    setName(""); setDescription(""); setCategory(""); setPrice(""); setQuantity("");
  };

  const handleEdit = (product) => setProductToEdit(product);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:8000/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };
  const cancelEdit = () => {
    setProductToEdit(null);
    setName(""); setDescription(""); setCategory(""); setPrice(""); setQuantity("");
  };

  return (
    <div>
      <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 15 }}>
        <input name="name" placeholder="Name" value={name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={description} onChange={handleChange} />
        <input name="category" placeholder="Category" value={category} onChange={handleChange} />
        <input
          name="price"
          placeholder="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={handleChange}
        />
        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={handleChange}
        />
        <button type="submit">{productToEdit ? "Update" : "Add"}</button>
        {productToEdit && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      {/* Display all products */}
      <h2>Product List</h2>
      <ProductList
        products={products}
        deleteProduct={handleDelete}
        editProduct={handleEdit}
      />
    </div>
  );
}