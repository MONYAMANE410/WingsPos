// CustomerManagement.js
import React, { useState } from "react";

export default function CustomerManagement({ customers, fetchCustomers }) {
  const [form, setForm] = useState({ id: null, name: "", email: "", phone: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.name) { alert("Enter name"); return; }

    const payload = {
      name: form.name,
      email: form.email || "",
      phone: form.phone || ""
    };

    if (form.id) {
      // Update existing customer
      await fetch(`http://localhost:8000/api/customers/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Add new customer
      await fetch("http://localhost:8000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({ id: null, name: "", email: "", phone: "" });
    await fetchCustomers();
  };

  const edit = (c) => setForm({ id: c.id, name: c.name, email: c.email, phone: c.phone });

  const remove = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    await fetch(`http://localhost:8000/api/customers/${id}`, { method: "DELETE" });
    await fetchCustomers();
  };

  return (
    <div className="page">
      <h1>Customers</h1>
      <div className="form">
        <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        <button className="button" onClick={save}>{form.id ? "Update" : "Add"}</button>
      </div>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td className="row-actions">
                <button className="btn-edit" onClick={() => edit(c)}>Edit</button>
                <button className="btn-delete" onClick={() => remove(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}