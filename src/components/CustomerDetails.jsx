import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import api from "../services/api";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({ email: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        setCustomer(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch customer");
      }
    };
    fetchCustomer();
  }, [id]);

  const updateCustomer = async () => {
    try {
      await api.put(`/customers/${id}`, editData);
      setIsEditing(false);
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update customer");
    }
  };

  const deleteCustomer = async () => {
    try {
      await api.delete(`/customers/${id}`);
      navigate("/customers"); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete customer");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!customer) return <p>Loading...</p>;

 
  const mailStatsData = [
    { name: "Sent", value: customer.stats.sentCount },
    { name: "Failed", value: customer.stats.failedCount },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="p-4 border rounded-lg shadow bg-white">
        <h1 className="text-xl font-bold mb-4">Customer Details</h1>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="email"
              className="border rounded p-2 w-full"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <div className="space-x-2">
              <button
                onClick={updateCustomer}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <b>Name:</b> {customer.name}
            </p>
            <p>
              <b>Email:</b> {customer.email}
            </p>
            <p>
              <b>Created:</b> {new Date(customer.createdAt).toLocaleString()}
            </p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditData({
                    email: customer.email,
                    name: customer.name || "",
                  });
                  setIsEditing(true);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={deleteCustomer}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

     
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-lg font-semibold mb-2">Mail Stats</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={mailStatsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#1bb64aff" />
                <Cell fill="#e93205ff" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Total Mails: {customer.stats.totalMails} <br />
          Last Mail:{" "}
          {customer.stats.lastMail
            ? new Date(customer.stats.lastMail).toLocaleString()
            : "None"}
        </p>
      </div>

      <div className="p-4 border rounded-lg shadow bg-white col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Campaigns</h2>
        {customer.campaigns.length === 0 ? (
          <p className="text-gray-500">Not in any campaigns</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {customer.campaigns.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border rounded-lg shadow bg-white col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Mail History</h2>
        {customer.mailHistory.length === 0 ? (
          <p className="text-gray-500">No mail history</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Sent At</th>
                <th className="p-2 border">Campaign</th>
                <th className="p-2 border">Error</th>
              </tr>
            </thead>
            <tbody>
              {customer.mailHistory.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{m.subject}</td>
                  <td
                    className={`p-2 border ${
                      m.status === "SENT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {m.status}
                  </td>
                  <td className="p-2 border">
                    {new Date(m.sentAt).toLocaleString()}
                  </td>
                  <td className="p-2 border">{m.campaignId}</td>
                  <td className="p-2 border">{m.error || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}