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
    <div>
      <h1>Send Campaign</h1>
      {status && <p>{status}</p>}

      <label>Campaign</label>
      <select
        value={selectedCampaign}
        onChange={(e) => setSelectedCampaign(e.target.value)}
      >
        <option value="">Select a campaign</option>
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br />
      <label>Subject</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <br />
      <label>Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />
      <button onClick={sendCampaign}>Send</button>
    </div>
  );
}
