import React, { useState, useEffect } from "react";

export default function ProductForm({ addProduct, updateProduct, productToEdit, cancelEdit }) {
  const [product, setProduct] = useState({ name: "", category: "", price: "", quantity: "" });

  useEffect(() => {
    if (productToEdit) setProduct(productToEdit);
  }, [productToEdit]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["price", "quantity"].includes(name)) value = value.replace(/[^0-9.]/g, "");
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.category || !product.price || !product.quantity) {
      alert("Please fill all fields");
      return;
    }
    if (productToEdit) updateProduct(product);
    else addProduct(product);

    setProduct({ name: "", category: "", price: "", quantity: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 15 }}>
      <input name="name" placeholder="Name" value={product.name} onChange={handleChange} />
      <input name="category" placeholder="Category" value={product.category} onChange={handleChange} />
      <input name="price" placeholder="Price" value={product.price} onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} />
      <button type="submit">{productToEdit ? "Update" : "Add"}</button>
      {productToEdit && <button type="button" onClick={cancelEdit}>Cancel</button>}
    </form>
  );
}
