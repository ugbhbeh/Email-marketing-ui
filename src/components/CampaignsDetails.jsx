import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

const fetchAllCustomers = async () => {
  try {
    const res = await api.get("/customers"); 
    setAllCustomers(res.data);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to fetch customers");
  }
};


  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchCampaign();
  fetchAllCustomers();
}, [id]);


  const deleteCampaign = async () => {
    try {
      await api.delete(`/campaigns/${id}`);
      navigate("/campaigns");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete campaign");
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await api.delete(`/campaigns/${id}/customers/${customerId}`);
      fetchCampaign(); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove customer");
    }
  };
// Add existing customers to campaign
const addCustomersToCampaign = async () => {
  if (selectedCustomerIds.length === 0) return;
  try {
    await api.post(`/campaigns/${id}/customers`, {
      customerIds: selectedCustomerIds,
    });
    setSelectedCustomerIds([]);
    fetchCampaign();
  } catch (err) {
    setError(err.response?.data?.error || "Failed to add customers");
  }
};

// CSV import (expects already-parsed clients array)
const importCsv = async (clients) => {
  try {
    await api.post(`/campaigns/${id}/customers/csv`, { clients });
    fetchCampaign();
  } catch (err) {
    setError(err.response?.data?.error || "CSV import failed");
  }
};

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!campaign) return <p>No campaign found.</p>;

  return (
    <div>
      <h1>Campaign Details</h1>
      <p>ID: {campaign.id}</p>
      <p>Name: {campaign.name}</p>
      <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
      <p>Updated: {new Date(campaign.updatedAt).toLocaleDateString()}</p>

      <button onClick={deleteCampaign}>Delete Campaign</button>
        {/* Add customers from dropdown */}
        <h3>Add Existing Customers</h3>
        <select
        multiple
        value={selectedCustomerIds}
        onChange={(e) =>
            setSelectedCustomerIds(
            Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
        }
        >
        {allCustomers.map((cust) => (
            <option key={cust.id} value={cust.id}>
            {cust.name} ({cust.email})
            </option>
        ))}
        </select>
        <button onClick={addCustomersToCampaign}>Add Selected</button>

        {/* Mass CSV import */}
        <h3>Import Customers via CSV</h3>
        <input
        type="file"
        accept=".csv"
        onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const text = await file.text();
            // simple parsing: assume header row "name,email"
            const lines = text.split("\n").slice(1);
            const clients = lines
            .map((line) => line.split(","))
            .filter((row) => row.length >= 2 && row[0] && row[1])
            .map(([name, email]) => ({ name: name.trim(), email: email.trim() }));
            importCsv(clients);
        }}
        />

      <h2>Customers</h2>
      {campaign.customers.length === 0 ? (
        <p>No customers linked</p>
      ) : (
        <div>
          {campaign.customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid gray",
                padding: "8px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
              </div>
              <button onClick={() => deleteCustomer(customer.id)}>...</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
