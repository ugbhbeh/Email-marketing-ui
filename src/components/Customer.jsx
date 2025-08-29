import { useEffect, useState } from "react";
import api from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [newCustomer, setNewCustomer] = useState({ email: "", name: "" });
  const [menuOpen, setMenuOpen] = useState(null); // which customer menu is open
  const [editingCustomer, setEditingCustomer] = useState(null); // customer being edited
  const [editData, setEditData] = useState({ email: "", name: "" });

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    try {
      await api.post("/customers/single", newCustomer);
      setNewCustomer({ email: "", name: "" });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add customer");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete customer");
    }
  };

  const updateCustomer = async (id) => {
    try {
      await api.put(`/customers/${id}`, editData);
      setEditingCustomer(null);
      setEditData({ email: "", name: "" });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update customer");
    }
  };

  const importCsv = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/customers/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || "CSV import failed");
    }
  };

  return (
    <div>
      <h1>Customers</h1>
      {error && <p>{error}</p>}

      <h3>Add Single Customer</h3>
      <input
        type="email"
        placeholder="Email"
        value={newCustomer.email}
        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Name"
        value={newCustomer.name}
        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
      />
      <button onClick={addCustomer}>Add</button>

      <h3>Import via CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) importCsv(file);
        }}
      />

      <h2>Customer List</h2>
      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        customers.map((cust) => (
          <div key={cust.id} style={{ marginBottom: "10px" }}>
            {editingCustomer === cust.id ? (
              <div>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <button onClick={() => updateCustomer(cust.id)}>Save</button>
                <button onClick={() => setEditingCustomer(null)}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p>Email: {cust.email}</p>
                  <p>Name: {cust.name}</p>
                </div>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setMenuOpen(menuOpen === cust.id ? null : cust.id)}>
                    ⋮
                  </button>
                  {menuOpen === cust.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        border: "1px solid gray",
                        background: "white",
                        padding: "5px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingCustomer(cust.id);
                          setEditData({ email: cust.email, name: cust.name || "" });
                          setMenuOpen(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteCustomer(cust.id);
                          setMenuOpen(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
