import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

const importCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await api.post(`/campaigns/${id}/customers/csv`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchCampaign();
  } catch (err) {
    setError(err.response?.data?.error || "CSV import failed");
  }
};

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

      {campaign.stats && (
        <div>
          <h3>Stats</h3>
          <p>Total mails: {campaign.stats.total}</p>
          <p>Sent: {campaign.stats.sent}</p>
          <p>Failed: {campaign.stats.failed}</p>
          <p>Unique customers mailed: {campaign.stats.uniqueCount}</p>
        </div>
      )}

      <button onClick={deleteCampaign}>Delete Campaign</button>
      
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

      <h3>Import Customers via CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) importCsv(file);
        }}
      />

      <h2>Customers</h2>
      {campaign.customers.length === 0 ? (
        <p>No customers linked</p>
      ) : (
        <div>
          {campaign.customers.map((customer) => (
            <div key={customer.id} >
              <Link to={`/customers/${customer.id}`}>
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
              </Link>
              <button onClick={() => deleteCustomer(customer.id)}>...</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
