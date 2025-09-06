import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [newCustomer, setNewCustomer] = useState({ email: "", name: "" });
  const navigate = useNavigate();

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold mb-2">Customer Overview</h3>
        <p className="text-lg">Total Customers: <b>{customers.length}</b></p>
      </div>


      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold mb-2">Add Single Customer</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            className="border p-2 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            className="border p-2 rounded w-1/3"
          />
          <button
            onClick={addCustomer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold mb-2">Import via CSV</h3>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) importCsv(file);
          }}
          className="border p-2 rounded"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-4">Customer List</h2>
        {customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <div className="grid gap-4">
            {customers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => navigate(`/customers/${cust.id}`)}
                className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              >
                <p><b>Name:</b> {cust.name || "N/A"}</p>
                <p><b>Email:</b> {cust.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
