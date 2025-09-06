import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";
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

  // Chart Data
  const mailStats = campaign.stats
    ? [
        { name: "Sent", value: campaign.stats.sent },
        { name: "Failed", value: campaign.stats.failed },
        { name: "Total", value: campaign.stats.total },
      ]
    : [];

  const customerStats = [
    { name: "Unique Customers", value: campaign.stats?.uniqueCount || 0 },
    { name: "Total Customers", value: campaign.customers?.length || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Campaign Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Info */}
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p><strong>ID:</strong> {campaign.id}</p>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Created:</strong> {new Date(campaign.createdAt).toLocaleDateString()}</p>
          <p><strong>Updated:</strong> {new Date(campaign.updatedAt).toLocaleDateString()}</p>
          <button
            onClick={deleteCampaign}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Campaign
          </button>
        </div>

        {/* Mail Stats Pie */}
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">Mail Stats</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mailStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#82ca9d" />
                <Cell fill="#ff6b6b" />
                <Cell fill="#8884d8" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Stats Bar */}
        <div className="p-4 border rounded-lg shadow bg-white col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Customer Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Customers */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="font-semibold">Add Existing Customers</h3>
        <select
          multiple
          className="border p-2 w-full mt-2"
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
        <button
          onClick={addCustomersToCampaign}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Selected
        </button>
      </div>

      {/* CSV Import */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="font-semibold">Import Customers via CSV</h3>
        <input
          type="file"
          accept=".csv"
          className="mt-2"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) importCsv(file);
          }}
        />
      </div>

      {/* Customers */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Customers</h2>
        {campaign.customers?.length === 0 ? (
          <p>No customers linked</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.customers.map((customer) => (
              <div
                key={customer.id}
                className="p-3 border rounded shadow hover:bg-gray-50"
              >
                <Link to={`/customers/${customer.id}`}>
                  <p><strong>Name:</strong> {customer.name}</p>
                  <p><strong>Email:</strong> {customer.email}</p>
                </Link>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
