import { useEffect, useState } from "react";
import api from "../services/api";

export default function MailingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to fetch campaigns");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const sendCampaign = async () => {
    if (!selectedCampaign || !subject || !message) {
      setStatus("All fields are required");
      return;
    }

    try {
      const res = await api.post("/mails/send", {
        campaignId: selectedCampaign,
        subject,
        message,
      });
      setStatus(`✅ Sent to ${res.data.sent} customers`);
      setSubject("");
      setMessage("");
      setSelectedCampaign("");
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to send campaign emails");
    }
  };

  return (
<div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-4">
  <h1 className="text-2xl font-bold mb-4">Send Campaign</h1>

  {status && (
    <p className="p-2 text-sm text-green-700 bg-green-100 rounded">{status}</p>
  )}

  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Campaign</label>
    <select
      value={selectedCampaign}
      onChange={(e) => setSelectedCampaign(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select a campaign</option>
      {campaigns.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  </div>

  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Subject</label>
    <input
      type="text"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Message</label>
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
    />
  </div>

  <button
    onClick={sendCampaign}
    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    Send
  </button>
</div>

  );
}
