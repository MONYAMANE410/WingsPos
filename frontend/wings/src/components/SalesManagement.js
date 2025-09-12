import React, { useState, useEffect } from "react";

export default function SalesManagement({ products, customers, fetchProducts }) {
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]); // Cart for multiple products
  const [sales, setSales] = useState([]); // All sales for display

  // Fetch existing sales on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  };

  const addToCart = () => {
    if (!productId || quantity < 1) {
      alert("Select product and valid quantity");
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      alert("Invalid product");
      return;
    }
    if (product.quantity < quantity) {
      alert("Not enough stock");
      return;
    }

    // Check if product already in cart
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing) {
      // Update quantity if already in cart
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { productId, quantity, name: product.name },
      ]);
    }
  };

  const recordSale = async () => {
    if (!customerId || cartItems.length === 0) {
      alert("Select customer and add items to cart");
      return;
    }

    // Final validation: check stock for each item
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        alert(`Not enough stock for ${product.name}`);
        return;
      }
    }

    // Prepare payload
    const itemsPayload = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Send sale to backend
    await fetch("http://localhost:8000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, items: itemsPayload }),
    });

    // Update stock for each product
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      await fetch(`http://localhost:8000/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: product.quantity - item.quantity }),
      });
    }

    // Clear cart
    setCartItems([]);
    setCustomerId("");
    await fetchProducts();
    await fetchSales();
    alert("Sale recorded!");
  };

  return (
    <div className="sales-pos-container" style={styles.container}>
      <h1 style={styles.header}>Point of Sale (POS)</h1>

      {/* Customer selection */}
      <div style={styles.row}>
        <label style={styles.label}>Customer:</label>
        <select
          style={styles.select}
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add items to cart */}
      <div style={styles.row}>
        <label style={styles.label}>Product:</label>
        <select
          style={styles.select}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (stock: {p.quantity})
            </option>
          ))}
        </select>

        <label style={styles.label}>Qty:</label>
        <input
          style={styles.input}
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />

        <button style={styles.button} onClick={addToCart}>
          Add to Cart
        </button>
      </div>

      {/* Cart preview */}
      {cartItems.length > 0 && (
        <div style={styles.cartContainer}>
          <h3>Cart Items:</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      style={styles.removeBtn}
                      onClick={() =>
                        setCartItems((prev) =>
                          prev.filter((i) => i.productId !== item.productId)
                        )
                      }
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record sale button */}
      <button style={styles.recordBtn} onClick={recordSale}>
        Record Sale
      </button>

      {/* Display all previous sales */}
      <h2 style={{ marginTop: 40 }}>Sales History</h2>
      {sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table style={styles.salesTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => {
              const customer = customers.find((c) => c.id === s.customerId);
              const itemsStr = s.items
                .map(
                  (i) =>
                    `${i.quantity} x ${
                      products.find((p) => p.id === i.productId)?.name || "Unknown"
                    }`
                )
                .join(", ");
              return (
                <tr key={s.id}>
                  <td>{customer ? customer.name : "Unknown"}</td>
                  <td>{new Date(s.date).toLocaleString()}</td>
                  <td>{itemsStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Inline styles for a good POS look
const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 28,
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  label: {
    width: 80,
    fontWeight: "bold",
  },
  select: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  input: {
    width: 80,
    padding: 8,
    fontSize: 16,
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  cartContainer: {
    marginTop: 20,
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  salesTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 15,
  },
  removeBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  recordBtn: {
    marginTop: 20,
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};