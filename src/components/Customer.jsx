import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [newCustomer, setNewCustomer] = useState({ email: "", name: "" });
  
  const navigate = useNavigate()

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
          <div key={cust.id} 
          onClick= {() => navigate(`/customers/${cust.id}`)}
          >
            <p>Email: {cust.email}</p>
             <p>Name: {cust.name}</p>
                </div>
               ))
            )}
        </div>
      );
}
