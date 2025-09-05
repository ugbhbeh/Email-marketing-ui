import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  if (error) return <p>{error}</p>;
  if (!customer) return <p>Loading...</p>;

  return (
    <div>
      <h1>Customer Details</h1>

      {isEditing ? (
        <div>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          />
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <button onClick={updateCustomer}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Email:</b> {customer.email}</p>
          <p><b>Created:</b> {new Date(customer.createdAt).toLocaleString()}</p>
          <button
            onClick={() => {
              setEditData({ email: customer.email, name: customer.name || "" });
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button onClick={deleteCustomer}>Delete</button>
        </div>
      )}

      <h2>Stats</h2>
      <ul>
        <li>Total Mails: {customer.stats.totalMails}</li>
        <li>Sent: {customer.stats.sentCount}</li>
        <li>Failed: {customer.stats.failedCount}</li>
        <li>
          Last Mail:{" "}
          {customer.stats.lastMail
            ? new Date(customer.stats.lastMail).toLocaleString()
            : "None"}
        </li>
      </ul>

      <h2>Campaigns</h2>
      {customer.campaigns.length === 0 ? (
        <p>Not in any campaigns</p>
      ) : (
        <ul>
          {customer.campaigns.map((c, idx) => (
            <li key={idx}>{c.name}</li>
          ))}
        </ul>
      )}

      <h2>Mail History</h2>
      {customer.mailHistory.length === 0 ? (
        <p>No mail history</p>
      ) : (
        <ul>
          {customer.mailHistory.map((m, idx) => (
            <li key={idx}>
              <b>{m.subject}</b> – {m.status} –{" "}
              {new Date(m.sentAt).toLocaleString()} (Campaign {m.campaignId})
              {m.error && <p>Error: {m.error}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
