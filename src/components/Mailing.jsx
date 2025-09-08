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
   <div className="w-full p-3 bg-white rounded-xl shadow-md">
      {status && (
        <p className="mb-2 text-sm text-green-700 bg-green-100 p-2 rounded">
          {status}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
    
        <select
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a campaign</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-16"
        />
        <button
          onClick={sendCampaign}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
