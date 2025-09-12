const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

// Helper functions to read/write the database
const loadData = async () => {
  try {
    const data = await fs.readJson(DB_FILE);
    return data;
  } catch (err) {
    // If file doesn't exist or is invalid, initialize empty data
    return { products: [], customers: [], sales: [] };
  }
};

const saveData = async (data) => {
  await fs.writeJson(DB_FILE, data, { spaces: 2 });
};

// Utility function to generate unique IDs
const generateId = () => Date.now().toString();

let dataPromise = loadData(); // Load data once on server start

// Middleware to get current data
const getData = async () => {
  const data = await dataPromise;
  return data;
};

// ----------- PRODUCTS -----------

app.get("/api/products", async (req, res) => {
  const { products } = await getData();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const { products } = await getData();
  const product = products.find(p => p.id === req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
});

app.post("/api/products", async (req, res) => {
  const data = await getData();
  const newProduct = { id: generateId(), ...req.body };
  data.products.push(newProduct);
  await saveData(data);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", async (req, res) => {
  const data = await getData();
  const index = data.products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...req.body };
    await saveData(data);
    res.json(data.products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const data = await getData();
  data.products = data.products.filter(p => p.id !== req.params.id);
  await saveData(data);
  res.json({ message: "Product deleted" });
});

// ----------- CUSTOMERS -----------

app.get("/api/customers", async (req, res) => {
  const { customers } = await getData();
  res.json(customers);
});

app.get("/api/customers/:id", async (req, res) => {
  const { customers } = await getData();
  const customer = customers.find(c => c.id === req.params.id);
  if (customer) res.json(customer);
  else res.status(404).json({ message: "Customer not found" });
});

app.post("/api/customers", async (req, res) => {
  const data = await getData();
  const newCustomer = { id: generateId(), ...req.body };
  data.customers.push(newCustomer);
  await saveData(data);
  res.status(201).json(newCustomer);
});

app.put("/api/customers/:id", async (req, res) => {
  const data = await getData();
  const index = data.customers.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    data.customers[index] = { ...data.customers[index], ...req.body };
    await saveData(data);
    res.json(data.customers[index]);
  } else {
    res.status(404).json({ message: "Customer not found" });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  const data = await getData();
  data.customers = data.customers.filter(c => c.id !== req.params.id);
  await saveData(data);
  res.json({ message: "Customer deleted" });
});

// ----------- SALES -----------

app.get("/api/sales", async (req, res) => {
  const { sales } = await getData();
  res.json(sales);
});

app.post("/api/sales", async (req, res) => {
  const data = await getData();
  const { customerId, items, date } = req.body;

  // Validate customer
  const customerExists = data.customers.some(c => c.id === customerId);
  if (!customerExists) return res.status(400).json({ message: "Invalid customer" });

  // Validate items
  for (let item of items) {
    const product = data.products.find(p => p.id === item.productId);
    if (!product) return res.status(400).json({ message: "Invalid product in items" });
    if (product.quantity < item.quantity)
      return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
  }

  // Deduct stock
  for (let item of items) {
    const product = data.products.find(p => p.id === item.productId);
    product.quantity -= item.quantity;
  }

  const newSale = {
    id: generateId(),
    customerId,
    items,
    date: date || new Date().toISOString()
  };
  data.sales.push(newSale);
  await saveData(data);
  res.status(201).json(newSale);
});

app.delete("/api/sales/:id", async (req, res) => {
  const data = await getData();
  data.sales = data.sales.filter(s => s.id !== req.params.id);
  await saveData(data);
  res.json({ message: "Sale deleted" });
});

// ----------- SERVER -----------

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});