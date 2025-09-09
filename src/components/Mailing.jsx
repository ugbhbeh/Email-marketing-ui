import { useEffect, useState } from "react";
import api from "../services/api";

export default function MailingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // AI helper states
  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);

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

  const askAi = async () => {
    if (!aiInput.trim()) return;

    setLoading(true);
    setAiReply("");

    try {
      const res = await api.post("/ai", {
        messages: [{ role: "user", content: aiInput }],
        tone,
      });
      setAiReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setAiReply("⚠️ Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3 bg-white rounded-xl shadow-md space-y-4">
      {status && (
        <p className="mb-2 text-sm text-green-700 bg-green-100 p-2 rounded">
          {status}
        </p>
      )}

      {/* --- Campaign mailing form --- */}
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
      {/* --- AI helper box --- */}
      <div className="border-t pt-3">
        <h3 className="text-sm font-semibold mb-2">AI Email Assistant</h3>
        <div className="flex gap-2 mb-2">
          <textarea
            placeholder="Ask AI to draft or refine an email..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-16"
          />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded-lg"
          >
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="informal">Informal</option>
          </select>
          <button
            onClick={askAi}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {aiReply && (
          <div className="p-2 text-sm border rounded-lg bg-gray-50 whitespace-pre-line space-y-2">
            <div>{aiReply}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setSubject(aiReply)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Use as Subject
              </button>
              <button
                onClick={() => setMessage(aiReply)}
                className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Use as Message
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
  );
}
